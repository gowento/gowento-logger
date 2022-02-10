import test from 'ava';
import MockExpressRequest from 'mock-express-request';
import MockExpressResponse from 'mock-express-response';
import delay from 'delay';
import logger, { expressRequestLoggerMiddleware } from '../src/logger.js';

test('log exports', (t) => {
  t.is(typeof logger, 'object');
  t.is(typeof logger.debug, 'function');
  t.is(typeof logger.info, 'function');
  t.is(typeof logger.warn, 'function');
  t.is(typeof logger.error, 'function');
  t.is(typeof logger.clone, 'function');
});

test('default usage', (t) => {
  logger.info('message', { data: [{ foo: 1 }, { bar: 2 }] });
  logger.warn('warn message');
  logger.error(new Error('This is the error message'), { foo: 'bar' });
  logger.debug('should be hidden');
  logger.log('unknown level', 'foobar');
  logger.info('data casting', 'foo');
  t.pass();
});

test('namespace usage', (t) => {
  const namespacedLogger = logger.namespace('Namespace', {
    namespaceFoo: 1,
    namespaceBar: 2,
  });
  namespacedLogger.info('message with a namespace', {
    data: [{ foo: 1 }, { bar: 2 }],
  });
  namespacedLogger.warn('warn message with a namespace');
  namespacedLogger.error(
    new Error('This is the error message with a namespace')
  );
  t.pass();
});

test('prod env usage', (t) => {
  const productionLogger = logger.clone({
    level: 'debug',
    color: false,
    readable: false,
  });

  productionLogger.debug('should be visible');
  productionLogger.warn('no color', { foo: 'bar' });
  t.pass();
});

test('timer usage', async (t) => {
  const timerLogger = logger.timer();
  await delay(500);
  timerLogger.info('this is a timer', { foo: 'bar' });
  t.pass();
});

test('express request middleware usage', async (t) => {
  const req = new MockExpressRequest();
  const res = new MockExpressResponse();
  await new Promise((resolve) => {
    expressRequestLoggerMiddleware()(req, res, async () => {
      await delay(50);
      res.end();
      resolve();
    });
  });
  t.pass();
});

test('should not fail on circular data', (t) => {
  const data = { key: 'value' };
  data.data = data;
  t.notThrows(() => {
    logger.info('circular data', data);
  });
});

test('should not mutate data', (t) => {
  const data = { key: 'value' };
  const dataCopy = { ...data };
  logger.error(new Error('This is the error message'), data);
  t.deepEqual(data, dataCopy);
});
