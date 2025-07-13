//
//  ThemeTransitionManager.swift
//  Aether SwiftUI App
//
//  Dynamic theme transitions with smooth animations and system integration.
//  This manager provides polished, delightful theme switching experiences
//  that respect user preferences and accessibility settings.
//

import SwiftUI
import Combine

// MARK: - Transition Types

/// Types of theme transitions available
enum ThemeTransitionType: String, CaseIterable {
    case fade = "Fade"
    case slide = "Slide"
    case scale = "Scale"
    case morph = "Morph"
    case crossfade = "Crossfade"
    case dissolve = "Dissolve"
    
    var description: String {
        switch self {
        case .fade:
            return "Smooth fade between themes"
        case .slide:
            return "Slide transition with direction"
        case .scale:
            return "Scale and fade combination"
        case .morph:
            return "Morphing color transitions"
        case .crossfade:
            return "Crossfade with blur effect"
        case .dissolve:
            return "Dissolve with particle effect"
        }
    }
}

// MARK: - Animation Curves

/// Predefined animation curves for theme transitions
enum ThemeAnimationCurve: String, CaseIterable {
    case easeInOut = "Ease In Out"
    case easeIn = "Ease In"
    case easeOut = "Ease Out"
    case spring = "Spring"
    case bouncy = "Bouncy"
    case smooth = "Smooth"
    
    var animation: Animation {
        switch self {
        case .easeInOut:
            return .easeInOut(duration: 0.6)
        case .easeIn:
            return .easeIn(duration: 0.5)
        case .easeOut:
            return .easeOut(duration: 0.5)
        case .spring:
            return .spring(response: 0.6, dampingFraction: 0.8, blendDuration: 0.3)
        case .bouncy:
            return .spring(response: 0.4, dampingFraction: 0.6, blendDuration: 0.2)
        case .smooth:
            return .interpolatingSpring(stiffness: 100, damping: 10)
        }
    }
}

// MARK: - Transition State

/// State tracking for theme transitions
class ThemeTransitionState: ObservableObject {
    @Published var isTransitioning = false
    @Published var transitionProgress: Double = 0.0
    @Published var currentTransitionType: ThemeTransitionType = .fade
    @Published var currentAnimationCurve: ThemeAnimationCurve = .easeInOut
    @Published var transitionDirection: Edge = .trailing
    
    // Transition timing
    let transitionDuration: Double = 0.6
    let morphingDuration: Double = 0.8
    
    // Accessibility support
    var shouldReduceMotion: Bool {
        UIAccessibility.isReduceMotionEnabled
    }
    
    var shouldReduceTransparency: Bool {
        UIAccessibility.isReduceTransparencyEnabled
    }
}

// MARK: - Theme Transition Manager

/// Manager for handling smooth theme transitions with animations
class ThemeTransitionManager: ObservableObject {
    @Published var transitionState = ThemeTransitionState()
    @Published var previousTheme: Theme?
    @Published var nextTheme: Theme?
    
    private var cancellables = Set<AnyCancellable>()
    private let themeManager: ThemeManager
    
    init(themeManager: ThemeManager) {
        self.themeManager = themeManager
        setupObservers()
    }
    
    // MARK: - Setup
    
    private func setupObservers() {
        // Observe theme changes
        themeManager.$currentTheme
            .sink { [weak self] newTheme in
                self?.handleThemeChange(to: newTheme)
            }
            .store(in: &cancellables)
        
        // Observe accessibility changes
        NotificationCenter.default.publisher(for: UIAccessibility.reduceMotionStatusDidChangeNotification)
            .sink { [weak self] _ in
                self?.updateAccessibilitySettings()
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Theme Transition Methods
    
    /// Perform a smooth theme transition
    /// - Parameters:
    ///   - to: Target theme
    ///   - type: Transition type
    ///   - curve: Animation curve
    ///   - direction: Transition direction (for slide transitions)
    func transitionToTheme(
        _ theme: Theme,
        type: ThemeTransitionType = .fade,
        curve: ThemeAnimationCurve = .easeInOut,
        direction: Edge = .trailing
    ) {
        guard !transitionState.isTransitioning else { return }
        
        // Store transition parameters
        previousTheme = themeManager.currentTheme
        nextTheme = theme
        transitionState.currentTransitionType = type
        transitionState.currentAnimationCurve = curve
        transitionState.transitionDirection = direction
        
        // Check accessibility settings
        if transitionState.shouldReduceMotion {
            // Instant transition for reduced motion
            performInstantTransition(to: theme)
        } else {
            // Animated transition
            performAnimatedTransition(to: theme, type: type, curve: curve)
        }
    }
    
    /// Perform an instant transition (for accessibility)
    private func performInstantTransition(to theme: Theme) {
        withAnimation(.none) {
            themeManager.currentTheme = theme
            transitionState.isTransitioning = false
            transitionState.transitionProgress = 1.0
        }
        
        // Reset after a brief delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.transitionState.transitionProgress = 0.0
            self.previousTheme = nil
            self.nextTheme = nil
        }
    }
    
    /// Perform an animated transition
    private func performAnimatedTransition(
        to theme: Theme,
        type: ThemeTransitionType,
        curve: ThemeAnimationCurve
    ) {
        transitionState.isTransitioning = true
        transitionState.transitionProgress = 0.0
        
        // Start transition animation
        withAnimation(curve.animation) {
            transitionState.transitionProgress = 1.0
        }
        
        // Apply theme change at midpoint for smooth transition
        DispatchQueue.main.asyncAfter(deadline: .now() + curve.animation.duration * 0.5) {
            self.themeManager.currentTheme = theme
        }
        
        // Complete transition
        DispatchQueue.main.asyncAfter(deadline: .now() + curve.animation.duration) {
            self.completeTransition()
        }
    }
    
    /// Complete the transition and cleanup
    private func completeTransition() {
        withAnimation(.easeOut(duration: 0.2)) {
            transitionState.isTransitioning = false
        }
        
        // Reset state
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
            self.transitionState.transitionProgress = 0.0
            self.previousTheme = nil
            self.nextTheme = nil
        }
    }
    
