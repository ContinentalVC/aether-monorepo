//
//  ThemeManager.swift
//  Aether SwiftUI App
//
//  Enhanced theme management system with typography controls,
//  accessibility features, and guided creativity interface.
//

import SwiftUI

// MARK: - Typography System

/// Typography configuration for consistent text styling
struct Typography {
    /// Primary font family for the application
    let primaryFont: Font
    
    /// Secondary font family for accents and special text
    let secondaryFont: Font
    
    /// Font weights available for the primary font
    let availableWeights: [Font.Weight]
    
    /// Font sizes for different text elements
    let fontSizes: FontSizes
    
    /// Line heights for optimal readability
    let lineHeights: LineHeights
    
    /// Letter spacing for improved legibility
    let letterSpacing: LetterSpacing
    
    struct FontSizes {
        let xs: CGFloat = 12
        let sm: CGFloat = 14
        let md: CGFloat = 16
        let lg: CGFloat = 18
        let xl: CGFloat = 20
        let xxl: CGFloat = 24
        let xxxl: CGFloat = 32
    }
    
    struct LineHeights {
        let tight: CGFloat = 1.2
        let normal: CGFloat = 1.5
        let relaxed: CGFloat = 1.8
    }
    
    struct LetterSpacing {
        let tight: CGFloat = -0.5
        let normal: CGFloat = 0
        let wide: CGFloat = 0.5
    }
    
    /// Initialize with system fonts and default settings
    init(
        primaryFontName: String = "SF Pro Display",
        secondaryFontName: String = "SF Pro Text",
        weights: [Font.Weight] = [.light, .regular, .medium, .semibold, .bold]
    ) {
        self.primaryFont = Font.custom(primaryFontName, size: 16)
        self.secondaryFont = Font.custom(secondaryFontName, size: 16)
        self.availableWeights = weights
        self.fontSizes = FontSizes()
        self.lineHeights = LineHeights()
        self.letterSpacing = LetterSpacing()
    }
    
    /// Get font with specific weight and size
    func font(weight: Font.Weight, size: CGFloat) -> Font {
        return Font.custom(primaryFont.description, size: size).weight(weight)
    }
    
    /// Get heading font with appropriate size and weight
    func heading(size: HeadingSize) -> Font {
        let fontSize: CGFloat
        let weight: Font.Weight
        
        switch size {
        case .h1:
            fontSize = fontSizes.xxxl
            weight = .bold
        case .h2:
            fontSize = fontSizes.xxl
            weight = .semibold
        case .h3:
            fontSize = fontSizes.xl
            weight = .semibold
        case .h4:
            fontSize = fontSizes.lg
            weight = .medium
        case .h5:
            fontSize = fontSizes.md
            weight = .medium
        case .h6:
            fontSize = fontSizes.sm
            weight = .medium
        }
        
        return font(weight: weight, size: fontSize)
    }
    
    /// Get body text font
    func body(size: BodySize = .md) -> Font {
        let fontSize: CGFloat
        switch size {
        case .xs: fontSize = fontSizes.xs
        case .sm: fontSize = fontSizes.sm
        case .md: fontSize = fontSizes.md
        case .lg: fontSize = fontSizes.lg
        }
        return font(weight: .regular, size: fontSize)
    }
}

enum HeadingSize {
    case h1, h2, h3, h4, h5, h6
}

enum BodySize {
    case xs, sm, md, lg
}

// MARK: - Accessibility Features

/// Accessibility configuration for the theme
struct AccessibilityConfig {
    /// Minimum contrast ratio for text readability
    let minimumContrastRatio: Double
    
    /// Whether to use high contrast colors
    let useHighContrast: Bool
    
    /// Whether to reduce motion for users with vestibular disorders
    let reduceMotion: Bool
    
    /// Whether to use larger text sizes
    let useLargeText: Bool
    
    /// Color blindness support
    let colorBlindnessSupport: ColorBlindnessSupport
    
    enum ColorBlindnessSupport {
        case none
        case deuteranopia
        case protanopia
        case tritanopia
    }
    
    init(
        minimumContrastRatio: Double = 4.5,
        useHighContrast: Bool = false,
        reduceMotion: Bool = false,
        useLargeText: Bool = false,
        colorBlindnessSupport: ColorBlindnessSupport = .none
    ) {
        self.minimumContrastRatio = minimumContrastRatio
        self.useHighContrast = useHighContrast
        self.reduceMotion = reduceMotion
        self.useLargeText = useLargeText
        self.colorBlindnessSupport = colorBlindnessSupport
    }
}

