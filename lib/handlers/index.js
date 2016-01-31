/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var handlers = require('export-dirs')(__dirname);

module.exports = function(options) {
  return function plugin(bot) {
    for(var key in handlers) {
      if (key === '_') continue;
      var handler = handlers[key];
      handler(bot, options);
    }
  };
}
