/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function error(res, err) {
  res.writeHead(err.code || 500, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({error: (typeof err === 'string') ? err : err.message}));
};
