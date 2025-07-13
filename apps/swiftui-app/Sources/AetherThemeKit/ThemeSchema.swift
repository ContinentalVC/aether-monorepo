//
//  ThemeSchema.swift
//  Aether SwiftUI App
//
//  Comprehensive theme schema system with structured, hierarchical design
//  following Shopify's JSON template approach for maintainable theming.
//

import SwiftUI
import Foundation

// MARK: - Theme Schema

/// Root theme schema following structured, hierarchical design
struct ThemeSchema: Codable, Identifiable, Equatable {
    let id: String
    let metadata: ThemeMetadata
    let properties: ThemeProperties
    
    init(
        id: String = UUID().uuidString,
        metadata: ThemeMetadata,
        properties: ThemeProperties
    ) {
        self.id = id
        self.metadata = metadata
        self.properties = properties
    }
}

// MARK: - Theme Metadata

/// Theme metadata for organization and versioning
struct ThemeMetadata: Codable, Equatable {
    let name: String
    let author: String
    let version: String
    let description: String?
    let createdAt: Date
    let updatedAt: Date
    let tags: [String]
    let category: ThemeCategory
    let platform: [Platform]
    let license: String?
    let website: String?
    let previewImage: String?
    
    init(
        name: String,
        author: String,
        version: String = "1.0.0",
        description: String? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        tags: [String] = [],
        category: ThemeCategory = .general,
        platform: [Platform] = [.ios],
        license: String? = nil,
        website: String? = nil,
        previewImage: String? = nil
    ) {
        self.name = name
        self.author = author
        self.version = version
        self.description = description
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.tags = tags
        self.category = category
        self.platform = platform
        self.license = license
        self.website = website
        self.previewImage = previewImage
    }
}

enum ThemeCategory: String, Codable, CaseIterable {
    case general = "General"
    case business = "Business"
    case creative = "Creative"
    case gaming = "Gaming"
    case education = "Education"
    case health = "Health"
    case finance = "Finance"
    case social = "Social"
    case productivity = "Productivity"
    case entertainment = "Entertainment"
    
    var description: String {
        switch self {
        case .general: return "General purpose themes"
        case .business: return "Professional business themes"
        case .creative: return "Creative and artistic themes"
        case .gaming: return "Gaming and entertainment themes"
        case .education: return "Educational and learning themes"
        case .health: return "Health and wellness themes"
        case .finance: return "Financial and banking themes"
        case .social: return "Social media themes"
        case .productivity: return "Productivity and work themes"
        case .entertainment: return "Entertainment and media themes"
        }
    }
}

enum Platform: String, Codable, CaseIterable {
    case ios = "iOS"
    case watchos = "watchOS"
    case tvos = "tvOS"
    case visionos = "visionOS"
    
    var description: String {
        switch self {
        case .ios: return "iPhone and iPad"
        case .watchos: return "Apple Watch"
        case .tvos: return "Apple TV"
        case .visionos: return "Apple Vision Pro"
        }
    }
}

// MARK: - Theme Properties

/// Primary properties object containing all customizable categories
struct ThemeProperties: Codable, Equatable {
    let colors: ColorProperties
    let typography: TypographyProperties
    let iconography: IconographyProperties
    let layoutMetrics: LayoutMetricsProperties
    let shadows: ShadowProperties
    let animations: AnimationProperties
    let accessibility: AccessibilityProperties
    let custom: [String: CustomProperty]
    
    init(
        colors: ColorProperties = ColorProperties(),
        typography: TypographyProperties = TypographyProperties(),
        iconography: IconographyProperties = IconographyProperties(),
        layoutMetrics: LayoutMetricsProperties = LayoutMetricsProperties(),
        shadows: ShadowProperties = ShadowProperties(),
        animations: AnimationProperties = AnimationProperties(),
        accessibility: AccessibilityProperties = AccessibilityProperties(),
        custom: [String: CustomProperty] = [:]
    ) {
        self.colors = colors
        self.typography = typography
        self.iconography = iconography
        self.layoutMetrics = layoutMetrics
        self.shadows = shadows
        self.animations = animations
        self.accessibility = accessibility
        self.custom = custom
    }
}

