/**
 * AccessibilityValidationExample.tsx
 *
 * Comprehensive WCAG AA accessibility validation example
 * Demonstrates automated contrast checking, color blindness simulation, and compliance reporting
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
  ActivityIndicator
} from 'react-native';
import AccessibilityValidator, {
  AccessibilityValidationResult,
  ContrastTest,
  WCAGLevel,
  ColorBlindnessType,
  ColorUtilities
} from '../theme/AccessibilityValidator';
import { ThemeSchema, ThemeCategory } from '../theme/ThemeSchema';



// MARK: - Sample Themes for Testing

const sampleThemes: Record<string, ThemeSchema> = {
  wcagCompliant: {
    id: 'wcag-compliant',
    metadata: {
      name: 'WCAG AA Compliant Theme',
      version: '1.0.0',
      description: 'A theme that meets WCAG AA accessibility standards',
      author: 'Accessibility Team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['accessibility', 'wcag', 'high-contrast'],
      category: ThemeCategory.GENERAL,
      platform: ['iOS', 'Android', 'Web'] as any
    },
    properties: {
      colors: {
        primary: { light: '#2563EB', dark: '#3B82F6' },
        secondary: { light: '#7C3AED', dark: '#8B5CF6' },
        tertiary: { light: '#059669', dark: '#10B981' },
        background: {
          primary: { light: '#FFFFFF', dark: '#1F2937' },
          secondary: { light: '#F8FAFC', dark: '#374151' },
          tertiary: { light: '#F1F5F9', dark: '#4B5563' }
        },
        surface: {
          primary: { light: '#FFFFFF', dark: '#1F2937' },
          secondary: { light: '#F8FAFC', dark: '#374151' },
          tertiary: { light: '#F1F5F9', dark: '#4B5563' },
          elevated: { light: '#FFFFFF', dark: '#111827' }
        },
        text: {
          primary: { light: '#1E293B', dark: '#F9FAFB' },
          secondary: { light: '#475569', dark: '#D1D5DB' },
          tertiary: { light: '#64748B', dark: '#9CA3AF' },
          quaternary: { light: '#94A3B8', dark: '#6B7280' },
          inverse: { light: '#FFFFFF', dark: '#000000' }
        },
        semantic: {
          success: { light: '#059669', dark: '#10B981' },
          warning: { light: '#D97706', dark: '#F59E0B' },
          error: { light: '#DC2626', dark: '#EF4444' },
          info: { light: '#2563EB', dark: '#3B82F6' },
          destructive: { light: '#DC2626', dark: '#EF4444' }
        },
        custom: {}
      },
      typography: {
        primaryFontName: 'System',
        bodyFontName: 'System',
        monospaceFontName: 'SF Mono',
        headingScaleFactor: 1.25,
        baseFontSize: 16,
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
          normal: 0,
          wide: 0.5
        },
        textStyles: {
          heading: {
            h1: { size: 32, weight: '700', lineHeight: 1.2 },
            h2: { size: 24, weight: '600', lineHeight: 1.3 },
            h3: { size: 20, weight: '600', lineHeight: 1.4 },
            h4: { size: 18, weight: '600', lineHeight: 1.4 },
            h5: { size: 16, weight: '600', lineHeight: 1.5 },
            h6: { size: 14, weight: '600', lineHeight: 1.5 }
          },
          body: {
            large: { size: 18, weight: '400', lineHeight: 1.6 },
            medium: { size: 16, weight: '400', lineHeight: 1.6 },
            small: { size: 14, weight: '400', lineHeight: 1.5 }
          },
          caption: {
            large: { size: 14, weight: '400', lineHeight: 1.4 },
            medium: { size: 12, weight: '400', lineHeight: 1.4 },
            small: { size: 10, weight: '400', lineHeight: 1.3 }
          },
          button: {
            large: { size: 16, weight: '600', lineHeight: 1.4 },
            medium: { size: 14, weight: '600', lineHeight: 1.4 },
            small: { size: 12, weight: '600', lineHeight: 1.3 }
          }
        }
      },
      iconography: {
        family: 'SF Symbols',
        sizes: {
          small: 16,
          medium: 24,
          large: 32,
          xlarge: 48
        },
        weights: {
          light: 'light',
          regular: 'regular',
          medium: 'medium',
          semibold: 'semibold',
          bold: 'bold'
        },
        colors: {
          primary: { light: '#1E293B', dark: '#F9FAFB' },
          secondary: { light: '#475569', dark: '#D1D5DB' },
          tertiary: { light: '#64748B', dark: '#9CA3AF' },
          disabled: { light: '#9CA3AF', dark: '#6B7280' }
        },
        custom: {}
      },
      layoutMetrics: {
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
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        margins: {
          xs: 4,
          sm: 8,
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
          full: 9999
        },
        grid: {
          columns: 12,
          gutter: 16,
          margin: 16
        },
        breakpoints: {
          mobile: 320,
          tablet: 768,
          desktop: 1024,
          wide: 1440
        }
      },
      shadows: {
        small: {
          radius: 2,
          offset: { x: 0, y: 1 },
          opacity: 0.1,
          color: { light: '#000000', dark: '#000000' }
        },
        medium: {
          radius: 4,
          offset: { x: 0, y: 2 },
          opacity: 0.15,
          color: { light: '#000000', dark: '#000000' }
        },
        large: {
          radius: 8,
          offset: { x: 0, y: 4 },
          opacity: 0.2,
          color: { light: '#000000', dark: '#000000' }
        },
        xlarge: {
          radius: 16,
          offset: { x: 0, y: 8 },
          opacity: 0.25,
          color: { light: '#000000', dark: '#000000' }
        },
        custom: {}
      },
      animations: {
        duration: {
          fast: 0.2,
          normal: 0.3,
          slow: 0.5
        },
        easing: {
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
          linear: 'linear'
        },
        spring: {
          response: 0.5,
          dampingFraction: 0.7,
          blendDuration: 0.1
        },
        custom: {}
      },
      accessibility: {
        highContrast: true,
        reducedMotion: false,
        increasedContrast: true,
        darkMode: true,
        dynamicType: true,
        voiceOver: {
          enabled: true,
          speakScreen: true,
          speakSelection: true,
          largeCursor: false
        },
        switchControl: {
          enabled: true,
          autoScanning: true,
          groupItems: true
        }
      },
      custom: {}
    }
  },

  wcagNonCompliant: {
    id: 'wcag-non-compliant',
    metadata: {
      name: 'WCAG Non-Compliant Theme',
      version: '1.0.0',
      description: 'A theme with multiple accessibility issues',
      author: 'Accessibility Team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['accessibility', 'wcag', 'low-contrast'],
      category: ThemeCategory.GENERAL,
      platform: ['iOS', 'Android', 'Web'] as any
    },
    properties: {
      colors: {
        primary: { light: '#E5E7EB', dark: '#E5E7EB' },
        secondary: { light: '#F3F4F6', dark: '#F3F4F6' },
        tertiary: { light: '#D1D5DB', dark: '#D1D5DB' },
        background: {
          primary: { light: '#FFFFFF', dark: '#FFFFFF' },
          secondary: { light: '#F9FAFB', dark: '#F9FAFB' },
          tertiary: { light: '#F3F4F6', dark: '#F3F4F6' }
        },
        surface: {
          primary: { light: '#FFFFFF', dark: '#FFFFFF' },
          secondary: { light: '#F9FAFB', dark: '#F9FAFB' },
          tertiary: { light: '#F3F4F6', dark: '#F3F4F6' },
          elevated: { light: '#FFFFFF', dark: '#FFFFFF' }
        },
        text: {
          primary: { light: '#9CA3AF', dark: '#9CA3AF' },
          secondary: { light: '#D1D5DB', dark: '#D1D5DB' },
          tertiary: { light: '#E5E7EB', dark: '#E5E7EB' },
          quaternary: { light: '#F3F4F6', dark: '#F3F4F6' },
          inverse: { light: '#000000', dark: '#000000' }
        },
        semantic: {
          success: { light: '#D1FAE5', dark: '#D1FAE5' },
          warning: { light: '#FEF3C7', dark: '#FEF3C7' },
          error: { light: '#FEE2E2', dark: '#FEE2E2' },
          info: { light: '#E5E7EB', dark: '#E5E7EB' },
          destructive: { light: '#FEE2E2', dark: '#FEE2E2' }
        },
        custom: {}
      },
      typography: {
        primaryFontName: 'System',
        bodyFontName: 'System',
        monospaceFontName: 'SF Mono',
        headingScaleFactor: 1.25,
        baseFontSize: 16,
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
          normal: 0,
          wide: 0.5
        },
        textStyles: {
          heading: {
            h1: { size: 32, weight: '700', lineHeight: 1.2 },
            h2: { size: 24, weight: '600', lineHeight: 1.3 },
            h3: { size: 20, weight: '600', lineHeight: 1.4 },
            h4: { size: 18, weight: '600', lineHeight: 1.4 },
            h5: { size: 16, weight: '600', lineHeight: 1.5 },
            h6: { size: 14, weight: '600', lineHeight: 1.5 }
          },
          body: {
            large: { size: 18, weight: '400', lineHeight: 1.6 },
            medium: { size: 16, weight: '400', lineHeight: 1.6 },
            small: { size: 14, weight: '400', lineHeight: 1.5 }
          },
          caption: {
            large: { size: 14, weight: '400', lineHeight: 1.4 },
            medium: { size: 12, weight: '400', lineHeight: 1.4 },
            small: { size: 10, weight: '400', lineHeight: 1.3 }
          },
          button: {
            large: { size: 16, weight: '600', lineHeight: 1.4 },
            medium: { size: 14, weight: '600', lineHeight: 1.4 },
            small: { size: 12, weight: '600', lineHeight: 1.3 }
          }
        }
      },
      iconography: {
        family: 'SF Symbols',
        sizes: {
          small: 16,
          medium: 24,
          large: 32,
          xlarge: 48
        },
        weights: {
          light: 'light',
          regular: 'regular',
          medium: 'medium',
          semibold: 'semibold',
          bold: 'bold'
        },
        colors: {
          primary: { light: '#9CA3AF', dark: '#9CA3AF' },
          secondary: { light: '#D1D5DB', dark: '#D1D5DB' },
          tertiary: { light: '#E5E7EB', dark: '#E5E7EB' },
          disabled: { light: '#F3F4F6', dark: '#F3F4F6' }
        },
        custom: {}
      },
      layoutMetrics: {
        spacing: {
          xs: 2,
          sm: 4,
          md: 16,
          lg: 24,
          xl: 32,
          xxl: 48,
          xxxl: 64
        },
        padding: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        margins: {
          xs: 4,
          sm: 8,
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
          full: 9999
        },
        grid: {
          columns: 12,
          gutter: 16,
          margin: 16
        },
        breakpoints: {
          mobile: 320,
          tablet: 768,
          desktop: 1024,
          wide: 1440
        }
      },
      shadows: {
        small: {
          radius: 2,
          offset: { x: 0, y: 1 },
          opacity: 0.1,
          color: { light: '#000000', dark: '#000000' }
        },
        medium: {
          radius: 4,
          offset: { x: 0, y: 2 },
          opacity: 0.15,
          color: { light: '#000000', dark: '#000000' }
        },
        large: {
          radius: 8,
          offset: { x: 0, y: 4 },
          opacity: 0.2,
          color: { light: '#000000', dark: '#000000' }
        },
        xlarge: {
          radius: 16,
          offset: { x: 0, y: 8 },
          opacity: 0.25,
          color: { light: '#000000', dark: '#000000' }
        },
        custom: {}
      },
      animations: {
        duration: {
          fast: 0.2,
          normal: 0.3,
          slow: 3.0
        },
        easing: {
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
          linear: 'linear'
        },
        spring: {
          response: 0.5,
          dampingFraction: 0.7,
          blendDuration: 0.1
        },
        custom: {}
      },
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        increasedContrast: false,
        darkMode: true,
        dynamicType: true,
        voiceOver: {
          enabled: true,
          speakScreen: true,
          speakSelection: true,
          largeCursor: false
        },
        switchControl: {
          enabled: true,
          autoScanning: true,
          groupItems: true
        }
      },
      custom: {}
    }
  },

  colorBlindnessIssues: {
    id: 'color-blindness-issues',
    metadata: {
      name: 'Color Blindness Issues Theme',
      version: '1.0.0',
      description: 'A theme with colors that may be indistinguishable for color blind users',
      author: 'Accessibility Team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['accessibility', 'color-blindness', 'simulation'],
      category: ThemeCategory.GENERAL,
      platform: ['iOS', 'Android', 'Web'] as any
    },
    properties: {
      colors: {
        primary: { light: '#FF0000', dark: '#FF0000' },
        secondary: { light: '#00FF00', dark: '#00FF00' },
        tertiary: { light: '#0000FF', dark: '#0000FF' },
        background: {
          primary: { light: '#FFFFFF', dark: '#FFFFFF' },
          secondary: { light: '#F8FAFC', dark: '#F8FAFC' },
          tertiary: { light: '#F1F5F9', dark: '#F1F5F9' }
        },
        surface: {
          primary: { light: '#FFFFFF', dark: '#FFFFFF' },
          secondary: { light: '#F8FAFC', dark: '#F8FAFC' },
          tertiary: { light: '#F1F5F9', dark: '#F1F5F9' },
          elevated: { light: '#FFFFFF', dark: '#FFFFFF' }
        },
        text: {
          primary: { light: '#000000', dark: '#000000' },
          secondary: { light: '#475569', dark: '#475569' },
          tertiary: { light: '#64748B', dark: '#64748B' },
          quaternary: { light: '#94A3B8', dark: '#94A3B8' },
          inverse: { light: '#FFFFFF', dark: '#FFFFFF' }
        },
        semantic: {
          success: { light: '#51CF66', dark: '#51CF66' },
          warning: { light: '#FFD93D', dark: '#FFD93D' },
          error: { light: '#FF6B6B', dark: '#FF6B6B' },
          info: { light: '#2563EB', dark: '#2563EB' },
          destructive: { light: '#FF6B6B', dark: '#FF6B6B' }
        },
        custom: {}
      },
      typography: {
        primaryFontName: 'System',
        bodyFontName: 'System',
        monospaceFontName: 'SF Mono',
        headingScaleFactor: 1.25,
        baseFontSize: 16,
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
          normal: 0,
          wide: 0.5
        },
        textStyles: {
          heading: {
            h1: { size: 32, weight: '700', lineHeight: 1.2 },
            h2: { size: 24, weight: '600', lineHeight: 1.3 },
            h3: { size: 20, weight: '600', lineHeight: 1.4 },
            h4: { size: 18, weight: '600', lineHeight: 1.4 },
            h5: { size: 16, weight: '600', lineHeight: 1.5 },
            h6: { size: 14, weight: '600', lineHeight: 1.5 }
          },
          body: {
            large: { size: 18, weight: '400', lineHeight: 1.6 },
            medium: { size: 16, weight: '400', lineHeight: 1.6 },
            small: { size: 14, weight: '400', lineHeight: 1.5 }
          },
          caption: {
            large: { size: 14, weight: '400', lineHeight: 1.4 },
            medium: { size: 12, weight: '400', lineHeight: 1.4 },
            small: { size: 10, weight: '400', lineHeight: 1.3 }
          },
          button: {
            large: { size: 16, weight: '600', lineHeight: 1.4 },
            medium: { size: 14, weight: '600', lineHeight: 1.4 },
            small: { size: 12, weight: '600', lineHeight: 1.3 }
          }
        }
      },
      iconography: {
        family: 'SF Symbols',
        sizes: {
          small: 16,
          medium: 24,
          large: 32,
          xlarge: 48
        },
        weights: {
          light: 'light',
          regular: 'regular',
          medium: 'medium',
          semibold: 'semibold',
          bold: 'bold'
        },
        colors: {
          primary: { light: '#000000', dark: '#000000' },
          secondary: { light: '#475569', dark: '#475569' },
          tertiary: { light: '#64748B', dark: '#64748B' },
          disabled: { light: '#9CA3AF', dark: '#9CA3AF' }
        },
        custom: {}
      },
      layoutMetrics: {
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
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        margins: {
          xs: 4,
          sm: 8,
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
          full: 9999
        },
        grid: {
          columns: 12,
          gutter: 16,
          margin: 16
        },
        breakpoints: {
          mobile: 320,
          tablet: 768,
          desktop: 1024,
          wide: 1440
        }
      },
      shadows: {
        small: {
          radius: 2,
          offset: { x: 0, y: 1 },
          opacity: 0.1,
          color: { light: '#000000', dark: '#000000' }
        },
        medium: {
          radius: 4,
          offset: { x: 0, y: 2 },
          opacity: 0.15,
          color: { light: '#000000', dark: '#000000' }
        },
        large: {
          radius: 8,
          offset: { x: 0, y: 4 },
          opacity: 0.2,
          color: { light: '#000000', dark: '#000000' }
        },
        xlarge: {
          radius: 16,
          offset: { x: 0, y: 8 },
          opacity: 0.25,
          color: { light: '#000000', dark: '#000000' }
        },
        custom: {}
      },
      animations: {
        duration: {
          fast: 0.2,
          normal: 0.3,
          slow: 0.5
        },
        easing: {
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
          linear: 'linear'
        },
        spring: {
          response: 0.5,
          dampingFraction: 0.7,
          blendDuration: 0.1
        },
        custom: {}
      },
      accessibility: {
        highContrast: true,
        reducedMotion: false,
        increasedContrast: true,
        darkMode: true,
        dynamicType: true,
        voiceOver: {
          enabled: true,
          speakScreen: true,
          speakSelection: true,
          largeCursor: false
        },
        switchControl: {
          enabled: true,
          autoScanning: true,
          groupItems: true
        }
      },
      custom: {}
    }
  }
};

// MARK: - Main Component

const AccessibilityValidationExample: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('wcagCompliant');
  const [selectedWCAGLevel, setSelectedWCAGLevel] = useState<WCAGLevel>(WCAGLevel.AA);
  const [validationResult, setValidationResult] = useState<AccessibilityValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showColorBlindnessSimulation, setShowColorBlindnessSimulation] = useState(false);

  // MARK: - Validation Handler

  const handleValidation = async () => {
    setIsValidating(true);

    try {
      const validator = new AccessibilityValidator(selectedWCAGLevel);
      const theme = sampleThemes[selectedTheme];
      const result = await validator.validateAccessibility(theme);
      setValidationResult(result);

      // Show alert with summary
      const status = result.isValid ? '✅ WCAG Compliant' : '❌ Non-Compliant';
      const errorCount = result.errors.length;
      const passedTests = result.passedTests;
      const totalTests = result.totalTests;

      Alert.alert(
        'WCAG Validation Complete',
        `${status}\n\nWCAG Level: ${result.wcagLevel}\nContrast Tests: ${passedTests}/${totalTests} Passed\nAccessibility Score: ${result.accessibilityScore.toFixed(1)}%\nErrors: ${errorCount}`
      );
    } catch (error) {
      Alert.alert('Validation Error', 'Failed to validate accessibility');
    } finally {
      setIsValidating(false);
    }
  };

  // MARK: - Color Blindness Simulation

  const renderColorBlindnessSimulation = () => {
    if (!validationResult || !showColorBlindnessSimulation) return null;

    const theme = sampleThemes[selectedTheme];
    const colorPairs = generateColorPairs(theme.properties.colors);

    return (
      <View style={styles.simulationContainer}>
        <Text style={styles.simulationTitle}>Color Blindness Simulation</Text>
        <Text style={styles.simulationSubtitle}>
          How colors appear to users with different types of color blindness
        </Text>

        {Object.values(ColorBlindnessType).map(blindnessType => (
          <View key={blindnessType} style={styles.simulationSection}>
            <Text style={styles.blindnessType}>{blindnessType}</Text>
            <Text style={styles.blindnessDescription}>
              {getBlindnessDescription(blindnessType)}
            </Text>

            <View style={styles.colorPairsContainer}>
              {colorPairs.slice(0, 3).map(([color1, _color2], index) => {
                const simulated1 = ColorUtilities.simulateColorBlindness(color1, blindnessType);

                return (
                  <View key={index} style={styles.colorPairRow}>
                    <View style={styles.colorPair}>
                      <View style={[styles.colorSwatch, { backgroundColor: color1 }]} />
                      <Text style={styles.colorLabel}>Original</Text>
                    </View>
                    <Text style={styles.arrow}>→</Text>
                    <View style={styles.colorPair}>
                      <View style={[styles.colorSwatch, { backgroundColor: simulated1 || color1 }]} />
                      <Text style={styles.colorLabel}>Simulated</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  // MARK: - Render Methods

  const renderWCAGLevelSelector = () => (
    <View style={styles.levelSelector}>
      <Text style={styles.levelTitle}>WCAG Compliance Level:</Text>
      <View style={styles.levelButtons}>
        {Object.values(WCAGLevel).map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelButton,
              selectedWCAGLevel === level && styles.levelButtonActive
            ]}
            onPress={() => setSelectedWCAGLevel(level)}
          >
            <Text style={[
              styles.levelButtonText,
              selectedWCAGLevel === level && styles.levelButtonTextActive
            ]}>
              WCAG {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderThemeSelector = () => (
    <View style={styles.themeSelector}>
      <Text style={styles.themeTitle}>Select Theme to Validate:</Text>
      <View style={styles.themeButtons}>
        {Object.entries(sampleThemes).map(([key, theme]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.themeButton,
              selectedTheme === key && styles.themeButtonActive
            ]}
            onPress={() => setSelectedTheme(key)}
          >
            <Text style={[
              styles.themeButtonText,
              selectedTheme === key && styles.themeButtonTextActive
            ]}>
              {theme.metadata.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderContrastTest = (test: ContrastTest) => (
    <View key={test.id} style={styles.contrastTest}>
      <View style={styles.testHeader}>
        <Text style={styles.testElementType}>{test.elementType}</Text>
        <View style={[
          styles.testStatus,
          { backgroundColor: test.passed ? '#10B981' : '#EF4444' }
        ]}>
          <Text style={styles.testStatusText}>
            {test.passed ? 'PASS' : 'FAIL'}
          </Text>
        </View>
      </View>

      <View style={styles.testDetails}>
        <View style={styles.colorPreview}>
          <View style={[styles.colorSwatch, { backgroundColor: test.foreground }]} />
          <Text style={styles.colorCode}>{test.foreground}</Text>
        </View>
        <Text style={styles.onText}>on</Text>
        <View style={styles.colorPreview}>
          <View style={[styles.colorSwatch, { backgroundColor: test.background }]} />
          <Text style={styles.colorCode}>{test.background}</Text>
        </View>
      </View>

      <View style={styles.contrastRatio}>
        <Text style={styles.ratioText}>
          Contrast Ratio: {test.contrastRatio.toFixed(2)}:1
        </Text>
        <Text style={styles.requiredText}>
          Required: {test.requiredRatio}:1
        </Text>
      </View>

      {!test.passed && (
        <View style={styles.failureIndicator}>
          <Text style={styles.failureText}>
            ❌ Insufficient contrast for accessibility
          </Text>
        </View>
      )}
    </View>
  );

  const renderValidationResult = () => {
    if (!validationResult) return null;

    return (
      <ScrollView style={styles.resultContainer}>
        {/* Overall Status */}
        <View style={[
          styles.statusCard,
          { backgroundColor: validationResult.isValid ? '#D1FAE5' : '#FEE2E2' }
        ]}>
          <View style={styles.statusHeader}>
            <Text style={[
              styles.statusText,
              { color: validationResult.isValid ? '#065F46' : '#991B1B' }
            ]}>
              {validationResult.isValid ? '✅ WCAG Compliant' : '❌ Non-Compliant'}
            </Text>
            <Text style={styles.wcagLevel}>
              WCAG {validationResult.wcagLevel}
            </Text>
          </View>
        </View>

        {/* Accessibility Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Accessibility Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{validationResult.accessibilityScore.toFixed(0)}</Text>
            <Text style={styles.scoreLabel}>%</Text>
          </View>
          <Text style={styles.scoreDescription}>
            Based on {validationResult.totalTests} contrast tests
          </Text>
        </View>

        {/* Contrast Test Results */}
        {validationResult.contrastTests.length > 0 && (
          <View style={styles.testsContainer}>
            <View style={styles.testsHeader}>
              <Text style={styles.testsTitle}>
                Contrast Tests ({validationResult.passedTests}/{validationResult.totalTests} Passed)
              </Text>
            </View>
            {validationResult.contrastTests.map(renderContrastTest)}
          </View>
        )}

        {/* Errors */}
        {validationResult.errors.length > 0 && (
          <View style={styles.errorsContainer}>
            <View style={styles.errorsHeader}>
              <Text style={styles.errorsTitle}>
                Accessibility Issues ({validationResult.errors.length})
              </Text>
            </View>
            {validationResult.errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <View style={styles.errorIcon}>
                  <Text style={styles.errorIconText}>⚠</Text>
                </View>
                <View style={styles.errorContent}>
                  <Text style={styles.errorMessage}>{error.message}</Text>
                  {error.suggestion && (
                    <Text style={styles.errorSuggestion}>{error.suggestion}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Color Blindness Simulation Toggle */}
        <TouchableOpacity
          style={styles.simulationToggle}
          onPress={() => setShowColorBlindnessSimulation(!showColorBlindnessSimulation)}
        >
          <Text style={styles.simulationToggleText}>
            {showColorBlindnessSimulation ? 'Hide' : 'Show'} Color Blindness Simulation
          </Text>
        </TouchableOpacity>

        {/* Color Blindness Simulation */}
        {renderColorBlindnessSimulation()}
      </ScrollView>
    );
  };

  // MARK: - Helper Methods

  const generateColorPairs = (colors: any): [string, string][] => {
    const colorArray: string[] = [];

    // Extract light colors from the nested structure
    if (colors.primary?.light) colorArray.push(colors.primary.light);
    if (colors.secondary?.light) colorArray.push(colors.secondary.light);
    if (colors.tertiary?.light) colorArray.push(colors.tertiary.light);
    if (colors.background?.primary?.light) colorArray.push(colors.background.primary.light);
    if (colors.background?.secondary?.light) colorArray.push(colors.background.secondary.light);
    if (colors.text?.primary?.light) colorArray.push(colors.text.primary.light);
    if (colors.text?.secondary?.light) colorArray.push(colors.text.secondary.light);
    if (colors.semantic?.success?.light) colorArray.push(colors.semantic.success.light);
    if (colors.semantic?.error?.light) colorArray.push(colors.semantic.error.light);
    if (colors.semantic?.warning?.light) colorArray.push(colors.semantic.warning.light);

    const pairs: [string, string][] = [];

    for (let i = 0; i < colorArray.length; i++) {
      for (let j = i + 1; j < colorArray.length; j++) {
        pairs.push([colorArray[i], colorArray[j]]);
      }
    }

    return pairs;
  };

  const getBlindnessDescription = (blindnessType: ColorBlindnessType): string => {
    switch (blindnessType) {
      case ColorBlindnessType.PROTANOPIA:
        return 'Red-green color blindness (red appears darker)';
      case ColorBlindnessType.DEUTERANOPIA:
        return 'Red-green color blindness (green appears darker)';
      case ColorBlindnessType.TRITANOPIA:
        return 'Blue-yellow color blindness';
      default:
        return '';
    }
  };

  // MARK: - Main Render

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WCAG Accessibility Validation</Text>
      <Text style={styles.subtitle}>
        Automated WCAG {selectedWCAGLevel} compliance checking with contrast analysis
      </Text>

      {/* WCAG Level Selection */}
      {renderWCAGLevelSelector()}

      {/* Theme Selection */}
      {renderThemeSelector()}

      {/* Validation Button */}
      <TouchableOpacity
        style={[styles.validateButton, isValidating && styles.validateButtonDisabled]}
        onPress={handleValidation}
        disabled={isValidating}
      >
        {isValidating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.validateButtonText}>Validate WCAG Compliance</Text>
        )}
      </TouchableOpacity>

      {/* Results */}
      {renderValidationResult()}
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  arrow: {
    color: '#666666',
    fontSize: 16
  },

  blindnessDescription: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 12
  },

  blindnessType: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },

  colorCode: {
    color: '#666666',
    fontFamily: 'monospace',
    fontSize: 10
  },

  colorLabel: {
    color: '#666666',
    fontSize: 10,
    marginTop: 4
  },

  colorPair: {
    alignItems: 'center'
  },

  colorPairRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  colorPairsContainer: {
    gap: 8
  },

  colorPreview: {
    alignItems: 'center'
  },

  colorSwatch: {
    borderRadius: 4,
    height: 24,
    marginBottom: 4,
    width: 24
  },

  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    padding: 16
  },

  contrastRatio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  contrastTest: {
    borderBottomColor: '#F1F5F9',
    borderBottomWidth: 1,
    padding: 16
  },

  errorContent: {
    flex: 1
  },

  errorIcon: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
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
    borderBottomColor: '#FECACA',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 12
  },

  errorMessage: {
    color: '#1A1A1A',
    fontSize: 14,
    marginBottom: 4
  },

  errorSuggestion: {
    color: '#666666',
    fontSize: 12,
    fontStyle: 'italic'
  },

  errorsContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },

  errorsHeader: {
    backgroundColor: '#FEE2E2',
    borderBottomColor: '#FECACA',
    borderBottomWidth: 1,
    padding: 12
  },

  errorsTitle: {
    color: '#991B1B',
    fontSize: 16,
    fontWeight: '600'
  },

  failureIndicator: {
    backgroundColor: '#FEF2F2',
    borderRadius: 4,
    padding: 8
  },

  failureText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500'
  },

  levelButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  levelButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },

  levelButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500'
  },

  levelButtonTextActive: {
    color: '#FFFFFF'
  },

  levelButtons: {
    flexDirection: 'row',
    gap: 8
  },

  levelSelector: {
    marginBottom: 20
  },

  levelTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },

  onText: {
    color: '#666666',
    fontSize: 12,
    marginHorizontal: 8
  },

  ratioText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '500'
  },

  requiredText: {
    color: '#666666',
    fontSize: 12
  },

  resultContainer: {
    flex: 1
  },

  scoreCircle: {
    alignItems: 'center',
    borderColor: '#2563EB',
    borderRadius: 40,
    borderWidth: 4,
    height: 80,
    justifyContent: 'center',
    marginBottom: 8,
    width: 80
  },

  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 20
  },

  scoreDescription: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center'
  },

  scoreLabel: {
    color: '#666666',
    fontSize: 12
  },

  scoreTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },

  scoreValue: {
    color: '#2563EB',
    fontSize: 20,
    fontWeight: 'bold'
  },

  simulationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16
  },

  simulationSection: {
    marginBottom: 20
  },

  simulationSubtitle: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16
  },

  simulationTitle: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },

  simulationToggle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16
  },

  simulationToggleText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600'
  },

  statusCard: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 16
  },

  statusHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  statusText: {
    fontSize: 18,
    fontWeight: '600'
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 24
  },

  testDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },

  testElementType: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '600'
  },

  testHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },

  testStatus: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4
  },

  testStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },

  testsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },

  testsHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    padding: 12
  },

  testsTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600'
  },

  themeButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },

  themeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB'
  },

  themeButtonText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500'
  },

  themeButtonTextActive: {
    color: '#FFFFFF'
  },

  themeButtons: {
    gap: 8
  },

  themeSelector: {
    marginBottom: 20
  },

  themeTitle: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },

  title: {
    color: '#1A1A1A',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },

  validateButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
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

  wcagLevel: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500'
  }
});

export default AccessibilityValidationExample;
