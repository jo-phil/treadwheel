import crypto from 'node:crypto';

import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes } from '../core/index.js';
import type { SealOptions } from '../core/types.js';

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
