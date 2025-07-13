//
//  IconographyManager.swift
//  Aether SwiftUI App
//
//  Comprehensive iconography management system with consistent styling,
//  customizable icon sets, and theme integration for intuitive navigation.
//

import SwiftUI

// MARK: - Icon Style System

/// Icon style configuration for consistent iconography
struct IconStyle {
    /// Icon family/set (SF Symbols, custom, etc.)
    let family: IconFamily
    
    /// Icon weight/style
    let weight: IconWeight
    
    /// Icon size scale
    let size: IconSize
    
    /// Icon color treatment
    let colorTreatment: IconColorTreatment
    
    /// Icon positioning and alignment
    let positioning: IconPositioning
    
    /// Animation style for interactive icons
    let animation: IconAnimation
    
    init(
        family: IconFamily = .sfSymbols,
        weight: IconWeight = .regular,
        size: IconSize = .medium,
        colorTreatment: IconColorTreatment = .theme,
        positioning: IconPositioning = .center,
        animation: IconAnimation = .subtle
    ) {
        self.family = family
        self.weight = weight
        self.size = size
        self.colorTreatment = colorTreatment
        self.positioning = positioning
        self.animation = animation
    }
}

// MARK: - Icon Family

enum IconFamily: String, CaseIterable {
    case sfSymbols = "SF Symbols"
    case custom = "Custom"
    case outlined = "Outlined"
    case filled = "Filled"
    case rounded = "Rounded"
    case sharp = "Sharp"
    case twoTone = "Two-Tone"
    
    var description: String {
        switch self {
        case .sfSymbols:
            return "Apple's system icons with consistent design language"
        case .custom:
            return "Custom icon set with unique visual style"
        case .outlined:
            return "Clean outlined icons with minimal weight"
        case .filled:
            return "Solid filled icons with strong presence"
        case .rounded:
            return "Soft rounded corners for friendly feel"
        case .sharp:
            return "Sharp geometric shapes for modern look"
        case .twoTone:
            return "Two-color icons for visual interest"
        }
    }
    
    var previewIcon: String {
        switch self {
        case .sfSymbols: return "star.fill"
        case .custom: return "custom.star"
        case .outlined: return "star"
        case .filled: return "star.fill"
        case .rounded: return "star.circle.fill"
        case .sharp: return "star.square.fill"
        case .twoTone: return "star.square.on.square"
        }
    }
}

// MARK: - Icon Weight

enum IconWeight: String, CaseIterable {
    case ultraLight = "Ultra Light"
    case thin = "Thin"
    case light = "Light"
    case regular = "Regular"
    case medium = "Medium"
    case semibold = "Semibold"
    case bold = "Bold"
    case heavy = "Heavy"
    case black = "Black"
    
    var fontWeight: Font.Weight {
        switch self {
        case .ultraLight: return .ultraLight
        case .thin: return .thin
        case .light: return .light
        case .regular: return .regular
        case .medium: return .medium
        case .semibold: return .semibold
        case .bold: return .bold
        case .heavy: return .heavy
        case .black: return .black
        }
    }
    
    var description: String {
        switch self {
        case .ultraLight: return "Very thin lines for subtle appearance"
        case .thin: return "Thin lines for elegant look"
        case .light: return "Light weight for clean design"
        case .regular: return "Standard weight for most use cases"
        case .medium: return "Medium weight for emphasis"
        case .semibold: return "Semi-bold for strong presence"
        case .bold: return "Bold weight for high emphasis"
        case .heavy: return "Heavy weight for maximum impact"
        case .black: return "Black weight for strongest presence"
        }
    }
}

// MARK: - Icon Size

enum IconSize: String, CaseIterable {
    case tiny = "Tiny"
    case small = "Small"
    case medium = "Medium"
    case large = "Large"
    case extraLarge = "Extra Large"
    case huge = "Huge"
    
    var size: CGFloat {
        switch self {
        case .tiny: return 12
        case .small: return 16
        case .medium: return 20
        case .large: return 24
        case .extraLarge: return 32
        case .huge: return 48
        }
    }
    
