module.exports = {
  extends: ['badboyku'],
  settings: {
    react: { version: '999.999.999' },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': ['off', { selector: 'ForOfExpression', message: '' }],
  },
};
