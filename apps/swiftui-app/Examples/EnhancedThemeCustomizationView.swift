//
//  EnhancedThemeCustomizationView.swift
//  Aether SwiftUI App
//
//  Enhanced theme customization with interactive accessibility feedback.
//  Provides real-time validation and educational guidance for accessible design.
//

import SwiftUI

// MARK: - Enhanced Theme Customization View

struct EnhancedThemeCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Environment(\.dismiss) private var dismiss
    
    @StateObject private var feedbackManager = InteractiveFeedbackManager()
    @State private var selectedTab = 0
    @State private var showingEducationalGuide = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Interactive feedback display
                InteractiveFeedbackView(feedbackManager: feedbackManager)
                    .padding(.horizontal)
                
                // Tab selector
                CustomTabSelector(selectedTab: $selectedTab)
                
                // Content area
                TabView(selection: $selectedTab) {
                    EnhancedColorsCustomizationView(feedbackManager: feedbackManager)
                        .tag(0)
                    
                    EnhancedTypographyCustomizationView(feedbackManager: feedbackManager)
                        .tag(1)
                    
                    EnhancedAccessibilityCustomizationView(feedbackManager: feedbackManager)
                        .tag(2)
                    
                    EnhancedPreviewCustomizationView(feedbackManager: feedbackManager)
                        .tag(3)
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            }
            .navigationTitle("Customize Theme")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveTheme()
                    }
                    .fontWeight(.semibold)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingEducationalGuide = true
                    }) {
                        Image(systemName: "questionmark.circle")
                    }
                }
            }
            .sheet(isPresented: $showingEducationalGuide) {
                AccessibilityEducationalGuide()
            }
        }
    }
    
    private func saveTheme() {
        // Save the current theme
        themeManager.setCustomTheme(themeManager.currentTheme, name: "Custom Theme")
        dismiss()
    }
}

// MARK: - Enhanced Colors Customization View

struct EnhancedColorsCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Accessibility education banner
                AccessibilityEducationBanner()
                
                // Color palette section with real-time validation
                EnhancedColorPaletteSection(feedbackManager: feedbackManager)
                
                // Color harmony guide
                EnhancedColorHarmonyGuide(feedbackManager: feedbackManager)
                
                // Advanced contrast checker
                AdvancedContrastCheckerSection(feedbackManager: feedbackManager)
                
                // Color blindness simulation
                ColorBlindnessSimulationSection(feedbackManager: feedbackManager)
            }
            .padding()
        }
    }
}

// MARK: - Accessibility Education Banner

struct AccessibilityEducationBanner: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "eye.triangle")
                    .foregroundColor(.blue)
                    .font(.title2)
                
                Text("Accessibility First")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
            }
            
            Text("This interface provides real-time feedback to help you create accessible color combinations that meet WCAG AA standards.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineLimit(nil)
        }
        .padding()
        .background(Color.blue.opacity(0.1))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.blue.opacity(0.3), lineWidth: 1)
        )
    }
}

// MARK: - Enhanced Color Palette Section

struct EnhancedColorPaletteSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Palette")
                .font(.title2)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.primary,
                    title: "Primary",
                    description: "Main brand color",
                    testBackground: themeManager.currentTheme.background
                )
                
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.secondary,
                    title: "Secondary",
                    description: "Supporting color",
                    testBackground: themeManager.currentTheme.background
                )
                
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.background,
                    title: "Background",
                    description: "Main background",
                    testBackground: "#FFFFFF"
                )
                
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.surface,
                    title: "Surface",
                    description: "Card backgrounds",
                    testBackground: themeManager.currentTheme.background
                )
                
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.textPrimary,
                    title: "Primary Text",
                    description: "Main text color",
                    testBackground: themeManager.currentTheme.background
                )
                
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $themeManager.currentTheme.textSecondary,
                    title: "Secondary Text",
                    description: "Supporting text",
                    testBackground: themeManager.currentTheme.background
                )
            }
        }
    }
}

// MARK: - Enhanced Color Harmony Guide

