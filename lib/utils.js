'use strict';

/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('assemble-core', 'Assemble');
require('assemble-loader', 'loader');
require('async');
require('engine-handlebars', 'engine');
require('github-base', 'Github');
require('handlebars-helpers', 'helpers');
require('helper-issue', 'issue');

/**
 * Restore `require`
 */

require = fn;

utils.truncate = function(str, len) {
  if (str.length > len) {
    return str.substr(0, len);
  }
  return str;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
