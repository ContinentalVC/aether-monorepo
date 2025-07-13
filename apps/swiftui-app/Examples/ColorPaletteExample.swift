//
//  ColorPaletteExample.swift
//  Aether SwiftUI App
//
//  Example usage of the comprehensive color palette selection system
//  demonstrating color wheel tools, harmonious color schemes, and validation.
//

import SwiftUI

// MARK: - Color Palette Example View

struct ColorPaletteExample: View {
    @StateObject private var paletteManager = ColorPaletteManager()
    @State private var showingColorPaletteSelection = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    ColorPaletteHeader()
                    
                    // Current Palette Display
                    CurrentPaletteDisplay()
                    
                    // Quick Actions
                    QuickActionsSection()
                    
                    // Validation Status
                    ValidationStatusSection()
                    
                    // Predefined Palettes Preview
                    PredefinedPalettesPreview()
                    
                    // Color Harmony Examples
                    ColorHarmonyExamples()
                }
                .padding()
            }
            .navigationTitle("Color Palette")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Customize") {
                        showingColorPaletteSelection = true
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .environmentObject(paletteManager)
        .sheet(isPresented: $showingColorPaletteSelection) {
            ColorPaletteSelectionView()
        }
    }
}

// MARK: - Color Palette Header

struct ColorPaletteHeader: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "paintpalette.fill")
                .font(.system(size: 48))
                .foregroundColor(.accentColor)
            
            Text("Color Palette Manager")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Create harmonious and accessible color schemes with guided tools")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

// MARK: - Current Palette Display

struct CurrentPaletteDisplay: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Current Palette")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                // Color swatches
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 12) {
                    ColorSwatchLarge(color: paletteManager.currentPalette.primary, label: "Primary")
                    ColorSwatchLarge(color: paletteManager.currentPalette.secondary, label: "Secondary")
                    if let accent = paletteManager.currentPalette.accent {
                        ColorSwatchLarge(color: accent, label: "Accent")
                    }
                    ColorSwatchLarge(color: paletteManager.currentPalette.neutral, label: "Neutral")
                    ColorSwatchLarge(color: paletteManager.currentPalette.neutralLight, label: "Light")
                    ColorSwatchLarge(color: paletteManager.currentPalette.neutralDark, label: "Dark")
                }
                
                // Palette info
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text(paletteManager.currentPalette.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        Spacer()
                        
                        Image(systemName: paletteManager.currentPalette.harmonyType.icon)
                            .foregroundColor(.accentColor)
                    }
                    
                    Text(paletteManager.currentPalette.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    Text(paletteManager.currentPalette.harmonyType.rawValue)
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(.accentColor)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.1))
                        .cornerRadius(8)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
}

struct ColorSwatchLarge: View {
    let color: Color
    let label: String
    
