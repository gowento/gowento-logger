import test from 'ava';
import gowentoLogger from '../src/logger';

test('stringify', t => {
  t.not(gowentoLogger.logObject, undefined);
  const loggedObject = gowentoLogger.stringify(
    {
      topkey: 'topvalue',
      topobjkey: { subobjkey: { subsubobjkey: 'subsubobjvalue' } },
    }
  );
  t.is(loggedObject, 'topkey=topvalue topobjkey={subobjkey={subsubobjkey=subsubobjvalue}}');
});
