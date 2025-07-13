# iOSOnlySwiftUI

A Swift Package Manager (SPM) compatible package that provides iOS-only SwiftUI components with proper platform compatibility and availability annotations.

## 🎯 Purpose

This package is designed specifically for iOS 15+ applications that need to maintain clean platform separation. It provides:

- **iOS-only SwiftUI components** with proper availability annotations
- **Platform compatibility verification** through build tools and CI checks
- **Haptic feedback integration** for enhanced user experience
- **Theme management** with light/dark mode support
- **Animated UI components** optimized for iOS

## 📱 Platform Support

- ✅ **iOS 15.0+** - Fully supported
- ❌ **macOS** - Not supported (unavailable)
- ❌ **watchOS** - Not supported
- ❌ **tvOS** - Not supported

## 🏗️ Architecture

### Platform Compatibility Strategy

This package uses a comprehensive approach to ensure iOS-only compatibility:

1. **Availability Annotations**: All SwiftUI views use `@available(iOS 15.0, *)` and `@available(macOS, unavailable)`
2. **Platform Guards**: iOS-specific code is wrapped in `#if os(iOS)` blocks
3. **macOS Placeholders**: Graceful fallbacks for macOS compilation
4. **Build Tool Verification**: Automated checks for platform compatibility
5. **CI/CD Integration**: GitHub Actions workflows for continuous verification

### Why macOS Unavailability Markers?

The `@available(macOS, unavailable)` annotations are required because:

- **SPM Compatibility**: Swift Package Manager needs to verify platform compatibility
- **Clean Separation**: Prevents accidental usage on unsupported platforms
- **Build Safety**: Ensures the package can be imported into iOS apps without conflicts
- **Documentation**: Clearly communicates platform support to developers

## 🚀 Installation

### Swift Package Manager

Add the package to your Xcode project:

1. In Xcode, go to **File** → **Add Package Dependencies**
2. Enter the package URL: `https://github.com/example/iOSOnlySwiftUI`
3. Select the version you want to use
4. Add to your iOS app target

### Package.swift

```swift
dependencies: [
    .package(url: "https://github.com/example/iOSOnlySwiftUI", from: "1.0.0")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: ["iOSOnlySwiftUI"]
    )
]
```

## 📖 Usage

### Basic Import

```swift
import iOSOnlySwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            MetricCard(title: "Users", value: "1,234")
            InteractiveButton(title: "Tap Me", icon: "hand.tap") {
                print("Button tapped!")
            }
        }
    }
}
```

### Theme Management

```swift
import iOSOnlySwiftUI

struct ThemedView: View {
    @ObservedObject private var themeManager = ThemeManager.shared
  
    var body: some View {
        VStack {
            ThemedButton(title: "Primary Action", style: .primary) {
                themeManager.toggleTheme()
            }
          
            ThemeSelector()
        }
        .withThemeAwareness()
    }
}
```

### Haptic Feedback

```swift
import iOSOnlySwiftUI

struct InteractiveView: View {
    var body: some View {
        Button("Tap with Haptic") {
            HapticFeedbackManager.shared.triggerLightImpact()
        }
        .asAnimatedCard(delay: 0.2)
    }
}
```

## 🧩 Components

### User Interaction Components

- **MetricCard**: Display metrics with animations
- **InteractiveButton**: Buttons with haptic feedback
- **ProgressIndicator**: Animated progress bars
- **AnimatedCard**: Cards with entrance animations
- **InteractiveListItem**: List items with press feedback
- **LoadingIndicator**: Custom loading spinners
- **SwipeActionButton**: Swipe action buttons

### Theme Components

- **ThemeManager**: Singleton for theme management
- **AppTheme**: Light, dark, and auto themes
- **AppColorScheme**: Predefined color schemes
- **ThemedButton**: Buttons with theme integration
- **ThemedCard**: Cards with theme-aware styling
- **ThemeSelector**: Theme selection interface

### Utilities

- **HapticFeedbackManager**: iOS haptic feedback
- **ThemeAwareModifier**: View modifier for theme awareness
- **PlatformCompatibility**: Platform information
- **MigrationGuide**: Migration assistance
- **ExampleUsage**: Usage examples

## 🔧 Development

### Building the Package

```bash
# Clone the repository
git clone https://github.com/example/iOSOnlySwiftUI.git
cd iOSOnlySwiftUI

# Build the package
swift build

# Run tests
swift test

# Verify platform compatibility
./Scripts/verify-platform-compatibility.sh
```

### Platform Compatibility Verification

The package includes automated verification tools:

```bash
# Run the verification script
./Scripts/verify-platform-compatibility.sh

# Check for macOS references
! grep -r "macOS" Sources/ --include="*.swift" | grep -v "@available(macOS, unavailable)"

# Verify SwiftUI view annotations
! find Sources -name "*.swift" -exec grep -l "import SwiftUI" {} \; | xargs grep -L "@available(iOS 15.0, *)"
```

### Build Tool Plugin

The package includes a build tool plugin that automatically verifies:

- No unauthorized macOS platform references
- All SwiftUI views have proper availability annotations
- No UIKit imports remain
- Package.swift configuration is correct

## 🧪 Testing

### Running Tests