struct EnhancedColorHarmonyGuide: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Harmony Guide")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                HarmonyTipCard(
                    title: "Complementary Colors",
                    description: "Colors opposite on the color wheel create high contrast but can be harsh.",
                    example: ["#FF0000", "#00FFFF"],
                    feedbackManager: feedbackManager
                )
                
                HarmonyTipCard(
                    title: "Analogous Colors",
                    description: "Colors next to each other create harmony but may lack contrast.",
                    example: ["#FF0000", "#FF8000"],
                    feedbackManager: feedbackManager
                )
                
                HarmonyTipCard(
                    title: "Triadic Colors",
                    description: "Three colors equally spaced create balance and good contrast.",
                    example: ["#FF0000", "#00FF00", "#0000FF"],
                    feedbackManager: feedbackManager
                )
            }
        }
    }
}

// MARK: - Harmony Tip Card

struct HarmonyTipCard: View {
    let title: String
    let description: String
    let example: [String]
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            HStack(spacing: 8) {
                ForEach(example, id: \.self) { color in
                    RoundedRectangle(cornerRadius: 6)
                        .fill(Color(hex: color) ?? .gray)
                        .frame(width: 30, height: 30)
                        .overlay(
                            RoundedRectangle(cornerRadius: 6)
                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                        )
                        .onTapGesture {
                            feedbackManager.validateColorCombination(
                                foreground: color,
                                background: "#FFFFFF",
                                elementType: "example"
                            )
                        }
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Advanced Contrast Checker Section

struct AdvancedContrastCheckerSection: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    @State private var foregroundColor = "#000000"
    @State private var backgroundColor = "#FFFFFF"
    @State private var elementType = "Normal Text"
    
    private let elementTypes = ["Normal Text", "Large Text", "UI Components"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Advanced Contrast Checker")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                // Element type selector
                Picker("Element Type", selection: $elementType) {
                    ForEach(elementTypes, id: \.self) { type in
                        Text(type).tag(type)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                
                // Color inputs
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Foreground")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        InteractiveColorPicker(
                            feedbackManager: feedbackManager,
                            selectedColor: $foregroundColor,
                            title: "Foreground",
                            description: "Text or icon color",
                            testBackground: backgroundColor
                        )
                    }
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Background")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        InteractiveColorPicker(
                            feedbackManager: feedbackManager,
                            selectedColor: $backgroundColor,
                            title: "Background",
                            description: "Background color",
                            testBackground: "#FFFFFF"
                        )
                    }
                }
                
                // Real-time preview
                ContrastPreviewCard(
                    foreground: foregroundColor,
                    background: backgroundColor,
                    title: elementType
                )
                
                // Manual validation button
                Button(action: {
                    feedbackManager.validateColorCombination(
                        foreground: foregroundColor,
                        background: backgroundColor,
                        elementType: elementType.lowercased()
                    )
                }) {
                    HStack {
                        Image(systemName: "checkmark.shield")
                        Text("Validate Contrast")
                    }
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(8)
                }
            }
        }
    }
}

// MARK: - Color Blindness Simulation Section

struct ColorBlindnessSimulationSection: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    @State private var selectedColor = "#FF0000"
    @State private var selectedSimulation = "Normal"
    
    private let simulations = ["Normal", "Protanopia", "Deuteranopia", "Tritanopia"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Blindness Simulation")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                // Color picker
                InteractiveColorPicker(
                    feedbackManager: feedbackManager,
                    selectedColor: $selectedColor,
                    title: "Test Color",
                    description: "Color to simulate",
                    testBackground: "#FFFFFF"
                )
                
                // Simulation type selector
                Picker("Simulation Type", selection: $selectedSimulation) {
                    ForEach(simulations, id: \.self) { simulation in
                        Text(simulation).tag(simulation)
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                
                // Simulation preview
                ColorBlindnessPreviewCard(
                    color: selectedColor,
                    simulation: selectedSimulation
                )
            }
        }
    }
}

// MARK: - Color Blindness Preview Card

struct ColorBlindnessPreviewCard: View {
    let color: String
    let simulation: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Simulation Preview")
                .font(.subheadline)
                .fontWeight(.medium)
            
            HStack(spacing: 16) {
                VStack(spacing: 8) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(hex: color) ?? .gray)
                        .frame(width: 60, height: 60)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                        )
                    
                    Text("Original")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                VStack(spacing: 8) {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(simulatedColor)
                        .frame(width: 60, height: 60)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.primary.opacity(0.2), lineWidth: 1)
                        )
                    
                    Text(simulation)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
            }
            
            Text("This simulation shows how the color appears to someone with \(simulation.lowercased()).")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private var simulatedColor: Color {
        // This is a simplified simulation - in a real app, you'd use proper color blindness simulation algorithms
        switch simulation {
        case "Protanopia":
            return Color(hex: color)?.opacity(0.7) ?? .gray
        case "Deuteranopia":
            return Color(hex: color)?.opacity(0.8) ?? .gray
        case "Tritanopia":
            return Color(hex: color)?.opacity(0.6) ?? .gray
        default:
            return Color(hex: color) ?? .gray
        }
    }
}

