/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var AssembleBot = require('../');

var config = {};
try {
  config = require('../tmp/config.js');
} catch(err) {
  config.GITHUB_TOKEN = process.env.GITHUB_TOKEN;
}

if (!config.GITHUB_TOKEN) {
  throw new Error('Tests require a GITHUB_TOKEN to either be in "' + process.cwd() + '/tmp/config.js" or on process.env.GITHUB_TOKEN');
}

var payloads = {
  created: require('./fixtures/payload-created.json'),
  opened: require('./fixtures/payload-opened.json')
};

/* deps: mocha */
describe('assemblebot', function() {
  var bot = new AssembleBot(config);

  it('should register an issues handler', function() {
    assert(bot._callbacks['$issues'].length > 0);
  });

  it('should handle an opened issues payload', function(done) {
    bot.handleIssues(payloads.opened, function(err, results) {
      if (err) return done(err);
      assert.deepEqual(results, {
        status: 'success',
        code: 201,
        message: 'Created'
      });
      done();
    });
  });

  it('should ignore a created issue payload', function(done) {
    bot.handleIssues(payloads.created, function(err, results) {
      if (err) return done(err);
      assert.deepEqual(results, {
        code: 200,
        status: 'success',
        action: 'created',
        message: 'No action taken'
      });
      done();
    });
  });
});
