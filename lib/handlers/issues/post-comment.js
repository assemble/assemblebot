/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';
var utils = require('../../utils');

module.exports = function(token, opts) {
  return function(body, cb) {
    var github = new utils.Github({token: token});
    opts.body = body;
    github.post('/repos/:owner/:repo/issues/:number/comments', opts, function(err, data, res) {
      if (err) {
        err.code = 500;
        return cb(err);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        err = new Error(res.statusMessage);
        err.code = +res.statusCode;
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
