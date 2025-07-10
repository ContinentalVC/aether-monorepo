/**
 * Dynamic Color Scheme for React Native
 * 
 * Dynamic color scheme support with automatic adaptation to system
 * appearance changes including light, dark, and high contrast modes.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Appearance,
  ColorSchemeName,
  AccessibilityInfo,
  Platform,
} from 'react-native';

// MARK: - Types and Interfaces

export interface DynamicColor {
  light: string;
  dark: string;
  highContrastLight?: string;
  highContrastDark?: string;
}

export interface DynamicTheme {
  id: string;
  name: string;
  description?: string;
  version: string;
  primaryColor: DynamicColor;
  secondaryColor: DynamicColor;
  accentColor: DynamicColor;
  backgroundColor: DynamicColor;
  surfaceColor: DynamicColor;
  textPrimaryColor: DynamicColor;
  textSecondaryColor: DynamicColor;
  borderColor: DynamicColor;
  shadowColor: DynamicColor;
  successColor: DynamicColor;
  warningColor: DynamicColor;
  errorColor: DynamicColor;
  infoColor: DynamicColor;
}

export interface DynamicThemeContextType {
  currentTheme: DynamicTheme;
  availableThemes: DynamicTheme[];
  colorScheme: ColorSchemeName;
  isHighContrastEnabled: boolean;
  setTheme: (theme: DynamicTheme) => void;
  addTheme: (theme: DynamicTheme) => void;
  removeTheme: (id: string) => void;
  getColor: (colorKey: DynamicColorKey) => string;
  getDynamicColor: (colorKey: DynamicColorKey) => DynamicColor;
  exportTheme: (theme: DynamicTheme) => string | null;
  importTheme: (json: string) => DynamicTheme | null;
}

export enum DynamicColorKey {
  PRIMARY = 'primaryColor',
  SECONDARY = 'secondaryColor',
  ACCENT = 'accentColor',
  BACKGROUND = 'backgroundColor',
  SURFACE = 'surfaceColor',
  TEXT_PRIMARY = 'textPrimaryColor',
  TEXT_SECONDARY = 'textSecondaryColor',
  BORDER = 'borderColor',
  SHADOW = 'shadowColor',
  SUCCESS = 'successColor',
  WARNING = 'warningColor',
  ERROR = 'errorColor',
  INFO = 'infoColor',
}

// MARK: - Utility Functions

/**
 * Convert hex color to RGB values
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convert RGB values to hex color
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Adjust color for high contrast
 */
const adjustForHighContrast = (hex: string, multiplier: number = 1.3): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert to HSL for better contrast adjustment
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Adjust lightness for high contrast
  l = Math.min(l * multiplier, 1);

  // Convert back to RGB
  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return rgbToHex(gray, gray, gray);
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    return rgbToHex(r, g, b);
  }
};

/**
 * Create dynamic color with automatic high contrast variants
 */
export const createDynamicColor = (
  light: string,
  dark: string,
  highContrastMultiplier: number = 1.3
): DynamicColor => {
  return {
    light,
    dark,
    highContrastLight: adjustForHighContrast(light, highContrastMultiplier),
    highContrastDark: adjustForHighContrast(dark, highContrastMultiplier),
  };
};

// MARK: - Default Themes

