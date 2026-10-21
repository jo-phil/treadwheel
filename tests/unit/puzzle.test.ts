import crypto from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';

import { mint, solve } from '../../src/core/puzzle.js';

describe('puzzle', () => {
  let p: bigint, q: bigint;

  beforeAll(() => {
    p = crypto.generatePrimeSync(1024, { bigint: true });
    q = crypto.generatePrimeSync(1024, { bigint: true });
  });

  it('trapdoor matches sequential solution', async () => {
    const { puzzle, solution } = mint(p, q, { time: 10, modulusLength: 2048 });
    const sequential = solve(puzzle);

    expect(sequential).toStrictEqual(solution);
  });

  it('rejects negative time values', () => {
    expect(() => mint(p, q, { time: -1, modulusLength: 2048 })).toThrow(
      'time must be a non-negative safe integer',
    );
  });
});
