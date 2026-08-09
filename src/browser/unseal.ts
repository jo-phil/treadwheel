import { unsealBytes } from '../core/index.js';
import { base64UrlToBytes } from './codec.js';

export function unseal(token: string): Promise<string> {
  return unsealBytes(base64UrlToBytes(token));
}
