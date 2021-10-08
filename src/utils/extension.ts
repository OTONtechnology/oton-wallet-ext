import extension from 'extensionizer';
import { toString } from 'rambda';
import { ENVIRONMENT_TYPE_FULLSCREEN, ENVIRONMENT_TYPE_POPUP } from './constants';

function checkForError() {
  const { lastError } = extension.runtime;
  if (!lastError) {
    return undefined;
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError;
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message);
}

export const getEnvironmentType = () => {
  if (extension.extension) {
    return ENVIRONMENT_TYPE_POPUP;
  }
  return ENVIRONMENT_TYPE_FULLSCREEN;
};

export const openTab = (options: any) => new Promise((resolve, reject) => {
  extension.tabs.create(options, (newTab: any) => {
    const error = checkForError();
    if (error) {
      return reject(error);
    }
    return resolve(newTab);
  });
});

export const clearStorage = (type = 'local') => new Promise((res, rej) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage[type].clear(() => {
      const error = checkForError();
      if (error) {
        return rej(error);
      }
      return res(true);
    });
  } else if (envType === ENVIRONMENT_TYPE_FULLSCREEN) {
    localStorage.clear();
    res(true);
  }
});

export const getStorageItem = (name: string, type = 'local'): any => new Promise((res, rej) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage[type].get(name, (response: any) => {
      if (response && response[name]) {
        return res(response[name]);
      }
      return res('');
    });
  } else if (envType === ENVIRONMENT_TYPE_FULLSCREEN) {
    res(localStorage.getItem(name));
  }
});

export const setStorageItem = (name: string, value: string | Record<string, unknown>, type = 'local'): any => new Promise((res, rej) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage[type].set({ [name]: value }, () => {
      const error = checkForError();

      if (error) {
        return rej(error);
      }
      return res(true);
    });
  } else if (envType === ENVIRONMENT_TYPE_FULLSCREEN) {
    if (typeof value === 'string') {
      localStorage.setItem(name, value);
      res(true);
    } else {
      const string = JSON.stringify(value);
      localStorage.setItem(name, string);
      res(true);
    }
  }
});

export const openExtensionInBrowser = (route = null, queryString = null) => {
  let extensionURL = extension.runtime.getURL('index.html');

  if (queryString) {
    extensionURL += `?${queryString}`;
  }

  if (route) {
    extensionURL += `#${route}`;
  }
  openTab({ url: extensionURL });
  window.close();
  // if (getEnvironmentType() !== ENVIRONMENT_TYPE_BACKGROUND) {
  //   window.close();
  // }
};

export const sendMessageToExtension = () => new Promise((res, rej) => {
  const extId = 'acnemppcfdbegflceimmpbganhbigjce';
  const url = '';

  console.log(chrome.runtime);
  // extension.runtime.sendMessage(extId, { openUrlInEditor: url },
  //   (response: any) => {
  //     if (!response.success) {
  //       rej();
  //     } else {
  //       res(response);
  //     }
  //   });
});
