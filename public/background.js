function isWindows() {
  return navigator.appVersion.indexOf('Win') !== -1;
}

const openWindow = (url) => {
  const width = isWindows() ? 360 + 13 : 360;
  const height = 600;
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
