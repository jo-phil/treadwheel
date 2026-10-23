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

  it('unseals golden envelope', async () => {
    const unsealResult = await runCLI(['unseal', fixture.envelope]);
    expect(unsealResult.stderr).toBe('');
    expect(unsealResult.exitCode).toBe(0);
    expect(unsealResult.stdout.trim()).toBe(fixture.plaintext);
  });

  it('displays help', async () => {
    const result = await runCLI(['--help']);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Usage:');
    expect(result.exitCode).toBe(0);
  });

  it('displays version', async () => {
    const result = await runCLI(['--version']);
    expect(result.stderr).toBe('');
    expect(result.exitCode).toBe(0);
    expect(result.stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('rejects calls without subcommand and displays help', async () => {
    const result = await runCLI([]);
    expect(result.stderr).toContain('Usage:');
    expect(result.exitCode).toBe(2);
  });

  it('rejects unknown command', async () => {
    const result = await runCLI(['unknown']);
    expect(result.stderr).toContain('Unknown command');
    expect(result.exitCode).toBe(2);
  });

  it('rejects time option without argument', async () => {
    const result = await runCLI(['seal', '--time']);
    expect(result.stderr).toContain('time');
    expect(result.exitCode).toBe(2);
  });

  it.for(['', '-1', '0.1', 'a'])(
    "rejects invalid time argument '%s'",
    async (time) => {
      const result = await runCLI([
        'seal',
        `--time='${time}'`,
        fixture.plaintext,
      ]);
      expect(result.stderr).toContain('time');
      expect(result.exitCode).toBe(2);
    },
  );

  it('rejects modulus length option without argument', async () => {
    const result = await runCLI(['seal', '--modulus-length']);
    expect(result.stderr).toContain('modulus-length');
    expect(result.exitCode).toBe(2);
  });

  it.for(['', '0', '0.1', 'a'])(
    "rejects invalid modulus length argument '%s'",
    async (modulusLength) => {
      const result = await runCLI([
        'seal',
        `--modulus-length='${modulusLength}'`,
        fixture.plaintext,
      ]);
      expect(result.stderr).toContain('modulus-length');
      expect(result.exitCode).toBe(2);
    },
  );

  it('rejects additional positional arguments', async () => {
    const result = await runCLI(['seal', 'plaintext', 'extra'], '');
    expect(result.stderr).toContain('Too many positional arguments');
    expect(result.exitCode).toBe(2);
  });
});
