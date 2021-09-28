import { Hasher, sha256 } from 'js-sha256';

export const bytesToHex = function bytesToHex(uint8a: Uint8Array): string {
  // pre-caching chars could speed this up 6x.
  let hex = '';
  for (let i = 0; i < uint8a.length; i += 1) {
    hex += uint8a[i].toString(16).padStart(2, '0');
  }
  return hex;
};

export const hexToBytes = function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new TypeError(`hexToBytes: expected string, got ${typeof hex}`);
  }
  if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i += 1) {
    const j = i * 2;
    array[i] = Number.parseInt(hex.slice(j, j + 2), 16);
  }
  return array;
};

export const stringToHex = (s:string): string => {
  let hex = '';
  let i = 0;

  let result = '';

  for (i; i < s.length; i += 1) {
    hex = s.charCodeAt(i).toString(16);
    result += (`000${hex}`).slice(-4);
  }

  return result;
};

export const hexToString = (s:string): string => {
  let j = 0;
  const hexes = s.match(/.{1,4}/g) || [];
  let result = '';

  for (j; j < hexes.length; j += 1) {
    result += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return result;
};

export const getSha256: Hasher['update'] = (key) => sha256
  .create()
  .update(key);
