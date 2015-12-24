/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Engine = require('engine');

module.exports = function(data) {
  return function(tmpl, cb) {
    var engine = new Engine();
    try {
      var contents = engine.render(tmpl, data);
      cb(null, contents);
    } catch (err) {
      cb(err);
    }
  };
};
