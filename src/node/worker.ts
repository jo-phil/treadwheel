import { parentPort, workerData } from 'node:worker_threads';

import { unseal } from './index.js';

if (!parentPort) {
  throw new Error('failed to initialize worker port');
}

const plaintext = await unseal(workerData);
parentPort.postMessage(plaintext);