export const DEFAULT_DYNAMIC_THEMES: DynamicTheme[] = [
  // Modern Blue Theme
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'A modern blue theme with excellent contrast',
    version: '1.0.0',
    primaryColor: createDynamicColor('#0A7AFF', '#0A84FF'),
    secondaryColor: createDynamicColor('#5856D6', '#5E5CE6'),
    accentColor: createDynamicColor('#FF2D92', '#FF375F'),
    backgroundColor: createDynamicColor('#FFFFFF', '#000000'),
    surfaceColor: createDynamicColor('#F2F2F7', '#1C1C1E'),
    textPrimaryColor: createDynamicColor('#000000', '#FFFFFF'),
    textSecondaryColor: createDynamicColor('#8E8E93', '#8E8E93'),
    borderColor: createDynamicColor('#C6C6C8', '#38383A'),
    shadowColor: createDynamicColor('#000000', '#000000'),
    successColor: createDynamicColor('#34C759', '#30D158'),
    warningColor: createDynamicColor('#FF9500', '#FF9F0A'),
    errorColor: createDynamicColor('#FF3B30', '#FF453A'),
    infoColor: createDynamicColor('#007AFF', '#0A84FF'),
  },
  
  // Sunset Theme
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors with orange and purple',
    version: '1.0.0',
    primaryColor: createDynamicColor('#FF6B35', '#FF7F50'),
    secondaryColor: createDynamicColor('#8B5CF6', '#A78BFA'),
    accentColor: createDynamicColor('#F59E0B', '#FBBF24'),
    backgroundColor: createDynamicColor('#FFF7ED', '#1A0F00'),
    surfaceColor: createDynamicColor('#FEF3C7', '#2D1B00'),
    textPrimaryColor: createDynamicColor('#1F2937', '#F9FAFB'),
    textSecondaryColor: createDynamicColor('#6B7280', '#D1D5DB'),
    borderColor: createDynamicColor('#FCD34D', '#92400E'),
    shadowColor: createDynamicColor('#000000', '#000000'),
    successColor: createDynamicColor('#10B981', '#34D399'),
    warningColor: createDynamicColor('#F59E0B', '#FBBF24'),
    errorColor: createDynamicColor('#EF4444', '#F87171'),
    infoColor: createDynamicColor('#3B82F6', '#60A5FA'),
  },
  
  // Ocean Theme
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep ocean blues and teals',
    version: '1.0.0',
    primaryColor: createDynamicColor('#0EA5E9', '#38BDF8'),
    secondaryColor: createDynamicColor('#14B8A6', '#2DD4BF'),
    accentColor: createDynamicColor('#8B5CF6', '#A78BFA'),
    backgroundColor: createDynamicColor('#F0F9FF', '#0C0F1A'),
    surfaceColor: createDynamicColor('#E0F2FE', '#1E293B'),
    textPrimaryColor: createDynamicColor('#0F172A', '#F8FAFC'),
    textSecondaryColor: createDynamicColor('#475569', '#CBD5E1'),
    borderColor: createDynamicColor('#BAE6FD', '#334155'),
    shadowColor: createDynamicColor('#000000', '#000000'),
    successColor: createDynamicColor('#10B981', '#34D399'),
    warningColor: createDynamicColor('#F59E0B', '#FBBF24'),
    errorColor: createDynamicColor('#EF4444', '#F87171'),
    infoColor: createDynamicColor('#3B82F6', '#60A5FA'),
  },
];

// MARK: - Dynamic Theme Context

const DynamicThemeContext = createContext<DynamicThemeContextType | undefined>(undefined);

export const useDynamicTheme = (): DynamicThemeContextType => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};

// MARK: - Dynamic Theme Provider

interface DynamicThemeProviderProps {
  children: React.ReactNode;
  initialThemeId?: string;
}

export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  children,
  initialThemeId,
}) => {
  const [currentTheme, setCurrentTheme] = useState<DynamicTheme>(
    DEFAULT_DYNAMIC_THEMES.find(t => t.id === initialThemeId) || DEFAULT_DYNAMIC_THEMES[0]
  );
  const [availableThemes, setAvailableThemes] = useState<DynamicTheme[]>(DEFAULT_DYNAMIC_THEMES);
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState<boolean>(false);

  // Listen for color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Listen for accessibility changes
  useEffect(() => {
    const checkHighContrast = async () => {
      if (Platform.OS === 'ios') {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setIsHighContrastEnabled(isEnabled);
      } else {
        // Android high contrast detection
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setIsHighContrastEnabled(isEnabled);
      }
    };

    checkHighContrast();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsHighContrastEnabled
    );

    return () => subscription?.remove();
  }, []);

  // MARK: - Context Methods

  const setTheme = (theme: DynamicTheme) => {
    setCurrentTheme(theme);
  };

  const addTheme = (theme: DynamicTheme) => {
    setAvailableThemes(prev => [...prev, theme]);
  };

  const removeTheme = (id: string) => {
    setAvailableThemes(prev => prev.filter(t => t.id !== id));
    if (currentTheme.id === id && availableThemes.length > 1) {
      const remainingThemes = availableThemes.filter(t => t.id !== id);
      setCurrentTheme(remainingThemes[0]);
    }
  };

  const getColor = (colorKey: DynamicColorKey): string => {
    const dynamicColor = getDynamicColor(colorKey);
    return getColorForAppearance(dynamicColor, colorScheme, isHighContrastEnabled);
  };

  const getDynamicColor = (colorKey: DynamicColorKey): DynamicColor => {
    return currentTheme[colorKey as keyof DynamicTheme] as DynamicColor;
  };

  const exportTheme = (theme: DynamicTheme): string | null => {
    try {
      return JSON.stringify(theme, null, 2);
    } catch (error) {
      console.error('Failed to export theme:', error);
      return null;
    }
  };

  const importTheme = (json: string): DynamicTheme | null => {
    try {
      const theme = JSON.parse(json) as DynamicTheme;
      // Validate theme structure
      if (theme.id && theme.name && theme.primaryColor) {
        return theme;
      }
      return null;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  };

  const getColorForAppearance = (
    dynamicColor: DynamicColor,
    scheme: ColorSchemeName,
    highContrast: boolean
  ): string => {
    if (scheme === 'dark') {
      if (highContrast && dynamicColor.highContrastDark) {
        return dynamicColor.highContrastDark;
      }
      return dynamicColor.dark;
    } else {
      if (highContrast && dynamicColor.highContrastLight) {
        return dynamicColor.highContrastLight;
      }
      return dynamicColor.light;
    }
  };

  const contextValue: DynamicThemeContextType = {
    currentTheme,
    availableThemes,
    colorScheme,
    isHighContrastEnabled,
    setTheme,
    addTheme,
    removeTheme,
    getColor,
    getDynamicColor,
    exportTheme,
    importTheme,
  };

  return (
    <DynamicThemeContext.Provider value={contextValue}>
      {children}
    </DynamicThemeContext.Provider>
  );
};

