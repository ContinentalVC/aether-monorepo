import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// MARK: - Typography System

export interface Typography {
  // Font families
  primaryFont: string;
  secondaryFont: string;
  
  // Available font weights
  availableWeights: string[];
  
  // Font sizes
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  
  // Line heights
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  
  // Letter spacing
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
  
  // Helper methods
  getFont: (weight: string, size: number) => string;
  getHeading: (size: HeadingSize) => string;
  getBody: (size?: BodySize) => string;
}

export enum HeadingSize {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum BodySize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

// MARK: - Accessibility Features

export interface AccessibilityConfig {
  // Minimum contrast ratio for text readability
  minimumContrastRatio: number;
  
  // Whether to use high contrast colors
  useHighContrast: boolean;
  
  // Whether to reduce motion for users with vestibular disorders
  reduceMotion: boolean;
  
  // Whether to use larger text sizes
  useLargeText: boolean;
  
  // Color blindness support
  colorBlindnessSupport: ColorBlindnessSupport;
}

export enum ColorBlindnessSupport {
  NONE = 'none',
  DEUTERANOPIA = 'deuteranopia',
  PROTANOPIA = 'protanopia',
  TRITANOPIA = 'tritanopia',
}

// MARK: - Enhanced Theme Interface

export interface EnhancedTheme {
  // Color properties (existing)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceGlass: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
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
    xxl: number;
  };
  
  // Border radius values
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  // Enhanced typography
  typography: Typography;
  
  // Accessibility configuration
  accessibility: AccessibilityConfig;
  
  // Helper methods
  colorsForColorBlindness: () => EnhancedTheme;
  hasSufficientContrast: (textColor: string, backgroundColor: string) => boolean;
}

// MARK: - Typography Implementation

export const createTypography = (
  primaryFontName: string = 'System',
  secondaryFontName: string = 'System',
  weights: string[] = ['300', '400', '500', '600', '700']
): Typography => {
  const fontSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  };
  
  const lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  };
  
  const letterSpacing = {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  };
  
  return {
    primaryFont: primaryFontName,
    secondaryFont: secondaryFontName,
    availableWeights: weights,
    fontSizes,
    lineHeights,
    letterSpacing,
    
    getFont: (weight: string, size: number) => {
      return `${weight} ${size}px ${primaryFontName}`;
    },
    
    getHeading: (size: HeadingSize) => {
      let fontSize: number;
      let weight: string;
      
      switch (size) {
        case HeadingSize.H1:
          fontSize = fontSizes.xxxl;
          weight = '700';
          break;
        case HeadingSize.H2:
          fontSize = fontSizes.xxl;
          weight = '600';
          break;
        case HeadingSize.H3:
          fontSize = fontSizes.xl;
          weight = '600';
          break;
        case HeadingSize.H4:
          fontSize = fontSizes.lg;
          weight = '500';
          break;
        case HeadingSize.H5:
          fontSize = fontSizes.md;
          weight = '500';
          break;
        case HeadingSize.H6:
          fontSize = fontSizes.sm;
          weight = '500';
          break;
        default:
          fontSize = fontSizes.md;
          weight = '400';
      }
      
      return `${weight} ${fontSize}px ${primaryFontName}`;
    },
    
    getBody: (size: BodySize = BodySize.MD) => {
      let fontSize: number;
      switch (size) {
        case BodySize.XS:
          fontSize = fontSizes.xs;
          break;
        case BodySize.SM:
          fontSize = fontSizes.sm;
          break;
        case BodySize.MD:
          fontSize = fontSizes.md;
          break;
        case BodySize.LG:
          fontSize = fontSizes.lg;
          break;
        default:
          fontSize = fontSizes.md;
      }
      return `400 ${fontSize}px ${primaryFontName}`;
    },
  };
};

// MARK: - Enhanced Theme Creation

