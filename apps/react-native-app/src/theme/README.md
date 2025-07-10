# Theme System Documentation

This document describes the theme system implementation using styled-components' ThemeProvider for the React Native application.

## Overview

The theme system provides a comprehensive design token system with:
- Multiple predefined themes (light, dark, purple, green)
- Dark mode support
- Type-safe theme access
- Styled-components integration
- Responsive design tokens

## Architecture

### ThemeProvider
The main theme provider that wraps the application and provides theme context.

```tsx
import { ThemeProvider } from '../theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider initialTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Theme Interface
The theme interface defines all available design tokens:

```tsx
interface Theme {
  // Primary brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary brand colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Surface colors for cards and containers
  surface: string;
  surfaceGlass: string;
  surfaceElevated: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Accent colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and shadow colors
  border: string;
  borderLight: string;
  shadow: string;
  shadowLight: string;
  
  // Spacing and sizing
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
  // Border radius values
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  
  // Typography
  typography: {
    fontSizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeights: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
}
```

## Available Themes

### Light Theme
- Primary: Blue (#3B82F6)
- Secondary: Purple (#8B5CF6)
- Background: Light gray (#F8FAFC)
- Surface: White (#FFFFFF)

### Dark Theme
- Primary: Light blue (#60A5FA)
- Secondary: Light purple (#A78BFA)
- Background: Dark blue (#0F172A)
- Surface: Dark gray (#1E293B)

### Purple Theme
- Primary: Purple (#8B5CF6)
- Secondary: Pink (#EC4899)
- Background: Light purple (#FAF5FF)
- Surface: White (#FFFFFF)

### Green Theme
- Primary: Green (#10B981)
- Secondary: Dark green (#059669)
- Background: Light green (#F0FDF4)
- Surface: White (#FFFFFF)

## Usage

### Using the useTheme Hook

```tsx
import { useTheme } from '../theme/ThemeProvider';

const MyComponent = () => {
  const { theme, themeName, switchTheme, toggleDarkMode, isDarkMode } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.textPrimary }}>
        Current theme: {themeName}
      </Text>
      <TouchableOpacity onPress={() => switchTheme('purple')}>
        <Text>Switch to Purple</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>Toggle Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Using Styled Components

```tsx
import styled from 'styled-components/native';

const StyledContainer = styled.View`
  background-color: ${({ theme }) => theme.background};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
`;

const StyledText = styled.Text`
  color: ${({ theme }) => theme.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md}px;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const MyStyledComponent = () => {
  return (
    <StyledContainer>
      <StyledText>Hello, themed world!</StyledText>
    </StyledContainer>
  );
};
```

### Theme Switching

```tsx
import { useTheme, getAvailableThemes } from '../theme/ThemeProvider';

const ThemeSwitcher = () => {
  const { theme, themeName, switchTheme } = useTheme();
  const availableThemes = getAvailableThemes();
  
  return (
    <View>
      {availableThemes.map((themeKey) => (
        <TouchableOpacity
          key={themeKey}
          onPress={() => switchTheme(themeKey)}
          style={{
            backgroundColor: themeKey === themeName ? theme.primary : theme.surface,
          }}
        >
          <Text>{themeKey}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

## AetherGlassCard Integration

The AetherGlassCard component has been refactored to use the theme system:

### Props
```tsx
interface AetherGlassCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  actions?: Array<{
    label: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline';
  }>;
  variant?: 'default' | 'elevated' | 'subtle';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  showOverlay?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
}
```

### Usage Examples

```tsx
// Default card
<AetherGlassCard
  title="Default Card"
  subtitle="With theme colors"
  description="This card automatically adapts to the current theme."
  badge="New"
  variant="default"
  size="medium"
/>

// Elevated card with actions
<AetherGlassCard
  title="Elevated Card"
  subtitle="More prominent styling"
  description="Stronger shadows and borders for premium feel."
  badge="Premium"
  badgeType="success"
  variant="elevated"
  actions={[
    { label: 'Upgrade', onPress: () => {}, type: 'primary' },
    { label: 'Details', onPress: () => {}, type: 'secondary' },
  ]}
/>

// Subtle card
<AetherGlassCard
  title="Subtle Card"
  subtitle="Minimal styling"
  description="Lighter colors for secondary content."
  variant="subtle"
  size="small"
/>
```

## Theme Utilities

### getTheme
Get a specific theme by name:
```tsx
import { getTheme } from '../theme/ThemeProvider';

const purpleTheme = getTheme('purple');
```

### getAvailableThemes
Get all available theme names:
```tsx
import { getAvailableThemes } from '../theme/ThemeProvider';

const themes = getAvailableThemes(); // ['light', 'dark', 'purple', 'green']
```

### createCustomTheme
Create a custom theme by extending an existing one:
```tsx
import { createCustomTheme } from '../theme/ThemeProvider';

const customTheme = createCustomTheme('light', {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
});
```

## Best Practices

### 1. Always Use Theme Tokens
Instead of hardcoding colors, use theme tokens:
```tsx
// ❌ Bad
<View style={{ backgroundColor: '#3B82F6' }}>

// ✅ Good
<View style={{ backgroundColor: theme.primary }}>
```

### 2. Use Styled Components for Complex Styling
For components with multiple theme-dependent styles, use styled-components:
```tsx
const StyledCard = styled.View`
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;
```

### 3. Leverage Theme Variants
Use theme variants for different visual hierarchies:
```tsx
<AetherGlassCard variant="elevated">Primary content</AetherGlassCard>
<AetherGlassCard variant="subtle">Secondary content</AetherGlassCard>
```

### 4. Responsive Design
Use theme spacing and sizing tokens for consistent layouts:
```tsx
const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
`;
```

## Migration Guide

### From Hardcoded Colors
1. Replace hardcoded colors with theme tokens
2. Use the `useTheme` hook to access theme values
3. Convert StyleSheet styles to styled-components where appropriate

### From StyleSheet
```tsx
// Before
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3B82F6',
    padding: 16,
  },
});

// After
const StyledContainer = styled.View`
  background-color: ${({ theme }) => theme.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
`;
```

## Troubleshooting

### Theme Not Available
If you get an error "useTheme must be used within a ThemeProvider":
1. Ensure your component is wrapped in `ThemeProvider`
2. Check that the import path is correct
3. Verify that the component is rendered within the provider tree

### Styled Components Not Themed
If styled-components are not receiving theme props:
1. Ensure the component is wrapped in `StyledThemeProvider`
2. Check that the theme prop is being passed correctly
3. Verify that the styled component is defined with theme access

### TypeScript Errors
If you encounter TypeScript errors:
1. Ensure theme types are properly imported
2. Check that the theme interface matches your usage
3. Verify that styled-components types are installed

## Future Enhancements

- Theme persistence with AsyncStorage
- System theme detection
- Custom theme builder
- Animation support for theme transitions
- Accessibility color schemes
- High contrast mode support 