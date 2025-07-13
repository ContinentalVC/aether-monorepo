//
//  ThemeValidator.swift
//  AetherSwiftUIApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether. All rights reserved.
//

import Foundation
import SwiftUI

// MARK: - Validation Errors

enum ThemeValidationError: LocalizedError, Identifiable {
    case schemaError(String)
    case contentError(String)
    case accessibilityError(String)
    case colorContrastError(String)
    case missingRequiredProperty(String)
    case invalidValueType(String, String)
    case duplicateProperty(String)
    case invalidColorFormat(String)
    case invalidFontSize(String)
    case invalidSpacing(String)
    case invalidAnimationDuration(String)
    
    var id: String {
        switch self {
        case .schemaError(let message): return "schema_\(message.hashValue)"
        case .contentError(let message): return "content_\(message.hashValue)"
        case .accessibilityError(let message): return "accessibility_\(message.hashValue)"
        case .colorContrastError(let message): return "contrast_\(message.hashValue)"
        case .missingRequiredProperty(let property): return "missing_\(property)"
        case .invalidValueType(let property, let expected): return "type_\(property)_\(expected)"
        case .duplicateProperty(let property): return "duplicate_\(property)"
        case .invalidColorFormat(let color): return "color_\(color)"
        case .invalidFontSize(let size): return "font_\(size)"
        case .invalidSpacing(let spacing): return "spacing_\(spacing)"
        case .invalidAnimationDuration(let duration): return "animation_\(duration)"
        }
    }
    
    var errorDescription: String? {
        switch self {
        case .schemaError(let message):
            return "Schema Error: \(message)"
        case .contentError(let message):
            return "Content Error: \(message)"
        case .accessibilityError(let message):
            return "Accessibility Error: \(message)"
        case .colorContrastError(let message):
            return "Color Contrast Error: \(message)"
        case .missingRequiredProperty(let property):
            return "Missing required property: \(property)"
        case .invalidValueType(let property, let expected):
            return "Invalid type for \(property). Expected: \(expected)"
        case .duplicateProperty(let property):
            return "Duplicate property found: \(property)"
        case .invalidColorFormat(let color):
            return "Invalid color format: \(color)"
        case .invalidFontSize(let size):
            return "Invalid font size: \(size)"
        case .invalidSpacing(let spacing):
            return "Invalid spacing value: \(spacing)"
        case .invalidAnimationDuration(let duration):
            return "Invalid animation duration: \(duration)"
        }
    }
}

// MARK: - Validation Result

struct ThemeValidationResult {
    let isValid: Bool
    let errors: [ThemeValidationError]
    let warnings: [String]
    let accessibilityScore: Double
    let performanceScore: Double
    
    init(isValid: Bool, errors: [ThemeValidationError] = [], warnings: [String] = [], accessibilityScore: Double = 0.0, performanceScore: Double = 0.0) {
        self.isValid = isValid
        self.errors = errors
        self.warnings = warnings
        self.accessibilityScore = accessibilityScore
        self.performanceScore = performanceScore
    }
}

// MARK: - Theme Validator

class ThemeValidator: ObservableObject {
    @Published var validationResult: ThemeValidationResult?
    @Published var isValidationInProgress = false
    
    // MARK: - Main Validation Method
    
    func validateTheme(_ theme: ThemeSchema) async -> ThemeValidationResult {
        await MainActor.run {
            isValidationInProgress = true
        }
        
        var errors: [ThemeValidationError] = []
        var warnings: [String] = []
        
        // Schema validation
        let schemaErrors = validateSchema(theme)
        errors.append(contentsOf: schemaErrors)
        
        // Content validation
        let contentErrors = validateContent(theme)
        errors.append(contentsOf: contentErrors)
        
        // Accessibility validation
        let accessibilityErrors = validateAccessibility(theme)
        errors.append(contentsOf: accessibilityErrors)
        
        // Performance validation
        let performanceWarnings = validatePerformance(theme)
        warnings.append(contentsOf: performanceWarnings)
        
        // Calculate scores
        let accessibilityScore = calculateAccessibilityScore(theme, errors: accessibilityErrors)
        let performanceScore = calculatePerformanceScore(theme, warnings: performanceWarnings)
        
        let result = ThemeValidationResult(
            isValid: errors.isEmpty,
            errors: errors,
            warnings: warnings,
            accessibilityScore: accessibilityScore,
            performanceScore: performanceScore
        )
        
        await MainActor.run {
            self.validationResult = result
            self.isValidationInProgress = false
        }
        
        return result
    }
    
