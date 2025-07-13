//
//  ThemeDataModel.swift
//  Aether SwiftUI App
//
//  Comprehensive theme data model with JSON serialization,
//  validation, and portability features for consistent theming.
//

import SwiftUI
import Foundation

// MARK: - Theme Data Model

/// Core theme data structure that defines the complete theme schema
struct ThemeDataModel: Codable, Identifiable, Equatable {
    let id: String
    let name: String
    let version: String
    let description: String?
    let author: String?
    let createdAt: Date
    let updatedAt: Date
    let metadata: ThemeMetadata
    let colors: ColorPalette
    let typography: TypographySystem
    let spacing: SpacingSystem
    let shadows: ShadowSystem
    let animations: AnimationSystem
    let icons: IconSystem
    let accessibility: AccessibilitySettings
    
    // MARK: - Initialization
    
    init(
        id: String = UUID().uuidString,
        name: String,
        version: String = "1.0.0",
        description: String? = nil,
        author: String? = nil,
        metadata: ThemeMetadata,
        colors: ColorPalette,
        typography: TypographySystem,
        spacing: SpacingSystem,
        shadows: ShadowSystem,
        animations: AnimationSystem,
        icons: IconSystem,
        accessibility: AccessibilitySettings
    ) {
        self.id = id
        self.name = name
        self.version = version
        self.description = description
        self.author = author
        self.createdAt = Date()
        self.updatedAt = Date()
        self.metadata = metadata
        self.colors = colors
        self.typography = typography
        self.spacing = spacing
        self.shadows = shadows
        self.animations = animations
        self.icons = icons
        self.accessibility = accessibility
    }
    
    // MARK: - Validation
    
    /// Validates the theme data model
    func validate() -> ThemeValidationResult {
        var errors: [ThemeValidationError] = []
        
        // Validate required fields
        if name.isEmpty {
            errors.append(.invalidName("Theme name cannot be empty"))
        }
        
        if version.isEmpty {
            errors.append(.invalidVersion("Version cannot be empty"))
        }
        
        // Validate colors
        let colorValidation = colors.validate()
        errors.append(contentsOf: colorValidation.errors)
        
        // Validate typography
        let typographyValidation = typography.validate()
        errors.append(contentsOf: typographyValidation.errors)
        
        // Validate spacing
        let spacingValidation = spacing.validate()
        errors.append(contentsOf: spacingValidation.errors)
        
        // Validate shadows
        let shadowValidation = shadows.validate()
        errors.append(contentsOf: shadowValidation.errors)
        
        // Validate animations
        let animationValidation = animations.validate()
        errors.append(contentsOf: animationValidation.errors)
        
        // Validate icons
        let iconValidation = icons.validate()
        errors.append(contentsOf: iconValidation.errors)
        
        // Validate accessibility
        let accessibilityValidation = accessibility.validate()
        errors.append(contentsOf: accessibilityValidation.errors)
        
        return ThemeValidationResult(
            isValid: errors.isEmpty,
            errors: errors,
            warnings: []
        )
    }
    
    // MARK: - Serialization
    
    /// Converts the theme data model to JSON
    func toJSON() -> Data? {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = .prettyPrinted
        return try? encoder.encode(self)
    }
    
    /// Creates a theme data model from JSON
    static func fromJSON(_ data: Data) -> ThemeDataModel? {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode(ThemeDataModel.self, from: data)
    }
    
    // MARK: - Export
    
    /// Exports the theme to various formats
    func export(to format: ExportFormat) -> Data? {
        switch format {
        case .json:
            return toJSON()
        case .plist:
            return exportToPlist()
        case .css:
            return exportToCSS()
        case .swift:
            return exportToSwift()
        }
    }
    
    private func exportToPlist() -> Data? {
        // Convert to property list format
        let plistData: [String: Any] = [
            "id": id,
            "name": name,
            "version": version,
            "description": description ?? "",
            "author": author ?? "",
            "createdAt": createdAt.timeIntervalSince1970,
            "updatedAt": updatedAt.timeIntervalSince1970,
            "metadata": metadata.toDictionary(),
            "colors": colors.toDictionary(),
            "typography": typography.toDictionary(),
            "spacing": spacing.toDictionary(),
            "shadows": shadows.toDictionary(),
            "animations": animations.toDictionary(),
            "icons": icons.toDictionary(),
            "accessibility": accessibility.toDictionary()
        ]
        
        return try? PropertyListSerialization.data(
            fromPropertyList: plistData,
            format: .xml,
            options: 0
        )
    }
    
    private func exportToCSS() -> Data? {
        var css = """
        /* Theme: \(name) */
        /* Version: \(version) */
        /* Generated: \(Date()) */
        
        :root {
        """
        
        // Export colors
        css += "\n  /* Colors */\n"
        for (key, value) in colors.toCSSVariables() {
            css += "  --\(key): \(value);\n"
        }
        
        // Export typography
        css += "\n  /* Typography */\n"
        for (key, value) in typography.toCSSVariables() {
            css += "  --\(key): \(value);\n"
        }
        
        // Export spacing
        css += "\n  /* Spacing */\n"
        for (key, value) in spacing.toCSSVariables() {
            css += "  --\(key): \(value);\n"
        }
        
        css += "}\n"
        
        return css.data(using: .utf8)
    }
    
