import { expect, test } from "vitest";
import { mint, solve } from "../../src/core/puzzle.js";
import crypto from "node:crypto";

test('puzzle solution matches original secret', async () => {
    const p = crypto.generatePrimeSync(1024, { bigint: true });
    const q = crypto.generatePrimeSync(1024, { bigint: true });

    const { puzzle, password } = mint(p, q, 1000n);
    const solution = solve(puzzle);
    expect(solution).toEqual(password);
})
