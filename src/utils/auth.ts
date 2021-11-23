import { AES, enc } from 'crypto-js';
// import * as dayjs from 'dayjs';
import dayjs from 'dayjs';
import { getStorageItem, setStorageItem } from '@/utils/extension';

const isExpired = (timestamp: string | number) => dayjs().unix() > timestamp;

export const encryptSK = (sk: string, password: string): any => AES.encrypt(sk, password);

export const decryptCSK = (encryptedSK: string, password: string): any => {
  const dec: CryptoJS.lib.WordArray = AES.decrypt(encryptedSK, password);
  return enc.Utf8.stringify(dec);
};

export const setSyncKey = async (encryptedKey: string) => {
  const result = await setStorageItem('encKey', encryptedKey, 'sync');
  return result;
};

export const setLocalKey = async (decryptedKey: string) => {
  const localKey = { value: decryptedKey, expire: Math.floor(Date.now() / 1000) + 259200 };
  return setStorageItem('sk', localKey, 'local');
};

export const getLocalSecret = async () => {
  const sk = await getStorageItem('sk', 'local');
  if (sk) {
    if (typeof sk === 'object') {
      if (isExpired(sk.expired)) {
        return '';
      }
      return sk.value;
    }

    const parsed = JSON.parse(sk);
    if (!parsed || isExpired(parsed.expired)) {
      return '';
    }
    return parsed.value;
  }
  return '';
};

export const importWalletFunc = (sk: string, password: string) => new Promise((res) => {
  const encrypted = encryptSK(sk, password).toString();

  Promise.all([setSyncKey(encrypted), setLocalKey(sk)]).then((resp) => res(!!(resp[0] && resp[1])));
});
