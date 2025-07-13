//
//  ThemeCustomizationExample.swift
//  Aether SwiftUI App
//
//  Example usage of the enhanced theming system with guided creativity interface.
//  This demonstrates how to integrate typography controls and accessibility features.
//

import SwiftUI

// MARK: - Theme Customization Example

/// Example view demonstrating the enhanced theming system
struct ThemeCustomizationExample: View {
    @StateObject private var themeManager = ThemeManager()
    @State private var showingCustomization = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Header with current theme info
                ThemeInfoHeader()
                
                // Typography preview
                TypographyPreviewCard()
                
                // Accessibility status
                AccessibilityStatusCard()
                
                // Theme controls
                ThemeControlsSection()
                
                // Sample UI components
                SampleUIComponents()
                
                Spacer()
                
                // Customization button
                Button(action: {
                    showingCustomization = true
                }) {
                    HStack {
                        Image(systemName: "paintbrush.fill")
                        Text("Customize Theme")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(themeManager.currentTheme.primary)
                    .cornerRadius(12)
                }
                .padding(.horizontal)
            }
            .padding()
            .background(themeManager.currentTheme.background)
            .navigationTitle("Theme Example")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingCustomization) {
                ThemeCustomizationView()
                    .environmentObject(themeManager)
            }
        }
        .environmentObject(themeManager)
    }
}

// MARK: - Theme Info Header

struct ThemeInfoHeader: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 12) {
            Text("Current Theme")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text(themeManager.currentThemeName.capitalized)
                .font(themeManager.currentTheme.typography.body())
                .foregroundColor(themeManager.currentTheme.textSecondary)
            
            // Color palette preview
            HStack(spacing: 8) {
                ForEach([
                    themeManager.currentTheme.primary,
                    themeManager.currentTheme.secondary,
                    themeManager.currentTheme.background,
                    themeManager.currentTheme.surface
                ], id: \.self) { color in
                    Circle()
                        .fill(color)
                        .frame(width: 24, height: 24)
                        .overlay(
                            Circle()
                                .stroke(themeManager.currentTheme.border, lineWidth: 1)
                        )
                }
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
    }
}

// MARK: - Typography Preview Card

struct TypographyPreviewCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Typography Preview")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(alignment: .leading, spacing: 8) {
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
            
            // Font info
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Primary Font")
                        .font(.caption)
                        .foregroundColor(themeManager.currentTheme.textTertiary)
                    Text(themeManager.currentTheme.typography.primaryFont.description)
                        .font(.caption)
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Secondary Font")
                        .font(.caption)
                        .foregroundColor(themeManager.currentTheme.textTertiary)
                    Text(themeManager.currentTheme.typography.secondaryFont.description)
                        .font(.caption)
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
    }
}

// MARK: - Accessibility Status Card

struct AccessibilityStatusCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Accessibility Status")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 12) {
                AccessibilityStatusRow(
                    title: "High Contrast",
                    isEnabled: themeManager.currentAccessibility.useHighContrast,
                    icon: "eye.fill"
                )
                
                AccessibilityStatusRow(
                    title: "Reduce Motion",
                    isEnabled: themeManager.currentAccessibility.reduceMotion,
                    icon: "hand.raised.fill"
                )
                
                AccessibilityStatusRow(
                    title: "Large Text",
                    isEnabled: themeManager.currentAccessibility.useLargeText,
                    icon: "textformat.size"
                )
                
                HStack {
                    Image(systemName: "paintbrush.fill")
                        .foregroundColor(themeManager.currentTheme.primary)
                        .frame(width: 20)
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Color Blindness Support")
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        Text(colorBlindnessDescription)
                            .font(.caption)
                            .foregroundColor(themeManager.currentTheme.textSecondary)
                    }
                    
                    Spacer()
                }
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
    }
    
    private var colorBlindnessDescription: String {
        switch themeManager.currentAccessibility.colorBlindnessSupport {
        case .none:
            return "Standard colors"
        case .deuteranopia:
            return "Red-green color blindness support"
        case .protanopia:
            return "Red-green color blindness support"
        case .tritanopia:
            return "Blue-yellow color blindness support"
        }
    }
}

