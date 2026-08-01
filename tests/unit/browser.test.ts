import {expect, test} from 'vitest';
import "@vitest/web-worker";

import {unsealInWorker} from '../../src/browser/index.js';
import {seal} from "../../src/browser/seal.js";

test('browser seals and unseals correctly', async () => {
    const content = 'Hello World';

    const envelope = await seal(content, 1000);
    const unlocked = await unsealInWorker(envelope);

    expect(unlocked).toEqual(content);
})
