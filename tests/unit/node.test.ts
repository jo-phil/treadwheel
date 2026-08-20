import assert from 'node:assert';
import { describe, it } from 'node:test';

import { seal, unseal } from '../../src/node/index.js';

describe('node', () => {
  it('unseals what it sealed', async () => {
    const content = 'Hello World';

    const envelope = await seal(content, 1000n);
    const unlocked = await unseal(envelope);

    assert.strictEqual(unlocked, content);
  });
});
