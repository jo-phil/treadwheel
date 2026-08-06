import type { Envelope } from './types.js';

const MAGIC_BYTES = new Uint8Array([
  0x74, 0x72, 0x65, 0x61, 0x64, 0x77, 0x68, 0x65, 0x65, 0x6c,
]);

class BinaryReader {
  private view: DataView;
  private bytes: Uint8Array<ArrayBuffer>;
  private offset: number = 0;

  constructor(bytes: Uint8Array<ArrayBuffer>) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  public readUint8(): number {
    return this.view.getUint8(this.offset++);
  }

  public readUint16(): number {
    const value = this.view.getUint16(this.offset);
    this.offset += 2;
    return value;
  }

  public readUint32(): number {
    const value = this.view.getUint32(this.offset);
    this.offset += 4;
    return value;
  }

  public readBigUInt64(): bigint {
    const value = this.view.getBigUint64(this.offset);
    this.offset += 8;
    return value;
  }

  public readBytes(length: number): Uint8Array<ArrayBuffer> {
    const until = this.offset + length;
    if (until > this.bytes.byteLength) {
      throw new Error('Not enough bytes to read');
    }

    const bytes = this.bytes.subarray(this.offset, until);
    this.offset = until;
    return bytes;
  }
}

class BinaryWriter {
  private view: DataView;
  private bytes: Uint8Array;
  private offset: number = 0;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  public writeUint8(value: number): void {
    this.view.setUint8(this.offset++, value);
  }

  public writeUint16(value: number): void {
    this.view.setUint16(this.offset, value);
    this.offset += 2;
  }

  public writeUint32(value: number): void {
    this.view.setUint32(this.offset, value);
    this.offset += 4;
  }

  public writeBigUInt64(value: bigint): void {
    this.view.setBigUint64(this.offset, BigInt(value));
    this.offset += 8;
  }

  public writeBytes(buffer: Uint8Array): void {
    this.bytes.set(buffer, this.offset);
    this.offset += buffer.byteLength;
  }
}

export function envelopeToBytes(envelope: Envelope): Uint8Array<ArrayBuffer> {
  // header: 1 random, some magic, 1 version, 8 for t, 2 mod length, 4 ct length
  const headerSize = 16 + MAGIC_BYTES.byteLength;
  const totalSize =
    headerSize +
    envelope.n.byteLength +
    envelope.x.byteLength +
    envelope.salt.byteLength +
    envelope.iv.byteLength +
    envelope.ciphertext.byteLength;

  const bytes = new Uint8Array(totalSize);
  const writer = new BinaryWriter(bytes);

  // random byte for downstream text blobs to be distinguishable
  writer.writeUint8(envelope.iv[0] ?? 0);

  writer.writeBytes(MAGIC_BYTES);
  writer.writeUint8(envelope.v);

  writer.writeBigUInt64(envelope.t);
  writer.writeUint16(envelope.n.byteLength);
  writer.writeUint32(envelope.ciphertext.byteLength);

  writer.writeBytes(envelope.n);
  writer.writeBytes(envelope.x);
  writer.writeBytes(envelope.salt);
  writer.writeBytes(envelope.iv);
  writer.writeBytes(envelope.ciphertext);

  return bytes;
}

export function bytesToEnvelope(bytes: Uint8Array<ArrayBuffer>): Envelope {
  const reader = new BinaryReader(bytes);

  reader.readUint8(); // skip random byte

  const magicBytes = reader.readBytes(MAGIC_BYTES.byteLength);
  if (
    magicBytes.byteLength !== MAGIC_BYTES.byteLength ||
    !magicBytes.every((b, i) => b === MAGIC_BYTES[i])
  ) {
    throw new Error('Invalid magic bytes');
  }

  const v = reader.readUint8();
  if (v !== 1) {
    throw new Error(`Unsupported version: ${v}`);
  }

  const t = reader.readBigUInt64();
  const modulusLength = reader.readUint16();
  const ciphertextLength = reader.readUint32();

  const n = reader.readBytes(modulusLength);
  const x = reader.readBytes(modulusLength);
  const salt = reader.readBytes(32);
  const iv = reader.readBytes(12);
  const ciphertext = reader.readBytes(ciphertextLength);

  return { v, t, n, x, salt, iv, ciphertext };
}