    var description: String {
        switch self {
        case .tiny: return "12pt - For very small spaces"
        case .small: return "16pt - For compact interfaces"
        case .medium: return "20pt - Standard size for most uses"
        case .large: return "24pt - For emphasis and buttons"
        case .extraLarge: return "32pt - For prominent features"
        case .huge: return "48pt - For hero sections"
        }
    }
}

// MARK: - Icon Color Treatment

enum IconColorTreatment: String, CaseIterable {
    case theme = "Theme"
    case monochrome = "Monochrome"
    case accent = "Accent"
    case semantic = "Semantic"
    case custom = "Custom"
    
    var description: String {
        switch self {
        case .theme:
            return "Uses theme colors for consistency"
        case .monochrome:
            return "Single color for minimal look"
        case .accent:
            return "Uses accent colors for emphasis"
        case .semantic:
            return "Colors based on meaning (success, warning, etc.)"
        case .custom:
            return "Custom color palette"
        }
    }
}

// MARK: - Icon Positioning

enum IconPositioning: String, CaseIterable {
    case center = "Center"
    case leading = "Leading"
    case trailing = "Trailing"
    case top = "Top"
    case bottom = "Bottom"
    
    var description: String {
        switch self {
        case .center: return "Centered alignment"
        case .leading: return "Left-aligned positioning"
        case .trailing: return "Right-aligned positioning"
        case .top: return "Top-aligned positioning"
        case .bottom: return "Bottom-aligned positioning"
        }
    }
}

// MARK: - Icon Animation

enum IconAnimation: String, CaseIterable {
    case none = "None"
    case subtle = "Subtle"
    case bounce = "Bounce"
    case pulse = "Pulse"
    case rotate = "Rotate"
    case scale = "Scale"
    
    var description: String {
        switch self {
        case .none: return "No animation"
        case .subtle: return "Gentle hover effects"
        case .bounce: return "Bouncy interaction feedback"
        case .pulse: return "Pulsing attention effect"
        case .rotate: return "Rotation on interaction"
        case .scale: return "Scale transformation"
        }
    }
}

// MARK: - Icon Definition

/// Represents a single icon with its properties
struct UIIconDefinition {
    let name: String
    let category: IconCategory
    let description: String
    let tags: [String]
    let accessibilityLabel: String
    
    init(
        name: String,
        category: IconCategory,
        description: String,
        tags: [String] = [],
        accessibilityLabel: String? = nil
    ) {
        self.name = name
        self.category = category
        self.description = description
        self.tags = tags
        self.accessibilityLabel = accessibilityLabel ?? description
    }
}

// MARK: - Icon Category

enum IconCategory: String, CaseIterable {
    case navigation = "Navigation"
    case actions = "Actions"
    case status = "Status"
    case media = "Media"
    case communication = "Communication"
    case commerce = "Commerce"
    case social = "Social"
    case system = "System"
    case custom = "Custom"
    
    var description: String {
        switch self {
        case .navigation: return "Navigation and wayfinding icons"
        case .actions: return "Action and interaction icons"
        case .status: return "Status and state indicators"
        case .media: return "Media and content icons"
        case .communication: return "Communication and messaging"
        case .commerce: return "Shopping and commerce"
        case .social: return "Social media and sharing"
        case .system: return "System and settings"
        case .custom: return "Custom application icons"
        }
    }
}

// MARK: - Iconography Manager

/// Main iconography management system
class IconographyManager: ObservableObject {
    @Published var currentStyle: IconStyle
    @Published var customIcons: [String: UIIconDefinition] = [:]
    @Published var iconMappings: [String: String] = [:]
    
