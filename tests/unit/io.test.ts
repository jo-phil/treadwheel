import { describe, expect, it } from 'vitest';

import { bytesToEnvelope, envelopeToBytes } from '../../src/core/io.js';
import type { EnvelopeV2 } from '../../src/core/types.js';

import { v2 } from '../fixtures/index.js';

describe('io', () => {
  const buffer = Buffer.from(v2.envelope, 'base64url');
  const bytes = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );

  it('serializes what it deserialized', () => {
    const envelope = bytesToEnvelope(bytes) as EnvelopeV2;
    expect(envelopeToBytes(envelope)).toStrictEqual(bytes);
  });

  it('rejects binary envelope with invalid magic bytes', () => {
    expect(() => bytesToEnvelope(bytes.subarray(1))).toThrow(
      'magic bytes mismatch',
    );
  });

  it('rejects binary envelope with unsupported version', () => {
    const envelope = bytesToEnvelope(bytes);
    const bytesUnsupportedVersion = envelopeToBytes({
      ...envelope,
      // @ts-expect-error
      v: envelope.v + 1,
    });
    expect(() => bytesToEnvelope(bytesUnsupportedVersion)).toThrow(
      'Unsupported envelope version',
    );
  });

  it('rejects incomplete binary envelope', () => {
    expect(() => bytesToEnvelope(bytes.subarray(0, -1))).toThrow(
      'unexpected end of data',
    );
  });
});
