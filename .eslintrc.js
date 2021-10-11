module.exports = {
  root: true,
  env: {
    node: true,
    webextensions: true
  },
  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-shadow': ['error', { allow: ['state'] }],
    camelcase: 'off',
    'no-else-return': 'off',
    'consistent-return': 'off'
  },
};
