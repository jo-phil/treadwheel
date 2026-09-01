import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { mint, solve } from '../../src/core/puzzle.js';

describe('puzzle', () => {
  it('trapdoor matches sequential solution', async () => {
    const p = crypto.generatePrimeSync(1024, { bigint: true });
    const q = crypto.generatePrimeSync(1024, { bigint: true });

    const { puzzle, solution } = mint(p, q, 10n);
    const sequential = solve(puzzle);

    expect(sequential).toStrictEqual(solution);
  });
});
