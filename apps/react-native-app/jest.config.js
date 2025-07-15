module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
  ],
  moduleNameMapper: {
    '^@aether/core$': '<rootDir>/../../packages/aether-core/src',
    '^@aether/shared-types$': '<rootDir>/../../packages/aether-shared-types/src',
    '^@aether/react-native-utils$': '<rootDir>/../../packages/aether-react-native-utils/src',
    '^react-native$': 'react-native-web',
    '^styled-components$': 'styled-components/native',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock problematic polyfills
    '^@react-native/js-polyfills/error-guard.js$': '<rootDir>/__mocks__/emptyMock.js',
    '^@react-native/js-polyfills$': '<rootDir>/__mocks__/emptyMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.example.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native/.*|@react-native-community/.*|react-native-.*|@react-native/js-polyfills)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  moduleDirectories: ['node_modules', 'src'],
  setupFiles: ['<rootDir>/jest.setup.js'],
}; 