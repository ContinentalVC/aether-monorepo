//
//  ThemeTransitionExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating dynamic theme transitions with smooth animations.
//  This view showcases various transition types, animation curves, and system integration.
//

import SwiftUI

// MARK: - Theme Transition Example View

/// Main view demonstrating theme transitions with animations
struct ThemeTransitionExample: View {
    @StateObject private var themeManager = ThemeManager()
    @StateObject private var transitionManager: ThemeTransitionManager
    @State private var selectedTransitionType: ThemeTransitionType = .fade
    @State private var selectedAnimationCurve: ThemeAnimationCurve = .easeInOut
    @State private var selectedDirection: Edge = .trailing
    @State private var showingTransitionPreview = false
    @State private var showingDebugInfo = false
    
    init() {
        let manager = ThemeManager()
        self._themeManager = StateObject(wrappedValue: manager)
        self._transitionManager = StateObject(wrappedValue: ThemeTransitionManager(themeManager: manager))
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Transition Controls
                    transitionControlsSection
                    
                    // Theme Selection
                    themeSelectionSection
                    
                    // Live Preview
                    livePreviewSection
                    
                    // Transition Demo
                    transitionDemoSection
                    
                    // Debug Information
                    if showingDebugInfo {
                        debugInfoSection
                    }
                }
                .padding()
            }
            .background(Color(themeManager.currentTheme.background))
            .navigationTitle("Theme Transitions")
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
        .environmentObject(transitionManager)
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(spacing: 16) {
            Text("Dynamic Theme Transitions")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            Text("Experience smooth, animated theme switching with various transition effects and animation curves.")
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
    
    // MARK: - Transition Controls Section
    
    private var transitionControlsSection: some View {
        VStack(spacing: 20) {
            Text("Transition Controls")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            // Transition Type Selection
            VStack(alignment: .leading, spacing: 12) {
                Text("Transition Type")
                    .font(.headline)
                    .foregroundColor(Color(themeManager.currentTheme.textPrimary))
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                    ForEach(ThemeTransitionType.allCases, id: \.self) { type in
                        TransitionTypeButton(
                            type: type,
                            isSelected: selectedTransitionType == type,
                            theme: themeManager.currentTheme
                        ) {
                            selectedTransitionType = type
                        }
                    }
                }
            }
            
            // Animation Curve Selection
            VStack(alignment: .leading, spacing: 12) {
                Text("Animation Curve")
                    .font(.headline)
                    .foregroundColor(Color(themeManager.currentTheme.textPrimary))
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                    ForEach(ThemeAnimationCurve.allCases, id: \.self) { curve in
                        AnimationCurveButton(
                            curve: curve,
                            isSelected: selectedAnimationCurve == curve,
                            theme: themeManager.currentTheme
                        ) {
                            selectedAnimationCurve = curve
                        }
                    }
                }
            }
            
            // Direction Selection (for slide transitions)
            if selectedTransitionType == .slide {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Slide Direction")
                        .font(.headline)
                        .foregroundColor(Color(themeManager.currentTheme.textPrimary))
                    
                    HStack(spacing: 12) {
                        DirectionButton(
                            direction: .leading,
                            isSelected: selectedDirection == .leading,
                            theme: themeManager.currentTheme
                        ) {
                            selectedDirection = .leading
                        }
                        
                        DirectionButton(
                            direction: .trailing,
                            isSelected: selectedDirection == .trailing,
                            theme: themeManager.currentTheme
                        ) {
                            selectedDirection = .trailing
                        }
                        
                        DirectionButton(
                            direction: .top,
                            isSelected: selectedDirection == .top,
                            theme: themeManager.currentTheme
                        ) {
                            selectedDirection = .top
                        }
                        
                        DirectionButton(
                            direction: .bottom,
                            isSelected: selectedDirection == .bottom,
                            theme: themeManager.currentTheme
                        ) {
                            selectedDirection = .bottom
                        }
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
    
    // MARK: - Theme Selection Section
    
    private var themeSelectionSection: some View {
        VStack(spacing: 16) {
            Text("Available Themes")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                ThemeButton(
                    name: "Light",
                    isSelected: themeManager.currentThemeName == "light",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.light,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
                }
                
                ThemeButton(
                    name: "Dark",
                    isSelected: themeManager.currentThemeName == "dark",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.dark,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
                }
                
                ThemeButton(
                    name: "Purple",
                    isSelected: themeManager.currentThemeName == "purple",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.purple,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
                }
                
                ThemeButton(
                    name: "Green",
                    isSelected: themeManager.currentThemeName == "green",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.green,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
                }
                
                ThemeButton(
                    name: "Sunset",
                    isSelected: themeManager.currentThemeName == "sunset",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.sunset,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
                }
                
                ThemeButton(
                    name: "Ocean",
                    isSelected: themeManager.currentThemeName == "ocean",
                    theme: themeManager.currentTheme
                ) {
                    transitionManager.transitionToTheme(
                        PredefinedThemes.ocean,
                        type: selectedTransitionType,
                        curve: selectedAnimationCurve,
                        direction: selectedDirection
                    )
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
            Text("Live Preview")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(Color(themeManager.currentTheme.textPrimary))
            
            // Preview card with current theme
            VStack(spacing: 12) {
                HStack {
                    Circle()
                        .fill(Color(themeManager.currentTheme.primary))
                        .frame(width: 40, height: 40)
                    
                    VStack(alignment: .leading) {
                        Text("Preview Card")
                            .font(.headline)
                            .foregroundColor(Color(themeManager.currentTheme.textPrimary))
                        
                        Text("This card shows the current theme colors")
                            .font(.caption)
                            .foregroundColor(Color(themeManager.currentTheme.textSecondary))
                    }
                    
                    Spacer()
                    
                    Button("Action") {
                        // Demo action
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Color(themeManager.currentTheme.primary))
                }
                
                Divider()
                    .background(Color(themeManager.currentTheme.border))
                
                HStack {
                    Label("Primary", systemImage: "circle.fill")
                        .foregroundColor(Color(themeManager.currentTheme.primary))
                    
                    Spacer()
                    
                    Label("Secondary", systemImage: "circle.fill")
                        .foregroundColor(Color(themeManager.currentTheme.secondary))
                    
                    Spacer()
                    
                    Label("Success", systemImage: "checkmark.circle.fill")
                        .foregroundColor(Color(themeManager.currentTheme.success))
                }
                .font(.caption)
            }
            .padding()
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(themeManager.currentTheme.surface))
                    .shadow(color: Color(themeManager.currentTheme.shadow), radius: 4, x: 0, y: 2)
            )
            .themeTransition(selectedTransitionType, progress: transitionManager.transitionState.transitionProgress)
        }
        .padding()
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(themeManager.currentTheme.surface))
                .shadow(color: Color(themeManager.currentTheme.shadow), radius: 8, x: 0, y: 4)
        )
    }
    
    // MARK: - Transition Demo Section
    
    private var transitionDemoSection: some View {
        VStack(spacing: 16) {
            Text("Transition Demo")
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
                
                Button("Sequence Demo") {
                    performSequenceDemo()
                }
                .buttonStyle(.bordered)
                .foregroundColor(Color(themeManager.currentTheme.primary))
            }
            
            // Transition status
            if transitionManager.transitionState.isTransitioning {
                VStack(spacing: 8) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                        .scaleEffect(0.8)
                    
                    Text("Transitioning...")
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
                    label: "Animation Curve",
                    value: selectedAnimationCurve.rawValue,
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Is Transitioning",
                    value: transitionManager.transitionState.isTransitioning ? "Yes" : "No",
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Progress",
                    value: String(format: "%.2f", transitionManager.transitionState.transitionProgress),
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Reduce Motion",
                    value: transitionManager.transitionState.shouldReduceMotion ? "Enabled" : "Disabled",
                    theme: themeManager.currentTheme
                )
                
                DebugInfoRow(
                    label: "Reduce Transparency",
                    value: transitionManager.transitionState.shouldReduceTransparency ? "Enabled" : "Disabled",
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
    
    // MARK: - Demo Methods
    
    private func performQuickDemo() {
        let themes = [PredefinedThemes.light, PredefinedThemes.dark, PredefinedThemes.purple]
        let types = [ThemeTransitionType.fade, ThemeTransitionType.slide, ThemeTransitionType.scale]
        
        for (index, theme) in themes.enumerated() {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 1.5) {
                transitionManager.transitionToTheme(
                    theme,
                    type: types[index % types.count],
                    curve: .spring,
                    direction: .trailing
                )
            }
        }
    }
    
    private func performSequenceDemo() {
        let sequence: [(Theme, ThemeTransitionType, ThemeAnimationCurve)] = [
            (PredefinedThemes.light, .fade, .easeInOut),
            (PredefinedThemes.dark, .slide, .spring),
            (PredefinedThemes.purple, .scale, .bouncy),
            (PredefinedThemes.green, .morph, .smooth),
            (PredefinedThemes.sunset, .crossfade, .easeIn),
            (PredefinedThemes.ocean, .dissolve, .easeOut)
        ]
        
        for (index, (theme, type, curve)) in sequence.enumerated() {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(index) * 2.0) {
                transitionManager.transitionToTheme(
                    theme,
                    type: type,
                    curve: curve,
                    direction: .trailing
                )
            }
        }
    }
}

