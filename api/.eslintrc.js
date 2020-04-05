module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
  ],
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off', // TODO
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'jest/expect-expect': 'error',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
