/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var assert = require('assert');
var request = require('supertest');
var body = require('body-parser');
var express = require('express');

var config = require('./tmp/config.js');
var AssembleBot = require('./');

/* deps: mocha */
describe('assemblebot', function() {
  var bot = new AssembleBot(config);

  var app = express();
  app.use(body.json());

  app.post('/autosend', bot.middleware({send: true}));
  app.post('/wrapped', function(req, res, next) {
    var fn = bot.middleware();
    fn(req, res, function(err, results) {
      if (err) return next(err);
      res.json(results);
    });
  });

  it('should register an issues handler', function() {
    assert(bot._callbacks['$issues'].length > 0);
  });
});