// MARK: - Supporting Views

/// Button for selecting transition types
struct TransitionTypeButton: View {
    let type: ThemeTransitionType
    let isSelected: Bool
    let theme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: iconName)
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : Color(theme.primary))
                
                Text(type.rawValue)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(isSelected ? .white : Color(theme.textPrimary))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? Color(theme.primary) : Color(theme.surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(theme.border), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var iconName: String {
        switch type {
        case .fade: return "eye"
        case .slide: return "arrow.right"
        case .scale: return "arrow.up.left.and.arrow.down.right"
        case .morph: return "sparkles"
        case .crossfade: return "camera.filters"
        case .dissolve: return "drop"
        }
    }
}

/// Button for selecting animation curves
struct AnimationCurveButton: View {
    let curve: ThemeAnimationCurve
    let isSelected: Bool
    let theme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: iconName)
                    .font(.title2)
                    .foregroundColor(isSelected ? .white : Color(theme.primary))
                
                Text(curve.rawValue)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(isSelected ? .white : Color(theme.textPrimary))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? Color(theme.primary) : Color(theme.surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color(theme.border), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var iconName: String {
        switch curve {
        case .easeInOut: return "arrow.left.and.right"
        case .easeIn: return "arrow.right"
        case .easeOut: return "arrow.left"
        case .spring: return "spring"
        case .bouncy: return "bounce"
        case .smooth: return "waveform.path"
        }
    }
}

