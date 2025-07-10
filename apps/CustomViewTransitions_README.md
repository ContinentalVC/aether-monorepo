# Custom View Transitions

> *Sophisticated custom view transitions with asymmetric animations and transition container views for complex, overlapping theme transitions.*

---

## 🎯 Overview

This implementation provides advanced custom view transitions that go beyond simple fade or slide effects. It introduces **transition container views** that can host both "from" and "to" view states simultaneously, enabling complex, overlapping animations with asymmetric behaviors.

### Key Features

- **Transition Container Views**: Host both outgoing and incoming views simultaneously
- **Asymmetric Animations**: Different behaviors for insertion and removal
- **Complex Overlapping Effects**: Multiple views can animate simultaneously
- **6 Custom Transition Types**: From simple slides to 3D card flips
- **Real-time Progress Tracking**: Monitor transition progress with callbacks
- **Accessibility Support**: Respects user preferences for reduced motion
- **Performance Optimized**: Uses native animation drivers and efficient state management

---

## 🏗️ Architecture

### Core Components

#### 1. Transition Container View
The heart of the system - a container that manages both the outgoing ("from") and incoming ("to") views simultaneously:

```swift
// SwiftUI
struct TransitionContainerView<FromView: View, ToView: View>: View {
    let fromView: FromView
    let toView: ToView
    let transitionProgress: Double
    let transitionType: CustomTransitionType
    let isTransitioning: Bool
}
```

```typescript
// React Native
interface TransitionContainerProps {
  fromView: React.ReactNode;
  toView: React.ReactNode;
  transitionProgress: Animated.Value;
  transitionType: CustomTransitionType;
  isTransitioning: boolean;
}
```

#### 2. Advanced Transition Manager
Manages the transition lifecycle, timing, and state:

```swift
// SwiftUI
class AdvancedTransitionManager: ObservableObject {
    @Published var transitionProgress: Double = 0.0
    @Published var isTransitioning = false
    @Published var currentTransitionType: CustomTransitionType
    @Published var fromTheme: Theme?
    @Published var toTheme: Theme?
}
```

```typescript
// React Native
export class AdvancedTransitionManager {
  private state: AdvancedTransitionManagerState;
  private listeners: Set<(state: AdvancedTransitionManagerState) => void>;
  private animationTimer: NodeJS.Timeout | null;
}
```

#### 3. Custom Transition Types
Six sophisticated transition types with different behaviors:

| Type | Description | Duration | Effect |
|------|-------------|----------|---------|
| **Slide In/Out** | Asymmetric slide with fade | 800ms | Horizontal slide with opacity |
| **Scale & Rotate** | Scale and rotation combination | 1000ms | Scale + rotation + opacity |
| **Morph & Blur** | Morphing with blur effects | 900ms | Scale + blur + opacity |
| **Crossfade Overlap** | Overlapping crossfade | 700ms | Offset + opacity + blur |
| **Dissolve Particle** | Particle-like dissolve | 600ms | Scale + opacity |
| **Flip Card** | 3D card flip effect | 1200ms | 3D rotation + opacity |

---

## 🎨 Transition Types Deep Dive

### 1. Slide In/Out
**Asymmetric slide with fade effect**

```swift
// SwiftUI Implementation
case .slideInOut:
    fromViewOffset = CGSize(width: -300 * progress, height: 0)
    toViewOffset = CGSize(width: 300 * (1 - progress), height: 0)
    fromViewOpacity = 1.0 - progress
    toViewOpacity = progress
```

```typescript
// React Native Implementation
case 'slideInOut':
    transitionState.fromViewOffset.setValue({ x: -300 * progress, y: 0 });
    transitionState.toViewOffset.setValue({ x: 300 * (1 - progress), y: 0 });
    transitionState.fromViewOpacity.setValue(1 - progress);
    transitionState.toViewOpacity.setValue(progress);
```

**Characteristics:**
- Outgoing view slides left while fading out
- Incoming view slides in from right while fading in
- Smooth horizontal motion with opacity transitions

### 2. Scale & Rotate
**Complex transformation combining scale and rotation**

```swift
case .scaleRotate:
    fromViewScale = 1.0 - (0.3 * progress)
    toViewScale = 0.5 + (0.5 * progress)
    fromViewRotation = progress * 90
    toViewRotation = 180 - (90 * progress)
```

**Characteristics:**
- Outgoing view shrinks and rotates clockwise
- Incoming view grows from small size and rotates counter-clockwise
- Creates a dynamic, energetic transition

### 3. Morph & Blur
**Morphing effect with blur transitions**

