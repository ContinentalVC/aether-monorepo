//
//  AccessibilityValidator.swift
//  AetherSwiftUIApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether. All rights reserved.
//

import Foundation
import SwiftUI

// MARK: - WCAG Compliance Levels

enum WCAGLevel: String, CaseIterable {
    case AA = "AA"
    case AAA = "AAA"
    
    var normalTextContrast: Double {
        switch self {
        case .AA: return 4.5
        case .AAA: return 7.0
        }
    }
    
    var largeTextContrast: Double {
        switch self {
        case .AA: return 3.0
        case .AAA: return 4.5
        }
    }
    
    var uiComponentContrast: Double {
        switch self {
        case .AA: return 3.0
        case .AAA: return 4.5
        }
    }
}

// MARK: - Accessibility Error Types

enum AccessibilityError: LocalizedError, Identifiable {
    case insufficientContrast(
        foreground: String,
        background: String,
        contrastRatio: Double,
        requiredRatio: Double,
        elementType: String
    )
    case colorBlindnessIssue(
        color1: String,
        color2: String,
        issue: String
    )
    case insufficientTouchTarget(
        element: String,
        currentSize: Double,
        minimumSize: Double
    )
    case colorOnlyInformation(
        element: String,
        suggestion: String
    )
    case insufficientFocusIndicator(
        element: String
    )
    
    var id: String {
        switch self {
        case .insufficientContrast(let foreground, let background, _, _, let elementType):
            return "contrast_\(foreground)_\(background)_\(elementType)"
        case .colorBlindnessIssue(let color1, let color2, _):
            return "colorblind_\(color1)_\(color2)"
        case .insufficientTouchTarget(let element, _, _):
            return "touch_\(element)"
        case .colorOnlyInformation(let element, _):
            return "coloronly_\(element)"
        case .insufficientFocusIndicator(let element):
            return "focus_\(element)"
        }
    }
    
    var errorDescription: String? {
        switch self {
        case .insufficientContrast(let foreground, let background, let ratio, let required, let elementType):
            return "Insufficient contrast for \(elementType): \(foreground) on \(background) (ratio: \(String(format: "%.2f", ratio)):1, required: \(String(format: "%.1f", required)):1)"
        case .colorBlindnessIssue(let color1, let color2, let issue):
            return "Color blindness issue: \(color1) and \(color2) - \(issue)"
        case .insufficientTouchTarget(let element, let current, let minimum):
            return "Insufficient touch target for \(element): \(current)pt (minimum: \(minimum)pt)"
        case .colorOnlyInformation(let element, let suggestion):
            return "\(element) relies solely on color. \(suggestion)"
        case .insufficientFocusIndicator(let element):
            return "Insufficient focus indicator for \(element)"
        }
    }
}

// MARK: - Color Utilities

struct ColorUtilities {
    
    // MARK: - Color Parsing
    
    static func parseColor(_ colorString: String) -> (red: Double, green: Double, blue: Double, alpha: Double)? {
        let trimmed = colorString.trimmingCharacters(in: .whitespacesAndNewlines)
        
        // Hex color parsing
        if trimmed.hasPrefix("#") {
            return parseHexColor(trimmed)
        }
        
        // Named color parsing
        if let namedColor = parseNamedColor(trimmed) {
            return namedColor
        }
        
        // RGBA color parsing
        if trimmed.hasPrefix("rgba") || trimmed.hasPrefix("rgb") {
            return parseRGBAColor(trimmed)
        }
        
        return nil
    }
    
