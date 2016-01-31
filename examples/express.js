'use strict';

var body = require('body-parser');
var express = require('express');
var middleware = require('githubbot-connect');
var AssembleBot = require('../');

/**
 * Create a new express app and use the body-parser middleware
 */

var app = express();
app.use(body.json());

/**
 * Create a new bot instance with a github token
 */

var bot = new AssembleBot({GITHUB_TOKEN: 'xxxxxxxxxxxxxxxx'});

/**
 * Use the `githubbot-connect` plugin to add a `middleware` method to the `bot` instance.
 */

bot.use(middleware({send: true}));

/**
 * Create a bot middleware at the `webhook` endpoint in the express app.
 * This middleware will forward requests to the correct payload handler registered
 * on the `bot` instance.
 */

app.post('/webhook', bot.middleware({send: true}));

/**
 * Start listening for requests.
 */

app.listen(process.env.PORT || 8080, function() {
  console.log('Node app is running on port', process.env.PORT || 8080);
});
