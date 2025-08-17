/**
 * Theme Schema
 *
 * Comprehensive theme schema system with structured, hierarchical design
 * following Shopify's JSON template approach for maintainable theming.
 */

import { Platform as RNPlatform } from 'react-native';

// MARK: - Theme Schema

/**
 * Root theme schema following structured, hierarchical design
 */
export interface ThemeSchema {
  id: string;
  metadata: ThemeMetadata;
  properties: ThemeProperties;
}

/**
 * Theme metadata for organization and versioning
 */
export interface ThemeMetadata {
  name: string;
  author: string;
  version: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: ThemeCategory;
  platform: Platform[];
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

export enum Platform {
  IOS = 'iOS',
  ANDROID = 'Android',
  WEB = 'Web',
  DESKTOP = 'Desktop',
  TV = 'TV',
  WATCH = 'Watch',
}

// MARK: - Theme Properties

/**
 * Primary properties object containing all customizable categories
 */
export interface ThemeProperties {
  colors: ColorProperties;
  typography: TypographyProperties;
  iconography: IconographyProperties;
  layoutMetrics: LayoutMetricsProperties;
  shadows: ShadowProperties;
  animations: AnimationProperties;
  accessibility: AccessibilityProperties;
  custom: Record<string, CustomProperty>;
}

// MARK: - Color Properties

/**
 * Color properties following the structured schema approach
 */
export interface ColorProperties {
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
  destructive: ColorDefinition;
}

// MARK: - Typography Properties

/**
 * Typography properties following the structured schema approach
 */
export interface TypographyProperties {
  primaryFontName: string;
  bodyFontName: string;
  monospaceFontName: string;
  headingScaleFactor: number;
  baseFontSize: number;
  fontWeights: FontWeights;
  lineHeights: LineHeights;
  letterSpacing: LetterSpacing;
  textStyles: TextStyles;
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

// MARK: - Iconography Properties

/**
 * Iconography properties following the structured schema approach
 */
export interface IconographyProperties {
  family: string;
  sizes: IconSizes;
  weights: IconWeights;
  colors: IconColors;
  custom: Record<string, IconDefinition>;
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

export interface IconColors {
  primary: ColorDefinition;
  secondary: ColorDefinition;
  tertiary: ColorDefinition;
  disabled: ColorDefinition;
}

export interface IconDefinition {
  name: string;
  size: number;
  weight: string;
  color?: ColorDefinition;
}

// MARK: - Layout Metrics Properties

/**
 * Layout metrics properties following the structured schema approach
 */
export interface LayoutMetricsProperties {
  spacing: SpacingMetrics;
  padding: PaddingMetrics;
  margins: MarginMetrics;
  borderRadius: BorderRadiusMetrics;
  grid: GridMetrics;
  breakpoints: BreakpointMetrics;
}

export interface SpacingMetrics {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface PaddingMetrics {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface MarginMetrics {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface BorderRadiusMetrics {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface GridMetrics {
  columns: number;
  gutter: number;
  margin: number;
}

export interface BreakpointMetrics {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

// MARK: - Shadow Properties

/**
 * Shadow properties following the structured schema approach
 */
export interface ShadowProperties {
  small: ShadowDefinition;
  medium: ShadowDefinition;
  large: ShadowDefinition;
  xlarge: ShadowDefinition;
  custom: Record<string, ShadowDefinition>;
}

export interface ShadowDefinition {
  radius: number;
  offset: { x: number; y: number };
  opacity: number;
  color?: ColorDefinition;
}

// MARK: - Animation Properties

/**
 * Animation properties following the structured schema approach
 */
export interface AnimationProperties {
  duration: AnimationDuration;
  easing: AnimationEasing;
  spring: SpringConfiguration;
  custom: Record<string, AnimationDefinition>;
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

export interface AnimationDefinition {
  duration: number;
  easing: string;
  delay?: number;
  repeatCount?: number;
}

// MARK: - Accessibility Properties

/**
 * Accessibility properties following the structured schema approach
 */
export interface AccessibilityProperties {
  highContrast: boolean;
  reducedMotion: boolean;
  increasedContrast: boolean;
  darkMode: boolean;
  dynamicType: boolean;
  voiceOver: VoiceOverSettings;
  switchControl: SwitchControlSettings;
}

export interface VoiceOverSettings {
  enabled: boolean;
  speakScreen: boolean;
  speakSelection: boolean;
  largeCursor: boolean;
}

export interface SwitchControlSettings {
  enabled: boolean;
  autoScanning: boolean;
  groupItems: boolean;
}

// MARK: - Custom Properties

/**
 * Custom property for extensible schema
 */
export interface CustomProperty {
  type: string;
  value: string;
  description?: string;
}

// MARK: - Default Values

export const createDefaultThemeSchema = (name: string, author: string): ThemeSchema => ({
  id: generateId(),
  metadata: createDefaultMetadata(name, author),
  properties: createDefaultProperties()
});

export const createDefaultMetadata = (name: string, author: string): ThemeMetadata => ({
  name,
  author,
  version: '1.0.0',
  description: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  tags: [],
  category: ThemeCategory.GENERAL,
  platform: [Platform.IOS, Platform.ANDROID],
  license: undefined,
  website: undefined,
  previewImage: undefined
});

export const createDefaultProperties = (): ThemeProperties => ({
  colors: createDefaultColorProperties(),
  typography: createDefaultTypographyProperties(),
  iconography: createDefaultIconographyProperties(),
  layoutMetrics: createDefaultLayoutMetricsProperties(),
  shadows: createDefaultShadowProperties(),
  animations: createDefaultAnimationProperties(),
  accessibility: createDefaultAccessibilityProperties(),
  custom: {}
});

export const createDefaultColorProperties = (): ColorProperties => ({
  primary: { light: '#0A7AFF', dark: '#0A84FF' },
  secondary: { light: '#FF9500', dark: '#FF9F0A' },
  tertiary: { light: '#5856D6', dark: '#5E5CE6' },
  background: {
    primary: { light: '#FFFFFF', dark: '#000000' },
    secondary: { light: '#F2F2F7', dark: '#1C1C1E' },
    tertiary: { light: '#E5E5EA', dark: '#2C2C2E' }
  },
  surface: {
    primary: { light: '#FFFFFF', dark: '#1C1C1E' },
    secondary: { light: '#F2F2F7', dark: '#2C2C2E' },
    tertiary: { light: '#E5E5EA', dark: '#3A3A3C' },
    elevated: { light: '#FFFFFF', dark: '#2C2C2E' }
  },
  text: {
    primary: { light: '#1D1D1F', dark: '#FFFFFF' },
    secondary: { light: '#3C3C43', dark: '#EBEBF5' },
    tertiary: { light: '#787880', dark: '#EBEBF599' },
    quaternary: { light: '#787880', dark: '#EBEBF54D' },
    inverse: { light: '#FFFFFF', dark: '#1D1D1F' }
  },
  semantic: {
    success: { light: '#34C759', dark: '#30D158' },
    warning: { light: '#FF9500', dark: '#FF9F0A' },
    error: { light: '#FF3B30', dark: '#FF453A' },
    info: { light: '#007AFF', dark: '#0A84FF' },
    destructive: { light: '#FF3B30', dark: '#FF453A' }
  },
  custom: {}
});

export const createDefaultTypographyProperties = (): TypographyProperties => ({
  primaryFontName: RNPlatform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'Roboto-Bold',
  bodyFontName: RNPlatform.OS === 'ios' ? 'HelveticaNeue' : 'Roboto',
  monospaceFontName: RNPlatform.OS === 'ios' ? 'SF Mono' : 'Roboto Mono',
  headingScaleFactor: 1.5,
  baseFontSize: 17,
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800'
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2.0
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0.0,
    wide: 0.5
  },
  textStyles: {
    heading: {
      h1: { size: 32, weight: '700', lineHeight: 1.2 },
      h2: { size: 28, weight: '700', lineHeight: 1.3 },
      h3: { size: 24, weight: '600', lineHeight: 1.3 },
      h4: { size: 20, weight: '600', lineHeight: 1.4 },
      h5: { size: 18, weight: '500', lineHeight: 1.4 },
      h6: { size: 16, weight: '500', lineHeight: 1.5 }
    },
    body: {
      large: { size: 18, weight: '400', lineHeight: 1.5 },
      medium: { size: 16, weight: '400', lineHeight: 1.5 },
      small: { size: 14, weight: '400', lineHeight: 1.5 }
    },
    caption: {
      large: { size: 12, weight: '500', lineHeight: 1.3 },
      medium: { size: 11, weight: '400', lineHeight: 1.3 },
      small: { size: 10, weight: '400', lineHeight: 1.2 }
    },
    button: {
      large: { size: 18, weight: '600', lineHeight: 1.2 },
      medium: { size: 16, weight: '600', lineHeight: 1.2 },
      small: { size: 14, weight: '500', lineHeight: 1.2 }
    }
  }
});

export const createDefaultIconographyProperties = (): IconographyProperties => ({
  family: RNPlatform.OS === 'ios' ? 'SF Symbols' : 'Material Icons',
  sizes: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  colors: {
    primary: { light: '#0A7AFF', dark: '#0A84FF' },
    secondary: { light: '#787880', dark: '#EBEBF599' },
    tertiary: { light: '#C7C7CC', dark: '#48484A' },
    disabled: { light: '#C7C7CC', dark: '#48484A' }
  },
  custom: {}
});

export const createDefaultLayoutMetricsProperties = (): LayoutMetricsProperties => ({
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64
  },
  padding: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  margins: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 999
  },
  grid: {
    columns: 12,
    gutter: 16,
    margin: 16
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    wide: 1920
  }
});

export const createDefaultShadowProperties = (): ShadowProperties => ({
  small: {
    radius: 2,
    offset: { x: 0, y: 1 },
    opacity: 0.1
  },
  medium: {
    radius: 4,
    offset: { x: 0, y: 2 },
    opacity: 0.15
  },
  large: {
    radius: 8,
    offset: { x: 0, y: 4 },
    opacity: 0.2
  },
  xlarge: {
    radius: 16,
    offset: { x: 0, y: 8 },
    opacity: 0.25
  },
  custom: {}
});

export const createDefaultAnimationProperties = (): AnimationProperties => ({
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5
  },
  easing: {
    easeIn: 'easeIn',
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
    linear: 'linear'
  },
  spring: {
    response: 0.3,
    dampingFraction: 0.7,
    blendDuration: 0.0
  },
  custom: {}
});

export const createDefaultAccessibilityProperties = (): AccessibilityProperties => ({
  highContrast: false,
  reducedMotion: false,
  increasedContrast: false,
  darkMode: true,
  dynamicType: true,
  voiceOver: {
    enabled: false,
    speakScreen: false,
    speakSelection: false,
    largeCursor: false
  },
  switchControl: {
    enabled: false,
    autoScanning: false,
    groupItems: false
  }
});

// MARK: - Validation

export interface SchemaValidationError {
  type: ValidationErrorType;
  field: string;
  message: string;
}

export enum ValidationErrorType {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_COLOR = 'INVALID_COLOR',
  INVALID_FONT_SIZE = 'INVALID_FONT_SIZE',
  INVALID_SCALE_FACTOR = 'INVALID_SCALE_FACTOR',
  INVALID_SPACING = 'INVALID_SPACING',
  INVALID_SHADOW_OPACITY = 'INVALID_SHADOW_OPACITY',
  INVALID_ANIMATION = 'INVALID_ANIMATION',
  INVALID_VERSION = 'INVALID_VERSION',
}

export class SchemaValidator {
  static validate(schema: ThemeSchema): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    // Validate required fields
    if (!schema.metadata.name || schema.metadata.name.trim() === '') {
      errors.push({
        type: ValidationErrorType.MISSING_REQUIRED_FIELD,
        field: 'metadata.name',
        message: 'Theme name is required'
      });
    }

