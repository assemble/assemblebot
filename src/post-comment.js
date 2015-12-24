/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Github = require('github-base');

module.exports = function(token, opts) {
  return function(body, cb) {
    var github = new Github({token: token});
    opts.body = body;
    github.post('/repos/:owner/:repo/issues/:number/comments', opts, function(err, data, res) {
      if (err) {
        err.code = 500;
        return cb(err);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        err.code = +res.statusCode;
        err.message = res.statusMessage;
        return cb(err);
      }

      cb(null, {
        status: 'success',
        code: res.statusCode,
        message: res.statusMessage
      });
    });
  };
};
