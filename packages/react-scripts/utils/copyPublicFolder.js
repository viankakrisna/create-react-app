'use strict';
var fs = require('fs-extra');
var paths = require('../config/paths');
module.exports = function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
};
