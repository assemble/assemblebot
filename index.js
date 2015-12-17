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

module.exports = function (context, req, res) {
  var payload = context.data;
  if (payload.action !== 'opened') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 200,
      status: 'success',
      action: payload.action,
      message: 'No action taken'
    }));
    return;
  }

  if (!payload.GITHUB_TOKEN) {
    return handleError(res, 500, 'Invalid GITHUB_TOKEN');
  }

  var fs = require('fs');
  var Github = require('github-base');
  var github = new Github({
    token: payload.GITHUB_TOKEN
  });
  delete payload.GITHUB_TOKEN;

  var Engine = require('engine');
  var engine = new Engine();
  var tmpl = fs.readFileSync(__dirname + '/templates/response.tmpl', 'utf8');

  var opts = {
    body: engine.render(tmpl, payload),
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    number: payload.issue.number
  };

  github.post('/repos/:owner/:repo/issues/:number/comments', opts, function(err, data, response) {
    if (err) {
      return handleError(res, 500, err);
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      return handleError(res, +response.statusCode, response.statusMessage);
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      code: response.statusCode,
      message: response.statusMessage
    }));
  });

};

function handleError(res, status, err) {
  res.writeHead(status, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: (typeof err === 'string') ? err : err.message}));
}
