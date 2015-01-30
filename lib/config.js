/*
 * Bedrock Internationalization Module Configuration
 *
 * Copyright (c) 2012-2015 Digital Bazaar, Inc. All rights reserved.
 */
var config = require('bedrock').config;
var path = require('path');

config.i18n = {};

// the supported non-english languages for the site
config.i18n.locales = ['es', 'zh', 'ru', 'ja', 'de', 'fr'];
config.i18n.localePath = path.join(__dirname, '..', 'locales');
config.i18n.writeLocales = true;
