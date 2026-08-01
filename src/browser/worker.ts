import { unseal } from '../core/index.js';

self.onmessage = async (e: MessageEvent) => {
  try {
    const content = await unseal(e.data);
    self.postMessage({ success: true, content });
  } catch (error: any) {
    self.postMessage({
      success: false,
      error: error?.message || 'Unknown error',
    });
  }
};