// MARK: - Color Properties

/// Color properties following the structured schema approach
struct ColorProperties: Codable, Equatable {
    let primary: ColorDefinition
    let secondary: ColorDefinition
    let tertiary: ColorDefinition
    let background: BackgroundColors
    let surface: SurfaceColors
    let text: TextColors
    let semantic: SemanticColors
    let custom: [String: ColorDefinition]
    
    init(
        primary: ColorDefinition = ColorDefinition(light: "#0A7AFF", dark: "#0A84FF"),
        secondary: ColorDefinition = ColorDefinition(light: "#FF9500", dark: "#FF9F0A"),
        tertiary: ColorDefinition = ColorDefinition(light: "#5856D6", dark: "#5E5CE6"),
        background: BackgroundColors = BackgroundColors(),
        surface: SurfaceColors = SurfaceColors(),
        text: TextColors = TextColors(),
        semantic: SemanticColors = SemanticColors(),
        custom: [String: ColorDefinition] = [:]
    ) {
        self.primary = primary
        self.secondary = secondary
        self.tertiary = tertiary
        self.background = background
        self.surface = surface
        self.text = text
        self.semantic = semantic
        self.custom = custom
    }
}

struct ColorDefinition: Codable, Equatable {
    let light: String
    let dark: String
    let alpha: Double?
    
    init(light: String, dark: String, alpha: Double? = nil) {
        self.light = light
        self.dark = dark
        self.alpha = alpha
    }
    
    var isValid: Bool {
        return light.isValidHexColor && dark.isValidHexColor &&
               (alpha == nil || (alpha! >= 0.0 && alpha! <= 1.0))
    }
}

struct BackgroundColors: Codable, Equatable {
    let primary: ColorDefinition
    let secondary: ColorDefinition
    let tertiary: ColorDefinition
    
    init(
        primary: ColorDefinition = ColorDefinition(light: "#FFFFFF", dark: "#000000"),
        secondary: ColorDefinition = ColorDefinition(light: "#F2F2F7", dark: "#1C1C1E"),
        tertiary: ColorDefinition = ColorDefinition(light: "#E5E5EA", dark: "#2C2C2E")
    ) {
        self.primary = primary
        self.secondary = secondary
        self.tertiary = tertiary
    }
}

struct SurfaceColors: Codable, Equatable {
    let primary: ColorDefinition
    let secondary: ColorDefinition
    let tertiary: ColorDefinition
    let elevated: ColorDefinition
    
    init(
        primary: ColorDefinition = ColorDefinition(light: "#FFFFFF", dark: "#1C1C1E"),
        secondary: ColorDefinition = ColorDefinition(light: "#F2F2F7", dark: "#2C2C2E"),
        tertiary: ColorDefinition = ColorDefinition(light: "#E5E5EA", dark: "#3A3A3C"),
        elevated: ColorDefinition = ColorDefinition(light: "#FFFFFF", dark: "#2C2C2E")
    ) {
        self.primary = primary
        self.secondary = secondary
        self.tertiary = tertiary
        self.elevated = elevated
    }
}

struct TextColors: Codable, Equatable {
    let primary: ColorDefinition
    let secondary: ColorDefinition
    let tertiary: ColorDefinition
    let quaternary: ColorDefinition
    let inverse: ColorDefinition
    
    init(
        primary: ColorDefinition = ColorDefinition(light: "#1D1D1F", dark: "#FFFFFF"),
        secondary: ColorDefinition = ColorDefinition(light: "#3C3C43", dark: "#EBEBF5"),
        tertiary: ColorDefinition = ColorDefinition(light: "#787880", dark: "#EBEBF599"),
        quaternary: ColorDefinition = ColorDefinition(light: "#787880", dark: "#EBEBF54D"),
        inverse: ColorDefinition = ColorDefinition(light: "#FFFFFF", dark: "#1D1D1F")
    ) {
        self.primary = primary
        self.secondary = secondary
        self.tertiary = tertiary
        self.quaternary = quaternary
        self.inverse = inverse
    }
}

