//
//  ThemeCustomizationView.swift
//  Aether SwiftUI App
//
//  Guided creativity interface for theme customization with typography controls
//  and accessibility features. This view empowers users to express their brand
//  identity while guiding them toward accessible design choices.
//

import SwiftUI

// MARK: - Theme Customization View

/// Main view for theme customization with guided creativity
struct ThemeCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedTab = 0
    @State private var showingTypographyGuide = false
    @State private var showingAccessibilityGuide = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Tab selector
                CustomTabSelector(selectedTab: $selectedTab)
                
                // Content area
                TabView(selection: $selectedTab) {
                    ColorsCustomizationView()
                        .tag(0)
                    
                    TypographyCustomizationView()
                        .tag(1)
                    
                    AccessibilityCustomizationView()
                        .tag(2)
                    
                    PreviewCustomizationView()
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
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .sheet(isPresented: $showingTypographyGuide) {
            TypographyGuideView()
        }
        .sheet(isPresented: $showingAccessibilityGuide) {
            AccessibilityGuideView()
        }
    }
    
    private func saveTheme() {
        // Save current theme configuration
        themeManager.setCustomTheme(themeManager.currentTheme, name: "Custom")
    }
}

// MARK: - Custom Tab Selector

struct CustomTabSelector: View {
    @Binding var selectedTab: Int
    
    private let tabs = ["Colors", "Typography", "Accessibility", "Preview"]
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(0..<tabs.count, id: \.self) { index in
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        selectedTab = index
                    }
                }) {
                    VStack(spacing: 4) {
                        Text(tabs[index])
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(selectedTab == index ? .primary : .secondary)
                        
                        Rectangle()
                            .fill(selectedTab == index ? Color.accentColor : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }
}

// MARK: - Colors Customization View

struct ColorsCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Color palette section
                ColorPaletteSection()
                
                // Color harmony guide
                ColorHarmonyGuide()
                
                // Contrast checker
                ContrastCheckerSection()
            }
            .padding()
        }
    }
}

struct ColorPaletteSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Palette")
                .font(.title2)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                ColorPickerCard(
                    title: "Primary",
                    color: $themeManager.currentTheme.primary,
                    description: "Main brand color"
                )
                
                ColorPickerCard(
                    title: "Secondary",
                    color: $themeManager.currentTheme.secondary,
                    description: "Supporting color"
                )
                
                ColorPickerCard(
                    title: "Background",
                    color: $themeManager.currentTheme.background,
                    description: "Main background"
                )
                
                ColorPickerCard(
                    title: "Surface",
                    color: $themeManager.currentTheme.surface,
                    description: "Card backgrounds"
                )
            }
        }
    }
}

struct ColorPickerCard: View {
    let title: String
    @Binding var color: Color
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.headline)
                    .fontWeight(.medium)
                
                Spacer()
                
                ColorPicker("", selection: $color)
                    .labelsHidden()
            }
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            RoundedRectangle(cornerRadius: 8)
                .fill(color)
                .frame(height: 40)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ColorHarmonyGuide: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Harmony Guide")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 12) {
                HarmonyTip(
                    icon: "paintbrush.fill",
                    title: "Limit Your Palette",
                    description: "Use 2-3 main colors for consistency"
                )
                
                HarmonyTip(
                    icon: "eye.fill",
                    title: "Consider Contrast",
                    description: "Ensure text is readable on backgrounds"
                )
                
                HarmonyTip(
                    icon: "accessibility",
                    title: "Accessibility First",
                    description: "Test with color blindness simulators"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct HarmonyTip: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.accentColor)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

struct ContrastCheckerSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Contrast Checker")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                ContrastTestRow(
                    label: "Primary on Background",
                    textColor: themeManager.currentTheme.primary,
                    backgroundColor: themeManager.currentTheme.background
                )
                
                ContrastTestRow(
                    label: "Text on Surface",
                    textColor: themeManager.currentTheme.textPrimary,
                    backgroundColor: themeManager.currentTheme.surface
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ContrastTestRow: View {
    let label: String
    let textColor: Color
    let backgroundColor: Color
    
    var body: some View {
        HStack {
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text("Sample Text")
                .font(.caption)
                .foregroundColor(textColor)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(backgroundColor)
                .cornerRadius(4)
            
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.green)
                .font(.caption)
        }
    }
}

// MARK: - Typography Customization View

struct TypographyCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var selectedPrimaryFont = "SF Pro Display"
    @State private var selectedSecondaryFont = "SF Pro Text"
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Font selection section
                FontSelectionSection(
                    selectedPrimaryFont: $selectedPrimaryFont,
                    selectedSecondaryFont: $selectedSecondaryFont
                )
                
                // Typography preview
                TypographyPreviewSection()
                
                // Font hierarchy guide
                FontHierarchyGuide()
            }
            .padding()
        }
        .onChange(of: selectedPrimaryFont) { _ in
            updateTypography()
        }
        .onChange(of: selectedSecondaryFont) { _ in
            updateTypography()
        }
    }
    
    private func updateTypography() {
        themeManager.updateTypography(
            primaryFontName: selectedPrimaryFont,
            secondaryFontName: selectedSecondaryFont
        )
    }
}

