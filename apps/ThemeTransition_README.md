# Dynamic Theme Transitions

> *Smooth, animated theme switching with accessibility support and system integration*

---

## 🔄 Overview

The Dynamic Theme Transitions system provides polished, delightful theme switching experiences that respect user preferences and accessibility settings. Instead of jarring instant theme changes, this system offers smooth animated transitions with various effects and animation curves.

### Key Features

- **Multiple Transition Types**: Fade, slide, scale, morph, crossfade, and dissolve effects
- **Animation Curves**: Ease in/out, spring, bouncy, and smooth curves
- **Accessibility Support**: Respects reduce motion and reduce transparency settings
- **System Integration**: Deep integration with platform accessibility APIs
- **Performance Optimized**: Uses native animation drivers for smooth 60fps transitions
- **Type Safe**: Full TypeScript/Swift type safety for all transition parameters

---

## 🏗️ Architecture

### Core Components

1. **ThemeTransitionManager**: Central manager for handling transitions
2. **Transition Types**: Enumeration of available transition effects
3. **Animation Curves**: Predefined easing functions for smooth motion
4. **Accessibility Integration**: Automatic adaptation to user preferences
5. **State Management**: Reactive state tracking for transition progress

### Platform Implementation

#### SwiftUI Implementation
- Uses `withAnimation` and `@Published` properties for reactive updates
- Integrates with `UIAccessibility` for system-level accessibility support
- Leverages SwiftUI's declarative animation system
- Supports custom view modifiers for transition effects

#### React Native Implementation
- Uses `Animated` API with native driver for performance
- Integrates with `AccessibilityInfo` for accessibility support
- Provides custom hooks for easy component integration
- Supports interpolated animations for smooth transitions

---

## 🎨 Transition Types

### 1. Fade Transition
```swift
// SwiftUI
.transition(.opacity)
.animation(.easeInOut(duration: 0.6), value: isTransitioning)
```

```tsx
// React Native
const fadeStyle = createFadeStyle(progress);
<Animated.View style={fadeStyle}>
```

**Description**: Smooth opacity transition between themes
**Best Use**: General theme switching, subtle changes
**Duration**: 600ms

### 2. Slide Transition
```swift
// SwiftUI
.transition(.asymmetric(
    insertion: .move(edge: .trailing),
    removal: .move(edge: .leading)
))
```

```tsx
// React Native
const slideStyle = createSlideStyle(progress, TransitionDirection.RIGHT);
<Animated.View style={slideStyle}>
```

**Description**: Slide content in/out with directional movement
**Best Use**: Navigation-like transitions, dramatic changes
**Directions**: Left, Right, Up, Down

### 3. Scale Transition
```swift
// SwiftUI
.scaleEffect(0.8 + (0.2 * progress))
.opacity(progress)
```

```tsx
// React Native
const scaleStyle = createScaleStyle(progress);
<Animated.View style={scaleStyle}>
```

**Description**: Scale and fade combination for emphasis
**Best Use**: Important changes, focus transitions
**Scale Range**: 0.8 to 1.0

### 4. Morph Transition
```swift
// SwiftUI
.blur(radius: 2.0 * (1 - progress))
.scaleEffect(0.95 + (0.05 * progress))
```

```tsx
// React Native
const morphStyle = createMorphStyle(progress);
<Animated.View style={morphStyle}>
```

**Description**: Blur and subtle scale for organic feel
**Best Use**: Content updates, organic transitions
**Blur Range**: 2.0 to 0.0

### 5. Crossfade Transition
```swift
// SwiftUI
.blur(radius: 1.0 * (1 - progress))
.opacity(progress)
```

```tsx
// React Native
const crossfadeStyle = createCrossfadeStyle(progress);
<Animated.View style={crossfadeStyle}>
```

**Description**: Blur-based crossfade effect
**Best Use**: Content replacement, smooth updates
**Blur Range**: 1.0 to 0.0

### 6. Dissolve Transition
```swift
// SwiftUI
.opacity(progress)
.blur(radius: 0.5 * (1 - progress))
```

```tsx
// React Native
const dissolveStyle = createDissolveStyle(progress);
<Animated.View style={dissolveStyle}>
```

**Description**: Particle-like dissolve effect
**Best Use**: Dramatic changes, special effects
**Blur Range**: 0.5 to 0.0

---

## 📈 Animation Curves

### Ease In Out
```swift
.animation(.easeInOut(duration: 0.6), value: progress)
```

```tsx
const config = {
  duration: 600,
  easing: Easing.inOut(Easing.ease),
};
```

**Characteristics**: Smooth start and end, natural feel
**Best Use**: General transitions, content updates

### Spring
```swift
.animation(.spring(response: 0.6, dampingFraction: 0.8), value: progress)
```

```tsx
const config = {
  duration: 600,
  easing: Easing.out(Easing.back(1.2)),
};
```

