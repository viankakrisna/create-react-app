// @remove-file-on-eject
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
<<<<<<< HEAD
  presets: [require.resolve('babel-preset-react-app'), require.resolve('babel-preset-stage-0')],
plugins: [require.resolve('babel-plugin-transform-decorators-legacy')],
  babelrc: false
=======
  presets: [require.resolve('babel-preset-react-app')],
  babelrc: false,
>>>>>>> watch
});
