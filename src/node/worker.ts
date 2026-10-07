import { parentPort } from 'node:worker_threads';

import { unseal } from './unseal.js';

if (!parentPort) {
  throw new Error('failed to initialize worker port');
}

const port = parentPort;
port.on('message', async (data) => {
  try {
    const content = await unseal(data);
    port.postMessage({ success: true, content });
  } catch (error) {
    const isError = error instanceof Error;
    port.postMessage({
      success: false,
      error: isError ? error.message : String(error ?? 'unknown error'),
      stack: isError ? error.stack : undefined,
    });
  }
});
