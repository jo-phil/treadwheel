import crypto from 'node:crypto';
import { Worker } from 'node:worker_threads';

import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes, unsealFromBytes } from '../core/index.js';
import type { SealOptions } from '../core/types.js';

export type { SealOptions };

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
  const p = crypto.generatePrimeSync(pLength, { bigint: true });
  const q = crypto.generatePrimeSync(qLength, { bigint: true });

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
  return unsealFromBytes(Buffer.from(envelope, 'base64url'));
}

/**
 * Unseal an envelope in a worker thread.
 *
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unsealInWorker(envelope: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const workerUrl = new URL('./worker.js', import.meta.url);
    const worker = new Worker(workerUrl);

    worker.on('message', (res) => {
      worker.terminate();
      if (res.success) resolve(res.plaintext);
      else reject(new Error(res.error));
    });

    worker.on('error', (err) => {
      worker.terminate();
      reject(err);
    });

    worker.postMessage(envelope);
  });
}
