//
//  ColorPaletteManager.swift
//  Aether SwiftUI App
//
//  Comprehensive color palette management system with color wheel tools,
//  harmonious color schemes, and validation to guide users toward
//  professional and accessible color choices.
//

import SwiftUI

// MARK: - Color Theory Models

/// Represents a color in HSL (Hue, Saturation, Lightness) format
struct HSLColor {
    let hue: Double        // 0-360 degrees
    let saturation: Double // 0-100 percentage
    let lightness: Double  // 0-100 percentage
    
    init(hue: Double, saturation: Double, lightness: Double) {
        self.hue = max(0, min(360, hue))
        self.saturation = max(0, min(100, saturation))
        self.lightness = max(0, min(100, lightness))
    }
    
    /// Convert HSL to SwiftUI Color
    var color: Color {
        Color(hue: hue / 360, saturation: saturation / 100, brightness: lightness / 100)
    }
    
    /// Convert to RGB for calculations
    var rgb: (red: Double, green: Double, blue: Double) {
        let h = hue / 360
        let s = saturation / 100
        let l = lightness / 100
        
        let c = (1 - abs(2 * l - 1)) * s
        let x = c * (1 - abs((h * 6).truncatingRemainder(dividingBy: 2) - 1))
        let m = l - c / 2
        
        let (r, g, b): (Double, Double, Double)
        switch Int(h * 6) {
        case 0: (r, g, b) = (c, x, 0)
        case 1: (r, g, b) = (x, c, 0)
        case 2: (r, g, b) = (0, c, x)
        case 3: (r, g, b) = (0, x, c)
        case 4: (r, g, b) = (x, 0, c)
        case 5: (r, g, b) = (c, 0, x)
        default: (r, g, b) = (0, 0, 0)
        }
        
        return (red: r + m, green: g + m, blue: b + m)
    }
}

/// Represents a color palette with primary, secondary, and neutral colors
struct UIColorPalette {
    let primary: Color
    let secondary: Color
    let accent: Color?
    let neutral: Color
    let neutralLight: Color
    let neutralDark: Color
    
    let name: String
    let description: String
    let harmonyType: ColorHarmonyType
    
    init(
        primary: Color,
        secondary: Color,
        accent: Color? = nil,
        neutral: Color = .gray,
        name: String,
        description: String,
        harmonyType: ColorHarmonyType
    ) {
        self.primary = primary
        self.secondary = secondary
        self.accent = accent
        self.neutral = neutral
        self.neutralLight = neutral.opacity(0.3)
        self.neutralDark = neutral.opacity(0.7)
        self.name = name
        self.description = description
        self.harmonyType = harmonyType
    }
    
    /// Get all colors in the palette
    var allColors: [Color] {
        var colors = [primary, secondary, neutral, neutralLight, neutralDark]
        if let accent = accent {
            colors.append(accent)
        }
        return colors
    }
    
    /// Validate palette for accessibility and harmony
    var validation: PaletteValidation {
        return PaletteValidation(palette: self)
    }
}

/// Types of color harmony
enum ColorHarmonyType: String, CaseIterable {
    case complementary = "Complementary"
    case triadic = "Triadic"
    case analogous = "Analogous"
    case monochromatic = "Monochromatic"
    case splitComplementary = "Split Complementary"
    case tetradic = "Tetradic"
    
    var description: String {
        switch self {
        case .complementary:
            return "Two opposite colors on the color wheel"
        case .triadic:
            return "Three evenly spaced colors on the color wheel"
        case .analogous:
            return "Colors that are next to each other on the color wheel"
        case .monochromatic:
            return "Different shades and tints of the same color"
        case .splitComplementary:
            return "One base color and two colors adjacent to its complement"
        case .tetradic:
            return "Two pairs of complementary colors"
        }
    }
    
    var icon: String {
        switch self {
        case .complementary: return "circle.lefthalf.filled"
        case .triadic: return "triangle"
        case .analogous: return "arrow.left.and.right"
        case .monochromatic: return "circle.fill"
        case .splitComplementary: return "arrow.up.left.and.arrow.down.right"
        case .tetradic: return "square.grid.2x2"
        }
    }
}

/// Validation results for a color palette
struct PaletteValidation {
    let palette: UIColorPalette
    
