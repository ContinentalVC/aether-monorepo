# Testing TODO - Future Improvements

## Current Issue

The React Native app's Jest configuration is encountering issues with the `@react-native/js-polyfills/error-guard.js` file, which contains TypeScript type annotations that Babel cannot parse in the Jest environment.

### Error Details
```
SyntaxError: /Users/chosone/Documents/CVC/Projects/aether-monorepo/node_modules/@react-native/js-polyfills/error-guard.js: Missing semicolon. (14:4)

type ErrorHandler = (error: mixed, isFatal: boolean) => void;
     ^^^^^^^^^^^^
```

## What We've Accomplished

✅ **Completed Setup:**
- Updated Jest configuration to use `babel-jest` for all JS/TS files
- Created comprehensive mocks for React Native components and third-party libraries
- Set up proper styled-components testing configuration
- Added all necessary Babel and testing dependencies
- Created file mocks for assets and styles
- Configured module name mapping for monorepo packages

✅ **Test Infrastructure:**
- Jest configuration with React Native preset
- Babel configuration with TypeScript support
- Comprehensive Jest setup with mocks for:
  - React Native components
  - Navigation libraries
  - Styled-components
  - Third-party libraries (Skia, haptics, charts, etc.)
  - Expo modules
  - @aether packages

## Future Improvements Needed

### 1. Fix Jest Configuration for React Native Components

**Problem:** The `react-native` Jest preset imports `@react-native/js-polyfills/error-guard.js` which contains TypeScript type annotations that Babel cannot parse.

**Solutions to try (in order of preference):**

#### Option A: Use jest-expo Preset (Recommended if using Expo)
```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo', // Instead of 'react-native'
  // ... rest of config
};
```

#### Option B: Create Custom Jest Preset
Create a custom preset that extends `react-native` but excludes the problematic setup files.

#### Option C: Patch react-native Package
Temporarily patch the `@react-native/js-polyfills/error-guard.js` file to remove type annotations.

#### Option D: Use Metro for Tests
Configure Metro to run tests, though this is complex and not recommended.

### 2. Re-enable Disabled Tests

**Files to re-enable:**
- `src/theme/ThemeValidator.test.tsx.disabled` → `src/theme/ThemeValidator.test.tsx`
- `src/components/__tests__/AetherGlassCard.test.tsx.disabled` → `src/components/__tests__/AetherGlassCard.test.tsx`

### 3. Add More Component Tests

**Components that need tests:**
- All styled-components based components
- Theme-related components
- Navigation components
- Form components
- Chart components

### 4. Improve Test Coverage

**Areas to focus on:**
- Unit tests for utility functions
- Integration tests for theme system
- Component interaction tests
- Accessibility tests
- Performance tests

## Current Test Configuration

### Jest Config (`jest.config.js`)
```javascript
module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // ... rest of configuration
};
```

### Babel Config (`babel.config.js`)
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'react-native-reanimated/plugin',
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};
```

### Jest Setup (`jest.setup.js`)
- Comprehensive mocks for React Native components
- Navigation library mocks
- Styled-components mocks
- Third-party library mocks
- @aether package mocks

## Dependencies Added

### Dev Dependencies
```json
{
  "@babel/plugin-proposal-class-properties": "^7.18.6",
  "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
  "@babel/plugin-transform-modules-commonjs": "^7.23.3",
  "@babel/preset-typescript": "^7.23.3",
  "identity-obj-proxy": "^3.0.0",
  "jest-environment-jsdom": "^29.2.1",
  "@testing-library/react-native": "^13.2.0"
}
```

## Next Steps

1. **Immediate:** Try switching to `jest-expo` preset if using Expo
2. **Short-term:** Re-enable tests once Jest configuration is fixed
3. **Medium-term:** Add comprehensive test coverage for all components
4. **Long-term:** Set up CI/CD with automated testing

## Resources

- [Jest React Native Documentation](https://jestjs.io/docs/tutorial-react-native)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Expo Preset](https://docs.expo.dev/guides/testing-with-jest/)
- [Babel TypeScript Preset](https://babeljs.io/docs/en/babel-preset-typescript) 

---

## Cross-Package Integration Test Blocker (Monorepo)

### Problem

Attempts to run comprehensive cross-package integration tests (e.g., importing and using @aether/core, @aether/react-native-theme, and @aether/react-native-ui together in a single Jest test) fail due to Jest not being able to parse JSX/ESM syntax in the source or built files of the theme/UI packages. This results in errors like:

```
SyntaxError: Unexpected token '<' // or 'export'
```

- Jest cannot parse JSX/TSX or ES module syntax in the source or built files of the theme/UI packages, even with ts-jest and proper moduleNameMapper.
- This is a known issue in monorepos with mixed CJS/ESM and React Native code, and is not specific to the test logic.

### What Was Tried
- Using ts-jest with correct moduleNameMapper to point to source files
- Building all packages before running tests
- Creating simplified tests that avoid JSX rendering
- Adding Babel transforms and updating Jest config

### Root Cause
- Jest (with ts-jest) does not handle ESM/JSX/TSX in React Native packages out of the box, especially when packages are built as ES modules or use JSX in their source.
- The monorepo setup mixes CJS and ESM, and React Native packages often require Babel for proper transformation.

### Next Steps / Solutions
- Consider migrating all packages to use Babel for Jest (not just ts-jest), so JSX/ESM is handled.
- Use a single root-level Jest config with a custom transformer for all packages.
- Try the `jest-expo` preset if using Expo, or patch the problematic files.
- For now, rely on per-package integration tests and manual integration in demo apps.

### References
- See the main Jest/React Native/Expo docs for ESM/JSX/TSX support.
- See the existing per-package `integration.test.ts` files for current coverage.

--- 