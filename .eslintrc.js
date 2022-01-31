module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@auth', './src/auth/'],
          ['@utils', './src/utils/'],
          ['@users', './src/users/'],
          ['@constants', './src/constants/'],
          ['@decorators', './src/decorators/'],
          ['@middlewares', './src/middlewares/'],
          ['@dtos', './src/dtos/'],
        ],
        extentions: ['.ts', 'tsx']
      }
    }
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'guard-for-in':'off',
    'no-await-in-loop':'off',
    'import/prefer-default-export':'off',
    'import/no-cycle':'off',
    'no-restricted-syntax':'off',
    'import/no-extraneous-dependencies':'off',
    '@typescript-eslint/return-await':'off',
    'consistent-return':'off',
    'no-console':'off',
    'class-methods-use-this':'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
