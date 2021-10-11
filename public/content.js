// import extension from 'extensionizer';

document.addEventListener('getAddress', (data) => {
  chrome.runtime.sendMessage(data.detail);
});