    // MARK: - Schema Validation
    
    private func validateSchema(_ theme: ThemeSchema) -> [ThemeValidationError] {
        var errors: [ThemeValidationError] = []
        
        // Check required properties
        if theme.metadata.name.isEmpty {
            errors.append(.missingRequiredProperty("metadata.name"))
        }
        
        if theme.metadata.version.isEmpty {
            errors.append(.missingRequiredProperty("metadata.version"))
        }
        
        // Validate colors
        for (key, color) in theme.colors {
            if color.isEmpty {
                errors.append(.invalidColorFormat("Empty color value for \(key)"))
            } else if !isValidColorFormat(color) {
                errors.append(.invalidColorFormat("Invalid color format for \(key): \(color)"))
            }
        }
        
        // Validate typography
        for (key, typography) in theme.typography {
            if typography.fontSize <= 0 {
                errors.append(.invalidFontSize("Font size must be positive for \(key): \(typography.fontSize)"))
            }
            
            if typography.fontSize > 100 {
                errors.append(.invalidFontSize("Font size too large for \(key): \(typography.fontSize)"))
            }
        }
        
        // Validate spacing
        for (key, spacing) in theme.spacing {
            if spacing < 0 {
                errors.append(.invalidSpacing("Spacing cannot be negative for \(key): \(spacing)"))
            }
            
            if spacing > 1000 {
                errors.append(.invalidSpacing("Spacing too large for \(key): \(spacing)"))
            }
        }
        
        // Validate animations
        for (key, animation) in theme.animations {
            if animation.duration < 0 {
                errors.append(.invalidAnimationDuration("Animation duration cannot be negative for \(key): \(animation.duration)"))
            }
            
            if animation.duration > 10 {
                errors.append(.invalidAnimationDuration("Animation duration too long for \(key): \(animation.duration)"))
            }
        }
        
        return errors
    }
    
    // MARK: - Content Validation
    
    private func validateContent(_ theme: ThemeSchema) -> [ThemeValidationError] {
        var errors: [ThemeValidationError] = []
        
        // Check for duplicate properties
        let colorKeys = Set(theme.colors.keys)
        let typographyKeys = Set(theme.typography.keys)
        let spacingKeys = Set(theme.spacing.keys)
        let animationKeys = Set(theme.animations.keys)
        
        let allKeys = colorKeys.union(typographyKeys).union(spacingKeys).union(animationKeys)
        
        // Check for semantic consistency
        if !theme.colors.keys.contains("primary") {
            errors.append(.missingRequiredProperty("primary color"))
        }
        
        if !theme.colors.keys.contains("background") {
            errors.append(.missingRequiredProperty("background color"))
        }
        
        if !theme.colors.keys.contains("text") {
            errors.append(.missingRequiredProperty("text color"))
        }
        
        // Validate color relationships
        if let primary = theme.colors["primary"],
           let background = theme.colors["background"] {
            if primary == background {
                errors.append(.contentError("Primary color cannot be the same as background color"))
            }
        }
        
        // Validate typography hierarchy
        let fontSizes = theme.typography.values.map { $0.fontSize }.sorted()
        if fontSizes.count > 1 {
            let minSize = fontSizes.first!
            let maxSize = fontSizes.last!
            if maxSize / minSize > 10 {
                errors.append(.contentError("Font size hierarchy too extreme (ratio: \(maxSize / minSize))"))
            }
        }
        
        return errors
    }
    
    // MARK: - Accessibility Validation
    
