# WCAG AA Accessibility Validation System

> *Automated WCAG AA compliance checking with precise contrast ratio calculations and color blindness simulation*

---

## 🔍 Overview

The WCAG AA Accessibility Validation System provides comprehensive automated checking for Web Content Accessibility Guidelines (WCAG) AA conformance level. It ensures themes meet strict accessibility standards through precise contrast ratio calculations, color blindness simulation, and detailed compliance reporting.

### Key Features

- **WCAG AA Compliance**: Automated checking against WCAG AA standards
- **Precise Contrast Calculations**: Accurate luminance-based contrast ratio calculations
- **Color Blindness Simulation**: Real-time simulation of different color blindness types
- **Comprehensive Testing**: Text, UI components, and graphical elements validation
- **Detailed Reporting**: Visual contrast test results with pass/fail indicators
- **Cross-platform**: Consistent validation logic for both iOS and React Native

---

## 🎯 WCAG AA Requirements

### Contrast Ratio Standards

| Element Type | Required Ratio | Description |
|--------------|----------------|-------------|
| **Normal Text** | 4.5:1 | Standard text (16pt/21px or smaller) |
| **Large Text** | 3:1 | Large text (18pt/24px regular or 14pt/19px bold) |
| **UI Components** | 3:1 | Buttons, borders, and graphical elements |

### Accessibility Criteria

1. **Text-to-Background Contrast**: Minimum 4.5:1 for normal text
2. **Large Text Contrast**: Minimum 3:1 for large text
3. **UI Component Contrast**: Minimum 3:1 for interactive elements
4. **Color Independence**: Information not conveyed by color alone
5. **Touch Targets**: Minimum 44pt for interactive elements

---

## 🏗️ Architecture

### Validation Pipeline

```
Theme Schema
    ↓
Color Parsing (Hex, RGB, Named Colors)
    ↓
Luminance Calculation (sRGB to Linear RGB)
    ↓
Contrast Ratio Calculation
    ↓
WCAG AA Compliance Check
    ↓
Color Blindness Simulation
    ↓
Comprehensive Report
```

### Core Components

1. **AccessibilityValidator**: Main validation engine
2. **ColorUtilities**: Color parsing and luminance calculations
3. **ContrastTest**: Individual contrast test results
4. **ColorBlindnessSimulator**: Real-time color blindness simulation
5. **WCAGComplianceChecker**: Standards compliance validation

---

## 📱 Platform Implementations

### SwiftUI Implementation

```swift
// Core accessibility validator
class AccessibilityValidator: ObservableObject {
    func validateAccessibility(for theme: ThemeSchema) async -> AccessibilityValidationResult
}

// WCAG compliance levels
enum WCAGLevel: String, CaseIterable {
    case AA = "AA"
    case AAA = "AAA"
}

// Accessibility error types
enum AccessibilityError: LocalizedError, Identifiable {
    case insufficientContrast(foreground: String, background: String, contrastRatio: Double, requiredRatio: Double, elementType: String)
    case colorBlindnessIssue(color1: String, color2: String, issue: String)
    case insufficientTouchTarget(element: String, currentSize: Double, minimumSize: Double)
    case colorOnlyInformation(element: String, suggestion: String)
}

// Validation result
struct AccessibilityValidationResult {
    let isValid: Bool
    let errors: [AccessibilityError]
    let warnings: [String]
    let contrastTests: [ContrastTest]
    let accessibilityScore: Double
    let wcagLevel: WCAGLevel
}
```

### React Native Implementation

```typescript
// Core accessibility validator
export class AccessibilityValidator {
    async validateAccessibility(theme: ThemeSchema): Promise<AccessibilityValidationResult>
}

// WCAG compliance levels
export enum WCAGLevel {
    AA = 'AA',
    AAA = 'AAA'
}

// Accessibility error interface
export interface AccessibilityError {
    id: string;
    type: 'insufficientContrast' | 'colorBlindnessIssue' | 'insufficientTouchTarget' | 'colorOnlyInformation';
    message: string;
    foreground?: string;
    background?: string;
    contrastRatio?: number;
    requiredRatio?: number;
    elementType?: string;
}

// Validation result
export interface AccessibilityValidationResult {
    isValid: boolean;
    errors: AccessibilityError[];
    warnings: string[];
    contrastTests: ContrastTest[];
    accessibilityScore: number;
    wcagLevel: WCAGLevel;
    passedTests: number;
    failedTests: number;
    totalTests: number;
}
```

---

## 🔧 Technical Implementation

### Color Parsing

The system supports multiple color formats:

