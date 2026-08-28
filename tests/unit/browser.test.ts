import { describe, expect, it } from 'vitest';

import { seal, unseal } from '../../src/browser/index.js';

describe('browser', () => {
  it('unseals what it sealed', async () => {
    const content = 'Hello World';

    const envelope = await seal(content, 1000n);
    const unlocked = await unseal(envelope);

    expect(unlocked).toBe(content);
  });
});
