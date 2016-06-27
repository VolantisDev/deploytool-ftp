/**
 * Created by Ben on 6/25/2016.
 */

var deploytool = require('deploytool');
var FtpWrapper = require('./ftp-wrapper');
var gitDiff = require('deploytool-git-diff');

module.exports = function (environment, commit, callback) {
  environment = deploytool.environment.init(environment, {
    type: 'ftp',
    ftp: {
      host: 'localhost',
      port: 21,
      user: '',
      password: ''
    }
  });

  var config = environment.config;

  gitDiff.deployFiles(environment, commit, function (error, files) {
    var ftp = new FtpWrapper(config.ftp, config.remotePath);

    ftp.process(files, function (error, stdout) {
      if (error) {
        console.error('Error deploying to environment ' + config.name);
      } else {
        console.log('Successfully deployed to environment ' + config.name);
      }

      callback(error, stdout);
    });
  });
};
