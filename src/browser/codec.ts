export function bytesToBase64Url(bytes: Uint8Array): string {
  if ('toBase64' in bytes && typeof bytes.toBase64 === 'function') {
    return bytes.toBase64({ alphabet: 'base64url', omitPadding: true });
  }

  const base64 = btoa(new TextDecoder('latin1').decode(bytes));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  if (
    'fromBase64' in Uint8Array &&
    typeof Uint8Array.fromBase64 === 'function'
  ) {
    return Uint8Array.fromBase64(base64Url, { alphabet: 'base64url' });
  }

  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  base64 += '=='.slice((base64.length + 2) % 4);
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}