    /// Handle theme change from theme manager
    private func handleThemeChange(to theme: Theme) {
        // This is called when theme manager changes the theme
        // We can add additional transition logic here if needed
    }
    
    /// Update accessibility settings
    private func updateAccessibilitySettings() {
        // Adjust transition behavior based on accessibility settings
        if transitionState.shouldReduceMotion {
            transitionState.currentAnimationCurve = .easeInOut
        }
    }
    
    // MARK: - Transition Effects
    
    /// Get transition effect for a specific transition type
    func transitionEffect(for type: ThemeTransitionType) -> some ViewModifier {
        switch type {
        case .fade:
            return FadeTransitionModifier(progress: transitionState.transitionProgress)
        case .slide:
            return SlideTransitionModifier(
                progress: transitionState.transitionProgress,
                direction: transitionState.transitionDirection
            )
        case .scale:
            return ScaleTransitionModifier(progress: transitionState.transitionProgress)
        case .morph:
            return MorphTransitionModifier(progress: transitionState.transitionProgress)
        case .crossfade:
            return CrossfadeTransitionModifier(progress: transitionState.transitionProgress)
        case .dissolve:
            return DissolveTransitionModifier(progress: transitionState.transitionProgress)
        }
    }
    
    /// Get interpolated color between two themes
    func interpolatedColor(
        from startColor: Color,
        to endColor: Color,
        progress: Double
    ) -> Color {
        let interpolated = startColor.interpolated(to: endColor, amount: progress)
        return interpolated
    }
}

// MARK: - Transition Modifiers

/// Fade transition modifier
struct FadeTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .opacity(progress)
            .animation(.easeInOut(duration: 0.6), value: progress)
    }
}

/// Slide transition modifier
struct SlideTransitionModifier: ViewModifier {
    let progress: Double
    let direction: Edge
    
    func body(content: Content) -> some View {
        content
            .offset(offset)
            .animation(.easeInOut(duration: 0.6), value: progress)
    }
    
    private var offset: CGSize {
        let distance: CGFloat = 100
        switch direction {
        case .leading:
            return CGSize(width: -distance * (1 - progress), height: 0)
        case .trailing:
            return CGSize(width: distance * (1 - progress), height: 0)
        case .top:
            return CGSize(width: 0, height: -distance * (1 - progress))
        case .bottom:
            return CGSize(width: 0, height: distance * (1 - progress))
        }
    }
}

/// Scale transition modifier
struct ScaleTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .scaleEffect(scale)
            .opacity(progress)
            .animation(.spring(response: 0.6, dampingFraction: 0.8), value: progress)
    }
    
    private var scale: CGFloat {
        return 0.8 + (0.2 * progress)
    }
}

/// Morph transition modifier
struct MorphTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .blur(radius: blurRadius)
            .scaleEffect(scale)
            .animation(.easeInOut(duration: 0.8), value: progress)
    }
    
    private var blurRadius: CGFloat {
        return 2.0 * (1 - progress)
    }
    
    private var scale: CGFloat {
        return 0.95 + (0.05 * progress)
    }
}

/// Crossfade transition modifier
struct CrossfadeTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .blur(radius: blurRadius)
            .opacity(progress)
            .animation(.easeInOut(duration: 0.7), value: progress)
    }
    
    private var blurRadius: CGFloat {
        return 1.0 * (1 - progress)
    }
}

/// Dissolve transition modifier
struct DissolveTransitionModifier: ViewModifier {
    let progress: Double
    
    func body(content: Content) -> some View {
        content
            .opacity(progress)
            .blur(radius: dissolveBlur)
            .animation(.easeInOut(duration: 0.6), value: progress)
    }
    
    private var dissolveBlur: CGFloat {
        return 0.5 * (1 - progress)
    }
}

// MARK: - Color Extensions

extension Color {
    /// Interpolate between two colors
    func interpolated(to other: Color, amount: Double) -> Color {
        // This is a simplified interpolation
        // In a real implementation, you'd want to interpolate RGB/HSB values
        return amount > 0.5 ? other : self
    }
}

// MARK: - Animation Extensions

extension Animation {
    var duration: Double {
        // Extract duration from animation
        // This is a simplified implementation
        return 0.6
    }
}

// MARK: - View Extensions

extension View {
    /// Apply theme transition effect
    func themeTransition(
        _ type: ThemeTransitionType,
        progress: Double
    ) -> some View {
        switch type {
        case .fade:
            return self.opacity(progress)
        case .slide:
            return self.offset(x: 100 * (1 - progress))
        case .scale:
            return self.scaleEffect(0.8 + (0.2 * progress))
        case .morph:
            return self.blur(radius: 2.0 * (1 - progress))
        case .crossfade:
            return self.blur(radius: 1.0 * (1 - progress))
        case .dissolve:
            return self.opacity(progress).blur(radius: 0.5 * (1 - progress))
        }
    }
} 