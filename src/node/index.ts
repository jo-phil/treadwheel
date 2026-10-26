import crypto from 'node:crypto';
import { Worker } from 'node:worker_threads';

import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes, unsealFromBytes } from '../core/index.js';
import type { SealOptions, UnsealInWorkerOptions } from '../core/types.js';

export type { SealOptions };

function generatePrimeAsync(size: number): Promise<bigint> {
  return new Promise((resolve, reject) => {
    const callback = (err: Error | null, prime: bigint) => {
      if (err) reject(err);
      else resolve(prime);
    };

    crypto.generatePrime(size, { bigint: true }, callback);
  });
}

/**
 * Seal plaintext using a time-lock puzzle.
 *
 * @param plaintext - The plaintext to seal.
 * @param options - Optional configuration options.
 * @returns A Base64URL-encoded envelope.
 */
export async function seal(
  plaintext: string,
  options?: SealOptions,
): Promise<string> {
  const config = { ...SEAL_DEFAULTS, ...options };

  const pLength = Math.ceil(config.modulusLength / 2);
  const qLength = config.modulusLength - pLength;
  const [p, q] = await Promise.all([
    generatePrimeAsync(pLength),
    generatePrimeAsync(qLength),
  ]);

  const envelope = await sealFromPrimes(plaintext, p, q, config);
  return Buffer.from(envelope).toString('base64url');
}

/**
 * Unseal an envelope by solving its time-lock puzzle.
 *
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unseal(envelope: string): Promise<string> {
  return await unsealFromBytes(Buffer.from(envelope, 'base64url'));
}

/**
 * Unseal an envelope in a worker thread.
 *
 * @param envelope - A Base64URL-encoded envelope.
 * @param options - Optional configuration options.
 * @returns The decrypted plaintext.
 */
export async function unsealInWorker(
  envelope: string,
  options?: UnsealInWorkerOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (options?.signal?.aborted) return reject(options.signal.reason);
    options?.signal?.addEventListener('abort', handleAbort);

    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      workerData: envelope,
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      options?.signal?.removeEventListener('abort', handleAbort);
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });

    function handleAbort(event: Event) {
      reject((event.target as AbortSignal).reason);
      worker.terminate();
    }
  });
}
