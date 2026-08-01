import {unseal} from "../core/index.js";
import type {Cipher, JSONSerializable, Puzzle} from '../core/types.js';

export { unseal }
export type { Cipher, Puzzle };

export async function unsealInWorker(token: string): Promise<JSONSerializable> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

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