**Characteristics**: Bouncy, playful feel
**Best Use**: Interactive elements, playful interfaces

### Bouncy
```swift
.animation(.spring(response: 0.4, dampingFraction: 0.6), value: progress)
```

```tsx
const config = {
  duration: 400,
  easing: Easing.out(Easing.back(1.5)),
};
```

**Characteristics**: More pronounced bounce
**Best Use**: Attention-grabbing transitions

### Smooth
```swift
.animation(.interpolatingSpring(stiffness: 100, damping: 10), value: progress)
```

```tsx
const config = {
  duration: 800,
  easing: Easing.inOut(Easing.cubic),
};
```

**Characteristics**: Very smooth, fluid motion
**Best Use**: Premium feel, sophisticated interfaces

---

## ♿ Accessibility Support

### Automatic Adaptation

The system automatically detects and respects user accessibility preferences:

```swift
// SwiftUI
var shouldReduceMotion: Bool {
    UIAccessibility.isReduceMotionEnabled
}

var shouldReduceTransparency: Bool {
    UIAccessibility.isReduceTransparencyEnabled
}
```

```tsx
// React Native
const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
const isReduceTransparencyEnabled = await AccessibilityInfo.isReduceTransparencyEnabled();
```

### Reduced Motion Behavior

When `reduceMotion` is enabled:
- Transitions become instant or very fast
- Spring animations are replaced with linear easing
- Complex effects are simplified
- Duration is reduced to 100-200ms

### Reduced Transparency Behavior

When `reduceTransparency` is enabled:
- Blur effects are disabled
- Opacity changes are minimized
- Focus is on content clarity

---

## 🚀 Usage Examples

### SwiftUI Implementation

```swift
struct ThemeTransitionExample: View {
    @StateObject private var themeManager = ThemeManager()
    @StateObject private var transitionManager: ThemeTransitionManager
    
    var body: some View {
        VStack {
            // Theme selection buttons
            HStack {
                ForEach(["Light", "Dark", "Purple"], id: \.self) { themeName in
                    Button(themeName) {
                        let newTheme = getTheme(for: themeName)
                        transitionManager.transitionToTheme(
                            newTheme,
                            type: .fade,
                            curve: .easeInOut
                        )
                    }
                }
            }
            
            // Live preview with transition
            PreviewCard()
                .themeTransition(
                    transitionManager.transitionState.currentTransitionType,
                    progress: transitionManager.transitionState.transitionProgress
                )
        }
        .environmentObject(themeManager)
        .environmentObject(transitionManager)
    }
}
```

### React Native Implementation

```tsx
const ThemeTransitionExample: React.FC = () => {
  const { theme, switchTheme } = useTheme();
  const { transitionState, transitionToTheme, getTransitionProgress } = useThemeTransition();

  const handleThemeChange = (newThemeName: string) => {
    const newTheme = getTheme(newThemeName);
    transitionToTheme(
      theme,
      newTheme,
      ThemeTransitionType.FADE,
      ThemeAnimationCurve.EASE_IN_OUT,
      TransitionDirection.RIGHT,
      () => {
        switchTheme(newThemeName as any);
      }
    );
  };

  return (
    <View>
      {/* Theme selection */}
      <View style={styles.themeButtons}>
        {['light', 'dark', 'purple'].map(themeName => (
          <TouchableOpacity
            key={themeName}
            onPress={() => handleThemeChange(themeName)}
          >
            <Text>{themeName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Animated preview */}
      <Animated.View
        style={[
          styles.previewCard,
          getTransitionStyle(
            transitionState.currentTransitionType,
            getTransitionProgress(),
            transitionState.transitionDirection
          ),
        ]}
      >
        <Text>Preview Content</Text>
      </Animated.View>
    </View>
  );
};
```

---

## 🎯 Best Practices

### 1. Choose Appropriate Transitions

- **Fade**: Use for subtle theme changes
- **Slide**: Use for navigation-like transitions
- **Scale**: Use for important content changes
- **Morph**: Use for organic, natural transitions
- **Crossfade**: Use for content replacement
- **Dissolve**: Use for dramatic effects

### 2. Respect User Preferences

```swift
// Always check accessibility settings
if transitionState.shouldReduceMotion {
    // Use instant or very fast transitions
    performInstantTransition(to: newTheme)
} else {
    // Use full animated transitions
    performAnimatedTransition(to: newTheme, type: type, curve: curve)
}
```

### 3. Optimize Performance

```tsx
// Use native driver for transform and opacity animations
const animation = Animated.timing(progress, {
  toValue: 1,
  duration: 600,
  easing: Easing.inOut(Easing.ease),
  useNativeDriver: true, // Important for performance
});
```

### 4. Provide Visual Feedback

```swift
// Show transition progress
if transitionState.isTransitioning {
    ProgressView()
        .progressViewStyle(CircularProgressViewStyle())
}
```