// MARK: - Enhanced Typography Customization View

struct EnhancedTypographyCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                TypographyEducationBanner()
                
                FontSelectionSection(feedbackManager: feedbackManager)
                
                FontSizeSection(feedbackManager: feedbackManager)
                
                ReadabilityPreviewSection(feedbackManager: feedbackManager)
            }
            .padding()
        }
    }
}

// MARK: - Typography Education Banner

struct TypographyEducationBanner: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "textformat")
                    .foregroundColor(.purple)
                    .font(.title2)
                
                Text("Typography & Readability")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Spacer()
            }
            
            Text("Good typography improves readability and accessibility. Consider font size, line height, and contrast for optimal user experience.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .lineLimit(nil)
        }
        .padding()
        .background(Color.purple.opacity(0.1))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.purple.opacity(0.3), lineWidth: 1)
        )
    }
}

// MARK: - Font Selection Section

struct FontSelectionSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Font Selection")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                FontSelectionCard(
                    title: "Primary Font",
                    currentFont: themeManager.currentTypography.primaryFont,
                    description: "Main font for headings and important text",
                    feedbackManager: feedbackManager
                )
                
                FontSelectionCard(
                    title: "Secondary Font",
                    currentFont: themeManager.currentTypography.secondaryFont,
                    description: "Supporting font for body text",
                    feedbackManager: feedbackManager
                )
            }
        }
    }
}

// MARK: - Font Selection Card

struct FontSelectionCard: View {
    let title: String
    let currentFont: String
    let description: String
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Text(currentFont)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(.primary)
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(.systemGray6))
                .cornerRadius(8)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Font Size Section

struct FontSizeSection: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Font Size Guidelines")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                FontSizeGuidelineCard(
                    size: "16px",
                    description: "Minimum readable size for body text",
                    feedbackManager: feedbackManager
                )
                
                FontSizeGuidelineCard(
                    size: "18px",
                    description: "Recommended size for better readability",
                    feedbackManager: feedbackManager
                )
                
                FontSizeGuidelineCard(
                    size: "24px",
                    description: "Large text for headings and emphasis",
                    feedbackManager: feedbackManager
                )
            }
        }
    }
}

// MARK: - Font Size Guideline Card

struct FontSizeGuidelineCard: View {
    let size: String
    let description: String
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        HStack {
            Text(size)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.primary)
                .frame(width: 60, alignment: .leading)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Readability Preview Section

struct ReadabilityPreviewSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Readability Preview")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 16) {
                Text("Sample Heading")
                    .font(themeManager.currentTheme.typography.heading(size: .h1))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("This is a sample paragraph that demonstrates how your typography choices will look in practice. Good typography improves readability and accessibility for all users.")
                    .font(themeManager.currentTheme.typography.body())
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .lineLimit(nil)
                
                Text("Secondary text example")
                    .font(themeManager.currentTheme.typography.caption())
                    .foregroundColor(themeManager.currentTheme.textTertiary)
            }
            .padding()
            .background(themeManager.currentTheme.surface)
            .cornerRadius(12)
            .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Enhanced Accessibility Customization View

struct EnhancedAccessibilityCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                AccessibilityEducationBanner()
                
                AccessibilitySettingsSection(feedbackManager: feedbackManager)
                
                AccessibilityPreviewSection(feedbackManager: feedbackManager)
            }
            .padding()
        }
    }
}

// MARK: - Accessibility Settings Section

struct AccessibilitySettingsSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Settings")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                AccessibilityToggleCard(
                    title: "High Contrast",
                    description: "Increase contrast for better visibility",
                    isEnabled: themeManager.currentAccessibility.highContrast,
                    onToggle: {
                        themeManager.toggleHighContrast()
                    },
                    feedbackManager: feedbackManager
                )
                
                AccessibilityToggleCard(
                    title: "Large Text",
                    description: "Increase font sizes for better readability",
                    isEnabled: themeManager.currentAccessibility.largeText,
                    onToggle: {
                        themeManager.toggleLargeText()
                    },
                    feedbackManager: feedbackManager
                )
                
                AccessibilityToggleCard(
                    title: "Reduced Motion",
                    description: "Minimize animations for users with vestibular disorders",
                    isEnabled: themeManager.currentAccessibility.reducedMotion,
                    onToggle: {
                        themeManager.toggleReducedMotion()
                    },
                    feedbackManager: feedbackManager
                )
            }
        }
    }
}