struct SemanticColors: Codable, Equatable {
    let success: ColorDefinition
    let warning: ColorDefinition
    let error: ColorDefinition
    let info: ColorDefinition
    let destructive: ColorDefinition
    
    init(
        success: ColorDefinition = ColorDefinition(light: "#34C759", dark: "#30D158"),
        warning: ColorDefinition = ColorDefinition(light: "#FF9500", dark: "#FF9F0A"),
        error: ColorDefinition = ColorDefinition(light: "#FF3B30", dark: "#FF453A"),
        info: ColorDefinition = ColorDefinition(light: "#007AFF", dark: "#0A84FF"),
        destructive: ColorDefinition = ColorDefinition(light: "#FF3B30", dark: "#FF453A")
    ) {
        self.success = success
        self.warning = warning
        self.error = error
        self.info = info
        self.destructive = destructive
    }
}

// MARK: - Typography Properties

/// Typography properties following the structured schema approach
struct TypographyProperties: Codable, Equatable {
    let primaryFontName: String
    let bodyFontName: String
    let monospaceFontName: String
    let headingScaleFactor: Double
    let baseFontSize: Double
    let fontWeights: FontWeights
    let lineHeights: LineHeights
    let letterSpacing: LetterSpacing
    let textStyles: TextStyles
    
    init(
        primaryFontName: String = "HelveticaNeue-Bold",
        bodyFontName: String = "HelveticaNeue",
        monospaceFontName: String = "SF Mono",
        headingScaleFactor: Double = 1.5,
        baseFontSize: Double = 17,
        fontWeights: FontWeights = FontWeights(),
        lineHeights: LineHeights = LineHeights(),
        letterSpacing: LetterSpacing = LetterSpacing(),
        textStyles: TextStyles = TextStyles()
    ) {
        self.primaryFontName = primaryFontName
        self.bodyFontName = bodyFontName
        self.monospaceFontName = monospaceFontName
        self.headingScaleFactor = headingScaleFactor
        self.baseFontSize = baseFontSize
        self.fontWeights = fontWeights
        self.lineHeights = lineHeights
        self.letterSpacing = letterSpacing
        self.textStyles = textStyles
    }
}

struct FontWeights: Codable, Equatable {
    let light: String
    let regular: String
    let medium: String
    let semibold: String
    let bold: String
    let heavy: String
    
    init(
        light: String = "Light",
        regular: String = "Regular",
        medium: String = "Medium",
        semibold: String = "Semibold",
        bold: String = "Bold",
        heavy: String = "Heavy"
    ) {
        self.light = light
        self.regular = regular
        self.medium = medium
        self.semibold = semibold
        self.bold = bold
        self.heavy = heavy
    }
}

struct LineHeights: Codable, Equatable {
    let tight: Double
    let normal: Double
    let relaxed: Double
    let loose: Double
    
    init(
        tight: Double = 1.2,
        normal: Double = 1.5,
        relaxed: Double = 1.75,
        loose: Double = 2.0
    ) {
        self.tight = tight
        self.normal = normal
        self.relaxed = relaxed
        self.loose = loose
    }
}

struct LetterSpacing: Codable, Equatable {
    let tight: Double
    let normal: Double
    let wide: Double
    
    init(
        tight: Double = -0.5,
        normal: Double = 0.0,
        wide: Double = 0.5
    ) {
        self.tight = tight
        self.normal = normal
        self.wide = wide
    }
}

struct TextStyles: Codable, Equatable {
    let heading: HeadingStyles
    let body: BodyStyles
    let caption: CaptionStyles
    let button: ButtonStyles
    
    init(
        heading: HeadingStyles = HeadingStyles(),
        body: BodyStyles = BodyStyles(),
        caption: CaptionStyles = CaptionStyles(),
        button: ButtonStyles = ButtonStyles()
    ) {
        self.heading = heading
        self.body = body
        self.caption = caption
        self.button = button
    }
}

