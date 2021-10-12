// import extension from 'extensionizer';

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(sender.tab.id);
  // alert(data);
  // chrome.tabs.create({ url: 'index.html' });
  chrome.windows.create({ url: `index.html/#/permission?tab=${sender.tab.id}` });
});
