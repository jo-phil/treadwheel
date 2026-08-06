import { unseal } from './unseal.js';

self.onmessage = async (e: MessageEvent) => {
  try {
    const content = await unseal(e.data);
    self.postMessage({ success: true, content });
  } catch (error) {
    const isError = error instanceof Error;
    self.postMessage({
      success: false,
      error: isError ? error.message : String(error ?? 'Unknown error'),
    });
  }
};
