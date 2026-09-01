import type { WorkerOptions } from 'node:worker_threads';
import { describe, expect, it, vi } from 'vitest';

import { seal, unseal, unsealInWorker } from '../../src/node/index.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

vi.mock('node:worker_threads', async (importOriginal) => {
  const original = await importOriginal<typeof import('node:worker_threads')>();

  return {
    ...original,
    Worker: class MockWorker extends original.Worker {
      constructor(filename: URL, options?: WorkerOptions) {
        filename = new URL(filename.href.replace(/\.js$/, '.ts'));
        const workerOptions = {
          ...options,
          execArgv: [...(options?.execArgv || []), '--import=tsx'],
        };
        super(filename, workerOptions);
      }
    },
  };
});

describe('node', () => {
  it('unseals what it sealed', async () => {
    const envelope = await seal(fixture.plaintext, 10n);
    const plaintext = await unseal(envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope', async () => {
    const plaintext = await unseal(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope in a worker thread', async () => {
    const plaintext = await unsealInWorker(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });
});
