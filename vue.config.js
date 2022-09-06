// eslint-disable-next-line
const path = require('path');
// eslint-disable-next-line
const { version } = require('./package.json');
// const BackgroundScriptsPlugin = require('./webpackPlugins/BackgroundScriptsPlugin.js');

const isCordova = process.env.APP_ENV === 'cordova';
const mobileEnv = process.env.MOBILE_ENV || 'browser';

const configByEnv = {
  browser: {
    outputDir: `${version}_${process.env.OUTPUT_BUILD_DIR}`,
    addStyles: [],
  },
  mobileOton: {
    outputDir: '../oton-wallet-mobile/www',
    htmlReplaceTitle: '<title>OTON Mobile Wallet</title>',
    addStyles: [],
  },
  mobileFC: {
    outputDir: '../FC-wallet-mobile/www',
    htmlReplaceTitle: '<title>FC Mobile Wallet</title>',
    addStyles: [path.resolve(__dirname, './src/assets/styles/cordova/flight-clup.styl')],
  },
};

process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_MOBILE_ENV = mobileEnv;
process.env.VUE_APP_APP_ENV = process.env.APP_ENV;

module.exports = {
  // pages: {
  //   index: {
  //     entry: 'src/main.ts',
  //     template: 'public/index.html',
  //   },
  //   notification: {
  //     entry: 'src/content.js',
  //     filename: 'content.js',
  //   },
  // },

  publicPath: isCordova ? '' : '/',

  outputDir: isCordova ? configByEnv[mobileEnv].outputDir : configByEnv.browser.outputDir,

  configureWebpack: {
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.proto$/i,
          use: 'raw-loader',
        },
      ],
    },
    // plugins: [
    //   new BackgroundScriptsPlugin(['./src/background.js']),
    // ],
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [
        path.resolve(__dirname, './src/assets/styles/variables.styl'),
        ...(isCordova ? [path.resolve(__dirname, './src/assets/styles/cordova/index.styl')] : []),
        ...configByEnv[mobileEnv].addStyles,
      ],
    },
    htmlReplace: {
      enable: isCordova,
      patterns: [
        {
          match: '<div id="app"></div>',
          replacement: '<div id="app"></div><script src="cordova.js"></script>',
        },
        {
          match: '<title>oton-wallet-ext</title>',
          replacement: `
            ${configByEnv[mobileEnv].htmlReplaceTitle}
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' * oton.org data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' https://cdn.jsdelivr.net/ data: content:;">
            <meta name="format-detection" content="telephone=no">
            <meta name="msapplication-tap-highlight" content="no">
          `,
        },
      ],
    },
  },
  chainWebpack: (config) => {
    // config.output.chunkFilename('js/[name].[hash:8].js');
    // config.output.filename('js/[name].[hash:8].js');

    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.esm-bundler.js');
  },
};