/// Button for selecting slide directions
struct DirectionButton: View {
    let direction: Edge
    let isSelected: Bool
    let theme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: iconName)
                .font(.title3)
                .foregroundColor(isSelected ? .white : Color(theme.primary))
                .frame(width: 44, height: 44)
                .background(
                    Circle()
                        .fill(isSelected ? Color(theme.primary) : Color(theme.surface))
                        .overlay(
                            Circle()
                                .stroke(Color(theme.border), lineWidth: 1)
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var iconName: String {
        switch direction {
        case .leading: return "arrow.left"
        case .trailing: return "arrow.right"
        case .top: return "arrow.up"
        case .bottom: return "arrow.down"
        }
    }
}

/// Button for theme selection
struct ThemeButton: View {
    let name: String
    let isSelected: Bool
    let theme: Theme
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Circle()
                    .fill(themeColor)
                    .frame(width: 40, height: 40)
                    .overlay(
                        Circle()
                            .stroke(Color(theme.border), lineWidth: 2)
                    )
                
                Text(name)
                    .font(.headline)
                    .fontWeight(.medium)
                    .foregroundColor(Color(theme.textPrimary))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color(theme.primary).opacity(0.1) : Color(theme.surface))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(isSelected ? Color(theme.primary) : Color(theme.border), lineWidth: 2)
                    )
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var themeColor: Color {
        switch name {
        case "Light": return .blue
        case "Dark": return .gray
        case "Purple": return .purple
        case "Green": return .green
        case "Sunset": return .orange
        case "Ocean": return .cyan
        default: return .blue
        }
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

struct ThemeTransitionExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeTransitionExample()
    }
} 