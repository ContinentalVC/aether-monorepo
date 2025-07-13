//
//  ColorPaletteSelectionView.swift
//  Aether SwiftUI App
//
//  Comprehensive color palette selection interface with color wheel tools,
//  harmonious color schemes, and validation to guide users toward
//  professional and accessible color choices.
//

import SwiftUI

// MARK: - Color Palette Selection View

/// Main view for color palette selection with guided creativity
struct ColorPaletteSelectionView: View {
    @StateObject private var paletteManager = ColorPaletteManager()
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedTab = 0
    @State private var showingHarmonyGuide = false
    @State private var showingValidationGuide = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Tab selector
                ColorPaletteTabSelector(selectedTab: $selectedTab)
                
                // Content area
                TabView(selection: $selectedTab) {
                    ColorWheelTabView()
                        .tag(0)
                    
                    PredefinedPalettesTabView()
                        .tag(1)
                    
                    HarmonyTypesTabView()
                        .tag(2)
                    
                    ValidationTabView()
                        .tag(3)
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            }
            .navigationTitle("Color Palette")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Apply") {
                        applyPalette()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .environmentObject(paletteManager)
        .sheet(isPresented: $showingHarmonyGuide) {
            ColorHarmonyGuideView()
        }
        .sheet(isPresented: $showingValidationGuide) {
            ColorValidationGuideView()
        }
    }
    
    private func applyPalette() {
        // Apply the selected palette to the theme
        // This would integrate with the main theme manager
    }
}

// MARK: - Color Palette Tab Selector

struct ColorPaletteTabSelector: View {
    @Binding var selectedTab: Int
    
    private let tabs = ["Color Wheel", "Predefined", "Harmony", "Validation"]
    
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

// MARK: - Color Wheel Tab View

struct ColorWheelTabView: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Color wheel section
                ColorWheelSection()
                
                // Current palette preview
                CurrentPalettePreview()
                
                // Harmony type selector
                HarmonyTypeSelector()
                
                // Color guidance
                ColorGuidanceSection()
            }
            .padding()
        }
    }
}

struct ColorWheelSection: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Wheel")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                // Color wheel
                ColorWheelView(selectedColor: $paletteManager.baseColor)
                    .frame(width: 280, height: 280)
                    .onChange(of: paletteManager.baseColor) { _ in
                        paletteManager.generateNewPalette()
                    }
                
                // Color info
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Selected Color")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text(paletteManager.baseColor.hsl.hue, format: .number)
                            .font(.caption)
                            .fontWeight(.medium)
                        + Text("°")
                            .font(.caption)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("Saturation")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text(paletteManager.baseColor.hsl.saturation, format: .number)
                            .font(.caption)
                            .fontWeight(.medium)
                        + Text("%")
                            .font(.caption)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 4) {
                        Text("Lightness")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text(paletteManager.baseColor.hsl.lightness, format: .number)
                            .font(.caption)
                            .fontWeight(.medium)
                        + Text("%")
                            .font(.caption)
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
        }
    }
}

struct CurrentPalettePreview: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Generated Palette")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                // Color swatches
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 12) {
                    ColorSwatch(color: paletteManager.currentPalette.primary, label: "Primary")
                    ColorSwatch(color: paletteManager.currentPalette.secondary, label: "Secondary")
                    if let accent = paletteManager.currentPalette.accent {
                        ColorSwatch(color: accent, label: "Accent")
                    }
                    ColorSwatch(color: paletteManager.currentPalette.neutral, label: "Neutral")
                    ColorSwatch(color: paletteManager.currentPalette.neutralLight, label: "Light")
                    ColorSwatch(color: paletteManager.currentPalette.neutralDark, label: "Dark")
                }
                
                // Palette info
                VStack(alignment: .leading, spacing: 8) {
                    Text(paletteManager.currentPalette.name)
                        .font(.headline)
                        .fontWeight(.semibold)
                    
                    Text(paletteManager.currentPalette.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    HStack {
                        Image(systemName: paletteManager.currentPalette.harmonyType.icon)
                        Text(paletteManager.currentPalette.harmonyType.rawValue)
                            .font(.caption)
                            .fontWeight(.medium)
                    }
                    .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
}

struct ColorSwatch: View {
    let color: Color
    let label: String
    
    var body: some View {
        VStack(spacing: 8) {
            RoundedRectangle(cornerRadius: 8)
                .fill(color)
                .frame(height: 40)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            
            Text(label)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
        }
    }
}

struct HarmonyTypeSelector: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Harmony Type")
                .font(.title2)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(paletteManager.harmonyTypes, id: \.self) { harmonyType in
                    HarmonyTypeCard(
                        harmonyType: harmonyType,
                        isSelected: paletteManager.selectedHarmonyType == harmonyType
                    ) {
                        paletteManager.updateHarmonyType(harmonyType)
                    }
                }
            }
        }
    }
}