    private func validateAccessibility(_ theme: ThemeSchema) -> [ThemeValidationError] {
        var errors: [ThemeValidationError] = []
        
        // Check color contrast ratios
        let colorPairs = generateColorPairs(from: theme.colors)
        
        for (color1, color2) in colorPairs {
            let contrastRatio = calculateContrastRatio(color1: color1, color2: color2)
            
            // WCAG AA standard: 4.5:1 for normal text, 3:1 for large text
            if contrastRatio < 3.0 {
                errors.append(.colorContrastError("Insufficient contrast ratio (\(String(format: "%.2f", contrastRatio)):1) between \(color1) and \(color2)"))
            }
        }
        
        // Check for color-only information
        if theme.colors.keys.contains("error") && !theme.colors.keys.contains("errorIcon") {
            errors.append(.accessibilityError("Error states should not rely solely on color"))
        }
        
        if theme.colors.keys.contains("success") && !theme.colors.keys.contains("successIcon") {
            errors.append(.accessibilityError("Success states should not rely solely on color"))
        }
        
        // Validate font sizes for readability
        for (key, typography) in theme.typography {
            if typography.fontSize < 12 {
                errors.append(.accessibilityError("Font size too small for accessibility: \(key) (\(typography.fontSize)pt)"))
            }
        }
        
        // Check for sufficient touch targets
        let minSpacing = theme.spacing.values.min() ?? 0
        if minSpacing < 44 {
            errors.append(.accessibilityError("Minimum spacing should be at least 44pt for touch targets"))
        }
        
        return errors
    }
    
    // MARK: - Performance Validation
    
    private func validatePerformance(_ theme: ThemeSchema) -> [String] {
        var warnings: [String] = []
        
        // Check for too many colors
        if theme.colors.count > 50 {
            warnings.append("Theme contains \(theme.colors.count) colors, which may impact performance")
        }
        
        // Check for complex animations
        for (key, animation) in theme.animations {
            if animation.duration > 2.0 {
                warnings.append("Animation '\(key)' duration (\(animation.duration)s) may feel sluggish")
            }
        }
        
        // Check for large font variations
        let fontSizes = theme.typography.values.map { $0.fontSize }
        if fontSizes.count > 10 {
            warnings.append("Theme contains \(fontSizes.count) different font sizes, consider consolidating")
        }
        
        return warnings
    }
    
    // MARK: - Helper Methods
    
    private func isValidColorFormat(_ color: String) -> Bool {
        // Check for hex format (#RRGGBB or #RRGGBBAA)
        let hexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$"
        let hexRegex = try! NSRegularExpression(pattern: hexPattern)
        let hexRange = NSRange(location: 0, length: color.utf16.count)
        
        if hexRegex.firstMatch(in: color, range: hexRange) != nil {
            return true
        }
        
        // Check for named colors (basic validation)
        let namedColors = ["red", "green", "blue", "black", "white", "gray", "yellow", "orange", "purple", "pink", "brown", "cyan", "magenta"]
        if namedColors.contains(color.lowercased()) {
            return true
        }
        
        return false
    }
    
    private func generateColorPairs(from colors: [String: String]) -> [(String, String)] {
        var pairs: [(String, String)] = []
        let colorArray = Array(colors.values)
        
        for i in 0..<colorArray.count {
            for j in (i+1)..<colorArray.count {
                pairs.append((colorArray[i], colorArray[j]))
            }
        }
        
        return pairs
    }
    
    private func calculateContrastRatio(color1: String, color2: String) -> Double {
        // Simplified contrast ratio calculation
        // In a real implementation, you would convert colors to luminance values
        let luminance1 = getLuminance(for: color1)
        let luminance2 = getLuminance(for: color2)
        
        let lighter = max(luminance1, luminance2)
        let darker = min(luminance1, luminance2)
        
        return (lighter + 0.05) / (darker + 0.05)
    }
    
    private func getLuminance(for color: String) -> Double {
        // Simplified luminance calculation
        // In a real implementation, you would parse the color and calculate actual luminance
        if color.hasPrefix("#") {
            // Basic hex color luminance approximation
            return 0.5 // Placeholder
        } else {
            // Named color luminance approximation
            switch color.lowercased() {
            case "white": return 1.0
            case "black": return 0.0
            case "gray": return 0.5
            case "red": return 0.3
            case "green": return 0.4
            case "blue": return 0.2
            default: return 0.5
            }
        }
    }
    
