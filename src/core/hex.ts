export function arrayToHex(array: Uint8Array): string {
    if (typeof Buffer !== 'undefined') return Buffer.from(array).toString('hex');
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hexToArray(hexString: string): Uint8Array<ArrayBuffer> {
    const matches = hexString.match(/.{1,2}/g);
    if (!matches) return new Uint8Array(0);
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}