struct FontSelectionSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var selectedPrimaryFont: String
    @Binding var selectedSecondaryFont: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Typography")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                FontPickerCard(
                    title: "Primary Font",
                    selectedFont: $selectedPrimaryFont,
                    availableFonts: themeManager.availableFontFamilies,
                    description: "Used for headings and main text"
                )
                
                FontPickerCard(
                    title: "Secondary Font",
                    selectedFont: $selectedSecondaryFont,
                    availableFonts: themeManager.availableFontFamilies,
                    description: "Used for accents and special text"
                )
            }
            
            // Recommended combinations
            RecommendedFontCombinationsView(
                selectedPrimaryFont: $selectedPrimaryFont,
                selectedSecondaryFont: $selectedSecondaryFont
            )
        }
    }
}

struct FontPickerCard: View {
    let title: String
    @Binding var selectedFont: String
    let availableFonts: [String]
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .fontWeight(.medium)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Menu {
                ForEach(availableFonts, id: \.self) { font in
                    Button(font) {
                        selectedFont = font
                    }
                }
            } label: {
                HStack {
                    Text(selectedFont)
                        .font(.system(size: 16, weight: .medium))
                    
                    Spacer()
                    
                    Image(systemName: "chevron.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
            }
        }
    }
}

struct RecommendedFontCombinationsView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var selectedPrimaryFont: String
    @Binding var selectedSecondaryFont: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recommended Combinations")
                .font(.subheadline)
                .fontWeight(.medium)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                ForEach(themeManager.getRecommendedFontCombinations(), id: \.primary) { combination in
                    Button(action: {
                        selectedPrimaryFont = combination.primary
                        selectedSecondaryFont = combination.secondary
                    }) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(combination.primary)
                                .font(.caption)
                                .fontWeight(.medium)
                            
                            Text(combination.secondary)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            
                            Text(combination.description)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                                .lineLimit(2)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
        }
    }
}

struct TypographyPreviewSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Typography Preview")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Heading 1")
                    .font(themeManager.currentTheme.typography.heading(size: .h1))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Heading 2")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Body Text")
                    .font(themeManager.currentTheme.typography.body())
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("This is a sample paragraph that demonstrates how your typography choices will look in practice. It includes various text elements to help you evaluate readability and visual hierarchy.")
                    .font(themeManager.currentTheme.typography.body())
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .lineLimit(nil)
            }
            .padding()
            .background(themeManager.currentTheme.surface)
            .cornerRadius(12)
        }
    }
}

struct FontHierarchyGuide: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Typography Best Practices")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 12) {
                TypographyTip(
                    icon: "textformat.size",
                    title: "Use 2-3 Fonts Maximum",
                    description: "More fonts create visual chaos"
                )
                
                TypographyTip(
                    icon: "text.alignleft",
                    title: "Establish Clear Hierarchy",
                    description: "Use size and weight for emphasis"
                )
                
                TypographyTip(
                    icon: "eye",
                    title: "Prioritize Readability",
                    description: "Choose fonts that are easy to read"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct TypographyTip: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.accentColor)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

// MARK: - Accessibility Customization View

struct AccessibilityCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Accessibility controls
                AccessibilityControlsSection()
                
                // Color blindness support
                ColorBlindnessSection()
                
                // Motion and contrast settings
                MotionAndContrastSection()
            }
            .padding()
        }
    }
}

struct AccessibilityControlsSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Settings")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                AccessibilityToggle(
                    title: "High Contrast",
                    description: "Increase contrast for better visibility",
                    isOn: themeManager.currentAccessibility.useHighContrast,
                    action: { themeManager.toggleHighContrast() }
                )
                
                AccessibilityToggle(
                    title: "Reduce Motion",
                    description: "Minimize animations for vestibular disorders",
                    isOn: themeManager.currentAccessibility.reduceMotion,
                    action: { themeManager.toggleReducedMotion() }
                )
                
                AccessibilityToggle(
                    title: "Large Text",
                    description: "Use larger text sizes",
                    isOn: themeManager.currentAccessibility.useLargeText,
                    action: { /* Implement large text toggle */ }
                )
            }
        }
    }
}