    if (!schema.metadata.author || schema.metadata.author.trim() === '') {
      errors.push({
        type: ValidationErrorType.MISSING_REQUIRED_FIELD,
        field: 'metadata.author',
        message: 'Theme author is required'
      });
    }

    if (!schema.metadata.version || schema.metadata.version.trim() === '') {
      errors.push({
        type: ValidationErrorType.MISSING_REQUIRED_FIELD,
        field: 'metadata.version',
        message: 'Theme version is required'
      });
    }

    // Validate version format (semantic versioning)
    if (schema.metadata.version && !isValidSemanticVersion(schema.metadata.version)) {
      errors.push({
        type: ValidationErrorType.INVALID_VERSION,
        field: 'metadata.version',
        message: 'Version must follow semantic versioning (e.g., 1.0.0)'
      });
    }

    // Validate colors
    if (!isValidColor(schema.properties.colors.primary.light) || !isValidColor(schema.properties.colors.primary.dark)) {
      errors.push({
        type: ValidationErrorType.INVALID_COLOR,
        field: 'properties.colors.primary',
        message: 'Primary color must be a valid hex color'
      });
    }

    if (!isValidColor(schema.properties.colors.secondary.light) || !isValidColor(schema.properties.colors.secondary.dark)) {
      errors.push({
        type: ValidationErrorType.INVALID_COLOR,
        field: 'properties.colors.secondary',
        message: 'Secondary color must be a valid hex color'
      });
    }

