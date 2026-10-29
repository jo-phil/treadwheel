import { describe, expect, it } from 'vitest';

import { base64UrlToBytes, bytesToBase64Url } from '../../src/browser/codec.js';
import { seal, unseal, unsealInWorker } from '../../src/browser/index.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('browser', () => {
  it('unseals what it sealed', async () => {
    const envelope = await seal(fixture.plaintext, { time: 10 });
    const plaintext = await unseal(envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope', async () => {
    const plaintext = await unseal(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('unseals golden envelope in a web worker', async () => {
    const plaintext = await unsealInWorker(fixture.envelope);
    expect(plaintext).toBe(fixture.plaintext);
  });

  it('propagates error in web worker', async () => {
    await expect(unsealInWorker('invalid-envelope')).rejects.toThrow(
      'magic bytes mismatch',
    );
  });

  it('aborts web worker execution on signal', async () => {
    const controller = new AbortController();
    const promise = unsealInWorker(fixture.envelope, {
      signal: controller.signal,
    });
    controller.abort();
    await expect(promise).rejects.toThrow('aborted');
  });

  it('aborts operation for already aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      unsealInWorker(fixture.envelope, {
        signal: controller.signal,
      }),
    ).rejects.toThrow('aborted');
  });

  it('decodes and encodes Base64URL with fallback', async () => {
    const base64Url = fixture.envelope;

    const decoded = base64UrlToBytes(fixture.envelope);
    const encoded = bytesToBase64Url(decoded);
    expect(encoded).toBe(base64Url);

    if (
      'fromBase64' in Uint8Array &&
      typeof Uint8Array.fromBase64 === 'function'
    ) {
      const fromBase64 = Uint8Array.fromBase64;
      Uint8Array.fromBase64 = undefined;
      const decodedWithFallback = base64UrlToBytes(base64Url);
      expect(decodedWithFallback).toStrictEqual(decoded);
      Uint8Array.fromBase64 = fromBase64;
    } else {
      console.warn('Uint8Array.fromBase64 is not available');
    }

    if ('toBase64' in decoded && typeof decoded.toBase64 === 'function') {
      decoded.toBase64 = undefined;
      const encodedWithFallback = bytesToBase64Url(decoded);
      expect(encodedWithFallback).toBe(base64Url);
    } else {
      console.warn('Uint8Array.prototype.toBase64 is not available');
    }
  });
});
