/**
 * Shared Colors Configuration
 * 
 * This file centralizes all color values used throughout the React Native app.
 * Colors are organized by semantic meaning and include both light and dark variants.
 */

export const Colors = {
  // Primary Colors
  primary: {
    main: '#007AFF',
    light: '#4DA3FF',
    dark: '#0056CC',
    contrast: '#FFFFFF',
  },

  // Secondary Colors
  secondary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrast: '#FFFFFF',
  },

  // Success Colors
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20',
    contrast: '#FFFFFF',
    background: '#E8F5E8',
  },

  // Error Colors
  error: {
    main: '#C62828',
    light: '#EF5350',
    dark: '#B71C1C',
    contrast: '#FFFFFF',
    background: '#FFEBEE',
  },

  // Warning Colors
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrast: '#FFFFFF',
    background: '#FFF3E0',
  },

  // Info Colors
  info: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrast: '#FFFFFF',
    background: '#E3F2FD',
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    disabled: '#B0B0B0',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#F0F0F0',
    card: '#FFFFFF',
    modal: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#DDDDDD',
    dark: '#CCCCCC',
    focus: '#007AFF',
  },

  // Shadow Colors
  shadow: {
    light: '#000000',
    dark: '#000000',
  },

  // Status Colors
  status: {
    active: '#007AFF',
    inactive: '#8E8E93',
    selected: '#FF3B30',
  },

  // iOS System Colors
  system: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D92',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC02',
    gray: '#8E8E93',
    gray2: '#AEAEB2',
    gray3: '#C7C7CC',
    gray4: '#D1D1D6',
    gray5: '#E5E5EA',
    gray6: '#F2F2F7',
  },

  // Material Design Colors (for compatibility)
  material: {
    blue: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      500: '#2196F3',
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1',
    },
    red: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      500: '#F44336',
      600: '#E53935',
      700: '#D32F2F',
      800: '#C62828',
      900: '#B71C1C',
    },
    green: {
      50: '#E8F5E8',
      100: '#C8E6C9',
      500: '#4CAF50',
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
  },
} as const;

// Type for color keys
export type ColorKey = keyof typeof Colors;

// Helper function to get nested color values
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let current: any = Colors;
  
  for (const key of keys) {
    if (current[key] === undefined) {
      console.warn(`Color not found: ${path}`);
      return Colors.neutral.gray[500]; // fallback
    }
    current = current[key];
  }
  
  return current;
};

// Export individual color constants for easy access
export const {
  primary,
  secondary,
  success,
  error,
  warning,
  info,
  neutral,
  text,
  background,
  border,
  shadow,
  status,
  system,
  material,
} = Colors; 