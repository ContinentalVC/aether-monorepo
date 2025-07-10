/**
 * Theme Data Model
 * 
 * Comprehensive theme data structure with JSON serialization,
 * validation, and portability features for consistent theming.
 */

import { Platform } from 'react-native';

// MARK: - Core Theme Data Model

export interface ThemeDataModel {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
  metadata: ThemeMetadata;
  colors: ColorPalette;
  typography: TypographySystem;
  spacing: SpacingSystem;
  shadows: ShadowSystem;
  animations: AnimationSystem;
  icons: IconSystem;
  accessibility: AccessibilitySettings;
}

export interface ThemeMetadata {
  tags: string[];
  category: ThemeCategory;
  platform: ThemePlatform[];
  minVersion?: string;
  maxVersion?: string;
  license?: string;
  website?: string;
  previewImage?: string;
}

export enum ThemeCategory {
  GENERAL = 'General',
  BUSINESS = 'Business',
  CREATIVE = 'Creative',
  GAMING = 'Gaming',
  EDUCATION = 'Education',
  HEALTH = 'Health',
  FINANCE = 'Finance',
  SOCIAL = 'Social',
  PRODUCTIVITY = 'Productivity',
  ENTERTAINMENT = 'Entertainment',
}

export enum ThemePlatform {
  IOS = 'iOS',
  ANDROID = 'Android',
  WEB = 'Web',
  DESKTOP = 'Desktop',
  TV = 'TV',
  WATCH = 'Watch',
}

// MARK: - Color Palette

export interface ColorPalette {
  primary: ColorDefinition;
  secondary: ColorDefinition;
  tertiary: ColorDefinition;
  background: BackgroundColors;
  surface: SurfaceColors;
  text: TextColors;
  semantic: SemanticColors;
  custom: Record<string, ColorDefinition>;
}

export interface ColorDefinition {
  light: string;
  dark: string;
  alpha?: number;
}

export interface BackgroundColors {
  primary: ColorDefinition;
  secondary: ColorDefinition;
  tertiary: ColorDefinition;
}

export interface SurfaceColors {
  primary: ColorDefinition;
  secondary: ColorDefinition;
  tertiary: ColorDefinition;
  elevated: ColorDefinition;
}

export interface TextColors {
  primary: ColorDefinition;
  secondary: ColorDefinition;
  tertiary: ColorDefinition;
  quaternary: ColorDefinition;
  inverse: ColorDefinition;
}

export interface SemanticColors {
  success: ColorDefinition;
  warning: ColorDefinition;
  error: ColorDefinition;
  info: ColorDefinition;
}

// MARK: - Typography System

export interface TypographySystem {
  fontFamilies: FontFamilies;
  fontSizes: FontSizes;
  fontWeights: FontWeights;
  lineHeights: LineHeights;
  letterSpacing: LetterSpacing;
  textStyles: TextStyles;
}