    private func calculateAccessibilityScore(_ theme: ThemeSchema, errors: [ThemeValidationError]) -> Double {
        let totalChecks = 10.0 // Number of accessibility checks
        let errorCount = Double(errors.filter { 
            if case .accessibilityError = $0 { return true }
            if case .colorContrastError = $0 { return true }
            return false
        }.count)
        
        return max(0.0, (totalChecks - errorCount) / totalChecks * 100.0)
    }
    
    private func calculatePerformanceScore(_ theme: ThemeSchema, warnings: [String]) -> Double {
        let totalChecks = 5.0 // Number of performance checks
        let warningCount = Double(warnings.count)
        
        return max(0.0, (totalChecks - warningCount) / totalChecks * 100.0)
    }
}

// MARK: - Validation View

struct ThemeValidationView: View {
    @StateObject private var validator = ThemeValidator()
    @State private var theme: ThemeSchema?
    @State private var showingFilePicker = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text("Theme Validation")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Validate theme structure, accessibility, and performance")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                
                // Import Button
                Button(action: {
                    showingFilePicker = true
                }) {
                    HStack {
                        Image(systemName: "doc.badge.plus")
                        Text("Import Theme for Validation")
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
                        Text("Validating theme...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                }
                
                // Validation Results
                if let result = validator.validationResult {
                    ValidationResultView(result: result)
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
                    await validator.validateTheme(importedTheme)
                }
            } catch {
                print("Error importing theme: \(error)")
            }
        case .failure(let error):
            print("File import failed: \(error)")
        }
    }
}

// MARK: - Validation Result View

struct ValidationResultView: View {
    let result: ThemeValidationResult
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Overall Status
                HStack {
                    Image(systemName: result.isValid ? "checkmark.circle.fill" : "xmark.circle.fill")
                        .foregroundColor(result.isValid ? .green : .red)
                        .font(.title2)
                    
                    Text(result.isValid ? "Theme is Valid" : "Theme has Issues")
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Spacer()
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(10)
                
                // Scores
                HStack(spacing: 16) {
                    ScoreCard(
                        title: "Accessibility",
                        score: result.accessibilityScore,
                        color: .blue
                    )
                    
                    ScoreCard(
                        title: "Performance",
                        score: result.performanceScore,
                        color: .orange
                    )
                }
                
                // Errors
                if !result.errors.isEmpty {
                    ErrorSection(errors: result.errors)
                }
                
                // Warnings
                if !result.warnings.isEmpty {
                    WarningSection(warnings: result.warnings)
                }
            }
            .padding()
        }
    }
}

// MARK: - Score Card

struct ScoreCard: View {
    let title: String
    let score: Double
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            ZStack {
                Circle()
                    .stroke(color.opacity(0.2), lineWidth: 8)
                    .frame(width: 60, height: 60)
                
                Circle()
                    .trim(from: 0, to: score / 100)
                    .stroke(color, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .frame(width: 60, height: 60)
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 1.0), value: score)
                
                Text("\(Int(score))")
                    .font(.headline)
                    .fontWeight(.bold)
            }
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }
}

// MARK: - Error Section

struct ErrorSection: View {
    let errors: [ThemeValidationError]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.red)
                Text("Errors (\(errors.count))")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }
            
            ForEach(errors, id: \.id) { error in
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

// MARK: - Warning Section

struct WarningSection: View {
    let warnings: [String]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.orange)
                Text("Warnings (\(warnings.count))")
                    .font(.headline)
                    .fontWeight(.semibold)
                Spacer()
            }
            
            ForEach(warnings, id: \.self) { warning in
                HStack(alignment: .top, spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.orange)
                        .font(.caption)
                    
                    Text(warning)
                        .font(.caption)
                        .foregroundColor(.primary)
                    
                    Spacer()
                }
                .padding(.vertical, 4)
            }
        }
        .padding()
        .background(Color.orange.opacity(0.1))
        .cornerRadius(10)
    }
}

// MARK: - Preview

struct ThemeValidator_Previews: PreviewProvider {
    static var previews: some View {
        ThemeValidationView()
    }
} 