struct AccessibilityStatusRow: View {
    let title: String
    let isEnabled: Bool
    let icon: String
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(themeManager.currentTheme.primary)
                .frame(width: 20)
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Spacer()
            
            Image(systemName: isEnabled ? "checkmark.circle.fill" : "circle")
                .foregroundColor(isEnabled ? themeManager.currentTheme.success : themeManager.currentTheme.textTertiary)
                .font(.title3)
        }
    }
}

// MARK: - Theme Controls Section

struct ThemeControlsSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Quick Controls")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ThemeControlButton(
                    title: "Light",
                    icon: "sun.max.fill",
                    isActive: themeManager.currentThemeName == "light",
                    action: { themeManager.switchTheme(to: "light") }
                )
                
                ThemeControlButton(
                    title: "Dark",
                    icon: "moon.fill",
                    isActive: themeManager.currentThemeName == "dark",
                    action: { themeManager.switchTheme(to: "dark") }
                )
                
                ThemeControlButton(
                    title: "Purple",
                    icon: "paintbrush.fill",
                    isActive: themeManager.currentThemeName == "purple",
                    action: { themeManager.switchTheme(to: "purple") }
                )
                
                ThemeControlButton(
                    title: "Green",
                    icon: "leaf.fill",
                    isActive: themeManager.currentThemeName == "green",
                    action: { themeManager.switchTheme(to: "green") }
                )
            }
            
            // Accessibility toggles
            VStack(spacing: 12) {
                AccessibilityToggle(
                    title: "High Contrast",
                    isOn: themeManager.currentAccessibility.useHighContrast,
                    action: { themeManager.toggleHighContrast() }
                )
                
                AccessibilityToggle(
                    title: "Reduce Motion",
                    isOn: themeManager.currentAccessibility.reduceMotion,
                    action: { themeManager.toggleReducedMotion() }
                )
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
    }
}

struct ThemeControlButton: View {
    let title: String
    let icon: String
    let isActive: Bool
    let action: () -> Void
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(isActive ? .white : themeManager.currentTheme.primary)
                
                Text(title)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(isActive ? .white : themeManager.currentTheme.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(isActive ? themeManager.currentTheme.primary : themeManager.currentTheme.backgroundSecondary)
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct AccessibilityToggle: View {
    let title: String
    let isOn: Bool
    let action: () -> Void
    
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        Button(action: action) {
            HStack {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Spacer()
                
                Image(systemName: isOn ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isOn ? themeManager.currentTheme.success : themeManager.currentTheme.textTertiary)
                    .font(.title3)
            }
            .padding()
            .background(themeManager.currentTheme.backgroundSecondary)
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Sample UI Components

struct SampleUIComponents: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sample UI Components")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 12) {
                // Sample card
                VStack(alignment: .leading, spacing: 12) {
                    Text("Sample Card")
                        .font(themeManager.currentTheme.typography.heading(size: .h4))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text("This is a sample card that demonstrates how your theme will look in practice.")
                        .font(themeManager.currentTheme.typography.body())
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                    
                    HStack(spacing: 12) {
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
                
                // Sample list item
                HStack {
                    Circle()
                        .fill(themeManager.currentTheme.primary)
                        .frame(width: 40, height: 40)
                        .overlay(
                            Image(systemName: "star.fill")
                                .foregroundColor(.white)
                        )
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Sample List Item")
                            .font(themeManager.currentTheme.typography.body())
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        Text("This demonstrates how list items look with your theme.")
                            .font(themeManager.currentTheme.typography.body(size: .sm))
                            .foregroundColor(themeManager.currentTheme.textSecondary)
                    }
                    
                    Spacer()
                    
                    Image(systemName: "chevron.right")
                        .foregroundColor(themeManager.currentTheme.textTertiary)
                }
                .padding()
                .background(themeManager.currentTheme.surface)
                .cornerRadius(12)
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow, radius: 4, x: 0, y: 2)
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

// MARK: - Preview

struct ThemeCustomizationExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeCustomizationExample()
    }
} 