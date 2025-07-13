module.exports = {
  extends: ['@aether/eslint-config'],
  root: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
    'metro.config.js',
    'babel.config.js',
    'jest.config.js',
    'jest.setup.js',
    'turbo.json'
  ]
}; 