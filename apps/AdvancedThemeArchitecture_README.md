# Advanced Theming Architecture: Inheritance and Composition

> *A comprehensive theming system that implements the Composite design pattern to enable inheritance and composition for maximum reusability and maintainability.*

---

## 🎯 Overview

The Advanced Theming Architecture provides a powerful, flexible system for creating and managing themes across both SwiftUI and React Native platforms. By implementing the **Composite design pattern**, this architecture enables:

- **Component-Based Architecture**: Themes are composed of smaller, reusable components
- **Inheritance**: Child themes can inherit properties from parent themes
- **Composition**: Multiple components can be combined to create complex themes
- **Type Safety**: Strongly typed theme keys and values
- **Extensibility**: Easy to add new component types and theme properties

## 🏗️ Architecture Principles

### 1. Component-Based Design

Instead of treating themes as monolithic objects, this architecture breaks them down into smaller, focused components:

```swift
// Swift Example
protocol ThemeComponent: AnyObject {
    func value(for key: ThemeKey) -> Any?
    func availableKeys() -> [ThemeKey]
    func merge(with other: ThemeComponent) -> ThemeComponent
}
```

```typescript
// React Native Example
interface ThemeComponent {
  getValue(key: ThemeKey): any;
  getAvailableKeys(): ThemeKey[];
  merge(other: ThemeComponent): ThemeComponent;
}
```

### 2. Composite Pattern Implementation

The `CompositeTheme` class acts as the composite object that can hold multiple components and support inheritance:

```swift
class CompositeTheme: ThemeComponent {
    private var components: [ThemeComponent] = []
    private weak var parentTheme: CompositeTheme?
  
    func value(for key: ThemeKey) -> Any? {
        // First check own components
        for component in components {
            if let value = component.value(for: key) {
                return value
            }
        }
        // Then delegate to parent (inheritance)
        return parentTheme?.value(for: key)
    }
}
```

### 3. Type-Safe Theme Keys

All theme properties are accessed through strongly-typed keys:

```swift
enum ThemeKey: String, CaseIterable {
    case primaryColor = "primaryColor"
    case secondaryColor = "secondaryColor"
    case fontSize = "fontSize"
    case spacing = "spacing"
    // ... more keys
}
```

## 📦 Component Types

### 1. ColorPaletteComponent

Manages color values with support for light/dark mode:

```swift
let colors = ColorPaletteComponent(colors: [
    .primaryColor: .blue,
    .secondaryColor: .orange,
    .backgroundColor: .white,
    .textColor: .black
])
```

### 2. TypographyComponent

Handles font families, sizes, weights, and text styling:

```swift
let typography = TypographyComponent(typography: [
    .primaryFont: "SF Pro Display",
    .bodyFont: "SF Pro Text",
    .fontSize: 16.0,
    .fontWeight: "Regular"
])
```

### 3. LayoutMetricsComponent

Manages spacing, padding, margins, and layout values:

```swift
let layout = LayoutMetricsComponent(metrics: [
    .spacing: 8.0,
    .padding: 16.0,
    .borderRadius: 8.0
])
```

### 4. ShadowComponent

Controls shadow configurations and depth effects:

```swift
let shadows = ShadowComponent(shadows: [
    .shadowRadius: 4.0,
    .shadowOffset: CGSize(width: 0, height: 2),
    .shadowOpacity: 0.1
])
```

### 5. AnimationComponent

Manages animation durations, easing, and spring configurations:

```swift
let animations = AnimationComponent(animations: [
    .animationDuration: 0.3,
    .animationEasing: "easeInOut",
    .springResponse: 0.5
])
```

### 6. AccessibilityComponent

Handles accessibility settings and preferences:

```swift
let accessibility = AccessibilityComponent(accessibility: [
    .highContrast: true,
    .reducedMotion: false,
    .dynamicType: true
])
```

## 🔄 Inheritance System

### Creating Child Themes

Child themes inherit all properties from their parent while allowing selective overrides:

```swift
// Create a base theme
let baseTheme = ThemeFactory.createDefaultLightTheme()

// Create a child theme that inherits from base
let darkTheme = baseTheme.createChildTheme(components: [
    ColorPaletteComponent(colors: [
        .backgroundColor: .black,
        .textColor: .white
    ])
])
```

