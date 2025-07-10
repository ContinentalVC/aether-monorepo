# Aether Monorepo

A unified, futuristic, and gamified experience across SwiftUI and React Native applications with shared design systems and components.

## 🏗️ Project Structure

```
/aether-monorepo
├── /apps
│   ├── /react-native-app    # The React Native application
│   └── /swiftui-app         # Swift Package Manager package (iOS-only SwiftUI components)
├── /packages
│   ├── /core-logic          # Shared business logic, state management, API calls
│   ├── /ui-components       # Shared UI theme, design tokens, and React Native components
│   ├── /AetherUI            # Shared UI components and design system
│   ├── /AetherWeb           # Web-specific components and utilities
│   ├── /eslint-config       # Shared ESLint configuration
│   └── /tsconfig            # Shared TypeScript configuration
├── package.json
├── turbo.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Xcode 14.0+ (for SwiftUI development)
- React Native CLI (for React Native development)
- Swift 5.7+ (for Swift Package Manager)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aether-monorepo
```

2. Install dependencies:

```bash
npm install
```

3. Build all packages:

```bash
npm run build
```

## 📦 Packages

### Core Logic (`@aether/core-logic`)

Shared business logic, state management, and API calls used by both applications.

**Features:**

- Zustand state management
- API client and services
- Type definitions
- Business logic utilities

### UI Components (`@aether/ui-components`)

Shared UI theme, design tokens, and React Native components.

**Features:**

- Design system tokens (colors, spacing, typography)
- Reusable React Native components
- Theme configuration
- Rive animation assets (planned)

### AetherUI (`@aether/ui`)

Advanced UI components and design system utilities.

**Features:**

- Advanced theme management
- Component architecture patterns
- Design system validation
- Cross-platform compatibility

### AetherWeb (`@aether/web`)

Web-specific components and utilities.

**Features:**

- Web-optimized components
- Browser-specific utilities
- Web performance optimizations

### ESLint Config (`@aether/eslint-config`)

Shared ESLint configuration for consistent code quality across the monorepo.

### TypeScript Config (`@aether/tsconfig`)

Shared TypeScript configurations for different environments:

- `base.json` - Base configuration
- `react.json` - React-specific configuration
- `react-native.json` - React Native-specific configuration
- `node.json` - Node.js-specific configuration

## 📱 Applications

### React Native App (`apps/react-native-app`)

Cross-platform mobile application built with React Native, using shared components and logic.

**Features:**

- Cross-platform mobile development
- Shared theme system integration
- Advanced component architecture
- Real-time theme customization
- Accessibility validation
- Performance monitoring

### SwiftUI Package (`apps/swiftui-app`)

iOS-only Swift Package Manager package providing SwiftUI components with proper platform compatibility.

**Features:**

- iOS 15.0+ SwiftUI components
- Platform compatibility verification
- Haptic feedback integration
- Theme management with light/dark mode
- Animated UI components optimized for iOS
- Comprehensive test suite

## 🛠️ Development

### Available Scripts

- `npm run build` - Build all packages and applications
- `npm run dev` - Start development servers
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests across all packages
- `npm run clean` - Clean build artifacts
- `npm run format` - Format code with Prettier

### SwiftUI Package Development

The SwiftUI package is located in `apps/swiftui-app` and can be developed independently:

```bash
# Navigate to the SwiftUI package
cd apps/swiftui-app

# Build the package
swift build

# Run tests
swift test

# Verify platform compatibility
./Scripts/verify-platform-compatibility.sh
```

### Adding New Packages

1. Create a new directory in `/packages`
2. Add a `package.json` with the `@aether/` namespace
3. Configure TypeScript and ESLint
4. Update the root `package.json` workspaces if needed

### Adding New Apps

1. Create a new directory in `/apps`
2. Set up the application framework (React Native, etc.)
3. Add dependencies to shared packages
4. Configure build and development scripts

## 🏗️ Architecture Decisions

### Why Monorepo?

This project uses a monorepo structure to maximize code sharing and consistency between the React Native application and SwiftUI package. Key benefits:

- **Code Sharing**: Business logic, types, and design tokens can be shared
- **Consistency**: Unified design tokens and development practices
- **Atomic Changes**: Cross-platform changes can be made in single commits
- **Simplified Dependencies**: Shared dependency management
- **Platform Optimization**: Platform-specific optimizations while maintaining consistency

### SwiftUI Package Strategy

The SwiftUI package (`iOSOnlySwiftUI`) is designed specifically for iOS applications:

