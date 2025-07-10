import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

// MARK: - Theme Types

/// Theme interface defining the color palette and styling properties
export interface Theme {
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
  
  // Accent colors for different states
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

// MARK: - Predefined Themes

/// Collection of predefined themes for the application
export const themes = {
  // Light theme with blue primary colors
  light: {
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    
    secondary: '#8B5CF6',
    secondaryLight: '#A78BFA',
    secondaryDark: '#7C3AED',
    
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    backgroundTertiary: '#E2E8F0',
    
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.8)',
    surfaceElevated: '#FFFFFF',
    
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    border: 'rgba(30, 41, 59, 0.2)',
    borderLight: 'rgba(30, 41, 59, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
    },
    
    typography: {
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      fontWeights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  } as Theme,
  
  // Dark theme with blue primary colors
  dark: {
    primary: '#60A5FA',
    primaryLight: '#93C5FD',
    primaryDark: '#3B82F6',
    
    secondary: '#A78BFA',
    secondaryLight: '#C4B5FD',
    secondaryDark: '#8B5CF6',
    
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    
    surface: '#1E293B',
    surfaceGlass: 'rgba(30, 41, 59, 0.8)',
    surfaceElevated: '#334155',
    
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    
    border: 'rgba(248, 250, 252, 0.2)',
    borderLight: 'rgba(248, 250, 252, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLight: 'rgba(0, 0, 0, 0.15)',
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
    },
    
    typography: {
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      fontWeights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  } as Theme,
  
  // Purple theme for a more vibrant look
  purple: {
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    
    secondary: '#EC4899',
    secondaryLight: '#F472B6',
    secondaryDark: '#DB2777',
    
    background: '#FAF5FF',
    backgroundSecondary: '#F3E8FF',
    backgroundTertiary: '#EDE9FE',
    
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.8)',
    surfaceElevated: '#FFFFFF',
    
    textPrimary: '#1E1B4B',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#8B5CF6',
    
    border: 'rgba(139, 92, 246, 0.2)',
    borderLight: 'rgba(139, 92, 246, 0.1)',
    shadow: 'rgba(139, 92, 246, 0.1)',
    shadowLight: 'rgba(139, 92, 246, 0.05)',
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
    },
    
    typography: {
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      fontWeights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  } as Theme,
  
  // Green theme for nature-inspired designs
  green: {
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    
    secondary: '#059669',
    secondaryLight: '#10B981',
    secondaryDark: '#047857',
    
    background: '#F0FDF4',
    backgroundSecondary: '#DCFCE7',
    backgroundTertiary: '#BBF7D0',
    
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.8)',
    surfaceElevated: '#FFFFFF',
    
    textPrimary: '#064E3B',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    border: 'rgba(16, 185, 129, 0.2)',
    borderLight: 'rgba(16, 185, 129, 0.1)',
    shadow: 'rgba(16, 185, 129, 0.1)',
    shadowLight: 'rgba(16, 185, 129, 0.05)',
    
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
    },
    
    typography: {
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      fontWeights: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
    },
  } as Theme,
};

// MARK: - Theme Context

/// Context for theme management
interface ThemeContextType {
  theme: Theme;
  themeName: string;
  switchTheme: (themeName: keyof typeof themes) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// MARK: - Theme Provider Component

/// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: keyof typeof themes;
}

/// ThemeProvider component that provides theme context and styled-components theme
/// 
/// This component:
/// - Manages theme state and switching
/// - Provides theme context for custom hooks
/// - Wraps styled-components ThemeProvider
/// - Handles theme persistence
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const [currentThemeName, setCurrentThemeName] = React.useState<keyof typeof themes>(initialTheme);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  // Get current theme based on dark mode preference
  const currentTheme = isDarkMode ? themes.dark : themes[currentThemeName];
  
  // Switch to a different theme
  const switchTheme = (themeName: keyof typeof themes) => {
    setCurrentThemeName(themeName);
    setIsDarkMode(false); // Reset dark mode when switching themes
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Context value
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    themeName: isDarkMode ? 'dark' : currentThemeName,
    switchTheme,
    toggleDarkMode,
    isDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// MARK: - Custom Hook

/// Custom hook to access theme context
/// 
/// Usage:
/// ```tsx
/// const { theme, switchTheme, isDarkMode } = useTheme();
/// ```
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// MARK: - Theme Utilities

/// Get a theme by name
export const getTheme = (themeName: keyof typeof themes): Theme => {
  return themes[themeName];
};

/// Get all available theme names
export const getAvailableThemes = (): (keyof typeof themes)[] => {
  return Object.keys(themes) as (keyof typeof themes)[];
};

/// Create a custom theme by extending an existing one
export const createCustomTheme = (
  baseTheme: keyof typeof themes,
  overrides: Partial<Theme>
): Theme => {
  return {
    ...themes[baseTheme],
    ...overrides,
  };
};

// MARK: - Type Exports

export type ThemeName = keyof typeof themes;
// Theme type is already exported above 