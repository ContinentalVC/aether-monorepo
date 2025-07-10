# Layout and Hierarchy Preview System

> *Real-time visual feedback for design changes across Swift and React Native applications*

## 🎯 Overview

The Layout and Hierarchy Preview system provides immediate visual feedback as users modify design tokens (colors, fonts, spacing). It demonstrates how changes affect visual hierarchy, contrast, and the effective use of white space across different interface types.

## ✨ Key Features

### 🎨 Live Preview Canvas
- **Real-time Updates**: See design changes instantly across multiple interface types
- **Multiple Preview Types**: Dashboard, Article, Profile, Settings, and Card layouts
- **Dynamic Theming**: All previews automatically adapt to theme changes

### 📊 Visual Hierarchy Analysis
- **Hierarchy Levels**: Primary, Secondary, and Tertiary element identification
- **Typography Impact**: How font choices affect information hierarchy
- **Color Relationships**: Understanding color's role in visual hierarchy

### 📏 Spacing Analysis
- **Consistency Check**: Verify spacing scale usage across components
- **White Space Evaluation**: Analyze effective use of breathing room
- **Layout Balance**: Understand how spacing affects visual balance

### 🔍 Contrast Analysis
- **Accessibility Compliance**: Ensure WCAG contrast ratio requirements
- **Text Readability**: Verify text-background contrast effectiveness
- **Interactive Elements**: Check button and link contrast ratios

## 🏗️ Architecture

### SwiftUI Implementation

```
LayoutPreviewView.swift
├── LayoutPreviewView (Main container)
├── PreviewTypeSelector (Tab navigation)
├── LayoutPreviewCanvas (Live preview area)
├── DashboardPreview (Data visualization layout)
├── ArticlePreview (Long-form content layout)
├── ProfilePreview (User profile layout)
├── SettingsPreview (Configuration layout)
├── CardPreview (Content card layout)
├── HierarchyAnalysisView (Visual hierarchy breakdown)
├── SpacingAnalysisView (Spacing consistency check)
├── ContrastAnalysisView (Accessibility compliance)
└── LayoutGuideView (Educational content)
```

### React Native Implementation

```
LayoutPreviewView.tsx
├── LayoutPreviewView (Main component)
├── PreviewTypeSelector (Tab navigation)
├── LayoutPreviewCanvas (Live preview area)
├── DashboardPreview (Data visualization layout)
├── ArticlePreview (Long-form content layout)
├── ProfilePreview (User profile layout)
├── SettingsPreview (Configuration layout)
├── CardPreview (Content card layout)
├── HierarchyAnalysis (Visual hierarchy breakdown)
├── SpacingAnalysis (Spacing consistency check)
├── ContrastAnalysis (Accessibility compliance)
└── LayoutGuideView (Educational content)
```

## 🚀 Getting Started

### SwiftUI Integration

1. **Import the Layout Preview System**
```swift
import SwiftUI

// The LayoutPreviewView is already integrated into the theme system
```

2. **Use in Your App**
```swift
struct YourApp: View {
    @StateObject private var themeManager = ThemeManager()
    
    var body: some View {
        NavigationView {
            LayoutPreviewExample()
                .environmentObject(themeManager)
        }
    }
}
```

3. **Access Layout Preview**
```swift
// Show layout preview as a sheet
.sheet(isPresented: $showingLayoutPreview) {
    LayoutPreviewView()
        .environmentObject(themeManager)
}
```

### React Native Integration

1. **Import Components**
```typescript
import LayoutPreviewView from './src/components/LayoutPreviewView';
import LayoutGuideView from './src/components/LayoutGuideView';
import { useEnhancedTheme } from './src/theme/EnhancedThemeProvider';
```

2. **Use in Your App**
```typescript
const App = () => {
  return (
    <EnhancedThemeProvider initialTheme="light">
      <LayoutPreviewExample />
    </EnhancedThemeProvider>
  );
};
```

3. **Show Layout Preview**
```typescript
const [showLayoutPreview, setShowLayoutPreview] = useState(false);

<Modal visible={showLayoutPreview} animationType="slide">
  <LayoutPreviewView />
</Modal>
```

## 📱 Preview Types

### Dashboard Layout
- **Purpose**: Data visualization and metrics display
- **Elements**: Charts, stats cards, activity feeds
- **Focus**: Information density and data hierarchy

### Article Layout
- **Purpose**: Long-form content and typography
- **Elements**: Headings, body text, tags, metadata
- **Focus**: Readability and content hierarchy

### Profile Layout
- **Purpose**: User profiles and social elements
- **Elements**: Avatar, bio, stats, action buttons
- **Focus**: Personal branding and social interaction

### Settings Layout
- **Purpose**: Configuration and preferences
- **Elements**: Lists, toggles, navigation
- **Focus**: Clarity and ease of navigation

### Card Layout
- **Purpose**: Content cards and containers
- **Elements**: Images, titles, descriptions, actions
- **Focus**: Content presentation and interaction

## 🎨 Design Principles

### Visual Hierarchy
1. **Primary Elements**: Main headings and key information
2. **Secondary Elements**: Supporting content and subheadings
3. **Tertiary Elements**: Muted text and subtle information

