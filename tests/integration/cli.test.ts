import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execaNode } from 'execa';
import { describe, expect, it } from 'vitest';

import fixture from '../fixtures/v1.json' with { type: 'json' };

const CLI_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../src/node/cli.ts',
);

async function runCLI(args: string[], stdin?: string) {
  const result = await execaNode(CLI_PATH, args, {
    reject: false,
    nodeOptions: ['--import=tsx'],
    ...(stdin ? { input: stdin } : {}),
  });

  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
  };
}

describe('CLI', () => {
  it('unseals what it sealed', async () => {
    const sealResult = await runCLI(['seal', '-t 10', fixture.plaintext]);
    expect(sealResult.stderr).toBe('');
    expect(sealResult.exitCode).toBe(0);
    expect(sealResult.stdout.trim()).toMatch(/^[a-zA-Z0-9_-]+$/);

    const unsealResult = await runCLI(['unseal'], sealResult.stdout);
    expect(unsealResult.stderr).toBe('');
    expect(unsealResult.exitCode).toBe(0);
    expect(unsealResult.stdout.trim()).toBe(fixture.plaintext);
  });
});