    private static func parseHexColor(_ hex: String) -> (red: Double, green: Double, blue: Double, alpha: Double)? {
        let hex = hex.replacingOccurrences(of: "#", with: "")
        
        guard hex.count == 6 || hex.count == 8 else { return nil }
        
        let scanner = Scanner(string: hex)
        var rgbValue: UInt64 = 0
        
        guard scanner.scanHexInt64(&rgbValue) else { return nil }
        
        let red = Double((rgbValue >> 16) & 0xFF) / 255.0
        let green = Double((rgbValue >> 8) & 0xFF) / 255.0
        let blue = Double(rgbValue & 0xFF) / 255.0
        let alpha = hex.count == 8 ? Double((rgbValue >> 24) & 0xFF) / 255.0 : 1.0
        
        return (red: red, green: green, blue: blue, alpha: alpha)
    }
    
    private static func parseNamedColor(_ name: String) -> (red: Double, green: Double, blue: Double, alpha: Double)? {
        let namedColors: [String: (red: Double, green: Double, blue: Double)] = [
            "black": (0.0, 0.0, 0.0),
            "white": (1.0, 1.0, 1.0),
            "red": (1.0, 0.0, 0.0),
            "green": (0.0, 1.0, 0.0),
            "blue": (0.0, 0.0, 1.0),
            "yellow": (1.0, 1.0, 0.0),
            "cyan": (0.0, 1.0, 1.0),
            "magenta": (1.0, 0.0, 1.0),
            "gray": (0.5, 0.5, 0.5),
            "grey": (0.5, 0.5, 0.5),
            "orange": (1.0, 0.5, 0.0),
            "purple": (0.5, 0.0, 0.5),
            "pink": (1.0, 0.75, 0.8),
            "brown": (0.6, 0.4, 0.2),
            "lime": (0.0, 1.0, 0.0),
            "navy": (0.0, 0.0, 0.5),
            "teal": (0.0, 0.5, 0.5),
            "olive": (0.5, 0.5, 0.0),
            "maroon": (0.5, 0.0, 0.0),
            "silver": (0.75, 0.75, 0.75),
            "gold": (1.0, 0.84, 0.0)
        ]
        
        guard let color = namedColors[name.lowercased()] else { return nil }
        return (red: color.red, green: color.green, blue: color.blue, alpha: 1.0)
    }
    
    private static func parseRGBAColor(_ rgba: String) -> (red: Double, green: Double, blue: Double, alpha: Double)? {
        let pattern = #"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)"#
        
        guard let regex = try? NSRegularExpression(pattern: pattern),
              let match = regex.firstMatch(in: rgba, range: NSRange(rgba.startIndex..., in: rgba)) else {
            return nil
        }
        
        let nsString = rgba as NSString
        let red = Double(nsString.substring(with: match.range(at: 1)))! / 255.0
        let green = Double(nsString.substring(with: match.range(at: 2)))! / 255.0
        let blue = Double(nsString.substring(with: match.range(at: 3)))! / 255.0
        let alpha = match.range(at: 4).location != NSNotFound ? 
            Double(nsString.substring(with: match.range(at: 4)))! : 1.0
        
        return (red: red, green: green, blue: blue, alpha: alpha)
    }
    
    // MARK: - Luminance Calculation
    
    static func calculateLuminance(red: Double, green: Double, blue: Double) -> Double {
        // Convert sRGB to linear RGB
        let linearRed = red <= 0.03928 ? red / 12.92 : pow((red + 0.055) / 1.055, 2.4)
        let linearGreen = green <= 0.03928 ? green / 12.92 : pow((green + 0.055) / 1.055, 2.4)
        let linearBlue = blue <= 0.03928 ? blue / 12.92 : pow((blue + 0.055) / 1.055, 2.4)
        
        // Calculate relative luminance
        return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue
    }
    
    static func calculateLuminance(for colorString: String) -> Double? {
        guard let color = parseColor(colorString) else { return nil }
        return calculateLuminance(red: color.red, green: color.green, blue: color.blue)
    }
    
    // MARK: - Contrast Ratio Calculation
    
