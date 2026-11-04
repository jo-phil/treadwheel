import { bytesToBigInt } from './io.js';
import type { Puzzle, PuzzleParams } from './types.js';

function modExp(base: bigint, exponent: bigint, modulus: bigint): bigint {
  let result = 1n;
  for (; exponent > 0n; exponent >>= 1n) {
    if (exponent & 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
  }
  return result;
}

function randomBigInt(strictUpperBound: bigint, byteLength: number): bigint {
  // Oversample by 16 bytes to reduce modulo bias
  const randomBytes = new Uint8Array(byteLength + 16);
  globalThis.crypto.getRandomValues(randomBytes);
  return bytesToBigInt(randomBytes) % strictUpperBound;
}

export function mint(
  p: bigint,
  q: bigint,
  { time, modulusLength }: PuzzleParams,
): { puzzle: Puzzle; solution: bigint } {
  if (!Number.isSafeInteger(time) || time < 0)
    throw new RangeError("Option 'time' must be a non-negative safe integer");

  const t = BigInt(time);
  const modulusByteLength = Math.ceil(modulusLength / 8);

  const modulus = p * q;
  const phi = (p - 1n) * (q - 1n);
  const base = randomBigInt(modulus, modulusByteLength);
  const exponent = modExp(2n, t, phi);
  const solution = modExp(base, exponent, modulus);

  return { puzzle: { modulusByteLength, modulus, base, time: t }, solution };
}

export function solve({ modulus, base, time }: Puzzle): bigint {
  for (let i = 0n; i < time; i++) {
    base = (base * base) % modulus;
  }
  return base;
}