    // Predefined icon sets
    private let defaultIcons: [UIIconDefinition] = [
        // Navigation
        UIIconDefinition(name: "chevron.left", category: .navigation, description: "Back navigation", tags: ["back", "previous", "left"]),
        UIIconDefinition(name: "chevron.right", category: .navigation, description: "Forward navigation", tags: ["forward", "next", "right"]),
        UIIconDefinition(name: "house", category: .navigation, description: "Home", tags: ["home", "main"]),
        UIIconDefinition(name: "magnifyingglass", category: .navigation, description: "Search", tags: ["search", "find"]),
        
        // Actions
        UIIconDefinition(name: "plus", category: .actions, description: "Add", tags: ["add", "create", "new"]),
        UIIconDefinition(name: "minus", category: .actions, description: "Remove", tags: ["remove", "delete", "subtract"]),
        UIIconDefinition(name: "checkmark", category: .actions, description: "Confirm", tags: ["confirm", "done", "success"]),
        UIIconDefinition(name: "xmark", category: .actions, description: "Cancel", tags: ["cancel", "close", "dismiss"]),
        
        // Status
        UIIconDefinition(name: "checkmark.circle.fill", category: .status, description: "Success", tags: ["success", "complete", "done"]),
        UIIconDefinition(name: "exclamationmark.triangle.fill", category: .status, description: "Warning", tags: ["warning", "alert", "caution"]),
        UIIconDefinition(name: "xmark.circle.fill", category: .status, description: "Error", tags: ["error", "fail", "stop"]),
        UIIconDefinition(name: "info.circle.fill", category: .status, description: "Information", tags: ["info", "help", "information"]),
        
        // Media
        UIIconDefinition(name: "play.fill", category: .media, description: "Play", tags: ["play", "start", "media"]),
        UIIconDefinition(name: "pause.fill", category: .media, description: "Pause", tags: ["pause", "stop", "media"]),
        UIIconDefinition(name: "photo", category: .media, description: "Photo", tags: ["photo", "image", "picture"]),
        UIIconDefinition(name: "video", category: .media, description: "Video", tags: ["video", "movie", "media"]),
        
        // Communication
        UIIconDefinition(name: "message", category: .communication, description: "Message", tags: ["message", "chat", "communication"]),
        UIIconDefinition(name: "envelope", category: .communication, description: "Email", tags: ["email", "mail", "communication"]),
        UIIconDefinition(name: "phone", category: .communication, description: "Phone", tags: ["phone", "call", "communication"]),
        UIIconDefinition(name: "person", category: .communication, description: "Person", tags: ["person", "user", "profile"]),
        
        // Commerce
        UIIconDefinition(name: "cart", category: .commerce, description: "Shopping cart", tags: ["cart", "shopping", "buy"]),
        UIIconDefinition(name: "creditcard", category: .commerce, description: "Payment", tags: ["payment", "card", "money"]),
        UIIconDefinition(name: "bag", category: .commerce, description: "Bag", tags: ["bag", "shopping", "store"]),
        UIIconDefinition(name: "heart", category: .commerce, description: "Favorite", tags: ["favorite", "like", "love"]),
        
        // Social
        UIIconDefinition(name: "share", category: .social, description: "Share", tags: ["share", "social", "export"]),
        UIIconDefinition(name: "bookmark", category: .social, description: "Bookmark", tags: ["bookmark", "save", "favorite"]),
        UIIconDefinition(name: "star", category: .social, description: "Star", tags: ["star", "rating", "favorite"]),
        UIIconDefinition(name: "hand.thumbsup", category: .social, description: "Like", tags: ["like", "thumbsup", "approve"]),
        
        // System
        UIIconDefinition(name: "gear", category: .system, description: "Settings", tags: ["settings", "gear", "preferences"]),
        UIIconDefinition(name: "bell", category: .system, description: "Notifications", tags: ["notifications", "bell", "alerts"]),
        UIIconDefinition(name: "lock", category: .system, description: "Security", tags: ["security", "lock", "privacy"]),
        UIIconDefinition(name: "wifi", category: .system, description: "WiFi", tags: ["wifi", "network", "connection"])
    ]
    
    init() {
        self.currentStyle = IconStyle()
        self.loadCustomIcons()
    }
    
    // MARK: - Icon Retrieval
    
    /// Get icon with current style applied
    func icon(_ name: String, style: IconStyle? = nil) -> some View {
        let iconStyle = style ?? currentStyle
        let iconName = iconMappings[name] ?? name
        
        return Image(systemName: iconName)
            .font(.system(size: iconStyle.size.size, weight: iconStyle.weight.fontWeight))
            .foregroundColor(iconColor(for: iconStyle))
            .animation(iconStyle.animation.animationValue, value: iconStyle)
    }
    
    /// Get icon with custom size
    func icon(_ name: String, size: IconSize) -> some View {
        var style = currentStyle
        style.size = size
        return icon(name, style: style)
    }
    
