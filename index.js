/**
 * @author bmcclure
 */

var deploytool = require('deploytool');

module.exports = {
  deploy: function (environment, commit, callback) {
    if (typeof environment === 'string') {
      environment = deploytool.environment.load(environment);
    }

    environment.applyDefaults({
      type: 'ftp'
    });

    var config = environment.config;

    // Deploy based on diff list
  }
};
