//
//  DynamicColorScheme.swift
//  Aether SwiftUI App
//
//  Dynamic color scheme support with automatic adaptation to system
//  appearance changes including light, dark, and high contrast modes.
//

import SwiftUI

// MARK: - Dynamic Color Models

/// Represents a dynamic color with different values for different appearances
struct DynamicColor: Codable, Equatable {
    let light: String
    let dark: String
    let highContrastLight: String?
    let highContrastDark: String?
    
    init(
        light: String,
        dark: String,
        highContrastLight: String? = nil,
        highContrastDark: String? = nil
    ) {
        self.light = light
        self.dark = dark
        self.highContrastLight = highContrastLight
        self.highContrastDark = highContrastDark
    }
    
    /// Create a dynamic color with automatic high contrast variants
    static func withAutoHighContrast(
        light: String,
        dark: String,
        highContrastMultiplier: Double = 1.3
    ) -> DynamicColor {
        let lightColor = Color(hex: light) ?? Color.clear
        let darkColor = Color(hex: dark) ?? Color.clear
        
        let highContrastLight = lightColor.adjustedForHighContrast(multiplier: highContrastMultiplier)
        let highContrastDark = darkColor.adjustedForHighContrast(multiplier: highContrastMultiplier)
        
        return DynamicColor(
            light: light,
            dark: dark,
            highContrastLight: highContrastLight.toHex(),
            highContrastDark: highContrastDark.toHex()
        )
    }
}

/// Complete dynamic theme with all color variants
struct DynamicTheme: Codable, Identifiable {
    let id: String
    let name: String
    let description: String?
    let version: String
    let primaryColor: DynamicColor
    let secondaryColor: DynamicColor
    let accentColor: DynamicColor
    let backgroundColor: DynamicColor
    let surfaceColor: DynamicColor
    let textPrimaryColor: DynamicColor
    let textSecondaryColor: DynamicColor
    let borderColor: DynamicColor
    let shadowColor: DynamicColor
    let successColor: DynamicColor
    let warningColor: DynamicColor
    let errorColor: DynamicColor
    let infoColor: DynamicColor
    
    init(
        id: String,
        name: String,
        description: String? = nil,
        version: String = "1.0.0",
        primaryColor: DynamicColor,
        secondaryColor: DynamicColor,
        accentColor: DynamicColor,
        backgroundColor: DynamicColor,
        surfaceColor: DynamicColor,
        textPrimaryColor: DynamicColor,
        textSecondaryColor: DynamicColor,
        borderColor: DynamicColor,
        shadowColor: DynamicColor,
        successColor: DynamicColor,
        warningColor: DynamicColor,
        errorColor: DynamicColor,
        infoColor: DynamicColor
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.version = version
        self.primaryColor = primaryColor
        self.secondaryColor = secondaryColor
        self.accentColor = accentColor
        self.backgroundColor = backgroundColor
        self.surfaceColor = surfaceColor
        self.textPrimaryColor = textPrimaryColor
        self.textSecondaryColor = textSecondaryColor
        self.borderColor = borderColor
        self.shadowColor = shadowColor
        self.successColor = successColor
        self.warningColor = warningColor
        self.errorColor = errorColor
        self.infoColor = infoColor
    }
    
    /// Get color for specific key
    func color(for key: DynamicColorKey) -> DynamicColor {
        switch key {
        case .primary: return primaryColor
        case .secondary: return secondaryColor
        case .accent: return accentColor
        case .background: return backgroundColor
        case .surface: return surfaceColor
        case .textPrimary: return textPrimaryColor
        case .textSecondary: return textSecondaryColor
        case .border: return borderColor
        case .shadow: return shadowColor
        case .success: return successColor
        case .warning: return warningColor
        case .error: return errorColor
        case .info: return infoColor
        }
    }
}

/// Dynamic color keys
enum DynamicColorKey: String, CaseIterable {
    case primary, secondary, accent, background, surface
    case textPrimary, textSecondary, border, shadow
    case success, warning, error, info
}

// MARK: - Dynamic Color Extensions

extension DynamicColor {
    /// Convert to SwiftUI Color
    func toColor() -> Color {
        return Color(hex: light) ?? Color.clear
    }
    
