/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var GithubContent = require('github-content');

/**
 * Pull down the template from github.
 */

module.exports = function template(opts) {
  return function(filename, cb) {
    var client = new GithubContent(opts);
    client.file('templates/' + filename, function(err, file) {
      if (err) return cb(err);
      cb(null, file.content);
    });
  };
};
