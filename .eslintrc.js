module.exports = {
  root: true,

  // For supported options, see:
  baseConfig: {
    plugins: ['standard', 'cypress'],
    extends: [
      'standard',
      'prettier',
      'prettier/standard',
      'cypress/recommended',
    ],
    rules: {
      'space-before-function-paren': 'off',
      'comma-dangle': 'off',
    },
    env: {'cypress/globals': true},
  },
}
