// Mock React Native modules
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
}));

// Mock @aether/core
jest.mock('@aether/core', () => ({
  ThemeValidator: jest.fn().mockImplementation(() => ({
    validateTheme: jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: [],
    }),
  })),
  ValidationResult: jest.fn(),
  ValidationError: jest.fn(),
  ValidationWarning: jest.fn(),
  ThemeSchema: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 