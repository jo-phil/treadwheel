export interface Cipher {
    salt: string;
    iv: string;
    ciphertext: string;
}

export interface Puzzle {
    N: string;
    x: string;
    t: string;
}
