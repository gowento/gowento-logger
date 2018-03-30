'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function centerTruncate(str) {
  var strLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 125;
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';

  if (!str) {
    return null;
  }

  var fullStr = str.toString();

  if (fullStr.length <= strLen) {
    return fullStr;
  }

  var sepLen = separator.length;
  var charsToShow = strLen - sepLen;
  var frontChars = Math.ceil(charsToShow / 2);
  var backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}

/**
 * logfmt-style stringify with support for sub objects
 */
function stringify(object) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$truncateValues = _ref.truncateValues,
      truncateValues = _ref$truncateValues === undefined ? false : _ref$truncateValues;

  var lineElements = [];

  _lodash2.default.forEach(object, function (value, key) {
    var stringifiedValue = void 0;
    if (_lodash2.default.isNil(value)) {
      stringifiedValue = '';
    } else if (_lodash2.default.isPlainObject(value)) {
      stringifiedValue = '{' + stringify(value, { truncateValues: true }) + '}';
    } else {
      stringifiedValue = truncateValues ? centerTruncate(value.toString()) : value.toString();
    }

    lineElements.push(key + '=' + stringifiedValue);
  });

  return lineElements.join(' ');
}

function logObject(object) {
  console.log(stringify(object));
}

function log(data) {
  if (_lodash2.default.isPlainObject(data)) {
    logObject(data);
    return;
  }
  console.log(data);
}

exports.default = {
  log: log,
  logObject: logObject,
  stringify: stringify
};
//# sourceMappingURL=logger.js.map