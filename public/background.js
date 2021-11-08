const openWindow = (url) => {
  let top = window.screen.height - 600;
  top = top > 0 ? top / 2 : 0;

  let left = window.screen.width - 360;
  left = left > 0 ? left / 2 : 0;

  window.open(
    url,
    'targetWindow',
    `toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=yes,
      width=360,
      height=600,
      top=${top},
      left=${left}`,
  );
};

const auth = (data, sender) => openWindow(
  `index.html/#/permission?tab=${sender.tab.id}&resource=${sender.origin}&reason=get_access`,
);

const createTx = (data, sender) => openWindow(
  `index.html/#/home?tab=${sender.tab.id}&resource=${sender.origin}&reason=customTx`,
);

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.type === 'auth') {
    auth(data, sender, sendResponse);
  }

  if (data.type === 'customTx') {
    createTx(data, sender, sendResponse);
  }
});