```swift
case .morphBlur:
    fromViewOpacity = 1.0 - progress
    toViewOpacity = progress
    fromViewScale = 1.0 - (0.1 * progress)
    toViewScale = 0.8 + (0.2 * progress)
    fromViewBlurRadius = 2.0 * progress
    toViewBlurRadius = 2.0 * (1 - progress)
```

**Characteristics:**
- Subtle scale changes create morphing effect
- Blur increases on outgoing view, decreases on incoming
- Smooth, organic transition feeling

### 4. Crossfade Overlap
**Overlapping crossfade with offset**

```swift
case .crossfadeOverlap:
    fromViewOpacity = 1.0 - (progress * 0.7)
    toViewOpacity = progress
    fromViewOffset = CGSize(width: -50 * progress, height: 0)
    toViewOffset = CGSize(width: 50 * (1 - progress), height: 0)
```

**Characteristics:**
- Views overlap during transition
- Outgoing view doesn't fully disappear until 70% progress
- Small horizontal offset creates depth

### 5. Dissolve Particle
**Particle-like dissolve effect**

```swift
case .dissolveParticle:
    fromViewOpacity = 1.0 - progress
    toViewOpacity = progress
    fromViewScale = 1.0 + (0.2 * progress)
    toViewScale = 1.2 - (0.2 * progress)
```

**Characteristics:**
- Outgoing view expands slightly while fading
- Incoming view contracts from larger size
- Creates particle-like dissolution effect

### 6. Flip Card
**3D card flip with rotation**

```swift
case .flipCard:
    if progress < 0.5 {
        fromViewRotation = progress * 90
        toViewRotation = 90
        fromViewOpacity = 1.0
        toViewOpacity = 0.0
    } else {
        fromViewRotation = 90
        toViewRotation = 90 - ((progress - 0.5) * 90)
        fromViewOpacity = 0.0
        toViewOpacity = 1.0
    }
```

**Characteristics:**
- Two-phase transition (flip out, flip in)
- 3D rotation effect around Y-axis
- Realistic card flip animation

---

## 🚀 Usage Examples

### SwiftUI Implementation

```swift
struct CustomViewTransitionsExample: View {
    @StateObject private var advancedTransitionManager = AdvancedTransitionManager()
    @State private var selectedTransitionType: CustomTransitionType = .slideInOut
    
    var body: some View {
        VStack {
            // Transition container with both views
            if advancedTransitionManager.isTransitioning,
               let fromTheme = advancedTransitionManager.fromTheme,
               let toTheme = advancedTransitionManager.toTheme {
                
                advancedTransitionManager.createTransitionContainer(
                    fromView: TransitionPreviewCard(
                        theme: fromTheme,
                        title: "From Theme",
                        subtitle: "Outgoing state"
                    ),
                    toView: TransitionPreviewCard(
                        theme: toTheme,
                        title: "To Theme",
                        subtitle: "Incoming state"
                    )
                )
                .frame(height: 200)
            }
            
            // Trigger transition
            Button("Perform Transition") {
                advancedTransitionManager.performCustomTransition(
                    from: currentTheme,
                    to: newTheme,
                    type: selectedTransitionType
                ) {
                    // Apply theme change after transition
                    themeManager.currentTheme = newTheme
                }
            }
        }
        .advancedTransitionManager(advancedTransitionManager)
    }
}
```

### React Native Implementation

```typescript
const CustomViewTransitionsExample: React.FC = () => {
  const { manager, state } = useAdvancedTransitionManager();
  const [selectedTransitionType, setSelectedTransitionType] = useState(
    CUSTOM_TRANSITION_TYPES[0]
  );

  return (
    <View style={styles.container}>
      {/* Transition container with both views */}
      {state.isTransitioning && state.fromTheme && state.toTheme ? (
        <View style={styles.previewContainer}>
          {manager.createTransitionContainer(
            <TransitionPreviewCard
              theme={state.fromTheme}
              title="From Theme"
              subtitle="Outgoing state"
            />,
            <TransitionPreviewCard
              theme={state.toTheme}
              title="To Theme"
              subtitle="Incoming state"
            />,
            { height: 200 }
          )}
        </View>
      ) : (
        <TransitionPreviewCard
          theme={theme}
          title="Current Theme"
          subtitle="Static preview"
          style={{ height: 200 }}
        />
      )}

      {/* Trigger transition */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          manager.performCustomTransition(
            theme,
            newTheme,
            selectedTransitionType,
            () => {
              // Apply theme change after transition
              setTheme(newTheme);
            }
          );
        }}
      >
        <Text>Perform Transition</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## ⚙️ Configuration Options

### Transition Timing

```swift
// SwiftUI - Custom duration
let customType = CustomTransitionType.slideInOut
customType.duration = 1.5 // Override default 800ms