    private func exportToSwift() -> Data? {
        var swift = """
        // Theme: \(name)
        // Version: \(version)
        // Generated: \(Date())
        
        import SwiftUI
        
        struct \(name.replacingOccurrences(of: " ", with: ""))Theme {
        """
        
        // Export colors
        swift += "\n  // MARK: - Colors\n"
        for (key, value) in colors.toSwiftVariables() {
            swift += "  static let \(key) = Color(hex: \"\(value)\")\n"
        }
        
        // Export typography
        swift += "\n  // MARK: - Typography\n"
        for (key, value) in typography.toSwiftVariables() {
            swift += "  static let \(key) = Font.system(size: \(value))\n"
        }
        
        // Export spacing
        swift += "\n  // MARK: - Spacing\n"
        for (key, value) in spacing.toSwiftVariables() {
            swift += "  static let \(key): CGFloat = \(value)\n"
        }
        
        swift += "}\n"
        
        return swift.data(using: .utf8)
    }
}

// MARK: - Export Format

enum ExportFormat: String, CaseIterable {
    case json = "JSON"
    case plist = "Property List"
    case css = "CSS Variables"
    case swift = "Swift Code"
    
    var fileExtension: String {
        switch self {
        case .json: return "json"
        case .plist: return "plist"
        case .css: return "css"
        case .swift: return "swift"
        }
    }
    
    var mimeType: String {
        switch self {
        case .json: return "application/json"
        case .plist: return "application/x-plist"
        case .css: return "text/css"
        case .swift: return "text/x-swift"
        }
    }
}

// MARK: - Extensions for Dictionary Conversion

extension ThemeMetadata {
    func toDictionary() -> [String: Any] {
        return [
            "tags": tags,
            "category": category.rawValue,
            "platform": platform.rawValue,
            "compatibility": compatibility.map { $0.rawValue },
            "license": license.rawValue,
            "dependencies": dependencies
        ]
    }
}

extension ColorPalette {
    func toDictionary() -> [String: Any] {
        return [
            "primary": primary.toDictionary(),
            "secondary": secondary.toDictionary(),
            "accent": accent?.toDictionary(),
            "neutral": neutral.toDictionary(),
            "semantic": semantic.toDictionary(),
            "gradients": gradients.map { $0.toDictionary() }
        ]
    }
    
    func toCSSVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        variables["color-primary"] = primary.hex
        variables["color-secondary"] = secondary.hex
        if let accent = accent {
            variables["color-accent"] = accent.hex
        }
        variables["color-neutral"] = neutral.hex
        
        // Add semantic colors
        for (key, value) in semantic.toCSSVariables() {
            variables["color-\(key)"] = value
        }
        
        return variables
    }
    
    func toSwiftVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        variables["primaryColor"] = primary.hex
        variables["secondaryColor"] = secondary.hex
        if let accent = accent {
            variables["accentColor"] = accent.hex
        }
        variables["neutralColor"] = neutral.hex
        
        return variables
    }
}

extension TypographySystem {
    func toDictionary() -> [String: Any] {
        return [
            "fontFamilies": fontFamilies.map { $0.toDictionary() },
            "fontSizes": fontSizes.map { $0.toDictionary() },
            "fontWeights": fontWeights.map { $0.toDictionary() },
            "lineHeights": lineHeights.map { $0.toDictionary() },
            "textStyles": textStyles.map { $0.toDictionary() }
        ]
    }
    
    func toCSSVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        for style in textStyles {
            variables["font-\(style.name.lowercased())"] = "\(style.fontSize)px"
            variables["line-height-\(style.name.lowercased())"] = "\(style.lineHeight)"
        }
        
        return variables
    }
    
    func toSwiftVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        for style in textStyles {
            variables["\(style.name.lowercased())Font"] = "\(style.fontSize)"
        }
        
        return variables
    }
}

extension SpacingSystem {
    func toDictionary() -> [String: Any] {
        return [
            "baseUnit": baseUnit,
            "scale": scale,
            "spacing": spacing.map { $0.toDictionary() }
        ]
    }
    
    func toCSSVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        for space in spacing {
            variables["spacing-\(space.name.lowercased())"] = "\(space.value)px"
        }
        
        return variables
    }
    
    func toSwiftVariables() -> [String: String] {
        var variables: [String: String] = [:]
        
        for space in spacing {
            variables["\(space.name.lowercased())Spacing"] = "\(space.value)"
        }
        
        return variables
    }
}

extension ShadowSystem {
    func toDictionary() -> [String: Any] {
        return [
            "shadows": shadows.map { $0.toDictionary() }
        ]
    }
}

extension AnimationSystem {
    func toDictionary() -> [String: Any] {
        return [
            "durations": durations.map { $0.toDictionary() },
            "easings": easings.map { $0.toDictionary() },
            "transitions": transitions.map { $0.toDictionary() }
        ]
    }
}

extension IconSystem {
    func toDictionary() -> [String: Any] {
        return [
            "families": families.map { $0.toDictionary() },
            "sizes": sizes.map { $0.toDictionary() },
            "definitions": definitions.map { $0.toDictionary() }
        ]
    }
}

extension AccessibilitySettings {
    func toDictionary() -> [String: Any] {
        return [
            "minimumContrastRatio": minimumContrastRatio,
            "supportReducedMotion": supportReducedMotion,
            "supportHighContrast": supportHighContrast,
            "supportLargeText": supportLargeText,
            "colorBlindnessSupport": colorBlindnessSupport.rawValue
        ]
    }
} 