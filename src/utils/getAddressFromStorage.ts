import { getLocalSecret } from './auth';
import { getAddressFromHexSecret } from './cryptoKeys';

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