export const createEnhancedTheme = (
  baseTheme: any,
  typography?: Typography,
  accessibility?: AccessibilityConfig
): EnhancedTheme => {
  const defaultTypography = createTypography();
  const defaultAccessibility: AccessibilityConfig = {
    minimumContrastRatio: 4.5,
    useHighContrast: false,
    reduceMotion: false,
    useLargeText: false,
    colorBlindnessSupport: ColorBlindnessSupport.NONE,
  };
  
  const theme: EnhancedTheme = {
    ...baseTheme,
    typography: typography || defaultTypography,
    accessibility: accessibility || defaultAccessibility,
    
    // Helper methods
    colorsForColorBlindness: function() {
      if (this.accessibility.colorBlindnessSupport === ColorBlindnessSupport.NONE) {
        return this;
      }
      
      // Apply color blindness filters
      const adaptedPrimary = this.adaptColorForColorBlindness(this.primary);
      const adaptedSecondary = this.adaptColorForColorBlindness(this.secondary);
      const adaptedTextPrimary = this.adaptColorForColorBlindness(this.textPrimary);
      
      return createEnhancedTheme(
        {
          ...this,
          primary: adaptedPrimary,
          secondary: adaptedSecondary,
          textPrimary: adaptedTextPrimary,
        },
        this.typography,
        this.accessibility
      );
    },
    
    hasSufficientContrast: function(textColor: string, backgroundColor: string) {
      const contrast = this.calculateContrastRatio(textColor, backgroundColor);
      return contrast >= this.accessibility.minimumContrastRatio;
    },
    
    // Private helper methods (simplified implementations)
    adaptColorForColorBlindness: function(color: string) {
      // Simplified color adaptation
      switch (this.accessibility.colorBlindnessSupport) {
        case ColorBlindnessSupport.DEUTERANOPIA:
        case ColorBlindnessSupport.PROTANOPIA:
          return color + 'CC'; // Add transparency
        case ColorBlindnessSupport.TRITANOPIA:
          return color + 'CC'; // Add transparency
        default:
          return color;
      }
    },
    
    calculateContrastRatio: function(textColor: string, backgroundColor: string) {
      // Simplified contrast calculation
      return 4.5; // Placeholder value
    },
  };
  
  return theme;
};

// MARK: - Enhanced Theme Provider

interface EnhancedThemeContextType {
  theme: EnhancedTheme;
  themeName: string;
  typography: Typography;
  accessibility: AccessibilityConfig;
  
  // Theme management
  switchTheme: (themeName: string) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
  
  // Typography management
  updateTypography: (primaryFont: string, secondaryFont?: string, weights?: string[]) => void;
  getRecommendedFontCombinations: () => Array<{primary: string; secondary: string; description: string}>;
  
  // Accessibility management
  updateAccessibility: (config: AccessibilityConfig) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setColorBlindnessSupport: (support: ColorBlindnessSupport) => void;
  
  // Available options
  availableFontFamilies: string[];
  availableFontWeights: string[];
}

