import { AES, enc } from 'crypto-js';
import { isChrome } from './constants';
import { getAddressFromHexSecret } from './cryptoKeys';
import { setStorageItem, getStorageItem, clearStorage } from './extension';

const generateMsg = (type: 'get_hash' | 'set_hash' | 'drop_hash', data = {}, status = 'OK') => ({
  type,
  data,
  status,
});

const vault = (() => {
  let publicAddress = '';
  let port: any;

  function storageMessage(type: string, data?: any) {
    return new Promise((resolve) => {
      switch (type) {
        case 'get_hash':
          resolve(generateMsg('get_hash', { hash: localStorage.getItem('hash') }));
          break;
        case 'set_hash':
          localStorage.setItem('hash', data.hash);
          resolve(generateMsg('set_hash'));
          break;
        case 'drop_hash':
          localStorage.removeItem('hash');
          resolve(generateMsg('drop_hash'));
          break;
        default:
          resolve(generateMsg('get_hash', { hash: localStorage.getItem('hash') }));
      }
    });
  }

  function backroundMessage(type: 'get_hash' | 'set_hash' | 'drop_hash', data?: any) {
    if (typeof port === 'undefined') {
      return storageMessage(type, data);
    }
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

  // Get password hash from background vault

  async function getHash() {
    const response: any = await backroundMessage('get_hash');

    if (response.data.hash) {
      return response.data.hash;
    }
    return null;
  }

  // Set password hash in background vault

  async function setHash(hash: string) {
    const response = await backroundMessage('set_hash', { hash });
    return response;
  }

  // Drop background vault data

  async function dropHash() {
    const response = await backroundMessage('drop_hash');
    return response;
  }

  //  Wallet public address (not required for encryption)

  function setAddress(address: string) {
    publicAddress = address;
  }

  // Encrypting data before save in local storage

  function encryptData(data: any, hash: string) {
    const stringified = JSON.stringify(data);
    const encryptedData = AES.encrypt(stringified, hash).toString();

    return encryptedData;
  }

  // Decrypting data after fetching from storage

  function decryptData(dataString: string, hash: string) {
    const dec: CryptoJS.lib.WordArray = AES.decrypt(dataString, hash);

    if (dec.sigBytes === 137) {
      const decrypted = enc.Utf8.stringify(dec);
      return JSON.parse(decrypted);
    }

    return undefined;
  }

  // Initing connection with background script

  (function initVault() {
    console.info('init');

    if (!isChrome) {
      port = undefined;
      return;
    }

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

    // Get the status of vault data and checking data availability in storage

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

    // Vault initing

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

    // Get public address

    async getAddress() {
      return publicAddress;
    },

    // Set storage data

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

    // Get and decrypt sk from storage

    async getDataFromStorage() {
      try {
        const hash: any = await getHash();

        if (hash) {
          const storage = await getStorageItem('vault');
          const decryptedStorage = decryptData(storage, hash);
          const address = getAddressFromHexSecret(decryptedStorage.sk);
          setAddress(address);

          return decryptedStorage.sk;
        }
      } catch (e) {
        return undefined;
      }
    },

    // Unlocking background vault by password hash

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

    // Locking background vault by hash deleting

    async lockStorage() {
      const hashDropped: any = await dropHash();
      if (hashDropped.status === 'OK') {
        return {
          status: 'OK',
        };
      }
    },

    async deleteAllData() {
      const hashDropped: any = await dropHash();
      const storageCleared: any = await clearStorage();
      if (hashDropped.status === 'OK' && storageCleared) {
        return {
          status: 'OK',
        };
      }
    },
  };
})();

export default vault;
