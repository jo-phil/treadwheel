import assert from 'node:assert';
import crypto from 'node:crypto';
import { describe, it } from 'node:test';

import { mint, solve } from '../../src/core/puzzle.js';

describe('puzzle', () => {
  it('trapdoor matches sequential solution', async () => {
    const p = crypto.generatePrimeSync(1024, { bigint: true });
    const q = crypto.generatePrimeSync(1024, { bigint: true });

    const { puzzle, solution } = mint(p, q, 1000n);
    const sequential = solve(puzzle);

    assert.deepStrictEqual(sequential, solution);
  });
});
