'use strict';
const path = require('path');
const fs = require('fs');
const paths = require('./paths');
const blacklistEntryPoints = [];
const additionalFiles = process.env.NODE_ENV === 'production'
  ? [require.resolve('./polyfills')]
  : [
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      // We ship a few polyfills by default:
      require.resolve('./polyfills'),
      // Errors should be considered fatal in development
      require.resolve('react-error-overlay'),
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ];

try {
  module.exports = fs
    .readdirSync(paths.appSrc)
    .filter(fileName => {
      return !blacklistEntryPoints.includes(fileName) &&
        fileName.startsWith('index') &&
        fileName.endsWith('.js');
    })
    .reduce(
      (res, fileName) => {
        res[
          fileName === 'index.js'
            ? 'index'
            : fileName.replace('index.', '').replace('.js', '')
        ] = additionalFiles.concat(path.join(paths.appSrc, fileName));
        return res;
      },
      {}
    );
} catch (e) {
  module.exports = {};
}
