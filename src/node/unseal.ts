import { unsealBytes } from '../core/index.js';

export function unseal(token: string): Promise<string> {
  return unsealBytes(Buffer.from(token, 'base64url'));
}
