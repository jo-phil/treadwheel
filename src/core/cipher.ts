import type { Cipher } from './types.js';

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
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: new TextEncoder().encode('treadwheel'),
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(
  content: string,
  keyData: BufferSource,
): Promise<Cipher> {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveKey(keyData, salt);

  const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    derivedKey,
    new TextEncoder().encode(content),
  );

  return {
    salt,
    iv,
    ciphertext: new Uint8Array(encryptedBuffer),
  };
}

export async function decrypt(
  cipher: Cipher,
  keyData: BufferSource,
): Promise<string> {
  const derivedKey = await deriveKey(keyData, cipher.salt);
  const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: cipher.iv },
    derivedKey,
    cipher.ciphertext,
  );
  return new TextDecoder().decode(decryptedBuffer);
}