### Inheritance Chain Resolution

The system automatically resolves values through the inheritance chain:

```swift
// Resolves value with full inheritance chain
let value = theme.resolveValue(for: .primaryColor)
// 1. Check current theme components
// 2. Check parent theme components
// 3. Check grandparent theme components
// 4. Return nil if not found
```

## 🧩 Composition System

### Building Themes from Components

Themes can be constructed by combining multiple components:

```swift
let corporateTheme = CompositeTheme(components: [
    ColorPaletteComponent(colors: [
        .primaryColor: Color(red: 0.1, green: 0.2, blue: 0.4),
        .secondaryColor: Color(red: 0.8, green: 0.8, blue: 0.8)
    ]),
    TypographyComponent(typography: [
        .primaryFont: "Helvetica Neue",
        .fontSize: 14.0
    ]),
    LayoutMetricsComponent(metrics: [
        .spacing: 12.0,
        .borderRadius: 4.0
    ])
])
```

### Component Merging

Components can be merged to create new configurations:

```swift
let mergedColors = colorComponent1.merge(with: colorComponent2)
let mergedTheme = theme1.merge(with: theme2)
```

## 🏭 Theme Factory

The `ThemeFactory` provides pre-built theme configurations:

```swift
// Create common theme types
let lightTheme = ThemeFactory.createDefaultLightTheme()
let darkTheme = ThemeFactory.createDefaultDarkTheme()
let corporateTheme = ThemeFactory.createCorporateTheme()
let creativeTheme = ThemeFactory.createCreativeTheme()
```

## 🎛️ Theme Manager

The `AdvancedThemeManager` provides high-level theme management:

```swift
class AdvancedThemeManager: ObservableObject {
    @Published var currentTheme: CompositeTheme
    @Published var availableThemes: [String: CompositeTheme] = [:]
  
    func switchTheme(_ themeName: String)
    func createDerivedTheme(name: String, components: [ThemeComponent]) -> CompositeTheme
    func saveTheme(_ theme: CompositeTheme, name: String)
    func getValue(for key: ThemeKey) -> Any?
}
```

## 📱 Platform-Specific Implementations

### SwiftUI Implementation

**File Structure:**

```
apps/swiftui-app/
├── AdvancedThemeArchitecture.swift      # Core architecture
├── AdvancedThemeArchitectureExample.swift # Comprehensive examples
└── [Other theme files...]
```

**Key Features:**

- `@Published` properties for reactive updates
- SwiftUI integration with `ObservableObject`
- Native Swift type safety
- Protocol-oriented design

### React Native Implementation

**File Structure:**

```
apps/react-native-app/src/theme/
├── AdvancedThemeArchitecture.ts         # Core architecture
└── [Other theme files...]

apps/react-native-app/src/components/
└── AdvancedThemeArchitectureExample.tsx # Comprehensive examples
```

**Key Features:**

- TypeScript interfaces for type safety
- React hooks integration
- Cross-platform compatibility
- Component-based architecture

## 🚀 Usage Examples

### Basic Theme Creation

```swift
// Swift
let theme = CompositeTheme(components: [
    ColorPaletteComponent(colors: [.primaryColor: .blue]),
    TypographyComponent(typography: [.fontSize: 16.0])
])
```

```typescript
// React Native
const theme = new CompositeTheme([
  new ColorPaletteComponent({ [ThemeKey.PRIMARY_COLOR]: '#007AFF' }),
  new TypographyComponent({ [ThemeKey.FONT_SIZE]: 16 })
]);
```

### Theme Inheritance

```swift
// Create parent theme
let parent = ThemeFactory.createDefaultLightTheme()

// Create child theme with overrides
let child = parent.createChildTheme(components: [
    ColorPaletteComponent(colors: [.primaryColor: .red])
])

// Child inherits all parent properties except overridden ones
```

### Component Composition

```swift
// Create specialized components
let brandColors = ColorPaletteComponent(colors: [
    .primaryColor: brandBlue,
    .secondaryColor: brandOrange
])

let brandTypography = TypographyComponent(typography: [
    .primaryFont: brandFont,
    .fontSize: brandFontSize
])

// Compose into complete theme
let brandTheme = CompositeTheme(components: [
    brandColors,
    brandTypography,
    LayoutMetricsComponent() // Use defaults
])
```

