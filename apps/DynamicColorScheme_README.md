# Dynamic Color Scheme Support

> *Modern iOS and React Native applications that automatically adapt to system appearance changes including light, dark, and high contrast modes.*

---

## 🎯 Overview

This implementation provides comprehensive dynamic color scheme support that goes beyond static hex values. Instead of defining colors as static values, themes specify color sets for different appearances, enabling automatic adaptation to system-wide appearance preferences.

### Key Features

- **Dynamic Color Objects**: Color definitions with light, dark, and high contrast variants
- **Automatic System Adaptation**: Seamless switching between light and dark modes
- **High Contrast Support**: Enhanced accessibility with high contrast variants
- **Automatic High Contrast Generation**: Smart algorithms to create high contrast variants
- **Real-time Appearance Detection**: Instant response to system appearance changes
- **Cross-Platform Consistency**: Unified approach for iOS and React Native
- **JSON-Based Configuration**: Flexible theme definition and import/export

---

## 🏗️ Architecture

### Core Components

#### 1. Dynamic Color Structure
The foundation of the system - a color object that contains variants for different appearances:

```swift
// SwiftUI
struct DynamicColor: Codable, Equatable {
    let light: String
    let dark: String
    let highContrastLight: String?
    let highContrastDark: String?
}
```

```typescript
// React Native
export interface DynamicColor {
  light: string;
  dark: string;
  highContrastLight?: string;
  highContrastDark?: string;
}
```

#### 2. Dynamic Theme Manager
Manages theme state and appearance adaptation:

```swift
// SwiftUI
class DynamicThemeManager: ObservableObject {
    @Published var currentTheme: DynamicTheme
    @Published var availableThemes: [DynamicTheme]
    @Published var isHighContrastEnabled: Bool
}
```

```typescript
// React Native
export interface DynamicThemeContextType {
  currentTheme: DynamicTheme;
  availableThemes: DynamicTheme[];
  colorScheme: ColorSchemeName;
  isHighContrastEnabled: boolean;
  setTheme: (theme: DynamicTheme) => void;
  getColor: (colorKey: DynamicColorKey) => string;
}
```

#### 3. Color Key Enumeration
Standardized color keys for consistent theming:

```swift
// SwiftUI
enum DynamicColorKey: String, CaseIterable {
    case primary = "primaryColor"
    case secondary = "secondaryColor"
    case accent = "accentColor"
    case background = "backgroundColor"
    case surface = "surfaceColor"
    case textPrimary = "textPrimaryColor"
    case textSecondary = "textSecondaryColor"
    case border = "borderColor"
    case shadow = "shadowColor"
    case success = "successColor"
    case warning = "warningColor"
    case error = "errorColor"
    case info = "infoColor"
}
```

---

## 🎨 JSON Structure

### Dynamic Color Definition

```json
{
  "primaryColor": {
    "light": "#0A7AFF",
    "dark": "#0A84FF",
    "highContrastLight": "#0040DD",
    "highContrastDark": "#409CFF"
  }
}
```

### Complete Theme Example

```json
{
  "id": "modern-blue",
  "name": "Modern Blue",
  "description": "A modern blue theme with excellent contrast",
  "version": "1.0.0",
  "primaryColor": {
    "light": "#0A7AFF",
    "dark": "#0A84FF",
    "highContrastLight": "#0040DD",
    "highContrastDark": "#409CFF"
  },
  "secondaryColor": {
    "light": "#5856D6",
    "dark": "#5E5CE6",
    "highContrastLight": "#3A3A9E",
    "highContrastDark": "#7A7AFF"
  },
  "backgroundColor": {
    "light": "#FFFFFF",
    "dark": "#000000",
    "highContrastLight": "#FFFFFF",
    "highContrastDark": "#000000"
  },
  "textPrimaryColor": {
    "light": "#000000",
    "dark": "#FFFFFF",
    "highContrastLight": "#000000",
    "highContrastDark": "#FFFFFF"
  }
}
```

---

## 🚀 Implementation Examples

### SwiftUI Implementation

#### Basic Usage

```swift
struct ContentView: View {
    @StateObject private var dynamicThemeManager = DynamicThemeManager()
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        VStack {
            Text("Hello, World!")
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                .background(dynamicThemeManager.color(for: .background))
        }
        .environmentObject(dynamicThemeManager)
    }
}
```

#### Dynamic Color Creation

