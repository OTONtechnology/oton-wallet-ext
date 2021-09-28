import * as ed from 'noble-ed25519';
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

type gafp = (pubKey: Uint8Array) => string
export const getAddressFromPubKey: gafp = (pubKey) => getSha256(pubKey).hex().substring(0, 40);

export const getAddressFromHexSecret = (sk:string): string => {
  try {
    const bSk = hexToBytes(sk);

    const pubKey = bSk.slice(-32);
    const address = getAddressFromPubKey(pubKey);

    return address;
  } catch (err) {
    return '';
  }
};

export interface IKeys {
  pk: Uint8Array; // publicKey
  sk: Uint8Array; // secretKey
  address: string;
  secret: Uint8Array;
  [key: string]: any
}

export const getKeysFromSK = async (sk: Uint8Array): Promise<IKeys> => {
  let secret = sk;
  if (secret.length === 64) {
    secret = secret.slice(0, 32);
  }

  const pk = await ed.getPublicKey(secret);

  const result: IKeys = {
    pk,
    sk: secret,
    address: getAddressFromPubKey(pk),
    secret: new Uint8Array([...Array.from(secret), ...Array.from(pk)]),
  };

  return result;
};

export const getKeysFromHexSK = async (hexSk: string): Promise<IKeys> => {
  const sk = hexToBytes(hexSk);

  return getKeysFromSK(sk);
};

const createSK = () => ed.utils.randomPrivateKey();

export const createKeys = async (): Promise<IKeys> => {
  const sk = createSK();

  return getKeysFromSK(sk);
};
