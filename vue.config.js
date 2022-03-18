// eslint-disable-next-line
const path = require('path');
// eslint-disable-next-line
const { version } = require('./package.json');
// const BackgroundScriptsPlugin = require('./webpackPlugins/BackgroundScriptsPlugin.js');

const isCordova = process.env.APP_ENV === 'cordova';

process.env.VUE_APP_VERSION = version;

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

  outputDir: isCordova ? '../oton-wallet-mobile/www' : 'dist',

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
              <title>oton mobile wallet</title>
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' *.108dev.ru *.oton.org *.oton.technology oton.org data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
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
