// import extension from 'extensionizer';

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  let top = window.screen.height - 600;
  top = top > 0 ? top / 2 : 0;

  let left = window.screen.width - 360;
  left = left > 0 ? left / 2 : 0;

  // chrome.windows.create({
  //   url: `index.html/#/permission?tab=${sender.tab.id}&resource=${sender.origin}`,
  //   height: 450,
  //   width: 360,
  //   focused: true,
  //   top,
  //   left,
  // });
  window.open(
    `index.html/#/permission?tab=${sender.tab.id}&resource=${sender.origin}&reason=get_access`,
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
});