struct HeadingStyles: Codable, Equatable {
    let h1: TextStyle
    let h2: TextStyle
    let h3: TextStyle
    let h4: TextStyle
    let h5: TextStyle
    let h6: TextStyle
    
    init(
        h1: TextStyle = TextStyle(size: 32, weight: "Bold", lineHeight: 1.2),
        h2: TextStyle = TextStyle(size: 28, weight: "Bold", lineHeight: 1.3),
        h3: TextStyle = TextStyle(size: 24, weight: "Semibold", lineHeight: 1.3),
        h4: TextStyle = TextStyle(size: 20, weight: "Semibold", lineHeight: 1.4),
        h5: TextStyle = TextStyle(size: 18, weight: "Medium", lineHeight: 1.4),
        h6: TextStyle = TextStyle(size: 16, weight: "Medium", lineHeight: 1.5)
    ) {
        self.h1 = h1
        self.h2 = h2
        self.h3 = h3
        self.h4 = h4
        self.h5 = h5
        self.h6 = h6
    }
}

struct BodyStyles: Codable, Equatable {
    let large: TextStyle
    let medium: TextStyle
    let small: TextStyle
    
    init(
        large: TextStyle = TextStyle(size: 18, weight: "Regular", lineHeight: 1.5),
        medium: TextStyle = TextStyle(size: 16, weight: "Regular", lineHeight: 1.5),
        small: TextStyle = TextStyle(size: 14, weight: "Regular", lineHeight: 1.5)
    ) {
        self.large = large
        self.medium = medium
        self.small = small
    }
}

struct CaptionStyles: Codable, Equatable {
    let large: TextStyle
    let medium: TextStyle
    let small: TextStyle
    
    init(
        large: TextStyle = TextStyle(size: 12, weight: "Medium", lineHeight: 1.3),
        medium: TextStyle = TextStyle(size: 11, weight: "Regular", lineHeight: 1.3),
        small: TextStyle = TextStyle(size: 10, weight: "Regular", lineHeight: 1.2)
    ) {
        self.large = large
        self.medium = medium
        self.small = small
    }
}

struct ButtonStyles: Codable, Equatable {
    let large: TextStyle
    let medium: TextStyle
    let small: TextStyle
    
    init(
        large: TextStyle = TextStyle(size: 18, weight: "Semibold", lineHeight: 1.2),
        medium: TextStyle = TextStyle(size: 16, weight: "Semibold", lineHeight: 1.2),
        small: TextStyle = TextStyle(size: 14, weight: "Medium", lineHeight: 1.2)
    ) {
        self.large = large
        self.medium = medium
        self.small = small
    }
}

struct TextStyle: Codable, Equatable {
    let size: Double
    let weight: String
    let lineHeight: Double
    let letterSpacing: Double?
    
    init(
        size: Double,
        weight: String,
        lineHeight: Double,
        letterSpacing: Double? = nil
    ) {
        self.size = size
        self.weight = weight
        self.lineHeight = lineHeight
        self.letterSpacing = letterSpacing
    }
}

// MARK: - Iconography Properties

/// Iconography properties following the structured schema approach
struct IconographyProperties: Codable, Equatable {
    let family: String
    let sizes: IconSizes
    let weights: IconWeights
    let colors: IconColors
    let custom: [String: IconDefinition]
    
    init(
        family: String = "SF Symbols",
        sizes: IconSizes = IconSizes(),
        weights: IconWeights = IconWeights(),
        colors: IconColors = IconColors(),
        custom: [String: IconDefinition] = [:]
    ) {
        self.family = family
        self.sizes = sizes
        self.weights = weights
        self.colors = colors
        self.custom = custom
    }
}

struct IconSizes: Codable, Equatable {
    let small: Double
    let medium: Double
    let large: Double
    let xlarge: Double
    
    init(
        small: Double = 16,
        medium: Double = 20,
        large: Double = 24,
        xlarge: Double = 32
    ) {
        self.small = small
        self.medium = medium
        self.large = large
        self.xlarge = xlarge
    }
}

