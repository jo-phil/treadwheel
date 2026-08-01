import { decrypt, encrypt } from './cipher.js';
import { mint, solve } from './puzzle.js';
import type { Cipher, Envelope, JSONSerializable } from './types.js';

function encodeBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function decodeBase64Url(b64url: string): string {
  return atob(b64url.replace(/-/g, '+').replace(/_/g, '/'));
}

export async function sealFromPrimes(
  content: JSONSerializable,
  t: number,
  p: bigint,
  q: bigint,
): Promise<string> {
  const { puzzle, solution } = mint(p, q, t);

  let cipher: Cipher;
  try {
    cipher = await encrypt(content, solution);
  } finally {
    solution.fill(0);
  }

  const envelope: Envelope = { v: 1, ...puzzle, ...cipher };
  return encodeBase64Url(JSON.stringify(envelope));
}

export async function unseal(token: string): Promise<JSONSerializable> {
  const envelope: Envelope = JSON.parse(decodeBase64Url(token));
  const solution = solve(envelope);

  let content: JSONSerializable;
  try {
    content = await decrypt(envelope, solution);
  } finally {
    solution.fill(0);
  }
  return content;
}