// MARK: - Enhanced Theme Structure

/// Enhanced theme structure with typography and accessibility
struct Theme {
    // MARK: - Color Properties (existing)
    
    /// Primary brand color used for main UI elements
    let primary: Color
    
    /// Primary color variant with reduced opacity for overlays
    let primaryLight: Color
    
    /// Primary color variant with increased opacity for emphasis
    let primaryDark: Color
    
    /// Secondary brand color used for supporting UI elements
    let secondary: Color
    
    /// Secondary color variant with reduced opacity
    let secondaryLight: Color
    
    /// Secondary color variant with increased opacity
    let secondaryDark: Color
    
    /// Main background color for the application
    let background: Color
    
    /// Secondary background color for cards and elevated surfaces
    let backgroundSecondary: Color
    
    /// Tertiary background color for subtle backgrounds
    let backgroundTertiary: Color
    
    /// Primary surface color for cards and containers
    let surface: Color
    
    /// Surface color with glassmorphism effect
    let surfaceGlass: Color
    
    /// Surface color for elevated elements
    let surfaceElevated: Color
    
    /// Primary text color
    let textPrimary: Color
    
    /// Secondary text color for less important text
    let textSecondary: Color
    
    /// Tertiary text color for subtle text
    let textTertiary: Color
    
    /// Success color for positive states
    let success: Color
    
    /// Warning color for caution states
    let warning: Color
    
    /// Error color for negative states
    let error: Color
    
    /// Info color for informational states
    let info: Color
    
    /// Primary border color
    let border: Color
    
    /// Border color with reduced opacity
    let borderLight: Color
    
    /// Primary shadow color
    let shadow: Color
    
    /// Shadow color with reduced opacity
    let shadowLight: Color
    
    // MARK: - New Properties
    
    /// Typography configuration
    let typography: Typography
    
    /// Accessibility configuration
    let accessibility: AccessibilityConfig
    
    /// Spacing values for consistent layout
    let spacing: Spacing
    
    /// Border radius values
    let borderRadius: BorderRadius
    
    struct Spacing {
        let xs: CGFloat = 4
        let sm: CGFloat = 8
        let md: CGFloat = 16
        let lg: CGFloat = 24
        let xl: CGFloat = 32
        let xxl: CGFloat = 48
    }
    
    struct BorderRadius {
        let sm: CGFloat = 4
        let md: CGFloat = 8
        let lg: CGFloat = 12
        let xl: CGFloat = 16
        let xxl: CGFloat = 24
    }
    
    // MARK: - Initializer
    
    /// Initialize a theme with all properties
    init(
        primary: Color,
        secondary: Color,
        background: Color,
        surface: Color,
        textPrimary: Color,
        typography: Typography = Typography(),
        accessibility: AccessibilityConfig = AccessibilityConfig(),
        success: Color = .green,
        warning: Color = .orange,
        error: Color = .red,
        info: Color = .blue
    ) {
        self.primary = primary
        self.primaryLight = primary.opacity(0.7)
        self.primaryDark = primary.opacity(1.3)
        
        self.secondary = secondary
        self.secondaryLight = secondary.opacity(0.7)
        self.secondaryDark = secondary.opacity(1.3)
        
        self.background = background
        self.backgroundSecondary = background.opacity(0.95)
        self.backgroundTertiary = background.opacity(0.9)
        
        self.surface = surface
        self.surfaceGlass = surface.opacity(0.8)
        self.surfaceElevated = surface.opacity(1.1)
        
        self.textPrimary = textPrimary
        self.textSecondary = textPrimary.opacity(0.7)
        self.textTertiary = textPrimary.opacity(0.5)
        
        self.success = success
        self.warning = warning
        self.error = error
        self.info = info
        
        self.border = textPrimary.opacity(0.2)
        self.borderLight = textPrimary.opacity(0.1)
        
        self.shadow = Color.black.opacity(0.1)
        self.shadowLight = Color.black.opacity(0.05)
        
        self.typography = typography
        self.accessibility = accessibility
        self.spacing = Spacing()
        self.borderRadius = BorderRadius()
    }
    