    static func calculateContrastRatio(color1: String, color2: String) -> Double? {
        guard let luminance1 = calculateLuminance(for: color1),
              let luminance2 = calculateLuminance(for: color2) else {
            return nil
        }
        
        let lighter = max(luminance1, luminance2)
        let darker = min(luminance1, luminance2)
        
        return (lighter + 0.05) / (darker + 0.05)
    }
    
    // MARK: - Color Blindness Simulation
    
    static func simulateColorBlindness(color: String, type: ColorBlindnessType) -> String? {
        guard let parsed = parseColor(color) else { return nil }
        
        switch type {
        case .protanopia:
            // Red-green color blindness (red appears darker)
            let newRed = 0.567 * parsed.red + 0.433 * parsed.green
            let newGreen = 0.558 * parsed.red + 0.442 * parsed.green
            let newBlue = parsed.blue
            return rgbToString(red: newRed, green: newGreen, blue: newBlue)
            
        case .deuteranopia:
            // Red-green color blindness (green appears darker)
            let newRed = 0.625 * parsed.red + 0.375 * parsed.green
            let newGreen = 0.7 * parsed.red + 0.3 * parsed.green
            let newBlue = parsed.blue
            return rgbToString(red: newRed, green: newGreen, blue: newBlue)
            
        case .tritanopia:
            // Blue-yellow color blindness
            let newRed = 0.95 * parsed.red + 0.05 * parsed.blue
            let newGreen = 0.433 * parsed.green + 0.567 * parsed.blue
            let newBlue = 0.475 * parsed.green + 0.525 * parsed.blue
            return rgbToString(red: newRed, green: newGreen, blue: newBlue)
        }
    }
    
    private static func rgbToString(red: Double, green: Double, blue: Double) -> String {
        let r = Int(red * 255)
        let g = Int(green * 255)
        let b = Int(blue * 255)
        return String(format: "#%02X%02X%02X", r, g, b)
    }
}

// MARK: - Color Blindness Types

enum ColorBlindnessType: String, CaseIterable {
    case protanopia = "Protanopia"
    case deuteranopia = "Deuteranopia"
    case tritanopia = "Tritanopia"
    
    var description: String {
        switch self {
        case .protanopia: return "Red-green color blindness (red appears darker)"
        case .deuteranopia: return "Red-green color blindness (green appears darker)"
        case .tritanopia: return "Blue-yellow color blindness"
        }
    }
}

// MARK: - Accessibility Validator

class AccessibilityValidator: ObservableObject {
    @Published var isValidationInProgress = false
    @Published var validationResult: AccessibilityValidationResult?
    
    private let wcagLevel: WCAGLevel
    
    init(wcagLevel: WCAGLevel = .AA) {
        self.wcagLevel = wcagLevel
    }
    
    // MARK: - Main Validation Method
    
    func validateAccessibility(for theme: ThemeSchema) async -> AccessibilityValidationResult {
        await MainActor.run {
            isValidationInProgress = true
        }
        
        var errors: [AccessibilityError] = []
        var warnings: [String] = []
        var contrastTests: [ContrastTest] = []
        
        // Validate text-to-background contrast
        let textContrastErrors = await validateTextContrast(theme: theme)
        errors.append(contentsOf: textContrastErrors.errors)
        contrastTests.append(contentsOf: textContrastErrors.tests)
        
        // Validate UI component contrast
        let uiContrastErrors = await validateUIContrast(theme: theme)
        errors.append(contentsOf: uiContrastErrors.errors)
        contrastTests.append(contentsOf: uiContrastErrors.tests)
        
        // Validate color blindness compatibility
        let colorBlindnessErrors = await validateColorBlindness(theme: theme)
        errors.append(contentsOf: colorBlindnessErrors)
        
        // Validate touch targets
        let touchTargetErrors = await validateTouchTargets(theme: theme)
        errors.append(contentsOf: touchTargetErrors)
        
        // Validate color-only information
        let colorOnlyErrors = await validateColorOnlyInformation(theme: theme)
        errors.append(contentsOf: colorOnlyErrors)
        
        // Calculate accessibility score
        let accessibilityScore = calculateAccessibilityScore(
            totalTests: contrastTests.count,
            failedTests: errors.filter { 
                if case .insufficientContrast = $0 { return true }
                return false
            }.count
        )
        
        let result = AccessibilityValidationResult(
            isValid: errors.isEmpty,
            errors: errors,
            warnings: warnings,
            contrastTests: contrastTests,
            accessibilityScore: accessibilityScore,
            wcagLevel: wcagLevel
        )
        
        await MainActor.run {
            self.validationResult = result
            self.isValidationInProgress = false
        }
        
        return result
    }
    
