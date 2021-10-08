import extension from 'extensionizer';

document.addEventListener('getAddress', (data) => {
  extension.runtime.sendMessage(data.detail);
});