    // MARK: - Accessibility Methods
    
    /// Get colors adapted for color blindness
    func colorsForColorBlindness() -> Theme {
        guard accessibility.colorBlindnessSupport != .none else { return self }
        
        // Apply color blindness filters
        let adaptedPrimary = adaptColorForColorBlindness(primary)
        let adaptedSecondary = adaptColorForColorBlindness(secondary)
        let adaptedTextPrimary = adaptColorForColorBlindness(textPrimary)
        
        return Theme(
            primary: adaptedPrimary,
            secondary: adaptedSecondary,
            background: background,
            surface: surface,
            textPrimary: adaptedTextPrimary,
            typography: typography,
            accessibility: accessibility
        )
    }
    
    /// Adapt color for specific color blindness type
    private func adaptColorForColorBlindness(_ color: Color) -> Color {
        // Simplified color adaptation - in a real implementation,
        // you would use more sophisticated color transformation algorithms
        switch accessibility.colorBlindnessSupport {
        case .deuteranopia, .protanopia:
            // Reduce green/red intensity for red-green color blindness
            return color.opacity(0.8)
        case .tritanopia:
            // Reduce blue intensity for blue-yellow color blindness
            return color.opacity(0.8)
        case .none:
            return color
        }
    }
    
    /// Check if text has sufficient contrast against background
    func hasSufficientContrast(textColor: Color, backgroundColor: Color) -> Bool {
        // Simplified contrast calculation
        // In a real implementation, you would use proper luminance calculations
        let contrast = calculateContrastRatio(textColor: textColor, backgroundColor: backgroundColor)
        return contrast >= accessibility.minimumContrastRatio
    }
    
    /// Calculate contrast ratio between two colors
    private func calculateContrastRatio(textColor: Color, backgroundColor: Color) -> Double {
        // Simplified implementation - real implementation would use proper luminance
        return 4.5 // Placeholder value
    }
}

// MARK: - Predefined Themes

/// Collection of predefined themes for the application
struct PredefinedThemes {
    
