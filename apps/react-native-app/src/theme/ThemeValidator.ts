/**
 * ThemeValidator.ts
 *
 * React Native wrapper for theme validation using @aether/core
 *
 * @author AI Assistant
 * @copyright 2025 Aether
 */

import * as React from 'react';
import { Alert } from 'react-native';
import {
  ThemeValidator as CoreThemeValidator,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ThemeSchema
} from '@aether/core';

// MARK: - Re-export types from core
export type { ValidationResult, ValidationError, ValidationWarning, ThemeSchema };

// MARK: - Theme Validator Class (wrapper around core)

export class ThemeValidator extends CoreThemeValidator {
  // Inherit all functionality from core ThemeValidator
  // Add any React Native specific functionality here if needed
}

// MARK: - Validation Hook (React Native specific)

export const useThemeValidation = () => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<ValidationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const validateTheme = React.useCallback(async (schema: ThemeSchema) => {
    try {
      setIsValidating(true);
      setError(null);

      const validator = new ThemeValidator();
      const result = await validator.validateTheme(schema);

      setLastResult(result);

      if (result.errors.length > 0) {
        Alert.alert(
          'Validation Errors',
          `Found ${result.errors.length} validation errors. Check the console for details.`
        );
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown validation error';
      setError(errorMessage);
      Alert.alert('Validation Error', errorMessage);
      throw err;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validateTheme,
    isValidating,
    lastResult,
    error
  };
};

// MARK: - Export

export default ThemeValidator;
