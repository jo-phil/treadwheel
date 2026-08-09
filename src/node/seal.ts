import crypto from 'node:crypto';

import { sealFromPrimes } from '../core/index.js';

export async function seal(content: string, t: bigint): Promise<string> {
  const p = crypto.generatePrimeSync(1024, { bigint: true });
  const q = crypto.generatePrimeSync(1024, { bigint: true });
  const envelope = await sealFromPrimes(content, t, p, q);
  return Buffer.from(envelope).toString('base64url');
}
