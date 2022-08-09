// images

// HTTP statuses
export const INIT = 'INIT';
export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';

// Extension types

export const ENVIRONMENT_TYPE_POPUP = 'popup';
export const ENVIRONMENT_TYPE_NOTIFICATION = 'notification';
export const ENVIRONMENT_TYPE_FULLSCREEN = 'fullscreen';
export const ENVIRONMENT_TYPE_BACKGROUND = 'background';

// Transaction types

export const TRANSACTION_TYPES = {
};

export const configByEnv = {
  browser: {
    backPicUrl: '/img/oton_wallet_background.png',
    svgBigLogo: '#logo--sprite',
    svgSmLogo: '#ic_logo--sprite',
    appName: 'OTON Wallet',
  },
  mobileOton: {
    backPicUrl: '/img/oton_wallet_background.png',
    svgBigLogo: '#logo--sprite',
    svgSmLogo: '#ic_logo--sprite',
    appName: 'OTON Wallet',
  },
  mobileFC: {
    backPicUrl: '/img/FC_wallet_background.png',
    svgBigLogo: '#fc-logo--sprite',
    svgSmLogo: '#ic_fc-logo--sprite',
    appName: 'Flight Clup',
  },
};

export const isCordova = process.env.VUE_APP_APP_ENV === 'cordova';
export const mobileEnv = process.env.VUE_APP_MOBILE_ENV as keyof typeof configByEnv;
export const isChrome = Object.prototype.hasOwnProperty.call(globalThis, 'chrome');

export const currentAppConfig = configByEnv[mobileEnv];