    var body: some View {
        VStack(spacing: 8) {
            RoundedRectangle(cornerRadius: 12)
                .fill(color)
                .frame(height: 60)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
            
            Text(label)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - Quick Actions Section

struct QuickActionsSection: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Actions")
                .font(.title2)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                QuickActionButton(
                    title: "Random Palette",
                    icon: "dice.fill",
                    color: .blue
                ) {
                    generateRandomPalette()
                }
                
                QuickActionButton(
                    title: "Reset to Default",
                    icon: "arrow.clockwise",
                    color: .orange
                ) {
                    resetToDefault()
                }
                
                QuickActionButton(
                    title: "Export Palette",
                    icon: "square.and.arrow.up",
                    color: .green
                ) {
                    exportPalette()
                }
                
                QuickActionButton(
                    title: "Import Palette",
                    icon: "square.and.arrow.down",
                    color: .purple
                ) {
                    importPalette()
                }
            }
        }
    }
    
    private func generateRandomPalette() {
        let randomHue = Double.random(in: 0...360)
        let randomColor = Color.fromHSL(hue: randomHue, saturation: 70, lightness: 50)
        paletteManager.updateBaseColor(randomColor)
    }
    
    private func resetToDefault() {
        paletteManager.setPredefinedPalette(PredefinedPalettes.modernBlue)
    }
    
    private func exportPalette() {
        // Export functionality would be implemented here
        print("Exporting palette: \(paletteManager.currentPalette.name)")
    }
    
    private func importPalette() {
        // Import functionality would be implemented here
        print("Importing palette")
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Validation Status Section

struct ValidationStatusSection: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Validation Status")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                // Score indicator
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Overall Score")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        Text("\(paletteManager.currentValidation.score)")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(scoreColor)
                        + Text("/100")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("Status")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        
                        Text(scoreDescription)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(scoreColor)
                    }
                }
                
                // Validation details
                VStack(spacing: 8) {
                    ValidationDetailRow(
                        title: "Contrast",
                        isPassing: paletteManager.currentValidation.hasGoodContrast,
                        description: "Colors have sufficient contrast for accessibility"
                    )
                    
                    ValidationDetailRow(
                        title: "Harmony",
                        isPassing: paletteManager.currentValidation.isHarmonious,
                        description: "Colors follow the selected harmony type"
                    )
                    
                    ValidationDetailRow(
                        title: "Saturation",
                        isPassing: paletteManager.currentValidation.hasBalancedSaturation,
                        description: "Colors have balanced saturation levels"
                    )
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
    
    private var scoreColor: Color {
        let score = paletteManager.currentValidation.score
        if score >= 80 { return .green }
        if score >= 60 { return .orange }
        return .red
    }
    
    private var scoreDescription: String {
        let score = paletteManager.currentValidation.score
        if score >= 80 { return "Excellent" }
        if score >= 60 { return "Good" }
        return "Needs Improvement"
    }
}

struct ValidationDetailRow: View {
    let title: String
    let isPassing: Bool
    let description: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: isPassing ? "checkmark.circle.fill" : "xmark.circle.fill")
                .foregroundColor(isPassing ? .green : .red)
                .font(.title3)
            
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

// MARK: - Predefined Palettes Preview

struct PredefinedPalettesPreview: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Predefined Palettes")
                .font(.title2)
                .fontWeight(.semibold)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(paletteManager.predefinedPalettes, id: \.name) { palette in
                        PredefinedPaletteCard(
                            palette: palette,
                            isSelected: paletteManager.currentPalette.name == palette.name
                        ) {
                            paletteManager.setPredefinedPalette(palette)
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
    }
}

struct PredefinedPaletteCard: View {
    let palette: UIColorPalette
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 12) {
                // Color swatches
                HStack(spacing: 8) {
                    ForEach(palette.allColors, id: \.self) { color in
                        RoundedRectangle(cornerRadius: 6)
                            .fill(color)
                            .frame(width: 24, height: 24)
                            .overlay(
                                RoundedRectangle(cornerRadius: 6)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                    }
                }
                
                // Palette info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(palette.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(.primary)
                        
                        Spacer()
                        
                        if isSelected {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.accentColor)
                                .font(.title3)
                        }
                    }
                    
                    Text(palette.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        Image(systemName: palette.harmonyType.icon)
                        Text(palette.harmonyType.rawValue)
                            .font(.caption)
                            .fontWeight(.medium)
                    }
                    .foregroundColor(.secondary)
                }
            }
            .padding()
            .frame(width: 200)
            .background(isSelected ? Color.accentColor.opacity(0.1) : Color(.systemGray6))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.accentColor : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Color Harmony Examples

struct ColorHarmonyExamples: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Harmony Examples")
                .font(.title2)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                ForEach(paletteManager.harmonyTypes, id: \.self) { harmonyType in
                    HarmonyExampleCard(harmonyType: harmonyType)
                }
            }
        }
    }
}

