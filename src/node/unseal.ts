import { unsealBytes } from '../core/index.js';
import type { JSONSerializable } from '../core/types.js';

export function unseal(token: string): Promise<JSONSerializable> {
  return unsealBytes(Buffer.from(token, 'base64url'));
}
