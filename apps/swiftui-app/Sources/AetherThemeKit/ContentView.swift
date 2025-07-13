//
//  ContentView.swift
//  Aether SwiftUI App
//
//  Main content view that serves as the entry point for the app.
//  Includes navigation to various theme and layout preview examples.
//

import SwiftUI

// MARK: - Content View

/// Main content view with navigation to different examples
struct ContentView: View {
    @StateObject private var themeManager = ThemeManager()
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Layout Preview Tab
            NavigationView {
                LayoutPreviewExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "eye")
                Text("Layout Preview")
            }
            .tag(0)
            
            // Theme Customization Tab
            NavigationView {
                ThemeCustomizationExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "paintbrush")
                Text("Theme")
            }
            .tag(1)
            
            // Iconography Tab
            NavigationView {
                IconographyExample()
                    .environmentObject(themeManager)
                    .environmentObject(IconographyManager())
            }
            .tabItem {
                Image(systemName: "star")
                Text("Icons")
            }
            .tag(2)
            
            // Color Palette Tab
            NavigationView {
                ColorPaletteExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "circle.hexagongrid")
                Text("Colors")
            }
            .tag(3)
            
            // Charts Tab
            NavigationView {
                ProgressLineChartExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "chart.line.uptrend.xyaxis")
                Text("Charts")
            }
            .tag(4)
            
            // Theme Data Model Tab
            NavigationView {
                ThemeDataModelExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "doc.text")
                Text("Data Model")
            }
            .tag(5)
            
            // Theme Schema Tab
            NavigationView {
                ThemeSchemaExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "doc.richtext")
                Text("Schema")
            }
            .tag(6)
            
            // Import/Export Tab
            NavigationView {
                ThemeSchemaImportExportExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "square.and.arrow.up.on.square")
                Text("Import/Export")
            }
            .tag(7)
            
            // Enhanced Theme Customization Tab
            NavigationView {
                EnhancedThemeCustomizationView()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "paintbrush.pointed")
                Text("Enhanced Theme")
            }
            .tag(8)
            
            // Advanced Theming Tab
            NavigationView {
                AdvancedThemeArchitectureExample()
            }
            .tabItem {
                Image(systemName: "cube.box.fill")
                Text("Advanced")
            }
            .tag(9)
            
            // Recursive Resolution Tab
            NavigationView {
                RecursiveResolutionExample()
            }
            .tabItem {
                Image(systemName: "arrow.triangle.branch")
                Text("Recursive")
            }
            .tag(10)
            
            // Theme Transitions Tab
            NavigationView {
                ThemeTransitionExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "arrow.triangle.2.circlepath")
                Text("Transitions")
            }
            .tag(11)
            
            // Custom View Transitions Tab
            NavigationView {
                CustomViewTransitionsExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "rectangle.stack.fill")
                Text("Custom Transitions")
            }
            .tag(12)
            
            // Dynamic Color Scheme Tab
            NavigationView {
                DynamicColorSchemeExample()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "paintpalette.fill")
                Text("Dynamic Colors")
            }
            .tag(13)
            
            // Theme Validation Tab
            NavigationView {
                ThemeValidationView()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "checkmark.shield.fill")
                Text("Validation")
            }
            .tag(14)
            
            // Accessibility Validation Tab
            NavigationView {
                AccessibilityValidationView()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "eye.trianglebadge.exclamationmark")
                Text("WCAG")
            }
            .tag(15)
            
            // Interactive Feedback Tab
            NavigationView {
                InteractiveThemeFeedback()
                    .environmentObject(themeManager)
            }
            .tabItem {
                Image(systemName: "message.and.waveform.fill")
                Text("Interactive Feedback")
            }
            .tag(16)
            
            // Accessibility Foundation Tab
            NavigationView {
                AccessibilityTestingView()
            }
            .tabItem {
                Image(systemName: "accessibility")
                Text("Accessibility")
            }
            .tag(17)
            
            // Data Architecture Tab
            NavigationView {
                DataArchitectureTestingView()
            }
            .tabItem {
                Image(systemName: "database.fill")
                Text("Data Architecture")
            }
            .tag(18)
            
            // User Interaction Tab
            NavigationView {
                UserInteractionTestingView()
            }
            .tabItem {
                Image(systemName: "hand.tap.fill")
                Text("User Interaction")
            }
            .tag(19)
        }
        .accentColor(themeManager.currentTheme.primary)
        .preferredColorScheme(themeManager.isDarkMode ? .dark : .light)
    }
}

// MARK: - Preview

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(ThemeManager())
    }
} 