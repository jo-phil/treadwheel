#!/usr/bin/env node

import { text } from 'node:stream/consumers';
import { parseArgs } from 'node:util';
import { SEAL_DEFAULTS } from '../core/defaults.js';
import { seal, unseal } from './index.js';

const USAGE = `Usage: treadwheel <command> [<options>] <payload>

Commands:
  seal      Seal plaintext using a time-lock puzzle
  unseal    Unseal an envelope by solving its time-lock puzzle

Options for seal:
  -t, --time <squarings>       Number of sequential squarings required to solve
                               the puzzle (default: ${SEAL_DEFAULTS.time})
  -m, --modulus-length <bits>  Desired bit-length of the modulus (default: ${SEAL_DEFAULTS.modulusLength}) 

Global options:
  -h, --help      Display this help message
`;

const PARSE_ARGS_CONFIG = {
  allowPositionals: true,
  options: {
    time: {
      type: 'string',
      short: 't',
      default: `${SEAL_DEFAULTS.time}`,
    },
    'modulus-length': {
      type: 'string',
      short: 'm',
      default: `${SEAL_DEFAULTS.modulusLength}`,
    },
    help: {
      type: 'boolean',
      short: 'h',
    },
  },
} as const;

async function runSeal(
  plaintext: string | undefined,
  options: { time?: string; 'modulus-length'?: string },
): Promise<void> {
  const time = Number(options.time);
  if (!Number.isSafeInteger(time) || time < 0) {
    process.stderr.write(
      "Option '-t, --time <value>' argument must be a non-negative safe " +
        `integer; got ${options.time}\n`,
    );
    process.exitCode = 2;
    return;
  }

  const modulusLength = Number(options['modulus-length']);
  if (!Number.isSafeInteger(modulusLength) || modulusLength <= 0) {
    process.stderr.write(
      "Option '-m, --modulus-length <value>' argument must be a positive " +
        `safe integer; got ${options['modulus-length']}\n`,
    );
    process.exitCode = 2;
    return;
  }

  if (plaintext === undefined) {
    process.stderr.write(
      "Command 'seal' requires plaintext as argument or from stdin\n",
    );
    process.exitCode = 2;
    return;
  }

  const envelope = await seal(plaintext, { time, modulusLength });
  process.stdout.write(`${envelope}\n`);
}

async function runUnseal(envelope: string | undefined): Promise<void> {
  if (envelope === undefined) {
    process.stderr.write(
      "Command 'unseal' requires an envelope as argument or from stdin\n",
    );
    process.exitCode = 2;
    return;
  }

  const plaintext = await unseal(envelope.trim());
  process.stdout.write(`${plaintext}\n`);
}

async function main(): Promise<void> {
  let values: {
    time: string;
    'modulus-length': string;
    help?: boolean;
  };
  let positionals: string[];

  try {
    ({ values, positionals } = parseArgs(PARSE_ARGS_CONFIG));
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code.startsWith('ERR_PARSE_ARGS')
    ) {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 2;
      return;
    }
    throw error;
  }

  if (values.help) {
    process.stderr.write(USAGE);
    return;
  }

  if (positionals.length > 2) {
    process.stderr.write('Too many positional arguments\n');
    process.exitCode = 2;
    return;
  }

  let [command, payload] = positionals;
  if (command === undefined) {
    process.stderr.write(USAGE);
    process.exitCode = 2;
    return;
  }

  if (payload === undefined) {
    payload = process.stdin.isTTY ? undefined : await text(process.stdin);
  }

  switch (command) {
    case 'seal':
      await runSeal(payload, values);
      break;
    case 'unseal':
      await runUnseal(payload);
      break;
    default:
      process.stderr.write(`Unknown command '${command}'\n`);
      process.exitCode = 2;
  }
}

try {
  await main();
} catch (err) {
  process.stderr.write(
    `Error: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exitCode = 1;
}
