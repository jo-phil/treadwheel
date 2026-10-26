import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes, unsealFromBytes } from '../core/index.js';
import { bytesToBigInt } from '../core/io.js';
import type { SealOptions } from '../core/types.js';
import { base64UrlToBytes, bytesToBase64Url } from './codec.js';

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

  const keyPair = await globalThis.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: config.modulusLength,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: 'SHA-256',
    },
    true,
    ['decrypt'],
  );
  const jwk = await globalThis.crypto.subtle.exportKey(
    'jwk',
    keyPair.privateKey,
  );

  if (!jwk.p || !jwk.q) throw new Error('RSA JWK is missing primes p or q');
  const p = bytesToBigInt(base64UrlToBytes(jwk.p));
  const q = bytesToBigInt(base64UrlToBytes(jwk.q));

  return bytesToBase64Url(await sealFromPrimes(plaintext, p, q, config));
}

/**
 * Unseal an envelope by solving its time-lock puzzle.
 *
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unseal(envelope: string): Promise<string> {
  return unsealFromBytes(base64UrlToBytes(envelope));
}

/**
 * Unseal an envelope in a web worker.
 *
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unsealInWorker(envelope: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event) => {
      if (event.data.success) resolve(event.data.plaintext);
      else reject(event.data.error);
      worker.terminate();
    };

    worker.onerror = (errorEvent) => {
      errorEvent.preventDefault();
      reject(errorEvent.error ?? new Error(errorEvent.message));
      worker.terminate();
    };

    worker.postMessage(envelope);
  });
}
