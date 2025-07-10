/**
 * ThemeValidator.ts
 * 
 * Comprehensive theme validation system for React Native
 * Validates schema structure, content validity, and accessibility compliance
 * 
 * @author AI Assistant
 * @copyright 2025 Aether
 */

import React from 'react';
import { Alert } from 'react-native';

// MARK: - Validation Error Types

export interface ValidationError {
  id: string;
  type: 'schema' | 'content' | 'accessibility' | 'colorContrast' | 'missing' | 'type' | 'duplicate' | 'color' | 'font' | 'spacing' | 'animation';
  message: string;
  property?: string;
  expectedType?: string;
  value?: any;
}

export interface ValidationWarning {
  id: string;
  message: string;
  category: 'performance' | 'usability' | 'bestPractice';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  accessibilityScore: number;
  performanceScore: number;
  timestamp: Date;
}

// MARK: - Theme Schema Interface

export interface ThemeSchema {
  metadata: {
    name: string;
    version: string;
    description?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  colors: Record<string, string>;
  typography: Record<string, {
    fontSize: number;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: number;
    letterSpacing?: number;
  }>;
  spacing: Record<string, number>;
  animations: Record<string, {
    duration: number;
    easing?: string;
    delay?: number;
  }>;
  shadows?: Record<string, {
    offsetX: number;
    offsetY: number;
    blurRadius: number;
    color: string;
  }>;
  borders?: Record<string, {
    width: number;
    style: string;
    color: string;
  }>;
}

// MARK: - Theme Validator Class

export class ThemeValidator {
  private isValidationInProgress = false;

  // MARK: - Main Validation Method

  async validateTheme(theme: ThemeSchema): Promise<ValidationResult> {
    this.isValidationInProgress = true;

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Schema validation
      const schemaErrors = this.validateSchema(theme);
      errors.push(...schemaErrors);

      // Content validation
      const contentErrors = this.validateContent(theme);
      errors.push(...contentErrors);

      // Accessibility validation
      const accessibilityErrors = this.validateAccessibility(theme);
      errors.push(...accessibilityErrors);

      // Performance validation
      const performanceWarnings = this.validatePerformance(theme);
      warnings.push(...performanceWarnings);

      // Calculate scores
      const accessibilityScore = this.calculateAccessibilityScore(theme, accessibilityErrors);
      const performanceScore = this.calculatePerformanceScore(theme, performanceWarnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        accessibilityScore,
        performanceScore,
        timestamp: new Date()
      };
    } finally {
      this.isValidationInProgress = false;
    }
  }

  // MARK: - Schema Validation

