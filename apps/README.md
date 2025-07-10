# Enhanced Theming Engine

A comprehensive theming system that provides guided creativity for theme customization with typography controls and accessibility features. This system empowers users to express their brand identity while ensuring design best practices and accessibility standards.

## 🎯 Overview

The Enhanced Theming Engine moves beyond simple color swapping to establish a system that is:

- **Structured**: Well-organized typography and accessibility configurations
- **Extensible**: Easy to add new themes, fonts, and accessibility features
- **Maintainable**: Clean separation of concerns and reusable components
- **Accessible**: Built-in accessibility features and WCAG 2.1 compliance
- **Guided**: User interface that guides toward best practices

## 🏗️ Architecture

### Core Components

1. **Typography System**: Comprehensive font management with hierarchy and readability
2. **Accessibility Features**: Color blindness support, contrast checking, motion reduction
3. **Guided Creativity Interface**: User-friendly controls that prevent poor design choices
4. **Real-time Preview**: Instant feedback on theme changes
5. **Persistence**: Settings saved across app sessions

### Design Principles

- **Guided Creativity**: Users are empowered to create while being guided toward best practices
- **Accessibility First**: All themes are designed with accessibility in mind
- **Typography Discipline**: Enforces good typographic practices (2-3 fonts max)
- **Real-time Feedback**: Immediate preview of changes
- **System Integration**: Respects user's system accessibility settings

## 📱 Swift Implementation

### Features

- **Typography Controls**: Font family selection, weights, sizes, line heights
- **Accessibility Settings**: High contrast, reduced motion, color blindness support
- **Guided Interface**: Tabbed interface with real-time preview
- **Persistence**: UserDefaults integration for settings
- **System Integration**: Respects iOS accessibility settings

### Usage

```swift
// Initialize theme manager
@StateObject private var themeManager = ThemeManager()

// Use in views
struct MyView: View {
    @EnvironmentObject var themeManager: ThemeManager
  
    var body: some View {
        Text("Hello World")
            .font(themeManager.currentTheme.typography.heading(size: .h1))
            .foregroundColor(themeManager.currentTheme.textPrimary)
            .background(themeManager.currentTheme.background)
    }
}

// Show customization interface
.sheet(isPresented: $showingCustomization) {
    ThemeCustomizationView()
        .environmentObject(themeManager)
}
```

### Typography System

```swift
// Get heading fonts
let h1Font = themeManager.currentTheme.typography.heading(size: .h1)
let h2Font = themeManager.currentTheme.typography.heading(size: .h2)

// Get body fonts
let bodyFont = themeManager.currentTheme.typography.body()
let smallFont = themeManager.currentTheme.typography.body(size: .sm)

// Custom font with weight and size
let customFont = themeManager.currentTheme.typography.font(weight: .semibold, size: 18)
```

### Accessibility Features

```swift
// Check contrast
let hasGoodContrast = themeManager.currentTheme.hasSufficientContrast(
    textColor: theme.textPrimary,
    backgroundColor: theme.background
)

// Get color blindness adapted colors
let adaptedTheme = themeManager.currentTheme.colorsForColorBlindness()

// Toggle accessibility features
themeManager.toggleHighContrast()
themeManager.toggleReducedMotion()
themeManager.setColorBlindnessSupport(.deuteranopia)
```

## 📱 React Native Implementation

### Features

- **Enhanced Theme Provider**: Context-based theme management
- **Typography System**: Font management with helper methods
- **Accessibility Configuration**: Comprehensive accessibility settings
- **AsyncStorage Integration**: Persistent theme settings
- **Styled Components**: Seamless integration with styled-components

### Usage

```tsx
// Wrap app with EnhancedThemeProvider
import { EnhancedThemeProvider } from './src/theme/EnhancedThemeProvider';

const App = () => (
  <EnhancedThemeProvider initialTheme="light">
    <YourApp />
  </EnhancedThemeProvider>
);

// Use in components
import { useEnhancedTheme } from './src/theme/EnhancedThemeProvider';

const MyComponent = () => {
  const { theme, typography, accessibility } = useEnhancedTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ 
        color: theme.textPrimary,
        fontSize: typography.fontSizes.lg,
        fontFamily: typography.primaryFont 
      }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Typography System

```tsx
// Get heading styles
const h1Style = typography.getHeading(HeadingSize.H1);
const h2Style = typography.getHeading(HeadingSize.H2);

// Get body styles
const bodyStyle = typography.getBody();
const smallStyle = typography.getBody(BodySize.SM);

// Custom font
const customStyle = typography.getFont('600', 18);
```

### Accessibility Features

```tsx
// Check contrast
const hasGoodContrast = theme.hasSufficientContrast(
  theme.textPrimary,
  theme.background
);

// Get adapted colors
const adaptedTheme = theme.colorsForColorBlindness();

// Update accessibility settings
const { updateAccessibility, toggleHighContrast } = useEnhancedTheme();

