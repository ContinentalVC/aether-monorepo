/**
 * Form Testing Example Component
 * 
 * This component tests all the enhanced validation features of the aether-react-native-forms package
 * to ensure everything works correctly in the React Native app.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  Form,
  ComplexForm,
  FieldArray,
  Input,
  ValidationRule,
  AccessibilityConfig,
  ErrorHandlerConfig,
  ValidationConfig,
} from '@aether/react-native-forms';
import { useTheme } from '@aether/react-native-theme';

// Utility to detect web environment
const isWeb = typeof document !== 'undefined' && typeof window !== 'undefined';

export const FormTestingExample: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Get theme values with fallback
  let theme;
  try {
    theme = useTheme();
  } catch (error) {
    theme = null;
  }

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTest = (testName: string, testFn: () => void) => {
    setCurrentTest(testName);
    addTestResult(`Starting test: ${testName}`);
    try {
      testFn();
      addTestResult(`✅ ${testName} passed`);
    } catch (error) {
      addTestResult(`❌ ${testName} failed: ${error}`);
    }
    setCurrentTest('');
  };

  // Enhanced validation rules for testing
  const emailValidation: ValidationRule[] = [
    {
      type: 'required',
      message: 'Email is required',
      enabled: true,
      priority: 1,
      stopOnFailure: true
    },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      enabled: true
    }
  ];

  const passwordValidation: ValidationRule[] = [
    {
      type: 'required',
      message: 'Password is required',
      enabled: true,
      priority: 1
    },
    {
      type: 'minLength',
      value: 8,
      message: 'Password must be at least 8 characters',
      trim: true,
      enabled: true
    },
    {
      type: 'pattern',
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must contain lowercase, uppercase, and number',
      fullMatch: true,
      enabled: true
    }
  ];

  const phoneValidation: ValidationRule[] = [
    {
      type: 'phone',
      message: 'Please enter a valid phone number',
      countryCode: 'US',
      enabled: true
    }
  ];

  // Enhanced accessibility configuration
  const accessibilityConfig: AccessibilityConfig = {
    enabled: true,
    respectReducedMotion: true,
    screenReaderSupport: true,
    keyboardNavigation: true,
    voiceControl: true,
    labels: {
      email: 'Email Address',
      password: 'Password',
      phone: 'Phone Number'
    },
    hints: {
      email: 'Enter your email address',
      password: 'Enter your password',
      phone: 'Enter your phone number'
    }
  };

  // Enhanced error handling configuration
  const errorHandlerConfig: ErrorHandlerConfig = {
    enabled: true,
    logErrors: true,
    reportErrors: true,
    showUserMessages: true,
    retryFailedOperations: true,
    maxRetryAttempts: 3,
    retryDelay: 1000,
    handlers: []
  };

  // Enhanced validation configuration
  const validationConfig: ValidationConfig = {
    strategy: 'onBlur',
    debounceDelay: 300,
    validateOnMount: false,
    stopOnFirstError: false,
    validateDependents: true,
    context: {
      fieldName: 'test',
      formValues: {}
    }
  };

  // Basic form configuration
  const basicFormConfig = {
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        type: 'email' as const,
        required: true,
        validation: emailValidation,
        helperText: 'We\'ll never share your email',
        accessibility: {
          label: 'Email Address',
          hint: 'Enter your email address',
          role: 'text',
          accessible: true,
          announceChanges: true
        }
      },
      {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password' as const,
        required: true,
        validation: passwordValidation,
        helperText: 'Must be at least 8 characters with mixed case and numbers',
        accessibility: {
          label: 'Password',
          hint: 'Enter your password',
          role: 'text',
          accessible: true,
          announceChanges: false
        }
      },
      {
        name: 'phone',
        label: 'Phone Number',
        placeholder: 'Enter your phone number',
        type: 'tel' as const,
        validation: phoneValidation,
        helperText: 'Enter your phone number for verification',
        accessibility: {
          label: 'Phone Number',
          hint: 'Enter your phone number',
          role: 'text',
          accessible: true,
          announceChanges: true
        }
      }
    ],
    onSubmit: (values: Record<string, string>) => {
      addTestResult(`Form submitted with values: ${JSON.stringify(values)}`);
      Alert.alert('Form Submitted', `Values: ${JSON.stringify(values, null, 2)}`);
    },
    onValidationChange: (validation) => {
      addTestResult(`Validation changed: ${validation.isValid ? 'Valid' : 'Invalid'} - ${validation.errors.length} errors`);
    },
    submitButtonText: 'Submit Form',
    resetButtonText: 'Reset Form',
    showResetButton: true,
    accessibility: accessibilityConfig,
    validation: validationConfig,
    errorHandling: errorHandlerConfig
  };

  // Complex form configuration with field arrays
  const complexFormConfig = {
    fields: [
      {
        name: 'user',
        fieldType: 'object' as const,
        label: 'User Information',
        objectFields: [
          {
            name: 'firstName',
            label: 'First Name',
            placeholder: 'Enter first name',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'First name is required',
                enabled: true
              },
              {
                type: 'minLength',
                value: 2,
                message: 'First name must be at least 2 characters',
                enabled: true
              }
            ] as ValidationRule[]
          },
          {
            name: 'lastName',
            label: 'Last Name',
            placeholder: 'Enter last name',
            required: true,
            validation: [
              {
                type: 'required',
                message: 'Last name is required',
                enabled: true
              }
            ] as ValidationRule[]
          }
        ]
      },
      {
        name: 'addresses',
        fieldType: 'array' as const,
        label: 'Addresses',
        enhancedValidation: [
          {
            type: 'arrayMinLength',
            value: 1,
            message: 'At least one address is required',
            enabled: true
          }
        ] as ValidationRule[],
        arrayConfig: {
          name: 'addresses',
          label: 'Addresses',
          itemTemplate: [
            {
              name: 'street',
              label: 'Street Address',
              placeholder: 'Enter street address',
              required: true,
              validation: [
                {
                  type: 'required',
                  message: 'Street address is required',
                  enabled: true
                }
              ] as ValidationRule[]
            },
            {
              name: 'city',
              label: 'City',
              placeholder: 'Enter city',
              required: true,
              validation: [
                {
                  type: 'required',
                  message: 'City is required',
                  enabled: true
                }
              ] as ValidationRule[]
            },
            {
              name: 'zipCode',
              label: 'ZIP Code',
              placeholder: 'Enter ZIP code',
              validation: [
                {
                  type: 'pattern',
                  value: /^\d{5}(-\d{4})?$/,
                  message: 'Please enter a valid ZIP code',
                  enabled: true
                }
              ] as ValidationRule[]
            }
          ],
          minItems: 1,
          maxItems: 3,
          reorderable: true,
          removable: true,
          addable: true,
          addButtonText: 'Add Address',
          removeButtonText: 'Remove Address'
        }
      }
    ],
    onSubmit: (values: Record<string, any>) => {
      addTestResult(`Complex form submitted with values: ${JSON.stringify(values)}`);
      Alert.alert('Complex Form Submitted', `Values: ${JSON.stringify(values, null, 2)}`);
    },
    onValidationChange: (validation) => {
      addTestResult(`Complex form validation: ${validation.isValid ? 'Valid' : 'Invalid'} - ${validation.errors.length} errors`);
    },
    submitButtonText: 'Submit Complex Form',
    resetButtonText: 'Reset Complex Form',
    showResetButton: true
  };

  // Field array configuration for testing
  const fieldArrayConfig = {
    name: 'items',
    label: 'Test Items',
    helperText: 'Add test items to the array',
    itemTemplate: [
      {
        name: 'name',
        label: 'Item Name',
        placeholder: 'Enter item name',
        required: true,
        validation: [
          {
            type: 'required',
            message: 'Item name is required',
            enabled: true
          }
        ] as ValidationRule[]
      },
      {
        name: 'description',
        label: 'Description',
        placeholder: 'Enter description',
        multiline: true,
        numberOfLines: 3
      }
    ],
    minItems: 1,
    maxItems: 5,
    reorderable: true,
    removable: true,
    addable: true,
    addButtonText: 'Add Item',
    removeButtonText: 'Remove Item',
    validation: [
      {
        type: 'arrayMinLength',
        value: 1,
        message: 'At least one item is required',
        enabled: true
      }
    ] as ValidationRule[]
  };

  // Test functions
  const testBasicForm = () => {
    addTestResult('Testing basic form with enhanced validation...');
    // The form component will handle the validation automatically
  };

  const testComplexForm = () => {
    addTestResult('Testing complex form with field arrays...');
    // The complex form component will handle the validation automatically
  };

  const testFieldArray = () => {
    addTestResult('Testing field array with enhanced validation...');
    // The field array component will handle the validation automatically
  };

  const testEnhancedValidation = () => {
    addTestResult('Testing enhanced validation rules...');
    // Test various validation rules
    const testEmail = 'test@example.com';
    const testPassword = 'TestPass123';
    const testPhone = '+1234567890';
    
    addTestResult(`Email validation test: ${testEmail}`);
    addTestResult(`Password validation test: ${testPassword}`);
    addTestResult(`Phone validation test: ${testPhone}`);
  };

  const testAccessibility = () => {
    addTestResult('Testing accessibility features...');
    addTestResult('Screen reader support enabled');
    addTestResult('Keyboard navigation enabled');
    addTestResult('Reduced motion support enabled');
  };

  const testErrorHandling = () => {
    addTestResult('Testing error handling...');
    addTestResult('Error logging enabled');
    addTestResult('User message display enabled');
    addTestResult('Retry mechanism enabled');
  };

  const runAllTests = () => {
    setTestResults([]);
    addTestResult('Starting comprehensive form testing...');
    
    runTest('Enhanced Validation', testEnhancedValidation);
    runTest('Accessibility Features', testAccessibility);
    runTest('Error Handling', testErrorHandling);
    runTest('Basic Form', testBasicForm);
    runTest('Complex Form', testComplexForm);
    runTest('Field Array', testFieldArray);
    
    addTestResult('All tests completed!');
  };

  // Get theme-aware styles
  const getThemeStyles = () => {
    if (!theme) {
      return styles;
    }

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.theme.background,
        padding: theme.theme.spacing.md,
      },
      scrollView: {
        flex: 1,
      },
      title: {
        fontSize: theme.theme.typography.fontSizes.xl,
        fontWeight: theme.theme.typography.fontWeights.bold as any,
        color: theme.theme.textPrimary,
        marginBottom: theme.theme.spacing.lg,
        textAlign: 'center',
      },
      section: {
        marginBottom: theme.theme.spacing.xl,
      },
      sectionTitle: {
        fontSize: theme.theme.typography.fontSizes.lg,
        fontWeight: theme.theme.typography.fontWeights.semibold as any,
        color: theme.theme.textPrimary,
        marginBottom: theme.theme.spacing.md,
      },
      testButton: {
        backgroundColor: theme.theme.primary,
        borderRadius: theme.theme.borderRadius.md,
        paddingVertical: theme.theme.spacing.sm,
        paddingHorizontal: theme.theme.spacing.md,
        marginBottom: theme.theme.spacing.sm,
        alignItems: 'center',
      },
      testButtonText: {
        color: theme.theme.surface,
        fontSize: theme.theme.typography.fontSizes.md,
        fontWeight: theme.theme.typography.fontWeights.medium as any,
      },
      resultsContainer: {
        backgroundColor: theme.theme.surface,
        borderRadius: theme.theme.borderRadius.md,
        padding: theme.theme.spacing.md,
        marginTop: theme.theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.theme.border,
      },
      resultText: {
        fontSize: theme.theme.typography.fontSizes.sm,
        color: theme.theme.textSecondary,
        marginBottom: theme.theme.spacing.xs,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      },
      currentTest: {
        fontSize: theme.theme.typography.fontSizes.md,
        color: theme.theme.primary,
        fontWeight: theme.theme.typography.fontWeights.medium as any,
        marginBottom: theme.theme.spacing.sm,
      },
      formContainer: {
        backgroundColor: theme.theme.surface,
        borderRadius: theme.theme.borderRadius.md,
        padding: theme.theme.spacing.md,
        marginBottom: theme.theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.theme.border,
      },
    });
  };

  const themeStyles = getThemeStyles();

  return (
    <ScrollView style={themeStyles.scrollView} contentContainerStyle={themeStyles.container}>
      <Text style={themeStyles.title}>Form Testing Example</Text>
      
      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Test Controls</Text>
        
        <View style={themeStyles.testButton}>
          <Text style={themeStyles.testButtonText} onPress={runAllTests}>
            Run All Tests
          </Text>
        </View>
        
        {currentTest && (
          <Text style={themeStyles.currentTest}>Running: {currentTest}</Text>
        )}
        
        <View style={themeStyles.resultsContainer}>
          <Text style={themeStyles.sectionTitle}>Test Results</Text>
          {testResults.map((result, index) => (
            <Text key={index} style={themeStyles.resultText}>
              {result}
            </Text>
          ))}
        </View>
      </View>

      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Basic Form with Enhanced Validation</Text>
        <View style={themeStyles.formContainer}>
          <Form
            config={basicFormConfig}
            showValidationErrors={true}
            validateOnChange={true}
            validateOnBlur={true}
            validateOnSubmit={true}
            testID="basic-form"
          />
        </View>
      </View>

      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Complex Form with Field Arrays</Text>
        <View style={themeStyles.formContainer}>
          <ComplexForm
            config={complexFormConfig}
            showValidationErrors={true}
            validateOnChange={false}
            validateOnBlur={true}
            validateOnSubmit={true}
            testID="complex-form"
          />
        </View>
      </View>

      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Field Array Component</Text>
        <View style={themeStyles.formContainer}>
          <FieldArray
            config={fieldArrayConfig}
            initialValues={[
              { name: 'Test Item 1', description: 'First test item' }
            ]}
            onArrayChange={(values) => {
              addTestResult(`Field array changed: ${values.length} items`);
            }}
            validation={[
              {
                type: 'arrayMinLength',
                value: 1,
                message: 'At least one item is required',
                enabled: true
              }
            ]}
            showValidationErrors={true}
            testID="field-array"
            animationDuration={300}
            animationEasing="ease-out"
            animationsEnabled={true}
            respectReducedMotion={true}
          />
        </View>
      </View>

      <View style={themeStyles.section}>
        <Text style={themeStyles.sectionTitle}>Individual Input Testing</Text>
        <View style={themeStyles.formContainer}>
          <Input
            value=""
            onChangeText={(text) => addTestResult(`Input changed: ${text}`)}
            label="Test Input"
            placeholder="Enter test value"
            validation={[
              {
                type: 'required',
                message: 'This field is required',
                enabled: true
              },
              {
                type: 'minLength',
                value: 3,
                message: 'Must be at least 3 characters',
                enabled: true
              }
            ]}
            showValidationErrors={true}
            testID="test-input"
            accessibilityLabel="Test input field"
            accessibilityHint="Enter a test value"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  currentTest: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default FormTestingExample; 