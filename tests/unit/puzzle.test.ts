import { expect, test } from 'vitest';
import { mint, solve } from '../../src/core/puzzle.js';
import crypto from 'node:crypto';

test('puzzle trapdoor solution matches sequential solution', async () => {
  const p = crypto.generatePrimeSync(1024, { bigint: true });
  const q = crypto.generatePrimeSync(1024, { bigint: true });

  const { puzzle, solution } = mint(p, q, 1000);
  const sequential = solve(puzzle);

  expect(sequential).toEqual(solution);
});
