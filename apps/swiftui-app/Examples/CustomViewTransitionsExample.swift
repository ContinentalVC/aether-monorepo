//
//  CustomViewTransitionsExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating sophisticated custom view transitions
//  with asymmetric animations, transition container views, and complex effects.
//

import SwiftUI

// MARK: - Custom View Transitions Example

/// Main view demonstrating sophisticated custom view transitions
struct CustomViewTransitionsExample: View {
    @StateObject private var themeManager = ThemeManager()
    @StateObject private var advancedTransitionManager = AdvancedTransitionManager()
    @State private var selectedTransitionType: CustomTransitionType = .slideInOut
    @State private var showingTransitionPreview = false
    @State private var showingDebugInfo = false
    @State private var currentThemeIndex = 0
    
    private let themes = [
        PredefinedThemes.light,
        PredefinedThemes.dark,
        PredefinedThemes.purple,
        PredefinedThemes.green,
        PredefinedThemes.sunset,
        PredefinedThemes.ocean
    ]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Transition Type Selection
                    transitionTypeSection
                    
                    // Live Preview with Container
                    livePreviewSection
                    
                    // Theme Selection
                    themeSelectionSection
                    
                    // Advanced Controls
                    advancedControlsSection
                    
                    // Debug Information
                    if showingDebugInfo {
                        debugInfoSection
                    }
                }
                .padding()
            }
            .background(Color(themeManager.currentTheme.background))
            .navigationTitle("Custom View Transitions")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Debug") {
                        showingDebugInfo.toggle()
                    }
                }
            }
        }
        .environmentObject(themeManager)
        .advancedTransitionManager(advancedTransitionManager)
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(spacing: 16) {
            Text("Sophisticated Custom Transitions")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            Text("Experience advanced asymmetric animations with transition container views that host both 'from' and 'to' states simultaneously for complex, overlapping effects.")
                .font(.body)
                .foregroundColor(Color(themeManager.currentTheme.textSecondary))
                .multilineTextAlignment(.center)
            
            // Current theme indicator
            HStack {
                Circle()
                    .fill(Color(themeManager.currentTheme.primary))
                    .frame(width: 20, height: 20)
                
                Text("Current: \(themeManager.currentThemeName)")
                    .font(.headline)
                    .foregroundColor(Color(themeManager.currentTheme.textPrimary))
                
                Spacer()
                
                Text("Duration: \(selectedTransitionType.duration, specifier: "%.1f")s")
                    .font(.caption)
                    .foregroundColor(Color(themeManager.currentTheme.textSecondary))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(themeManager.currentTheme.surface))
                    .shadow(color: Color(themeManager.currentTheme.shadow), radius: 4, x: 0, y: 2)
            )
        }
    }
    
    // MARK: - Transition Type Section
    
    private var transitionTypeSection: some View {
        VStack(spacing: 20) {
            Text("Custom Transition Types")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                ForEach(CustomTransitionType.allCases, id: \.self) { type in
                    CustomTransitionTypeButton(
                        type: type,
                        isSelected: selectedTransitionType == type,
                        theme: themeManager.currentTheme
                    ) {
                        selectedTransitionType = type
                    }
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Live Preview Section
    
    private var livePreviewSection: some View {
        VStack(spacing: 16) {
            Text("Live Preview with Container")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            // Transition container with both views
            if advancedTransitionManager.isTransitioning,
               let fromTheme = advancedTransitionManager.fromTheme,
               let toTheme = advancedTransitionManager.toTheme {
                
                // Container view hosting both states
                advancedTransitionManager.createTransitionContainer(
                    fromView: TransitionPreviewCard(
                        theme: fromTheme,
                        title: "From Theme",
                        subtitle: "Outgoing state"
                    ),
                    toView: TransitionPreviewCard(
                        theme: toTheme,
                        title: "To Theme",
                        subtitle: "Incoming state"
                    )
                )
                .frame(height: 200)
                
            } else {
                // Static preview
                TransitionPreviewCard(
                    theme: themeManager.currentTheme,
                    title: "Current Theme",
                    subtitle: "Static preview"
                )
                .frame(height: 200)
            }
            
            // Progress indicator
            if advancedTransitionManager.isTransitioning {
                VStack(spacing: 8) {
                    ProgressView(value: advancedTransitionManager.transitionProgress)
                        .progressViewStyle(LinearProgressViewStyle())
                        .tint(Color(themeManager.currentTheme.primary))
                    
                    Text("Progress: \(advancedTransitionManager.transitionProgress * 100, specifier: "%.0f")%")
                        .font(.caption)
                        .foregroundColor(Color(themeManager.currentTheme.textSecondary))
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Theme Selection Section
    
    private var themeSelectionSection: some View {
        VStack(spacing: 16) {
            Text("Available Themes")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 16) {
                ForEach(Array(themes.enumerated()), id: \.offset) { index, theme in
                    ThemeButton(
                        theme: theme,
                        themeName: getThemeName(for: theme),
                        isSelected: themeManager.currentThemeName == getThemeName(for: theme),
                        currentTheme: themeManager.currentTheme
                    ) {
                        performCustomTransition(to: theme, at: index)
                    }
                }
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Advanced Controls Section
    
    private var advancedControlsSection: some View {
        VStack(spacing: 16) {
            Text("Advanced Controls")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            // Demo buttons
            HStack(spacing: 16) {
                Button("Quick Demo") {
                    performQuickDemo()
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(themeManager.currentTheme.primary))
                .disabled(advancedTransitionManager.isTransitioning)
                
                Button("Sequence Demo") {
                    performSequenceDemo()
                }
                .buttonStyle(.bordered)
                .foregroundColor(Color(themeManager.currentTheme.primary))
                .disabled(advancedTransitionManager.isTransitioning)
            }
            
            // Transition status
            if advancedTransitionManager.isTransitioning {
                VStack(spacing: 8) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.8)
                    
                    Text("Performing \(selectedTransitionType.rawValue)...")
                        .font(.caption)
                        .foregroundColor(Color(themeManager.currentTheme.textSecondary))
                }
                .padding()
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(themeManager.currentTheme.surface))
                        .shadow(color: Color(themeManager.currentTheme.shadow), radius: 2, x: 0, y: 1)
                )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Debug Info Section
    
    private var debugInfoSection: some View {
        VStack(spacing: 16) {
            Text("Debug Information")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            VStack(alignment: .leading, spacing: 8) {
                DebugInfoRow(
                    label: "Transition Type",
                    value: selectedTransitionType.rawValue,
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Duration",
                    value: "\(selectedTransitionType.duration)s",
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Is Transitioning",
                    value: advancedTransitionManager.isTransitioning ? "Yes" : "No",
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Progress",
                    value: String(format: "%.2f", advancedTransitionManager.transitionProgress),
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "From Theme",
                    value: advancedTransitionManager.fromTheme != nil ? "Set" : "None",
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "To Theme",
                    value: advancedTransitionManager.toTheme != nil ? "Set" : "None",
                    theme: themeManager.currentTheme
                )
            }
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Helper Methods
    
    private func getThemeName(for theme: Theme) -> String {
        if theme.primary == PredefinedThemes.light.primary { return "Light" }
        if theme.primary == PredefinedThemes.dark.primary { return "Dark" }
        if theme.primary == PredefinedThemes.purple.primary { return "Purple" }
        if theme.primary == PredefinedThemes.green.primary { return "Green" }
        if theme.primary == PredefinedThemes.sunset.primary { return "Sunset" }
        if theme.primary == PredefinedThemes.ocean.primary { return "Ocean" }
        return "Custom"
    }
    
    private func performCustomTransition(to newTheme: Theme, at index: Int) {
        advancedTransitionManager.performCustomTransition(
            from: themeManager.currentTheme,
            to: newTheme,
            type: selectedTransitionType
        ) {
            // Apply theme change after transition completes
            themeManager.currentTheme = newTheme
            currentThemeIndex = index
        }
    }
    
    private func performQuickDemo() {
        let demoSequence: [(Theme, CustomTransitionType)] = [
            (PredefinedThemes.light, .slideInOut),
            (PredefinedThemes.dark, .scaleRotate),
            (PredefinedThemes.purple, .morphBlur),
            (PredefinedThemes.green, .crossfadeOverlap),
        ]
        
        for (index, (theme, type)) in demoSequence.enumerated() {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 2.0) {
                selectedTransitionType = type
                performCustomTransition(to: theme, at: index)
            }
        }
    }
    
    private func performSequenceDemo() {
        let sequence: [(Theme, CustomTransitionType)] = [
            (PredefinedThemes.light, .slideInOut),
            (PredefinedThemes.dark, .scaleRotate),
            (PredefinedThemes.purple, .morphBlur),
            (PredefinedThemes.green, .crossfadeOverlap),
            (PredefinedThemes.sunset, .dissolveParticle),
            (PredefinedThemes.ocean, .flipCard),
        ]
        
        for (index, (theme, type)) in sequence.enumerated() {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 2.5) {
                selectedTransitionType = type
                performCustomTransition(to: theme, at: index)
            }
        }
    }
}

// MARK: - Supporting Views

/// Button for selecting custom transition types
struct CustomTransitionTypeButton: View {
    let type: CustomTransitionType
    let isSelected: Bool
    let theme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                Image(systemName: iconName)
                    .font(.title)
                    .foregroundColor(isSelected ? .white : Color(theme.primary))
                
                VStack(spacing: 4) {
                    Text(type.rawValue)
                        .font(.headline)
                        .fontWeight(.medium)
                        .foregroundColor(isSelected ? .white : Color(theme.textPrimary))
                    
                    Text(type.description)
                        .font(.caption)
                        .foregroundColor(isSelected ? .white.opacity(0.8) : Color(theme.textSecondary))
                        .multilineTextAlignment(.center)
                    
                    Text("\(type.duration, specifier: "%.1f")s")
                        .font(.caption2)
                        .foregroundColor(isSelected ? .white.opacity(0.6) : Color(theme.textSecondary))
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color(theme.primary) : Color(theme.surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color(theme.border), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var iconName: String {
        switch type {
        case .slideInOut: return "arrow.left.and.right"
        case .scaleRotate: return "arrow.up.left.and.arrow.down.right"
        case .morphBlur: return "camera.filters"
        case .crossfadeOverlap: return "rectangle.stack"
        case .dissolveParticle: return "sparkles"
        case .flipCard: return "rectangle.portrait.rotate"
        }
    }
}

/// Button for theme selection
struct ThemeButton: View {
    let theme: Theme
    let themeName: String
    let isSelected: Bool
    let currentTheme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Circle()
                    .fill(Color(theme.primary))
                    .frame(width: 40, height: 40)
                    .overlay(
                        Circle()
                            .stroke(Color(currentTheme.border), lineWidth: 2)
                    )
                
                Text(themeName)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(Color(currentTheme.textPrimary))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? Color(currentTheme.primary).opacity(0.1) : Color(currentTheme.surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(isSelected ? Color(currentTheme.primary) : Color(currentTheme.border), lineWidth: 2)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
}

/// Debug information row
struct DebugInfoRow: View {
    let label: String
    let value: String
    let theme: Theme
    
    var body: some View {
        HStack {
            Text(label)
                .font(.caption)
                .foregroundColor(Color(theme.textSecondary))
            
            Spacer()
            
            Text(value)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(Color(theme.textPrimary))
        }
    }
}

// MARK: - Preview

struct CustomViewTransitionsExample_Previews: PreviewProvider {
    static var previews: some View {
        CustomViewTransitionsExample()
    }
} 