interface EnhancedThemeProviderProps {
  children: ReactNode;
  initialTheme?: string;
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType | undefined>(undefined);

export const EnhancedThemeProvider: React.FC<EnhancedThemeProviderProps> = ({
  children,
  initialTheme = 'light',
}) => {
  const [themeName, setThemeName] = useState(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [typography, setTypography] = useState(createTypography());
  const [accessibility, setAccessibility] = useState<AccessibilityConfig>({
    minimumContrastRatio: 4.5,
    useHighContrast: false,
    reduceMotion: false,
    useLargeText: false,
    colorBlindnessSupport: ColorBlindnessSupport.NONE,
  });
  
  // Available options
  const availableFontFamilies = [
    'System',
    'Helvetica',
    'Arial',
    'Georgia',
    'Times New Roman',
    'SF Pro Display',
    'SF Pro Text',
  ];
  
  const availableFontWeights = [
    '100', '200', '300', '400', '500', '600', '700', '800', '900',
  ];
  
  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('selectedTheme');
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      const savedTypography = await AsyncStorage.getItem('selectedTypography');
      const savedAccessibility = await AsyncStorage.getItem('accessibilitySettings');
      
      if (savedTheme) setThemeName(savedTheme);
      if (savedDarkMode) setIsDarkMode(JSON.parse(savedDarkMode));
      if (savedTypography) setTypography(JSON.parse(savedTypography));
      if (savedAccessibility) setAccessibility(JSON.parse(savedAccessibility));
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };
  
  // Get base theme
  const getBaseTheme = (name: string) => {
    const themes = {
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
        spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
        borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, xxl: 24 },
      },
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
        spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
        borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, xxl: 24 },
      },
    };
    
    return themes[name as keyof typeof themes] || themes.light;
  };
  
  // Create enhanced theme
  const theme = createEnhancedTheme(getBaseTheme(themeName), typography, accessibility);
  
  // Theme management methods
  const switchTheme = async (newThemeName: string) => {
    setThemeName(newThemeName);
    await AsyncStorage.setItem('selectedTheme', newThemeName);
  };
  
  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      await switchTheme('dark');
    } else {
      await switchTheme('light');
    }
  };
  
  // Typography management methods
  const updateTypography = async (
    primaryFont: string,
    secondaryFont?: string,
    weights?: string[]
  ) => {
    const validatedPrimaryFont = validateFontSelection(primaryFont);
    const validatedSecondaryFont = secondaryFont ? validateFontSelection(secondaryFont) : validatedPrimaryFont;
    
    const newTypography = createTypography(
      validatedPrimaryFont,
      validatedSecondaryFont,
      weights || typography.availableWeights
    );
    
    setTypography(newTypography);
    await AsyncStorage.setItem('selectedTypography', JSON.stringify(newTypography));
  };
  
  const validateFontSelection = (fontName: string): string => {
    return availableFontFamilies.includes(fontName) ? fontName : 'System';
  };
  
  const getRecommendedFontCombinations = () => {
    return [
      { primary: 'System', secondary: 'System', description: 'Modern and clean' },
      { primary: 'Helvetica', secondary: 'Georgia', description: 'Classic and readable' },
      { primary: 'Arial', secondary: 'Times New Roman', description: 'Traditional and formal' },
      { primary: 'SF Pro Display', secondary: 'SF Pro Text', description: 'iOS native feel' },
    ];
  };
  
  // Accessibility management methods
  const updateAccessibility = async (config: AccessibilityConfig) => {
    setAccessibility(config);
    await AsyncStorage.setItem('accessibilitySettings', JSON.stringify(config));
  };
  
  const toggleHighContrast = async () => {
    const newConfig = {
      ...accessibility,
      useHighContrast: !accessibility.useHighContrast,
    };
    await updateAccessibility(newConfig);
  };
  
  const toggleReducedMotion = async () => {
    const newConfig = {
      ...accessibility,
      reduceMotion: !accessibility.reduceMotion,
    };
    await updateAccessibility(newConfig);
  };
  
  const setColorBlindnessSupport = async (support: ColorBlindnessSupport) => {
    const newConfig = {
      ...accessibility,
      colorBlindnessSupport: support,
    };
    await updateAccessibility(newConfig);
  };
  
  const contextValue: EnhancedThemeContextType = {
    theme,
    themeName,
    typography,
    accessibility,
    switchTheme,
    toggleDarkMode,
    isDarkMode,
    updateTypography,
    getRecommendedFontCombinations,
    updateAccessibility,
    toggleHighContrast,
    toggleReducedMotion,
    setColorBlindnessSupport,
    availableFontFamilies,
    availableFontWeights,
  };
  
  return (
    <EnhancedThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </EnhancedThemeContext.Provider>
  );
};

// MARK: - Hook

export const useEnhancedTheme = (): EnhancedThemeContextType => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};

// MARK: - Utility Functions

export const getAvailableThemes = (): string[] => {
  return ['light', 'dark'];
};

export const createCustomTheme = (
  baseTheme: string,
  overrides: Partial<EnhancedTheme>
): EnhancedTheme => {
  const base = createEnhancedTheme({}); // You would get the actual base theme here
  return { ...base, ...overrides };
};

export type ThemeName = string; 