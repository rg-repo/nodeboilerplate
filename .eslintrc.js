module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  settings: {
    'import/resolver': {
      alias: { map: [['@src', './src']], extensions: ['.js'] }
    }
  },
  rules: {
    'no-underscore-dangle': 'off',
    'comma-dangle': ['error', 'never'],
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off'
  }
};
