import crypto from 'node:crypto';

import { sealFromPrimes } from '../core/index.js';
import type { JSONSerializable } from '../core/types.js';

export async function seal(content: JSONSerializable, t: number) {
  const p = crypto.generatePrimeSync(1024, { bigint: true });
  const q = crypto.generatePrimeSync(1024, { bigint: true });
  return sealFromPrimes(content, t, p, q);
}