```swift
// Manual creation
let primaryColor = DynamicColor(
    light: "#0A7AFF",
    dark: "#0A84FF",
    highContrastLight: "#0040DD",
    highContrastDark: "#409CFF"
)

// Automatic high contrast generation
let secondaryColor = DynamicColor.withAutoHighContrast(
    light: "#5856D6",
    dark: "#5E5CE6",
    highContrastMultiplier: 1.3
)
```

#### UIColor Integration

```swift
extension DynamicColor {
    func toUIColor() -> UIColor {
        return UIColor { traitCollection in
            switch traitCollection.userInterfaceStyle {
            case .dark:
                if traitCollection.accessibilityContrast == .high && highContrastDark != nil {
                    return UIColor(hex: highContrastDark!)
                }
                return UIColor(hex: dark)
            case .light, .unspecified:
                if traitCollection.accessibilityContrast == .high && highContrastLight != nil {
                    return UIColor(hex: highContrastLight!)
                }
                return UIColor(hex: light)
            @unknown default:
                return UIColor(hex: light)
            }
        }
    }
}
```

### React Native Implementation

#### Basic Usage

```typescript
const MyComponent: React.FC = () => {
  const { getColor, colorScheme, isHighContrastEnabled } = useDynamicTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: getColor(DynamicColorKey.BACKGROUND) }]}>
      <Text style={[styles.text, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Hello, World!
      </Text>
    </View>
  );
};
```

#### Dynamic Color Creation

```typescript
// Manual creation
const primaryColor: DynamicColor = {
  light: '#0A7AFF',
  dark: '#0A84FF',
  highContrastLight: '#0040DD',
  highContrastDark: '#409CFF',
};

// Automatic high contrast generation
const secondaryColor = createDynamicColor('#5856D6', '#5E5CE6', 1.3);
```

#### Provider Setup

```typescript
const App: React.FC = () => {
  return (
    <DynamicThemeProvider initialThemeId="modern-blue">
      <MyApp />
    </DynamicThemeProvider>
  );
};
```

---

## 🔧 Advanced Features

### Automatic High Contrast Generation

Both platforms include intelligent algorithms to automatically generate high contrast variants:

```swift
// SwiftUI
extension UIColor {
    func adjustedForHighContrast(multiplier: Double = 1.3) -> UIColor {
        var hue: CGFloat = 0
        var saturation: CGFloat = 0
        var brightness: CGFloat = 0
        var alpha: CGFloat = 0
        
        getHue(&hue, saturation: &saturation, brightness: &brightness, alpha: &alpha)
        
        // Increase contrast by adjusting brightness and saturation
        let newBrightness = min(brightness * CGFloat(multiplier), 1.0)
        let newSaturation = min(saturation * CGFloat(multiplier), 1.0)
        
        return UIColor(hue: hue, saturation: newSaturation, brightness: newBrightness, alpha: alpha)
    }
}
```

```typescript
// React Native
const adjustForHighContrast = (hex: string, multiplier: number = 1.3): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Convert to HSL for better contrast adjustment
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Adjust lightness for high contrast
  l = Math.min(l * multiplier, 1);

  // Convert back to RGB and return hex
  return hslToHex(h, s, l);
};
```

### Real-time Appearance Detection

#### SwiftUI

```swift
class DynamicThemeManager: ObservableObject {
    @Published var isHighContrastEnabled = false
    
    init() {
        // Check initial high contrast setting
        self.isHighContrastEnabled = UIAccessibility.isDarkerSystemColorsEnabled
        
        // Listen for accessibility changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(accessibilitySettingsChanged),
            name: UIAccessibility.darkerSystemColorsStatusDidChangeNotification,
            object: nil
        )
    }
    
    @objc private func accessibilitySettingsChanged() {
        DispatchQueue.main.async {
            self.isHighContrastEnabled = UIAccessibility.isDarkerSystemColorsEnabled
        }
    }
}
```

#### React Native

```typescript
export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  children,
  initialThemeId,
}) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState<boolean>(false);

  // Listen for color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Listen for accessibility changes
  useEffect(() => {
    const checkHighContrast = async () => {
      if (Platform.OS === 'ios') {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setIsHighContrastEnabled(isEnabled);
      }
    };

    checkHighContrast();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsHighContrastEnabled
    );

    return () => subscription?.remove();
  }, []);

  // ... rest of provider implementation
};
```

### Theme Import/Export

#### SwiftUI

