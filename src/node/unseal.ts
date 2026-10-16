import { unsealFromBytes } from '../core/index.js';

/**
 * Unseal an envelope by solving its time-lock puzzle.
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unseal(envelope: string): Promise<string> {
  return unsealFromBytes(Buffer.from(envelope, 'base64url'));
}
