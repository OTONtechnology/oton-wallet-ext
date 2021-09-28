import * as ed from 'noble-ed25519';
import { getSha256, hexToBytes } from './crypto';

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
