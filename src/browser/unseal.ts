import { unsealBytes } from '../core/index.js';
import type { JSONSerializable } from '../core/types.js';
import { base64UrlToBytes } from './codec.js';

export function unseal(token: string): Promise<JSONSerializable> {
  return unsealBytes(base64UrlToBytes(token));
}
