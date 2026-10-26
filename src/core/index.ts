import { decrypt, encrypt } from './cipher.js';
import { bigIntToBytes, bytesToEnvelope, envelopeToBytes } from './io.js';
import { mint, solve } from './puzzle.js';
import type { Cipher, PuzzleParams } from './types.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function sealFromPrimes(
  plaintext: string,
  p: bigint,
  q: bigint,
  puzzleParams: PuzzleParams,
): Promise<Uint8Array<ArrayBuffer>> {
  const payload = encoder.encode(plaintext);
  const { puzzle, solution } = mint(p, q, puzzleParams);
  const keyData = bigIntToBytes(solution, puzzle.modulusByteLength);

  let cipher: Cipher;
  try {
    cipher = await encrypt(payload, keyData);
  } finally {
    keyData.fill(0);
  }

  return envelopeToBytes({ v: 1, ...puzzle, ...cipher });
}

export async function unsealFromBytes(
  bytes: Uint8Array<ArrayBuffer>,
): Promise<string> {
  const envelope = bytesToEnvelope(bytes);
  const solution = solve(envelope);
  const keyData = bigIntToBytes(solution, envelope.modulusByteLength);

  let payload: Uint8Array<ArrayBuffer>;
  try {
    payload = await decrypt(envelope, keyData);
  } finally {
    keyData.fill(0);
  }

  return decoder.decode(payload);
}
