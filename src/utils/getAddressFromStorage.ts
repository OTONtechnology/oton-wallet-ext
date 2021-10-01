// import extension from 'extensionizer';
import { getAddressFromHexSecret } from './cryptoKeys';
import { getStorageItem } from './extension';

const getAddressFromStorage = async (): Promise<string> => {
  const sk = await getStorageItem('addr');
  if (sk) {
    return getAddressFromHexSecret(sk);
  }

  return '';
};

export default getAddressFromStorage;
