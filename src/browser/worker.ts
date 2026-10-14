import { unseal } from './unseal.js';

self.onmessage = async (e: MessageEvent) => {
  try {
    const plaintext = await unseal(e.data);
    self.postMessage({ success: true, plaintext });
  } catch (error) {
    const isError = error instanceof Error;
    self.postMessage({
      success: false,
      error: isError ? error.message : String(error ?? 'unknown error'),
    });
  }
};
