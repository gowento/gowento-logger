import test from 'ava';
import log from '../src/logger';

log.info('message', { data: [{ foo: 1 }, { bar: 2 }] });
log.warn('warn message');
log.error(new Error('Foo'));
log.debug('should be hidden');

const log2 = log.clone({
  level: 'debug',
  color: false,
  readable: false,
  prefix: 'foo.',
});

log2.debug('should be visible');
log2.warn('no color', { foo: 'bar' });

test('log exports', t => {
  t.is(typeof log, 'object');
  t.is(typeof log.debug, 'function');
  t.is(typeof log.info, 'function');
  t.is(typeof log.warn, 'function');
  t.is(typeof log.error, 'function');
  t.is(typeof log.clone, 'function');
});
