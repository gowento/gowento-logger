import test from 'ava';
import gowentoLogger from '../src';

test('gowentoLogger', t => {
  t.is(true, gowentoLogger(), 'return true');
});
