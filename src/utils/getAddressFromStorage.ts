// import extension from 'extensionizer';
import { getAddressFromHexSecret } from './cryptoKeys';
import { getStorageItem } from './extension';

const getAddressFromStorage = async (): Promise<string> => {
  const sk = await getStorageItem('addr');
  return getAddressFromHexSecret(sk);
};

export default getAddressFromStorage;
