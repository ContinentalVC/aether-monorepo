//
//  AdvancedThemeArchitecture.swift
//  Aether SwiftUI App
//
//  Advanced theming architecture with inheritance and composition
//  using the Composite design pattern for maximum reusability and maintainability.
//

import SwiftUI
import Foundation

// MARK: - Theme Component Protocol

/// Protocol defining the contract for all theme components
/// This enables the Composite pattern where components can be composed together
protocol ThemeComponent: AnyObject {
    /// Resolves a theme value for a given key
    /// - Parameter key: The theme key to resolve
    /// - Returns: The resolved value or nil if not found
    func value(for key: ThemeKey) -> Any?
    
    /// Gets all available keys in this component
    /// - Returns: Array of available theme keys
    func availableKeys() -> [ThemeKey]
    
    /// Merges this component with another component
    /// - Parameter other: The component to merge with
    /// - Returns: A new merged component
    func merge(with other: ThemeComponent) -> ThemeComponent
}

// MARK: - Theme Key System

/// Enumeration of all possible theme keys for type-safe access
enum ThemeKey: String, CaseIterable {
    // Color keys
    case primaryColor = "primaryColor"
    case secondaryColor = "secondaryColor"
    case tertiaryColor = "tertiaryColor"
    case backgroundColor = "backgroundColor"
    case surfaceColor = "surfaceColor"
    case textColor = "textColor"
    case successColor = "successColor"
    case warningColor = "warningColor"
    case errorColor = "errorColor"
    
    // Typography keys
    case primaryFont = "primaryFont"
    case bodyFont = "bodyFont"
    case headingFont = "headingFont"
    case fontSize = "fontSize"
    case fontWeight = "fontWeight"
    case lineHeight = "lineHeight"
    case letterSpacing = "letterSpacing"
    
    // Layout keys
    case spacing = "spacing"
    case padding = "padding"
    case margin = "margin"
    case borderRadius = "borderRadius"
    case gridColumns = "gridColumns"
    case gridGutter = "gridGutter"
    
    // Shadow keys
    case shadowRadius = "shadowRadius"
    case shadowOffset = "shadowOffset"
    case shadowOpacity = "shadowOpacity"
    case shadowColor = "shadowColor"
    
    // Animation keys
    case animationDuration = "animationDuration"
    case animationEasing = "animationEasing"
    case springResponse = "springResponse"
    case springDamping = "springDamping"
    
    // Accessibility keys
    case highContrast = "highContrast"
    case reducedMotion = "reducedMotion"
    case dynamicType = "dynamicType"
    
    /// Returns the category this key belongs to
    var category: ThemeKeyCategory {
        switch self {
        case .primaryColor, .secondaryColor, .tertiaryColor, .backgroundColor, 
             .surfaceColor, .textColor, .successColor, .warningColor, .errorColor:
            return .colors
        case .primaryFont, .bodyFont, .headingFont, .fontSize, .fontWeight, 
             .lineHeight, .letterSpacing:
            return .typography
        case .spacing, .padding, .margin, .borderRadius, .gridColumns, .gridGutter:
            return .layout
        case .shadowRadius, .shadowOffset, .shadowOpacity, .shadowColor:
            return .shadows
        case .animationDuration, .animationEasing, .springResponse, .springDamping:
            return .animations
        case .highContrast, .reducedMotion, .dynamicType:
            return .accessibility
        }
    }
}

enum ThemeKeyCategory: String, CaseIterable {
    case colors = "Colors"
    case typography = "Typography"
    case layout = "Layout"
    case shadows = "Shadows"
    case animations = "Animations"
    case accessibility = "Accessibility"
}

// MARK: - Resolution Support Structures

/// Represents a step in the resolution path for debugging and analysis
struct ResolutionStep {
    let theme: CompositeTheme
    let component: ThemeComponent
    let key: ThemeKey
    let value: Any?
    let found: Bool
    