```bash
# Run all tests
swift test

# Run specific test
swift test --filter iOSOnlySwiftUITests.testThemeManager
```

### Test Coverage

The test suite covers:

- ✅ Package information and metadata
- ✅ Platform compatibility verification
- ✅ Theme manager functionality
- ✅ Haptic feedback integration
- ✅ Migration guide content
- ✅ Example usage validation
- ✅ Performance benchmarks
- ✅ Memory management
- ✅ Thread safety

## 🔄 CI/CD

### GitHub Actions

The package includes GitHub Actions workflows that:

1. **Verify Platform Compatibility**: Ensures no unauthorized platform references
2. **Build Package**: Compiles the package for iOS
3. **Run Tests**: Executes the test suite
4. **Check Availability Annotations**: Validates SwiftUI view annotations

### Workflow Triggers

- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

## 📋 Migration Guide

### From UIKit to SwiftUI

1. **Replace UIKit Components**:

   ```swift
   // Before (UIKit)
   let button = UIButton()
   button.setTitle("Tap Me", for: .normal)

   // After (SwiftUI)
   InteractiveButton(title: "Tap Me", icon: "hand.tap") {
       // Action
   }
   ```
2. **Add Availability Annotations**:

   ```swift
   @available(iOS 15.0, *)
   @available(macOS, unavailable)
   struct MyView: View {
       // Implementation
   }
   ```
3. **Replace Haptic Feedback**:

   ```swift
   // Before (UIKit)
   let impactFeedback = UIImpactFeedbackGenerator(style: .light)
   impactFeedback.impactOccurred()

   // After (SwiftUI)
   HapticFeedbackManager.shared.triggerLightImpact()
   ```

### From Cross-Platform to iOS-Only

1. **Add Platform Guards**:

   ```swift
   #if os(iOS)
   // iOS-only implementation
   #else
   @available(macOS, unavailable)
   #endif
   ```
2. **Update Package.swift**:

   ```swift
   platforms: [
       .iOS(.v15)
   ]
   ```
3. **Remove macOS Dependencies**:

   - Remove macOS-specific imports
   - Replace cross-platform APIs with iOS equivalents
   - Add proper availability annotations

## 🐛 Troubleshooting

### Common Issues

#### Build Errors on macOS

**Problem**: Package fails to build on macOS

**Solution**: Ensure all components have `@available(macOS, unavailable)` annotations

```swift
@available(iOS 15.0, *)
@available(macOS, unavailable)
public struct MyComponent: View {
    // Implementation
}
```

#### Missing Availability Annotations

**Problem**: SwiftUI views missing availability annotations

**Solution**: Add `@available(iOS 15.0, *)` to all SwiftUI views

```swift
@available(iOS 15.0, *)
@available(macOS, unavailable)
struct MyView: View {
    var body: some View {
        Text("Hello, iOS!")
    }
}
```

#### UIKit Import Errors

**Problem**: UIKit imports causing build errors

**Solution**: Replace UIKit with SwiftUI equivalents

```swift
// Remove this
import UIKit

// Use SwiftUI instead
import SwiftUI
```

### Verification Commands

```bash
# Check for unauthorized macOS references
grep -r "macOS" Sources/ --include="*.swift" | grep -v "@available(macOS, unavailable)"

# Check for missing availability annotations
find Sources -name "*.swift" -exec grep -l "import SwiftUI" {} \; | xargs grep -L "@available(iOS 15.0, *)"

# Check for UIKit imports
grep -r "import UIKit" Sources/ --include="*.swift"
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the platform compatibility guidelines
4. **Run verification**: `./Scripts/verify-platform-compatibility.sh`
5. **Run tests**: `swift test`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- ✅ Follow platform compatibility requirements
- ✅ Add proper availability annotations
- ✅ Include comprehensive tests
- ✅ Update documentation
- ✅ Run verification scripts before submitting
- ❌ Don't add macOS-specific code
- ❌ Don't remove availability annotations
- ❌ Don't import UIKit
- ❌ Don't break platform compatibility

## 📞 Support

- **Documentation**: [https://example.com/iOSOnlySwiftUI/docs](https://example.com/iOSOnlySwiftUI/docs)
- **Issues**: [https://github.com/example/iOSOnlySwiftUI/issues](https://github.com/example/iOSOnlySwiftUI/issues)
- **Discussions**: [https://github.com/example/iOSOnlySwiftUI/discussions](https://github.com/example/iOSOnlySwiftUI/discussions)

## 🔮 Roadmap

### Version 1.1.0

- [ ] Additional animation components
- [ ] Enhanced theme customization
- [ ] Accessibility improvements
- [ ] Performance optimizations

### Version 1.2.0

- [ ] Advanced haptic feedback patterns
- [ ] Custom color palette support
- [ ] Animation presets
- [ ] Component composition utilities

### Version 2.0.0

- [ ] SwiftUI 5.0 compatibility
- [ ] iOS 17+ features
- [ ] Advanced theming system
- [ ] Component library expansion

## 📊 Version History

### 1.0.0 (Current)

- Initial release
- Core user interaction components
- Theme management system
- Platform compatibility verification
- Comprehensive test suite
- CI/CD integration

---

**Note**: This package is designed specifically for iOS applications. If you need cross-platform support, consider using alternative packages or creating platform-specific implementations.
