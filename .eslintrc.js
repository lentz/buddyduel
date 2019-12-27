module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  env: {
    es6: true,
    jest: true,
    node: true,
  },
  plugins: [
    'jest',
  ],
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'jest/expect-expect': 'error',
    'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' } ],
  },
};
