import type { Cipher } from './types.js';

const INFO_BYTES = new TextEncoder().encode('treadwheel-v1');

async function deriveKey(
  keyData: BufferSource,
  salt: BufferSource,
): Promise<CryptoKey> {
  const baseKey = await globalThis.crypto.subtle.importKey(
    'raw',
    keyData,
    'HKDF',
    false,
    ['deriveKey'],
  );

  return await globalThis.crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: salt, info: INFO_BYTES },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(
  payload: Uint8Array<ArrayBuffer>,
  keyData: BufferSource,
): Promise<Cipher> {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));

  const derivedKey = await deriveKey(keyData, salt);
  const ciphertext = new Uint8Array(
    await globalThis.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      payload,
    ),
  );

  return { salt, iv, ciphertext };
}

export async function decrypt(
  cipher: Cipher,
  keyData: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> {
  const derivedKey = await deriveKey(keyData, cipher.salt);
  return new Uint8Array(
    await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: cipher.iv },
      derivedKey,
      cipher.ciphertext,
    ),
  );
}