    // MARK: - Text Contrast Validation
    
    private func validateTextContrast(theme: ThemeSchema) async -> (errors: [AccessibilityError], tests: [ContrastTest]) {
        var errors: [AccessibilityError] = []
        var tests: [ContrastTest] = []
        
        guard let textColor = theme.colors["text"],
              let backgroundColor = theme.colors["background"] else {
            return (errors, tests)
        }
        
        // Normal text contrast (4.5:1 for AA)
        if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: textColor, color2: backgroundColor) {
            let test = ContrastTest(
                foreground: textColor,
                background: backgroundColor,
                contrastRatio: contrastRatio,
                requiredRatio: wcagLevel.normalTextContrast,
                elementType: "Normal Text",
                passed: contrastRatio >= wcagLevel.normalTextContrast
            )
            tests.append(test)
            
            if !test.passed {
                errors.append(.insufficientContrast(
                    foreground: textColor,
                    background: backgroundColor,
                    contrastRatio: contrastRatio,
                    requiredRatio: wcagLevel.normalTextContrast,
                    elementType: "Normal Text"
                ))
            }
        }
        
        // Large text contrast (3:1 for AA)
        if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: textColor, color2: backgroundColor) {
            let test = ContrastTest(
                foreground: textColor,
                background: backgroundColor,
                contrastRatio: contrastRatio,
                requiredRatio: wcagLevel.largeTextContrast,
                elementType: "Large Text",
                passed: contrastRatio >= wcagLevel.largeTextContrast
            )
            tests.append(test)
            
            if !test.passed {
                errors.append(.insufficientContrast(
                    foreground: textColor,
                    background: backgroundColor,
                    contrastRatio: contrastRatio,
                    requiredRatio: wcagLevel.largeTextContrast,
                    elementType: "Large Text"
                ))
            }
        }
        
        // Secondary text contrast
        if let secondaryTextColor = theme.colors["textSecondary"] {
            if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: secondaryTextColor, color2: backgroundColor) {
                let test = ContrastTest(
                    foreground: secondaryTextColor,
                    background: backgroundColor,
                    contrastRatio: contrastRatio,
                    requiredRatio: wcagLevel.normalTextContrast,
                    elementType: "Secondary Text",
                    passed: contrastRatio >= wcagLevel.normalTextContrast
                )
                tests.append(test)
                
                if !test.passed {
                    errors.append(.insufficientContrast(
                        foreground: secondaryTextColor,
                        background: backgroundColor,
                        contrastRatio: contrastRatio,
                        requiredRatio: wcagLevel.normalTextContrast,
                        elementType: "Secondary Text"
                    ))
                }
            }
        }
        
        return (errors, tests)
    }
    
    // MARK: - UI Component Contrast Validation
    
    private func validateUIContrast(theme: ThemeSchema) async -> (errors: [AccessibilityError], tests: [ContrastTest]) {
        var errors: [AccessibilityError] = []
        var tests: [ContrastTest] = []
        
        guard let backgroundColor = theme.colors["background"] else {
            return (errors, tests)
        }
        
        // Validate primary button contrast
        if let primaryColor = theme.colors["primary"] {
            if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: primaryColor, color2: backgroundColor) {
                let test = ContrastTest(
                    foreground: primaryColor,
                    background: backgroundColor,
                    contrastRatio: contrastRatio,
                    requiredRatio: wcagLevel.uiComponentContrast,
                    elementType: "Primary Button",
                    passed: contrastRatio >= wcagLevel.uiComponentContrast
                )
                tests.append(test)
                
                if !test.passed {
                    errors.append(.insufficientContrast(
                        foreground: primaryColor,
                        background: backgroundColor,
                        contrastRatio: contrastRatio,
                        requiredRatio: wcagLevel.uiComponentContrast,
                        elementType: "Primary Button"
                    ))
                }
            }
        }
        
        // Validate border contrast
        if let borderColor = theme.colors["border"] {
            if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: borderColor, color2: backgroundColor) {
                let test = ContrastTest(
                    foreground: borderColor,
                    background: backgroundColor,
                    contrastRatio: contrastRatio,
                    requiredRatio: wcagLevel.uiComponentContrast,
                    elementType: "Border",
                    passed: contrastRatio >= wcagLevel.uiComponentContrast
                )
                tests.append(test)
                
                if !test.passed {
                    errors.append(.insufficientContrast(
                        foreground: borderColor,
                        background: backgroundColor,
                        contrastRatio: contrastRatio,
                        requiredRatio: wcagLevel.uiComponentContrast,
                        elementType: "Border"
                    ))
                }
            }
        }
        
        // Validate error and success states
        let stateColors = ["error", "success", "warning"]
        for stateColor in stateColors {
            if let color = theme.colors[stateColor] {
                if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: color, color2: backgroundColor) {
                    let test = ContrastTest(
                        foreground: color,
                        background: backgroundColor,
                        contrastRatio: contrastRatio,
                        requiredRatio: wcagLevel.uiComponentContrast,
                        elementType: "\(stateColor.capitalized) State",
                        passed: contrastRatio >= wcagLevel.uiComponentContrast
                    )
                    tests.append(test)
                    
                    if !test.passed {
                        errors.append(.insufficientContrast(
                            foreground: color,
                            background: backgroundColor,
                            contrastRatio: contrastRatio,
                            requiredRatio: wcagLevel.uiComponentContrast,
                            elementType: "\(stateColor.capitalized) State"
                        ))
                    }
                }
            }
        }
        
        return (errors, tests)
    }
    
    // MARK: - Color Blindness Validation
    
    private func validateColorBlindness(theme: ThemeSchema) async -> [AccessibilityError] {
        var errors: [AccessibilityError] = []
        
        let colorPairs = generateColorPairs(from: theme.colors)
        
        for (color1, color2) in colorPairs {
            for blindnessType in ColorBlindnessType.allCases {
                if let simulated1 = ColorUtilities.simulateColorBlindness(color: color1, type: blindnessType),
                   let simulated2 = ColorUtilities.simulateColorBlindness(color: color2, type: blindnessType) {
                    
                    // Check if the simulated colors are too similar
                    if let contrastRatio = ColorUtilities.calculateContrastRatio(color1: simulated1, color2: simulated2) {
                        if contrastRatio < 2.0 { // Very low contrast threshold for color blindness
                            errors.append(.colorBlindnessIssue(
                                color1: color1,
                                color2: color2,
                                issue: "Colors may be indistinguishable for users with \(blindnessType.rawValue)"
                            ))
                        }
                    }
                }
            }
        }
        
        return errors
    }
    
    // MARK: - Touch Target Validation
    
    private func validateTouchTargets(theme: ThemeSchema) async -> [AccessibilityError] {
        var errors: [AccessibilityError] = []
        
        // Check minimum spacing values
        let minimumTouchTarget: Double = 44.0 // iOS Human Interface Guidelines
        
        for (key, spacing) in theme.spacing {
            if spacing < minimumTouchTarget {
                errors.append(.insufficientTouchTarget(
                    element: key,
                    currentSize: spacing,
                    minimumSize: minimumTouchTarget
                ))
            }
        }
        
        return errors
    }
    
    // MARK: - Color-Only Information Validation
    
    private func validateColorOnlyInformation(theme: ThemeSchema) async -> [AccessibilityError] {
        var errors: [AccessibilityError] = []
        
        // Check if error states rely solely on color
        if theme.colors["error"] != nil && theme.colors["errorIcon"] == nil {
            errors.append(.colorOnlyInformation(
                element: "Error State",
                suggestion: "Add error icons or text labels to convey error information"
            ))
        }
        
        // Check if success states rely solely on color
        if theme.colors["success"] != nil && theme.colors["successIcon"] == nil {
            errors.append(.colorOnlyInformation(
                element: "Success State",
                suggestion: "Add success icons or text labels to convey success information"
            ))
        }
        
        // Check if warning states rely solely on color
        if theme.colors["warning"] != nil && theme.colors["warningIcon"] == nil {
            errors.append(.colorOnlyInformation(
                element: "Warning State",
                suggestion: "Add warning icons or text labels to convey warning information"
            ))
        }
        
        return errors
    }
    
    // MARK: - Helper Methods
    
    private func generateColorPairs(from colors: [String: String]) -> [(String, String)] {
        let colorArray = Array(colors.values)
        var pairs: [(String, String)] = []
        
        for i in 0..<colorArray.count {
            for j in (i+1)..<colorArray.count {
                pairs.append((colorArray[i], colorArray[j]))
            }
        }
        
        return pairs
    }
    
    private func calculateAccessibilityScore(totalTests: Int, failedTests: Int) -> Double {
        guard totalTests > 0 else { return 100.0 }
        return max(0.0, Double(totalTests - failedTests) / Double(totalTests) * 100.0)
    }
}

