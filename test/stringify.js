import test from 'ava';
import gowentoLogger from '../src/logger';
import _ from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';

test('stringifies plain object', t => {
  const loggedObject = gowentoLogger.stringify(
    {
      topkey: 'topvalue',
      topobjkey: { subobjkey: { subsubobjkey: 'subsubobjvalue' } },
    }
  );
  t.is(loggedObject, 'topkey=topvalue topobjkey={subobjkey={subsubobjkey=subsubobjvalue}}');
});

test('does not truncate long top value, truncates long subobject value', t => {
  const longValue = _.times(256, () => (Math.random()).toString(36)).join('');
  const loggedObject = gowentoLogger.stringify(
    {
      topkey: longValue,
      topobjkey: { subobjkey: longValue },
    }
  );
  t.regex(loggedObject, new RegExp(escapeStringRegexp(`topkey=${longValue}`)));
  t.regex(loggedObject, /topobjkey=\{subobjkey=.*\.\.\..*\}/);
});
