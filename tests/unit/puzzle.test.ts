import crypto from 'node:crypto';
import { expect, test } from 'vitest';
import { mint, solve } from '../../src/core/puzzle.js';

test('puzzle trapdoor solution matches sequential solution', async () => {
  const p = crypto.generatePrimeSync(1024, { bigint: true });
  const q = crypto.generatePrimeSync(1024, { bigint: true });

  const { puzzle, solution } = mint(p, q, 1000n);
  const sequential = solve(puzzle);

  expect(sequential).toEqual(solution);
});
