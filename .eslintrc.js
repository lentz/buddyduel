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
  ],
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off', // TODO
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
    }],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'jest/expect-expect': 'error',
    'no-await-in-loop': 'off',
    'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
  },
};