// React Native - Custom duration
const customType = {
  ...CUSTOM_TRANSITION_TYPES[0],
  duration: 1500 // Override default 800ms
};
```

### Animation Curves

```swift
// SwiftUI - Custom easing
.animation(.easeInOut(duration: 0.6), value: transitionProgress)
.animation(.spring(response: 0.6, dampingFraction: 0.8), value: transitionProgress)

// React Native - Custom easing
Animated.timing(transitionProgress, {
  toValue: 1,
  duration: type.duration,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom bezier curve
  useNativeDriver: true,
}).start();
```

### Accessibility Support

```swift
// SwiftUI - Respect reduced motion
@Environment(\.accessibilityReduceMotion) var reduceMotion

if reduceMotion {
    // Use simplified transition
    .animation(.none, value: transitionProgress)
} else {
    // Use full transition
    .animation(.easeInOut(duration: 0.6), value: transitionProgress)
}
```

```typescript
// React Native - Respect reduced motion
import { AccessibilityInfo } from 'react-native';

const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  const subscription = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    setReduceMotion
  );
  return () => subscription?.remove();
}, []);

// Use simplified transition if reduced motion is enabled
const duration = reduceMotion ? 0 : type.duration;
```

---

## 🔧 Advanced Customization

### Custom Transition Types

```swift
// SwiftUI - Create custom transition type
extension CustomTransitionType {
    static let customMorph = CustomTransitionType(
        rawValue: "Custom Morph",
        description: "Custom morphing effect",
        duration: 1.2
    )
}

// Implement custom behavior
case .customMorph:
    fromViewScale = 1.0 - (0.2 * progress)
    toViewScale = 0.7 + (0.3 * progress)
    fromViewRotation = progress * 45
    toViewRotation = -45 + (45 * progress)
```

```typescript
// React Native - Create custom transition type
const CUSTOM_MORPH: CustomTransitionType = {
  name: 'Custom Morph',
  description: 'Custom morphing effect',
  duration: 1200,
  type: 'customMorph',
};

// Implement custom behavior in updateTransitionState
case 'customMorph':
  transitionState.fromViewScale.setValue(1 - (0.2 * progress));
  transitionState.toViewScale.setValue(0.7 + (0.3 * progress));
  transitionState.fromViewRotation.setValue(progress * 45);
  transitionState.toViewRotation.setValue(-45 + (45 * progress));
  break;
```

### Custom AnyTransition (SwiftUI)

```swift
extension AnyTransition {
    static func customMorphTransition(progress: Double) -> AnyTransition {
        .asymmetric(
            insertion: .scale(scale: 0.7).combined(with: .rotation(.degrees(-45))),
            removal: .scale(scale: 1.2).combined(with: .rotation(.degrees(45)))
        )
    }
}

// Usage
.transition(.customMorphTransition(progress: transitionProgress))
```

### Performance Optimization

```swift
// SwiftUI - Use native driver where possible
.animation(.easeInOut(duration: 0.6), value: transitionProgress)
// SwiftUI automatically uses native drivers for supported properties

// React Native - Explicit native driver
const animatedValue = useRef(new Animated.Value(0)).current;