### Spacing Guidelines
- **XS (4pt)**: Tight spacing for related elements
- **SM (8pt)**: Component-level spacing
- **MD (16pt)**: Section spacing
- **LG (24pt)**: Major section separation
- **XL (32pt)**: Page-level margins

### Contrast Requirements
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: High contrast for accessibility

## 🔧 Customization

### Adding New Preview Types

#### SwiftUI
```swift
// 1. Add new case to PreviewType enum
enum PreviewType: String, CaseIterable {
    case dashboard = "Dashboard"
    case article = "Article"
    case profile = "Profile"
    case settings = "Settings"
    case card = "Card"
    case yourNewType = "Your New Type" // Add here
}

// 2. Create preview component
struct YourNewTypePreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        // Your preview implementation
    }
}

// 3. Add to switch statement in LayoutPreviewCanvas
switch previewType {
case .yourNewType:
    YourNewTypePreview()
// ... other cases
}
```

#### React Native
```typescript
// 1. Add new type to PreviewType
type PreviewType = 'dashboard' | 'article' | 'profile' | 'settings' | 'card' | 'yourNewType';

// 2. Create preview component
const YourNewTypePreview: React.FC = () => {
  const { theme } = useEnhancedTheme();
  
  return (
    // Your preview implementation
  );
};

// 3. Add to render function
const renderPreviewContent = () => {
  switch (selectedPreviewType) {
    case 'yourNewType':
      return <YourNewTypePreview />;
    // ... other cases
  }
};
```

### Custom Analysis Components

#### SwiftUI
```swift
struct CustomAnalysisView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Custom Analysis")
                .font(.title3)
                .fontWeight(.semibold)
            
            // Your analysis content
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}
```

#### React Native
```typescript
const CustomAnalysis: React.FC = () => {
  const { theme } = useEnhancedTheme();
  
  return (
    <AnalysisContainer>
      <AnalysisTitle>Custom Analysis</AnalysisTitle>
      {/* Your analysis content */}
    </AnalysisContainer>
  );
};
```

## 📊 Performance Considerations

### SwiftUI
- **Lazy Loading**: Preview content loads only when needed
- **View Recycling**: Efficient view reuse for similar components
- **Memory Management**: Proper cleanup of preview resources

### React Native
- **Component Memoization**: Use React.memo for expensive components
- **Virtual Scrolling**: Efficient rendering of large lists
- **Image Optimization**: Proper image sizing and caching

## 🧪 Testing

### Unit Tests
```swift
// SwiftUI Tests
class LayoutPreviewViewTests: XCTestCase {
    func testPreviewTypeSelection() {
        // Test preview type switching
    }
    
    func testThemeIntegration() {
        // Test theme changes affect preview
    }
}
```

```typescript
// React Native Tests
describe('LayoutPreviewView', () => {
  it('should switch preview types correctly', () => {
    // Test preview type switching
  });
  
  it('should update with theme changes', () => {
    // Test theme integration
  });
});
```

### Integration Tests
- **Theme Integration**: Verify previews respond to theme changes
- **Accessibility**: Test contrast ratios and screen reader compatibility
- **Performance**: Measure rendering performance with different themes

## 🎯 Best Practices

### Design
1. **Consistent Spacing**: Use the defined spacing scale throughout
2. **Clear Hierarchy**: Maintain distinct visual levels
3. **Accessibility First**: Ensure sufficient contrast and readability
4. **Mobile Responsive**: Test on various screen sizes

### Development
1. **Component Reusability**: Create modular, reusable preview components
2. **Performance Optimization**: Implement efficient rendering strategies
3. **Type Safety**: Use strong typing for theme properties
4. **Documentation**: Maintain clear documentation for customizations

### User Experience
1. **Immediate Feedback**: Ensure real-time updates
2. **Educational Content**: Provide helpful guidance and explanations
3. **Intuitive Navigation**: Make preview types easy to discover
4. **Accessibility**: Support assistive technologies

## 🔮 Future Enhancements

### Planned Features
- **3D Layout Preview**: Three-dimensional visualization of layouts
- **Animation Preview**: Show how animations affect user experience
- **Collaborative Preview**: Real-time collaboration on design changes
- **Export Capabilities**: Export previews as images or videos

### Advanced Analysis
- **Heat Maps**: Visual representation of user attention areas
- **Eye Tracking Simulation**: Predict user gaze patterns
- **Performance Metrics**: Measure layout efficiency
- **A/B Testing**: Compare different design variations

## 📚 Resources

### Documentation
- [SwiftUI Layout Guidelines](https://developer.apple.com/design/human-interface-guidelines/layout)
- [React Native Layout System](https://reactnative.dev/docs/layout-props)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

### Design Systems
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Fluent Design System](https://fluent2.microsoft.design/)

### Tools
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Blindness Simulator](https://www.toptal.com/designers/colorfilter)
- [Typography Scale Calculator](https://type-scale.com/)

## 🤝 Contributing

We welcome contributions to improve the Layout and Hierarchy Preview system!

### How to Contribute
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Submit a pull request**

### Development Guidelines
- Follow existing code style and patterns
- Add comprehensive documentation
- Include unit tests for new features
- Test on multiple devices and screen sizes
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the Aether Team**

*Empowering designers and developers to create beautiful, accessible, and effective user interfaces.* 