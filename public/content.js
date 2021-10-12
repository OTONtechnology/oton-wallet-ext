// import extension from 'extensionizer';

document.addEventListener('app:auth', (data) => {
  chrome.runtime.sendMessage(data.detail);
});

chrome.runtime.onMessage.addListener(
  (data) => {
    if (data.type && data.type === 'toContent:authData') {
      const event = new CustomEvent('owe:setAddress', { detail: cdata });
      document.dispatchEvent(event);
    }
  },
);
