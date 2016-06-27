/**
 * @author bmcclure
 */

module.exports = {
  name: 'ftp',
  tag: 'deployment',
  init: function () {

  },
  deploy: require('./lib/deploy'),
  ftpWrapper: require('./lib/ftp-wrapper')
};
