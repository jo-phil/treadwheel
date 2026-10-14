import { unsealFromBytes } from '../core/index.js';
import { base64UrlToBytes } from './codec.js';

export function unseal(envelope: string): Promise<string> {
  return unsealFromBytes(base64UrlToBytes(envelope));
}
