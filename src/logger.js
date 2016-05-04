import _ from 'lodash';

function centerTruncate(str, strLen = 125, separator = '...') {
  if (!str) {
    return null;
  }

  const fullStr = str.toString();

  if (fullStr.length <= strLen) {
    return fullStr;
  }

  const sepLen = separator.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars)
    + separator
    + fullStr.substr(fullStr.length - backChars);
}

/**
 * logfmt-style stringify with support for sub objects
 */
function stringify(object, { truncateValues = false } = {}) {
  const lineElements = [];

  _.forEach(object, (value, key) => {
    let stringifiedValue;
    if (_.isNil(value)) {
      stringifiedValue = '';
    } else if (_.isPlainObject(value)) {
      stringifiedValue = `{${stringify(value, { truncateValues: true })}}`;
    } else {
      stringifiedValue = truncateValues ? centerTruncate(value.toString()) : value.toString();
    }

    lineElements.push(`${key}=${stringifiedValue}`);
  });

  return lineElements.join(' ');
}

function logObject(object) {
  console.log(stringify(object));
}

function log(data) {
  if (_.isPlainObject(data)) {
    logObject(data);
    return;
  }
  console.log(data);
}

export default {
  log,
  logObject,
  stringify,
};
