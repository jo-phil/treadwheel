import type { SealOptions } from './types.js';

export const SEAL_DEFAULTS: Required<SealOptions> = {
  time: 250_000n,
  modulusLength: 2048,
};
