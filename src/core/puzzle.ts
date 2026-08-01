import { arrayToHex, hexToArray } from './hex.js';
import type { Puzzle } from './types.js';

function bigintToUint8Array(x: bigint): Uint8Array<ArrayBuffer> {
  let hex = x.toString(16);
  if (hex.length % 2 !== 0) hex = `0${hex}`;
  if (typeof Buffer !== 'undefined')
    return Uint8Array.from(Buffer.from(hex, 'hex'));
  return hexToArray(hex);
}

function bitLength(x: bigint): number {
  if (x === 0n) return 0;
  const i = (x.toString(16).length - 1) * 4;
  return i + 32 - Math.clz32(Number(x >> BigInt(i)));
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

function randomBigInt(strictUpperBound: bigint): bigint {
  const byteLength = Math.ceil(bitLength(strictUpperBound) / 8);

  // Oversample by 16 bytes to reduce modulo bias
  const array = globalThis.crypto.getRandomValues(
    new Uint8Array(byteLength + 16),
  );
  let x = BigInt(`0x${arrayToHex(array)}`) % strictUpperBound;
  if (x <= 1n) x = 2n;
  return x;
}

export function mint(
  p: bigint,
  q: bigint,
  t: number,
): { puzzle: Puzzle; solution: Uint8Array<ArrayBuffer> } {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const x = randomBigInt(n);
  const exponent = modExp(2n, BigInt(t), phi);
  const y = modExp(x, exponent, n);

  return {
    puzzle: { n: n.toString(16), x: x.toString(16), t },
    solution: bigintToUint8Array(y),
  };
}

export function solve(puzzle: Puzzle): Uint8Array<ArrayBuffer> {
  const n = BigInt(`0x${puzzle.n}`);
  let y = BigInt(`0x${puzzle.x}`);
  const t = BigInt(puzzle.t);

  for (let i = 0n; i < t; i++) {
    y = (y * y) % n;
  }
  return bigintToUint8Array(y);
}
