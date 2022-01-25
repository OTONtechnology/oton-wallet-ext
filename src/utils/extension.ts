import extension from 'extensionizer';
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

export const clearStorage = () => new Promise((res, rej) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage.local.clear(() => {
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

export const getStorageItem = (name: string): any => new Promise((res) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage.local.get(name, (response: any) => {
      if (response && response[name]) {
        return res(response[name]);
      }
      return res('');
    });
  } else if (envType === ENVIRONMENT_TYPE_FULLSCREEN) {
    res(localStorage.getItem(name));
  }
});

// eslint-disable-next-line
export const setStorageItem = (name: string, value: string | Record<string, unknown>): any => new Promise((res, rej) => {
  const envType = getEnvironmentType();

  if (envType === ENVIRONMENT_TYPE_POPUP) {
    extension.storage.local.set({ [name]: value }, () => {
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
};

export const sendMessageToTab = () => new Promise(() => {
  extension.tabs.sendMessage({ payload: { address: 'some address' } });
});