### 5. Handle Edge Cases

```tsx
// Prevent multiple simultaneous transitions
if (transitionState.isTransitioning) {
    return; // Don't start new transition
}
```

---

## 🔧 Configuration

### Transition Timing

```swift
// SwiftUI - Custom timing
let customAnimation = Animation.easeInOut(duration: 0.8)
    .delay(0.1)
    .speed(1.2)
```

```tsx
// React Native - Custom config
const customConfig = {
  duration: 800,
  easing: Easing.inOut(Easing.cubic),
  delay: 100,
};
```

### Custom Transition Effects

```swift
// SwiftUI - Custom modifier
struct CustomTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .rotationEffect(.degrees(progress * 360))
            .scaleEffect(0.5 + (0.5 * progress))
    }
}
```

```tsx
// React Native - Custom style
const customStyle = (progress: Animated.Value) => {
  const rotation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return {
    transform: [{ rotate: rotation }],
  };
};
```

---

## 🧪 Testing

### Unit Tests

```swift
// SwiftUI Tests
class ThemeTransitionManagerTests: XCTestCase {
    func testTransitionToTheme() {
        let manager = ThemeTransitionManager(themeManager: mockThemeManager)
        let expectation = XCTestExpectation(description: "Transition completed")
        
        manager.transitionToTheme(newTheme, type: .fade) {
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 1.0)
    }
}
```

```tsx
// React Native Tests
describe('ThemeTransitionManager', () => {
  it('should perform theme transition', async () => {
    const manager = new ThemeTransitionManager();
    const mockCallback = jest.fn();
    
    manager.transitionToTheme(
      mockCurrentTheme,
      mockNewTheme,
      ThemeTransitionType.FADE,
      ThemeAnimationCurve.EASE_IN_OUT,
      TransitionDirection.RIGHT,
      mockCallback
    );
    
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
```

### Accessibility Testing

```swift
// Test reduced motion behavior
func testReducedMotionBehavior() {
    // Simulate reduced motion enabled
    UIAccessibility.isReduceMotionEnabled = true
    
    let manager = ThemeTransitionManager(themeManager: mockThemeManager)
    manager.transitionToTheme(newTheme, type: .fade)
    
    // Verify instant transition
    XCTAssertTrue(manager.transitionState.isTransitioning == false)
}
```

---

## 📱 Platform-Specific Considerations

### iOS/SwiftUI

- **Advantages**: Native animation system, excellent performance
- **Considerations**: iOS version compatibility, device performance
- **Best Practices**: Use `withAnimation` blocks, leverage SwiftUI's declarative nature

### React Native

- **Advantages**: Cross-platform, flexible animation system
- **Considerations**: JavaScript bridge overhead, platform differences
- **Best Practices**: Use native driver, optimize re-renders

### Performance Comparison

| Platform | Animation Driver | Performance | Memory Usage |
|----------|------------------|-------------|--------------|
| SwiftUI | Native | Excellent | Low |
| React Native | Native Driver | Good | Medium |
| React Native | JS Driver | Fair | High |

---

## 🔮 Future Enhancements

### Planned Features

1. **Advanced Color Interpolation**: Proper RGB/HSB color interpolation
2. **Custom Easing Functions**: User-defined animation curves
3. **Transition Sequences**: Complex multi-step transitions
4. **Gesture-Based Transitions**: Swipe and pinch gestures
5. **3D Transitions**: Depth and perspective effects
6. **Particle Effects**: Advanced visual effects
7. **Transition Templates**: Pre-built transition combinations

### Performance Optimizations

1. **GPU Acceleration**: Enhanced hardware acceleration
2. **Memory Management**: Optimized memory usage for complex transitions
3. **Batch Updates**: Efficient state updates
4. **Lazy Loading**: On-demand transition effect loading

---

## 📚 Additional Resources

### Documentation
- [SwiftUI Animations](https://developer.apple.com/documentation/swiftui/animation)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)

### Examples
- [ThemeTransitionExample.swift](./swiftui-app/ThemeTransitionExample.swift)
- [ThemeTransitionExample.tsx](./react-native-app/src/components/ThemeTransitionExample.tsx)
- [ThemeTransitionManager.swift](./swiftui-app/ThemeTransitionManager.swift)
- [ThemeTransitionManager.ts](./react-native-app/src/theme/ThemeTransitionManager.ts)

### Related Components
- [ThemeManager](./swiftui-app/ThemeManager.swift)
- [ThemeProvider](./react-native-app/src/theme/ThemeProvider.tsx)
- [AetherGlassCard](./react-native-app/src/components/AetherGlassCard.styled.tsx)

---

*This documentation covers the comprehensive implementation of dynamic theme transitions for both SwiftUI and React Native platforms, providing smooth, accessible, and performant theme switching experiences.* 