// MARK: - Contrast Test Model

struct ContrastTest: Identifiable {
    let id = UUID()
    let foreground: String
    let background: String
    let contrastRatio: Double
    let requiredRatio: Double
    let elementType: String
    let passed: Bool
    
    var status: String {
        passed ? "Pass" : "Fail"
    }
    
    var statusColor: Color {
        passed ? .green : .red
    }
}

// MARK: - Accessibility Validation Result

struct AccessibilityValidationResult {
    let isValid: Bool
    let errors: [AccessibilityError]
    let warnings: [String]
    let contrastTests: [ContrastTest]
    let accessibilityScore: Double
    let wcagLevel: WCAGLevel
    
    var passedTests: Int {
        contrastTests.filter { $0.passed }.count
    }
    
    var failedTests: Int {
        contrastTests.filter { !$0.passed }.count
    }
    
    var totalTests: Int {
        contrastTests.count
    }
}

// MARK: - Accessibility Validation View

struct AccessibilityValidationView: View {
    @StateObject private var validator = AccessibilityValidator()
    @State private var selectedWCAGLevel: WCAGLevel = .AA
    @State private var theme: ThemeSchema?
    @State private var showingFilePicker = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("WCAG Accessibility Validation")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Automated WCAG \(selectedWCAGLevel.rawValue) compliance checking")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                
                // WCAG Level Selection
                VStack(alignment: .leading, spacing: 8) {
                    Text("WCAG Compliance Level:")
                        .font(.headline)
                    
                    Picker("WCAG Level", selection: $selectedWCAGLevel) {
                        ForEach(WCAGLevel.allCases, id: \.self) { level in
                            Text("WCAG \(level.rawValue)").tag(level)
                        }
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    .onChange(of: selectedWCAGLevel) { _ in
                        validator.wcagLevel = selectedWCAGLevel
                    }
                }
                .padding()
                
                // Import Button
                Button(action: {
                    showingFilePicker = true
                }) {
                    HStack {
                        Image(systemName: "doc.badge.plus")
                        Text("Import Theme for WCAG Validation")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                }
                .padding(.horizontal)
                
                // Validation Progress
                if validator.isValidationInProgress {
                    VStack {
                        ProgressView()
                            .scaleEffect(1.2)
                        Text("Validating WCAG compliance...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                }
                
                // Validation Results
                if let result = validator.validationResult {
                    AccessibilityResultView(result: result)
                }
                
                Spacer()
            }
            .navigationBarHidden(true)
        }
        .fileImporter(
            isPresented: $showingFilePicker,
            allowedContentTypes: [.json],
            allowsMultipleSelection: false
        ) { result in
            handleFileImport(result)
        }
    }
    
    private func handleFileImport(_ result: Result<[URL], Error>) {
        switch result {
        case .success(let urls):
            guard let url = urls.first else { return }
            
            do {
                let data = try Data(contentsOf: url)
                let importedTheme = try JSONDecoder().decode(ThemeSchema.self, from: data)
                self.theme = importedTheme
                
                Task {
                    await validator.validateAccessibility(for: importedTheme)
                }
            } catch {
                print("Error importing theme: \(error)")
            }
        case .failure(let error):
            print("File import failed: \(error)")
        }
    }
}

// MARK: - Accessibility Result View

struct AccessibilityResultView: View {
    let result: AccessibilityValidationResult
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Overall Status
                HStack {
                    Image(systemName: result.isValid ? "checkmark.shield.fill" : "xmark.shield.fill")
                        .foregroundColor(result.isValid ? .green : .red)
                        .font(.title2)
                    
                    Text("WCAG \(result.wcagLevel.rawValue) \(result.isValid ? "Compliant" : "Non-Compliant")")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Spacer()
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                
                // Accessibility Score
                VStack {
                    Text("Accessibility Score")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    ZStack {
                        Circle()
                            .stroke(Color.blue.opacity(0.2), lineWidth: 8)
                            .frame(width: 80, height: 80)
                        
                        Circle()
                            .trim(from: 0, to: result.accessibilityScore / 100)
                            .stroke(Color.blue, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                            .frame(width: 80, height: 80)
                            .rotationEffect(.degrees(-90))
                            .animation(.easeInOut(duration: 1.0), value: result.accessibilityScore)
                        
                        Text("\(Int(result.accessibilityScore))")
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                
                // Contrast Test Results
                if !result.contrastTests.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: "eye.fill")
                                .foregroundColor(.blue)
                            Text("Contrast Tests (\(result.passedTests)/\(result.totalTests) Passed)")
                                .font(.headline)
                                .fontWeight(.semibold)
                            Spacer()
                        }
                        
                        ForEach(result.contrastTests) { test in
                            ContrastTestRow(test: test)
                        }
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(10)
                }
                
                // Errors
                if !result.errors.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.red)
                            Text("Accessibility Issues (\(result.errors.count))")
                                .font(.headline)
                                .fontWeight(.semibold)
                            Spacer()
                        }
                        
                        ForEach(result.errors, id: \.id) { error in
                            HStack(alignment: .top, spacing: 8) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.red)
                                    .font(.caption)
                                
                                Text(error.errorDescription ?? "Unknown error")
                                    .font(.caption)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                            }
                            .padding(.vertical, 4)
                        }
                    }
                    .padding()
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(10)
                }
            }
            .padding()
        }
    }
}

// MARK: - Contrast Test Row

struct ContrastTestRow: View {
    let test: ContrastTest
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(test.elementType)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text(test.status)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(test.statusColor)
            }
            
            HStack {
                Text("\(test.foreground) on \(test.background)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text("\(String(format: "%.2f", test.contrastRatio)):1")
                    .font(.caption)
                    .fontWeight(.medium)
            }
            
            if !test.passed {
                Text("Required: \(String(format: "%.1f", test.requiredRatio)):1")
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview

struct AccessibilityValidator_Previews: PreviewProvider {
    static var previews: some View {
        AccessibilityValidationView()
    }
} 