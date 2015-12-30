/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');

var config = require('./tmp/config.js');
var AssembleBot = require('./');

/* deps: mocha */
describe('assemblebot', function() {
  var bot = new AssembleBot(config);

  it('should register an issues handler', function() {
    assert(bot._callbacks['$issues'].length > 0);
  });
});
