//
//  ThemeComponents.swift
//  iOSOnlySwiftUI
//
//  iOS-only theme components with proper platform availability annotations.
//

#if os(iOS)
import SwiftUI
import UIKit

// MARK: - Theme Manager

@available(iOS 15.0, *)
public class ThemeManager: ObservableObject {
    public static let shared = ThemeManager()
    
    @Published public var currentTheme: AppTheme = .light
    @Published public var isDarkMode: Bool = false
    
    private init() {
        // Initialize with system appearance
        isDarkMode = UITraitCollection.current.userInterfaceStyle == .dark
        currentTheme = isDarkMode ? AppTheme.dark : AppTheme.light
    }
    
    public func toggleTheme() {
        withAnimation(.easeInOut(duration: 0.3)) {
            currentTheme = currentTheme == AppTheme.light ? AppTheme.dark : AppTheme.light
            isDarkMode = currentTheme == AppTheme.dark
        }
    }
    
    public func setTheme(_ theme: AppTheme) {
        withAnimation(.easeInOut(duration: 0.3)) {
            currentTheme = theme
            isDarkMode = theme == AppTheme.dark
        }
    }
}

// MARK: - App Theme

@available(iOS 15.0, *)
public enum AppTheme: String, CaseIterable {
    case light = "Light"
    case dark = "Dark"
    case auto = "Auto"
    
    public var displayName: String {
        return rawValue
    }
    
    public var icon: String {
        switch self {
        case .light:
            return "sun.max.fill"
        case .dark:
            return "moon.fill"
        case .auto:
            return "gear"
        }
    }
}

// MARK: - Color Scheme

@available(iOS 15.0, *)
public struct AppColorScheme {
    public let primary: Color
    public let secondary: Color
    public let background: Color
    public let surface: Color
    public let text: Color
    public let textSecondary: Color
    public let accent: Color
    public let error: Color
    public let success: Color
    public let warning: Color
    
    public init(
        primary: Color,
        secondary: Color,
        background: Color,
        surface: Color,
        text: Color,
        textSecondary: Color,
        accent: Color,
        error: Color,
        success: Color,
        warning: Color
    ) {
        self.primary = primary
        self.secondary = secondary
        self.background = background
        self.surface = surface
        self.text = text
        self.textSecondary = textSecondary
        self.accent = accent
        self.error = error
        self.success = success
        self.warning = warning
    }
    
    public static let light = AppColorScheme(
        primary: Color(red: 0.0, green: 0.478, blue: 1.0),
        secondary: Color(red: 0.349, green: 0.349, blue: 0.349),
        background: Color(red: 1.0, green: 1.0, blue: 1.0),
        surface: Color(red: 0.95, green: 0.95, blue: 0.97),
        text: Color(red: 0.0, green: 0.0, blue: 0.0),
        textSecondary: Color(red: 0.6, green: 0.6, blue: 0.6),
        accent: Color(red: 1.0, green: 0.584, blue: 0.0),
        error: Color(red: 1.0, green: 0.231, blue: 0.188),
        success: Color(red: 0.298, green: 0.851, blue: 0.392),
        warning: Color(red: 1.0, green: 0.584, blue: 0.0)
    )
    
    public static let dark = AppColorScheme(
        primary: Color(red: 0.0, green: 0.478, blue: 1.0),
        secondary: Color(red: 0.651, green: 0.651, blue: 0.651),
        background: Color(red: 0.0, green: 0.0, blue: 0.0),
        surface: Color(red: 0.1, green: 0.1, blue: 0.1),
        text: Color(red: 1.0, green: 1.0, blue: 1.0),
        textSecondary: Color(red: 0.8, green: 0.8, blue: 0.8),
        accent: Color(red: 1.0, green: 0.584, blue: 0.0),
        error: Color(red: 1.0, green: 0.231, blue: 0.188),
        success: Color(red: 0.298, green: 0.851, blue: 0.392),
        warning: Color(red: 1.0, green: 0.584, blue: 0.0)
    )
}

// MARK: - Theme Aware View Modifier

@available(iOS 15.0, *)
public struct ThemeAwareModifier: ViewModifier {
    @ObservedObject private var themeManager = ThemeManager.shared
    
    public func body(content: Content) -> some View {
        content
            .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
    }
}

// MARK: - Theme Aware View Extension

@available(iOS 15.0, *)
public extension View {
    func themeAware() -> some View {
        modifier(ThemeAwareModifier())
    }
}

// MARK: - Themed Button

@available(iOS 15.0, *)
public struct ThemedButton: View {
    let title: String
    let style: ButtonStyle
    let action: () -> Void
    
    @ObservedObject private var themeManager = ThemeManager.shared
    
    public enum ButtonStyle {
        case primary
        case secondary
        case destructive
        case outline
    }
    
    public init(title: String, style: ButtonStyle = .primary, action: @escaping () -> Void) {
        self.title = title
        self.style = style
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(foregroundColor)
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(backgroundColor)
                .cornerRadius(10)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var backgroundColor: Color {
        switch style {
        case .primary:
            return AppColorScheme.light.primary
        case .secondary:
            return AppColorScheme.light.surface
        case .destructive:
            return AppColorScheme.light.error
        case .outline:
            return Color(red: 0, green: 0, blue: 0, opacity: 0)
        }
    }
    
    private var foregroundColor: Color {
        switch style {
        case .primary, .destructive:
            return Color(red: 1.0, green: 1.0, blue: 1.0)
        case .secondary:
            return AppColorScheme.light.text
        case .outline:
            return AppColorScheme.light.primary
        }
    }
}

// MARK: - Themed Card

@available(iOS 15.0, *)
public struct ThemedCard<Content: View>: View {
    let content: Content
    let padding: CGFloat
    
    @ObservedObject private var themeManager = ThemeManager.shared
    
    public init(padding: CGFloat = 16, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }
    
    public var body: some View {
        content
            .padding(padding)
            .background(AppColorScheme.light.surface)
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Theme Selector

@available(iOS 15.0, *)
public struct ThemeSelector: View {
    @ObservedObject private var themeManager = ThemeManager.shared
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 16) {
            Text("Choose Theme")
                .font(.headline)
                .foregroundColor(AppColorScheme.light.text)
            
            ForEach(AppTheme.allCases, id: \.self) { theme in
                Button(action: {
                    themeManager.setTheme(theme)
                }) {
                    HStack {
                        Image(systemName: theme.icon)
                            .foregroundColor(AppColorScheme.light.primary)
                        Text(theme.displayName)
                            .foregroundColor(AppColorScheme.light.text)
                        Spacer()
                        if themeManager.currentTheme == theme {
                            Image(systemName: "checkmark")
                                .foregroundColor(AppColorScheme.light.primary)
                        }
                    }
                    .padding()
                    .background(AppColorScheme.light.surface)
                    .cornerRadius(8)
                }
                .buttonStyle(PlainButtonStyle())
            }
        }
        .padding()
        .background(AppColorScheme.light.background)
    }
}

// MARK: - Preview

@available(iOS 15.0, *)
struct ThemeComponents_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            ThemedButton(title: "Primary Button", style: .primary) {
                print("Primary button tapped")
            }
            
            ThemedButton(title: "Secondary Button", style: .secondary) {
                print("Secondary button tapped")
            }
            
            ThemedButton(title: "Destructive Button", style: .destructive) {
                print("Destructive button tapped")
            }
            
            ThemedCard {
                Text("Themed Card Content")
                    .font(.headline)
            }
            
            ThemeSelector()
        }
        .padding()
        .previewLayout(.sizeThatFits)
    }
}

#endif 