struct IconWeights: Codable, Equatable {
    let light: String
    let regular: String
    let medium: String
    let semibold: String
    let bold: String
    
    init(
        light: String = "Light",
        regular: String = "Regular",
        medium: String = "Medium",
        semibold: String = "Semibold",
        bold: String = "Bold"
    ) {
        self.light = light
        self.regular = regular
        self.medium = medium
        self.semibold = semibold
        self.bold = bold
    }
}

struct IconColors: Codable, Equatable {
    let primary: ColorDefinition
    let secondary: ColorDefinition
    let tertiary: ColorDefinition
    let disabled: ColorDefinition
    
    init(
        primary: ColorDefinition = ColorDefinition(light: "#0A7AFF", dark: "#0A84FF"),
        secondary: ColorDefinition = ColorDefinition(light: "#787880", dark: "#EBEBF599"),
        tertiary: ColorDefinition = ColorDefinition(light: "#C7C7CC", dark: "#48484A"),
        disabled: ColorDefinition = ColorDefinition(light: "#C7C7CC", dark: "#48484A")
    ) {
        self.primary = primary
        self.secondary = secondary
        self.tertiary = tertiary
        self.disabled = disabled
    }
}

struct IconDefinition: Codable, Equatable {
    let name: String
    let size: Double
    let weight: String
    let color: ColorDefinition?
    
    init(
        name: String,
        size: Double = 20,
        weight: String = "Regular",
        color: ColorDefinition? = nil
    ) {
        self.name = name
        self.size = size
        self.weight = weight
        self.color = color
    }
}

// MARK: - Layout Metrics Properties

/// Layout metrics properties following the structured schema approach
struct LayoutMetricsProperties: Codable, Equatable {
    let spacing: SpacingMetrics
    let padding: PaddingMetrics
    let margins: MarginMetrics
    let borderRadius: BorderRadiusMetrics
    let grid: GridMetrics
    let breakpoints: BreakpointMetrics
    
    init(
        spacing: SpacingMetrics = SpacingMetrics(),
        padding: PaddingMetrics = PaddingMetrics(),
        margins: MarginMetrics = MarginMetrics(),
        borderRadius: BorderRadiusMetrics = BorderRadiusMetrics(),
        grid: GridMetrics = GridMetrics(),
        breakpoints: BreakpointMetrics = BreakpointMetrics()
    ) {
        self.spacing = spacing
        self.padding = padding
        self.margins = margins
        self.borderRadius = borderRadius
        self.grid = grid
        self.breakpoints = breakpoints
    }
}

struct SpacingMetrics: Codable, Equatable {
    let xs: Double
    let sm: Double
    let md: Double
    let lg: Double
    let xl: Double
    let xxl: Double
    let xxxl: Double
    
    init(
        xs: Double = 4,
        sm: Double = 8,
        md: Double = 16,
        lg: Double = 24,
        xl: Double = 32,
        xxl: Double = 48,
        xxxl: Double = 64
    ) {
        self.xs = xs
        self.sm = sm
        self.md = md
        self.lg = lg
        self.xl = xl
        self.xxl = xxl
        self.xxxl = xxxl
    }
}

struct PaddingMetrics: Codable, Equatable {
    let xs: Double
    let sm: Double
    let md: Double
    let lg: Double
    let xl: Double
    
    init(
        xs: Double = 8,
        sm: Double = 12,
        md: Double = 16,
        lg: Double = 24,
        xl: Double = 32
    ) {
        self.xs = xs
        self.sm = sm
        self.md = md
        self.lg = lg
        self.xl = xl
    }
}

struct MarginMetrics: Codable, Equatable {
    let xs: Double
    let sm: Double
    let md: Double
    let lg: Double
    let xl: Double
    
    init(
        xs: Double = 8,
        sm: Double = 12,
        md: Double = 16,
        lg: Double = 24,
        xl: Double = 32
    ) {
        self.xs = xs
        self.sm = sm
        self.md = md
        self.lg = lg
        self.xl = xl
    }
}

