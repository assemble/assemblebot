/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function error(cb, err) {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  cb(err);
};
