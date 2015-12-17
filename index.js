/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * webtask.io task to handle github webhooks
 */

var async = require('async');
var post = require('./lib/post-comment');
var error = require('./lib/error');
var config = require('./lib/config');
var render = require('./lib/render');
var success = require('./lib/success');
var template = require('./lib/template');

module.exports = function (context, req, res) {
  var payload = context.data;
  if (payload.action !== 'opened') {
    return success(res, {
      code: 200,
      status: 'success',
      action: payload.action,
      message: 'No action taken'
    });
  }

  if (!payload.GITHUB_TOKEN) {
    return error(res, 'Invalid GITHUB_TOKEN');
  }

  var token = payload.GITHUB_TOKEN;
  delete payload.GITHUB_TOKEN;

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
    if (err) return error(res, err);
    success(res, results);
  });
};