    var description: String {
        let componentName = String(describing: type(of: component))
        if found {
            return "✅ Found in \(componentName): \(String(describing: value))"
        } else {
            return "❌ Not found in \(componentName)"
        }
    }
}

/// Statistics about component coverage in a theme
struct ComponentCoverage {
    let totalKeys: Int
    let totalPossibleKeys: Int
    let coverageByCategory: [ThemeKeyCategory: Int]
    let inheritanceDepth: Int
    
    var coveragePercentage: Double {
        guard totalPossibleKeys > 0 else { return 0.0 }
        return Double(totalKeys) / Double(totalPossibleKeys) * 100.0
    }
    
    var description: String {
        return "Coverage: \(String(format: "%.1f", coveragePercentage))% (\(totalKeys)/\(totalPossibleKeys) keys, depth: \(inheritanceDepth))"
    }
}

// MARK: - Leaf Components

/// Concrete color palette component holding color values
class ColorPaletteComponent: ThemeComponent {
    private var colors: [ThemeKey: Color] = [:]
    
    init(colors: [ThemeKey: Color] = [:]) {
        self.colors = colors
    }
    
    func value(for key: ThemeKey) -> Any? {
        return colors[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(colors.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherColor = other as? ColorPaletteComponent else {
            return self
        }
        
        var mergedColors = colors
        for (key, value) in otherColor.colors {
            mergedColors[key] = value
        }
        
        return ColorPaletteComponent(colors: mergedColors)
    }
    
    /// Sets a color value for a specific key
    func setColor(_ color: Color, for key: ThemeKey) {
        colors[key] = color
    }
    
    /// Gets a color value for a specific key
    func getColor(for key: ThemeKey) -> Color? {
        return colors[key]
    }
}

/// Concrete typography component holding font and text styling values
class TypographyComponent: ThemeComponent {
    private var typography: [ThemeKey: Any] = [:]
    
    init(typography: [ThemeKey: Any] = [:]) {
        self.typography = typography
    }
    
    func value(for key: ThemeKey) -> Any? {
        return typography[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(typography.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherTypography = other as? TypographyComponent else {
            return self
        }
        
        var mergedTypography = typography
        for (key, value) in otherTypography.typography {
            mergedTypography[key] = value
        }
        
        return TypographyComponent(typography: mergedTypography)
    }
    
    /// Sets a typography value for a specific key
    func setValue(_ value: Any, for key: ThemeKey) {
        typography[key] = value
    }
    
    /// Gets a typography value for a specific key
    func getValue(for key: ThemeKey) -> Any? {
        return typography[key]
    }
}

/// Concrete layout metrics component holding spacing and layout values
class LayoutMetricsComponent: ThemeComponent {
    private var metrics: [ThemeKey: CGFloat] = [:]
    
    init(metrics: [ThemeKey: CGFloat] = [:]) {
        self.metrics = metrics
    }
    
    func value(for key: ThemeKey) -> Any? {
        return metrics[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(metrics.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherMetrics = other as? LayoutMetricsComponent else {
            return self
        }
        
        var mergedMetrics = metrics
        for (key, value) in otherMetrics.metrics {
            mergedMetrics[key] = value
        }
        
        return LayoutMetricsComponent(metrics: mergedMetrics)
    }
    
    /// Sets a metric value for a specific key
    func setMetric(_ value: CGFloat, for key: ThemeKey) {
        metrics[key] = value
    }
    
    /// Gets a metric value for a specific key
    func getMetric(for key: ThemeKey) -> CGFloat? {
        return metrics[key]
    }
}

/// Concrete shadow component holding shadow configuration values
class ShadowComponent: ThemeComponent {
    private var shadows: [ThemeKey: Any] = [:]
    
    init(shadows: [ThemeKey: Any] = [:]) {
        self.shadows = shadows
    }
    
    func value(for key: ThemeKey) -> Any? {
        return shadows[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(shadows.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherShadows = other as? ShadowComponent else {
            return self
        }
        
        var mergedShadows = shadows
        for (key, value) in otherShadows.shadows {
            mergedShadows[key] = value
        }
        
        return ShadowComponent(shadows: mergedShadows)
    }
    
    /// Sets a shadow value for a specific key
    func setShadow(_ value: Any, for key: ThemeKey) {
        shadows[key] = value
    }
    
    /// Gets a shadow value for a specific key
    func getShadow(for key: ThemeKey) -> Any? {
        return shadows[key]
    }
}

/// Concrete animation component holding animation configuration values
class AnimationComponent: ThemeComponent {
    private var animations: [ThemeKey: Any] = [:]
    
    init(animations: [ThemeKey: Any] = [:]) {
        self.animations = animations
    }
    
    func value(for key: ThemeKey) -> Any? {
        return animations[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(animations.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherAnimations = other as? AnimationComponent else {
            return self
        }
        
        var mergedAnimations = animations
        for (key, value) in otherAnimations.animations {
            mergedAnimations[key] = value
        }
        
        return AnimationComponent(animations: mergedAnimations)
    }
    
    /// Sets an animation value for a specific key
    func setAnimation(_ value: Any, for key: ThemeKey) {
        animations[key] = value
    }
    
    /// Gets an animation value for a specific key
    func getAnimation(for key: ThemeKey) -> Any? {
        return animations[key]
    }
}

/// Concrete accessibility component holding accessibility configuration values
class AccessibilityComponent: ThemeComponent {
    private var accessibility: [ThemeKey: Bool] = [:]
    
    init(accessibility: [ThemeKey: Bool] = [:]) {
        self.accessibility = accessibility
    }
    
    func value(for key: ThemeKey) -> Any? {
        return accessibility[key]
    }
    
    func availableKeys() -> [ThemeKey] {
        return Array(accessibility.keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        guard let otherAccessibility = other as? AccessibilityComponent else {
            return self
        }
        
        var mergedAccessibility = accessibility
        for (key, value) in otherAccessibility.accessibility {
            mergedAccessibility[key] = value
        }
        
        return AccessibilityComponent(accessibility: mergedAccessibility)
    }
    
    /// Sets an accessibility value for a specific key
    func setAccessibility(_ value: Bool, for key: ThemeKey) {
        accessibility[key] = value
    }
    
    /// Gets an accessibility value for a specific key
    func getAccessibility(for key: ThemeKey) -> Bool? {
        return accessibility[key]
    }
}

// MARK: - Composite Theme

/// Composite theme class that holds multiple components and supports inheritance
class CompositeTheme: ThemeComponent {
    private var components: [ThemeComponent] = []
    private weak var parentTheme: CompositeTheme?
    
    init(components: [ThemeComponent] = [], parentTheme: CompositeTheme? = nil) {
        self.components = components
        self.parentTheme = parentTheme
    }
    
    func value(for key: ThemeKey) -> Any? {
        // First, try to find the value in our own components
        for component in components {
            if let value = component.value(for: key) {
                return value
            }
        }
        
        // If not found, delegate to parent theme (inheritance)
        return parentTheme?.value(for: key)
    }
    
    func availableKeys() -> [ThemeKey] {
        var keys = Set<ThemeKey>()
        
        // Add keys from our components
        for component in components {
            keys.formUnion(component.availableKeys())
        }
        
        // Add keys from parent theme
        if let parentKeys = parentTheme?.availableKeys() {
            keys.formUnion(parentKeys)
        }
        
        return Array(keys)
    }
    
    func merge(with other: ThemeComponent) -> ThemeComponent {
        if let otherComposite = other as? CompositeTheme {
            // Merge components
            var mergedComponents = components
            mergedComponents.append(contentsOf: otherComposite.components)
            
            // Create new composite with merged components
            return CompositeTheme(components: mergedComponents, parentTheme: parentTheme)
        } else {
            // Add the other component to our list
            var newComponents = components
            newComponents.append(other)
            return CompositeTheme(components: newComponents, parentTheme: parentTheme)
        }
    }
    
    /// Adds a component to this theme
    func addComponent(_ component: ThemeComponent) {
        components.append(component)
    }
    
    /// Removes a component from this theme
    func removeComponent(_ component: ThemeComponent) {
        components.removeAll { $0 === component }
    }
    
    /// Sets the parent theme for inheritance
    func setParentTheme(_ parent: CompositeTheme?) {
        self.parentTheme = parent
    }
    
    /// Gets the parent theme
    func getParentTheme() -> CompositeTheme? {
        return parentTheme
    }
    
    /// Gets all components in this theme
    func getComponents() -> [ThemeComponent] {
        return components
    }
    
    /// Creates a child theme that inherits from this theme
    func createChildTheme(components: [ThemeComponent] = []) -> CompositeTheme {
        return CompositeTheme(components: components, parentTheme: self)
    }
    
    /// Resolves a value with full inheritance chain using recursive resolution
    func resolveValue(for key: ThemeKey) -> Any? {
        return resolveValueRecursively(for: key, visitedThemes: Set<ObjectIdentifier>())
    }
    
    /// Recursive resolution with cycle detection
    private func resolveValueRecursively(for key: ThemeKey, visitedThemes: Set<ObjectIdentifier>) -> Any? {
        let themeId = ObjectIdentifier(self)
        
        // Check for cycles in inheritance chain
        guard !visitedThemes.contains(themeId) else {
            print("⚠️ Cycle detected in theme inheritance chain for key: \(key.rawValue)")
            return nil
        }
        
        var newVisitedThemes = visitedThemes
        newVisitedThemes.insert(themeId)
        
        // First, try to find the value in our own components
        for component in components {
            if let value = component.value(for: key) {
                return value
            }
        }
        
        // If not found, recursively delegate to parent theme
        return parentTheme?.resolveValueRecursively(for: key, visitedThemes: newVisitedThemes)
    }
    
    /// Gets all available keys including inherited ones with cycle detection
    func getAllAvailableKeys() -> [ThemeKey] {
        return getAllAvailableKeysRecursively(visitedThemes: Set<ObjectIdentifier>())
    }
    
    /// Recursive key collection with cycle detection
    private func getAllAvailableKeysRecursively(visitedThemes: Set<ObjectIdentifier>) -> [ThemeKey] {
        let themeId = ObjectIdentifier(self)
        
        // Check for cycles in inheritance chain
        guard !visitedThemes.contains(themeId) else {
            print("⚠️ Cycle detected in theme inheritance chain during key collection")
            return []
        }
        
        var newVisitedThemes = visitedThemes
        newVisitedThemes.insert(themeId)
        
        var keys = Set<ThemeKey>()
        
        // Add keys from our components
        keys.formUnion(availableKeys())
        
        // Add keys from parent theme recursively
        if let parentKeys = parentTheme?.getAllAvailableKeysRecursively(visitedThemes: newVisitedThemes) {
            keys.formUnion(parentKeys)
        }
        
        return Array(keys)
    }
    
    /// Gets the inheritance chain for debugging and analysis
    func getInheritanceChain() -> [CompositeTheme] {
        return getInheritanceChainRecursively(visitedThemes: Set<ObjectIdentifier>())
    }
    
    /// Recursive inheritance chain collection with cycle detection
    private func getInheritanceChainRecursively(visitedThemes: Set<ObjectIdentifier>) -> [CompositeTheme] {
        let themeId = ObjectIdentifier(self)
        
        // Check for cycles in inheritance chain
        guard !visitedThemes.contains(themeId) else {
            print("⚠️ Cycle detected in theme inheritance chain during chain collection")
            return []
        }
        
        var newVisitedThemes = visitedThemes
        newVisitedThemes.insert(themeId)
        
        var chain = [self]
        
        // Add parent theme to chain recursively
        if let parentChain = parentTheme?.getInheritanceChainRecursively(visitedThemes: newVisitedThemes) {
            chain.append(contentsOf: parentChain)
        }
        
        return chain
    }
    
    /// Gets the resolution path for a specific key (for debugging)
    func getResolutionPath(for key: ThemeKey) -> [ResolutionStep] {
        return getResolutionPathRecursively(for: key, visitedThemes: Set<ObjectIdentifier>(), currentPath: [])
    }
    
    /// Recursive resolution path collection with cycle detection
    private func getResolutionPathRecursively(for key: ThemeKey, visitedThemes: Set<ObjectIdentifier>, currentPath: [ResolutionStep]) -> [ResolutionStep] {
        let themeId = ObjectIdentifier(self)
        
        // Check for cycles in inheritance chain
        guard !visitedThemes.contains(themeId) else {
            print("⚠️ Cycle detected in theme inheritance chain during path resolution")
            return currentPath
        }
        
        var newVisitedThemes = visitedThemes
        newVisitedThemes.insert(themeId)
        
        var path = currentPath
        
        // Check each component in this theme
        for component in components {
            if let value = component.value(for: key) {
                path.append(ResolutionStep(
                    theme: self,
                    component: component,
                    key: key,
                    value: value,
                    found: true
                ))
                return path
            } else {
                path.append(ResolutionStep(
                    theme: self,
                    component: component,
                    key: key,
                    value: nil,
                    found: false
                ))
            }
        }
        
        // If not found in this theme, continue with parent
        if let parentPath = parentTheme?.getResolutionPathRecursively(for: key, visitedThemes: newVisitedThemes, currentPath: path) {
            return parentPath
        }
        
        return path
    }
    
    /// Gets component coverage statistics for this theme
    func getComponentCoverage() -> ComponentCoverage {
        let allKeys = ThemeKey.allCases
        var coverage: [ThemeKeyCategory: Int] = [:]
        var totalKeys = 0
        
        for key in allKeys {
            if resolveValue(for: key) != nil {
                coverage[key.category, default: 0] += 1
                totalKeys += 1
            }
        }
        
        return ComponentCoverage(
            totalKeys: totalKeys,
            totalPossibleKeys: allKeys.count,
            coverageByCategory: coverage,
            inheritanceDepth: getInheritanceChain().count - 1
        )
    }
}

// MARK: - Theme Factory

/// Factory class for creating common theme configurations
class ThemeFactory {
    
    /// Creates a default light theme
    static func createDefaultLightTheme() -> CompositeTheme {
        let colors = ColorPaletteComponent(colors: [
            .primaryColor: .blue,
            .secondaryColor: .orange,
            .backgroundColor: .white,
            .textColor: .black,
            .successColor: .green,
            .warningColor: .yellow,
            .errorColor: .red
        ])
        
        let typography = TypographyComponent(typography: [
            .primaryFont: "SF Pro Display",
            .bodyFont: "SF Pro Text",
            .fontSize: 16.0,
            .fontWeight: "Regular"
        ])
        
        let layout = LayoutMetricsComponent(metrics: [
            .spacing: 8.0,
            .padding: 16.0,
            .borderRadius: 8.0
        ])
        
        return CompositeTheme(components: [colors, typography, layout])
    }
    
    /// Creates a default dark theme
    static func createDefaultDarkTheme() -> CompositeTheme {
        let colors = ColorPaletteComponent(colors: [
            .primaryColor: .blue,
            .secondaryColor: .orange,
            .backgroundColor: .black,
            .textColor: .white,
            .successColor: .green,
            .warningColor: .yellow,
            .errorColor: .red
        ])
        
        let typography = TypographyComponent(typography: [
            .primaryFont: "SF Pro Display",
            .bodyFont: "SF Pro Text",
            .fontSize: 16.0,
            .fontWeight: "Regular"
        ])
        
        let layout = LayoutMetricsComponent(metrics: [
            .spacing: 8.0,
            .padding: 16.0,
            .borderRadius: 8.0
        ])
        
        return CompositeTheme(components: [colors, typography, layout])
    }
    
    /// Creates a corporate theme
    static func createCorporateTheme() -> CompositeTheme {
        let colors = ColorPaletteComponent(colors: [
            .primaryColor: Color(red: 0.1, green: 0.2, blue: 0.4),
            .secondaryColor: Color(red: 0.8, green: 0.8, blue: 0.8),
            .backgroundColor: .white,
            .textColor: Color(red: 0.2, green: 0.2, blue: 0.2)
        ])
        
        let typography = TypographyComponent(typography: [
            .primaryFont: "Helvetica Neue",
            .bodyFont: "Helvetica",
            .fontSize: 14.0,
            .fontWeight: "Medium"
        ])
        
        let layout = LayoutMetricsComponent(metrics: [
            .spacing: 12.0,
            .padding: 20.0,
            .borderRadius: 4.0
        ])
        
        return CompositeTheme(components: [colors, typography, layout])
    }
    
    /// Creates a creative theme
    static func createCreativeTheme() -> CompositeTheme {
        let colors = ColorPaletteComponent(colors: [
            .primaryColor: .purple,
            .secondaryColor: .pink,
            .backgroundColor: Color(red: 0.98, green: 0.96, blue: 1.0),
            .textColor: Color(red: 0.3, green: 0.1, blue: 0.4)
        ])
        
        let typography = TypographyComponent(typography: [
            .primaryFont: "Avenir",
            .bodyFont: "Avenir",
            .fontSize: 18.0,
            .fontWeight: "Light"
        ])
        
        let layout = LayoutMetricsComponent(metrics: [
            .spacing: 16.0,
            .padding: 24.0,
            .borderRadius: 16.0
        ])
        
        return CompositeTheme(components: [colors, typography, layout])
    }
    
    // MARK: - Lightweight Variant Themes
    
    /// Creates a high contrast variant theme that inherits from light theme
    static func createHighContrastTheme() -> CompositeTheme {
        let baseTheme = createDefaultLightTheme()
        
        // Only override colors for high contrast - inherit everything else
        let highContrastColors = ColorPaletteComponent(colors: [
            .primaryColor: .black,
            .secondaryColor: .white,
            .backgroundColor: .white,
            .textColor: .black,
            .successColor: .green,
            .warningColor: .orange,
            .errorColor: .red
        ])
        
        return baseTheme.createChildTheme(components: [highContrastColors])
    }
    
    /// Creates a large text variant theme that inherits from light theme
    static func createLargeTextTheme() -> CompositeTheme {
        let baseTheme = createDefaultLightTheme()
        
        // Only override typography for large text - inherit everything else
        let largeTextTypography = TypographyComponent(typography: [
            .fontSize: 20.0,
            .lineHeight: 1.5,
            .letterSpacing: 0.5
        ])
        
        return baseTheme.createChildTheme(components: [largeTextTypography])
    }
    
    /// Creates a compact layout variant theme that inherits from light theme
    static func createCompactLayoutTheme() -> CompositeTheme {
        let baseTheme = createDefaultLightTheme()
        
        // Only override layout metrics for compact layout - inherit everything else
        let compactLayout = LayoutMetricsComponent(metrics: [
            .spacing: 4.0,
            .padding: 8.0,
            .margin: 4.0,
            .borderRadius: 4.0
        ])
        
        return baseTheme.createChildTheme(components: [compactLayout])
    }
    
    /// Creates a dark high contrast variant theme
    static func createDarkHighContrastTheme() -> CompositeTheme {
        let baseTheme = createDefaultDarkTheme()
        
        // Only override colors for high contrast - inherit everything else
        let highContrastColors = ColorPaletteComponent(colors: [
            .primaryColor: .white,
            .secondaryColor: .black,
            .backgroundColor: .black,
            .textColor: .white,
            .successColor: .green,
            .warningColor: .yellow,
            .errorColor: .red
        ])
        
        return baseTheme.createChildTheme(components: [highContrastColors])
    }
    
    /// Creates a reduced motion variant theme
    static func createReducedMotionTheme() -> CompositeTheme {
        let baseTheme = createDefaultLightTheme()
        
        // Only override animation and accessibility settings
        let reducedMotionAnimations = AnimationComponent(animations: [
            .animationDuration: 0.0,
            .animationEasing: "linear"
        ])
        
        let reducedMotionAccessibility = AccessibilityComponent(accessibility: [
            .reducedMotion: true
        ])
        
        return baseTheme.createChildTheme(components: [reducedMotionAnimations, reducedMotionAccessibility])
    }
    
    /// Creates a corporate high contrast variant
    static func createCorporateHighContrastTheme() -> CompositeTheme {
        let baseTheme = createCorporateTheme()
        
        // Only override colors for high contrast
        let highContrastColors = ColorPaletteComponent(colors: [
            .primaryColor: .black,
            .secondaryColor: .white,
            .textColor: .black
        ])
        
        return baseTheme.createChildTheme(components: [highContrastColors])
    }
}

// MARK: - Theme Manager

/// Manager class for handling theme operations and persistence
class AdvancedThemeManager: ObservableObject {
    @Published var currentTheme: CompositeTheme
    @Published var availableThemes: [String: CompositeTheme] = [:]
    
    init() {
        self.currentTheme = ThemeFactory.createDefaultLightTheme()
        self.loadDefaultThemes()
    }
    
    private func loadDefaultThemes() {
        // Base themes
        availableThemes["Light"] = ThemeFactory.createDefaultLightTheme()
        availableThemes["Dark"] = ThemeFactory.createDefaultDarkTheme()
        availableThemes["Corporate"] = ThemeFactory.createCorporateTheme()
        availableThemes["Creative"] = ThemeFactory.createCreativeTheme()
        
        // Lightweight variant themes
        availableThemes["High Contrast"] = ThemeFactory.createHighContrastTheme()
        availableThemes["Large Text"] = ThemeFactory.createLargeTextTheme()
        availableThemes["Compact Layout"] = ThemeFactory.createCompactLayoutTheme()
        availableThemes["Dark High Contrast"] = ThemeFactory.createDarkHighContrastTheme()
        availableThemes["Reduced Motion"] = ThemeFactory.createReducedMotionTheme()
        availableThemes["Corporate High Contrast"] = ThemeFactory.createCorporateHighContrastTheme()
    }
    
    /// Switches to a different theme
    func switchTheme(_ themeName: String) {
        if let theme = availableThemes[themeName] {
            currentTheme = theme
        }
    }
    
    /// Creates a new theme based on the current theme
    func createDerivedTheme(name: String, components: [ThemeComponent]) -> CompositeTheme {
        let derivedTheme = currentTheme.createChildTheme(components: components)
        availableThemes[name] = derivedTheme
        return derivedTheme
    }
    
    /// Saves a theme with a specific name
    func saveTheme(_ theme: CompositeTheme, name: String) {
        availableThemes[name] = theme
    }
    
    /// Removes a theme
    func removeTheme(_ name: String) {
        availableThemes.removeValue(forKey: name)
    }
    
    /// Gets a theme value with inheritance
    func getValue(for key: ThemeKey) -> Any? {
        return currentTheme.resolveValue(for: key)
    }
    
    /// Gets all available theme names
    func getThemeNames() -> [String] {
        return Array(availableThemes.keys)
    }
} 