import { parentPort } from 'node:worker_threads';

import { unseal } from '../core/index.js';

if (parentPort) {
  parentPort.on('message', async (data) => {
    try {
      const content = await unseal(data);
      parentPort!.postMessage({ success: true, content });
    } catch (error: any) {
      parentPort!.postMessage({
        success: false,
        error: error?.message || 'Unknown error',
        stack: error?.stack,
      });
    }
  });
}
