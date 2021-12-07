class BackgroundScriptsPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    console.log("build files: ", this.options);
  }
}

module.exports = BackgroundScriptsPlugin;