'use strict';
const chalk = require('chalk');
const clearConsole = require('./clearConsole');
const inquirer = require('./inquirer');

module.exports = function() {
  if (process.argv.includes('--debug')) {
    clearConsole();
    console.log(
      chalk.yellow(`You are running a debug mode of Create React App`)
    );
    console.log();
    console.log('To create a React app, install it as a global package:');
    console.log();
    console.log('  npm install -g create-react-app');
    console.log();
    console.log('And run');
    console.log();
    console.log('  create-react-app your-app-name');
    console.log();
    return inquirer
      .prompt({
        type: 'confirm',
        name: 'continue',
        message: 'continue running in debug mode?',
        default: true,
      })
      .then(answer => {
        if (answer.continue) {
          return;
        } else {
          process.exit();
        }
      });
  } else {
    return Promise.resolve();
  }
};
