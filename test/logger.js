import test from 'ava';
import logger from '../src/logger';

test.cb('log exports', t => {
  t.is(typeof logger, 'object');
  t.is(typeof logger.debug, 'function');
  t.is(typeof logger.info, 'function');
  t.is(typeof logger.warn, 'function');
  t.is(typeof logger.error, 'function');
  t.is(typeof logger.clone, 'function');

  logger.info('message', { data: [{ foo: 1 }, { bar: 2 }] });
  logger.warn('warn message');
  logger.error(new Error('Foo'));
  logger.debug('should be hidden');

  const log2 = logger.clone({
    level: 'debug',
    color: false,
    readable: false,
    prefix: 'foo.',
  });

  log2.debug('should be visible');
  log2.warn('no color', { foo: 'bar' });

  const timerLogger = logger.timer();
  setTimeout(() => {
    timerLogger.info('this is a timer', { foo: 'bar' });
    t.end();
  }, 500);
});
