module.exports = {
  extends: ['badboyku'],
  settings: {
    react: { version: '999.999.999' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.d.ts'],
        moduleDirectory: ['./node_modules', './src'],
      },
      alias: {
        map: [
          ['@', './src'],
          ['@clients', './src/clients'],
          ['@controllers', './src/controllers'],
          ['@db', './src/db'],
          ['@errors', './src/errors'],
          ['@listeners', './src/listeners'],
          ['@services', './src/services'],
          ['@types', './src/@types/global.d.ts'],
          ['@utilHelpers', './src/utilHelpers'],
          ['@utils', './src/utils'],
          ['@views', './src/views'],
        ],
        extensions: ['.js', '.ts'],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': ['off', { selector: 'ForOfExpression', message: '' }],
  },
};
