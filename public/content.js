document.addEventListener('app:auth', (data) => {
  chrome.runtime.sendMessage(data.detail);
});

document.addEventListener('app:customTs', (data) => {
  chrome.runtime.sendMessage(data.detail);
});

chrome.runtime.onMessage.addListener(
  (data) => {
    if (data.type && data.type === 'toContent:authData') {
      const event = new CustomEvent('owe:setAuData', { detail: data.payload });
      document.dispatchEvent(event);
    }

    if (data.type && data.type === 'toContent:customTx') {
      const event = new CustomEvent('owe:customTs', { detail: data.payload });
      document.dispatchEvent(event);
    }
  },
);