struct HarmonyExampleCard: View {
    let harmonyType: ColorHarmonyType
    @State private var examplePalette: UIColorPalette?
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: harmonyType.icon)
                    .foregroundColor(.accentColor)
                    .font(.title3)
                
                Text(harmonyType.rawValue)
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
            }
            
            // Color preview
            if let palette = examplePalette {
                HStack(spacing: 8) {
                    ForEach(palette.allColors.prefix(3), id: \.self) { color in
                        RoundedRectangle(cornerRadius: 8)
                            .fill(color)
                            .frame(height: 32)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                            )
                    }
                }
            }
            
            // Description
            Text(harmonyType.description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .onAppear {
            generateExamplePalette()
        }
    }
    
    private func generateExamplePalette() {
        let baseColor = Color.blue
        examplePalette = ColorHarmonyGenerator.generateHarmoniousColors(
            baseColor: baseColor,
            harmonyType: harmonyType
        )
    }
}

// MARK: - Integration Example

/// Example of how to integrate the ColorPaletteManager with your app's theme system
struct ThemeIntegrationExample: View {
    @StateObject private var paletteManager = ColorPaletteManager()
    @State private var showingPaletteSelection = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Example UI using the current palette
                ExampleUIWithPalette()
                
                // Palette controls
                VStack(spacing: 12) {
                    Button("Customize Palette") {
                        showingPaletteSelection = true
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button("Apply to App Theme") {
                        applyPaletteToAppTheme()
                    }
                    .buttonStyle(.bordered)
                }
            }
            .padding()
            .navigationTitle("Theme Integration")
        }
        .environmentObject(paletteManager)
        .sheet(isPresented: $showingPaletteSelection) {
            ColorPaletteSelectionView()
        }
    }
    
    private func applyPaletteToAppTheme() {
        // Example of how to apply the palette to your app's theme
        let palette = paletteManager.currentPalette
        
        // Update your app's theme colors
        // ThemeManager.shared.updateColors(
        //     primary: palette.primary,
        //     secondary: palette.secondary,
        //     accent: palette.accent,
        //     neutral: palette.neutral
        // )
        
        print("Applied palette: \(palette.name)")
    }
}

struct ExampleUIWithPalette: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Example buttons using palette colors
            VStack(spacing: 12) {
                Button("Primary Action") {
                    // Action
                }
                .buttonStyle(.borderedProminent)
                .tint(paletteManager.currentPalette.primary)
                
                Button("Secondary Action") {
                    // Action
                }
                .buttonStyle(.bordered)
                .foregroundColor(paletteManager.currentPalette.secondary)
                .border(paletteManager.currentPalette.secondary, width: 1)
            }
            
            // Example card using palette colors
            VStack(alignment: .leading, spacing: 8) {
                Text("Example Card")
                    .font(.headline)
                    .foregroundColor(paletteManager.currentPalette.primary)
                
                Text("This card demonstrates how the palette colors can be used throughout your app's UI.")
                    .font(.body)
                    .foregroundColor(.primary)
            }
            .padding()
            .background(paletteManager.currentPalette.neutralLight)
            .cornerRadius(12)
        }
    }
}

// MARK: - Usage Instructions

/*
 
 USAGE INSTRUCTIONS:
 
 1. Basic Integration:
    - Add ColorPaletteManager as a StateObject in your main view
    - Pass it down using environmentObject
    - Use ColorPaletteSelectionView for the full customization interface
 
 2. Quick Palette Changes:
    - Use paletteManager.setPredefinedPalette() for quick changes
    - Use paletteManager.updateBaseColor() to change the base color
    - Use paletteManager.updateHarmonyType() to change harmony type
 
 3. Validation:
    - Check paletteManager.currentValidation.score for overall quality
    - Use validation messages to guide users
    - Ensure accessibility compliance
 
 4. Custom Integration:
    - Apply palette colors to your app's theme system
    - Use the colors in your UI components
    - Consider saving/loading palettes for user preferences
 
 5. Best Practices:
    - Always validate palettes before applying
    - Provide fallback colors for accessibility
    - Consider user preferences and system appearance
    - Test palettes in both light and dark modes
 
 */

// MARK: - Preview

struct ColorPaletteExample_Previews: PreviewProvider {
    static var previews: some View {
        ColorPaletteExample()
    }
}

struct ThemeIntegrationExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeIntegrationExample()
    }
} 