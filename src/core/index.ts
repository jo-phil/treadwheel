import { decrypt, encrypt } from './cipher.js';
import { bytesToEnvelope, envelopeToBytes } from './io.js';
import { mint, solve } from './puzzle.js';
import type { Cipher, Envelope, PuzzleParams } from './types.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function sealFromPrimes(
  plaintext: string,
  { p, q, time }: PuzzleParams,
): Promise<Uint8Array<ArrayBuffer>> {
  const payload = encoder.encode(plaintext);
  const { puzzle, solution } = mint(p, q, time);

  let cipher: Cipher;
  try {
    cipher = await encrypt(payload, solution);
  } finally {
    solution.fill(0);
  }

  const envelope: Envelope = { v: 1, ...puzzle, ...cipher };
  return envelopeToBytes(envelope);
}

export async function unsealFromBytes(
  bytes: Uint8Array<ArrayBuffer>,
): Promise<string> {
  const envelope = bytesToEnvelope(bytes);
  const solution = solve(envelope);

  let payload: Uint8Array<ArrayBuffer>;
  try {
    payload = await decrypt(envelope, solution);
  } finally {
    solution.fill(0);
  }

  return decoder.decode(payload);
}