export interface FontFamilies {
  primary: string;
  secondary: string;
  monospace: string;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface FontWeights {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
  heavy: string;
}

export interface LineHeights {
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface LetterSpacing {
  tight: number;
  normal: number;
  wide: number;
}

export interface TextStyles {
  heading: HeadingStyles;
  body: BodyStyles;
  caption: CaptionStyles;
  button: ButtonStyles;
}

export interface HeadingStyles {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
}

export interface BodyStyles {
  large: TextStyle;
  medium: TextStyle;
  small: TextStyle;
}

export interface CaptionStyles {
  large: TextStyle;
  medium: TextStyle;
  small: TextStyle;
}

export interface ButtonStyles {
  large: TextStyle;
  medium: TextStyle;
  small: TextStyle;
}

export interface TextStyle {
  size: number;
  weight: string;
  lineHeight: number;
  letterSpacing?: number;
}

// MARK: - Spacing System

export interface SpacingSystem {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

// MARK: - Shadow System

export interface ShadowSystem {
  small: ShadowDefinition;
  medium: ShadowDefinition;
  large: ShadowDefinition;
  xlarge: ShadowDefinition;
}

export interface ShadowDefinition {
  radius: number;
  offset: { x: number; y: number };
  opacity: number;
  color?: ColorDefinition;
}

// MARK: - Animation System

export interface AnimationSystem {
  duration: AnimationDuration;
  easing: AnimationEasing;
  spring: SpringConfiguration;
}

export interface AnimationDuration {
  fast: number;
  normal: number;
  slow: number;
}

export interface AnimationEasing {
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  linear: string;
}

export interface SpringConfiguration {
  response: number;
  dampingFraction: number;
  blendDuration: number;
}

// MARK: - Icon System

export interface IconSystem {
  family: string;
  sizes: IconSizes;
  weights: IconWeights;
}

export interface IconSizes {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export interface IconWeights {
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
}

// MARK: - Accessibility Settings

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  increasedContrast: boolean;
  darkMode: boolean;
  dynamicType: boolean;
}

// MARK: - Default Values

export const createDefaultThemeDataModel = (name: string): ThemeDataModel => ({
  id: generateId(),
  name,
  version: '1.0.0',
  description: undefined,
  author: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: createDefaultMetadata(),
  colors: createDefaultColorPalette(),
  typography: createDefaultTypographySystem(),
  spacing: createDefaultSpacingSystem(),
  shadows: createDefaultShadowSystem(),
  animations: createDefaultAnimationSystem(),
  icons: createDefaultIconSystem(),
  accessibility: createDefaultAccessibilitySettings(),
});

export const createDefaultMetadata = (): ThemeMetadata => ({
  tags: [],
  category: ThemeCategory.GENERAL,
  platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
  minVersion: undefined,
  maxVersion: undefined,
  license: undefined,
  website: undefined,
  previewImage: undefined,
});

export const createDefaultColorPalette = (): ColorPalette => ({
  primary: { light: '#007AFF', dark: '#0A84FF' },
  secondary: { light: '#5856D6', dark: '#5E5CE6' },
  tertiary: { light: '#FF9500', dark: '#FF9F0A' },
  background: {
    primary: { light: '#FFFFFF', dark: '#000000' },
    secondary: { light: '#F2F2F7', dark: '#1C1C1E' },
    tertiary: { light: '#E5E5EA', dark: '#2C2C2E' },
  },
  surface: {
    primary: { light: '#FFFFFF', dark: '#1C1C1E' },
    secondary: { light: '#F2F2F7', dark: '#2C2C2E' },
    tertiary: { light: '#E5E5EA', dark: '#3A3A3C' },
    elevated: { light: '#FFFFFF', dark: '#2C2C2E' },
  },
  text: {
    primary: { light: '#000000', dark: '#FFFFFF' },
    secondary: { light: '#3C3C43', dark: '#EBEBF5' },
    tertiary: { light: '#787880', dark: '#EBEBF599' },
    quaternary: { light: '#787880', dark: '#EBEBF54D' },
    inverse: { light: '#FFFFFF', dark: '#000000' },
  },
  semantic: {
    success: { light: '#34C759', dark: '#30D158' },
    warning: { light: '#FF9500', dark: '#FF9F0A' },
    error: { light: '#FF3B30', dark: '#FF453A' },
    info: { light: '#007AFF', dark: '#0A84FF' },
  },
  custom: {},
});

export const createDefaultTypographySystem = (): TypographySystem => ({
  fontFamilies: {
    primary: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    secondary: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    monospace: Platform.OS === 'ios' ? 'SF Mono' : 'Roboto Mono',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2.0,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0.0,
    wide: 0.5,
  },
  textStyles: {
    heading: {
      h1: { size: 32, weight: '700', lineHeight: 1.2 },
      h2: { size: 28, weight: '700', lineHeight: 1.3 },
      h3: { size: 24, weight: '600', lineHeight: 1.3 },
      h4: { size: 20, weight: '600', lineHeight: 1.4 },
      h5: { size: 18, weight: '500', lineHeight: 1.4 },
      h6: { size: 16, weight: '500', lineHeight: 1.5 },
    },
    body: {
      large: { size: 18, weight: '400', lineHeight: 1.5 },
      medium: { size: 16, weight: '400', lineHeight: 1.5 },
      small: { size: 14, weight: '400', lineHeight: 1.5 },
    },
    caption: {
      large: { size: 12, weight: '500', lineHeight: 1.3 },
      medium: { size: 11, weight: '400', lineHeight: 1.3 },
      small: { size: 10, weight: '400', lineHeight: 1.2 },
    },
    button: {
      large: { size: 18, weight: '600', lineHeight: 1.2 },
      medium: { size: 16, weight: '600', lineHeight: 1.2 },
      small: { size: 14, weight: '500', lineHeight: 1.2 },
    },
  },
});

export const createDefaultSpacingSystem = (): SpacingSystem => ({
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
});

export const createDefaultShadowSystem = (): ShadowSystem => ({
  small: {
    radius: 2,
    offset: { x: 0, y: 1 },
    opacity: 0.1,
  },
  medium: {
    radius: 4,
    offset: { x: 0, y: 2 },
    opacity: 0.15,
  },
  large: {
    radius: 8,
    offset: { x: 0, y: 4 },
    opacity: 0.2,
  },
  xlarge: {
    radius: 16,
    offset: { x: 0, y: 8 },
    opacity: 0.25,
  },
});

export const createDefaultAnimationSystem = (): AnimationSystem => ({
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    linear: 'linear',
  },
  spring: {
    response: 0.3,
    dampingFraction: 0.7,
    blendDuration: 0.0,
  },
});

export const createDefaultIconSystem = (): IconSystem => ({
  family: Platform.OS === 'ios' ? 'SF Symbols' : 'Material Icons',
  sizes: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
});

export const createDefaultAccessibilitySettings = (): AccessibilitySettings => ({
  highContrast: false,
  reducedMotion: false,
  increasedContrast: false,
  darkMode: true,
  dynamicType: true,
});

// MARK: - Validation

export interface ThemeValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
}

export enum ValidationErrorType {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_COLOR = 'INVALID_COLOR',
  INVALID_FONT_SIZE = 'INVALID_FONT_SIZE',
  INVALID_SPACING = 'INVALID_SPACING',
  INVALID_SHADOW = 'INVALID_SHADOW',
  INVALID_ANIMATION = 'INVALID_ANIMATION',
  INVALID_VERSION = 'INVALID_VERSION',
}

export class ThemeValidator {
  static validate(theme: ThemeDataModel): ThemeValidationError[] {
    const errors: ThemeValidationError[] = [];

    // Validate required fields
    if (!theme.name || theme.name.trim() === '') {
      errors.push({
        type: ValidationErrorType.MISSING_REQUIRED_FIELD,
        field: 'name',
        message: 'Theme name is required',
      });
    }

    if (!theme.version || theme.version.trim() === '') {
      errors.push({
        type: ValidationErrorType.MISSING_REQUIRED_FIELD,
        field: 'version',
        message: 'Theme version is required',
      });
    }

    // Validate version format (semantic versioning)
    if (theme.version && !isValidSemanticVersion(theme.version)) {
      errors.push({
        type: ValidationErrorType.INVALID_VERSION,
        field: 'version',
        message: 'Version must follow semantic versioning (e.g., 1.0.0)',
      });
    }

    // Validate colors
    if (!isValidColor(theme.colors.primary.light) || !isValidColor(theme.colors.primary.dark)) {
      errors.push({
        type: ValidationErrorType.INVALID_COLOR,
        field: 'colors.primary',
        message: 'Primary color must be a valid hex color',
      });
    }

    if (!isValidColor(theme.colors.secondary.light) || !isValidColor(theme.colors.secondary.dark)) {
      errors.push({
        type: ValidationErrorType.INVALID_COLOR,
        field: 'colors.secondary',
        message: 'Secondary color must be a valid hex color',
      });
    }

    // Validate typography
    if (theme.typography.fontSizes.xs <= 0) {
      errors.push({
        type: ValidationErrorType.INVALID_FONT_SIZE,
        field: 'typography.fontSizes.xs',
        message: 'Font size must be greater than 0',
      });
    }

    // Validate spacing
    if (theme.spacing.xs < 0) {
      errors.push({
        type: ValidationErrorType.INVALID_SPACING,
        field: 'spacing.xs',
        message: 'Spacing must be non-negative',
      });
    }

    // Validate shadows
    if (theme.shadows.small.opacity < 0 || theme.shadows.small.opacity > 1) {
      errors.push({
        type: ValidationErrorType.INVALID_SHADOW,
        field: 'shadows.small.opacity',
        message: 'Shadow opacity must be between 0 and 1',
      });
    }

    return errors;
  }

