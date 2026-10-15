#!/usr/bin/env node

import { text } from 'node:stream/consumers';
import { parseArgs } from 'node:util';
import { SEAL_DEFAULTS } from '../core/defaults.js';
import { seal, unseal } from './index.js';

const USAGE = `usage: treadwheel {seal,unseal} [-t TIME] PAYLOAD

commands:
  seal    encrypt a payload using a time-lock puzzle
  unseal  solve a time-lock puzzle to decrypt its payload

seal options:
  -t, --time <squarings>       sequential squarings required to solve the puzzle
                               (default: ${SEAL_DEFAULTS.time})
  -m, --modulus-length <bits>  bit-length of the modulus (default: ${SEAL_DEFAULTS.modulusLength}) 

global options:
  -h, --help        display this help message
`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    time: {
      type: 'string',
      short: 't',
      default: `${SEAL_DEFAULTS.time}`,
    },
    modulusLength: {
      type: 'string',
      short: 'm',
      default: `${SEAL_DEFAULTS.modulusLength}`,
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
      let time: number;
      try {
        time = parseInt(values.time, 10);
      } catch {
        process.stderr.write(`invalid time value: ${values.time}\n`);
        process.exitCode = 2;
        return;
      }

      let modulusLength: number;
      try {
        modulusLength = parseInt(values.modulusLength, 10);
      } catch {
        process.stderr.write(
          `invalid modulus length value: ${values.modulusLength}\n`,
        );
        process.exitCode = 2;
        return;
      }

      const envelope = await seal(payload, { time, modulusLength });
      process.stdout.write(`${envelope}\n`);
      break;
    }

    case 'unseal': {
      const plaintext = await unseal(payload);
      process.stdout.write(`${plaintext}\n`);
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
