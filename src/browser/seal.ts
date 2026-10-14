import { sealFromPrimes } from '../core/index.js';
import { bytesToBigInt } from '../core/puzzle.js';
import { base64UrlToBytes, bytesToBase64Url } from './codec.js';

export async function seal(plaintext: string, t: bigint): Promise<string> {
  const keyPair = await globalThis.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
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

  return bytesToBase64Url(await sealFromPrimes(plaintext, t, p, q));
}