struct HarmonyTypeCard: View {
    let harmonyType: ColorHarmonyType
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: harmonyType.icon)
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : .primary)
                
                VStack(spacing: 4) {
                    Text(harmonyType.rawValue)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(isSelected ? .white : .primary)
                    
                    Text(harmonyType.description)
                        .font(.caption)
                        .foregroundColor(isSelected ? .white.opacity(0.8) : .secondary)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(isSelected ? Color.accentColor : Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ColorGuidanceSection: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Guidelines")
                .font(.title2)
                .fontWeight(.semibold)
            
            VStack(alignment: .leading, spacing: 12) {
                ColorGuidanceTip(
                    icon: "paintbrush.fill",
                    title: "Limit Your Palette",
                    description: "Use 2-3 main colors plus neutrals for consistency"
                )
                
                ColorGuidanceTip(
                    icon: "eye.fill",
                    title: "Consider Contrast",
                    description: "Ensure sufficient contrast for accessibility"
                )
                
                ColorGuidanceTip(
                    icon: "paintpalette.fill",
                    title: "Follow Harmony",
                    description: "Use color theory to create pleasing combinations"
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ColorGuidanceTip: View {
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

// MARK: - Predefined Palettes Tab View

struct PredefinedPalettesTabView: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Predefined Palettes")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 1), spacing: 16) {
                    ForEach(paletteManager.predefinedPalettes, id: \.name) { palette in
                        PredefinedPaletteCard(
                            palette: palette,
                            isSelected: paletteManager.currentPalette.name == palette.name
                        ) {
                            paletteManager.setPredefinedPalette(palette)
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct PredefinedPaletteCard: View {
    let palette: UIColorPalette
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 16) {
                // Color swatches
                HStack(spacing: 8) {
                    ForEach(palette.allColors, id: \.self) { color in
                        RoundedRectangle(cornerRadius: 6)
                            .fill(color)
                            .frame(height: 32)
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
                        .font(.subheadline)
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

// MARK: - Harmony Types Tab View

struct HarmonyTypesTabView: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Color Harmony Types")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                VStack(spacing: 16) {
                    ForEach(paletteManager.harmonyTypes, id: \.self) { harmonyType in
                        HarmonyTypeDetailCard(
                            harmonyType: harmonyType,
                            isSelected: paletteManager.selectedHarmonyType == harmonyType
                        ) {
                            paletteManager.updateHarmonyType(harmonyType)
                        }
                    }
                }
            }
            .padding()
        }
    }
}

struct HarmonyTypeDetailCard: View {
    let harmonyType: ColorHarmonyType
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: harmonyType.icon)
                    .font(.title2)
                    .foregroundColor(isSelected ? .accentColor : .primary)
                    .frame(width: 30)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(harmonyType.rawValue)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(harmonyType.description)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.leading)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.accentColor)
                        .font(.title3)
                }
            }
            .padding()
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

// MARK: - Validation Tab View

struct ValidationTabView: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Text("Palette Validation")
                .font(.title2)
                .fontWeight(.semibold)
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Validation score
                ValidationScoreCard()
                
                // Validation details
                ValidationDetailsSection()
                
                // Recommendations
                ValidationRecommendationsSection()
            }
            .padding()
        }
    }
}