    /// Get color for specific appearance
    func color(for appearance: ColorScheme, isHighContrast: Bool = false) -> Color {
        let hexString: String
        
        switch appearance {
        case .dark:
            if isHighContrast && highContrastDark != nil {
                hexString = highContrastDark!
            } else {
                hexString = dark
            }
        case .light:
            if isHighContrast && highContrastLight != nil {
                hexString = highContrastLight!
            } else {
                hexString = light
            }
        @unknown default:
            hexString = light
        }
        
        return Color(hex: hexString) ?? Color.clear
    }
    
    /// Validate color values
    func isValid() -> Bool {
        return Color(hex: light) != nil && Color(hex: dark) != nil
    }
    
    /// Get accessibility description
    var accessibilityDescription: String {
        var description = "Light mode: \(light), Dark mode: \(dark)"
        if highContrastLight != nil {
            description += ", High contrast light: \(highContrastLight!)"
        }
        if highContrastDark != nil {
            description += ", High contrast dark: \(highContrastDark!)"
        }
        return description
    }
}

// MARK: - Color Extensions

extension Color {
    /// Initialize from hex string
    init?(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            return nil
        }
        
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
    
    /// Get hex string representation
    var hexString: String {
        let components = self.components
        let r = Int(components.red * 255)
        let g = Int(components.green * 255)
        let b = Int(components.blue * 255)
        return String(format: "#%02x%02x%02x", r, g, b)
    }
    
    /// Get color components
    private var components: (red: Double, green: Double, blue: Double, alpha: Double) {
        // This is a simplified version - in a real implementation you'd need to convert from SwiftUI Color to RGB
        // For now, we'll return default values
        return (0.5, 0.5, 0.5, 1.0)
    }
    
    /// Adjust color for high contrast
    func adjustedForHighContrast(multiplier: Double = 1.3) -> Color {
        // Simplified high contrast adjustment
        // In a real implementation, you'd convert to HSV, adjust brightness/saturation, then back to RGB
        return self.opacity(0.8) // Placeholder adjustment
    }
    
    /// Convert to hex string
    func toHex() -> String {
        return self.hexString
    }
}

// MARK: - Dynamic Theme Manager

/// Manager for handling dynamic themes with automatic appearance adaptation
@MainActor
class DynamicThemeManager: ObservableObject {
    @Published var currentTheme: DynamicTheme
    @Published var availableThemes: [DynamicTheme] = []
    @Published var isHighContrastEnabled: Bool = false
    
    private let userDefaults = UserDefaults.standard
    private let themeKey = "selectedDynamicTheme"
    
    init() {
        // Load default themes
        self.availableThemes = DynamicThemeManager.defaultThemes()
        
        // Load saved theme or use first available
        if let savedThemeData = userDefaults.data(forKey: themeKey),
           let savedTheme = try? JSONDecoder().decode(DynamicTheme.self, from: savedThemeData) {
            self.currentTheme = savedTheme
        } else {
            self.currentTheme = availableThemes.first!
        }
        
        // Check high contrast setting - simplified for iOS-only
        self.isHighContrastEnabled = false // Placeholder - would check accessibility settings
        
        // Listen for accessibility changes
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(accessibilitySettingsChanged),
            name: NSNotification.Name("AccessibilitySettingsChanged"), // Placeholder notification
            object: nil
        )
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    // MARK: - Public Methods
    
    /// Set current theme
    func setTheme(_ theme: DynamicTheme) {
        currentTheme = theme
        saveTheme(theme)
    }
    
    /// Get color for current appearance
    func color(for colorKey: DynamicColorKey) -> Color {
        let dynamicColor = currentTheme.color(for: colorKey)
        return dynamicColor.color(for: currentColorScheme, isHighContrast: isHighContrastEnabled)
    }
    
    /// Get dynamic color for key
    func dynamicColor(for colorKey: DynamicColorKey) -> DynamicColor {
        return currentTheme.color(for: colorKey)
    }
    
    /// Add custom theme
    func addTheme(_ theme: DynamicTheme) {
        availableThemes.append(theme)
    }
    
