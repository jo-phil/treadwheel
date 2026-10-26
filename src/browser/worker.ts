import { unseal } from './index.js';

self.onmessage = async (e: MessageEvent) => {
  try {
    const plaintext = await unseal(e.data);
    self.postMessage({ success: true, plaintext });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }
};
