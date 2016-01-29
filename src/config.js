/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

// var GithubContent = require('github-content');

/**
 * Pull down the config from github.
 */

module.exports = function config(payload, opts) {
  return function(cb) {
    cb(null, 'response');

    // var client = new GithubContent(opts);
    // client.file('templates/' + filename, function(err, file) {
    //   if (err) return cb(err);
    //   cb(null, file.contents);
    // });
  };
};