```swift
class DynamicThemeManager: ObservableObject {
    func exportTheme(_ theme: DynamicTheme) -> String? {
        guard let data = try? JSONEncoder().encode(theme) else { return nil }
        return String(data: data, encoding: .utf8)
    }
    
    func importTheme(from json: String) -> DynamicTheme? {
        guard let data = json.data(using: .utf8),
              let theme = try? JSONDecoder().decode(DynamicTheme.self, from: data) else {
            return nil
        }
        return theme
    }
}
```

#### React Native

```typescript
export const DynamicThemeProvider: React.FC<DynamicThemeProviderProps> = ({
  children,
  initialThemeId,
}) => {
  const exportTheme = (theme: DynamicTheme): string | null => {
    try {
      return JSON.stringify(theme, null, 2);
    } catch (error) {
      console.error('Failed to export theme:', error);
      return null;
    }
  };

  const importTheme = (json: string): DynamicTheme | null => {
    try {
      const theme = JSON.parse(json) as DynamicTheme;
      // Validate theme structure
      if (theme.id && theme.name && theme.primaryColor) {
        return theme;
      }
      return null;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  };

  // ... rest of provider implementation
};
```

---

## 🎨 Default Themes

### Modern Blue Theme

```json
{
  "id": "modern-blue",
  "name": "Modern Blue",
  "description": "A modern blue theme with excellent contrast",
  "version": "1.0.0",
  "primaryColor": {
    "light": "#0A7AFF",
    "dark": "#0A84FF"
  },
  "secondaryColor": {
    "light": "#5856D6",
    "dark": "#5E5CE6"
  },
  "accentColor": {
    "light": "#FF2D92",
    "dark": "#FF375F"
  }
}
```

### Sunset Theme

```json
{
  "id": "sunset",
  "name": "Sunset",
  "description": "Warm sunset colors with orange and purple",
  "version": "1.0.0",
  "primaryColor": {
    "light": "#FF6B35",
    "dark": "#FF7F50"
  },
  "secondaryColor": {
    "light": "#8B5CF6",
    "dark": "#A78BFA"
  },
  "accentColor": {
    "light": "#F59E0B",
    "dark": "#FBBF24"
  }
}
```

### Ocean Theme

```json
{
  "id": "ocean",
  "name": "Ocean",
  "description": "Deep ocean blues and teals",
  "version": "1.0.0",
  "primaryColor": {
    "light": "#0EA5E9",
    "dark": "#38BDF8"
  },
  "secondaryColor": {
    "light": "#14B8A6",
    "dark": "#2DD4BF"
  },
  "accentColor": {
    "light": "#8B5CF6",
    "dark": "#A78BFA"
  }
}
```

---

## 🔧 Configuration Options

### High Contrast Multiplier

```swift
// SwiftUI - Custom high contrast multiplier
let customColor = DynamicColor.withAutoHighContrast(
    light: "#0A7AFF",
    dark: "#0A84FF",
    highContrastMultiplier: 1.5 // More aggressive contrast
)
```

```typescript
// React Native - Custom high contrast multiplier
const customColor = createDynamicColor('#0A7AFF', '#0A84FF', 1.5);
```

### Manual High Contrast Variants

```swift
// SwiftUI - Manual high contrast variants
let manualColor = DynamicColor(
    light: "#0A7AFF",
    dark: "#0A84FF",
    highContrastLight: "#0040DD", // Custom high contrast light
    highContrastDark: "#409CFF"   // Custom high contrast dark
)
```

```typescript
// React Native - Manual high contrast variants
const manualColor: DynamicColor = {
  light: '#0A7AFF',
  dark: '#0A84FF',
  highContrastLight: '#0040DD', // Custom high contrast light
  highContrastDark: '#409CFF',  // Custom high contrast dark
};
```

### Theme Validation

```swift
// SwiftUI - Validate dynamic color
extension DynamicColor {
    func isValid() -> Bool {
        return UIColor(hex: light) != nil && UIColor(hex: dark) != nil
    }
}

// SwiftUI - Validate theme
extension DynamicTheme {
    func isValid() -> Bool {
        let requiredColors: [DynamicColor] = [
            primaryColor, backgroundColor, textPrimaryColor
        ]
        return requiredColors.allSatisfy { $0.isValid() }
    }
}
```

