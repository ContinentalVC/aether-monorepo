//
//  DynamicColorSchemeExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating dynamic color scheme support
//  with automatic adaptation to system appearance changes.
//

import SwiftUI

// MARK: - Dynamic Color Scheme Example

/// Main view demonstrating dynamic color scheme support
struct DynamicColorSchemeExample: View {
    @StateObject private var dynamicThemeManager = DynamicThemeManager()
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.accessibilityContrast) var accessibilityContrast
    @State private var showingColorPicker = false
    @State private var selectedColorKey: DynamicColorKey = .primary
    @State private var showingThemeEditor = false
    @State private var showingDebugInfo = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Current Appearance Info
                    appearanceInfoSection
                    
                    // Theme Selection
                    themeSelectionSection
                    
                    // Dynamic Color Preview
                    dynamicColorPreviewSection
                    
                    // Color Palette
                    colorPaletteSection
                    
                    // Live Preview
                    livePreviewSection
                    
                    // Controls
                    controlsSection
                    
                    // Debug Information
                    if showingDebugInfo {
                        debugInfoSection
                    }
                }
                .padding()
            }
            .background(dynamicThemeManager.color(for: .background))
            .navigationTitle("Dynamic Color Scheme")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Debug") {
                        showingDebugInfo.toggle()
                    }
                }
            }
        }
        .environmentObject(dynamicThemeManager)
        .sheet(isPresented: $showingColorPicker) {
            DynamicColorPickerView(
                colorKey: selectedColorKey,
                themeManager: dynamicThemeManager
            )
        }
        .sheet(isPresented: $showingThemeEditor) {
            DynamicThemeEditorView(themeManager: dynamicThemeManager)
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(spacing: 16) {
            Text("Dynamic Color Scheme")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            Text("Experience automatic adaptation to system appearance changes including light, dark, and high contrast modes.")
                .font(.body)
                .foregroundColor(dynamicThemeManager.color(for: .textSecondary))
                .multilineTextAlignment(.center)
            
            // Current theme indicator
            HStack {
                Circle()
                    .fill(dynamicThemeManager.color(for: .primary))
                    .frame(width: 20, height: 20)
                
                Text("Current: \(dynamicThemeManager.currentTheme.name)")
                    .font(.headline)
                    .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                
                Spacer()
                
                Text("v\(dynamicThemeManager.currentTheme.version)")
                    .font(.caption)
                    .foregroundColor(dynamicThemeManager.color(for: .textSecondary))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(dynamicThemeManager.color(for: .surface))
                    .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 4, x: 0, y: 2)
            )
        }
    }
    
    // MARK: - Appearance Info Section
    
    private var appearanceInfoSection: some View {
        VStack(spacing: 16) {
            Text("Current Appearance")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            HStack(spacing: 20) {
                // Color Scheme
                VStack(spacing: 8) {
                    Image(systemName: colorScheme == .dark ? "moon.fill" : "sun.max.fill")
                        .font(.title2)
                        .foregroundColor(dynamicThemeManager.color(for: .primary))
                    
                    Text(colorScheme == .dark ? "Dark Mode" : "Light Mode")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                }
                
                // High Contrast
                VStack(spacing: 8) {
                    Image(systemName: accessibilityContrast == .high ? "circle.hexagongrid.fill" : "circle.hexagongrid")
                        .font(.title2)
                        .foregroundColor(dynamicThemeManager.color(for: .secondary))
                    
                    Text(accessibilityContrast == .high ? "High Contrast" : "Standard")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                }
                
                // Dynamic Colors
                VStack(spacing: 8) {
                    Image(systemName: "paintbrush.fill")
                        .font(.title2)
                        .foregroundColor(dynamicThemeManager.color(for: .accent))
                    
                    Text("Dynamic")
                        .font(.caption)
                        .fontWeight(.medium)
                        .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Theme Selection Section
    
    private var themeSelectionSection: some View {
        VStack(spacing: 16) {
            Text("Available Themes")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                ForEach(dynamicThemeManager.availableThemes) { theme in
                    DynamicThemeCard(
                        theme: theme,
                        isSelected: dynamicThemeManager.currentTheme.id == theme.id,
                        themeManager: dynamicThemeManager
                    ) {
                        dynamicThemeManager.setTheme(theme)
                    }
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Dynamic Color Preview Section
    
    private var dynamicColorPreviewSection: some View {
        VStack(spacing: 16) {
            Text("Dynamic Color Preview")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            VStack(spacing: 12) {
                ForEach(DynamicColorKey.allCases, id: \.self) { colorKey in
                    DynamicColorPreviewRow(
                        colorKey: colorKey,
                        themeManager: dynamicThemeManager,
                        onTap: {
                            selectedColorKey = colorKey
                            showingColorPicker = true
                        }
                    )
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Color Palette Section
    
    private var colorPaletteSection: some View {
        VStack(spacing: 16) {
            Text("Color Palette")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 12) {
                ForEach(DynamicColorKey.allCases, id: \.self) { colorKey in
                    DynamicColorSwatch(
                        colorKey: colorKey,
                        themeManager: dynamicThemeManager
                    )
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Live Preview Section
    
    private var livePreviewSection: some View {
        VStack(spacing: 16) {
            Text("Live Preview")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            VStack(spacing: 16) {
                // Sample Card
                VStack(spacing: 12) {
                    HStack {
                        Circle()
                            .fill(dynamicThemeManager.color(for: .primary))
                            .frame(width: 40, height: 40)
                        
                        VStack(alignment: .leading) {
                            Text("Sample Card")
                                .font(.headline)
                                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
                            
                            Text("This card adapts to your system appearance")
                                .font(.caption)
                                .foregroundColor(dynamicThemeManager.color(for: .textSecondary))
                        }
                        
                        Spacer()
                        
                        Button("Action") {
                            // Demo action
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(dynamicThemeManager.color(for: .primary))
                    }
                    
                    Divider()
                        .background(dynamicThemeManager.color(for: .border))
                    
                    HStack {
                        Label("Success", systemImage: "checkmark.circle.fill")
                            .foregroundColor(dynamicThemeManager.color(for: .success))
                        
                        Spacer()
                        
                        Label("Warning", systemImage: "exclamationmark.triangle.fill")
                            .foregroundColor(dynamicThemeManager.color(for: .warning))
                        
                        Spacer()
                        
                        Label("Error", systemImage: "xmark.circle.fill")
                            .foregroundColor(dynamicThemeManager.color(for: .error))
                    }
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(dynamicThemeManager.color(for: .surface))
                        .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 4, x: 0, y: 2)
                )
                
                // Status Indicators
                HStack(spacing: 16) {
                    StatusIndicator(
                        title: "Primary",
                        color: dynamicThemeManager.color(for: .primary)
                    )
                    
                    StatusIndicator(
                        title: "Secondary",
                        color: dynamicThemeManager.color(for: .secondary)
                    )
                    
                    StatusIndicator(
                        title: "Accent",
                        color: dynamicThemeManager.color(for: .accent)
                    )
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Controls Section
    
    private var controlsSection: some View {
        VStack(spacing: 16) {
            Text("Controls")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            HStack(spacing: 16) {
                Button("Edit Theme") {
                    showingThemeEditor = true
                }
                .buttonStyle(.borderedProminent)
                .tint(dynamicThemeManager.color(for: .primary))
                
                Button("Export Theme") {
                    exportCurrentTheme()
                }
                .buttonStyle(.bordered)
                .foregroundColor(dynamicThemeManager.color(for: .primary))
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Debug Info Section
    
    private var debugInfoSection: some View {
        VStack(spacing: 16) {
            Text("Debug Information")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(dynamicThemeManager.color(for: .textPrimary))
            
            VStack(alignment: .leading, spacing: 8) {
                DebugInfoRow(
                    label: "Current Theme",
                    value: dynamicThemeManager.currentTheme.name,
                    themeManager: dynamicThemeManager
                )
                
                DebugInfoRow(
                    label: "Color Scheme",
                    value: colorScheme == .dark ? "Dark" : "Light",
                    themeManager: dynamicThemeManager
                )
                
                DebugInfoRow(
                    label: "High Contrast",
                    value: accessibilityContrast == .high ? "Enabled" : "Disabled",
                    themeManager: dynamicThemeManager
                )
                
                DebugInfoRow(
                    label: "Theme Version",
                    value: dynamicThemeManager.currentTheme.version,
                    themeManager: dynamicThemeManager
                )
                
                DebugInfoRow(
                    label: "Available Themes",
                    value: "\(dynamicThemeManager.availableThemes.count)",
                    themeManager: dynamicThemeManager
                )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(dynamicThemeManager.color(for: .surface))
                .shadow(color: dynamicThemeManager.color(for: .shadow).opacity(0.1), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Helper Methods
    
    private func exportCurrentTheme() {
        if let jsonString = dynamicThemeManager.exportTheme(dynamicThemeManager.currentTheme) {
            // In a real app, you would share this JSON
            print("Exported theme JSON: \(jsonString)")
        }
    }
}

// MARK: - Supporting Views

/// Card for displaying theme information
struct DynamicThemeCard: View {
    let theme: DynamicTheme
    let isSelected: Bool
    let themeManager: DynamicThemeManager
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 12) {
                // Theme preview
                HStack(spacing: 8) {
                    ForEach([theme.primaryColor, theme.secondaryColor, theme.accentColor], id: \.light) { color in
                        Circle()
                            .fill(color.color(for: .light))
                            .frame(width: 20, height: 20)
                    }
                }
                
                VStack(spacing: 4) {
                    Text(theme.name)
                        .font(.headline)
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.color(for: .textPrimary))
                    
                    if let description = theme.description {
                        Text(description)
                            .font(.caption)
                            .foregroundColor(themeManager.color(for: .textSecondary))
                            .multilineTextAlignment(.center)
                    }
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? themeManager.color(for: .primary).opacity(0.1) : themeManager.color(for: .surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(isSelected ? themeManager.color(for: .primary) : themeManager.color(for: .border), lineWidth: 2)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

/// Row for displaying dynamic color information
struct DynamicColorPreviewRow: View {
    let colorKey: DynamicColorKey
    let themeManager: DynamicThemeManager
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack {
                Circle()
                    .fill(themeManager.color(for: colorKey))
                    .frame(width: 24, height: 24)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(colorKey.displayName)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(themeManager.color(for: .textPrimary))
                    
                    Text(themeManager.dynamicColor(for: colorKey).accessibilityDescription)
                        .font(.caption)
                        .foregroundColor(themeManager.color(for: .textSecondary))
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(themeManager.color(for: .textSecondary))
            }
            .padding(.vertical, 8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

/// Color swatch for palette display
struct DynamicColorSwatch: View {
    let colorKey: DynamicColorKey
    let themeManager: DynamicThemeManager
    
    var body: some View {
        VStack(spacing: 4) {
            Circle()
                .fill(themeManager.color(for: colorKey))
                .frame(width: 40, height: 40)
                .overlay(
                    Circle()
                        .stroke(themeManager.color(for: .border), lineWidth: 1)
                )
            
            Text(colorKey.displayName)
                .font(.caption2)
                .fontWeight(.medium)
                .foregroundColor(themeManager.color(for: .textPrimary))
        }
    }
}

/// Status indicator for live preview
struct StatusIndicator: View {
    let title: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Circle()
                .fill(color)
                .frame(width: 16, height: 16)
            
            Text(title)
                .font(.caption2)
                .fontWeight(.medium)
        }
    }
}

/// Debug information row
struct DebugInfoRow: View {
    let label: String
    let value: String
    let themeManager: DynamicThemeManager
    
    var body: some View {
        HStack {
            Text(label)
                .font(.caption)
                .foregroundColor(themeManager.color(for: .textSecondary))
            
            Spacer()
            
            Text(value)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(themeManager.color(for: .textPrimary))
        }
    }
}

// MARK: - Preview

struct DynamicColorSchemeExample_Previews: PreviewProvider {
    static var previews: some View {
        DynamicColorSchemeExample()
    }
} 