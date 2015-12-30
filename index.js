/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var GithubBot = require('githubbot');
var handlers = require('./src/handlers');

/**
 * Main class for creating a new AssembleBot instance. This bot extends [GithubBot][githubbot] and adds
 * sepcific handlers for responding to [assemble][assemble] issues.
 *
 * ```js
 * var bot = new AssembleBot({GITHUB_TOKEN: 'XXX'});
 * ```
 *
 * @param {Object} `options` Options to use to configure the bot.
 * @param {String} `options.GITHUB_TOKEN` Personal github token the bot uses to post to github issues.
 * @api  public
 */

function AssembleBot(options) {
  if (!(this instanceof AssembleBot)) {
    return new AssembleBot(options);
  }
  GithubBot.call(this, options);
  this.use(handlers(this.options));
}

/**
 * Extend `GithubBot`
 */

GithubBot.extend(AssembleBot);

/**
 * Exposes `AssembleBot`
 */

module.exports = AssembleBot;
