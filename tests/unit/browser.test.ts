import { describe, expect, it } from 'vitest';

import { seal, unseal, unsealInWorker } from '../../src/browser/index.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('browser', () => {
  it('unseals what it sealed', async () => {
    const envelope = await seal(fixture.plaintext, { time: 10 });
    const plaintext = await unseal(envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope', async () => {
    const plaintext = await unseal(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope in a web worker', async () => {
    const plaintext = await unsealInWorker(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });
});
