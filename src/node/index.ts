import { Worker } from 'node:worker_threads';

import { unseal } from '../core/index.js';
import { seal } from './seal.js';
import type { Cipher, JSONSerializable, Puzzle } from '../core/types.js';

export { seal, unseal };
export type { Cipher, Puzzle };

export async function unsealInWorker(token: string): Promise<JSONSerializable> {
  return new Promise((resolve, reject) => {
    const workerUrl = new URL('./worker.js', import.meta.url);
    const worker = new Worker(workerUrl);

    worker.on('message', (res) => {
      worker.terminate();
      if (res.success) resolve(res.content);
      else reject(new Error(res.error));
    });

    worker.on('error', (err) => {
      worker.terminate();
      reject(err);
    });

    worker.postMessage(token);
  });
}
