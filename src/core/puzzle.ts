import { bytesToBigInt } from './io.js';
import type { Puzzle, PuzzleParams } from './types.js';

function modExp(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if ((exponent & 1n) === 1n) result = (result * base) % modulus;
    exponent >>= 1n;
    base = (base * base) % modulus;
  }
  return result;
}

function randomBigInt(strictUpperBound: bigint, byteLength: number): bigint {
  // Oversample by 16 bytes to reduce modulo bias
  const randomBytes = new Uint8Array(byteLength + 16);
  globalThis.crypto.getRandomValues(randomBytes);

  let x = bytesToBigInt(randomBytes) % strictUpperBound;
  if (x <= 1n) x = 2n;
  return x;
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
