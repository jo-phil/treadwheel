import assert from 'node:assert';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';

const CLI_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../src/node/cli.ts',
);

async function runCLI(args: string[], stdin?: string) {
  const result = await execa('tsx', [CLI_PATH, ...args], {
    reject: false,
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
    const plaintext = 'Hello World';

    const sealResult = await runCLI(['seal', '-t 1000', plaintext]);
    assert.strictEqual(sealResult.exitCode, 0);

    const unsealResult = await runCLI(['unseal'], sealResult.stdout);
    assert.strictEqual(unsealResult.exitCode, 0);
    assert.strictEqual(unsealResult.stdout.trim(), plaintext);
  });
});
