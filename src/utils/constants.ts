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
    legals: [
      {
        name: 'terms',
        link: 'https://contracts.oton.technology/OTONWallet_TermsOfUse.pdf',
        label: 'Terms of Use',
      },
      {
        name: 'privacy',
        link: 'https://contracts.oton.technology/OTONWallet_PrivacyPolicy.pdf',
        label: 'Privacy Policy',
      },
    ],
  },
  mobileOton: {
    backPicUrl: '/img/oton_wallet_background.png',
    svgBigLogo: '#logo--sprite',
    svgSmLogo: '#ic_logo--sprite',
    appName: 'OTON Wallet',
    legals: [
      {
        name: 'terms',
        link: 'https://contracts.oton.technology/OTONWallet_TermsOfUse.pdf',
        label: 'Terms of Use',
      },
      {
        name: 'privacy',
        link: 'https://contracts.oton.technology/OTONWallet_PrivacyPolicy.pdf',
        label: 'Privacy Policy',
      },
    ],
  },
  mobileFC: {
    backPicUrl: '/img/fc_wallet_background.png',
    svgBigLogo: '#fc-logo--sprite',
    svgSmLogo: '#ic_fc-logo--sprite',
    appName: 'Flight Clup',
    legals: [
      {
        name: 'terms',
        link: 'https://dev.flight-clup-front.pages.dev/docs/Terms%20and%20conditions.pdf',
        label: 'Terms and conditions',
      },
    ],
  },
};

export const isCordova = process.env.VUE_APP_APP_ENV === 'cordova';
export const mobileEnv = process.env.VUE_APP_MOBILE_ENV as keyof typeof configByEnv;
export const isChrome = Object.prototype.hasOwnProperty.call(globalThis, 'chrome');

export const currentAppConfig = configByEnv[mobileEnv];
