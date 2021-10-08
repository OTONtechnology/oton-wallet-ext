import extension from 'extensionizer';

extension.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log(sender);
  alert(data);
  extension.tabs.create({ url: 'index.html' });
});
