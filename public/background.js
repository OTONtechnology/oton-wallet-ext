chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'sampleContextMenu',
    title: 'Sample Context Menu',
    contexts: ['selection'],
  });
});

const generateMsg = (type, data, status = 'OK') => ({
  type,
  data,
  status,
});

function isWindows() {
  return navigator.appVersion.indexOf('Win') !== -1;
}

const openWindow = (url) => {
  const width = isWindows() ? 360 + 13 : 360;
  const height = isWindows() ? 600 + 30 : 600;
  let top = window.screen.height - 600;
  top = top > 0 ? top / 2 : 0;

  let left = window.screen.width - 350;
  left = left > 0 ? left / 2 : 0;

  window.open(
    url,
    'targetWindow',
    `toolbar=no,
      location=no,
      status=no,
      menubar=yes,
      scrollbars=yes,
      resizable=no,
      width=${width},
      height=${height},
      top=${top},
      left=${left}`,
  );
};

const auth = (data, sender) => openWindow(
  `index.html#/permission?tab=${sender.tab.id}&reason=get_access&resource=${sender.origin}`,
);

const createTx = (data, sender) => openWindow(
  `index.html#/home?tab=${sender.tab.id}&resource=${sender.origin}&reason=customTx&payload=${data}`,
);

chrome.runtime.onMessage.addListener((data, sender) => {
  if (data.type === 'auth') {
    auth(data, sender);
  }

  if (data.type === 'customTs') {
    const stringified = JSON.stringify(data.payload);
    createTx(stringified, sender);
  }
});

const firstVault = (function () {
  const LOCK_AFTER = 1200; // seconds
  let hash = null;
  let timeout = null;

  function updateTimeout() {
    timeout = setTimeout(() => {
      hash = null;
      timeout = null;
    }, LOCK_AFTER * 1000);
  }

  return {
    getHash() {
      if (hash) {
        updateTimeout();
      }

      return hash;
    },

    setHash(passwordHash) {
      hash = passwordHash;
      updateTimeout();
      return hash;
    },

    dropHash() {
      hash = null;
      timeout = null;
    },
  };
}());

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.type === 'get_hash') {
      const message = generateMsg('get_hash', { hash: firstVault.getHash() });
      port.postMessage(message);
    }
    if (msg.type === 'set_hash') {
      firstVault.setHash(msg.data.hash);
      const message = generateMsg('set_hash', undefined);
      port.postMessage(message);
    }
    if (msg.type === 'drop_hash') {
      firstVault.dropHash();
      const message = generateMsg('drop_hash', undefined);
      port.postMessage(message);
    }
  });
});
