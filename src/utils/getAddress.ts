import extension from 'extensionizer';

const getAddress = async (): Promise<string> => new Promise((resolve) => {
  extension.storage.local.get('addr', (res: any) => {
    if (res && res.addr) {
      resolve(res.addr);
    }
    resolve('');
  });
});

export default getAddress;
