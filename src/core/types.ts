export interface Cipher {
  salt: Uint8Array<ArrayBuffer>;
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
}

export interface Puzzle {
  modulusByteLength: number;
  modulus: bigint;
  base: bigint;
  time: bigint;
}

export interface Envelope extends Puzzle, Cipher {
  v: 1;
}

export interface SealOptions {
  time?: number;
  modulusLength?: number;
}

export interface PuzzleParams extends Required<SealOptions> {}
