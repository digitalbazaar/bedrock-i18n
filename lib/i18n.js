/*
 * Bedrock Internationalization module.
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var async = require('async');
var bedrock = require('bedrock');
var i18n = require('i18n');
var path = require('path');
var walk = require('walk');

// load config defaults
require('./config');

// stat cache of available i18n files
var i18nCache = {};

// setup internationalization
i18n.configure({
  // English is the only supported language at present
  locales: bedrock.config.i18n.locales,
  // the path to the locale files
  directory: path.resolve(bedrock.config.i18n.localePath),
  // whether or not to update the locale files during runtime
  updateFiles: bedrock.config.i18n.writeLocales,
  // register __() and __n() as global
  register: global
});

bedrock.events.on('bedrock.start', init);

function init(callback) {
  // build i18n stat cache
  var paths = bedrock.config.express.static;
  async.forEach(paths, function(base, callback) {
    var route = '/';
    if(typeof base === 'object') {
      route = base.route;
      base = base.path;
    }
    base = path.resolve(base);
    var walker = walk.walk(base, {followLinks: true});
    walker.on('file', function(root, stat, next) {
      // remove base and language
      var dir = root.substr(base.length);
      var parts = dir.split(path.sep);
      if(parts[0] === '') {
        parts.shift();
      }
      var language = '';
      language = parts[0] || '';
      dir = dir.substr(language.length + path.sep.length);
      if(!(language in i18nCache)) {
        i18nCache[language] = {};
      }
      var reqPath = path.join(route, dir, stat.name);
      i18nCache[language][reqPath] = path.join(route, language, dir, stat.name);
      next();
    });
    walker.on('errors', function(root, stats, next) {
      // FIXME: emit error event?
      // return callback(new BedrockError('Could not build i18n cache.'));
      next();
    });
    walker.on('end', function() {
      callback();
    });
  }, function() {
    callback();
  });
}

bedrock.events.on('bedrock-express.configure.static', function(app) {
  // detect language based on HTTP headers
  app.use(i18n.init);

  // setup early handler for i18n-based URL rewriting
  app.use(function(req, res, next) {
    if(req.language && req.language in i18nCache) {
      var reqPath = i18nCache[req.language][req.url];
      if(reqPath) {
        req.url = reqPath;
      }
    }
    next();
  });
});
