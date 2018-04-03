const Logfmt = require('logfmt');
const chalk = require('chalk');
const flatten = require('flat');
const figures = require('figures');

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
      timer = false,
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
      timer: !!timer,
    };

    for (const key in LEVELS) {
      this[key] = (message, data) => this.log(key, message, data);
    }
  }

  /**
   * Log to the console with `level`, `message` and `data`.
   *
   * @param {String} level
   * @param {String} message
   * @param {Object} data
   */

  log(level, message, data) {
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
      data.error = message;
      data.stack = message.stack;
      message = message.message;
    }

    if (typeof message !== 'string') {
      message = String(message);
    }

    const { threshold, prefix, timer } = this.config;
    const value = LEVELS[level];
    if (value < threshold) return;


    // If logger is a timer, we return an object with an "end" method to be called later on
    // Logger will display an additionnal elapsed property.
    if (timer) {
      const start = new Date();
      return {
        end: (additionnalData) => {
          const output = this.format(level, prefix + message, { ...data, ...additionnalData, elapsed: `${(new Date() - start)}ms` });
          console.log(output); // eslint-disable-line no-console
        },
      };
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
    const flat = flatten(data, { delimiter });
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
}

/**
 * Create a logger singleton with sane defaults.
 *
 * @type {Logger}
 */

const logger = new Logger();

export default logger;
