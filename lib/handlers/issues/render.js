/*!
 * assemblebot <https://github.com/assemble/assemblebot>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');

module.exports = function(app, data) {
  app.create('templates');
  app.templates([path.join(__dirname, '../../..', 'templates', '*.hbs')]);

  return function(name, cb) {
    var tmpl = app.templates.getView(name);
    if (!tmpl) {
      return cb(new Error('Cannot find template "' + name + '"'));
    }

    tmpl.render(data, function(err, results) {
      if (err) return cb(err);
      cb(null, results.content);
    });
  };
};
