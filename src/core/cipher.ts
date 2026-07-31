import { arrayToHex, hexToArray } from './hex.js';
import type { Cipher } from './types.js';

async function deriveKey(
    password: Uint8Array<ArrayBuffer>, salt: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
    const baseKey = await globalThis.crypto.subtle.importKey(
        "raw", password, "HKDF", false, ["deriveKey"]
    );
    return await globalThis.crypto.subtle.deriveKey(
        {
            name: "HKDF", hash: "SHA-256", salt: salt,
            info: new TextEncoder().encode("treadwheel"),
        },
        baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
}

export async function encrypt(
    payload: any, password: Uint8Array<ArrayBuffer>
): Promise<Cipher> {
    const salt = globalThis.crypto.getRandomValues(new Uint8Array(32));
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const derivedKey = await deriveKey(password, salt);

    const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        derivedKey, new TextEncoder().encode(JSON.stringify(payload))
    );

    return {
        salt: arrayToHex(salt),
        iv: arrayToHex(iv),
        ciphertext: arrayToHex(new Uint8Array(encryptedBuffer))
    };
}

export async function decrypt(
    cipher: Cipher, password: Uint8Array<ArrayBuffer>
): Promise<any> {
    const derivedKey = await deriveKey(password, hexToArray(cipher.salt));
    const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: hexToArray(cipher.iv) },
        derivedKey, hexToArray(cipher.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(decryptedBuffer));
}
