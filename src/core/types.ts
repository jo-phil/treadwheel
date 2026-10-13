export interface Cipher {
  salt: Uint8Array<ArrayBuffer>;
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
}

export interface Puzzle {
  modulus: Uint8Array<ArrayBuffer>;
  base: Uint8Array<ArrayBuffer>;
  time: bigint;
}

export interface Envelope extends Puzzle, Cipher {
  v: 1;
}