    /// Check if colors have sufficient contrast
    var hasGoodContrast: Bool {
        let primaryContrast = calculateContrastRatio(
            textColor: palette.primary,
            backgroundColor: palette.neutral
        )
        let secondaryContrast = calculateContrastRatio(
            textColor: palette.secondary,
            backgroundColor: palette.neutral
        )
        
        return primaryContrast >= 4.5 && secondaryContrast >= 4.5
    }
    
    /// Check if colors are harmonious
    var isHarmonious: Bool {
        let primaryHSL = palette.primary.hsl
        let secondaryHSL = palette.secondary.hsl
        
        // Check if colors follow the harmony type
        switch palette.harmonyType {
        case .complementary:
            return abs(primaryHSL.hue - secondaryHSL.hue) >= 150 && abs(primaryHSL.hue - secondaryHSL.hue) <= 210
        case .triadic:
            let diff = abs(primaryHSL.hue - secondaryHSL.hue)
            return (diff >= 110 && diff <= 130) || (diff >= 230 && diff <= 250)
        case .analogous:
            let diff = abs(primaryHSL.hue - secondaryHSL.hue)
            return diff >= 15 && diff <= 45
        case .monochromatic:
            return abs(primaryHSL.hue - secondaryHSL.hue) < 15
        case .splitComplementary:
            let diff = abs(primaryHSL.hue - secondaryHSL.hue)
            return (diff >= 150 && diff <= 210) || (diff >= 30 && diff <= 90)
        case .tetradic:
            let diff = abs(primaryHSL.hue - secondaryHSL.hue)
            return (diff >= 80 && diff <= 100) || (diff >= 170 && diff <= 190)
        }
    }
    
    /// Check if palette is not too saturated
    var hasBalancedSaturation: Bool {
        let primaryHSL = palette.primary.hsl
        let secondaryHSL = palette.secondary.hsl
        
        // Avoid overly saturated colors
        return primaryHSL.saturation <= 80 && secondaryHSL.saturation <= 80
    }
    
    /// Overall validation score (0-100)
    var score: Int {
        var score = 0
        
        if hasGoodContrast { score += 40 }
        if isHarmonious { score += 30 }
        if hasBalancedSaturation { score += 30 }
        
        return score
    }
    
    /// Validation messages
    var messages: [String] {
        var messages: [String] = []
        
        if !hasGoodContrast {
            messages.append("Colors may not have sufficient contrast for accessibility")
        }
        
        if !isHarmonious {
            messages.append("Colors don't follow the selected harmony type")
        }
        
        if !hasBalancedSaturation {
            messages.append("Colors may be too saturated for professional use")
        }
        
        return messages
    }
    
    /// Calculate contrast ratio between two colors
    private func calculateContrastRatio(textColor: Color, backgroundColor: Color) -> Double {
        let textRGB = textColor.rgb
        let backgroundRGB = backgroundColor.rgb
        
        let textLuminance = calculateLuminance(r: textRGB.red, g: textRGB.green, b: textRGB.blue)
        let backgroundLuminance = calculateLuminance(r: backgroundRGB.red, g: backgroundRGB.green, b: backgroundRGB.blue)
        
        let lighter = max(textLuminance, backgroundLuminance)
        let darker = min(textLuminance, backgroundLuminance)
        
        return (lighter + 0.05) / (darker + 0.05)
    }
    
    /// Calculate luminance of a color
    private func calculateLuminance(r: Double, g: Double, b: Double) -> Double {
        let rsRGB = r <= 0.03928 ? r / 12.92 : pow((r + 0.055) / 1.055, 2.4)
        let gsRGB = g <= 0.03928 ? g / 12.92 : pow((g + 0.055) / 1.055, 2.4)
        let bsRGB = b <= 0.03928 ? b / 12.92 : pow((b + 0.055) / 1.055, 2.4)
        
        return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
    }
}

// MARK: - Color Extensions

extension Color {
    /// Convert Color to HSL
    var hsl: HSLColor {
        let components = UIColor(self).cgColor.components ?? [0, 0, 0, 1]
        let r = components[0]
        let g = components[1]
        let b = components[2]
        
        let max = Swift.max(r, g, b)
        let min = Swift.min(r, g, b)
        let delta = max - min
        
        var hue: Double = 0
        let saturation: Double = max == 0 ? 0 : delta / max
        let lightness: Double = (max + min) / 2
        
        if delta != 0 {
            switch max {
            case r:
                hue = ((g - b) / delta).truncatingRemainder(dividingBy: 6)
            case g:
                hue = (b - r) / delta + 2
            case b:
                hue = (r - g) / delta + 4
            default:
                break
            }
            hue *= 60
            if hue < 0 {
                hue += 360
            }
        }
        
        return HSLColor(hue: hue, saturation: saturation * 100, lightness: lightness * 100)
    }
    
