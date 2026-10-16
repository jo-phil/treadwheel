import type { SealOptions } from '../core/types.js';
import { seal } from './seal.js';
import { unseal } from './unseal.js';

export type { SealOptions };
export { seal, unseal };

/**
 * Unseal an envelope in a web worker.
 * @param envelope - A Base64URL-encoded envelope.
 * @returns The decrypted plaintext.
 */
export async function unsealInWorker(envelope: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const workerUrl = new URL('./worker.js', import.meta.url);
    const worker = new Worker(workerUrl, { type: 'module' });

    worker.onmessage = (e) => {
      worker.terminate();
      if (e.data.success) resolve(e.data.plaintext);
      else reject(new Error(e.data.error));
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };

    worker.postMessage(envelope);
  });
}
