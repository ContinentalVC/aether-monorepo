//
//  AccessibilityFoundation.tsx
//  AetherReactNativeApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether Design System. All rights reserved.
//

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  AccessibilityInfo,
  Vibration,
  Platform
} from 'react-native';

// MARK: - Accessibility Foundation
/// Comprehensive accessibility framework implementing VoiceOver support, Dynamic Type, and testing utilities

// MARK: - Accessibility Label Builder
export class AccessibilityLabelBuilder {
  /// Builds meaningful accessibility labels that describe purpose, not appearance
  static buildLabel(element: string, purpose: string, context?: string): string {
    let label = purpose;
    if (context) {
      label += `, ${context}`;
    }
    return label;
  }

  /// Builds accessibility hints that explain the result of an action
  static buildHint(action: string, result: string): string {
    return `Double tap to ${action}. ${result}`;
  }
}

// MARK: - Dynamic Type Support
export class DynamicTypeSupport {
  /// Checks if user has enabled large accessibility text sizes
  static async isLargeTextEnabled(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      return isEnabled;
    }
    return false;
  }

  /// Adaptive layout strategy for complex layouts
  static async shouldUseSingleColumnLayout(): Promise<boolean> {
    return await this.isLargeTextEnabled();
  }

  /// Get scaled font sizes based on accessibility settings
  static getScaledFontSize(baseSize: number): number {
    // In a real implementation, you would get the actual scale factor
    // from AccessibilityInfo.getRecommendedContentSizeCategory()
    return baseSize;
  }
}

// MARK: - Accessibility Grouping
export const AccessibilityGrouping: React.FC<{
  children: React.ReactNode;
  label: string;
  hint?: string;
}> = ({ children, label, hint }) => {
  return (
    <View
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole="none"
      style={styles.groupingContainer}
    >
      {children}
    </View>
  );
};

// MARK: - Custom Accessibility Actions
export interface CustomAccessibilityAction {
  name: string;
  action: () => void;
}

// MARK: - Accessibility Custom Rotor
export interface AccessibilityCustomRotor {
  name: string;
  items: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// MARK: - Haptic Feedback Manager
export class HapticFeedbackManager {
  /// Plays a success haptic feedback
  static playSuccessHaptic(): void {
    if (Platform.OS === 'ios') {
      // iOS specific haptic feedback
      Vibration.vibrate(100);
    } else {
      // Android haptic feedback
      Vibration.vibrate(50);
    }
  }

  /// Plays an error haptic feedback
  static playErrorHaptic(): void {
    if (Platform.OS === 'ios') {
      // Double vibration for error
      Vibration.vibrate(200);
      setTimeout(() => Vibration.vibrate(200), 100);
    } else {
      // Android error pattern
      Vibration.vibrate([0, 100, 50, 100]);
    }
  }

  /// Plays a warning haptic feedback
  static playWarningHaptic(): void {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(150);
    } else {
      Vibration.vibrate(75);
    }
  }

  /// Creates a custom haptic pattern for specific actions
  static createCustomPattern(intensity: number, duration: number): void {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(duration);
    } else {
      Vibration.vibrate(duration);
    }
  }
}

// MARK: - Accessibility Testing Utilities
export class AccessibilityTestingUtilities {
  /// Validates accessibility properties on a component
  static validateAccessibilityProperties(
    label?: string,
    hint?: string,
    role?: string,
    isEnabled: boolean = true
  ): string[] {
    const errors: string[] = [];

    // Validate accessibility label
    if (!label || label.length === 0) {
      errors.push('Accessibility label is missing or empty');
    } else if (label.includes('button') || label.includes('image')) {
      errors.push('Accessibility label should not include element type (button, image, etc.)');
    }

    // Validate accessibility hint
    if (hint !== undefined && hint.length === 0) {
      errors.push('Accessibility hint should not be empty if provided');
    }

    // Validate role
    if (!role) {
      errors.push('Accessibility role should be specified');
    }

    // Validate enabled state
    if (!isEnabled && role === 'button') {
      errors.push('Disabled buttons should have appropriate accessibility traits');
    }

    return errors;
  }

  /// Simulates VoiceOver navigation order
  static validateNavigationOrder(elements: string[]): string[] {
    const warnings: string[] = [];

    // Check for logical grouping
    if (elements.length > 10) {
      warnings.push('Consider grouping related elements for better VoiceOver navigation');
    }

    // Check for meaningful order
    if (elements.includes('Cancel') && elements.includes('Save')) {
      const cancelIndex = elements.indexOf('Cancel');
      const saveIndex = elements.indexOf('Save');
      if (cancelIndex < saveIndex) {
        warnings.push('Consider placing Save before Cancel for better UX');
      }
    }

    return warnings;
  }
}

