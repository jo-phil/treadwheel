import { parentPort } from 'node:worker_threads';

import { unseal } from './index.js';

if (!parentPort) {
  throw new Error('failed to initialize worker port');
}

const port = parentPort;
port.on('message', async (envelope) => {
  try {
    const plaintext = await unseal(envelope);
    port.postMessage({ success: true, plaintext });
  } catch (error) {
    const isError = error instanceof Error;
    port.postMessage({
      success: false,
      error: isError ? error.message : String(error ?? 'unknown error'),
      stack: isError ? error.stack : undefined,
    });
  }
});
