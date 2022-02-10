module.exports = {
  extends: ['gowento'],
  rules: {
    'import/extensions': ['error', 'never', { js: 'always', json: 'always' }],
    'import/no-unresolved': ['error', { ignore: ['ava', 'chalk'] }], // https://github.com/avajs/ava/issues/2935
  },
};
