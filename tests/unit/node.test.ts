import { expect, test } from 'vitest';

import { seal, unseal } from '../../src/node/index.js';

test('node locks and unlocks correctly', async () => {
  const content = 'Hello World';

  const envelope = await seal(content, 1000);
  const unlocked = await unseal(envelope);

  expect(unlocked).toEqual(content);
});
