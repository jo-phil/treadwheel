export interface Cipher {
  v: 1 | 2;
  salt: Uint8Array<ArrayBuffer>;
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
}

export interface CipherV2 extends Cipher {
  v: 2;
}

export interface Puzzle {
  modulusByteLength: number;
  baseByteLength: number;
  modulus: bigint;
  base: bigint;
  time: bigint;
}

export interface Envelope extends Puzzle, Cipher {}
export interface EnvelopeV2 extends Puzzle, CipherV2 {}

/**
 * Optional configuration options for {@link seal}.
 */
export interface SealOptions {
  /**
   * The number of sequential squarings required to solve the time-lock puzzle.
   * @default 250_000
   */
  time?: number;

  /**
   * The desired bit-length of the puzzle's modulus.
   * @default 2048
   */
  modulusLength?: number;
}

export interface PuzzleParams extends Required<SealOptions> {}

/**
 * Optional configuration options for {@link unsealInWorker}.
 */
export interface UnsealInWorkerOptions {
  /**
   * Signal to abort the operation.
   */
  signal?: AbortSignal | undefined;
}