    /// Default light theme with blue primary colors
    static let light = Theme(
        primary: Color(red: 0.2, green: 0.4, blue: 0.8),
        secondary: Color(red: 0.6, green: 0.8, blue: 1.0),
        background: Color(red: 0.98, green: 0.98, blue: 0.98),
        surface: Color.white,
        textPrimary: Color.black,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
    
    /// Default dark theme with blue primary colors
    static let dark = Theme(
        primary: Color(red: 0.4, green: 0.6, blue: 1.0),
        secondary: Color(red: 0.2, green: 0.4, blue: 0.8),
        background: Color(red: 0.1, green: 0.1, blue: 0.15),
        surface: Color(red: 0.15, green: 0.15, blue: 0.2),
        textPrimary: Color.white,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
    
    /// Purple theme for a more vibrant look
    static let purple = Theme(
        primary: Color(red: 0.6, green: 0.2, blue: 0.8),
        secondary: Color(red: 0.8, green: 0.4, blue: 1.0),
        background: Color(red: 0.98, green: 0.96, blue: 1.0),
        surface: Color.white,
        textPrimary: Color.black,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
    
    /// Green theme for nature-inspired designs
    static let green = Theme(
        primary: Color(red: 0.2, green: 0.7, blue: 0.4),
        secondary: Color(red: 0.4, green: 0.8, blue: 0.6),
        background: Color(red: 0.96, green: 0.98, blue: 0.96),
        surface: Color.white,
        textPrimary: Color.black,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
    
    /// Sunset theme with warm orange and pink colors
    static let sunset = Theme(
        primary: Color(red: 1.0, green: 0.4, blue: 0.2),
        secondary: Color(red: 1.0, green: 0.6, blue: 0.4),
        background: Color(red: 1.0, green: 0.96, blue: 0.92),
        surface: Color.white,
        textPrimary: Color.black,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
    
    /// Ocean theme with cool blue and teal colors
    static let ocean = Theme(
        primary: Color(red: 0.0, green: 0.6, blue: 0.8),
        secondary: Color(red: 0.2, green: 0.8, blue: 0.8),
        background: Color(red: 0.92, green: 0.96, blue: 1.0),
        surface: Color.white,
        textPrimary: Color.black,
        typography: Typography(),
        accessibility: AccessibilityConfig()
    )
}

// MARK: - Theme Manager

/// Enhanced ObservableObject class for managing application themes with typography and accessibility
/// 
/// This class provides centralized theme management with the ability to:
/// - Switch between predefined themes
/// - Create custom themes with typography controls
/// - Manage accessibility settings
/// - Persist theme preferences
/// - Provide reactive theme updates to SwiftUI views
/// - Guide users toward accessible design choices
class ThemeManager: ObservableObject {
    
    // MARK: - Published Properties
    
    /// Current active theme
    @Published var currentTheme: Theme
    
    /// Current theme name for identification
    @Published var currentThemeName: String
    
    /// Whether the app is in dark mode
    @Published var isDarkMode: Bool
    
    /// Current typography settings
    @Published var currentTypography: Typography
    
    /// Current accessibility settings
    @Published var currentAccessibility: AccessibilityConfig
    
    /// Available font families for selection
    @Published var availableFontFamilies: [String] = [
        "SF Pro Display",
        "SF Pro Text",
        "Helvetica Neue",
        "Arial",
        "Georgia",
        "Times New Roman"
    ]
    
    /// Available font weights
    @Published var availableFontWeights: [Font.Weight] = [
        .ultraLight, .thin, .light, .regular, .medium, .semibold, .bold, .heavy, .black
    ]
    
    // MARK: - Private Properties
    
    /// UserDefaults key for theme persistence
    private let themeKey = "selectedTheme"
    
    /// UserDefaults key for dark mode persistence
    private let darkModeKey = "isDarkMode"
    
    /// UserDefaults key for typography persistence
    private let typographyKey = "selectedTypography"
    
    /// UserDefaults key for accessibility persistence
    private let accessibilityKey = "accessibilitySettings"
    
    // MARK: - Initialization
    
    /// Initialize the theme manager with default settings
    init() {
        // Load saved theme preference or use default
        if let savedThemeName = UserDefaults.standard.string(forKey: themeKey) {
            self.currentThemeName = savedThemeName
            self.currentTheme = Self.getTheme(for: savedThemeName)
        } else {
            self.currentThemeName = "light"
            self.currentTheme = PredefinedThemes.light
        }
        
        // Load dark mode preference
        self.isDarkMode = UserDefaults.standard.bool(forKey: darkModeKey)
        
        // Apply dark mode if enabled
        if isDarkMode {
            self.currentTheme = PredefinedThemes.dark
            self.currentThemeName = "dark"
        }
        
        // Load typography and accessibility settings
        self.currentTypography = loadTypographySettings()
        self.currentAccessibility = loadAccessibilitySettings()
        
        // Apply loaded settings to current theme
        applyTypographyAndAccessibility()
    }
    
    // MARK: - Theme Management Methods
    
    /// Switch to a predefined theme
    /// - Parameter themeName: Name of the theme to switch to
    func switchTheme(to themeName: String) {
        let newTheme = Self.getTheme(for: themeName)
        currentTheme = newTheme
        currentThemeName = themeName
        
        // Apply current typography and accessibility settings
        applyTypographyAndAccessibility()
        
        // Save theme preference
        UserDefaults.standard.set(themeName, forKey: themeKey)
    }
    
    /// Toggle between light and dark mode
    func toggleDarkMode() {
        isDarkMode.toggle()
        
        if isDarkMode {
            currentTheme = PredefinedThemes.dark
            currentThemeName = "dark"
        } else {
            currentTheme = PredefinedThemes.light
            currentThemeName = "light"
        }
        
        // Apply current typography and accessibility settings
        applyTypographyAndAccessibility()
        
        // Save dark mode preference
        UserDefaults.standard.set(isDarkMode, forKey: darkModeKey)
    }
    
    /// Set a custom theme
    /// - Parameter theme: Custom theme to apply
    /// - Parameter name: Name for the custom theme
    func setCustomTheme(_ theme: Theme, name: String) {
        currentTheme = theme
        currentThemeName = name
        
        // Apply current typography and accessibility settings
        applyTypographyAndAccessibility()
        
        // Save custom theme preference
        UserDefaults.standard.set(name, forKey: themeKey)
    }
    
    /// Reset to default light theme
    func resetToDefault() {
        switchTheme(to: "light")
    }
    
    // MARK: - Typography Management Methods
    
    /// Update typography settings with guided creativity
    /// - Parameter primaryFontName: Primary font family name
    /// - Parameter secondaryFontName: Secondary font family name (optional)
    /// - Parameter weights: Available font weights
    func updateTypography(
        primaryFontName: String,
        secondaryFontName: String? = nil,
        weights: [Font.Weight]? = nil
    ) {
        // Validate font selection (guide toward best practices)
        let validatedPrimaryFont = validateFontSelection(primaryFontName)
        let validatedSecondaryFont = secondaryFontName.map(validateFontSelection) ?? validatedPrimaryFont
        
        // Ensure we don't exceed recommended font count
        let finalSecondaryFont = validatedPrimaryFont == validatedSecondaryFont ? nil : validatedSecondaryFont
        
        // Create new typography with validated settings
        let newTypography = Typography(
            primaryFontName: validatedPrimaryFont,
            secondaryFontName: finalSecondaryFont ?? validatedPrimaryFont,
            weights: weights ?? currentTypography.availableWeights
        )
        
        currentTypography = newTypography
        applyTypographyAndAccessibility()
        saveTypographySettings()
    }
    
    /// Validate font selection to guide toward best practices
    /// - Parameter fontName: Font name to validate
    /// - Returns: Validated font name
    private func validateFontSelection(_ fontName: String) -> String {
        // Check if font is available in the system
        if availableFontFamilies.contains(fontName) {
            return fontName
        }
        
        // Fallback to system font if not available
        return "SF Pro Display"
    }
    
    /// Get recommended font combinations for guided creativity
    /// - Returns: Array of recommended font pairs
    func getRecommendedFontCombinations() -> [(primary: String, secondary: String, description: String)] {
        return [
            ("SF Pro Display", "SF Pro Text", "Modern and clean"),
            ("Helvetica Neue", "Georgia", "Classic and readable"),
            ("Arial", "Times New Roman", "Traditional and formal"),
            ("SF Pro Display", "SF Pro Display", "Minimal and consistent")
        ]
    }
    
    // MARK: - Accessibility Management Methods
    
    /// Update accessibility settings
    /// - Parameter config: New accessibility configuration
    func updateAccessibility(_ config: AccessibilityConfig) {
        currentAccessibility = config
        applyTypographyAndAccessibility()
        saveAccessibilitySettings()
    }
    
    /// Toggle high contrast mode
    func toggleHighContrast() {
        currentAccessibility = AccessibilityConfig(
            minimumContrastRatio: currentAccessibility.minimumContrastRatio,
            useHighContrast: !currentAccessibility.useHighContrast,
            reduceMotion: currentAccessibility.reduceMotion,
            useLargeText: currentAccessibility.useLargeText,
            colorBlindnessSupport: currentAccessibility.colorBlindnessSupport
        )
        applyTypographyAndAccessibility()
        saveAccessibilitySettings()
    }
    
    /// Toggle reduced motion
    func toggleReducedMotion() {
        currentAccessibility = AccessibilityConfig(
            minimumContrastRatio: currentAccessibility.minimumContrastRatio,
            useHighContrast: currentAccessibility.useHighContrast,
            reduceMotion: !currentAccessibility.reduceMotion,
            useLargeText: currentAccessibility.useLargeText,
            colorBlindnessSupport: currentAccessibility.colorBlindnessSupport
        )
        applyTypographyAndAccessibility()
        saveAccessibilitySettings()
    }
    
    /// Set color blindness support
    /// - Parameter support: Type of color blindness support
    func setColorBlindnessSupport(_ support: AccessibilityConfig.ColorBlindnessSupport) {
        currentAccessibility = AccessibilityConfig(
            minimumContrastRatio: currentAccessibility.minimumContrastRatio,
            useHighContrast: currentAccessibility.useHighContrast,
            reduceMotion: currentAccessibility.reduceMotion,
            useLargeText: currentAccessibility.useLargeText,
            colorBlindnessSupport: support
        )
        applyTypographyAndAccessibility()
        saveAccessibilitySettings()
    }
    
    // MARK: - Helper Methods
    
    /// Apply current typography and accessibility settings to theme
    private func applyTypographyAndAccessibility() {
        // Create new theme with current settings
        let updatedTheme = Theme(
            primary: currentTheme.primary,
            secondary: currentTheme.secondary,
            background: currentTheme.background,
            surface: currentTheme.surface,
            textPrimary: currentTheme.textPrimary,
            typography: currentTypography,
            accessibility: currentAccessibility,
            success: currentTheme.success,
            warning: currentTheme.warning,
            error: currentTheme.error,
            info: currentTheme.info
        )
        
        currentTheme = updatedTheme
    }
    
    /// Load typography settings from UserDefaults
    private func loadTypographySettings() -> Typography {
        // In a real implementation, you would decode from UserDefaults
        return Typography()
    }
    
    /// Save typography settings to UserDefaults
    private func saveTypographySettings() {
        // In a real implementation, you would encode to UserDefaults
        UserDefaults.standard.set(true, forKey: typographyKey)
    }
    
    /// Load accessibility settings from UserDefaults
    private func loadAccessibilitySettings() -> AccessibilityConfig {
        // In a real implementation, you would decode from UserDefaults
        return AccessibilityConfig()
    }
    
    /// Save accessibility settings to UserDefaults
    private func saveAccessibilitySettings() {
        // In a real implementation, you would encode to UserDefaults
        UserDefaults.standard.set(true, forKey: accessibilityKey)
    }
    
    // MARK: - Utility Methods
    
    /// Get a theme by name
    /// - Parameter name: Name of the theme
    /// - Returns: Theme instance
    private static func getTheme(for name: String) -> Theme {
        switch name.lowercased() {
        case "dark":
            return PredefinedThemes.dark
        case "purple":
            return PredefinedThemes.purple
        case "green":
            return PredefinedThemes.green
        case "sunset":
            return PredefinedThemes.sunset
        case "ocean":
            return PredefinedThemes.ocean
        default:
            return PredefinedThemes.light
        }
    }
    
    /// Get all available theme names
    /// - Returns: Array of theme names
    static func availableThemes() -> [String] {
        return ["light", "dark", "purple", "green", "sunset", "ocean"]
    }
    
    /// Get theme preview colors for UI
    /// - Parameter themeName: Name of the theme
    /// - Returns: Array of preview colors
    static func previewColors(for themeName: String) -> [Color] {
        let theme = getTheme(for: themeName)
        return [
            theme.primary,
            theme.secondary,
            theme.background,
            theme.surface
        ]
    }
}

// MARK: - Environment Key

/// Environment key for injecting ThemeManager into the view hierarchy
struct ThemeManagerKey: EnvironmentKey {
    static let defaultValue: ThemeManager = ThemeManager()
}

extension EnvironmentValues {
    /// Access to the theme manager in the environment
    var themeManager: ThemeManager {
        get { self[ThemeManagerKey.self] }
        set { self[ThemeManagerKey.self] = newValue }
    }
}

// MARK: - View Modifier

/// View modifier for injecting ThemeManager into the environment
struct ThemeManagerModifier: ViewModifier {
    let themeManager: ThemeManager
    
    func body(content: Content) -> some View {
        content.environment(\.themeManager, themeManager)
    }
}

extension View {
    /// Inject a ThemeManager into the view's environment
    /// - Parameter themeManager: The theme manager to inject
    /// - Returns: Modified view with theme manager in environment
    func themeManager(_ themeManager: ThemeManager) -> some View {
        modifier(ThemeManagerModifier(themeManager: themeManager))
    }
}

// MARK: - Theme Extensions

extension Theme {
    /// Create a theme that adapts to the current color scheme
    /// - Parameter colorScheme: Current color scheme
    /// - Returns: Theme adapted to the color scheme
    func adapted(to colorScheme: ColorScheme) -> Theme {
        switch colorScheme {
        case .dark:
            return PredefinedThemes.dark
        case .light:
            return PredefinedThemes.light
        @unknown default:
            return PredefinedThemes.light
        }
    }
    
    /// Create a theme with custom opacity values
    /// - Parameter opacity: Opacity multiplier for all colors
    /// - Returns: Theme with adjusted opacity
    func withOpacity(_ opacity: Double) -> Theme {
        return Theme(
            primary: primary.opacity(opacity),
            secondary: secondary.opacity(opacity),
            background: background.opacity(opacity),
            surface: surface.opacity(opacity),
            textPrimary: textPrimary.opacity(opacity)
        )
    }
} 