    // Validate typography
    if (schema.properties.typography.baseFontSize <= 0) {
      errors.push({
        type: ValidationErrorType.INVALID_FONT_SIZE,
        field: 'properties.typography.baseFontSize',
        message: 'Base font size must be greater than 0'
      });
    }

    if (schema.properties.typography.headingScaleFactor <= 0) {
      errors.push({
        type: ValidationErrorType.INVALID_SCALE_FACTOR,
        field: 'properties.typography.headingScaleFactor',
        message: 'Heading scale factor must be greater than 0'
      });
    }

    // Validate layout metrics
    if (schema.properties.layoutMetrics.spacing.xs < 0) {
      errors.push({
        type: ValidationErrorType.INVALID_SPACING,
        field: 'properties.layoutMetrics.spacing.xs',
        message: 'Spacing must be non-negative'
      });
    }

    // Validate shadows
    if (schema.properties.shadows.small.opacity < 0 || schema.properties.shadows.small.opacity > 1) {
      errors.push({
        type: ValidationErrorType.INVALID_SHADOW_OPACITY,
        field: 'properties.shadows.small.opacity',
        message: 'Shadow opacity must be between 0 and 1'
      });
    }

    return errors;
  }

  static isValid(schema: ThemeSchema): boolean {
    return this.validate(schema).length === 0;
  }
}

// MARK: - Serialization

export class SchemaSerialization {
  static encode(schema: ThemeSchema): string {
    return JSON.stringify(schema, null, 2);
  }

