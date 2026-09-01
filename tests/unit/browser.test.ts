import { describe, expect, it } from 'vitest';

import { seal, unseal } from '../../src/browser/index.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('browser', () => {
  it('unseals what it sealed', async () => {
    const envelope = await seal(fixture.plaintext, 1000n);
    const plaintext = await unseal(envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });
});