```swift
// Hex colors (#RRGGBB, #RRGGBBAA)
static func parseHexColor(_ hex: String) -> (red: Double, green: Double, blue: Double, alpha: Double)?

// Named colors
static func parseNamedColor(_ name: String) -> (red: Double, green: Double, blue: Double, alpha: Double)?

// RGBA colors
static func parseRGBAColor(_ rgba: String) -> (red: Double, green: Double, blue: Double, alpha: Double)?
```

### Luminance Calculation

Accurate luminance calculation following WCAG guidelines:

```swift
static func calculateLuminance(red: Double, green: Double, blue: Double) -> Double {
    // Convert sRGB to linear RGB
    let linearRed = red <= 0.03928 ? red / 12.92 : pow((red + 0.055) / 1.055, 2.4)
    let linearGreen = green <= 0.03928 ? green / 12.92 : pow((green + 0.055) / 1.055, 2.4)
    let linearBlue = blue <= 0.03928 ? blue / 12.92 : pow((blue + 0.055) / 1.055, 2.4)
    
    // Calculate relative luminance
    return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue
}
```

### Contrast Ratio Calculation

Precise contrast ratio calculation:

```swift
static func calculateContrastRatio(color1: String, color2: String) -> Double? {
    guard let luminance1 = calculateLuminance(for: color1),
          let luminance2 = calculateLuminance(for: color2) else {
        return nil
    }
    
    let lighter = max(luminance1, luminance2)
    let darker = min(luminance1, luminance2)
    
    return (lighter + 0.05) / (darker + 0.05)
}
```

---

## 🎨 Color Blindness Simulation

### Supported Types

1. **Protanopia**: Red-green color blindness (red appears darker)
2. **Deuteranopia**: Red-green color blindness (green appears darker)
3. **Tritanopia**: Blue-yellow color blindness

### Simulation Algorithm

```swift
static func simulateColorBlindness(color: String, type: ColorBlindnessType) -> String? {
    switch type {
    case .protanopia:
        // Red-green color blindness (red appears darker)
        let newRed = 0.567 * parsed.red + 0.433 * parsed.green
        let newGreen = 0.558 * parsed.red + 0.442 * parsed.green
        let newBlue = parsed.blue
        return rgbToString(red: newRed, green: newGreen, blue: newBlue)
        
    case .deuteranopia:
        // Red-green color blindness (green appears darker)
        let newRed = 0.625 * parsed.red + 0.375 * parsed.green
        let newGreen = 0.7 * parsed.red + 0.3 * parsed.green
        let newBlue = parsed.blue
        return rgbToString(red: newRed, green: newGreen, blue: newBlue)
        
    case .tritanopia:
        // Blue-yellow color blindness
        let newRed = 0.95 * parsed.red + 0.05 * parsed.blue
        let newGreen = 0.433 * parsed.green + 0.567 * parsed.blue
        let newBlue = 0.475 * parsed.green + 0.525 * parsed.blue
        return rgbToString(red: newRed, green: newGreen, blue: newBlue)
    }
}
```

---

## 📊 Validation Results

### Result Structure

```swift
struct AccessibilityValidationResult {
    let isValid: Bool                    // Overall WCAG compliance
    let errors: [AccessibilityError]     // Accessibility violations
    let warnings: [String]               // Performance/usability warnings
    let contrastTests: [ContrastTest]    // Individual contrast test results
    let accessibilityScore: Double       // 0-100 accessibility rating
    let wcagLevel: WCAGLevel            // WCAG compliance level
    let passedTests: Int                // Number of passed contrast tests
    let failedTests: Int                // Number of failed contrast tests
    let totalTests: Int                 // Total number of contrast tests
}
```

### Contrast Test Results

```swift
struct ContrastTest: Identifiable {
    let id = UUID()
    let foreground: String              // Foreground color
    let background: String              // Background color
    let contrastRatio: Double           // Calculated contrast ratio
    let requiredRatio: Double           // Required ratio for compliance
    let elementType: String             // Type of element being tested
    let passed: Bool                    // Whether test passed
    
    var status: String { passed ? "Pass" : "Fail" }
    var statusColor: Color { passed ? .green : .red }
}
```

### Score Interpretation

| Score Range | Rating | WCAG Status | Description |
|-------------|--------|-------------|-------------|
| 90-100 | Excellent | AA Compliant | Minimal issues, production ready |
| 80-89 | Good | AA Compliant | Minor issues, recommended fixes |
| 70-79 | Fair | AA Compliant | Some issues, needs attention |
| 60-69 | Poor | Non-Compliant | Multiple issues, significant work needed |
| 0-59 | Critical | Non-Compliant | Major issues, not recommended for production |

