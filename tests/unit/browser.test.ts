import assert from 'node:assert';
import { describe, it } from 'node:test';

import { unseal } from '../../src/browser/index.js';
import { seal } from '../../src/browser/seal.js';

describe('browser', () => {
  it('unseals what it sealed', async () => {
    const content = 'Hello World';

    const envelope = await seal(content, 1000n);
    const unlocked = await unseal(envelope);

    assert.strictEqual(unlocked, content);
  });
});
