// import extension from 'extensionizer';
import { getStorageItem } from './extension';

const getAddress = (): any => getStorageItem('addr');

export default getAddress;
