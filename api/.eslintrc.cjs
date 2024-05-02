module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/recommended',
    'plugin:vitest/legacy-recommended',
    'prettier',
  ],
  env: {
    es6: true,
    node: true,
  },
  plugins: ['@typescript-eslint', 'vitest'],
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
    'import/no-unresolved': 'off',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
};
