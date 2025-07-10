# Theme Validation System

> *Comprehensive validation system for theme schemas with integrated accessibility and performance analysis*

---

## 🔍 Overview

The Theme Validation System provides robust validation for theme schemas across both SwiftUI and React Native platforms. It ensures themes are not only structurally correct but also accessible and performant.

### Key Features

- **Schema Validation**: Ensures all required properties are present and correctly typed
- **Content Validation**: Checks for semantic consistency and logical relationships
- **Accessibility Validation**: WCAG compliance checks for color contrast and usability
- **Performance Analysis**: Identifies potential performance bottlenecks
- **Real-time Feedback**: Immediate validation results with detailed error reporting
- **Cross-platform**: Consistent validation logic for both iOS and React Native

---

## 🏗️ Architecture

### Validation Layers

```
Theme Schema
    ↓
Schema Validation (Structure & Types)
    ↓
Content Validation (Semantic Logic)
    ↓
Accessibility Validation (WCAG Compliance)
    ↓
Performance Analysis (Optimization)
    ↓
Validation Result (Scores & Recommendations)
```

### Core Components

1. **ThemeValidator**: Main validation engine
2. **ValidationError**: Structured error reporting
3. **ValidationResult**: Comprehensive validation output
4. **AccessibilityChecker**: WCAG compliance validation
5. **PerformanceAnalyzer**: Performance impact assessment

---

## 📱 Platform Implementations

### SwiftUI Implementation

```swift
// Core validation class
class ThemeValidator: ObservableObject {
    func validateTheme(_ theme: ThemeSchema) async -> ThemeValidationResult
}

// Error types
enum ThemeValidationError: LocalizedError, Identifiable {
    case schemaError(String)
    case contentError(String)
    case accessibilityError(String)
    case colorContrastError(String)
    // ... more error types
}

// Validation result
struct ThemeValidationResult {
    let isValid: Bool
    let errors: [ThemeValidationError]
    let warnings: [String]
    let accessibilityScore: Double
    let performanceScore: Double
}
```

### React Native Implementation

```typescript
// Core validation class
export class ThemeValidator {
    async validateTheme(theme: ThemeSchema): Promise<ValidationResult>
}

// Error interface
export interface ValidationError {
    id: string;
    type: 'schema' | 'content' | 'accessibility' | 'colorContrast';
    message: string;
    property?: string;
    expectedType?: string;
    value?: any;
}

// Validation result
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    accessibilityScore: number;
    performanceScore: number;
    timestamp: Date;
}
```

---

## 🔧 Validation Rules

### Schema Validation

#### Required Properties
- `metadata.name`: Non-empty string
- `metadata.version`: Non-empty string
- `colors.primary`: Valid color format
- `colors.background`: Valid color format
- `colors.text`: Valid color format

