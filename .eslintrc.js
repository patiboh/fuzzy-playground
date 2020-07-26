module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['standard', 'cypress', 'svelte3'],
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended',
    'standard',
    'prettier',
    'prettier/standard',
  ],
  rules: {
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  ignorePatterns: ['**/doc', '**/node_modules', '**/__sapper__'],
}