---

## 🎯 Usage Examples

### SwiftUI Usage

```swift
struct AccessibilityValidationView: View {
    @StateObject private var validator = AccessibilityValidator()
    @State private var selectedWCAGLevel: WCAGLevel = .AA
    @State private var validationResult: AccessibilityValidationResult?
    
    var body: some View {
        VStack {
            // WCAG Level Selection
            Picker("WCAG Level", selection: $selectedWCAGLevel) {
                ForEach(WCAGLevel.allCases, id: \.self) { level in
                    Text("WCAG \(level.rawValue)").tag(level)
                }
            }
            .pickerStyle(SegmentedPickerStyle())
            
            // Validation Button
            Button("Validate WCAG Compliance") {
                Task {
                    let result = await validator.validateAccessibility(for: theme)
                    validationResult = result
                }
            }
            
            // Results Display
            if let result = validationResult {
                AccessibilityResultView(result: result)
            }
        }
    }
}
```

### React Native Usage

```typescript
const AccessibilityValidationExample: React.FC = () => {
    const [selectedWCAGLevel, setSelectedWCAGLevel] = useState<WCAGLevel>(WCAGLevel.AA);
    const [validationResult, setValidationResult] = useState<AccessibilityValidationResult | null>(null);
    
    const handleValidation = async () => {
        const validator = new AccessibilityValidator(selectedWCAGLevel);
        const result = await validator.validateAccessibility(theme);
        setValidationResult(result);
    };
    
    return (
        <View>
            {/* WCAG Level Selection */}
            <View style={styles.levelSelector}>
                {Object.values(WCAGLevel).map(level => (
                    <TouchableOpacity
                        key={level}
                        style={[styles.levelButton, selectedWCAGLevel === level && styles.active]}
                        onPress={() => setSelectedWCAGLevel(level)}
                    >
                        <Text>WCAG {level}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* Validation Button */}
            <TouchableOpacity onPress={handleValidation}>
                <Text>Validate WCAG Compliance</Text>
            </TouchableOpacity>
            
            {/* Results Display */}
            {validationResult && (
                <AccessibilityResultView result={validationResult} />
            )}
        </View>
    );
};
```

---

## 🔍 Validation Categories

### Text Contrast Validation

1. **Normal Text**: 4.5:1 contrast ratio required
2. **Large Text**: 3:1 contrast ratio required
3. **Secondary Text**: 4.5:1 contrast ratio required

### UI Component Validation

1. **Primary Buttons**: 3:1 contrast ratio required
2. **Borders**: 3:1 contrast ratio required
3. **Error States**: 3:1 contrast ratio required
4. **Success States**: 3:1 contrast ratio required
5. **Warning States**: 3:1 contrast ratio required

### Color Blindness Validation

1. **Protanopia Simulation**: Red-green color blindness
2. **Deuteranopia Simulation**: Red-green color blindness
3. **Tritanopia Simulation**: Blue-yellow color blindness
4. **Contrast Threshold**: 2:1 minimum for color blindness compatibility

### Touch Target Validation

1. **Minimum Size**: 44pt for interactive elements
2. **Spacing Validation**: All spacing values checked
3. **Accessibility Compliance**: iOS Human Interface Guidelines

---

## 🧪 Testing

### Unit Tests

```swift
class AccessibilityValidatorTests: XCTestCase {
    func testWCAGCompliantTheme() async {
        let validator = AccessibilityValidator(wcagLevel: .AA)
        let result = await validator.validateAccessibility(for: wcagCompliantTheme)
        
        XCTAssertTrue(result.isValid)
        XCTAssertEqual(result.errors.count, 0)
        XCTAssertGreaterThan(result.accessibilityScore, 90)
    }
    
    func testNonCompliantTheme() async {
        let validator = AccessibilityValidator(wcagLevel: .AA)
        let result = await validator.validateAccessibility(for: nonCompliantTheme)
        
        XCTAssertFalse(result.isValid)
        XCTAssertGreaterThan(result.errors.count, 0)
        XCTAssertLessThan(result.accessibilityScore, 70)
    }
    
    func testContrastRatioCalculation() {
        let ratio = ColorUtilities.calculateContrastRatio(color1: "#000000", color2: "#FFFFFF")
        XCTAssertEqual(ratio, 21.0, accuracy: 0.1)
    }
}
```

### Integration Tests

