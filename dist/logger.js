'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _herokuLogger = require('heroku-logger');

// Export logger instance with sane defaults
var logger = new _herokuLogger.Logger({
  delimiter: '.'
});

exports.default = logger;