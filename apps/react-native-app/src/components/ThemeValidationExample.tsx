/**
 * ThemeValidationExample.tsx
 *
 * Comprehensive theme validation example component
 * Demonstrates schema validation, accessibility checks, and performance analysis
 *
 * @author AI Assistant
 * @copyright 2025 Aether
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import ThemeValidator, {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ThemeSchema
} from '../theme/ThemeValidator';



// MARK: - Sample Themes for Testing

const sampleThemes: Record<string, ThemeSchema> = {
  valid: {
    metadata: {
      name: 'Valid Theme',
      version: '1.0.0',
      description: 'A properly structured theme with good accessibility',
      author: 'Design Team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      border: '#C6C6C8'
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'semibold' },
      h3: { fontSize: 20, fontWeight: 'medium' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 14, fontWeight: 'normal' },
      small: { fontSize: 12, fontWeight: 'normal' }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    animations: {
      fast: { duration: 0.2, easing: 'ease-out' },
      normal: { duration: 0.3, easing: 'ease-in-out' },
      slow: { duration: 0.5, easing: 'ease-in-out' }
    }
  },

  invalid: {
    metadata: {
      name: '',
      version: '',
      description: 'A theme with multiple validation issues'
    },
    colors: {
      primary: '#007AFF',
      background: '#007AFF', // Same as primary - accessibility issue
      text: '#000000',
      error: '#FF0000',
      success: '#00FF00'
    },
    typography: {
      h1: { fontSize: 8 }, // Too small
      h2: { fontSize: 200 }, // Too large
      body: { fontSize: 16 }
    },
    spacing: {
      xs: -5, // Negative value
      sm: 2000, // Too large
      md: 16
    },
    animations: {
      slow: { duration: 15 } // Too long
    }
  },

  performance: {
    metadata: {
      name: 'Performance Heavy Theme',
      version: '1.0.0'
    },
    colors: {
      // Too many colors - simplified generation
      color1: '#FF0000', color2: '#00FF00', color3: '#0000FF', color4: '#FFFF00',
      color5: '#FF00FF', color6: '#00FFFF', color7: '#FF8000', color8: '#8000FF',
      color9: '#0080FF', color10: '#FF0080', color11: '#80FF00', color12: '#008080',
      color13: '#800080', color14: '#808000', color15: '#FF8080', color16: '#80FF80',
      color17: '#8080FF', color18: '#FFFF80', color19: '#FF80FF', color20: '#80FFFF',
      color21: '#FF4000', color22: '#4000FF', color23: '#0040FF', color24: '#FF0040',
      color25: '#40FF00', color26: '#004040', color27: '#400040', color28: '#404000',
      color29: '#FF4040', color30: '#40FF40', color31: '#4040FF', color32: '#FFFF40',
      color33: '#FF40FF', color34: '#40FFFF', color35: '#FF2000', color36: '#2000FF',
      color37: '#0020FF', color38: '#FF0020', color39: '#20FF00', color40: '#002020',
      color41: '#200020', color42: '#202000', color43: '#FF2020', color44: '#20FF20',
      color45: '#2020FF', color46: '#FFFF20', color47: '#FF20FF', color48: '#20FFFF',
      color49: '#FF1000', color50: '#1000FF', color51: '#0010FF', color52: '#FF0010',
      color53: '#10FF00', color54: '#001010', color55: '#100010', color56: '#101000',
      color57: '#FF1010', color58: '#10FF10', color59: '#1010FF', color60: '#FFFF10'
    },
    typography: {
      // Too many font sizes - simplified generation
      font1: { fontSize: 12 }, font2: { fontSize: 14 }, font3: { fontSize: 16 },
      font4: { fontSize: 18 }, font5: { fontSize: 20 }, font6: { fontSize: 22 },
      font7: { fontSize: 24 }, font8: { fontSize: 26 }, font9: { fontSize: 28 },
      font10: { fontSize: 30 }, font11: { fontSize: 32 }, font12: { fontSize: 34 },
      font13: { fontSize: 36 }, font14: { fontSize: 38 }, font15: { fontSize: 40 }
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16
    },
    animations: {
      verySlow: { duration: 3.0 }
    }
  }
};

// MARK: - Main Component

const ThemeValidationExample: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('valid');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // MARK: - Validation Handler

  const handleValidation = async () => {
    setIsValidating(true);

    try {
      const validator = new ThemeValidator();
      const theme = sampleThemes[selectedTheme];
      const result = await validator.validateTheme(theme);
      setValidationResult(result);

      // Show alert with summary
      const status = result.isValid ? '✅ Valid' : '❌ Invalid';
      const errorCount = result.errors.length;
      const warningCount = result.warnings.length;

      Alert.alert(
        'Validation Complete',
        `${status}\n\nErrors: ${errorCount}\nWarnings: ${warningCount}\nAccessibility Score: ${result.accessibilityScore.toFixed(1)}%\nPerformance Score: ${result.performanceScore.toFixed(1)}%`
      );
    } catch (error) {
      Alert.alert('Validation Error', 'Failed to validate theme');
    } finally {
      setIsValidating(false);
    }
  };

  // MARK: - Render Methods

  const renderScoreCard = (title: string, score: number, color: string) => (
    <View style={[styles.scoreCard, { borderColor: color }]}>
      <Text style={[styles.scoreTitle, { color }]}>{title}</Text>
      <View style={styles.scoreCircle}>
        <Text style={[styles.scoreValue, { color }]}>{score.toFixed(0)}</Text>
      </View>
      <Text style={styles.scoreLabel}>%</Text>
    </View>
  );

  const renderErrorItem = (error: ValidationError) => (
    <View key={error.id} style={styles.errorItem}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorIconText}>✕</Text>
      </View>
      <View style={styles.errorContent}>
        <Text style={styles.errorMessage}>{error.message}</Text>
        {error.property && (
          <Text style={styles.errorProperty}>Property: {error.property}</Text>
        )}
      </View>
    </View>
  );

  const renderWarningItem = (warning: ValidationWarning) => (
    <View key={warning.id} style={styles.warningItem}>
      <View style={styles.warningIcon}>
        <Text style={styles.warningIconText}>⚠</Text>
      </View>
      <View style={styles.warningContent}>
        <Text style={styles.warningMessage}>{warning.message}</Text>
        <Text style={styles.warningCategory}>{warning.category}</Text>
      </View>
    </View>
  );

  const renderValidationResult = () => {
    if (!validationResult) return null;

    return (
      <ScrollView style={styles.resultContainer}>
        {/* Overall Status */}
        <View style={[
          styles.statusCard,
          { backgroundColor: validationResult.isValid ? '#E8F5E8' : '#FFEBEE' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: validationResult.isValid ? '#2E7D32' : '#C62828' }
          ]}>
            {validationResult.isValid ? '✅ Theme is Valid' : '❌ Theme has Issues'}
          </Text>
        </View>

        {/* Scores */}
        <View style={styles.scoresContainer}>
          {renderScoreCard('Accessibility', validationResult.accessibilityScore, '#2196F3')}
          {renderScoreCard('Performance', validationResult.performanceScore, '#FF9800')}
        </View>

        {/* Errors */}
        {validationResult.errors.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Errors ({validationResult.errors.length})</Text>
            </View>
            {validationResult.errors.map(renderErrorItem)}
          </View>
        )}

        {/* Warnings */}
        {validationResult.warnings.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Warnings ({validationResult.warnings.length})</Text>
            </View>
            {validationResult.warnings.map(renderWarningItem)}
          </View>
        )}

        {/* Validation Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Validated at: {validationResult.timestamp.toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    );
  };

  // MARK: - Main Render

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Validation</Text>
      <Text style={styles.subtitle}>
        Validate theme structure, accessibility, and performance
      </Text>

      {/* Theme Selection */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Theme to Validate:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              selectedTheme === 'valid' && styles.themeButtonActive
            ]}
            onPress={() => setSelectedTheme('valid')}
          >
            <Text style={[
              styles.themeButtonText,
              selectedTheme === 'valid' && styles.themeButtonTextActive
            ]}>
              Valid Theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              selectedTheme === 'invalid' && styles.themeButtonActive
            ]}
            onPress={() => setSelectedTheme('invalid')}
          >
            <Text style={[
              styles.themeButtonText,
              selectedTheme === 'invalid' && styles.themeButtonTextActive
            ]}>
              Invalid Theme
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeButton,
              selectedTheme === 'performance' && styles.themeButtonActive
            ]}
            onPress={() => setSelectedTheme('performance')}
          >
            <Text style={[
              styles.themeButtonText,
              selectedTheme === 'performance' && styles.themeButtonTextActive
            ]}>
              Performance Heavy
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Validation Button */}
      <TouchableOpacity
        style={[styles.validateButton, isValidating && styles.validateButtonDisabled]}
        onPress={handleValidation}
        disabled={isValidating}
      >
        {isValidating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.validateButtonText}>Validate Theme</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {renderValidationResult()}
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },

  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    padding: 16
  },

  errorContent: {
    flex: 1
  },

  errorIcon: {
    alignItems: 'center',
    backgroundColor: '#F44336',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24
  },

  errorIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },

  errorItem: {
    borderBottomColor: '#FFEBEE',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 12
  },

  errorMessage: {
    color: '#1A1A1A',
    fontSize: 14,
    marginBottom: 4
  },

  errorProperty: {
    color: '#666666',
    fontFamily: 'monospace',
    fontSize: 12
  },

  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    padding: 12
  },

  infoText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center'
  },

  pickerContainer: {
    marginBottom: 24
  },

  pickerLabel: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },

  resultContainer: {
    flex: 1
  },

  scoreCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
    marginHorizontal: 4,
    padding: 16
  },

  scoreCircle: {
    alignItems: 'center',
    borderColor: 'currentColor',
    borderRadius: 30,
    borderWidth: 3,
    height: 60,
    justifyContent: 'center',
    marginBottom: 4,
    width: 60
  },

  scoreLabel: {
    color: '#666666',
    fontSize: 12
  },

  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },

  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },

  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },

  sectionHeader: {
    backgroundColor: '#F5F5F5',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    padding: 12
  },

  sectionTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600'
  },

  statusCard: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16
  },

  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 24
  },

  themeButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  themeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },

  themeButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500'
  },

  themeButtonTextActive: {
    color: '#FFFFFF'
  },

  title: {
    color: '#1A1A1A',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },

  validateButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingVertical: 16
  },

  validateButtonDisabled: {
    backgroundColor: '#B0B0B0'
  },

  validateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },

  warningCategory: {
    color: '#666666',
    fontSize: 12,
    textTransform: 'uppercase'
  },

  warningContent: {
    flex: 1
  },

  warningIcon: {
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24
  },

  warningIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },

  warningItem: {
    borderBottomColor: '#FFF3E0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 12
  },

  warningMessage: {
    color: '#1A1A1A',
    fontSize: 14,
    marginBottom: 4
  }
});

export default ThemeValidationExample;