```typescript
// React Native - Validate dynamic color
export const DynamicColorUtils = {
  isValid: (dynamicColor: DynamicColor): boolean => {
    return !!(dynamicColor.light && dynamicColor.dark);
  },
};

// React Native - Validate theme
export const DynamicThemeUtils = {
  isValid: (theme: DynamicTheme): boolean => {
    const requiredKeys: DynamicColorKey[] = [
      DynamicColorKey.PRIMARY,
      DynamicColorKey.BACKGROUND,
      DynamicColorKey.TEXT_PRIMARY,
    ];

    return requiredKeys.every(key => {
      const color = DynamicThemeUtils.getColor(theme, key);
      return DynamicColorUtils.isValid(color);
    });
  },
};
```

---

## 🧪 Testing Strategies

### Unit Testing

#### SwiftUI

```swift
class DynamicColorSchemeTests: XCTestCase {
    func testDynamicColorCreation() {
        let color = DynamicColor.withAutoHighContrast(
            light: "#0A7AFF",
            dark: "#0A84FF"
        )
        
        XCTAssertEqual(color.light, "#0A7AFF")
        XCTAssertEqual(color.dark, "#0A84FF")
        XCTAssertNotNil(color.highContrastLight)
        XCTAssertNotNil(color.highContrastDark)
    }
    
    func testColorValidation() {
        let validColor = DynamicColor(light: "#0A7AFF", dark: "#0A84FF")
        XCTAssertTrue(validColor.isValid())
        
        let invalidColor = DynamicColor(light: "invalid", dark: "#0A84FF")
        XCTAssertFalse(invalidColor.isValid())
    }
    
    func testThemeManager() {
        let manager = DynamicThemeManager()
        let theme = manager.availableThemes.first!
        
        XCTAssertNotNil(manager.exportTheme(theme))
        
        let jsonString = manager.exportTheme(theme)!
        let importedTheme = manager.importTheme(from: jsonString)
        XCTAssertNotNil(importedTheme)
        XCTAssertEqual(importedTheme?.id, theme.id)
    }
}
```

#### React Native

```typescript
describe('DynamicColorScheme', () => {
  it('should create dynamic color with auto high contrast', () => {
    const color = createDynamicColor('#0A7AFF', '#0A84FF');
    
    expect(color.light).toBe('#0A7AFF');
    expect(color.dark).toBe('#0A84FF');
    expect(color.highContrastLight).toBeDefined();
    expect(color.highContrastDark).toBeDefined();
  });

  it('should validate dynamic color', () => {
    const validColor: DynamicColor = {
      light: '#0A7AFF',
      dark: '#0A84FF',
    };
    expect(DynamicColorUtils.isValid(validColor)).toBe(true);

    const invalidColor: DynamicColor = {
      light: 'invalid',
      dark: '#0A84FF',
    };
    expect(DynamicColorUtils.isValid(invalidColor)).toBe(false);
  });

  it('should export and import theme', () => {
    const theme = DEFAULT_DYNAMIC_THEMES[0];
    const jsonString = JSON.stringify(theme);
    
    expect(jsonString).toContain(theme.id);
    expect(jsonString).toContain(theme.name);
    
    const importedTheme = JSON.parse(jsonString) as DynamicTheme;
    expect(importedTheme.id).toBe(theme.id);
  });
});
```

### Integration Testing

#### Appearance Change Testing

```swift
// SwiftUI - Test appearance changes
func testAppearanceChanges() {
    let manager = DynamicThemeManager()
    let color = manager.getDynamicColor(for: .primary)
    
    // Test light mode
    let lightColor = color.color(for: .light, isHighContrast: false)
    XCTAssertEqual(lightColor, Color(hex: color.light))
    
    // Test dark mode
    let darkColor = color.color(for: .dark, isHighContrast: false)
    XCTAssertEqual(darkColor, Color(hex: color.dark))
    
    // Test high contrast
    if let highContrastLight = color.highContrastLight {
        let highContrastColor = color.color(for: .light, isHighContrast: true)
        XCTAssertEqual(highContrastColor, Color(hex: highContrastLight))
    }
}
```

```typescript
// React Native - Test appearance changes
it('should adapt to appearance changes', () => {
  const { getColor } = useDynamicTheme();
  
  // Mock different appearance states
  const lightColor = DynamicColorUtils.getColorForAppearance(
    testDynamicColor,
    'light',
    false
  );
  expect(lightColor).toBe(testDynamicColor.light);
  
  const darkColor = DynamicColorUtils.getColorForAppearance(
    testDynamicColor,
    'dark',
    false
  );
  expect(darkColor).toBe(testDynamicColor.dark);
  
  const highContrastColor = DynamicColorUtils.getColorForAppearance(
    testDynamicColor,
    'light',
    true
  );
  expect(highContrastColor).toBe(testDynamicColor.highContrastLight);
});
```