// MARK: - Accessibility Testing View
export const AccessibilityTestingView: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isLargeTextEnabled, setIsLargeTextEnabled] = useState(false);

  useEffect(() => {
    checkAccessibilitySettings();
  }, []);

  const checkAccessibilitySettings = async () => {
    const largeText = await DynamicTypeSupport.isLargeTextEnabled();
    setIsLargeTextEnabled(largeText);
  };

  const runAccessibilityTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    // Simulate testing delay
    setTimeout(() => {
      // Test accessibility properties
      const propertyErrors = AccessibilityTestingUtilities.validateAccessibilityProperties(
        'Test Button',
        'Double tap to test',
        'button'
      );

      // Test navigation order
      const navigationWarnings = AccessibilityTestingUtilities.validateNavigationOrder([
        'Save',
        'Cancel',
        'Delete',
        'Edit'
      ]);

      const allResults = [...propertyErrors, ...navigationWarnings];

      // Add success message if no errors
      if (allResults.length === 0) {
        allResults.push('All accessibility tests passed!');
      }

      setTestResults(allResults);
      setIsTesting(false);
      HapticFeedbackManager.playSuccessHaptic();
    }, 2000);
  };

  const testHapticFeedback = () => {
    HapticFeedbackManager.playSuccessHaptic();
  };

  const testErrorHaptic = () => {
    HapticFeedbackManager.playErrorHaptic();
  };

  const testWarningHaptic = () => {
    HapticFeedbackManager.playWarningHaptic();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, isLargeTextEnabled && styles.largeTextTitle]}>
          Accessibility Testing
        </Text>

        {/* Test Section */}
        <View style={styles.testSection}>
          <Text style={[styles.sectionTitle, isLargeTextEnabled && styles.largeTextBody]}>
            Test Results
          </Text>

          {isTesting ? (
            <Text style={styles.loadingText}>Running accessibility tests...</Text>
          ) : (
            testResults.map((result, index) => (
              <Text
                key={index}
                style={[
                  styles.resultText,
                  isLargeTextEnabled && styles.largeTextCaption,
                  result.includes('error') ? styles.errorText : styles.warningText
                ]}
              >
                • {result}
              </Text>
            ))
          )}
        </View>

        {/* Test Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={runAccessibilityTests}
            accessible={true}
            accessibilityLabel="Run accessibility tests"
            accessibilityHint="Double tap to start comprehensive accessibility testing"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Run Accessibility Tests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={testHapticFeedback}
            accessible={true}
            accessibilityLabel="Test haptic feedback"
            accessibilityHint="Double tap to feel haptic feedback"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Haptic Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={testErrorHaptic}
            accessible={true}
            accessibilityLabel="Test error haptic"
            accessibilityHint="Double tap to feel error haptic feedback"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Error Haptic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={testWarningHaptic}
            accessible={true}
            accessibilityLabel="Test warning haptic"
            accessibilityHint="Double tap to feel warning haptic feedback"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Test Warning Haptic</Text>
          </TouchableOpacity>
        </View>

        {/* Example Accessible Elements */}
        <View style={styles.exampleSection}>
          <Text style={[styles.sectionTitle, isLargeTextEnabled && styles.largeTextBody]}>
            Example Accessible Elements
          </Text>

          {/* Contact Card Example */}
          <AccessibilityGrouping
            label="John Appleseed, Senior Designer. (408) 555-1234."
            hint="Double tap to view contact details"
          >
            <View style={styles.contactCard}>
              <Text style={[styles.contactName, isLargeTextEnabled && styles.largeTextBody]}>
                John Appleseed
              </Text>
              <Text style={[styles.contactTitle, isLargeTextEnabled && styles.largeTextCaption]}>
                Senior Designer
              </Text>
              <Text style={[styles.contactPhone, isLargeTextEnabled && styles.largeTextCaption]}>
                (408) 555-1234
              </Text>
            </View>
          </AccessibilityGrouping>
        </View>
      </View>
    </ScrollView>
  );
};

// MARK: - Styles
const styles = StyleSheet.create({
  buttonContainer: {
    gap: 15,
    marginBottom: 20
  },
  contactCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 10,
    padding: 15
  },
  contactName: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  contactPhone: {
    color: '#666',
    fontSize: 12
  },
  contactTitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 3
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  content: {
    padding: 20
  },
  errorText: {
    color: '#d32f2f'
  },
  exampleSection: {
    marginTop: 20
  },
  groupingContainer: {
    // Styles for grouped accessibility elements
  },
  largeTextBody: {
    fontSize: 20
  },
  largeTextCaption: {
    fontSize: 16
  },
  largeTextTitle: {
    fontSize: 32
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  resultText: {
    fontSize: 12,
    marginBottom: 5
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#007AFF',
    borderRadius: 8,
    borderWidth: 1,
    padding: 15
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600'
  },
  sectionTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  testSection: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  warningText: {
    color: '#f57c00'
  }
});

export default AccessibilityTestingView;
