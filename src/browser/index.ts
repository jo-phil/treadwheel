import type { Cipher, Puzzle } from '../core/types.js';
import { unseal } from './unseal.js';

export type { Cipher, Puzzle };
export { unseal };

export async function unsealInWorker(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const workerUrl = new URL('./worker.js', import.meta.url);
    const worker = new Worker(workerUrl, { type: 'module' });

    worker.onmessage = (e) => {
      worker.terminate();
      if (e.data.success) resolve(e.data.content);
      else reject(new Error(e.data.error));
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };

    worker.postMessage(token);
  });
}
