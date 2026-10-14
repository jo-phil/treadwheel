import { unsealFromBytes } from '../core/index.js';

export function unseal(envelope: string): Promise<string> {
  return unsealFromBytes(Buffer.from(envelope, 'base64url'));
}