- **Platform Compatibility**: Uses `@available(iOS 15.0, *)` and `@available(macOS, unavailable)` annotations
- **iOS Optimization**: Leverages iOS-specific features like haptic feedback
- **Clean Separation**: Prevents accidental usage on unsupported platforms
- **SPM Integration**: Fully compatible with Swift Package Manager

### Tooling

- **Turborepo**: Build system and task orchestration
- **TypeScript**: Type safety across all packages
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Swift Package Manager**: Swift package management

## 📖 Usage Examples

### Using the SwiftUI Package

#### Installation

Add the package to your Xcode project:

1. In Xcode, go to **File** → **Add Package Dependencies**
2. Enter the package URL: `https://github.com/your-org/aether-monorepo/apps/swiftui-app`
3. Select the version you want to use
4. Add to your iOS app target

#### Basic Usage

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

#### Theme Management

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

### Using React Native Components

```typescript
import { ProgressLineChart, ThemeValidator } from '@aether/ui-components';

const MyComponent = () => {
  const data = [
    { x: 0, y: 10, label: 'Jan', value: 10 },
    { x: 1, y: 20, label: 'Feb', value: 20 },
    { x: 2, y: 15, label: 'Mar', value: 15 },
  ];

  return (
    <ProgressLineChart
      data={data}
      animate={true}
      showArea={true}
      enableHaptics={true}
    />
  );
};
```

## 🔄 Workflow

1. **Development**: Work on shared packages first, then applications
2. **Testing**: Run tests across all affected packages
3. **Building**: Use Turborepo to build only changed packages
4. **Deployment**: Deploy applications independently

## 🤝 Contributing

1. Create a feature branch
2. Make changes across relevant packages
3. Update tests and documentation
4. Run the full test suite
5. Submit a pull request

### SwiftUI Package Contributions

When contributing to the SwiftUI package:

- Follow platform compatibility requirements
- Add proper availability annotations (`@available(iOS 15.0, *)`)
- Include comprehensive tests
- Run verification scripts before submitting
- Ensure no macOS-specific code is included

## 📄 License

[Add your license information here]

## 🔮 Roadmap

### Version 1.1.0

- [ ] Enhanced theme customization across platforms
- [ ] Additional SwiftUI components
- [ ] Improved React Native performance
- [ ] Advanced animation systems

### Version 1.2.0

- [ ] Cross-platform design token synchronization
- [ ] Advanced haptic feedback patterns
- [ ] Component composition utilities
- [ ] Performance monitoring tools

### Version 2.0.0

- [ ] SwiftUI 5.0 compatibility
- [ ] iOS 17+ features
- [ ] Advanced theming system
- [ ] Component library expansion

---

## Steps to Share Your SwiftUI Package via SPM from the Monorepo Root

### 1. **Ensure the Package Structure is SPM-Compatible**

Your `apps/swiftui-app` already contains a `Package.swift` file and follows the SPM structure. This is good.

### 2. **Use a Relative Path for Local Development**

Other projects on your machine can add the package using a relative path:

```swift
.package(path: "../aether-monorepo/apps/swiftui-app")
```

Or, if referencing from the monorepo root:

```swift
.package(path: "apps/swiftui-app")
```

### 3. **Publish via Git (for Remote Use)**

- Push your monorepo to a remote (e.g., GitHub).
- Other projects can add the package using the repo URL and a branch, tag, or commit:
  ```swift
  .package(url: "https://github.com/your-org/aether-monorepo.git", .branch("main"))
  ```
- In the target dependency, specify the product (e.g., `iOSOnlySwiftUI`).

### 4. **Target the Correct Subdirectory**

By default, SPM expects the package at the repo root. Since your package is in a subdirectory, consumers must specify the subpath:

```swift
<code_block_to_apply_changes_from>
```

**Note:** As of now, Xcode’s SPM UI does not support the `subdirectory` parameter, but you can use it in `Package.swift` directly.

### 5. **Tag Releases for Versioning**

- Use Git tags to mark releases (e.g., `v1.0.0`).
- Consumers can then depend on a specific version.

### 6. **Document the Integration**

- Add clear instructions in your monorepo’s `README.md` for how to consume the SwiftUI package from other projects.

---

## Reflection & Best Practices

**Scalability & Maintainability:**
This approach allows you to maintain a single source of truth for your SwiftUI components, making cross-project updates and bug fixes much easier. It also enables atomic changes across your design system and apps, and leverages SPM’s robust dependency management.

**Potential Improvements/Next Steps:**

- Consider splitting out the SwiftUI package into `/packages` if you want to make it more discoverable as a shared resource.
- Add CI checks to ensure the package builds independently.
- Use semantic versioning and automated release scripts for smoother updates.
- If you want to publish the package publicly, ensure no sensitive data is included and add a license.
