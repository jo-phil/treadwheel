import assert from 'node:assert';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';

import { decrypt, encrypt } from '../../src/core/cipher.js';

describe('cipher', () => {
  it('preserves data integrity', async () => {
    const original = 'Hello World';

    const keyData = crypto.getRandomValues(new Uint8Array(32));
    const encrypted = await encrypt(original, keyData);
    const decrypted = await decrypt(encrypted, keyData);

    assert.strictEqual(decrypted, original);
  });
});
