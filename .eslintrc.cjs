module.exports = {
  extends: ['gowento'],
  rules: {
    'import/extensions': ['error', 'never', { js: 'always', json: 'always' }],
  },
};
