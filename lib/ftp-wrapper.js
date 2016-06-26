/**
 * Created by Ben on 6/25/2016.
 */

var ftpClient = require('ftp');
var async = require('async');

module.exports = FtpWrapper;

function FtpWrapper(config, cwd) {
  this.config = config;
  this.cwd = cwd;
  this.client = new ftpClient();

  var wrapper = this;

  this.asyncRequest = function (paths, callback, done) {
    wrapper.client.on('ready', function () {
      wrapper.client.cwd(wrapper.cwd, function (error) {
        if (error) {
          callback(error);

          return;
        }

        async.each(paths, callback, done);
      });
    });
  };

  this.createDirs = function (dirs, callback) {
    wrapper.asyncRequest(dirs, function (dir, callback) {
      wrapper.client.mkdir(dir, true, callback);
    }, callback);
  };

  this.deleteDirs = function (dirs, callback) {
    wrapper.asyncRequest(dirs, function (dir, callback) {
      wrapper.client.list(dir, function (error, list) {
        if (!error && !list) {
          wrapper.client.rmdir(dir, callback);
        } else {
          callback(error);
        }
      });
    }, callback);
  };

  this.uploadFiles = function (files, callback) {
    wrapper.asyncRequest(files, function (file, callback) {
      wrapper.client.put(file, file, callback);
    }, callback);
  };

  this.deleteFiles = function (files, callback) {
    wrapper.asyncRequest(files, function (file, callback) {
      wrapper.client.delete(file, callback);
    }, callback);
  };

  this.process = function (files, callback) {
    async.series([
      function (callback) {
        wrapper.createDirs(files.dirs.needed, function (error) {
          if (error) {
            console.error('Could not create required directories on the FTP server');
          }

          callback(error);
        });
      },
      function (callback) {
        wrapper.uploadFiles(files.modified, function (error) {
          if (error) {
            console.error('Could not upload modified files to the FTP server');
          }

          callback(error);
        });
      },
      function (callback) {
        wrapper.deleteFiles(files.deleted, function (error) {
          if (error) {
            console.error('Could not delete files from the FTP server');
          }

          callback(error);
        });
      }, function (callback) {
        wrapper.deleteDirs(files.dirs.notNeeded, function (error) {
          if (error) {
            console.error('Could not delete unneeded directories from the FTP server');
          }

          callback(error);
        });
      }, function (callback) {
        wrapper.client.connect(wrapper.config);

        callback();
      }
    ], function (error, results) {
      wrapper.client.end();

      callback(error, results);
    });
  }
}
