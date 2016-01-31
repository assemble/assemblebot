/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var GithubBot = require('githubbot');
var handlers = require('./lib/handlers');
var utils = require('./lib/utils');

/**
 * Main class for creating a new AssembleBot instance. This bot extends [GithubBot][githubbot]
 * and creates an instance of [assemble-core][] that can be used to render response templates.
 *
 * ```js
 * var bot = new AssembleBot({GITHUB_TOKEN: 'xxxxxxxxxxxxxxx'});
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
  this.initAssemble();
  this.use(handlers(this.options));
}

/**
 * Extend `GithubBot`
 */

GithubBot.extend(AssembleBot);

/**
 * Create an instance of [assemble-core] with some configured defaults:
 *
 *  - uses [assemble-loader]
 *  - uses [engine-handlebars] for ".hbs" files.
 *  - uses [handlebars-helpers]
 *  - uses [helper-issue]
 */

AssembleBot.prototype.initAssemble = function() {
  this.define('assemble', new utils.Assemble());
  this.assemble.use(utils.loader());
  this.assemble.engine('hbs', utils.engine);
  this.assemble.helpers(utils.helpers());
  this.assemble.helper('issue', utils.issue);
};

/**
 * Exposes `AssembleBot`
 */

module.exports = AssembleBot;
