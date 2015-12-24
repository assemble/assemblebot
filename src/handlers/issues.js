/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var async = require('async');

var post = require('../post-comment');
var error = require('../error');
var config = require('../config');
var render = require('../render');
var success = require('../success');
var template = require('../template');

module.exports = function(bot, options) {
  options = options || {};

  bot.onIssues(function(payload, cb) {
    if (payload.action !== 'opened') {
      return success(cb, {
        code: 200,
        status: 'success',
        action: payload.action,
        message: 'No action taken'
      });
    }

    if (!options.GITHUB_TOKEN) {
      return error(res, 'Invalid GITHUB_TOKEN');
    }

    var token = options.GITHUB_TOKEN;

    // options to use when pulling down files from this repo.
    var repoOpts = {
      token: token,
      owner: 'assemble',
      repo: 'assemblebot'
    };

    // options used to post comments
    var commentOpts = {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      number: payload.issue.number
    };

    async.waterfall([
      config(payload, repoOpts),
      template(repoOpts),
      render(payload),
      post(token, commentOpts),
    ], function(err, results) {
      if (err) return error(cb, err);
      success(cb, results);
    });
  });
};
