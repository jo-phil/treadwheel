import { decrypt, encrypt } from './cipher.js';
import { bytesToEnvelope, envelopeToBytes } from './io.js';
import { mint, solve } from './puzzle.js';
import type { Cipher, Envelope } from './types.js';

export async function sealFromPrimes(
  content: string,
  t: bigint,
  p: bigint,
  q: bigint,
): Promise<Uint8Array<ArrayBuffer>> {
  const { puzzle, solution } = mint(p, q, t);

  let cipher: Cipher;
  try {
    cipher = await encrypt(content, solution);
  } finally {
    solution.fill(0);
  }

  const envelope: Envelope = { v: 1, ...puzzle, ...cipher };
  return envelopeToBytes(envelope);
}

export async function unsealBytes(
  bytes: Uint8Array<ArrayBuffer>,
): Promise<string> {
  const envelope: Envelope = bytesToEnvelope(bytes);
  const solution = solve(envelope);

  try {
    return await decrypt(envelope, solution);
  } finally {
    solution.fill(0);
  }
}
