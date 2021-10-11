// import extension from 'extensionizer';

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(sender);
  alert(data);
  // chrome.tabs.create({ url: 'index.html' });
  chrome.windows.create({ url: 'index.html/#/permission', type: 'popup' });
});
