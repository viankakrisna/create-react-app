'use strict';
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const crypto = require('crypto');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const clearConsole = require('./clearConsole');
const chalk = require('chalk');
const environment = process.env.NODE_ENV;

module.exports = ({ mainConfig, dllConfig, paths }) => {
  const webpackAutoDllCompiler = new WebpackAutoDllCompiler({
    main: mainConfig,
    config: dllConfig,
    output: paths.dllPath,
    entry: paths.dllSrc,
    packageJsonFile: paths.appPackageJson,
    yarnLockFile: paths.yarnLockFile,
  });
  return webpackAutoDllCompiler.build();
};

class WebpackAutoDllCompiler {
  constructor(options) {
    this.options = Object.assign({}, options);
  }

  build() {
    this.fileName = this.getFileName();
    this.config = this.options.config(this.fileName);
    return new Promise(resolve => {
      if (this.fileName === false) {
        // we cannot find this.options.entry.
        // continue without modify main config.
        return resolve(this.options.main);
      }
      //start the procedure for building dll bundle
      clearConsole();
      this.cacheManifestFile = path.join(
        this.options.output,
        this.fileName + '.js'
      );
      this.cacheFile = path.join(this.options.output, this.fileName + '.json');

      console.log('Checking if ' + this.fileName + ' dll bundle exists');
      if (this.bundleExists()) {
        console.log(chalk.green('Dll bundle is up to date and safe to use!'));
        // Just run the main compiler if dll bundler is up to date
        return resolve(this.getModifiedMainConfig(this.options.main));
      }
      console.log('Dll bundle needs to be compiled...');
      // Read dll path for stale files
      try {
        this.cachedFiles = fs.readdirSync(this.options.output);
      } catch (ignored) {
        //ignored
      }
      this.compile(resolve);
    });
  }

  compile(resolve) {
    this.cleanUp(this.cachedFiles);

    console.log('Compiling dll bundle for faster rebuilds...');
    webpack(this.config).run((err, stats) => {
      checkForErrors(err, stats);

      // When the process still run until here, there are no errors :)
      console.log(chalk.green('Dll bundle compiled successfully!'));
      resolve(this.getModifiedMainConfig(this.options.main)); // Let the main compiler do its job
    });
  }

  getFileName() {
    if (fs.existsSync(this.options.entry)) {
      const hash = crypto.createHash('md5');
      const input = fs.readFileSync(this.options.entry);
      const appPackageJson = fs.readFileSync(this.options.packageJsonFile);

      hash.update(input);
      hash.update(appPackageJson);

      if (fs.existsSync(this.options.yarnLockFile)) {
        hash.update(fs.readFileSync(this.options.yarnLockFile));
      }

      return [environment, hash.digest('hex').substring(0, 8)].join('.');
    } else {
      return false;
    }
  }

  bundleExists() {
    return fs.existsSync(this.cacheFile) &&
      fs.existsSync(this.cacheManifestFile);
  }

  cleanUp(files) {
    try {
      // delete all stale dll bundle for this environment
      files.filter(file => !file.indexOf(environment)).forEach(file => {
        fs.unlinkSync(path.join(this.options.output, file));
      });
    } catch (ignored) {
      //ignored
    }
  }

  getModifiedMainConfig() {
    const main = this.options.main;
    return Object.assign({}, main, {
      entry: main.entry.filter(path => !this.config.entry.includes(path)),
      plugins: main.plugins
        .concat([
          new WebpackAdditionalSourceHashPlugin({
            additionalSourceHash: this.fileName,
          }),
          new webpack.DllReferencePlugin({
            context: '.',
            manifest: require(this.cacheFile),
          }),
          new AddAssetHtmlPlugin({
            outputPath: path.join('static', 'js'),
            publicPath: main.output.publicPath + path.join('static', 'js'),
            filepath: require.resolve(this.cacheManifestFile),
          }),
        ])
        .map(plugin => {
          if (plugin.constructor.name === 'ManifestPlugin') {
            plugin.opts.cache = {
              'dll.js': path.join('static', 'js', this.fileName + '.js'),
              'dll.js.map': path.join(
                'static',
                'js',
                this.fileName + '.js.map'
              ),
            };
          }
          return plugin;
        }),
    });
  }
}

// inspired by https://github.com/erm0l0v/webpack-md5-hash/blob/da8efa2fc7fe5c373c95f9ba859dbe208a8b844b/plugin/webpack_md5_hash.js
class WebpackAdditionalSourceHashPlugin {
  constructor({ additionalSourceHash }) {
    this.additionalSourceHash = additionalSourceHash;
  }
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('chunk-hash', (chunk, chunkHash) => {
        const oldHash = chunkHash.digest();
        chunkHash.digest = () => {
          const hash = crypto.createHash('md5');
          hash.update(this.additionalSourceHash);
          hash.update(oldHash);
          return hash.digest('hex');
        };
      });
    });
  }
}

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function checkForErrors(err, stats) {
  if (err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  if (stats.compilation.errors.length) {
    printErrors('Failed to compile.', stats.compilation.errors);
    process.exit(1);
  }

  if (process.env.CI && stats.compilation.warnings.length) {
    printErrors(
      'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
      stats.compilation.warnings
    );
    process.exit(1);
  }
}
