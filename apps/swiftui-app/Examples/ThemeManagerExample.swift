//
//  ThemeManagerExample.swift
//  Aether SwiftUI App
//
//  Example view demonstrating ThemeManager usage with AetherGlassCard
//  and theme switching functionality.
//

import SwiftUI

/// Example view demonstrating ThemeManager usage with AetherGlassCard
/// 
/// This view shows how to:
/// - Use ThemeManager with @StateObject
/// - Switch between different themes
/// - Apply themes to AetherGlassCard components
/// - Persist theme preferences
/// - Create dynamic theme-aware UI
struct ThemeManagerExample: View {
    @StateObject private var themeManager = ThemeManager()
    @State private var selectedThemeIndex = 0
    
    private let availableThemes = ThemeManager.availableThemes()
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Theme Selector Section
                    themeSelectorSection
                    
                    // Glass Card Examples Section
                    glassCardExamplesSection
                    
                    // Theme Information Section
                    themeInformationSection
                    
                    // Color Palette Section
                    colorPaletteSection
                }
                .padding()
            }
            .navigationTitle("Theme Manager Demo")
            .navigationBarTitleDisplayMode(.large)
            .background(themeManager.currentTheme.background)
            .environmentObject(themeManager)
        }
    }
    
    /// Theme selector section with picker and controls
    private var themeSelectorSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Theme Selection")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 12) {
                // Theme Picker
                Picker("Select Theme", selection: $selectedThemeIndex) {
                    ForEach(0..<availableThemes.count, id: \.self) { index in
                        Text(availableThemes[index].capitalized)
                            .tag(index)
                    }
                }
                .pickerStyle(MenuPickerStyle())
                .onChange(of: selectedThemeIndex) { newValue in
                    let themeName = availableThemes[newValue]
                    themeManager.switchTheme(to: themeName)
                }
                
                // Dark Mode Toggle
                HStack {
                    Text("Dark Mode")
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { themeManager.isDarkMode },
                        set: { _ in themeManager.toggleDarkMode() }
                    ))
                    .toggleStyle(SwitchToggleStyle(tint: themeManager.currentTheme.primary))
                }
                
                // Quick Theme Buttons
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 8) {
                    ForEach(availableThemes, id: \.self) { themeName in
                        Button(themeName.capitalized) {
                            themeManager.switchTheme(to: themeName)
                            selectedThemeIndex = availableThemes.firstIndex(of: themeName) ?? 0
                        }
                        .buttonStyle(ThemeButtonStyle(
                            isSelected: themeManager.currentThemeName == themeName,
                            theme: themeManager.currentTheme
                        ))
                    }
                }
            }
            .padding()
            .background(themeManager.currentTheme.surface)
            .cornerRadius(12)
        }
    }
    
    /// Glass card examples section
    private var glassCardExamplesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Glass Card Examples")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 16) {
                // Main example card
                AetherGlassCard {
                    VStack(spacing: 12) {
                        Image(systemName: "paintbrush.fill")
                            .font(.title)
                            .foregroundColor(themeManager.currentTheme.primary)
                        
                        Text("Theme-Aware Glass Card")
                            .font(.headline)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        Text("This card automatically adapts to the selected theme")
                            .font(.caption)
                            .foregroundColor(themeManager.currentTheme.textSecondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding(24)
                }
                .frame(maxWidth: .infinity)
                
                // Compact cards row
                HStack(spacing: 12) {
                    AetherGlassCard {
                        VStack(spacing: 8) {
                            Image(systemName: "star.fill")
                                .font(.title2)
                                .foregroundColor(themeManager.currentTheme.secondary)
                            
                            Text("Feature")
                                .font(.caption)
                                .foregroundColor(themeManager.currentTheme.textPrimary)
                        }
                        .padding(16)
                    }
                    .frame(maxWidth: .infinity)
                    
                    AetherGlassCard {
                        VStack(spacing: 8) {
                            Image(systemName: "heart.fill")
                                .font(.title2)
                                .foregroundColor(themeManager.currentTheme.success)
                            
                            Text("Favorites")
                                .font(.caption)
                                .foregroundColor(themeManager.currentTheme.textPrimary)
                        }
                        .padding(16)
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
    }
    
    /// Theme information section
    private var themeInformationSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Current Theme")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            AetherGlassCard {
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Theme Name:")
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        Spacer()
                        Text(themeManager.currentThemeName.capitalized)
                            .foregroundColor(themeManager.currentTheme.primary)
                            .fontWeight(.semibold)
                    }
                    
                    HStack {
                        Text("Dark Mode:")
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        Spacer()
                        Text(themeManager.isDarkMode ? "Enabled" : "Disabled")
                            .foregroundColor(themeManager.isDarkMode ? themeManager.currentTheme.warning : themeManager.currentTheme.success)
                            .fontWeight(.semibold)
                    }
                    
                    HStack {
                        Text("Background:")
                            .fontWeight(.medium)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        Spacer()
                        Circle()
                            .fill(themeManager.currentTheme.background)
                            .frame(width: 20, height: 20)
                            .overlay(
                                Circle()
                                    .stroke(themeManager.currentTheme.border, lineWidth: 1)
                            )
                    }
                }
                .padding(20)
            }
        }
    }
    
    /// Color palette section
    private var colorPaletteSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Palette")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            AetherGlassCard {
                VStack(spacing: 16) {
                    // Primary colors
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Primary Colors")
                            .font(.headline)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        HStack(spacing: 12) {
                            ColorSwatch(color: themeManager.currentTheme.primary, label: "Primary")
                            ColorSwatch(color: themeManager.currentTheme.primaryLight, label: "Light")
                            ColorSwatch(color: themeManager.currentTheme.primaryDark, label: "Dark")
                        }
                    }
                    
                    // Secondary colors
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Secondary Colors")
                            .font(.headline)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        HStack(spacing: 12) {
                            ColorSwatch(color: themeManager.currentTheme.secondary, label: "Secondary")
                            ColorSwatch(color: themeManager.currentTheme.secondaryLight, label: "Light")
                            ColorSwatch(color: themeManager.currentTheme.secondaryDark, label: "Dark")
                        }
                    }
                    
                    // Accent colors
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Accent Colors")
                            .font(.headline)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        HStack(spacing: 12) {
                            ColorSwatch(color: themeManager.currentTheme.success, label: "Success")
                            ColorSwatch(color: themeManager.currentTheme.warning, label: "Warning")
                            ColorSwatch(color: themeManager.currentTheme.error, label: "Error")
                            ColorSwatch(color: themeManager.currentTheme.info, label: "Info")
                        }
                    }
                }
                .padding(20)
            }
        }
    }
}

// MARK: - Supporting Views

/// Custom button style for theme selection
struct ThemeButtonStyle: ButtonStyle {
    let isSelected: Bool
    let theme: Theme
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.caption)
            .fontWeight(.medium)
            .foregroundColor(isSelected ? theme.surface : theme.textPrimary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? theme.primary : theme.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(theme.border, lineWidth: 1)
                    )
            )
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

/// Color swatch component for displaying theme colors
struct ColorSwatch: View {
    let color: Color
    let label: String
    
    var body: some View {
        VStack(spacing: 4) {
            RoundedRectangle(cornerRadius: 8)
                .fill(color)
                .frame(width: 40, height: 40)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            
            Text(label)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - Preview

struct ThemeManagerExample_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ThemeManagerExample()
                .preferredColorScheme(.light)
                .previewDisplayName("Light Mode")
            
            ThemeManagerExample()
                .preferredColorScheme(.dark)
                .previewDisplayName("Dark Mode")
        }
    }
} 