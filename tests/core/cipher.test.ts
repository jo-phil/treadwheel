import { expect, test } from "vitest";
import { decrypt, encrypt } from "../../src/core/cipher.js";

test('cipher preserves data integrity', async () => {
    const original = 'Hello World';
    const password = crypto.getRandomValues(new Uint8Array(32));
    const encrypted = await encrypt(original, password);
    const decrypted = await decrypt(encrypted, password);
    expect(decrypted).toEqual(original);
});