struct AccessibilityToggle: View {
    let title: String
    let description: String
    let isOn: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: isOn ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isOn ? .green : .secondary)
                    .font(.title3)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ColorBlindnessSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Blindness Support")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                ColorBlindnessOption(
                    title: "None",
                    description: "Standard colors",
                    isSelected: themeManager.currentAccessibility.colorBlindnessSupport == .none,
                    action: { themeManager.setColorBlindnessSupport(.none) }
                )
                
                ColorBlindnessOption(
                    title: "Deuteranopia",
                    description: "Red-green color blindness",
                    isSelected: themeManager.currentAccessibility.colorBlindnessSupport == .deuteranopia,
                    action: { themeManager.setColorBlindnessSupport(.deuteranopia) }
                )
                
                ColorBlindnessOption(
                    title: "Protanopia",
                    description: "Red-green color blindness",
                    isSelected: themeManager.currentAccessibility.colorBlindnessSupport == .protanopia,
                    action: { themeManager.setColorBlindnessSupport(.protanopia) }
                )
                
                ColorBlindnessOption(
                    title: "Tritanopia",
                    description: "Blue-yellow color blindness",
                    isSelected: themeManager.currentAccessibility.colorBlindnessSupport == .tritanopia,
                    action: { themeManager.setColorBlindnessSupport(.tritanopia) }
                )
            }
        }
    }
}

struct ColorBlindnessOption: View {
    let title: String
    let description: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    Text(description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? .blue : .secondary)
                    .font(.title3)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct MotionAndContrastSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Guidelines")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 12) {
                AccessibilityTip(
                    icon: "eye.fill",
                    title: "WCAG 2.1 Compliance",
                    description: "Ensure 4.5:1 contrast ratio for normal text"
                )
                
                AccessibilityTip(
                    icon: "hand.raised.fill",
                    title: "Test with Users",
                    description: "Validate accessibility with real users"
                )
                
                AccessibilityTip(
                    icon: "gear",
                    title: "System Integration",
                    description: "Respect user's system accessibility settings"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct AccessibilityTip: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.accentColor)
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
    }
}

// MARK: - Preview Customization View

struct PreviewCustomizationView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
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
            }
            .padding()
        }
    }
}

struct SampleUIComponents: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Sample card
            VStack(alignment: .leading, spacing: 12) {
                Text("Sample Card")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("This is a sample card that demonstrates how your theme will look in practice.")
                    .font(themeManager.currentTheme.typography.body())
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                
                HStack {
                    Button("Primary Action") {
                        // Sample action
                    }
                    .buttonStyle(PrimaryButtonStyle())
                    
                    Button("Secondary") {
                        // Sample action
                    }
                    .buttonStyle(SecondaryButtonStyle())
                }
            }
            .padding()
            .background(themeManager.currentTheme.surface)
            .cornerRadius(12)
            .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
        }
    }
}

struct RealTimePreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Real-time Preview")
                .font(.headline)
                .fontWeight(.medium)
            
            VStack(spacing: 8) {
                Text("Heading 1")
                    .font(themeManager.currentTheme.typography.heading(size: .h1))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Heading 2")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Body text with your selected typography and colors.")
                    .font(themeManager.currentTheme.typography.body())
                    .foregroundColor(themeManager.currentTheme.textSecondary)
            }
            .padding()
            .background(themeManager.currentTheme.background)
            .cornerRadius(8)
        }
    }
}

// MARK: - Button Styles

struct PrimaryButtonStyle: ButtonStyle {
    @EnvironmentObject var themeManager: ThemeManager
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(themeManager.currentTheme.typography.body())
            .foregroundColor(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(themeManager.currentTheme.primary)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    @EnvironmentObject var themeManager: ThemeManager
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(themeManager.currentTheme.typography.body())
            .foregroundColor(themeManager.currentTheme.primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(themeManager.currentTheme.primary.opacity(0.1))
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Guide Views

struct TypographyGuideView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Typography Best Practices")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        GuideSection(
                            title: "Font Selection",
                            content: "Choose fonts that reflect your brand personality while maintaining excellent readability. Consider using system fonts for better performance and consistency."
                        )
                        
                        GuideSection(
                            title: "Hierarchy",
                            content: "Establish clear visual hierarchy using font sizes, weights, and spacing. Use no more than 2-3 font families to avoid visual chaos."
                        )
                        
                        GuideSection(
                            title: "Readability",
                            content: "Ensure sufficient contrast between text and background colors. Test your typography choices with users to validate readability."
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Typography Guide")
            .navigationBarTitleDisplayMode(.inline)
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

struct AccessibilityGuideView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Accessibility Guidelines")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        GuideSection(
                            title: "Color Contrast",
                            content: "Ensure sufficient contrast ratios between text and background colors. Follow WCAG 2.1 guidelines for accessibility compliance."
                        )
                        
                        GuideSection(
                            title: "Color Blindness",
                            content: "Design with color blindness in mind. Use patterns, icons, and text labels in addition to color to convey information."
                        )
                        
                        GuideSection(
                            title: "Motion Sensitivity",
                            content: "Provide options to reduce or eliminate motion for users with vestibular disorders. Respect system accessibility settings."
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Accessibility Guide")
            .navigationBarTitleDisplayMode(.inline)
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

struct GuideSection: View {
    let title: String
    let content: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .fontWeight(.semibold)
            
            Text(content)
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct ThemeCustomizationView_Previews: PreviewProvider {
    static var previews: some View {
        ThemeCustomizationView()
            .environmentObject(ThemeManager())
    }
} 