// MARK: - Accessibility Toggle Card

struct AccessibilityToggleCard: View {
    let title: String
    let description: String
    let isEnabled: Bool
    let onToggle: () -> Void
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Toggle("", isOn: .constant(isEnabled))
                .onTapGesture {
                    onToggle()
                }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Accessibility Preview Section

struct AccessibilityPreviewSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Preview")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                // Normal preview
                AccessibilityPreviewCard(
                    title: "Normal",
                    theme: themeManager.currentTheme,
                    feedbackManager: feedbackManager
                )
                
                // High contrast preview
                if themeManager.currentAccessibility.highContrast {
                    AccessibilityPreviewCard(
                        title: "High Contrast",
                        theme: themeManager.currentTheme,
                        feedbackManager: feedbackManager
                    )
                }
            }
        }
    }
}

// MARK: - Accessibility Preview Card

struct AccessibilityPreviewCard: View {
    let title: String
    let theme: Theme
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Sample Heading")
                    .font(theme.typography.heading(size: .h2))
                    .foregroundColor(theme.textPrimary)
                
                Text("This is sample text that demonstrates the current accessibility settings.")
                    .font(theme.typography.body())
                    .foregroundColor(theme.textSecondary)
            }
            .padding()
            .background(theme.surface)
            .cornerRadius(8)
        }
    }
}

// MARK: - Enhanced Preview Customization View

struct EnhancedPreviewCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Theme Preview")
                    .font(.title2)
                    .fontWeight(.semibold)
                
                // Sample UI components
                SampleUIComponents()
                
                // Real-time preview
                RealTimePreview()
                
                // Accessibility validation summary
                AccessibilityValidationSummary(feedbackManager: feedbackManager)
            }
            .padding()
        }
    }
}

// MARK: - Accessibility Validation Summary

struct AccessibilityValidationSummary: View {
    @ObservedObject var feedbackManager: InteractiveFeedbackManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Summary")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                SummaryCard(
                    title: "Contrast Issues",
                    count: feedbackManager.feedbackHistory.filter { $0.type == .error || $0.type == .warning }.count,
                    color: .orange
                )
                
                SummaryCard(
                    title: "Passed Tests",
                    count: feedbackManager.feedbackHistory.filter { $0.type == .success }.count,
                    color: .green
                )
                
                SummaryCard(
                    title: "Total Validations",
                    count: feedbackManager.feedbackHistory.count,
                    color: .blue
                )
            }
        }
    }
}

// MARK: - Summary Card

struct SummaryCard: View {
    let title: String
    let count: Int
    let color: Color
    
    var body: some View {
        HStack {
            Text(title)
                .font(.subheadline)
                .foregroundColor(.primary)
            
            Spacer()
            
            Text("\(count)")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Accessibility Educational Guide

struct AccessibilityEducationalGuide: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    EducationalSection(
                        title: "WCAG Guidelines",
                        content: "Web Content Accessibility Guidelines (WCAG) ensure digital content is accessible to people with disabilities. WCAG AA is the standard level of compliance."
                    )
                    
                    EducationalSection(
                        title: "Contrast Ratios",
                        content: "Contrast ratio measures the difference in luminance between foreground and background colors. Higher ratios provide better readability."
                    )
                    
                    EducationalSection(
                        title: "Color Blindness",
                        content: "Approximately 8% of men and 0.5% of women have some form of color blindness. Avoid relying solely on color to convey information."
                    )
                    
                    EducationalSection(
                        title: "Typography",
                        content: "Good typography improves readability for all users. Consider font size, line height, and spacing for optimal accessibility."
                    )
                }
                .padding()
            }
            .navigationTitle("Accessibility Guide")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Educational Section

struct EducationalSection: View {
    let title: String
    let content: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(content)
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(nil)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct EnhancedThemeCustomizationView_Previews: PreviewProvider {
    static var previews: some View {
        EnhancedThemeCustomizationView()
            .environmentObject(ThemeManager())
    }
} 