struct BorderRadiusMetrics: Codable, Equatable {
    let xs: Double
    let sm: Double
    let md: Double
    let lg: Double
    let xl: Double
    let full: Double
    
    init(
        xs: Double = 2,
        sm: Double = 4,
        md: Double = 8,
        lg: Double = 12,
        xl: Double = 16,
        full: Double = 999
    ) {
        self.xs = xs
        self.sm = sm
        self.md = md
        self.lg = lg
        self.xl = xl
        self.full = full
    }
}

struct GridMetrics: Codable, Equatable {
    let columns: Int
    let gutter: Double
    let margin: Double
    
    init(
        columns: Int = 12,
        gutter: Double = 16,
        margin: Double = 16
    ) {
        self.columns = columns
        self.gutter = gutter
        self.margin = margin
    }
}

struct BreakpointMetrics: Codable, Equatable {
    let mobile: Double
    let tablet: Double
    let desktop: Double
    let wide: Double
    
    init(
        mobile: Double = 768,
        tablet: Double = 1024,
        desktop: Double = 1440,
        wide: Double = 1920
    ) {
        self.mobile = mobile
        self.tablet = tablet
        self.desktop = desktop
        self.wide = wide
    }
}

// MARK: - Shadow Properties

/// Shadow properties following the structured schema approach
struct ShadowProperties: Codable, Equatable {
    let small: ShadowDefinition
    let medium: ShadowDefinition
    let large: ShadowDefinition
    let xlarge: ShadowDefinition
    let custom: [String: ShadowDefinition]
    
    init(
        small: ShadowDefinition = ShadowDefinition(radius: 2, offset: CGPoint(x: 0, y: 1), opacity: 0.1),
        medium: ShadowDefinition = ShadowDefinition(radius: 4, offset: CGPoint(x: 0, y: 2), opacity: 0.15),
        large: ShadowDefinition = ShadowDefinition(radius: 8, offset: CGPoint(x: 0, y: 4), opacity: 0.2),
        xlarge: ShadowDefinition = ShadowDefinition(radius: 16, offset: CGPoint(x: 0, y: 8), opacity: 0.25),
        custom: [String: ShadowDefinition] = [:]
    ) {
        self.small = small
        self.medium = medium
        self.large = large
        self.xlarge = xlarge
        self.custom = custom
    }
}

struct ShadowDefinition: Codable, Equatable {
    let radius: Double
    let offset: CGPoint
    let opacity: Double
    let color: ColorDefinition?
    
    init(
        radius: Double,
        offset: CGPoint,
        opacity: Double,
        color: ColorDefinition? = nil
    ) {
        self.radius = radius
        self.offset = offset
        self.opacity = opacity
        self.color = color
    }
}

// MARK: - Animation Properties

/// Animation properties following the structured schema approach
struct AnimationProperties: Codable, Equatable {
    let duration: AnimationDuration
    let easing: AnimationEasing
    let spring: SpringConfiguration
    let custom: [String: AnimationDefinition]
    
    init(
        duration: AnimationDuration = AnimationDuration(),
        easing: AnimationEasing = AnimationEasing(),
        spring: SpringConfiguration = SpringConfiguration(),
        custom: [String: AnimationDefinition] = [:]
    ) {
        self.duration = duration
        self.easing = easing
        self.spring = spring
        self.custom = custom
    }
}

struct AnimationDuration: Codable, Equatable {
    let fast: Double
    let normal: Double
    let slow: Double
    
    init(
        fast: Double = 0.15,
        normal: Double = 0.3,
        slow: Double = 0.5
    ) {
        self.fast = fast
        self.normal = normal
        self.slow = slow
    }
}

struct AnimationEasing: Codable, Equatable {
    let easeIn: String
    let easeOut: String
    let easeInOut: String
    let linear: String
    
    init(
        easeIn: String = "easeIn",
        easeOut: String = "easeOut",
        easeInOut: String = "easeInOut",
        linear: String = "linear"
    ) {
        self.easeIn = easeIn
        self.easeOut = easeOut
        self.easeInOut = easeInOut
        self.linear = linear
    }
}