---

## 📱 Platform-Specific Considerations

### SwiftUI Specifics

**Advantages:**
- Native `UIColor(dynamicProvider:)` integration
- Automatic trait collection updates
- Built-in accessibility support
- Declarative syntax for color usage

**Best Practices:**
- Use `@Environment(\.colorScheme)` for current appearance
- Leverage `UIColor(dynamicProvider:)` for UIKit integration
- Respect `accessibilityReduceMotion` environment value
- Use `withAnimation` for smooth appearance transitions

### React Native Specifics

**Advantages:**
- Cross-platform consistency
- Flexible appearance detection
- Rich accessibility APIs
- Easy theme switching

**Best Practices:**
- Use `Appearance.addChangeListener` for appearance changes
- Handle platform-specific accessibility differences
- Use `AccessibilityInfo` for high contrast detection
- Implement proper cleanup for event listeners

### Performance Comparison

| Platform | Appearance Detection | High Contrast Detection | Memory Usage | Performance |
|----------|---------------------|------------------------|--------------|-------------|
| **SwiftUI** | Native | Native | Low | Excellent |
| **React Native** | JavaScript Bridge | JavaScript Bridge | Medium | Good |

---

## 🔮 Future Enhancements

### Planned Features

1. **Semantic Color Support**: Colors that adapt based on semantic meaning
2. **Custom Appearance Modes**: Support for custom appearance modes beyond light/dark
3. **Color Palette Generation**: Automatic generation of complementary colors
4. **Accessibility Compliance**: WCAG 2.1 AA compliance validation
5. **Animation Integration**: Smooth transitions between appearance modes

### Advanced Color Features

```swift
// Future: Semantic color support
struct SemanticColor {
    let primary: DynamicColor
    let secondary: DynamicColor
    let accent: DynamicColor
    let semantic: [String: DynamicColor] // Custom semantic colors
}

// Future: Custom appearance modes
enum AppearanceMode: String, CaseIterable {
    case light = "light"
    case dark = "dark"
    case sepia = "sepia"
    case highContrast = "highContrast"
}
```

```typescript
// Future: Semantic color support
interface SemanticColor {
  primary: DynamicColor;
  secondary: DynamicColor;
  accent: DynamicColor;
  semantic: Record<string, DynamicColor>; // Custom semantic colors
}

// Future: Custom appearance modes
enum AppearanceMode {
  LIGHT = 'light',
  DARK = 'dark',
  SEPIA = 'sepia',
  HIGH_CONTRAST = 'highContrast',
}
```

### Integration with Design Systems

```swift
// Future: Design system integration
struct DesignSystemColors {
    let brand: DynamicColor
    let neutral: DynamicColor
    let feedback: DynamicColor
    let semantic: [String: DynamicColor]
}

// Usage in design system
let designSystem = DesignSystemColors(
    brand: DynamicColor.withAutoHighContrast("#0A7AFF", "#0A84FF"),
    neutral: DynamicColor.withAutoHighContrast("#8E8E93", "#8E8E93"),
    feedback: DynamicColor.withAutoHighContrast("#34C759", "#30D158")
)
```

---

## 📚 Additional Resources

### Documentation
- [Human Interface Guidelines - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- [React Native Appearance API](https://reactnative.dev/docs/appearance)
- [WCAG 2.1 Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Related Libraries
- [React Native Appearance](https://github.com/expo/react-native-appearance)
- [React Native Dynamic Colors](https://github.com/iyegoroff/react-native-dynamic-colors)
- [SwiftUI Color Extensions](https://github.com/onevcat/Kingfisher)

### Performance Tools
- [SwiftUI Instruments](https://developer.apple.com/documentation/xcode/analyzing-performance-with-instruments)
- [React Native Performance Monitor](https://reactnative.dev/docs/performance)

---

## 🤝 Contributing

When contributing to the dynamic color scheme system:

1. **Follow Platform Guidelines**: Ensure colors meet platform-specific requirements
2. **Test Accessibility**: Verify high contrast variants meet WCAG guidelines
3. **Validate Colors**: Ensure all color values are valid hex strings
4. **Document Changes**: Update this README with new features and examples
5. **Cross-Platform Testing**: Test on both iOS and Android for React Native

---

## 📄 License

This implementation is part of the Aether Design System and follows the same licensing terms as the parent project.

---

*Built with ❤️ for creating accessible, adaptive, and beautiful user experiences.* 