updateAccessibility({
  ...accessibility,
  useHighContrast: true,
  colorBlindnessSupport: ColorBlindnessSupport.DEUTERANOPIA
});
```

## 🎨 Guided Creativity Interface

### Design Philosophy

The interface serves a dual purpose:

1. **Empower users** to express their brand identity
2. **Guide users** toward accessible design choices

### Key Features

#### Typography Controls

- **Font Selection**: Curated list of system fonts
- **Font Validation**: Ensures selected fonts are available
- **Recommended Combinations**: Pre-selected font pairs that work well together
- **Real-time Preview**: See typography changes instantly

#### Color Management

- **Color Palette**: Primary, secondary, background, and surface colors
- **Contrast Checker**: Real-time contrast ratio validation
- **Color Harmony Guide**: Tips for creating cohesive color schemes
- **Accessibility Validation**: Ensures colors meet WCAG standards

#### Accessibility Features

- **High Contrast Mode**: Enhanced contrast for better visibility
- **Reduced Motion**: Respects user's motion preferences
- **Color Blindness Support**: Adapts colors for different types of color blindness
- **Large Text Support**: Scalable typography for better readability

## 🔧 Configuration

### Swift Configuration

```swift
// Custom typography
let customTypography = Typography(
    primaryFontName: "SF Pro Display",
    secondaryFontName: "SF Pro Text",
    weights: [.light, .regular, .medium, .semibold, .bold]
)

// Custom accessibility
let customAccessibility = AccessibilityConfig(
    minimumContrastRatio: 4.5,
    useHighContrast: false,
    reduceMotion: false,
    useLargeText: false,
    colorBlindnessSupport: .none
)

// Create custom theme
let customTheme = Theme(
    primary: .blue,
    secondary: .purple,
    background: .white,
    surface: .gray,
    textPrimary: .black,
    typography: customTypography,
    accessibility: customAccessibility
)
```

### React Native Configuration

```tsx
// Custom typography
const customTypography = createTypography(
  'System',
  'Helvetica',
  ['300', '400', '500', '600', '700']
);

// Custom accessibility
const customAccessibility: AccessibilityConfig = {
  minimumContrastRatio: 4.5,
  useHighContrast: false,
  reduceMotion: false,
  useLargeText: false,
  colorBlindnessSupport: ColorBlindnessSupport.NONE,
};

// Create enhanced theme
const customTheme = createEnhancedTheme(
  baseTheme,
  customTypography,
  customAccessibility
);
```

## 📊 Best Practices

### Typography Guidelines

1. **Limit Font Families**: Use 2-3 fonts maximum for consistency
2. **Establish Hierarchy**: Use size and weight for emphasis
3. **Prioritize Readability**: Choose fonts that are easy to read
4. **Consider Context**: Different fonts for different use cases

### Color Guidelines

1. **Contrast Ratios**: Ensure 4.5:1 for normal text, 3:1 for large text
2. **Color Blindness**: Test with color blindness simulators
3. **Semantic Colors**: Use colors consistently for meaning
4. **Accessibility**: Provide alternatives to color-only information

### Accessibility Guidelines

1. **WCAG 2.1 Compliance**: Follow accessibility standards
2. **User Testing**: Validate with real users
3. **System Integration**: Respect user's system settings
4. **Progressive Enhancement**: Ensure functionality without enhancements

## 🚀 Getting Started

### Swift Setup

1. Add `ThemeManager.swift` to your project
2. Add `ThemeCustomizationView.swift` for the interface
3. Initialize `ThemeManager` in your app
4. Use the environment object in your views

### React Native Setup

1. Install dependencies:

   ```bash
   npm install styled-components @react-native-async-storage/async-storage
   ```
2. Add the enhanced theme provider:

   ```tsx
   import { EnhancedThemeProvider } from './src/theme/EnhancedThemeProvider';
   ```
3. Use the hook in your components:

   ```tsx
   import { useEnhancedTheme } from './src/theme/EnhancedThemeProvider';
   ```

## 📚 Examples

### Swift Examples

- `ThemeCustomizationExample.swift`: Complete example with all features
- `ThemeCustomizationView.swift`: Full customization interface
- `ThemeManager.swift`: Core theme management system

### React Native Examples

- `ThemeCustomizationExample.tsx`: Complete example with all features
- `ThemeCustomizationScreen.tsx`: Full customization interface
- `EnhancedThemeProvider.tsx`: Core theme management system

## 🔍 Testing

### Accessibility Testing

1. **Contrast Testing**: Use tools like WebAIM's contrast checker
2. **Color Blindness Testing**: Test with simulators
3. **Screen Reader Testing**: Ensure proper labeling
4. **Keyboard Navigation**: Test without mouse/touch

### Performance Testing

1. **Theme Switching**: Measure time to switch themes
2. **Memory Usage**: Monitor memory with different themes
3. **Rendering Performance**: Test with complex UI
4. **Storage Performance**: Test persistence with large themes

## 🤝 Contributing

### Development Guidelines

1. **Accessibility First**: All changes must consider accessibility
2. **Type Safety**: Use strong typing for all configurations
3. **Documentation**: Document all public APIs
4. **Testing**: Include tests for new features

### Code Style

- **Swift**: Follow Swift API Design Guidelines
- **React Native**: Follow React/TypeScript best practices
- **Documentation**: Use clear, descriptive comments
- **Naming**: Use descriptive, consistent naming conventions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- WCAG 2.1 guidelines for accessibility standards
- Apple Human Interface Guidelines for iOS design
- Material Design guidelines for Android design
- React Native community for best practices

---

**Note**: This theming system is designed to be a foundation for building accessible, maintainable applications. It provides the tools and guidance needed to create beautiful, functional interfaces that work for everyone.
