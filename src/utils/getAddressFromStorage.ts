// import extension from 'extensionizer';
import { getLocalSecret } from './auth';
import { getAddressFromHexSecret } from './cryptoKeys';
// import { getStorageItem } from './extension';

const getAddressFromStorage = async (): Promise<string> => {
  const localSk = await getLocalSecret();

  if (localSk === 'expired') {
    return 'expired';
  }

  if (localSk) {
    return getAddressFromHexSecret(localSk);
  }

  return '';
};

export default getAddressFromStorage;
