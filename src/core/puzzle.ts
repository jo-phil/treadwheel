import type { Puzzle } from './types.js';

export function bytesToBigInt(bytes: Uint8Array): bigint {
  let result = 0n;
  let shift = (bytes.length - 1) * 8;
  for (const byte of bytes) {
    result |= BigInt(byte) << BigInt(shift);
    shift -= 8;
  }
  return result;
}

function bigIntToBytes(
  bigint: bigint,
  byteLength: number,
): Uint8Array<ArrayBuffer> {
  const buffer = new Uint8Array(byteLength);
  for (let i = 0; i < byteLength; i++) {
    const shift = BigInt((byteLength - 1 - i) * 8);
    buffer[i] = Number((bigint >> shift) & 0xffn);
  }
  return buffer;
}

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
  t: bigint,
): { puzzle: Puzzle; solution: Uint8Array<ArrayBuffer> } {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const x = randomBigInt(n, 256);
  const exponent = modExp(2n, t, phi);
  const y = modExp(x, exponent, n);

  return {
    puzzle: {
      modulus: bigIntToBytes(n, 256),
      base: bigIntToBytes(x, 256),
      time: t,
    },
    solution: bigIntToBytes(y, 256),
  };
}

export function solve(puzzle: Puzzle): Uint8Array<ArrayBuffer> {
  const n = bytesToBigInt(puzzle.modulus);
  let y = bytesToBigInt(puzzle.base);

  for (let i = 0n; i < puzzle.time; i++) {
    y = (y * y) % n;
  }
  return bigIntToBytes(y, 256);
}