  static decode(json: string): ThemeSchema {
    try {
      const parsed = JSON.parse(json);
      return this.validateAndTransform(parsed);
    } catch (error) {
      throw new SchemaSerializationError('Failed to parse JSON', error as Error);
    }
  }

  static encodeToBase64(schema: ThemeSchema): string {
    const json = this.encode(schema);
    return Buffer.from(json, 'utf8').toString('base64');
  }

  static decodeFromBase64(base64: string): ThemeSchema {
    try {
      const json = Buffer.from(base64, 'base64').toString('utf8');
      return this.decode(json);
    } catch (error) {
      throw new SchemaSerializationError('Failed to decode base64', error as Error);
    }
  }

  private static validateAndTransform(data: any): ThemeSchema {
    // Basic validation and transformation
    if (!data || typeof data !== 'object') {
      throw new SchemaSerializationError('Invalid schema data structure');
    }

    // Ensure required fields exist
    const schema: ThemeSchema = {
      id: data.id || generateId(),
      metadata: data.metadata || createDefaultMetadata('Untitled Schema', 'Unknown'),
      properties: data.properties || createDefaultProperties()
    };

    return schema;
  }
}

export class SchemaSerializationError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'SchemaSerializationError';
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

export function getPlatformDescription(platform: Platform): string {
  switch (platform) {
    case Platform.IOS:
      return 'iPhone and iPad';
    case Platform.ANDROID:
      return 'Android devices';
    case Platform.WEB:
      return 'Web browsers';
    case Platform.DESKTOP:
      return 'Desktop computers';
    case Platform.TV:
      return 'Smart TVs';
    case Platform.WATCH:
      return 'Smart watches';
  }
}

// MARK: - Type Guards

export function isThemeSchema(obj: any): obj is ThemeSchema {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.metadata === 'object' &&
    typeof obj.properties === 'object'
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

export function isTypographyProperties(obj: any): obj is TypographyProperties {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.primaryFontName === 'string' &&
    typeof obj.bodyFontName === 'string' &&
    typeof obj.headingScaleFactor === 'number' &&
    typeof obj.baseFontSize === 'number'
  );
}
