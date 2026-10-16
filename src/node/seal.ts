import crypto from 'node:crypto';

import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes } from '../core/index.js';
import type { SealOptions } from '../core/types.js';

/**
 * Seal plaintext using a time-lock puzzle.
 * @param plaintext - The plaintext to seal.
 * @param options - Optional configuration options.
 * @returns A Base64URL-encoded envelope.
 */
export async function seal(
  plaintext: string,
  {
    time = SEAL_DEFAULTS.time,
    modulusLength = SEAL_DEFAULTS.modulusLength,
  }: SealOptions = {},
): Promise<string> {
  const pLength = Math.ceil(modulusLength / 2);
  const qLength = modulusLength - pLength;
  const p = crypto.generatePrimeSync(pLength, { bigint: true });
  const q = crypto.generatePrimeSync(qLength, { bigint: true });
  const envelope = await sealFromPrimes(plaintext, p, q, {
    time,
    modulusLength,
  });
  return Buffer.from(envelope).toString('base64url');
}