struct ValidationScoreCard: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Overall Score")
                .font(.headline)
                .fontWeight(.semibold)
            
            ZStack {
                Circle()
                    .stroke(Color.gray.opacity(0.2), lineWidth: 8)
                    .frame(width: 120, height: 120)
                
                Circle()
                    .trim(from: 0, to: CGFloat(paletteManager.currentValidation.score) / 100)
                    .stroke(scoreColor, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                    .frame(width: 120, height: 120)
                    .rotationEffect(.degrees(-90))
                
                VStack {
                    Text("\(paletteManager.currentValidation.score)")
                        .font(.title)
                        .fontWeight(.bold)
                    Text("/ 100")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            Text(scoreDescription)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(scoreColor)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
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

struct ValidationDetailsSection: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Validation Details")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
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

struct ValidationRecommendationsSection: View {
    @EnvironmentObject var paletteManager: ColorPaletteManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Recommendations")
                .font(.headline)
                .fontWeight(.semibold)
            
            if paletteManager.currentValidation.messages.isEmpty {
                Text("Great job! Your palette meets all accessibility and design standards.")
                    .font(.subheadline)
                    .foregroundColor(.green)
                    .padding()
                    .background(Color.green.opacity(0.1))
                    .cornerRadius(8)
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(paletteManager.currentValidation.messages, id: \.self) { message in
                        HStack(spacing: 8) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.orange)
                                .font(.caption)
                            
                            Text(message)
                                .font(.subheadline)
                                .foregroundColor(.primary)
                        }
                    }
                }
                .padding()
                .background(Color.orange.opacity(0.1))
                .cornerRadius(8)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Guide Views

struct ColorHarmonyGuideView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Color Harmony Guide")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        HarmonyGuideSection(
                            title: "Complementary",
                            description: "Two opposite colors on the color wheel. Creates high contrast and visual impact.",
                            icon: "circle.lefthalf.filled"
                        )
                        
                        HarmonyGuideSection(
                            title: "Triadic",
                            description: "Three evenly spaced colors on the color wheel. Creates balanced and vibrant schemes.",
                            icon: "triangle"
                        )
                        
                        HarmonyGuideSection(
                            title: "Analogous",
                            description: "Colors that are next to each other on the color wheel. Creates harmonious and serene schemes.",
                            icon: "arrow.left.and.right"
                        )
                        
                        HarmonyGuideSection(
                            title: "Monochromatic",
                            description: "Different shades and tints of the same color. Creates sophisticated and cohesive schemes.",
                            icon: "circle.fill"
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Harmony Guide")
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

struct HarmonyGuideSection: View {
    let title: String
    let description: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.accentColor)
                    .font(.title3)
                
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
            }
            
            Text(description)
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ColorValidationGuideView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Color Validation Guide")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        ValidationGuideSection(
                            title: "Contrast Ratio",
                            description: "Ensure 4.5:1 contrast ratio for normal text and 3:1 for large text to meet WCAG 2.1 standards.",
                            icon: "eye.fill"
                        )
                        
                        ValidationGuideSection(
                            title: "Color Harmony",
                            description: "Colors should follow the selected harmony type to create visually pleasing combinations.",
                            icon: "paintpalette.fill"
                        )
                        
                        ValidationGuideSection(
                            title: "Saturation Balance",
                            description: "Avoid overly saturated colors that can be overwhelming and unprofessional.",
                            icon: "paintbrush.fill"
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Validation Guide")
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

struct ValidationGuideSection: View {
    let title: String
    let description: String
    let icon: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(.accentColor)
                    .font(.title3)
                
                Text(title)
                    .font(.headline)
                    .fontWeight(.semibold)
            }
            
            Text(description)
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct ColorPaletteSelectionView_Previews: PreviewProvider {
    static var previews: some View {
        ColorPaletteSelectionView()
    }
} 