```swift
func testEndToEndAccessibilityValidation() async {
    // Test complete accessibility validation flow
    let theme = createTestTheme()
    let validator = AccessibilityValidator(wcagLevel: .AA)
    
    let result = await validator.validateAccessibility(for: theme)
    
    // Verify all validation components
    XCTAssertNotNil(result)
    XCTAssertTrue(result.contrastTests.count > 0)
    XCTAssertTrue(result.accessibilityScore >= 0 && result.accessibilityScore <= 100)
    XCTAssertTrue(result.passedTests + result.failedTests == result.totalTests)
}
```

---

## 🔄 Integration

### With Theme Validation System

```swift
// Integrate with existing theme validation
extension ThemeValidator {
    func validateThemeWithAccessibility(_ theme: ThemeSchema) async -> ThemeValidationResult {
        // Standard validation
        let standardResult = await validateTheme(theme)
        
        // Accessibility validation
        let accessibilityValidator = AccessibilityValidator()
        let accessibilityResult = await accessibilityValidator.validateAccessibility(for: theme)
        
        // Combine results
        let combinedErrors = standardResult.errors + accessibilityResult.errors.map { 
            ThemeValidationError.accessibilityError($0.errorDescription ?? "Accessibility error")
        }
        
        return ThemeValidationResult(
            isValid: standardResult.isValid && accessibilityResult.isValid,
            errors: combinedErrors,
            warnings: standardResult.warnings + accessibilityResult.warnings,
            accessibilityScore: accessibilityResult.accessibilityScore,
            performanceScore: standardResult.performanceScore
        )
    }
}
```

### With Import/Export System

```swift
// Validate imported themes for accessibility
func importThemeWithAccessibilityCheck(from data: Data) async throws -> ThemeSchema {
    let theme = try JSONDecoder().decode(ThemeSchema.self, from: data)
    
    // Accessibility validation
    let accessibilityValidator = AccessibilityValidator()
    let accessibilityResult = await accessibilityValidator.validateAccessibility(for: theme)
    
    guard accessibilityResult.isValid else {
        throw ThemeImportError.accessibilityNonCompliant(accessibilityResult.errors)
    }
    
    return theme
}
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Async Processing**: All validation runs asynchronously
2. **Caching**: Color parsing and luminance calculations cached
3. **Batch Processing**: Multiple contrast tests processed together
4. **Background Threading**: Heavy calculations on background threads

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

### WCAG Level Configuration

```swift
struct WCAGConfiguration {
    let level: WCAGLevel
    let normalTextContrast: Double
    let largeTextContrast: Double
    let uiComponentContrast: Double
    
    init(level: WCAGLevel) {
        self.level = level
        switch level {
        case .AA:
            self.normalTextContrast = 4.5
            self.largeTextContrast = 3.0
            self.uiComponentContrast = 3.0
        case .AAA:
            self.normalTextContrast = 7.0
            self.largeTextContrast = 4.5
            self.uiComponentContrast = 4.5
        }
    }
}
```

### Platform-Specific Rules

```swift
#if os(iOS)
let platformConfig = WCAGConfiguration(level: .AA)
#elseif os(macOS)
let platformConfig = WCAGConfiguration(level: .AAA)
#endif
```

---

## 📈 Future Enhancements

### Planned Features

1. **WCAG AAA Support**: Full AAA compliance checking
2. **Dynamic Contrast**: Real-time contrast adjustment suggestions
3. **Semantic Validation**: Meaning-based color relationship checking
4. **Internationalization**: Cultural color appropriateness validation
5. **Machine Learning**: AI-powered accessibility optimization

### Advanced Validation

```swift
// Future: Semantic accessibility validation
struct SemanticAccessibilityValidator {
    func validateColorSemantics(_ theme: ThemeSchema) -> [AccessibilityError] {
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
// Graceful accessibility error handling
do {
    let result = await validator.validateAccessibility(for: theme)
    if !result.isValid {
        // Show accessibility errors in UI
        showAccessibilityErrors(result.errors)
    }
} catch {
    // Handle validation system errors
    showSystemError(error)
}
```

### User Experience

1. **Progressive Validation**: Show errors as user modifies colors
2. **Contextual Help**: Provide guidance for fixing accessibility issues
3. **Auto-fix Suggestions**: Offer automatic contrast adjustments
4. **Visual Feedback**: Clear indication of WCAG compliance status

---

## 🔗 Related Documentation

- [Theme Validation System](./ThemeValidation_README.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)
- [Accessibility Guidelines](https://developer.apple.com/design/human-interface-guidelines/accessibility)

---

## 📄 License

Copyright © 2025 Aether. All rights reserved.

This accessibility validation system is part of the Aether Design System and follows the same licensing terms as the main project. 