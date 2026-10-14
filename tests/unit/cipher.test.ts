import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { decrypt, encrypt } from '../../src/core/cipher.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('cipher', () => {
  it('preserves data integrity', async () => {
    const data = new TextEncoder().encode(fixture.plaintext);
    const keyData = crypto.getRandomValues(new Uint8Array(32));

    const encrypted = await encrypt(data, keyData);
    const decrypted = await decrypt(encrypted, keyData);

    expect(decrypted).toStrictEqual(data);
  });
});