struct SpringConfiguration: Codable, Equatable {
    let response: Double
    let dampingFraction: Double
    let blendDuration: Double
    
    init(
        response: Double = 0.3,
        dampingFraction: Double = 0.7,
        blendDuration: Double = 0.0
    ) {
        self.response = response
        self.dampingFraction = dampingFraction
        self.blendDuration = blendDuration
    }
}

struct AnimationDefinition: Codable, Equatable {
    let duration: Double
    let easing: String
    let delay: Double?
    let repeatCount: Int?
    
    init(
        duration: Double,
        easing: String,
        delay: Double? = nil,
        repeatCount: Int? = nil
    ) {
        self.duration = duration
        self.easing = easing
        self.delay = delay
        self.repeatCount = repeatCount
    }
}

// MARK: - Accessibility Properties

/// Accessibility properties following the structured schema approach
struct AccessibilityProperties: Codable, Equatable {
    let highContrast: Bool
    let reducedMotion: Bool
    let increasedContrast: Bool
    let darkMode: Bool
    let dynamicType: Bool
    let voiceOver: VoiceOverSettings
    let switchControl: SwitchControlSettings
    
    init(
        highContrast: Bool = false,
        reducedMotion: Bool = false,
        increasedContrast: Bool = false,
        darkMode: Bool = true,
        dynamicType: Bool = true,
        voiceOver: VoiceOverSettings = VoiceOverSettings(),
        switchControl: SwitchControlSettings = SwitchControlSettings()
    ) {
        self.highContrast = highContrast
        self.reducedMotion = reducedMotion
        self.increasedContrast = increasedContrast
        self.darkMode = darkMode
        self.dynamicType = dynamicType
        self.voiceOver = voiceOver
        self.switchControl = switchControl
    }
}

struct VoiceOverSettings: Codable, Equatable {
    let enabled: Bool
    let speakScreen: Bool
    let speakSelection: Bool
    let largeCursor: Bool
    
    init(
        enabled: Bool = false,
        speakScreen: Bool = false,
        speakSelection: Bool = false,
        largeCursor: Bool = false
    ) {
        self.enabled = enabled
        self.speakScreen = speakScreen
        self.speakSelection = speakSelection
        self.largeCursor = largeCursor
    }
}

struct SwitchControlSettings: Codable, Equatable {
    let enabled: Bool
    let autoScanning: Bool
    let groupItems: Bool
    
    init(
        enabled: Bool = false,
        autoScanning: Bool = false,
        groupItems: Bool = false
    ) {
        self.enabled = enabled
        self.autoScanning = autoScanning
        self.groupItems = groupItems
    }
}

// MARK: - Custom Properties

/// Custom property for extensible schema
struct CustomProperty: Codable, Equatable {
    let type: String
    let value: String
    let description: String?
    
    init(
        type: String,
        value: String,
        description: String? = nil
    ) {
        self.type = type
        self.value = value
        self.description = description
    }
}

// MARK: - Extensions

extension String {
    var isValidHexColor: Bool {
        let hexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
        return range(of: hexPattern, options: .regularExpression) != nil
    }
}

extension CGPoint: Codable {
    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let x = try container.decode(Double.self, forKey: .x)
        let y = try container.decode(Double.self, forKey: .y)
        self.init(x: x, y: y)
    }
    
    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(x, forKey: .x)
        try container.encode(y, forKey: .y)
    }
    
    private enum CodingKeys: String, CodingKey {
        case x, y
    }
}

// MARK: - Schema Validation

