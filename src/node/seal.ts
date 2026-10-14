import crypto from 'node:crypto';

import { SEAL_DEFAULTS } from '../core/defaults.js';
import { sealFromPrimes } from '../core/index.js';
import type { SealOptions } from '../core/types.js';

export async function seal(
  plaintext: string,
  { time = SEAL_DEFAULTS.time }: SealOptions = {},
): Promise<string> {
  const p = crypto.generatePrimeSync(1024, { bigint: true });
  const q = crypto.generatePrimeSync(1024, { bigint: true });
  const envelope = await sealFromPrimes(plaintext, { p, q, time });
  return Buffer.from(envelope).toString('base64url');
}