    /// Convert Color to RGB
    var rgb: (red: Double, green: Double, blue: Double) {
        let components = UIColor(self).cgColor.components ?? [0, 0, 0, 1]
        return (red: components[0], green: components[1], blue: components[2])
    }
    
    /// Create Color from HSL
    static func fromHSL(hue: Double, saturation: Double, lightness: Double) -> Color {
        return HSLColor(hue: hue, saturation: saturation, lightness: lightness).color
    }
}

// MARK: - Color Harmony Generator

/// Generator for harmonious color schemes
class ColorHarmonyGenerator {
    
    /// Generate colors based on harmony type and base color
    static func generateHarmoniousColors(
        baseColor: Color,
        harmonyType: ColorHarmonyType,
        includeAccent: Bool = false
    ) -> UIColorPalette {
        let baseHSL = baseColor.hsl
        
        let (secondaryHSL, accentHSL) = generateHarmoniousHSL(
            baseHSL: baseHSL,
            harmonyType: harmonyType
        )
        
        let secondaryColor = secondaryHSL.color
        let accentColor = accentHSL?.color
        
        let neutralColor = generateNeutralColor(from: baseHSL)
        
        return UIColorPalette(
            primary: baseColor,
            secondary: secondaryColor,
            accent: accentColor,
            neutral: neutralColor,
            name: "\(harmonyType.rawValue) Harmony",
            description: harmonyType.description,
            harmonyType: harmonyType
        )
    }
    
