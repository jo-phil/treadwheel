import { arrayToHex } from '../core/hex.js';
import { sealFromPrimes } from '../core/index.js';
import type { JSONSerializable } from '../core/types.js';

function base64UrlToBigInt(b64url: string): bigint {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const hex = arrayToHex(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
  return BigInt(`0x${hex}`);
}

export async function seal(
  content: JSONSerializable,
  squarings: number,
): Promise<string> {
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
  const p = base64UrlToBigInt(jwk.p);
  const q = base64UrlToBigInt(jwk.q);

  return sealFromPrimes(content, squarings, p, q);
}
