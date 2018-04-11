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
  logger.error(new Error('This is the error message'));
  logger.debug('should be hidden');

  const namespacedLogger = logger.namespace('Namespace');
  namespacedLogger.info('message with a namespace', { data: [{ foo: 1 }, { bar: 2 }] });
  namespacedLogger.warn('warn message with a namespace');
  namespacedLogger.error(new Error('This is the error message with a namespace'));

  const productionLogger = logger.clone({
    level: 'debug',
    color: false,
    readable: false,
  });

  productionLogger.debug('should be visible');
  productionLogger.warn('no color', { foo: 'bar' });

  const timerLogger = logger.timer();
  setTimeout(() => {
    timerLogger.info('this is a timer', { foo: 'bar' });
    t.end();
  }, 500);
});
