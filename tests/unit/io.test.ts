import { describe, expect, it } from 'vitest';

import { bytesToEnvelope, envelopeToBytes } from '../../src/core/io.js';
import fixture from '../fixtures/v1.json' with { type: 'json' };

describe('io', () => {
  const buffer = Buffer.from(fixture.envelope, 'base64url');
  const bytes = new Uint8Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength,
  );

  it('serializes what it deserialized', () => {
    const envelope = bytesToEnvelope(bytes);
    expect(envelopeToBytes(envelope)).toStrictEqual(bytes);
  });

  it('rejects binary envelope with invalid magic bytes', () => {
    expect(() => bytesToEnvelope(bytes.subarray(1))).toThrow(
      'invalid magic bytes',
    );
  });

  it('rejects incomplete binary envelope', () => {
    expect(() => bytesToEnvelope(bytes.subarray(0, -1))).toThrow(
      'not enough bytes to read',
    );
  });
});
