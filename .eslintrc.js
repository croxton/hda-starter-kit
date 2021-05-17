// rule reference: http://eslint.org/docs/rules
// individual rule reference: http://eslint.org/docs/rules/NAME-OF-RULE
module.exports = {
  parser: 'vue-eslint-parser',
    parserOptions: {
      'parser': 'babel-eslint',
      'sourceType': 'module'
    },
    plugins: [
        'compat'
    ],
    rules: {
        strict: [0],
        'prefer-spread': [0],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    },
};
