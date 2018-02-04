'use strict';
const fs = require('fs');
const execSync = require('child_process').execSync;
const paths = require('../../config/paths');

function verifyYarnIntegrity() {
  let yarnIntegrityFile = false;
  try {
    yarnIntegrityFile = require.resolve('.yarn-integrity');
  } catch (e) {
    //ignored;
  }
  if (yarnIntegrityFile) {
    try {
      if (!fs.existsSync(paths.yarnLockFile)) {
        return;
      }

      return execSync('yarn check --integrity');
    } catch (e) {
      console.log(`We detected that you have a ${paths.yarnLockFile} file`);
      console.log(
        `but the yarn integrity check for \n\n\t${yarnIntegrityFile}\n\n has failed`
      );
      return execSync('yarn');
    }
  }
}

module.exports = verifyYarnIntegrity;
