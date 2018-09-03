# gowento-logger

Gowento Logger

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Downloads][download-badge]][npm-url]

## Install

```sh
# Using npm
npm install gowento-logger
```

```sh
# Using yarn
yarn add gowento-logger
```

## Usage

```js
import logger from 'gowento-logger';

logger.info('message', { data: [{ foo: 1 }, { bar: 2 }] });
logger.warn('warn message');
logger.error(new Error('Foo'));
logger.debug('should be hidden');

const logger2 = logger.clone({
  level: 'debug',
  color: false,
  readable: false,
  prefix: 'foo.',
});

logger2.debug('should be visible');
logger2.warn('no color', { foo: 'bar' });
```

## License

MIT © [Gowento](https://www.gowento.com)

[npm-url]: https://npmjs.org/package/gowento-logger
[npm-image]: https://img.shields.io/npm/v/gowento-logger.svg?style=flat-square
[travis-url]: https://travis-ci.org/gowento/gowento-logger
[travis-image]: https://img.shields.io/travis/gowento/gowento-logger.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/gowento/gowento-logger
[coveralls-image]: https://img.shields.io/coveralls/gowento/gowento-logger.svg?style=flat-square
[depstat-url]: https://david-dm.org/gowento/gowento-logger
[depstat-image]: https://david-dm.org/gowento/gowento-logger.svg?style=flat-square
[download-badge]: http://img.shields.io/npm/dm/gowento-logger.svg?style=flat-square