    /// Get icon with custom color
    func icon(_ name: String, color: Color) -> some View {
        var style = currentStyle
        style.colorTreatment = .custom
        return icon(name, style: style)
            .foregroundColor(color)
    }
    
    // MARK: - Color Management
    
    private func iconColor(for style: IconStyle) -> Color {
        switch style.colorTreatment {
        case .theme:
            return .primary
        case .monochrome:
            return .secondary
        case .accent:
            return .accentColor
        case .semantic:
            return .primary
        case .custom:
            return .primary
        }
    }
    
    // MARK: - Icon Management
    
    /// Add custom icon
    func addCustomIcon(_ icon: UIIconDefinition) {
        customIcons[icon.name] = icon
        saveCustomIcons()
    }
    
    /// Remove custom icon
    func removeCustomIcon(_ name: String) {
        customIcons.removeValue(forKey: name)
        saveCustomIcons()
    }
    
    /// Map icon name to different icon
    func mapIcon(_ originalName: String, to mappedName: String) {
        iconMappings[originalName] = mappedName
    }
    
    /// Get all icons by category
    func icons(for category: IconCategory) -> [UIIconDefinition] {
        return defaultIcons.filter { $0.category == category } +
               customIcons.values.filter { $0.category == category }
    }
    
    /// Search icons by tag
    func searchIcons(query: String) -> [UIIconDefinition] {
        let allIcons = defaultIcons + Array(customIcons.values)
        return allIcons.filter { icon in
            icon.name.localizedCaseInsensitiveContains(query) ||
            icon.description.localizedCaseInsensitiveContains(query) ||
            icon.tags.contains { $0.localizedCaseInsensitiveContains(query) }
        }
    }
    
    // MARK: - Persistence
    
    private func loadCustomIcons() {
        // Load custom icons from UserDefaults or file
        if let data = UserDefaults.standard.data(forKey: "customIcons"),
           let icons = try? JSONDecoder().decode([String: IconDefinition].self, from: data) {
            customIcons = icons
        }
        
        if let mappings = UserDefaults.standard.dictionary(forKey: "iconMappings") as? [String: String] {
            iconMappings = mappings
        }
    }
    
    private func saveCustomIcons() {
        if let data = try? JSONEncoder().encode(customIcons) {
            UserDefaults.standard.set(data, forKey: "customIcons")
        }
        UserDefaults.standard.set(iconMappings, forKey: "iconMappings")
    }
}

// MARK: - Extensions

extension IconAnimation {
    var animationValue: Animation? {
        switch self {
        case .none: return nil
        case .subtle: return .easeInOut(duration: 0.2)
        case .bounce: return .spring(response: 0.3, dampingFraction: 0.6)
        case .pulse: return .easeInOut(duration: 0.6).repeatForever(autoreverses: true)
        case .rotate: return .easeInOut(duration: 0.3)
        case .scale: return .spring(response: 0.3, dampingFraction: 0.7)
        }
    }
}

// MARK: - Icon View Modifiers

struct IconStyleModifier: ViewModifier {
    let style: IconStyle
    
    func body(content: Content) -> some View {
        content
            .font(.system(size: style.size.size, weight: style.weight.fontWeight))
            .foregroundColor(iconColor(for: style))
            .animation(style.animation.animationValue, value: style)
    }
    
    private func iconColor(for style: IconStyle) -> Color {
        switch style.colorTreatment {
        case .theme: return .primary
        case .monochrome: return .secondary
        case .accent: return .accentColor
        case .semantic: return .primary
        case .custom: return .primary
        }
    }
}

extension View {
    func iconStyle(_ style: IconStyle) -> some View {
        modifier(IconStyleModifier(style: style))
    }
}

// MARK: - Preview

struct IconographyManager_Previews: PreviewProvider {
    static var previews: some View {
        VStack(spacing: 20) {
            Text("Iconography Manager")
                .font(.title)
            
            HStack {
                ForEach(IconFamily.allCases, id: \.self) { family in
                    VStack {
                        Image(systemName: family.previewIcon)
                            .font(.title2)
                        Text(family.rawValue)
                            .font(.caption)
                    }
                }
            }
        }
        .padding()
    }
} 