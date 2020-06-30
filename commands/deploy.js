const chalk = require('chalk');
const shell = require('shelljs');
const npm = require('../lib/npm');
const connect = require('./connect').connect;
const hasRemoteOrigin = require('../lib/git').hasRemoteOrigin;
const parsePackageDotJson = require('../lib/files').parsePackageDotJson;

const deploy = () => {
  if(!hasRemoteOrigin()) {
    connect();
  }

  const packageDotJson = parsePackageDotJson();

  if(!packageDotJson) {
    console.log(chalk.red('No package.json found. Are you in the project root directory?'))
    return false;
  }
  if(!packageDotJson.mintbean) {
    console.log(chalk.red('No "mintbean">"scripts">"predeploy" or "deploy" found in package.json!'))
    return false
  }
  if(packageDotJson.mintbean.scripts) {
    const { predeploy, deploy} = packageDotJson.mintbean.scripts
    if(!predeploy && !deploy) {
      console.log(chalk.red('No "mintbean">"scripts">"predeploy" or "deploy" found in package.json!'))
      return false
    }
    if(predeploy) {
      console.log(chalk.cyanBright('Preparing build for deploy...'))
      shell.exec(predeploy)
    }
    if(deploy) {
      console.log(chalk.cyanBright('Deploying...'))
      shell.exec(deploy)
    }
  } else {
    console.log(chalk.red('No "mintbean">"scripts">"predeploy" or "deploy" found in package.json!'))
  }
}

module.exports = {
  deploy,
}