#### Type Validation
- **Colors**: Must be valid hex (#RRGGBB, #RRGGBBAA), named colors, or rgba format
- **Typography**: Font sizes must be positive numbers (12-100pt)
- **Spacing**: Must be non-negative numbers (0-1000pt)
- **Animations**: Duration must be non-negative (0-10 seconds)

#### Format Validation
```swift
// Color format validation
private func isValidColorFormat(_ color: String) -> Bool {
    // Hex format (#RRGGBB or #RRGGBBAA)
    let hexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$"
    
    // Named colors
    let namedColors = ["red", "green", "blue", "black", "white", "gray"]
    
    // RGBA format
    let rgbaPattern = "^rgba?\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+\\s*(,\\s*[\\d.]+\\s*)?\\)$"
    
    return hexPattern.test(color) || 
           namedColors.includes(color.lowercased()) || 
           rgbaPattern.test(color)
}
```

### Content Validation

#### Semantic Consistency
- Primary color cannot equal background color
- Font size hierarchy should not be extreme (max ratio: 10:1)
- Error states should not rely solely on color
- Success states should not rely solely on color

#### Logical Relationships
```swift
// Color relationship validation
if theme.colors.primary == theme.colors.background {
    errors.append(.contentError("Primary color cannot be the same as background color"))
}

// Typography hierarchy validation
let fontSizes = theme.typography.values.map { $0.fontSize }.sorted()
if fontSizes.count > 1 {
    let ratio = fontSizes.last! / fontSizes.first!
    if ratio > 10 {
        errors.append(.contentError("Font size hierarchy too extreme"))
    }
}
```

### Accessibility Validation

#### WCAG Compliance
- **Color Contrast**: Minimum 3:1 ratio for large text, 4.5:1 for normal text
- **Touch Targets**: Minimum 44pt spacing for interactive elements
- **Font Sizes**: Minimum 12pt for readability
- **Color Independence**: Information not conveyed by color alone

#### Contrast Calculation
```swift
private func calculateContrastRatio(color1: String, color2: String) -> Double {
    let luminance1 = getLuminance(for: color1)
    let luminance2 = getLuminance(for: color2)
    
    let lighter = max(luminance1, luminance2)
    let darker = min(luminance1, luminance2)
    
    return (lighter + 0.05) / (darker + 0.05)
}
```

### Performance Validation

#### Optimization Checks
- **Color Count**: Warning if more than 50 colors
- **Font Variations**: Warning if more than 10 font sizes
- **Animation Duration**: Warning if longer than 2 seconds
- **Memory Usage**: Estimation based on theme complexity

#### Performance Scoring
```swift
private func calculatePerformanceScore(_ theme: ThemeSchema, warnings: [String]) -> Double {
    let totalChecks = 5.0
    let warningCount = Double(warnings.count)
    
    return max(0.0, (totalChecks - warningCount) / totalChecks * 100.0)
}
```

---

## 🎯 Usage Examples

### SwiftUI Usage

```swift
struct ThemeValidationView: View {
    @StateObject private var validator = ThemeValidator()
    @State private var validationResult: ThemeValidationResult?
    
    var body: some View {
        VStack {
            Button("Validate Theme") {
                Task {
                    let result = await validator.validateTheme(myTheme)
                    validationResult = result
                }
            }
            
            if let result = validationResult {
                ValidationResultView(result: result)
            }
        }
    }
}
```

### React Native Usage

```typescript
const ThemeValidationExample: React.FC = () => {
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    
    const handleValidation = async () => {
        const validator = new ThemeValidator();
        const result = await validator.validateTheme(theme);
        setValidationResult(result);
    };
    
    return (
        <View>
            <TouchableOpacity onPress={handleValidation}>
                <Text>Validate Theme</Text>
            </TouchableOpacity>
            
            {validationResult && (
                <ValidationResultView result={validationResult} />
            )}
        </View>
    );
};
```

---

## 📊 Validation Results

### Result Structure

```swift
struct ThemeValidationResult {
    let isValid: Bool                    // Overall validation status
    let errors: [ThemeValidationError]   // Critical issues
    let warnings: [String]               // Performance/usability warnings
    let accessibilityScore: Double       // 0-100 accessibility rating
    let performanceScore: Double         // 0-100 performance rating
}
```

### Score Interpretation

| Score Range | Rating | Description |
|-------------|--------|-------------|
| 90-100 | Excellent | Minimal issues, production ready |
| 80-89 | Good | Minor issues, recommended fixes |
| 70-79 | Fair | Some issues, needs attention |
| 60-69 | Poor | Multiple issues, significant work needed |
| 0-59 | Critical | Major issues, not recommended for production |

### Error Categories

#### Schema Errors
- Missing required properties
- Invalid data types
- Malformed values

#### Content Errors
- Semantic inconsistencies
- Logical conflicts
- Design violations

#### Accessibility Errors
- Insufficient color contrast
- Inaccessible touch targets
- Color-only information

#### Performance Warnings
- Too many colors/fonts
- Slow animations
- Memory concerns

---

## 🧪 Testing

### Unit Tests

```swift
class ThemeValidatorTests: XCTestCase {
    func testValidTheme() async {
        let validator = ThemeValidator()
        let result = await validator.validateTheme(validTheme)
        
        XCTAssertTrue(result.isValid)
        XCTAssertEqual(result.errors.count, 0)
        XCTAssertGreaterThan(result.accessibilityScore, 80)
    }
    
    func testInvalidTheme() async {
        let validator = ThemeValidator()
        let result = await validator.validateTheme(invalidTheme)
        
        XCTAssertFalse(result.isValid)
        XCTAssertGreaterThan(result.errors.count, 0)
    }
}
```

### Integration Tests

```swift
func testEndToEndValidation() async {
    // Test complete validation flow
    let theme = createTestTheme()
    let validator = ThemeValidator()
    
    let result = await validator.validateTheme(theme)
    
    // Verify all validation layers
    XCTAssertNotNil(result)
    XCTAssertTrue(result.errors.allSatisfy { $0 is ThemeValidationError })
    XCTAssertTrue(result.accessibilityScore >= 0 && result.accessibilityScore <= 100)
}
```

---

## 🔄 Integration

### With Theme Schema System

```swift
// Integrate with existing theme schema
extension ThemeSchema {
    func validate() async -> ThemeValidationResult {
        let validator = ThemeValidator()
        return await validator.validateTheme(self)
    }
}

// Usage
let theme = ThemeSchema(...)
let validation = await theme.validate()
```

### With Import/Export System

```swift
// Validate imported themes
func importTheme(from data: Data) async throws -> ThemeSchema {
    let theme = try JSONDecoder().decode(ThemeSchema.self, from: data)
    
    // Validate before accepting
    let validator = ThemeValidator()
    let result = await validator.validateTheme(theme)
    
    guard result.isValid else {
        throw ThemeImportError.validationFailed(result.errors)
    }
    
    return theme
}
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Async Validation**: All validation runs asynchronously to avoid blocking UI
2. **Caching**: Validation results cached for repeated checks
3. **Incremental Validation**: Only re-validate changed properties
4. **Background Processing**: Heavy validation runs on background threads

### Memory Management

```swift
// Efficient color pair generation
private func generateColorPairs(from colors: [String: String]) -> [(String, String)] {
    let colorArray = Array(colors.values)
    var pairs: [(String, String)] = []
    
    for i in 0..<colorArray.count {
        for j in (i+1)..<colorArray.count {
            pairs.append((colorArray[i], colorArray[j]))
        }
    }
    
    return pairs
}
```

---

## 🔧 Configuration

### Custom Validation Rules

```swift
struct ValidationConfig {
    let maxColors: Int = 50
    let maxFontSizes: Int = 10
    let minContrastRatio: Double = 3.0
    let maxAnimationDuration: Double = 2.0
    let minTouchTarget: Double = 44.0
}

class ThemeValidator {
    private let config: ValidationConfig
    
    init(config: ValidationConfig = ValidationConfig()) {
        self.config = config
    }
}
```

### Platform-Specific Rules

```swift
#if os(iOS)
let platformConfig = ValidationConfig(
    minTouchTarget: 44.0,
    maxAnimationDuration: 2.0
)
#elseif os(macOS)
let platformConfig = ValidationConfig(
    minTouchTarget: 32.0,
    maxAnimationDuration: 1.5
)
#endif
```

---

## 📈 Future Enhancements

### Planned Features

1. **Semantic Color Validation**: Check for semantic color relationships
2. **Design System Integration**: Validate against design system rules
3. **Gesture Support**: Validate gesture-based interactions
4. **Internationalization**: Support for RTL languages and cultural considerations
5. **Machine Learning**: AI-powered theme optimization suggestions

### Advanced Validation

```swift
// Future: Semantic validation
struct SemanticValidator {
    func validateColorSemantics(_ theme: ThemeSchema) -> [ValidationError] {
        // Check if error colors are semantically appropriate
        // Validate brand color consistency
        // Ensure cultural color appropriateness
    }
}
```

---

## 📚 Best Practices

### Validation Timing

1. **On Import**: Validate immediately when themes are imported
2. **On Save**: Validate before saving theme changes
3. **On Preview**: Validate when previewing themes
4. **On Export**: Validate before exporting themes

### Error Handling

```swift
// Graceful error handling
do {
    let result = await validator.validateTheme(theme)
    if !result.isValid {
        // Show errors in UI
        showValidationErrors(result.errors)
    }
} catch {
    // Handle validation system errors
    showSystemError(error)
}
```

### User Experience

1. **Progressive Validation**: Show errors as user types
2. **Contextual Help**: Provide guidance for fixing errors
3. **Auto-fix Suggestions**: Offer automatic corrections where possible
4. **Visual Feedback**: Clear indication of validation status

---

## 🔗 Related Documentation

- [Theme Schema System](./ThemeSchema_README.md)
- [Dynamic Color Schemes](./DynamicColorScheme_README.md)
- [Theme Import/Export](./ThemeSchemaImportExport_README.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📄 License

Copyright © 2025 Aether. All rights reserved.

This validation system is part of the Aether Design System and follows the same licensing terms as the main project. 