    /// Generate harmonious HSL values
    private static func generateHarmoniousHSL(
        baseHSL: HSLColor,
        harmonyType: ColorHarmonyType
    ) -> (secondary: HSLColor, accent: HSLColor?) {
        switch harmonyType {
        case .complementary:
            let secondaryHue = (baseHSL.hue + 180).truncatingRemainder(dividingBy: 360)
            let secondaryHSL = HSLColor(
                hue: secondaryHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            return (secondaryHSL, nil)
            
        case .triadic:
            let secondaryHue = (baseHSL.hue + 120).truncatingRemainder(dividingBy: 360)
            let accentHue = (baseHSL.hue + 240).truncatingRemainder(dividingBy: 360)
            
            let secondaryHSL = HSLColor(
                hue: secondaryHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            let accentHSL = HSLColor(
                hue: accentHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            return (secondaryHSL, accentHSL)
            
        case .analogous:
            let secondaryHue = (baseHSL.hue + 30).truncatingRemainder(dividingBy: 360)
            let accentHue = (baseHSL.hue - 30 + 360).truncatingRemainder(dividingBy: 360)
            
            let secondaryHSL = HSLColor(
                hue: secondaryHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            let accentHSL = HSLColor(
                hue: accentHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            return (secondaryHSL, accentHSL)
            
        case .monochromatic:
            let secondaryHSL = HSLColor(
                hue: baseHSL.hue,
                saturation: baseHSL.saturation * 0.8,
                lightness: baseHSL.lightness * 0.8
            )
            let accentHSL = HSLColor(
                hue: baseHSL.hue,
                saturation: baseHSL.saturation * 1.2,
                lightness: baseHSL.lightness * 1.2
            )
            return (secondaryHSL, accentHSL)
            
        case .splitComplementary:
            let complementHue = (baseHSL.hue + 180).truncatingRemainder(dividingBy: 360)
            let secondaryHue = (complementHue + 30).truncatingRemainder(dividingBy: 360)
            let accentHue = (complementHue - 30 + 360).truncatingRemainder(dividingBy: 360)
            
            let secondaryHSL = HSLColor(
                hue: secondaryHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            let accentHSL = HSLColor(
                hue: accentHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            return (secondaryHSL, accentHSL)
            
        case .tetradic:
            let secondaryHue = (baseHSL.hue + 90).truncatingRemainder(dividingBy: 360)
            let accentHue = (baseHSL.hue + 180).truncatingRemainder(dividingBy: 360)
            
            let secondaryHSL = HSLColor(
                hue: secondaryHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            let accentHSL = HSLColor(
                hue: accentHue,
                saturation: baseHSL.saturation,
                lightness: baseHSL.lightness
            )
            return (secondaryHSL, accentHSL)
        }
    }
    
    /// Generate neutral color based on base color
    private static func generateNeutralColor(from baseHSL: HSLColor) -> Color {
        // Create a neutral gray with slight tint of the base color
        let neutralHSL = HSLColor(
            hue: baseHSL.hue,
            saturation: baseHSL.saturation * 0.1, // Very low saturation
            lightness: 50 // Medium lightness
        )
        return neutralHSL.color
    }
}

// MARK: - Predefined Color Palettes

/// Collection of professionally designed color palettes
struct PredefinedPalettes {
    
    /// Modern blue palette
    static let modernBlue = UIColorPalette(
        primary: Color(red: 0.2, green: 0.4, blue: 0.8),
        secondary: Color(red: 0.6, green: 0.8, blue: 1.0),
        neutral: Color(red: 0.9, green: 0.9, blue: 0.9),
        name: "Modern Blue",
        description: "Professional and trustworthy",
        harmonyType: .complementary
    )
    
    /// Nature green palette
    static let natureGreen = UIColorPalette(
        primary: Color(red: 0.2, green: 0.7, blue: 0.4),
        secondary: Color(red: 0.4, green: 0.8, blue: 0.6),
        neutral: Color(red: 0.95, green: 0.97, blue: 0.95),
        name: "Nature Green",
        description: "Fresh and organic",
        harmonyType: .analogous
    )
    
    /// Sunset orange palette
    static let sunsetOrange = UIColorPalette(
        primary: Color(red: 1.0, green: 0.4, blue: 0.2),
        secondary: Color(red: 1.0, green: 0.6, blue: 0.4),
        neutral: Color(red: 1.0, green: 0.96, blue: 0.92),
        name: "Sunset Orange",
        description: "Warm and energetic",
        harmonyType: .monochromatic
    )
    
    /// Royal purple palette
    static let royalPurple = UIColorPalette(
        primary: Color(red: 0.6, green: 0.2, blue: 0.8),
        secondary: Color(red: 0.8, green: 0.4, blue: 1.0),
        neutral: Color(red: 0.98, green: 0.96, blue: 1.0),
        name: "Royal Purple",
        description: "Creative and luxurious",
        harmonyType: .triadic
    )
    
    /// Ocean teal palette
    static let oceanTeal = UIColorPalette(
        primary: Color(red: 0.0, green: 0.6, blue: 0.8),
        secondary: Color(red: 0.2, green: 0.8, blue: 0.8),
        neutral: Color(red: 0.92, green: 0.96, blue: 1.0),
        name: "Ocean Teal",
        description: "Calm and refreshing",
        harmonyType: .splitComplementary
    )
    
    /// All predefined palettes
    static let all: [UIColorPalette] = [
        modernBlue,
        natureGreen,
        sunsetOrange,
        royalPurple,
        oceanTeal
    ]
}

// MARK: - Color Palette Manager

/// ObservableObject for managing color palettes
class ColorPaletteManager: ObservableObject {
    
    @Published var currentPalette: UIColorPalette
    @Published var selectedHarmonyType: ColorHarmonyType = .complementary
    @Published var baseColor: Color = .blue
    @Published var showingColorWheel = false
    @Published var showingPredefinedPalettes = false
    
    init() {
        self.currentPalette = PredefinedPalettes.modernBlue
    }
    
    /// Generate new palette based on current settings
    func generateNewPalette() {
        currentPalette = ColorHarmonyGenerator.generateHarmoniousColors(
            baseColor: baseColor,
            harmonyType: selectedHarmonyType
        )
    }
    
    /// Set predefined palette
    func setPredefinedPalette(_ palette: UIColorPalette) {
        currentPalette = palette
        baseColor = palette.primary
        selectedHarmonyType = palette.harmonyType
    }
    
    /// Update base color and regenerate palette
    func updateBaseColor(_ color: Color) {
        baseColor = color
        generateNewPalette()
    }
    
    /// Update harmony type and regenerate palette
    func updateHarmonyType(_ harmonyType: ColorHarmonyType) {
        selectedHarmonyType = harmonyType
        generateNewPalette()
    }
    
    /// Get validation for current palette
    var currentValidation: PaletteValidation {
        return currentPalette.validation
    }
    
    /// Get all predefined palettes
    var predefinedPalettes: [UIColorPalette] {
        return PredefinedPalettes.all
    }
    
    /// Get all harmony types
    var harmonyTypes: [ColorHarmonyType] {
        return ColorHarmonyType.allCases
    }
}

// MARK: - Color Wheel View

/// Interactive color wheel for color selection
struct ColorWheelView: View {
    @Binding var selectedColor: Color
    @State private var dragLocation: CGPoint = .zero
    @State private var isDragging = false
    
    private let wheelRadius: CGFloat = 120
    private let centerRadius: CGFloat = 20
    
    var body: some View {
        ZStack {
            // Color wheel background
            Circle()
                .fill(
                    AngularGradient(
                        gradient: Gradient(colors: hueSpectrum()),
                        center: .center,
                        startAngle: .degrees(0),
                        endAngle: .degrees(360)
                    )
                )
                .frame(width: wheelRadius * 2, height: wheelRadius * 2)
                .overlay(
                    Circle()
                        .stroke(Color.gray.opacity(0.3), lineWidth: 2)
                )
            
            // Center neutral area
            Circle()
                .fill(
                    RadialGradient(
                        gradient: Gradient(colors: [.white, .gray]),
                        center: .center,
                        startRadius: 0,
                        endRadius: centerRadius
                    )
                )
                .frame(width: centerRadius * 2, height: centerRadius * 2)
            
            // Selection indicator
            Circle()
                .fill(selectedColor)
                .frame(width: 20, height: 20)
                .overlay(
                    Circle()
                        .stroke(Color.white, lineWidth: 3)
                )
                .overlay(
                    Circle()
                        .stroke(Color.black, lineWidth: 1)
                )
                .position(
                    x: wheelRadius + cos(selectedColor.hsl.hue * .pi / 180) * (wheelRadius - centerRadius),
                    y: wheelRadius + sin(selectedColor.hsl.hue * .pi / 180) * (wheelRadius - centerRadius)
                )
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            updateColor(from: value.location)
                        }
                        .onEnded { _ in
                            isDragging = false
                        }
                )
        }
        .onTapGesture { location in
            updateColor(from: location)
        }
    }
    
    /// Update selected color based on tap/drag location
    private func updateColor(from location: CGPoint) {
        let center = CGPoint(x: wheelRadius, y: wheelRadius)
        let deltaX = location.x - center.x
        let deltaY = location.y - center.y
        
        let distance = sqrt(deltaX * deltaX + deltaY * deltaY)
        
        if distance <= centerRadius {
            // Center area - neutral colors
            let grayValue = 1.0 - (distance / centerRadius)
            selectedColor = Color.gray.opacity(grayValue)
        } else if distance <= wheelRadius {
            // Color wheel area
            let angle = atan2(deltaY, deltaX) * 180 / .pi
            let hue = angle < 0 ? angle + 360 : angle
            let saturation = min(1.0, (distance - centerRadius) / (wheelRadius - centerRadius))
            let lightness = 0.5
            
            selectedColor = Color.fromHSL(hue: hue, saturation: saturation * 100, lightness: lightness * 100)
        }
    }
    
    /// Generate hue spectrum colors
    private func hueSpectrum() -> [Color] {
        return stride(from: 0, through: 360, by: 1).map { hue in
            Color.fromHSL(hue: hue, saturation: 100, lightness: 50)
        }
    }
}

// MARK: - Color Palette Preview

/// Preview component for color palettes
struct ColorPalettePreview: View {
    let palette: UIColorPalette
    
    var body: some View {
        VStack(spacing: 16) {
            // Color swatches
            HStack(spacing: 12) {
                ForEach(palette.allColors, id: \.self) { color in
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color)
                        .frame(height: 40)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                        )
                }
            }
            
            // Palette info
            VStack(alignment: .leading, spacing: 4) {
                Text(palette.name)
                    .font(.headline)
                    .fontWeight(.semibold)
                
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
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Preview

struct ColorPaletteManager_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            ColorWheelView(selectedColor: .constant(.blue))
                .frame(width: 300, height: 300)
            
            ColorPalettePreview(palette: PredefinedPalettes.modernBlue)
        }
        .padding()
    }
} 