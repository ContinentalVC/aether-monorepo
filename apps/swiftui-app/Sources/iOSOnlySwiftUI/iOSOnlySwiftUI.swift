//
//  iOSOnlySwiftUI.swift
//  iOSOnlySwiftUI
//
//  Main entry point for iOS-only SwiftUI components
//  with proper platform availability annotations.
//

// MARK: - Package Information

public struct iOSOnlySwiftUI {
    public static let name = "iOSOnlySwiftUI"
    public static let version = "1.0.0"
    public static let description = "iOS-only SwiftUI components with platform compatibility"
}

#if os(iOS)
import SwiftUI

// MARK: - Public API

// Re-export all components directly without type aliases
// This avoids cross-reference issues between conditional compilation blocks

// The actual types are defined in their respective files:
// - UserInteraction.swift contains MetricCard, InteractiveButton, etc.
// - ThemeComponents.swift contains ThemeManager, AppTheme, etc.

// MARK: - Convenience Extensions

@available(iOS 15.0, *)
public extension View {
    /// Apply theme awareness to the view
    func withThemeAwareness() -> some View {
        modifier(ThemeAwareModifier())
    }
    
    /// Apply animated card styling to the view
    func asAnimatedCard(
        cornerRadius: CGFloat = 12,
        shadowRadius: CGFloat = 8,
        delay: Double = 0.0
    ) -> some View {
        AnimatedCard(
            cornerRadius: cornerRadius,
            shadowRadius: shadowRadius,
            delay: delay
        ) {
            self
        }
    }
    
    /// Apply themed card styling to the view
    func asThemedCard(padding: CGFloat = 16) -> some View {
        ThemedCard(padding: padding) {
            self
        }
    }
}

#endif 