Animated.timing(animatedValue, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true, // Use native driver for better performance
}).start();
```

---

## 🧪 Testing Strategies

### Unit Testing

```swift
// SwiftUI - Test transition manager
class AdvancedTransitionManagerTests: XCTestCase {
    func testTransitionProgress() {
        let manager = AdvancedTransitionManager()
        let expectation = XCTestExpectation(description: "Transition completed")
        
        manager.performCustomTransition(
            from: testTheme1,
            to: testTheme2,
            type: .slideInOut
        ) {
            XCTAssertEqual(manager.transitionProgress, 0.0)
            XCTAssertFalse(manager.isTransitioning)
            expectation.fulfill()
        }
        
        wait(for: [expectation], timeout: 2.0)
    }
}
```

```typescript
// React Native - Test transition manager
describe('AdvancedTransitionManager', () => {
  it('should complete transition successfully', (done) => {
    const manager = new AdvancedTransitionManager();
    
    manager.performCustomTransition(
      testTheme1,
      testTheme2,
      CUSTOM_TRANSITION_TYPES[0],
      () => {
        const state = manager.getState();
        expect(state.isTransitioning).toBe(false);
        expect(state.transitionProgress._value).toBe(0);
        done();
      }
    );
  });
});
```

### Integration Testing

```swift
// SwiftUI - Test transition container
struct TransitionContainerTests: View {
    var body: some View {
        TransitionContainerView(
            fromView: Text("From"),
            toView: Text("To"),
            transitionProgress: 0.5,
            transitionType: .slideInOut,
            isTransitioning: true
        )
        .onAppear {
            // Verify both views are rendered
            // Verify animations are applied correctly
        }
    }
}
```

### Performance Testing

```swift
// SwiftUI - Measure transition performance
func measureTransitionPerformance() {
    let manager = AdvancedTransitionManager()
    let startTime = CFAbsoluteTimeGetCurrent()
    
    manager.performCustomTransition(
        from: testTheme1,
        to: testTheme2,
        type: .slideInOut
    ) {
        let endTime = CFAbsoluteTimeGetCurrent()
        let duration = endTime - startTime
        XCTAssertLessThan(duration, 1.0) // Should complete within 1 second
    }
}
```

---

## 📱 Platform-Specific Considerations

### SwiftUI Specifics

**Advantages:**
- Native animation system with automatic optimization
- Declarative syntax for complex animations
- Built-in support for accessibility features
- Automatic handling of view lifecycle

**Best Practices:**
- Use `withAnimation` for state changes
- Leverage `@State` and `@Published` for reactive updates
- Use `AnyTransition` for custom transitions
- Respect `accessibilityReduceMotion` environment value

### React Native Specifics

**Advantages:**
- Cross-platform consistency
- Native driver for 60fps animations
- Flexible animation composition
- Rich ecosystem of animation libraries

**Best Practices:**
- Always use `useNativeDriver: true` when possible
- Clean up animation listeners in `useEffect`
- Use `Animated.Value` for smooth interpolations
- Handle platform-specific animation differences

### Performance Comparison

| Platform | Animation Driver | Performance | Memory Usage | Complexity |
|----------|------------------|-------------|--------------|------------|
| **SwiftUI** | Native | Excellent | Low | Low |
| **React Native** | Native Driver | Good | Medium | Medium |

---

## 🔮 Future Enhancements

### Planned Features

1. **Spring Physics**: Add spring-based transitions with configurable damping
2. **Gesture Integration**: Support gesture-driven transitions
3. **3D Transforms**: Enhanced 3D rotation and perspective effects
4. **Particle Systems**: Advanced particle-based transitions
5. **Audio Feedback**: Haptic and audio cues during transitions

### Advanced Animation Types

```swift
// Future: Spring-based transitions
case .springMorph:
    // Use spring physics for organic motion
    withAnimation(.spring(response: 0.6, dampingFraction: 0.8)) {
        // Spring-based transformations
    }

// Future: Gesture-driven transitions
case .gestureDriven:
    // Respond to pan gestures for interactive transitions
    let dragGesture = DragGesture()
        .onChanged { value in
            // Update transition progress based on gesture
        }
```

### Integration with Design Systems

```swift
// Future: Design system integration
struct DesignSystemTransition {
    let type: CustomTransitionType
    let duration: Double
    let easing: Animation
    let accessibility: AccessibilityOptions
}

// Usage in design system
let primaryTransition = DesignSystemTransition(
    type: .slideInOut,
    duration: 0.8,
    easing: .easeInOut,
    accessibility: .respectsReduceMotion
)
```

---

## 📚 Additional Resources

### Documentation
- [SwiftUI Animations](https://developer.apple.com/documentation/SwiftUI/Animations)
- [React Native Animated](https://reactnative.dev/docs/animated)
- [Human Interface Guidelines - Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

### Related Libraries
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Lottie for React Native](https://github.com/lottie-react-native/lottie-react-native)
- [Rive for React Native](https://rive.app/docs/runtimes/react-native/)

### Performance Tools
- [SwiftUI Instruments](https://developer.apple.com/documentation/xcode/analyzing-performance-with-instruments)
- [React Native Performance Monitor](https://reactnative.dev/docs/performance)

---

## 🤝 Contributing

When contributing to the custom view transitions system:

1. **Follow Animation Principles**: Ensure transitions follow Disney's 12 principles of animation
2. **Test Performance**: Measure impact on frame rate and memory usage
3. **Consider Accessibility**: Always provide reduced motion alternatives
4. **Document Changes**: Update this README with new features and examples
5. **Cross-Platform Testing**: Test on both iOS and Android for React Native

---

## 📄 License

This implementation is part of the Aether Design System and follows the same licensing terms as the parent project.

---

*Built with ❤️ for creating delightful user experiences through sophisticated animations.* 