  static isValid(theme: ThemeDataModel): boolean {
    return this.validate(theme).length === 0;
  }
}

// MARK: - Serialization

export class ThemeSerialization {
  static encode(theme: ThemeDataModel): string {
    return JSON.stringify(theme, null, 2);
  }

  static decode(json: string): ThemeDataModel {
    try {
      const parsed = JSON.parse(json);
      return this.validateAndTransform(parsed);
    } catch (error) {
      throw new ThemeSerializationError('Failed to parse JSON', error as Error);
    }
  }

  static encodeToBase64(theme: ThemeDataModel): string {
    const json = this.encode(theme);
    return Buffer.from(json, 'utf8').toString('base64');
  }

  static decodeFromBase64(base64: string): ThemeDataModel {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf8');
      return this.decode(json);
    } catch (error) {
      throw new ThemeSerializationError('Failed to decode base64', error as Error);
    }
  }

  private static validateAndTransform(data: any): ThemeDataModel {
    // Basic validation and transformation
    if (!data || typeof data !== 'object') {
      throw new ThemeSerializationError('Invalid theme data structure');
    }

    // Ensure required fields exist
    const theme: ThemeDataModel = {
      id: data.id || generateId(),
      name: data.name || 'Untitled Theme',
      version: data.version || '1.0.0',
      description: data.description,
      author: data.author,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      metadata: data.metadata || createDefaultMetadata(),
      colors: data.colors || createDefaultColorPalette(),
      typography: data.typography || createDefaultTypographySystem(),
      spacing: data.spacing || createDefaultSpacingSystem(),
      shadows: data.shadows || createDefaultShadowSystem(),
      animations: data.animations || createDefaultAnimationSystem(),
      icons: data.icons || createDefaultIconSystem(),
      accessibility: data.accessibility || createDefaultAccessibilitySettings(),
    };

    return theme;
  }
}

