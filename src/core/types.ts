export interface Cipher {
    s: string;
    iv: string;
    ct: string;
}

export interface Puzzle {
    n: string;
    x: string;
    t: number;
}

export interface Envelope extends Puzzle, Cipher {
    v: 1;
}

export type JSONPrimitive = string | number | boolean | null;
export type JSONSerializable =
    | JSONPrimitive
    | { toJSON(): unknown }
    | JSONSerializable[]
    | { [key: string]: JSONSerializable | undefined };
