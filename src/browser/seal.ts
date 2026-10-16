import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes } from '../core/index.js';
import { bytesToBigInt } from '../core/io.js';
import type { SealOptions } from '../core/types.js';
import { base64UrlToBytes, bytesToBase64Url } from './codec.js';

/**
 * Seal plaintext using a time-lock puzzle.
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