/// Schema validation and error handling
struct SchemaValidation {
    static func validate(_ schema: ThemeSchema) -> [SchemaValidationError] {
        var errors: [SchemaValidationError] = []
        
        // Validate required fields
        if schema.metadata.name.isEmpty {
            errors.append(.missingRequiredField("metadata.name"))
        }
        
        if schema.metadata.author.isEmpty {
            errors.append(.missingRequiredField("metadata.author"))
        }
        
        if schema.metadata.version.isEmpty {
            errors.append(.missingRequiredField("metadata.version"))
        }
        
        // Validate colors
        if !schema.properties.colors.primary.isValid {
            errors.append(.invalidColor("properties.colors.primary"))
        }
        
        if !schema.properties.colors.secondary.isValid {
            errors.append(.invalidColor("properties.colors.secondary"))
        }
        
        // Validate typography
        if schema.properties.typography.baseFontSize <= 0 {
            errors.append(.invalidFontSize("properties.typography.baseFontSize"))
        }
        
        if schema.properties.typography.headingScaleFactor <= 0 {
            errors.append(.invalidScaleFactor("properties.typography.headingScaleFactor"))
        }
        
        // Validate layout metrics
        if schema.properties.layoutMetrics.spacing.xs < 0 {
            errors.append(.invalidSpacing("properties.layoutMetrics.spacing.xs"))
        }
        
        // Validate shadows
        if schema.properties.shadows.small.opacity < 0 || schema.properties.shadows.small.opacity > 1 {
            errors.append(.invalidShadowOpacity("properties.shadows.small.opacity"))
        }
        
        return errors
    }
}

enum SchemaValidationError: LocalizedError {
    case missingRequiredField(String)
    case invalidColor(String)
    case invalidFontSize(String)
    case invalidScaleFactor(String)
    case invalidSpacing(String)
    case invalidShadowOpacity(String)
    case invalidAnimation(String)
    
    var errorDescription: String? {
        switch self {
        case .missingRequiredField(let field):
            return "Missing required field: \(field)"
        case .invalidColor(let color):
            return "Invalid color definition: \(color)"
        case .invalidFontSize(let size):
            return "Invalid font size: \(size)"
        case .invalidScaleFactor(let factor):
            return "Invalid scale factor: \(factor)"
        case .invalidSpacing(let spacing):
            return "Invalid spacing value: \(spacing)"
        case .invalidShadowOpacity(let opacity):
            return "Invalid shadow opacity: \(opacity)"
        case .invalidAnimation(let animation):
            return "Invalid animation definition: \(animation)"
        }
    }
}

// MARK: - Schema Serialization

/// JSON serialization and deserialization utilities
struct SchemaSerialization {
    static let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
    
    static let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
    
    static func encode(_ schema: ThemeSchema) throws -> Data {
        return try encoder.encode(schema)
    }
    
    static func decode(_ data: Data) throws -> ThemeSchema {
        return try decoder.decode(ThemeSchema.self, from: data)
    }
    
    static func encodeToString(_ schema: ThemeSchema) throws -> String {
        let data = try encode(schema)
        guard let string = String(data: data, encoding: .utf8) else {
            throw SchemaSerializationError.encodingFailed
        }
        return string
    }
    
    static func decodeFromString(_ string: String) throws -> ThemeSchema {
        guard let data = string.data(using: .utf8) else {
            throw SchemaSerializationError.decodingFailed
        }
        return try decode(data)
    }
}

enum SchemaSerializationError: LocalizedError {
    case encodingFailed
    case decodingFailed
    case invalidJSON
    
    var errorDescription: String? {
        switch self {
        case .encodingFailed:
            return "Failed to encode schema to JSON"
        case .decodingFailed:
            return "Failed to decode schema from JSON"
        case .invalidJSON:
            return "Invalid JSON format"
        }
    }
}

// MARK: - Preview

struct ThemeSchema_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("Theme Schema")
                .font(.title)
            
            let sampleSchema = ThemeSchema(
                metadata: ThemeMetadata(
                    name: "Sample Schema",
                    author: "Aether Team",
                    description: "A sample theme schema"
                ),
                properties: ThemeProperties()
            )
            
            Text("Schema: \(sampleSchema.metadata.name)")
            Text("Author: \(sampleSchema.metadata.author)")
            Text("Version: \(sampleSchema.metadata.version)")
        }
        .padding()
    }
} 