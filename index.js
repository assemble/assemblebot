/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var GithubBot = require('githubbot');
var handlers = require('./src/handlers');

function AssembleBot(options) {
  if (!(this instanceof AssembleBot)) {
    return new AssembleBot(options);
  }
  GithubBot.call(this, options);
  this.use(handlers(this.options));
}

GithubBot.extend(AssembleBot);

module.exports = AssembleBot;