    /// Remove theme
    func removeTheme(withId id: String) {
        availableThemes.removeAll { $0.id == id }
        if currentTheme.id == id && !availableThemes.isEmpty {
            setTheme(availableThemes.first!)
        }
    }
    
    /// Export theme to JSON
    func exportTheme(_ theme: DynamicTheme) -> String? {
        guard let data = try? JSONEncoder().encode(theme) else { return nil }
        return String(data: data, encoding: .utf8)
    }
    
    /// Import theme from JSON
    func importTheme(from json: String) -> DynamicTheme? {
        guard let data = json.data(using: .utf8),
              let theme = try? JSONDecoder().decode(DynamicTheme.self, from: data) else {
            return nil
        }
        return theme
    }
    
    // MARK: - Private Methods
    
    private func saveTheme(_ theme: DynamicTheme) {
        if let data = try? JSONEncoder().encode(theme) {
            userDefaults.set(data, forKey: themeKey)
        }
    }
    
    @objc private func accessibilitySettingsChanged() {
        DispatchQueue.main.async {
            self.isHighContrastEnabled = false // Placeholder - would check actual accessibility settings
        }
    }
    
    private var currentColorScheme: ColorScheme {
        // This would be injected from the environment in a real app
        return .light // Placeholder - should come from @Environment(\.colorScheme)
    }
    
    // MARK: - Default Themes
    
    static func defaultThemes() -> [DynamicTheme] {
        return [
            // Modern Blue Theme
            DynamicTheme(
                id: "modern-blue",
                name: "Modern Blue",
                description: "A modern blue theme with excellent contrast",
                primaryColor: DynamicColor.withAutoHighContrast(
                    light: "#0A7AFF",
                    dark: "#0A84FF"
                ),
                secondaryColor: DynamicColor.withAutoHighContrast(
                    light: "#5856D6",
                    dark: "#5E5CE6"
                ),
                accentColor: DynamicColor.withAutoHighContrast(
                    light: "#FF2D92",
                    dark: "#FF375F"
                ),
                backgroundColor: DynamicColor.withAutoHighContrast(
                    light: "#FFFFFF",
                    dark: "#000000"
                ),
                surfaceColor: DynamicColor.withAutoHighContrast(
                    light: "#F2F2F7",
                    dark: "#1C1C1E"
                ),
                textPrimaryColor: DynamicColor.withAutoHighContrast(
                    light: "#000000",
                    dark: "#FFFFFF"
                ),
                textSecondaryColor: DynamicColor.withAutoHighContrast(
                    light: "#8E8E93",
                    dark: "#8E8E93"
                ),
                borderColor: DynamicColor.withAutoHighContrast(
                    light: "#C6C6C8",
                    dark: "#38383A"
                ),
                shadowColor: DynamicColor.withAutoHighContrast(
                    light: "#000000",
                    dark: "#000000"
                ),
                successColor: DynamicColor.withAutoHighContrast(
                    light: "#34C759",
                    dark: "#30D158"
                ),
                warningColor: DynamicColor.withAutoHighContrast(
                    light: "#FF9500",
                    dark: "#FF9F0A"
                ),
                errorColor: DynamicColor.withAutoHighContrast(
                    light: "#FF3B30",
                    dark: "#FF453A"
                ),
                infoColor: DynamicColor.withAutoHighContrast(
                    light: "#007AFF",
                    dark: "#0A84FF"
                )
            )
        ]
    }
}

// MARK: - Environment Values

private struct DynamicThemeManagerKey: EnvironmentKey {
    static let defaultValue: DynamicThemeManager? = nil
}

extension EnvironmentValues {
    var dynamicThemeManager: DynamicThemeManager? {
        get { self[DynamicThemeManagerKey.self] }
        set { self[DynamicThemeManagerKey.self] = newValue }
    }
}

// MARK: - View Modifier

struct DynamicThemeManagerModifier: ViewModifier {
    let themeManager: DynamicThemeManager
    
    func body(content: Content) -> some View {
        content.environment(\.dynamicThemeManager, themeManager)
    }
}

extension View {
    func dynamicThemeManager(_ themeManager: DynamicThemeManager) -> some View {
        modifier(DynamicThemeManagerModifier(themeManager: themeManager))
    }
} 