## 🔧 Advanced Features

### Custom Component Types

You can create custom components by implementing the `ThemeComponent` protocol:

```swift
class CustomComponent: ThemeComponent {
    private var values: [ThemeKey: Any] = [:]
  
    func value(for key: ThemeKey) -> Any? {
        return values[key]
    }
  
    func availableKeys() -> [ThemeKey] {
        return Array(values.keys)
    }
  
    func merge(with other: ThemeComponent) -> ThemeComponent {
        // Custom merge logic
        return self
    }
}
```

### Theme Validation

The system supports validation of theme configurations:

```swift
// Validate theme structure
let errors = ThemeValidator.validate(theme)
if errors.isEmpty {
    // Theme is valid
} else {
    // Handle validation errors
}
```

### Theme Serialization

Themes can be serialized for storage and sharing:

```swift
// Export theme to JSON
let jsonData = try JSONEncoder().encode(theme)

// Import theme from JSON
let importedTheme = try JSONDecoder().decode(CompositeTheme.self, from: jsonData)
```

## 📊 Performance Considerations

### Memory Management

- Components are reference-counted (Swift) or garbage-collected (JavaScript)
- Parent themes use weak references to prevent retain cycles
- Large theme hierarchies are optimized for lookup performance

### Lookup Performance

- Theme key resolution uses O(n) complexity where n is the number of components
- Inheritance chain resolution is optimized for common cases
- Component merging is O(m) where m is the number of keys

### Caching Strategy

- Frequently accessed values can be cached
- Component-level caching for expensive computations
- Theme-level caching for resolved values

## 🧪 Testing

### Unit Tests

```swift
class ThemeComponentTests: XCTestCase {
    func testColorComponentValueResolution() {
        let component = ColorPaletteComponent(colors: [.primaryColor: .blue])
        let value = component.value(for: .primaryColor)
        XCTAssertEqual(value as? Color, .blue)
    }
  
    func testThemeInheritance() {
        let parent = ThemeFactory.createDefaultLightTheme()
        let child = parent.createChildTheme(components: [])
        let value = child.resolveValue(for: .primaryColor)
        XCTAssertNotNil(value)
    }
}
```

### Integration Tests

```swift
class ThemeManagerTests: XCTestCase {
    func testThemeSwitching() {
        let manager = AdvancedThemeManager()
        manager.switchTheme("Dark")
        XCTAssertEqual(manager.currentTheme, manager.getTheme("Dark"))
    }
}
```

## 🔮 Future Enhancements

### Planned Features

1. **Theme Versioning**: Support for theme schema evolution
2. **Dynamic Theme Loading**: Runtime theme loading from remote sources
3. **Theme Analytics**: Usage tracking and optimization insights
4. **Advanced Inheritance**: Multiple inheritance and mixins
5. **Theme Templates**: Pre-built theme templates for common use cases

### Extension Points

1. **Custom Validators**: Domain-specific validation rules
2. **Theme Transformers**: Automatic theme transformations
3. **Plugin System**: Third-party theme component plugins
4. **Performance Profiling**: Built-in performance monitoring

## 📚 Additional Resources

### Documentation

- [Theme Schema Documentation](./ThemeSchema_README.md)
- [Theme Data Model Documentation](./ThemeDataModel_README.md)
- [Component API Reference](./docs/API.md)

### Examples

- [Basic Usage Examples](./examples/basic-usage.md)
- [Advanced Patterns](./examples/advanced-patterns.md)
- [Migration Guide](./examples/migration.md)

### Community

- [GitHub Issues](https://github.com/your-repo/issues)
- [Discussions](https://github.com/your-repo/discussions)
- [Contributing Guide](./CONTRIBUTING.md)

---

## 🎉 Conclusion

The Advanced Theming Architecture provides a robust, scalable foundation for theme management across multiple platforms. By embracing composition over inheritance and providing a flexible component system, it enables developers to create maintainable, reusable theme configurations that can evolve with their applications.

The architecture's focus on type safety, performance, and extensibility makes it suitable for both small applications and large-scale enterprise systems. Whether you're building a simple app or a complex design system, this architecture provides the tools you need to create beautiful, consistent user experiences.
