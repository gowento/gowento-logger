const Logfmt = require('logfmt');
const chalk = require('chalk');
const flatten = require('flat');
const figures = require('figures');
const destroyCircular = require('destroy-circular');
const requestIp = require('request-ip');

/**
 * Environment variables, with a client-side guard.
 *
 * @type {String}
 */

const LOG_LEVEL = typeof process !== 'undefined' && process.env.LOG_LEVEL;
const NODE_ENV = typeof process !== 'undefined' && process.env.NODE_ENV;

/**
 * Logfmt helper.
 *
 * @type {Logfmt}
 */

const logfmt = new Logfmt();

/**
 * Log levels.
 *
 * @type {Object}
 */

const LEVELS = {
  debug: 1,
  info: 2,
  start: 2,
  warn: 3,
  error: 4,
};

/**
 * Log level colors.
 *
 * @type {Object}
 */

const COLORS = {
  debug: chalk.gray,
  info: chalk.blue,
  start: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
};

/**
 * Log level icons.
 *
 * @type {Object}
 */

const ICONS = {
  debug: figures('…'),
  info: figures('ℹ'),
  start: figures('✔'),
  warn: figures('⚠'),
  error: figures('✖'),
  default: figures('❯'),
};

/**
 * Define the `Logger` class.
 *
 * @type {Logger}
 */

class Logger {
  /**
   * Constructor.
   *
   * @param {Object} options
   */

  constructor(options = {}) {
    const {
      color = (NODE_ENV !== 'production'),
      readable = (NODE_ENV !== 'production'),
      delimiter = '.',
      timer = null,
    } = options;
    let {
      level = (LOG_LEVEL || 'info'),
      prefix = '',
    } = options;

    if (typeof level !== 'string') {
      level = 'none';
    }

    level = level.toLowerCase();

    if (!(level in LEVELS)) {
      level = 'none';
    }

    if (typeof prefix !== 'string') {
      prefix = String(prefix);
    }

    this.config = {
      level,
      prefix,
      color: !!color,
      readable: !!readable,
      threshold: level === 'none' ? Infinity : LEVELS[level],
      delimiter,
      timer,
    };

    Object.keys(LEVELS).forEach(key => {
      this[key] = (message, data) => this.log(key, message, data);
    });
  }

  /**
   * Log to the console with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  log(_level, _message, _data) {
    let level = _level;
    let message = _message;
    let data = _data;

    if (typeof level !== 'string') {
      level = 'info';
    }

    level = level.toLowerCase();

    if (!(level in LEVELS)) {
      level = 'info';
    }

    if (typeof data !== 'object') {
      data = {};
    }

    if (message instanceof Error) {
      // Special handling of superagent error
      if (message.response && message.response.error) {
        data.responseError = message.response.error.message;
        data.responseBody = message.response.body;
      }

      data.stack = message.stack;
      message = `${message.name}: ${message.message}`;
    }

    if (typeof message !== 'string') {
      message = String(message);
    }

    const { threshold, prefix, timer } = this.config;
    const value = LEVELS[level];
    if (value < threshold) return;


    if (timer) {
      data.elapsed = `${(new Date() - timer)}ms`;
    }

    const output = this.format(level, prefix + message, data);
    console.log(output); // eslint-disable-line no-console
  }

  /**
   * Format a log with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  format(level, message, data) {
    const { color, readable, delimiter } = this.config;
    const value = LEVELS[level];
    const flat = flatten(destroyCircular(data), { delimiter });
    const string = logfmt.stringify(readable ? flat : { level, message, ...flat });
    const icon = ICONS[level] || ICONS.default;

    if (readable && color) {
      const tag = `${COLORS[level](`${icon} ${level}`)}`;
      const msg = value > 3 ? chalk.red(message) : message;
      const obj = `${chalk.gray(string)}`;
      return `${tag}\t${msg} ${obj}`;
    } else if (readable) {
      return `${icon} ${level}\t${message} ${string}`;
    }

    return string;
  }

  /**
   * Create a new logger, extending the current logger's config.
   *
   * @param {Object} options
   * @return {Logger}
   */

  clone(options = {}) {
    return new Logger({
      ...this.config,
      ...options,
    });
  }

  // Helper method to create a logger with a namespace
  namespace(namespace) {
    return this.clone({ prefix: `[${namespace}] ` });
  }


  // Helper method to create a logger with a timer
  timer() {
    return this.clone({ timer: new Date() });
  }
}

/**
 * Create a logger singleton with sane defaults.
 *
 * @type {Logger}
 */

const logger = new Logger();

/**
 * Express request logger middleware
 */
export const expressRequestLoggerMiddleware = () => (req, res, next) => {
  // Skip requests from ping bots
  if (/bot=(NewRelic|UptimeRobot)/.test(req.url)) {
    return next();
  }

  const log = {
    method: req.method,
    host: req.get('host'),
    path: req.originalUrl || req.path || req.url,
    status: res.statusCode,
    ip: requestIp.getClientIp(req),
    ua: req.get('user-agent'),
  };

  // Add country from Cloudflare IP country header
  const country = (req.get('cf-ipcountry') || '').toUpperCase();
  if (country) {
    log.country = country;
  }

  // Add requestId from Heroku Request-ID header
  const requestId = req.get('x-request-id');
  if (requestId) {
    log.requestId = requestId;
  }

  // Patch res.end to time request execution
  const expressLogger = logger.namespace('Express').timer();
  const { end } = res;
  res.end = (chunk, encoding) => {
    res.end = end;
    res.end(chunk, encoding);
    expressLogger.info('request', log);
  };

  return next();
};

export default logger;