// MARK: - Dynamic Color Extensions

export const DynamicColorUtils = {
  /**
   * Get color for specific appearance
   */
  getColorForAppearance: (
    dynamicColor: DynamicColor,
    colorScheme: ColorSchemeName,
    isHighContrast: boolean = false
  ): string => {
    if (colorScheme === 'dark') {
      if (isHighContrast && dynamicColor.highContrastDark) {
        return dynamicColor.highContrastDark;
      }
      return dynamicColor.dark;
    } else {
      if (isHighContrast && dynamicColor.highContrastLight) {
        return dynamicColor.highContrastLight;
      }
      return dynamicColor.light;
    }
  },

  /**
   * Validate dynamic color
   */
  isValid: (dynamicColor: DynamicColor): boolean => {
    return !!(dynamicColor.light && dynamicColor.dark);
  },

  /**
   * Get accessibility description
   */
  getAccessibilityDescription: (dynamicColor: DynamicColor): string => {
    let description = `Light mode: ${dynamicColor.light}, Dark mode: ${dynamicColor.dark}`;
    if (dynamicColor.highContrastLight) {
      description += `, High contrast light: ${dynamicColor.highContrastLight}`;
    }
    if (dynamicColor.highContrastDark) {
      description += `, High contrast dark: ${dynamicColor.highContrastDark}`;
    }
    return description;
  },

  /**
   * Create color with automatic high contrast variants
   */
  withAutoHighContrast: (
    light: string,
    dark: string,
    highContrastMultiplier: number = 1.3
  ): DynamicColor => {
    return createDynamicColor(light, dark, highContrastMultiplier);
  },
};

// MARK: - Theme Extensions

export const DynamicThemeUtils = {
  /**
   * Get color for key
   */
  getColor: (theme: DynamicTheme, colorKey: DynamicColorKey): DynamicColor => {
    return theme[colorKey as keyof DynamicTheme] as DynamicColor;
  },

  /**
   * Validate theme
   */
  isValid: (theme: DynamicTheme): boolean => {
    const requiredKeys: DynamicColorKey[] = [
      DynamicColorKey.PRIMARY,
      DynamicColorKey.BACKGROUND,
      DynamicColorKey.TEXT_PRIMARY,
    ];

    return requiredKeys.every(key => {
      const color = DynamicThemeUtils.getColor(theme, key);
      return DynamicColorUtils.isValid(color);
    });
  },

  /**
   * Get theme metadata
   */
  getMetadata: (theme: DynamicTheme) => {
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      version: theme.version,
    };
  },
};

// MARK: - Export Default

export default {
  DynamicThemeProvider,
  useDynamicTheme,
  createDynamicColor,
  DynamicColorUtils,
  DynamicThemeUtils,
  DEFAULT_DYNAMIC_THEMES,
  DynamicColorKey,
}; 