export class ThemeSerializationError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'ThemeSerializationError';
  }
}

// MARK: - Utilities

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function isValidColor(color: string): boolean {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
}

export function isValidSemanticVersion(version: string): boolean {
  const semverPattern = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
  return semverPattern.test(version);
}

export function getThemeCategoryDescription(category: ThemeCategory): string {
  switch (category) {
    case ThemeCategory.GENERAL:
      return 'General purpose themes';
    case ThemeCategory.BUSINESS:
      return 'Professional business themes';
    case ThemeCategory.CREATIVE:
      return 'Creative and artistic themes';
    case ThemeCategory.GAMING:
      return 'Gaming and entertainment themes';
    case ThemeCategory.EDUCATION:
      return 'Educational and learning themes';
    case ThemeCategory.HEALTH:
      return 'Health and wellness themes';
    case ThemeCategory.FINANCE:
      return 'Financial and banking themes';
    case ThemeCategory.SOCIAL:
      return 'Social media themes';
    case ThemeCategory.PRODUCTIVITY:
      return 'Productivity and work themes';
    case ThemeCategory.ENTERTAINMENT:
      return 'Entertainment and media themes';
  }
}

export function getPlatformDescription(platform: ThemePlatform): string {
  switch (platform) {
    case ThemePlatform.IOS:
      return 'iPhone and iPad';
    case ThemePlatform.ANDROID:
      return 'Android devices';
    case ThemePlatform.WEB:
      return 'Web browsers';
    case ThemePlatform.DESKTOP:
      return 'Desktop computers';
    case ThemePlatform.TV:
      return 'Smart TVs';
    case ThemePlatform.WATCH:
      return 'Smart watches';
  }
}

// MARK: - Type Guards

export function isThemeDataModel(obj: any): obj is ThemeDataModel {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.version === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.metadata === 'object' &&
    typeof obj.colors === 'object' &&
    typeof obj.typography === 'object' &&
    typeof obj.spacing === 'object' &&
    typeof obj.shadows === 'object' &&
    typeof obj.animations === 'object' &&
    typeof obj.icons === 'object' &&
    typeof obj.accessibility === 'object'
  );
}

export function isColorDefinition(obj: any): obj is ColorDefinition {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.light === 'string' &&
    typeof obj.dark === 'string' &&
    (obj.alpha === undefined || typeof obj.alpha === 'number')
  );
}

export function isTypographySystem(obj: any): obj is TypographySystem {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.fontFamilies === 'object' &&
    typeof obj.fontSizes === 'object' &&
    typeof obj.fontWeights === 'object' &&
    typeof obj.lineHeights === 'object' &&
    typeof obj.letterSpacing === 'object' &&
    typeof obj.textStyles === 'object'
  );
} 