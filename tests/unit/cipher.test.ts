import { expect, test } from 'vitest';
import { decrypt, encrypt } from '../../src/core/cipher.js';

test('cipher preserves data integrity', async () => {
  const original = 'Hello World';

  const keyData = crypto.getRandomValues(new Uint8Array(32));
  const encrypted = await encrypt(original, keyData);
  const decrypted = await decrypt(encrypted, keyData);

  expect(decrypted).toEqual(original);
});
