# Validation Systems Guide

> *Comprehensive guide for choosing and implementing the right validation system in the Aether monorepo.*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Decision Guide](#quick-decision-guide)
- [Forms Validation System](#forms-validation-system)
- [Theme/Accessibility Validation System](#themeaccessibility-validation-system)
- [System Comparison](#system-comparison)
- [Implementation Examples](#implementation-examples)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [Future Enhancements](#future-enhancements)

---

## 🔍 Overview

The Aether monorepo contains **two distinct validation systems** designed for different purposes:

### Validation Systems

1. **Forms Validation System** - For form field validation and user input
2. **Theme/Accessibility Validation System** - For theme schemas and accessibility compliance

### Current Architecture

| Aspect | Forms Validation | Theme/Accessibility Validation |
|--------|------------------|--------------------------------|
| **Package** | `@aether/react-native-forms` | `@aether/core` |
| **Primary Use** | Form field validation | Theme schema validation |
| **Type Safety** | ✅ Enhanced (Phase 3) | ✅ Standard |
| **Async Support** | ✅ Yes | ✅ Yes |
| **Real-time** | ✅ Yes | ❌ No |
| **Cross-platform** | ✅ React Native | ✅ All platforms |
| **Accessibility** | ✅ Basic | ✅ Comprehensive |
| **Performance** | ❌ No | ✅ Yes |
| **Custom Rules** | ✅ Yes | ✅ Yes |

---

## 🚀 Quick Decision Guide

### Quick Decision Tree

```
What are you validating?
├── User input in forms? → Forms Validation System
├── Theme schemas? → Theme/Accessibility Validation System
├── Both? → Use both systems appropriately
└── Something else? → Check detailed guide
```

### Common Use Cases

#### Forms Validation System
- ✅ Email validation
- ✅ Password requirements
- ✅ Required fields
- ✅ Real-time form feedback
- ✅ Complex nested forms
- ✅ Async validation (API calls)

#### Theme/Accessibility Validation System
- ✅ Theme schema validation
- ✅ WCAG accessibility compliance
- ✅ Color contrast checking
- ✅ Performance analysis
- ✅ Cross-platform theme validation

### Quick Examples

#### Forms Validation
```typescript
import { useForm, ValidationRule } from '@aether/react-native-forms';

const emailValidation: ValidationRule[] = [
  { type: 'required', message: 'Email required' },
  { type: 'email', message: 'Invalid email' }
];

const { validateField } = useForm({ 
  fields: [{ name: 'email', validation: emailValidation }] 
});
```

#### Theme Validation
```typescript
import { ThemeValidator } from '@aether/core';

const validator = new ThemeValidator();
const result = await validator.validateTheme(theme, {
  validateAccessibility: true,
  includeWarnings: true
});
```

---

## 📝 Forms Validation System

### Purpose
The Forms Validation System is designed for validating user input in forms, handling real-time validation, and providing immediate feedback to users.

### When to Use
- ✅ **Form field validation** (email, password, required fields)
- ✅ **User input validation** (text inputs, numbers, dates)
- ✅ **Real-time validation** (as user types)
- ✅ **Form submission validation** (before submitting data)
- ✅ **Complex form structures** (nested objects, arrays)
- ✅ **Custom validation rules** (business logic validation)

### When NOT to Use
- ❌ Theme schema validation
- ❌ Accessibility compliance checking
- ❌ Performance analysis
- ❌ Design system validation

### Key Features

#### Enhanced Type Safety
```typescript
import { 
  ValidationRule, 
  ValidationError, 
  ValidationResult,
  RequiredValidationRule,
  EmailValidationRule,
  CustomValidationRule
} from '@aether/react-native-forms';

// Type-safe validation rules
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
```

#### Async Validation Support
```typescript
// Custom async validation rule
const customAsyncRule: CustomValidationRule = {
  type: 'custom',
  message: 'Username is already taken',
  enabled: true,
  validate: async (value, context) => {
    const response = await fetch(`/api/check-username?username=${value}`);
    const { available } = await response.json();
    return available ? null : 'Username is already taken';
  }
};
```

#### Form Integration
```typescript
import { useForm, Form } from '@aether/react-native-forms';

const MyForm = () => {
  const { values, errors, validateField, validateForm } = useForm({
    fields: [
      {
        name: 'email',
        type: 'email',
        validation: emailValidation
      },
      {
        name: 'username',
        type: 'text',
        validation: [customAsyncRule]
      }
    ]
  });

  return (
    <Form>
      <Input
        name="email"
        value={values.email}
        error={errors.email}
        onBlur={() => validateField('email')}
      />
    </Form>
  );
};
```

#### Complex Form Validation
```typescript
// Nested object validation
const addressValidation = {
  street: [
    { type: 'required', message: 'Street address is required' }
  ],
  city: [
    { type: 'required', message: 'City is required' }
  ],
  zipCode: [
    { type: 'required', message: 'ZIP code is required' },
    { type: 'pattern', pattern: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP code format' }
  ]
};

// Array validation
const itemsValidation = [
  {
    type: 'arrayMinLength',
    minLength: 1,
    message: 'At least one item is required'
  }
];
```

### Available Validation Rules

#### Basic Rules
- `required` - Field must not be empty
- `email` - Valid email format
- `phone` - Valid phone number format
- `url` - Valid URL format
- `minLength` - Minimum string length
- `maxLength` - Maximum string length
- `pattern` - Custom regex pattern

#### Advanced Rules
- `custom` - Custom validation function
- `async` - Asynchronous validation
- `arrayMinLength` - Minimum array length
- `arrayMaxLength` - Maximum array length
- `numeric` - Numeric value validation
- `date` - Date validation
- `file` - File validation

### Best Practices

1. **Use Type Guards for Runtime Safety**
```typescript
import { isRequiredRule, isEmailRule } from '@aether/react-native-forms';

if (isRequiredRule(rule)) {
  // TypeScript knows this is a RequiredValidationRule
  console.log(rule.message);
}
```

2. **Provide Context for Better Error Messages**
```typescript
const validation = await validateEnhancedField(value, rules, fieldName, {
  formValues: allFormValues,
  fieldPath: 'user.address.street',
  arrayIndex: 0
});
```

3. **Handle Async Validation Gracefully**
```typescript
const validateField = async (fieldName: string) => {
  try {
    const result = await validateEnhancedField(value, rules, fieldName);
    if (!result.isValid) {
      setFieldError(fieldName, result.errors[0].message);
    }
  } catch (error) {
    console.error('Validation error:', error);
    setFieldError(fieldName, 'Validation failed');
  }
};
```

---

## 🎨 Theme/Accessibility Validation System

### Purpose
The Theme/Accessibility Validation System is designed for validating theme schemas, ensuring accessibility compliance, and analyzing design system performance.

### When to Use
- ✅ **Theme schema validation** (structure, types, required properties)
- ✅ **Accessibility compliance** (WCAG 2.1, color contrast, touch targets)
- ✅ **Performance analysis** (animation durations, file sizes)
- ✅ **Design system validation** (color palettes, typography)
- ✅ **Cross-platform theme validation** (iOS, React Native, Web)
- ✅ **Theme migration validation** (version compatibility)

### When NOT to Use
- ❌ Form field validation
- ❌ User input validation
- ❌ Real-time form feedback
- ❌ Business logic validation

### Key Features

#### Comprehensive Theme Validation
```typescript
import { ThemeValidator, ThemeSchema } from '@aether/core';

const validator = new ThemeValidator();

const theme: ThemeSchema = {
  metadata: {
    name: 'Modern Dark',
    version: '2.0.0'
  },
  colors: {
    primary: '#007AFF',
    background: '#000000',
    text: '#FFFFFF'
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: 'bold'
    }
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24
  }
};

// Validate theme with all checks
const result = await validator.validateTheme(theme, {
  validateAccessibility: true,
  includeWarnings: true,
  customRules: [
    {
      name: 'brand-colors',
      validate: (theme) => {
        const errors = [];
        if (!theme.colors.brand) {
          errors.push({
            message: 'Brand color is required',
            path: 'colors.brand',
            severity: 'error'
          });
        }
        return errors;
      }
    }
  ]
});
```

#### Accessibility Validation
```typescript
import { AccessibilityValidator, WCAGLevel } from '@aether/core';

const accessibilityValidator = new AccessibilityValidator();

const accessibilityResult = await accessibilityValidator.validateTheme(theme, {
  level: WCAGLevel.AA,
  includeColorBlindness: true,
  includeMotionSensitivity: true
});

console.log(`Accessibility Score: ${accessibilityResult.score}/100`);
console.log(`WCAG Compliance: ${accessibilityResult.compliant ? 'Pass' : 'Fail'}`);
```

#### Performance Analysis
```typescript
import { PerformanceValidator } from '@aether/core';

const performanceValidator = new PerformanceValidator();

const performanceResult = await performanceValidator.analyzeTheme(theme, {
  analyzeAnimations: true,
  analyzeColorPalette: true,
  analyzeFileSize: true
});

console.log(`Performance Score: ${performanceResult.score}/100`);
console.log(`Animation Duration: ${performanceResult.animationDuration}ms`);
console.log(`Color Palette Size: ${performanceResult.colorPaletteSize} colors`);
```

### Validation Categories

#### Structure Validation
- Required properties check
- Type validation
- Nested object validation
- Array validation
- Schema version compatibility

#### Content Validation
- Color format validation
- Typography validation
- Spacing validation
- Animation validation
- Icon validation

#### Accessibility Validation
- Color contrast ratio analysis
- Touch target size validation
- Focus indicator validation
- Color blindness compatibility
- Motion sensitivity validation

#### Performance Validation
- Animation duration optimization
- Color palette size analysis
- File size optimization
- Memory usage analysis
- Rendering performance

### Custom Validation Rules

```typescript
const customValidationRules = [
  {
    name: 'brand-consistency',
    validate: (theme) => {
      const errors = [];
      
      // Check brand color consistency
      if (theme.colors.primary !== theme.colors.brand) {
        errors.push({
          message: 'Primary color should match brand color',
          path: 'colors.primary',
          severity: 'warning'
        });
      }
      
      return errors;
    }
  },
  {
    name: 'accessibility-requirements',
    validate: (theme) => {
      const errors = [];
      
      // Check minimum touch target size
      if (theme.spacing.touchTarget < 44) {
        errors.push({
          message: 'Touch targets should be at least 44px',
          path: 'spacing.touchTarget',
          severity: 'error'
        });
      }
      
      return errors;
    }
  }
];
```

---

## 🔄 System Comparison

### Feature Comparison

| Feature | Forms Validation | Theme Validation |
|---------|------------------|------------------|
| **Email validation** | ✅ `{ type: 'email' }` | ❌ Not applicable |
| **Required fields** | ✅ `{ type: 'required' }` | ❌ Not applicable |
| **Real-time feedback** | ✅ `validateField()` | ❌ Not applicable |
| **Theme structure** | ❌ Not applicable | ✅ `ThemeValidator` |
| **Color contrast** | ❌ Not applicable | ✅ `AccessibilityValidator` |
| **WCAG compliance** | ❌ Not applicable | ✅ `WCAGLevel.AA` |
| **Async validation** | ✅ Custom rules | ✅ Custom rules |
| **Cross-platform** | ✅ React Native | ✅ All platforms |
| **Performance analysis** | ❌ No | ✅ Yes |
| **Custom rules** | ✅ Yes | ✅ Yes |

### Decision Examples

#### Example 1: User Registration Form
```typescript
// ✅ Use Forms Validation
import { useForm, ValidationRule } from '@aether/react-native-forms';

const registrationValidation = {
  email: [
    { type: 'required', message: 'Email required' },
    { type: 'email', message: 'Invalid email' }
  ],
  password: [
    { type: 'required', message: 'Password required' },
    { type: 'minLength', minLength: 8, message: 'Min 8 characters' }
  ]
};
```

#### Example 2: Theme Editor
```typescript
// ✅ Use Theme/Accessibility Validation
import { ThemeValidator } from '@aether/core';

const validateTheme = async (theme) => {
  const validator = new ThemeValidator();
  return await validator.validateTheme(theme, {
    validateAccessibility: true,
    includeWarnings: true
  });
};
```

#### Example 3: Hybrid Application
```typescript
// ✅ Use Both Systems
import { useForm } from '@aether/react-native-forms';
import { ThemeValidator } from '@aether/core';

const ThemeEditor = () => {
  // Forms validation for user input
  const { validateField } = useForm(formConfig);
  
  // Theme validation for design system
  const validateTheme = async (theme) => {
    const validator = new ThemeValidator();
    return await validator.validateTheme(theme);
  };
  
  return (
    <Form>
      <Input name="themeName" validation={[{ type: 'required' }]} />
      <ThemePreview onValidate={validateTheme} />
    </Form>
  );
};
```

---

## 🚨 Common Mistakes

### ❌ Don't Use Forms Validation For:
- Theme schema validation
- Accessibility compliance
- Performance analysis
- Design system validation

### ❌ Don't Use Theme Validation For:
- Form field validation
- User input validation
- Real-time form feedback
- Business logic validation

### ✅ Do Use Each System For Its Intended Purpose:
- **Forms Validation**: User input, form fields, real-time feedback
- **Theme Validation**: Design systems, accessibility, performance

---

## 📚 Implementation Examples

### Forms Validation Implementation

#### Basic Form with Validation
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Input, Button } from '@aether/react-native-forms';

const LoginForm = () => {
  const { values, errors, validateField, validateForm, isValid } = useForm({
    fields: [
      {
        name: 'email',
        validation: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email' }
        ]
      },
      {
        name: 'password',
        validation: [
          { type: 'required', message: 'Password is required' },
          { type: 'minLength', minLength: 8, message: 'Password must be at least 8 characters' }
        ]
      }
    ]
  });

  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      // Submit form
      console.log('Form is valid:', values);
    }
  };

  return (
    <View>
      <Input
        name="email"
        value={values.email}
        error={errors.email}
        placeholder="Enter your email"
        onBlur={() => validateField('email')}
      />
      <Input
        name="password"
        value={values.password}
        error={errors.password}
        placeholder="Enter your password"
        secureTextEntry
        onBlur={() => validateField('password')}
      />
      <Button 
        title="Login" 
        onPress={handleSubmit}
        disabled={!isValid}
      />
    </View>
  );
};
```

#### Complex Form with Nested Validation
```typescript
import React from 'react';
import { useForm } from '@aether/react-native-forms';

const UserProfileForm = () => {
  const { values, errors, validateField, validateForm } = useForm({
    fields: [
      {
        name: 'personalInfo',
        type: 'object',
        validation: [
          {
            type: 'required',
            message: 'Personal information is required'
          }
        ],
        fields: [
          {
            name: 'firstName',
            validation: [
              { type: 'required', message: 'First name is required' }
            ]
          },
          {
            name: 'lastName',
            validation: [
              { type: 'required', message: 'Last name is required' }
            ]
          },
          {
            name: 'email',
            validation: [
              { type: 'required', message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email' }
            ]
          }
        ]
      },
      {
        name: 'addresses',
        type: 'array',
        validation: [
          {
            type: 'arrayMinLength',
            minLength: 1,
            message: 'At least one address is required'
          }
        ],
        itemValidation: {
          street: [
            { type: 'required', message: 'Street address is required' }
          ],
          city: [
            { type: 'required', message: 'City is required' }
          ],
          zipCode: [
            { type: 'required', message: 'ZIP code is required' },
            { type: 'pattern', pattern: /^\d{5}(-\d{4})?$/, message: 'Invalid ZIP code format' }
          ]
        }
      }
    ]
  });

  return (
    <View>
      {/* Form fields */}
    </View>
  );
};
```

### Theme Validation Implementation

#### Basic Theme Validation
```typescript
import { ThemeValidator, AccessibilityValidator } from '@aether/core';

const validateDesignSystem = async (theme) => {
  const themeValidator = new ThemeValidator();
  const accessibilityValidator = new AccessibilityValidator();

  // Validate theme structure and content
  const themeResult = await themeValidator.validateTheme(theme, {
    validateAccessibility: true,
    includeWarnings: true
  });

  // Validate accessibility compliance
  const accessibilityResult = await accessibilityValidator.validateTheme(theme, {
    level: 'AA',
    includeColorBlindness: true
  });

  return {
    theme: themeResult,
    accessibility: accessibilityResult,
    overall: {
      isValid: themeResult.isValid && accessibilityResult.compliant,
      score: Math.round((themeResult.score + accessibilityResult.score) / 2)
    }
  };
};
```

#### Theme Editor with Real-time Validation
```typescript
import React, { useState, useEffect } from 'react';
import { ThemeValidator } from '@aether/core';
import { useForm } from '@aether/react-native-forms';

const ThemeEditor = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const { values, errors, validateField } = useForm({
    fields: [
      {
        name: 'themeName',
        validation: [
          { type: 'required', message: 'Theme name is required' }
        ]
      },
      {
        name: 'primaryColor',
        validation: [
          { type: 'required', message: 'Primary color is required' },
          { type: 'pattern', pattern: /^#[0-9A-F]{6}$/i, message: 'Invalid color format' }
        ]
      }
    ]
  });

  const validateTheme = async (newTheme) => {
    setIsValidating(true);
    try {
      const validator = new ThemeValidator();
      const result = await validator.validateTheme(newTheme, {
        validateAccessibility: true,
        includeWarnings: true
      });
      setValidationResult(result);
    } catch (error) {
      console.error('Theme validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <View>
      <Input
        name="themeName"
        value={values.themeName}
        error={errors.themeName}
        placeholder="Theme name"
        onBlur={() => validateField('themeName')}
      />
      
      <ColorPicker
        value={theme.colors.primary}
        onChange={(color) => handleThemeChange({
          ...theme,
          colors: { ...theme.colors, primary: color }
        })}
      />
      
      {isValidating && <Text>Validating theme...</Text>}
      
      {validationResult && (
        <ValidationSummary result={validationResult} />
      )}
    </View>
  );
};
```

---

## 🚀 Best Practices

### Forms Validation Best Practices

1. **Use Enhanced Types**: Always use the enhanced `ValidationRule` types
2. **Type Guards**: Use type guards for runtime safety
3. **Async Validation**: Handle async validation gracefully
4. **Error Context**: Provide rich context for better error messages
5. **Real-time Feedback**: Use real-time validation for better UX

### Theme Validation Best Practices

1. **WCAG Compliance**: Use appropriate WCAG levels (AA for most apps)
2. **Custom Rules**: Add brand-specific validation rules
3. **Performance**: Monitor animation durations and color palette size
4. **Cross-platform**: Ensure validation works across all platforms
5. **Accessibility**: Prioritize accessibility compliance

### General Best Practices

1. **Choose the Right System**: Use forms validation for user input, theme validation for design systems
2. **Type Safety**: Leverage TypeScript for compile-time safety
3. **Testing**: Write comprehensive tests for validation logic
4. **Documentation**: Keep documentation current with new features
5. **Performance**: Monitor validation performance in production

---

## 🔄 Migration Guide

### From Legacy Validation

#### Forms Validation Migration
```typescript
// Old approach
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!email.includes('@')) return 'Invalid email';
  return null;
};

// New approach
import { useForm } from '@aether/react-native-forms';

const emailValidation = [
  { type: 'required', message: 'Email is required' },
  { type: 'email', message: 'Invalid email' }
];

const { validateField } = useForm({ fields: [{ name: 'email', validation: emailValidation }] });
```

#### Theme Validation Migration
```typescript
// Old approach
const validateTheme = (theme) => {
  const errors = [];
  if (!theme.colors.primary) {
    errors.push('Primary color is required');
  }
  return errors;
};

// New approach
import { ThemeValidator } from '@aether/core';

const validator = new ThemeValidator();
const result = await validator.validateTheme(theme, {
  validateAccessibility: true,
  includeWarnings: true
});
```

### Migration Checklist

- [ ] Update imports to use new validation systems
- [ ] Replace custom validation functions with built-in rules
- [ ] Update error handling to use new error formats
- [ ] Test all validation scenarios
- [ ] Update documentation and examples
- [ ] Verify cross-platform compatibility

---

## 🔮 Future Enhancements

### Planned Improvements

1. **Forms Validation**
   - Internationalization support
   - Advanced async validation patterns
   - Real-time collaboration features
   - AI-powered validation suggestions

2. **Theme Validation**
   - AI-powered theme suggestions
   - Advanced performance analytics
   - Cross-platform theme synchronization
   - Automated accessibility improvements

3. **Integration**
   - Unified validation API
   - Cross-system validation rules
   - Shared validation utilities
   - Performance optimization

4. **Developer Experience**
   - Visual validation builder
   - Real-time validation preview
   - Advanced debugging tools
   - Performance profiling

---

## 📚 Additional Resources

### Documentation
- [Forms Package README](./packages/aether-react-native-forms/README.md)
- [Core Package README](./packages/aether-core/README.md)
- [Shared Types README](./packages/aether-shared-types/README.md)

### Examples
- [Forms Validation Examples](./packages/aether-react-native-forms/examples/)
- [Theme Validation Examples](./packages/aether-core/examples/)
- [Integration Examples](./examples/)

### API Reference
- [Forms Validation API](./packages/aether-react-native-forms/docs/)
- [Theme Validation API](./packages/aether-core/docs/)
- [Shared Types API](./packages/aether-shared-types/docs/)

---

*For more detailed information, see the [COMPREHENSIVE_PROJECT_DOCUMENTATION.md](./COMPREHENSIVE_PROJECT_DOCUMENTATION.md)* 