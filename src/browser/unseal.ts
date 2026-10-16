import { unsealFromBytes } from '../core/index.js';
import { base64UrlToBytes } from './codec.js';

/**
 * Unseal an envelope by solving its time-lock puzzle.
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unseal(envelope: string): Promise<string> {
  return unsealFromBytes(base64UrlToBytes(envelope));
}
