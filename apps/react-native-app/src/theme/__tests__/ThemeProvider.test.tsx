jest.mock('@react-native/js-polyfills/error-guard.js', () => ({}));
jest.mock('@react-native/js-polyfills', () => ({}));

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Text, View, Button } from 'react-native';
import { ThemeProvider, useTheme } from '../ThemeProvider';

// Test component to access theme context
const TestComponent = () => {
  const { theme, themeName, switchTheme, toggleDarkMode, isDarkMode } = useTheme();
  
  return (
    <View testID="theme-test">
      <Text testID="theme-name">{themeName}</Text>
      <Text testID="primary-color">{theme.primary}</Text>
      <Text testID="background-color">{theme.background}</Text>
      <Text testID="is-dark-mode">{isDarkMode.toString()}</Text>
      <Button 
        testID="switch-light"
        title="Switch to Light"
        onPress={() => switchTheme('light')}
      />
      <Button 
        testID="switch-purple"
        title="Switch to Purple"
        onPress={() => switchTheme('purple')}
      />
      <Button 
        testID="toggle-dark"
        title="Toggle Dark Mode"
        onPress={toggleDarkMode}
      />
    </View>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ThemeProvider Component', () => {
    it('should render children with default theme', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-test')).toBeTruthy();
      expect(getByTestId('theme-name')).toBeTruthy();
      expect(getByTestId('primary-color')).toBeTruthy();
      expect(getByTestId('background-color')).toBeTruthy();
    });

    it('should render with initial theme', () => {
      const { getByTestId } = render(
        <ThemeProvider initialTheme="purple">
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-name').props.children).toBe('purple');
    });

    it('should render with dark theme as initial', () => {
      const { getByTestId } = render(
        <ThemeProvider initialTheme="dark">
          <TestComponent />
        </ThemeProvider>
      );

      expect(getByTestId('theme-name').props.children).toBe('dark');
      expect(getByTestId('is-dark-mode').props.children).toBe('true');
    });
  });

  describe('Theme Switching', () => {
    it('should switch between themes', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Initial theme should be light
      expect(getByTestId('theme-name').props.children).toBe('light');

      // Switch to purple
      fireEvent.press(getByTestId('switch-purple'));
      expect(getByTestId('theme-name').props.children).toBe('purple');

      // Switch back to light
      fireEvent.press(getByTestId('switch-light'));
      expect(getByTestId('theme-name').props.children).toBe('light');
    });

    it('should update theme colors when switching', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const initialPrimaryColor = getByTestId('primary-color').props.children;

      // Switch to purple theme
      fireEvent.press(getByTestId('switch-purple'));
      
      const newPrimaryColor = getByTestId('primary-color').props.children;
      expect(newPrimaryColor).not.toBe(initialPrimaryColor);
    });

    it('should reset dark mode when switching themes', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Enable dark mode
      fireEvent.press(getByTestId('toggle-dark'));
      expect(getByTestId('is-dark-mode').props.children).toBe('true');

      // Switch theme should reset dark mode
      fireEvent.press(getByTestId('switch-purple'));
      expect(getByTestId('is-dark-mode').props.children).toBe('false');
    });
  });

  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Initial state should be light mode
      expect(getByTestId('is-dark-mode').props.children).toBe('false');

      // Toggle to dark mode
      fireEvent.press(getByTestId('toggle-dark'));
      expect(getByTestId('is-dark-mode').props.children).toBe('true');

      // Toggle back to light mode
      fireEvent.press(getByTestId('toggle-dark'));
      expect(getByTestId('is-dark-mode').props.children).toBe('false');
    });

    it('should use dark theme colors when dark mode is enabled', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const lightBackgroundColor = getByTestId('background-color').props.children;

      // Enable dark mode
      fireEvent.press(getByTestId('toggle-dark'));
      
      const darkBackgroundColor = getByTestId('background-color').props.children;
      expect(darkBackgroundColor).not.toBe(lightBackgroundColor);
    });
  });

  describe('useTheme Hook', () => {
    it('should return current theme context', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const themeName = getByTestId('theme-name');
      const primaryColor = getByTestId('primary-color');
      const backgroundColor = getByTestId('background-color');

      expect(themeName).toBeTruthy();
      expect(primaryColor).toBeTruthy();
      expect(backgroundColor).toBeTruthy();
    });

    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponent />);
      }).toThrow();

      console.error = originalError;
    });
  });

  describe('Theme Properties', () => {
    it('should have all required theme properties', () => {
      const ThemeInspector = () => {
        const { theme } = useTheme();
        return (
          <View testID="theme-inspector">
            <Text testID="primary">{theme.primary}</Text>
            <Text testID="secondary">{theme.secondary}</Text>
            <Text testID="background">{theme.background}</Text>
            <Text testID="surface">{theme.surface}</Text>
            <Text testID="text-primary">{theme.textPrimary}</Text>
            <Text testID="text-secondary">{theme.textSecondary}</Text>
            <Text testID="spacing-xs">{theme.spacing.xs}</Text>
            <Text testID="spacing-md">{theme.spacing.md}</Text>
            <Text testID="border-radius-sm">{theme.borderRadius.sm}</Text>
            <Text testID="font-size-xs">{theme.typography.fontSizes.xs}</Text>
            <Text testID="font-weight-medium">{theme.typography.fontWeights.medium}</Text>
          </View>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <ThemeInspector />
        </ThemeProvider>
      );

      // Check that all theme properties are defined
      expect(getByTestId('primary')).toBeTruthy();
      expect(getByTestId('secondary')).toBeTruthy();
      expect(getByTestId('background')).toBeTruthy();
      expect(getByTestId('surface')).toBeTruthy();
      expect(getByTestId('text-primary')).toBeTruthy();
      expect(getByTestId('text-secondary')).toBeTruthy();
      expect(getByTestId('spacing-xs')).toBeTruthy();
      expect(getByTestId('spacing-md')).toBeTruthy();
      expect(getByTestId('border-radius-sm')).toBeTruthy();
      expect(getByTestId('font-size-xs')).toBeTruthy();
      expect(getByTestId('font-weight-medium')).toBeTruthy();
    });

    it('should have different colors for different themes', () => {
      const ColorInspector = () => {
        const { theme } = useTheme();
        return (
          <View testID="color-inspector">
            <Text testID="primary-color">{theme.primary}</Text>
            <Text testID="background-color">{theme.background}</Text>
          </View>
        );
      };

      const { getByTestId, rerender } = render(
        <ThemeProvider initialTheme="light">
          <ColorInspector />
        </ThemeProvider>
      );

      const lightPrimary = getByTestId('primary-color').props.children;
      const lightBackground = getByTestId('background-color').props.children;

      // Switch to purple theme
      rerender(
        <ThemeProvider initialTheme="purple">
          <ColorInspector />
        </ThemeProvider>
      );

      const purplePrimary = getByTestId('primary-color').props.children;
      const purpleBackground = getByTestId('background-color').props.children;

      // Colors should be different
      expect(purplePrimary).not.toBe(lightPrimary);
      expect(purpleBackground).not.toBe(lightBackground);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid initial theme gracefully', () => {
      const { getByTestId } = render(
        <ThemeProvider initialTheme={'invalid' as any}>
          <TestComponent />
        </ThemeProvider>
      );

      // Should fall back to default theme
      expect(getByTestId('theme-test')).toBeTruthy();
    });

    it('should handle rapid theme switching', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Rapid theme switching should not crash
      for (let i = 0; i < 10; i++) {
        fireEvent.press(getByTestId('switch-purple'));
        fireEvent.press(getByTestId('switch-light'));
      }

      expect(getByTestId('theme-test')).toBeTruthy();
    });

    it('should handle rapid dark mode toggling', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Rapid dark mode toggling should not crash
      for (let i = 0; i < 10; i++) {
        fireEvent.press(getByTestId('toggle-dark'));
      }

      expect(getByTestId('theme-test')).toBeTruthy();
    });

    it('should handle multiple theme providers', () => {
      const NestedComponent = () => {
        const { themeName } = useTheme();
        return <Text testID="nested-theme">{themeName}</Text>;
      };

      const { getByTestId } = render(
        <ThemeProvider initialTheme="light">
          <ThemeProvider initialTheme="purple">
            <NestedComponent />
          </ThemeProvider>
        </ThemeProvider>
      );

      // Should use the innermost provider
      expect(getByTestId('nested-theme').props.children).toBe('purple');
    });
  });

  describe('Performance', () => {
    it('should handle many theme changes efficiently', () => {
      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Perform many theme changes
      const startTime = Date.now();
      
      for (let i = 0; i < 50; i++) {
        fireEvent.press(getByTestId('switch-purple'));
        fireEvent.press(getByTestId('switch-light'));
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000);
      expect(getByTestId('theme-test')).toBeTruthy();
    });

    it('should not cause memory leaks with frequent updates', () => {
      const { getByTestId, unmount } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Perform many updates
      for (let i = 0; i < 100; i++) {
        fireEvent.press(getByTestId('toggle-dark'));
        fireEvent.press(getByTestId('switch-purple'));
        fireEvent.press(getByTestId('switch-light'));
      }

      // Should be able to unmount without issues
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should work with styled-components theme provider', () => {
      const StyledComponent = () => {
        const { theme } = useTheme();
        return (
          <View 
            testID="styled-component"
            style={{ 
              backgroundColor: theme.background
            }}
          >
            <Text style={{ color: theme.textPrimary }}>Styled Content</Text>
          </View>
        );
      };

      const { getByTestId } = render(
        <ThemeProvider>
          <StyledComponent />
        </ThemeProvider>
      );

      expect(getByTestId('styled-component')).toBeTruthy();
    });

    it('should work with complex nested components', () => {
      const ComplexComponent = () => {
        const { theme, switchTheme, toggleDarkMode } = useTheme();
        
        return (
          <View style={{ backgroundColor: theme.background }}>
            <View style={{ padding: theme.spacing.md }}>
              <Text style={{ color: theme.textPrimary }}>Complex Component</Text>
              <Button 
                title="Switch Theme"
                onPress={() => switchTheme('purple')}
              />
              <Button 
                title="Toggle Dark"
                onPress={toggleDarkMode}
              />
            </View>
          </View>
        );
      };

      const { getByText } = render(
        <ThemeProvider>
          <ComplexComponent />
        </ThemeProvider>
      );

      expect(getByText('Complex Component')).toBeTruthy();
      expect(getByText('Switch Theme')).toBeTruthy();
      expect(getByText('Toggle Dark')).toBeTruthy();
    });
  });
}); 