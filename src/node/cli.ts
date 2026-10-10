#!/usr/bin/env node

import { text } from 'node:stream/consumers';
import { parseArgs } from 'node:util';

import { seal, unseal } from './index.js';

const USAGE = `usage: treadwheel {seal,unseal} [-t TIME] PAYLOAD

commands:
  seal    encrypt a payload using a time-lock puzzle
  unseal  solve a time-lock puzzle to decrypt its payload

options:
  -t, --time TIME   time parameter (number of squarings) of the time-lock puzzle
                    (default: 250000)
  -h, --help        display this help message
`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    time: {
      type: 'string',
      short: 't',
      default: '250_000',
    },
    help: {
      type: 'boolean',
      short: 'h',
    },
  },
});

async function readStdin(): Promise<string | undefined> {
  return process.stdin.isTTY ? undefined : await text(process.stdin);
}

async function main(): Promise<void> {
  if (values.help) {
    process.stderr.write(USAGE);
    return;
  }

  if (positionals.length < 1 || positionals.length > 2) {
    process.stderr.write(USAGE);
    process.exitCode = 2;
    return;
  }

  const command = positionals[0];
  const payload = positionals.length === 2 ? positionals[1] : await readStdin();
  if (payload === undefined) {
    process.stderr.write('no payload provided\n');
    process.exitCode = 2;
    return;
  }

  switch (command) {
    case 'seal': {
      let t: bigint;
      try {
        t = BigInt(values.time);
      } catch {
        process.stderr.write(`invalid time value: ${values.time}\n`);
        process.exitCode = 2;
        return;
      }

      const output = await seal(payload, t);
      process.stdout.write(`${output}\n`);
      break;
    }

    case 'unseal': {
      const output = await unseal(payload);
      process.stdout.write(`${output}\n`);
      break;
    }

    default:
      process.stderr.write(`unknown command: ${command}\n`);
      process.exitCode = 2;
  }
}

try {
  await main();
} catch (err) {
  process.stderr.write(
    `unexpected error: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exitCode = 1;
}
