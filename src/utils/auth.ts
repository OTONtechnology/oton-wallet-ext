import { AES, enc } from 'crypto-js';
// import * as dayjs from 'dayjs';
import dayjs from 'dayjs';
import { getStorageItem, setStorageItem } from '@/utils/extension';

const isExpired = (timestamp: string | number) => dayjs().unix() > timestamp;

export const encryptSK = (sk: string, password: string): any => AES.encrypt(sk, password);

export const decryptCSK = (encryptedSK: string, password: string): any => {
  const dec: CryptoJS.lib.WordArray = AES.decrypt(encryptedSK, password);

  if (dec.sigBytes === 128) {
    return enc.Utf8.stringify(dec);
  }

  return undefined;
};

export const setLocalKey = async (decryptedKey: string) => {
  // const localKey = { value: decryptedKey, expire: Math.floor(Date.now() / 1000) + 259200 };
  const localKey = { value: decryptedKey, expire: Math.floor(Date.now() / 1000) + 259200 };
  return setStorageItem('sk', localKey, 'local');
};

export const getLocalSecret = async () => {
  let sk = await getStorageItem('sk', 'local');

  if (!sk) {
    return '';
  }

  if (typeof sk !== 'object') {
    sk = JSON.parse(sk);
  }

  if (!sk) {
    return '';
  }

  if (isExpired(sk.expire)) {
    return 'expired';
  }

  return sk.value;
};

export const getEncryptedSyncKey = async () => {
  const key = await getStorageItem('encKey', 'sync');
  if (key) {
    return key;
  }
  return '';
};

export const importWalletFunc = (sk: string, password: string) => new Promise((res) => {
  const encrypted = encryptSK(sk, password).toString();

  Promise.all(
    [
      setStorageItem('encKey', encrypted, 'sync'),
      setLocalKey(sk),
    ],
  )
    .then((resp) => res(!!(resp[0] && resp[1])));
});
