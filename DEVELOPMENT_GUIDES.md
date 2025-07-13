# Development Guides

> *Comprehensive development setup, contribution guidelines, and best practices for the Aether monorepo.*

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)
- [Accessibility Framework](#accessibility-framework)
- [Data Architecture](#data-architecture)
- [User Interaction Guidelines](#user-interaction-guidelines)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Xcode** 14.0+ (for SwiftUI development)
- **React Native CLI** (for React Native development)
- **Swift** 5.7+ (for Swift Package Manager)
- **Git** for version control

### Quick Start

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/aether-monorepo.git
   cd aether-monorepo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build all packages**
   ```bash
   npm run build
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

---

## 🛠️ Development Setup

### Environment Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/aether-monorepo.git
   cd aether-monorepo
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/aether-monorepo.git
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Workflow

1. **Keep your fork updated**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

### Understanding the Package Lock File

The `package-lock.json` file in this monorepo is **32,305 lines long** and **1.1MB** in size. This is **normal and expected** for a modern JavaScript/TypeScript monorepo with React Native and 3D graphics dependencies.

#### Why It's So Large

1. **Dependency Resolution Tree**
   - Multiple apps (`react-native-app`, `swiftui-app`) and packages
   - Each dependency has its own dependencies (transitive dependencies)
   - React Native alone brings in hundreds of packages
   - 3D libraries like `@react-three/fiber` and `three.js` add many more dependencies

2. **Exact Version Locking**
   - Locks **every single dependency** to an exact version
   - Includes the entire dependency tree, not just direct dependencies
   - For example, if you depend on `react@18.2.0`, it also locks all of React's dependencies

3. **Security and Integrity**
   - Each package entry includes integrity hashes (`sha512`)
   - Prevents supply chain attacks and ensures reproducible builds
   - Contains resolved URLs, version constraints, and dependency relationships

#### Why We Commit It

**YES, we commit `package-lock.json` to git** for these essential reasons:

- **Reproducible Builds**: Everyone gets exactly the same dependency versions
- **Faster Installs**: npm can skip dependency resolution
- **Security**: Integrity hashes prevent tampered packages
- **CI/CD Reliability**: Builds are consistent across environments
- **Team Collaboration**: No "works on my machine" issues

#### Best Practices

- **Use `npm ci` in CI/CD** instead of `npm install` for faster, more reliable builds
- **Regular dependency updates**: Run `npm audit` and `npm update` periodically
- **Lock file maintenance**: Commit lock file changes with meaningful messages
- **Size context**: 32K lines is normal for a React Native + 3D graphics monorepo

> **Note**: The large size is a sign of a well-structured monorepo with proper dependency management, not a problem to solve.

### Git Ignore Configuration
The project includes a comprehensive `.gitignore` file that covers:

**Dependencies & Build Artifacts:**
- `node_modules/` - All dependency directories
- `dist/`, `build/` - Build outputs
- `*.jsbundle`, `*.bundle` - React Native bundles
- `.turbo/` - Turbo cache directories

**Platform-Specific Files:**
- iOS: `*.xcworkspace`, `*.xcodeproj`, `Pods/`, `DerivedData/`
- Android: `build/`, `.gradle/`, `local.properties`
- SwiftUI: `.build/`, `Packages/`, `Package.resolved`

**Development Tools:**
- IDE files: `.vscode/`, `.idea/`, `.cursor/`
- Cache files: `*.cache`, `.eslintcache`, `.prettiercache`
- Log files: `*.log`, `logs/`

**Security & Secrets:**
- Environment files: `.env*`
- Certificate files: `*.pem`, `*.key`, `*.p12`, `*.pfx`
- Secret files: `secrets.json`, `.secrets`

**Testing & Coverage:**
- Coverage reports: `coverage/`, `.nyc_output/`
- Test results: `test-results/`, `playwright-report/`
- Screenshots: `cypress/screenshots/`

**Temporary Files:**
- OS files: `.DS_Store`, `Thumbs.db`
- Backup files: `*.tmp`, `*.bak`, `*.backup`
- Editor files: `*.swp`, `*.swo`

**Media & Archives:**
- Large media files: `*.mp4`, `*.mov`, `*.avi`
- Archive files: `*.zip`, `*.tar.gz`, `*.rar`

This comprehensive ignore pattern ensures that only source code and essential configuration files are tracked in version control, keeping the repository clean and secure.

---

## 📝 Coding Standards

### General Principles

- **Type Safety**: Use TypeScript with strict mode enabled
- **Accessibility First**: All components must be accessible
- **Performance Conscious**: Optimize for performance and user experience
- **Documentation**: Document all public APIs and complex logic
- **Testing**: Maintain high test coverage (80%+)

### TypeScript Standards

- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful type names and avoid `any`
- Export types from dedicated type files
- Use JSDoc comments for complex functions

```typescript
/**
 * Validates theme accessibility according to WCAG guidelines
 * @param theme - The theme to validate
 * @param options - Validation options
 * @returns Validation result with accessibility score
 */
export function validateThemeAccessibility(
  theme: ThemeSchema,
  options: ValidationOptions = {}
): ValidationResult {
  // Implementation
}
```

### React/React Native Standards

- Use functional components with hooks
- Prefer composition over inheritance
- Use proper prop types and validation
- Implement proper error boundaries
- Follow React Native best practices

```typescript
interface ComponentProps {
  /** The content to display */
  children: React.ReactNode;
  /** Optional custom styling */
  style?: StyleProp<ViewStyle>;
  /** Callback when component is pressed */
  onPress?: () => void;
}

export const MyComponent: React.FC<ComponentProps> = ({
  children,
  style,
  onPress
}) => {
  // Implementation
};
```

### Swift/SwiftUI Standards

- Use Swift 5.7+ features
- Follow Swift API Design Guidelines
- Use proper availability annotations
- Implement proper error handling
- Use SwiftUI best practices

```swift
/// A component that displays themed content with accessibility support
/// - Parameters:
///   - content: The content to display
///   - theme: The theme to apply
///   - accessibilityLabel: Optional accessibility label
@available(iOS 15.0, *)
@available(macOS, unavailable)
struct ThemedComponent: View {
    let content: String
    let theme: Theme
    let accessibilityLabel: String?
    
    var body: some View {
        // Implementation
    }
}
```

### File Organization

```
packages/package-name/
├── src/
│   ├── components/     # React/React Native components
│   ├── hooks/         # Custom hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── constants/     # Constants and configuration
│   └── index.ts       # Main exports
├── __tests__/         # Test files
├── docs/              # Documentation
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🧪 Testing Guidelines

### Test Coverage Requirements

- **Unit Tests**: 80%+ coverage for all packages
- **Integration Tests**: For cross-package functionality
- **E2E Tests**: For critical user flows
- **Accessibility Tests**: For all UI components

### Testing Standards

- Use Jest for unit and integration tests
- Use React Native Testing Library for component tests
- Use XCTest for Swift/SwiftUI tests
- Write descriptive test names
- Test both success and error cases

```typescript
describe('ThemeValidator', () => {
  describe('validateTheme', () => {
    it('should return success for valid theme', () => {
      const theme = createValidTheme();
      const result = validateTheme(theme);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid theme', () => {
      const theme = createInvalidTheme();
      const result = validateTheme(theme);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
```

### Accessibility Testing

```typescript
import { render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

describe('Accessibility', () => {
  it('should have proper accessibility labels', () => {
    render(<MyComponent />);
    
    expect(screen.getByLabelText('Submit button')).toBeTruthy();
    expect(screen.getByLabelText('Email input field')).toBeTruthy();
  });

  it('should support VoiceOver navigation', () => {
    render(<MyComponent />);
    
    const submitButton = screen.getByLabelText('Submit button');
    expect(submitButton.props.accessibilityRole).toBe('button');
    expect(submitButton.props.accessibilityHint).toBeTruthy();
  });
});
```

---

## 📚 Documentation Standards

### Code Documentation

- Document all public APIs with JSDoc comments
- Include usage examples for complex functions
- Document TypeScript interfaces and types
- Keep documentation up to date with code changes

### README Files

Each package should include a comprehensive README.md with:

- Package description and purpose
- Installation instructions
- Usage examples
- API documentation
- Contributing guidelines

### API Documentation

- Use TypeDoc for auto-generated API documentation
- Include interactive examples
- Document all props and return types
- Provide migration guides for breaking changes

---

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure code quality**
   - Run linting: `npm run lint`
   - Run tests: `npm run test`
   - Build packages: `npm run build`
   - Check type safety: `npm run type-check`

2. **Update documentation**
   - Update README files if needed
   - Add JSDoc comments for new APIs
   - Update examples and usage guides

3. **Test thoroughly**
   - Test on multiple platforms
   - Verify accessibility features
   - Check performance impact
   - Test edge cases

### Pull Request Guidelines

- **Clear title**: Descriptive title that explains the change
- **Detailed description**: Explain what, why, and how
- **Related issues**: Link to relevant issues
- **Screenshots**: For UI changes
- **Breaking changes**: Clearly mark and explain

### Review Process

- All PRs require at least one review
- Address all review comments
- Ensure CI/CD checks pass
- Update documentation as needed

---

## 🚀 Release Process

### Version Management

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update CHANGELOG.md for all releases
- Tag releases in Git
- Publish packages to NPM

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version numbers updated
- [ ] Packages built successfully
- [ ] NPM packages published
- [ ] Release notes written

---

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inspiring community for all. By participating in this project, you agree to:

- **Be respectful** and inclusive of all contributors
- **Be collaborative** and open to different viewpoints
- **Be constructive** in feedback and discussions
- **Be professional** in all interactions

### Unacceptable Behavior

- Harassment, discrimination, or offensive behavior
- Trolling, insulting, or derogatory comments
- Publishing others' private information without permission
- Other conduct that could reasonably be considered inappropriate

---

## ♿ Accessibility Framework

### Foundational VoiceOver Support

The baseline for an accessible experience is ensuring that every piece of information and every interactive element can be correctly perceived and operated via VoiceOver.

#### Implementation Guidelines

**Meaningful Labels and Hints:**
- `accessibilityLabel`: Describe the element's purpose or content, not its visual appearance
- `accessibilityHint`: Provide additional context about the result of an action
- Use phrases like "Double tap to open your profile" for hints

**Dynamic Type Scaling:**
- Use scaled fonts (e.g., `UIFont.preferredFont(forTextStyle:.body)`)
- Ensure layouts adapt gracefully as text size increases
- Reflow content into single column for larger accessibility text sizes

**Logical Grouping of Elements:**
- Group related elements in container views
- Set `containerView.isAccessibilityElement = true`
- Construct custom `accessibilityLabel` from subview content
- Use `accessibilityElements` property for complex layouts

### Advanced VoiceOver Navigation

For data-intensive views, implement advanced navigation techniques:

**Custom Actions:**
- Use `UIAccessibilityCustomAction` for context-specific actions
- Attach actions directly to data elements
- Reduce gesture requirements for common tasks

**Accessibility Rotors:**
- Implement custom rotors for data visualization
- Allow navigation between "Data Points," "Segments," or "Annotations"
- Enable efficient navigation in complex interfaces

### Multi-Sensory Approach: Haptic Feedback

**Custom Haptic Patterns:**
- Use `CoreHaptics` framework for sophisticated tactile experiences
- Create `CHHapticPattern` from `CHHapticEvent` objects
- Design transient and continuous haptic events

**Parameter Control:**
- Tune `hapticIntensity`, `hapticSharpness`, and `duration`
- Design haptic language for the app
- Synchronize haptics with animations

**Accessibility Integration:**
- Pair haptics with audio cues
- Provide non-visual, non-auditory communication
- Confirm VoiceOver actions with unique haptic patterns

### Accessibility Testing Strategy

**Automated Testing:**
- Unit tests for accessibility properties
- Assert `accessibilityLabel`, `accessibilityHint`, and `accessibilityTraits`
- Test based on component state

**Manual Testing:**
- Navigate using VoiceOver with "Screen Curtain" enabled
- Verify logical navigation order
- Test custom actions and rotors
- Test with Dynamic Type at largest sizes
- Verify with system accessibility settings

**User Testing:**
- Engage with accessibility community
- Conduct sessions with assistive technology users
- Gather feedback on usability and friction points

---

## 🏗️ Data Architecture

### Performance Optimization with Intelligent Caching

**In-Memory Caching for Ephemeral Data:**
- Use `NSCache` for thread-safe, memory-sensitive caching
- Ideal for image thumbnails, formatted strings, calculation results
- Automatic eviction under memory pressure

**Custom LRU Cache:**
- Implement for granular control over eviction policy
- Use dictionary for fast lookups and doubly linked list for access order
- Suitable for fixed number of large, high-cost objects

**Persistent Caching for Mission-Critical Data:**
- Use Core Data/SwiftData for structured, relational data
- Enable offline experience and powerful querying
- Use `FileManager` for large, unstructured binary blobs

### Data Integrity and Security

**Validation Layer:**
- Centralize validation logic
- Use rule-based validation libraries
- Separate concerns for reusability and testability

**Rule-Based Validation:**
- Use declarative, composable validation constraints
- Register fields with pre-defined or custom rules
- Avoid large, nested if-else statements

**Whitelisting over Blacklisting:**
- Define what is allowed rather than blocking disallowed patterns
- Reject unknown patterns by default
- More secure posture for data validation

**Data Sanitization:**
- Clean data to make it safe
- Use as fallback to strict validation
- Prevent XSS attacks by escaping harmful characters

### Managing Data Evolution

**Lightweight Migration:**
- Use Core Data's built-in automatic migration
- Handle common schema changes automatically
- Enable by default with `NSPersistentContainer`

**Staged Migrations for Complex Changes:**
- Break complex migrations into smaller steps
- Create intermediate "bridge" model versions
- Leverage lightweight migration engine for structural changes

### Cross-Device Consistency

**CloudKit Integration:**
- Use `NSPersistentCloudKitContainer` for iCloud sync
- Automate schema mirroring and data synchronization
- Handle upload/download of local changes

**CloudKit Constraints:**
- Mark all relationships as optional
- Define inverse relationships
- Avoid "Deny" delete rule

**Conflict Resolution:**
- Use `NSMergeByPropertyObjectTrumpMergePolicy` for property-level merging
- Implement 3-way merge for collaborative features
- Preserve user intent without data loss

### Efficient Data Handling

**Data Compression:**
- Use Zstandard (zstd) for excellent balance of ratio and speed
- Consider LZFSE for high decompression speeds
- Apply compression before storage or transmission

**Advanced Data Export:**
- **PDF Export**: Use `UIGraphicsPDFRenderer` for rasterized PDFs or `PDFKit` for vector-based PDFs
- **SVG Export**: Programmatically construct SVG file strings for charts and visualizations
- Create reusable drawing functions for PDF templates

---

## 🎨 User Interaction Guidelines

### Fluid Motion: Advanced Animation and Easing

**Beyond Default Easing:**
- Use `easeOut` curves for UI elements appearing in response to user actions
- Use `easeInOut` curves for automatic transitions between states
- Implement anticipatory curves (e.g., `easeInBack`) for character and anticipation

**Choreographed Animation Patterns:**
- Create compound animations that work together
- Use `UIView.animateKeyframes` or SwiftUI's structured concurrency
- Synchronize animations with haptic feedback

**Matching Native Animation Physics:**
- Align timing and physics with platform standards
- Use reverse-engineered curves from libraries like `react-apple-easing`
- Achieve polish indistinguishable from native system animations

### Intuitive Control: Complex Gesture Support

**Standard Gestures:**
- **Tap**: For selection of data points, chart segments, legend items
- **Pinch**: For zooming in and out of charts or maps
- **Pan**: For scrolling or panning across visualizations

**Complex Gestures for Data Visualization:**
- **Rotation**: For 3D visualizations or rotatable maps
- **Long Press**: For revealing additional information without UI clutter
- **Custom Gestures**: Only for highly specialized contexts (last resort)

**Accessibility Alternatives:**
- Provide non-gesture alternatives for all core functionality
- Ensure every gesture action has a visible UI control
- Support users unable to perform certain gestures

### Strategic Expansion: New Capabilities

**Real-Time Collaboration:**
- Use Apple's `SharedWithYou` framework for collaboration initiation
- Implement `NSPersistentCloudKitContainer` for iCloud user data sync
- Use `MultipeerConnectivity` for serverless local network collaboration
- Consider third-party SDKs (Ably, Liveblocks, PubNub) for advanced features

**Mobile Analytics Dashboard:**
- Define audience and narrative before design
- Structure for clarity and focus with visual hierarchy
- Ensure responsive and adaptive layouts
- Choose appropriate visualizations for data types
- Draw inspiration from established patterns

**Innovative UI Components:**
- Look beyond standard charts for engaging experiences
- Create information-dense, aesthetically pleasing visualizations
- Implement interactive and modern analytics experiences

---

## 🔮 Future Enhancements

### Potential Improvements

1. **Forms Validation**
   - Internationalization support
   - Advanced async validation patterns
   - Real-time collaboration features

2. **Theme Validation**
   - AI-powered theme suggestions
   - Advanced performance analytics
   - Cross-platform theme synchronization

3. **Accessibility**
   - Advanced VoiceOver patterns
   - Multi-modal interaction support
   - Inclusive design automation

4. **Performance**
   - Advanced caching strategies
   - Real-time optimization
   - Cross-platform performance monitoring

---

*For more detailed information, see the [COMPREHENSIVE_PROJECT_DOCUMENTATION.md](./COMPREHENSIVE_PROJECT_DOCUMENTATION.md)* 