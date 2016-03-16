/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var post = require('./post-comment');
var error = require('./error');
var config = require('./config');
var render = require('./render');
var success = require('./success');

/**
 * Handles responding to newely open github issues.
 *
 * Will post a comment on a newely open github issue as the configured github user.
 * Uses a template that can be rendered with the issue payload providing more context and a richer response.
 *
 * See the github webhook [issues event](https://developer.github.com/v3/activity/events/types/#issuesevent) for specification of payload object.
 *
 * ```js
 * bot.handleIssues(payload, function(err, results) {
 *   if (err) return console.error(err);
 *   console.log(results);
 * });
 * ```
 *
 * @api public
 * @name issues
 */

var utils = require('../../utils');

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

    var data = {
      title: utils.truncate(payload.issue.title, 50),
      body: utils.truncate(payload.issue.body, 100)
    };

    // sets up common libraries that people ask questions about on the main `assemble` repo.
    payload.others = [
      {
        name: 'grunt-assemble',
        repo: 'assemble/grunt-assemble',
        description: 'Issues with using assemble in grunt or the grunt-assemble library.',
        data: data
      },
      {
        name: 'handlebars-helpers',
        repo: 'assemble/handlebars-helpers',
        description: 'Issues with using handlebars helpers from the handlebars-helpers library.',
        data: data
      }
    ];

    utils.async.waterfall([
      config(payload, repoOpts),
      render(bot.assemble, payload),
      post(token, commentOpts),
    ], function(err, results) {
      if (err) return error(cb, err);
      success(cb, results);
    });
  });
};
