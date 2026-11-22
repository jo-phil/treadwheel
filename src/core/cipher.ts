import type { Cipher, CipherV2 } from './types.js';

async function deriveKey(
  keyData: BufferSource,
  salt: BufferSource,
  version: number,
): Promise<CryptoKey> {
  const info = new TextEncoder().encode(`treadwheel-v${version}`);
  const baseKey = await globalThis.crypto.subtle.importKey(
    'raw',
    keyData,
    'HKDF',
    false,
    ['deriveKey'],
  );

  return await globalThis.crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(
  payload: Uint8Array<ArrayBuffer>,
  keyData: BufferSource,
): Promise<CipherV2> {
  const v = 2;
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

  const derivedKey = await deriveKey(keyData, salt, v);
  const ciphertext = new Uint8Array(
    await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      payload,
    ),
  );

  return { v, salt, iv, ciphertext };
}

export async function decrypt(
  cipher: Cipher,
  keyData: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> {
  const derivedKey = await deriveKey(keyData, cipher.salt, cipher.v);
  return new Uint8Array(
    await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: cipher.iv },
      derivedKey,
      cipher.ciphertext,
    ),
  );
}
