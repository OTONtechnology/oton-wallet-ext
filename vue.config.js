// eslint-disable-next-line
const path = require('path');
// const BackgroundScriptsPlugin = require('./webpackPlugins/BackgroundScriptsPlugin.js');
const isCordova = process.env.APP_ENV === 'cordova';

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

  outputDir: isCordova ? '../cordova-test/www' : 'dist',

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
      patterns: [path.resolve(__dirname, './src/assets/styles/variables.styl')],
    },
    htmlReplace: {
      enable: isCordova,
      patterns: [
        {
          match: '<!-- cordova-replace-script -->',
          replacement: '<script src="cordova.js"></script><script src="js/index.js"></script>',
        },
        {
          match: '<!-- cordova-replace-meta -->',
          replacement: `
            <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
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
