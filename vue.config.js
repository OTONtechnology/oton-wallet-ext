// eslint-disable-next-line
const path = require('path');

module.exports = {
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
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [path.resolve(__dirname, './src/assets/styles/variables.styl')],
    },

    // svgSprite: {
    //   /*
    //    * The directory containing your SVG files.
    //    */
    //   dir: 'src/assets/svg',
    //   /*
    //    * The regex that will be used for the Webpack rule.
    //    */
    //   test: /\.(svg)(\?.*)?$/,
    //   /*
    //    * @see https://github.com/kisenka/svg-sprite-loader#configuration
    //    */
    //   loaderOptions: {
    //     extract: true,
    //     spriteFilename: 'img/icons.[hash:8].svg', // or 'img/icons.svg' if filenameHashing == false
    //   },
    //   /*
    //    * @see https://github.com/kisenka/svg-sprite-loader#configuration
    //    */
    //   pluginOptions: {
    //     plainSprite: true,
    //   },
    // },
  },
  chainWebpack: (config) => {
    // config.output.chunkFilename('js/[name].[hash:8].js');
    // config.output.filename('js/[name].[hash:8].js');

    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.esm-bundler.js');
  },
};
