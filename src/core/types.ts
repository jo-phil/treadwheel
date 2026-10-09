export interface Cipher {
  salt: Uint8Array<ArrayBuffer>;
  iv: Uint8Array<ArrayBuffer>;
  ciphertext: Uint8Array<ArrayBuffer>;
}

export interface Puzzle {
  n: Uint8Array<ArrayBuffer>;
  x: Uint8Array<ArrayBuffer>;
  t: bigint;
}

export interface Envelope extends Puzzle, Cipher {
  v: 1;
  uuid: string;
}
