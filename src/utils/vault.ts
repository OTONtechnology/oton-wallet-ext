import { AES, enc } from 'crypto-js';
import { getAddressFromHexSecret } from './cryptoKeys';
import { setStorageItem, getStorageItem } from './extension';

const vault = (function () {
  let publicAddress = '';
  let port: any;

  function backroundMessage(type: string, data?: any) {
    return new Promise((response: any) => {
      port.postMessage({
        type,
        ...(data ? { data } : {}),
      });
      port.onMessage.addListener((msg: any) => {
        if (msg.type === type) {
          response(msg);
        }
      });
    });
  }

  async function getHash() {
    const response: any = await backroundMessage('get_hash');

    if (response.data.hash) {
      return response.data.hash;
    }
    return null;
  }

  async function setHash(hash: string) {
    const response = await backroundMessage('set_hash', { hash });
    return response;
  }

  async function dropHash() {
    const response = await backroundMessage('drop_hash');
    return response;
  }

  function setAddress(address: string) {
    publicAddress = address;
  }

  function encryptData(data: any, hash: string) {
    const stringified = JSON.stringify(data);
    const encryptedData = AES.encrypt(stringified, hash).toString();

    return encryptedData;
  }

  function decryptData(dataString: string, hash: string) {
    const dec: CryptoJS.lib.WordArray = AES.decrypt(dataString, hash);

    if (dec.sigBytes === 137) {
      const decrypted = enc.Utf8.stringify(dec);
      return JSON.parse(decrypted);
    }

    return undefined;
  }

  (function initVault() {
    console.log('init');
    // @ts-expect-error: connect exist in chrome.extension but ts thinks differently
    port = chrome.extension.connect({
      name: 'init',
    });
    port.onMessage.addListener((msg: any) => {
      if (msg.type === 'lock_app') {
        window.location.reload();
      }
    });
  }());

  return {
    async getStatus() {
      const hash: any = await getHash();

      if (hash) {
        return 'OK';
      }
      const storage = await getStorageItem('vault');

      if (storage) {
        return 'LOCK';
      }

      return 'EMPTY';
    },

    async init() {
      try {
        const hash: any = await getHash();

        if (hash) {
          const storage = await getStorageItem('vault');
          const decryptedStorage = decryptData(storage, hash);
          const address = getAddressFromHexSecret(decryptedStorage.sk);
          setAddress(address);

          return {
            status: 'OK',
          };
        }
      } catch (e) {
        return {
          status: 'ERROR',
        };
      }
    },
    async getAddress() {
      return publicAddress;
    },

    async putDataInStorage(data: any, hash: string) {
      try {
        const hashSetted: any = await setHash(hash);
        const address = getAddressFromHexSecret(data.sk);
        setAddress(address);
        const encryptedData = encryptData(data, hash);
        const settedInStorage = await setStorageItem('vault', encryptedData);

        if (hashSetted.status === 'OK' && settedInStorage) {
          return {
            status: 'OK',
          };
        }
      } catch (e) {
        return {
          status: 'ERROR',
        };
      }
    },

    async getDataFromStorage() {
      try {
        const hash: any = await getHash();

        if (hash) {
          const storage = await getStorageItem('vault');
          const decryptedStorage = decryptData(storage, hash);
          const address = getAddressFromHexSecret(decryptedStorage.sk);
          setAddress(address);

          return {
            data: {
              address,
            },
            status: 'OK',
          };
        }
      } catch (e) {
        return {
          status: 'ERROR',
        };
      }
    },

    async unlockStorage(hash: string) {
      try {
        const storage = await getStorageItem('vault');
        const decryptedStorage = decryptData(storage, hash);
        const address = getAddressFromHexSecret(decryptedStorage.sk);
        setAddress(address);

        const hashSetted: any = await setHash(hash);

        if (hashSetted) {
          return {
            status: 'OK',
          };
        }
      } catch (e) {
        return {
          status: 'ERROR',
        };
      }
    },

    async lockStorage() {
      const hashDropped: any = await dropHash();
      if (hashDropped.status === 'OK') {
        return {
          status: 'OK',
        };
      }
    },
  };
}());

export default vault;