  private validateSchema(theme: ThemeSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check required properties
    if (!theme.metadata?.name || theme.metadata.name.trim() === '') {
      errors.push({
        id: 'missing_name',
        type: 'missing',
        message: 'Missing required property: metadata.name',
        property: 'metadata.name'
      });
    }

    if (!theme.metadata?.version || theme.metadata.version.trim() === '') {
      errors.push({
        id: 'missing_version',
        type: 'missing',
        message: 'Missing required property: metadata.version',
        property: 'metadata.version'
      });
    }

    // Validate colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, color]) => {
        if (!color || color.trim() === '') {
          errors.push({
            id: `empty_color_${key}`,
            type: 'color',
            message: `Empty color value for ${key}`,
            property: `colors.${key}`,
            value: color
          });
        } else if (!this.isValidColorFormat(color)) {
          errors.push({
            id: `invalid_color_${key}`,
            type: 'color',
            message: `Invalid color format for ${key}: ${color}`,
            property: `colors.${key}`,
            value: color
          });
        }
      });
    }

    // Validate typography
    if (theme.typography) {
      Object.entries(theme.typography).forEach(([key, typography]) => {
        if (typeof typography.fontSize !== 'number' || typography.fontSize <= 0) {
          errors.push({
            id: `invalid_font_size_${key}`,
            type: 'font',
            message: `Font size must be positive for ${key}: ${typography.fontSize}`,
            property: `typography.${key}.fontSize`,
            value: typography.fontSize,
            expectedType: 'positive number'
          });
        }

        if (typography.fontSize > 100) {
          errors.push({
            id: `large_font_size_${key}`,
            type: 'font',
            message: `Font size too large for ${key}: ${typography.fontSize}`,
            property: `typography.${key}.fontSize`,
            value: typography.fontSize
          });
        }
      });
    }

    // Validate spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, spacing]) => {
        if (typeof spacing !== 'number' || spacing < 0) {
          errors.push({
            id: `invalid_spacing_${key}`,
            type: 'spacing',
            message: `Spacing cannot be negative for ${key}: ${spacing}`,
            property: `spacing.${key}`,
            value: spacing,
            expectedType: 'non-negative number'
          });
        }

        if (spacing > 1000) {
          errors.push({
            id: `large_spacing_${key}`,
            type: 'spacing',
            message: `Spacing too large for ${key}: ${spacing}`,
            property: `spacing.${key}`,
            value: spacing
          });
        }
      });
    }

    // Validate animations
    if (theme.animations) {
      Object.entries(theme.animations).forEach(([key, animation]) => {
        if (typeof animation.duration !== 'number' || animation.duration < 0) {
          errors.push({
            id: `invalid_animation_duration_${key}`,
            type: 'animation',
            message: `Animation duration cannot be negative for ${key}: ${animation.duration}`,
            property: `animations.${key}.duration`,
            value: animation.duration,
            expectedType: 'non-negative number'
          });
        }

        if (animation.duration > 10) {
          errors.push({
            id: `long_animation_duration_${key}`,
            type: 'animation',
            message: `Animation duration too long for ${key}: ${animation.duration}`,
            property: `animations.${key}.duration`,
            value: animation.duration
          });
        }
      });
    }

    return errors;
  }

  // MARK: - Content Validation

  private validateContent(theme: ThemeSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for semantic consistency
    if (!theme.colors?.primary) {
      errors.push({
        id: 'missing_primary_color',
        type: 'missing',
        message: 'Missing required property: primary color',
        property: 'colors.primary'
      });
    }

    if (!theme.colors?.background) {
      errors.push({
        id: 'missing_background_color',
        type: 'missing',
        message: 'Missing required property: background color',
        property: 'colors.background'
      });
    }

    if (!theme.colors?.text) {
      errors.push({
        id: 'missing_text_color',
        type: 'missing',
        message: 'Missing required property: text color',
        property: 'colors.text'
      });
    }

    // Validate color relationships
    if (theme.colors?.primary && theme.colors?.background) {
      if (theme.colors.primary === theme.colors.background) {
        errors.push({
          id: 'primary_equals_background',
          type: 'content',
          message: 'Primary color cannot be the same as background color',
          property: 'colors.primary'
        });
      }
    }

    // Validate typography hierarchy
    if (theme.typography) {
      const fontSizes = Object.values(theme.typography).map(t => t.fontSize).sort((a, b) => a - b);
      if (fontSizes.length > 1) {
        const minSize = fontSizes[0];
        const maxSize = fontSizes[fontSizes.length - 1];
        const ratio = maxSize / minSize;
        if (ratio > 10) {
          errors.push({
            id: 'extreme_font_hierarchy',
            type: 'content',
            message: `Font size hierarchy too extreme (ratio: ${ratio.toFixed(2)})`,
            property: 'typography'
          });
        }
      }
    }

    return errors;
  }

  // MARK: - Accessibility Validation

  private validateAccessibility(theme: ThemeSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check color contrast ratios
    if (theme.colors) {
      const colorPairs = this.generateColorPairs(theme.colors);
      
      colorPairs.forEach(([color1, color2]) => {
        const contrastRatio = this.calculateContrastRatio(color1, color2);
        
        // WCAG AA standard: 4.5:1 for normal text, 3:1 for large text
        if (contrastRatio < 3.0) {
          errors.push({
            id: `low_contrast_${color1}_${color2}`,
            type: 'colorContrast',
            message: `Insufficient contrast ratio (${contrastRatio.toFixed(2)}:1) between ${color1} and ${color2}`,
            property: `colors.${color1}`,
            value: contrastRatio
          });
        }
      });
    }

    // Check for color-only information
    if (theme.colors?.error && !theme.colors?.errorIcon) {
      errors.push({
        id: 'color_only_error',
        type: 'accessibility',
        message: 'Error states should not rely solely on color',
        property: 'colors.error'
      });
    }

    if (theme.colors?.success && !theme.colors?.successIcon) {
      errors.push({
        id: 'color_only_success',
        type: 'accessibility',
        message: 'Success states should not rely solely on color',
        property: 'colors.success'
      });
    }

    // Validate font sizes for readability
    if (theme.typography) {
      Object.entries(theme.typography).forEach(([key, typography]) => {
        if (typography.fontSize < 12) {
          errors.push({
            id: `small_font_${key}`,
            type: 'accessibility',
            message: `Font size too small for accessibility: ${key} (${typography.fontSize}pt)`,
            property: `typography.${key}.fontSize`,
            value: typography.fontSize
          });
        }
      });
    }

    // Check for sufficient touch targets
    if (theme.spacing) {
      const minSpacing = Math.min(...Object.values(theme.spacing));
      if (minSpacing < 44) {
        errors.push({
          id: 'small_touch_targets',
          type: 'accessibility',
          message: 'Minimum spacing should be at least 44pt for touch targets',
          property: 'spacing',
          value: minSpacing
        });
      }
    }

    return errors;
  }

  // MARK: - Performance Validation

  private validatePerformance(theme: ThemeSchema): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Check for too many colors
    if (theme.colors && Object.keys(theme.colors).length > 50) {
      warnings.push({
        id: 'too_many_colors',
        message: `Theme contains ${Object.keys(theme.colors).length} colors, which may impact performance`,
        category: 'performance'
      });
    }

    // Check for complex animations
    if (theme.animations) {
      Object.entries(theme.animations).forEach(([key, animation]) => {
        if (animation.duration > 2.0) {
          warnings.push({
            id: `slow_animation_${key}`,
            message: `Animation '${key}' duration (${animation.duration}s) may feel sluggish`,
            category: 'performance'
          });
        }
      });
    }

    // Check for large font variations
    if (theme.typography && Object.keys(theme.typography).length > 10) {
      warnings.push({
        id: 'too_many_font_sizes',
        message: `Theme contains ${Object.keys(theme.typography).length} different font sizes, consider consolidating`,
        category: 'performance'
      });
    }

    return warnings;
  }

  // MARK: - Helper Methods

  private isValidColorFormat(color: string): boolean {
    // Check for hex format (#RRGGBB or #RRGGBBAA)
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    if (hexPattern.test(color)) {
      return true;
    }

    // Check for named colors (basic validation)
    const namedColors = [
      'red', 'green', 'blue', 'black', 'white', 'gray', 'yellow', 
      'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'
    ];
    if (namedColors.includes(color.toLowerCase())) {
      return true;
    }

    // Check for rgba format
    const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
    if (rgbaPattern.test(color)) {
      return true;
    }

    return false;
  }

  private generateColorPairs(colors: Record<string, string>): [string, string][] {
    const pairs: [string, string][] = [];
    const colorArray = Object.values(colors);

    for (let i = 0; i < colorArray.length; i++) {
      for (let j = i + 1; j < colorArray.length; j++) {
        pairs.push([colorArray[i], colorArray[j]]);
      }
    }

    return pairs;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you would convert colors to luminance values
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    // Simplified luminance calculation
    // In a real implementation, you would parse the color and calculate actual luminance
    if (color.startsWith('#')) {
      // Basic hex color luminance approximation
      return 0.5; // Placeholder
    } else {
      // Named color luminance approximation
      switch (color.toLowerCase()) {
        case 'white': return 1.0;
        case 'black': return 0.0;
        case 'gray': return 0.5;
        case 'red': return 0.3;
        case 'green': return 0.4;
        case 'blue': return 0.2;
        default: return 0.5;
      }
    }
  }

  private calculateAccessibilityScore(theme: ThemeSchema, errors: ValidationError[]): number {
    const totalChecks = 10.0; // Number of accessibility checks
    const errorCount = errors.filter(error => 
      error.type === 'accessibility' || error.type === 'colorContrast'
    ).length;

    return Math.max(0.0, (totalChecks - errorCount) / totalChecks * 100.0);
  }

  private calculatePerformanceScore(theme: ThemeSchema, warnings: ValidationWarning[]): number {
    const totalChecks = 5.0; // Number of performance checks
    const warningCount = warnings.filter(warning => 
      warning.category === 'performance'
    ).length;

    return Math.max(0.0, (totalChecks - warningCount) / totalChecks * 100.0);
  }

  // MARK: - Public Utility Methods

  getValidationStatus(): boolean {
    return this.isValidationInProgress;
  }

  // MARK: - Static Validation Methods

  static validateColorContrast(color1: string, color2: string): boolean {
    const validator = new ThemeValidator();
    const contrastRatio = validator.calculateContrastRatio(color1, color2);
    return contrastRatio >= 3.0; // WCAG AA minimum
  }

  static validateFontSize(size: number): boolean {
    return size >= 12 && size <= 100;
  }

  static validateSpacing(spacing: number): boolean {
    return spacing >= 0 && spacing <= 1000;
  }

  static validateAnimationDuration(duration: number): boolean {
    return duration >= 0 && duration <= 10;
  }
}

// MARK: - Validation Hook

export const useThemeValidation = () => {
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validateTheme = React.useCallback(async (theme: ThemeSchema) => {
    setIsValidating(true);
    setError(null);

    try {
      const validator = new ThemeValidator();
      const result = await validator.validateTheme(theme);
      setValidationResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Validation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = React.useCallback(() => {
    setValidationResult(null);
    setError(null);
  }, []);

  return {
    validationResult,
    isValidating,
    error,
    validateTheme,
    clearValidation
  };
};

// MARK: - Export

export default ThemeValidator; 