//
//  AdvancedThemeArchitectureExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating advanced theming architecture
//  with inheritance and composition using the Composite design pattern.
//

import SwiftUI

// MARK: - Advanced Theme Architecture Example View

struct AdvancedThemeArchitectureExample: View {
    @StateObject private var themeManager = AdvancedThemeManager()
    @State private var selectedThemeName = "Light"
    @State private var showingThemeInspector = false
    @State private var showingInheritanceDemo = false
    @State private var showingCompositionDemo = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Theme Selection
                    themeSelectionSection
                    
                    // Live Preview
                    livePreviewSection
                    
                    // Demo Buttons
                    demoButtonsSection
                    
                    // Component Examples
                    componentExamplesSection
                    
                    // Inheritance Chain
                    inheritanceChainSection
                }
                .padding()
            }
            .navigationTitle("Advanced Theming")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingThemeInspector) {
                ThemeInspectorView(themeManager: themeManager)
            }
            .sheet(isPresented: $showingInheritanceDemo) {
                InheritanceDemoView(themeManager: themeManager)
            }
            .sheet(isPresented: $showingCompositionDemo) {
                CompositionDemoView(themeManager: themeManager)
            }
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Advanced Theming Architecture")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("Demonstrating inheritance and composition using the Composite design pattern")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            HStack {
                Label("Component-Based", systemImage: "cube.box")
                Spacer()
                Label("Inheritance", systemImage: "arrow.triangle.branch")
                Spacer()
                Label("Composition", systemImage: "rectangle.stack")
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Theme Selection Section
    
    private var themeSelectionSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Theme Selection")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(themeManager.getThemeNames(), id: \.self) { themeName in
                    ThemeCard(
                        name: themeName,
                        isSelected: selectedThemeName == themeName,
                        action: {
                            selectedThemeName = themeName
                            themeManager.switchTheme(themeName)
                        }
                    )
                }
            }
        }
    }
    
    // MARK: - Live Preview Section
    
    private var livePreviewSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Live Preview")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 16) {
                // Sample UI Components
                sampleButton
                sampleCard
                sampleText
                sampleProgress
            }
        }
    }
    
    private var sampleButton: some View {
        Button("Sample Button") {
            // Action
        }
        .buttonStyle(ThemeButtonStyle())
    }
    
    private var sampleCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Sample Card")
                .font(.headline)
            Text("This card demonstrates the current theme's styling applied to various UI elements.")
                .font(.body)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 4)
    }
    
    private var sampleText: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Typography Sample")
                .font(.title)
                .fontWeight(.bold)
            
            Text("This demonstrates how typography components are applied across different text styles.")
                .font(.body)
            
            Text("Caption text with different styling")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
    
    private var sampleProgress: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Progress Indicator")
                .font(.subheadline)
                .fontWeight(.medium)
            
            ProgressView(value: 0.7)
                .progressViewStyle(LinearProgressViewStyle())
        }
    }
    
    // MARK: - Demo Buttons Section
    
    private var demoButtonsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Interactive Demos")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                DemoButton(
                    title: "Theme Inspector",
                    subtitle: "Explore current theme structure",
                    icon: "magnifyingglass",
                    action: { showingThemeInspector = true }
                )
                
                DemoButton(
                    title: "Inheritance Demo",
                    subtitle: "See how themes inherit properties",
                    icon: "arrow.triangle.branch",
                    action: { showingInheritanceDemo = true }
                )
                
                DemoButton(
                    title: "Composition Demo",
                    subtitle: "Build themes from components",
                    icon: "rectangle.stack",
                    action: { showingCompositionDemo = true }
                )
            }
        }
    }
    
    // MARK: - Component Examples Section
    
    private var componentExamplesSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Component Examples")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ComponentExampleCard(
                    title: "Color Palette",
                    description: "Primary, secondary, and semantic colors",
                    icon: "paintpalette",
                    color: .blue
                )
                
                ComponentExampleCard(
                    title: "Typography",
                    description: "Fonts, sizes, and text styles",
                    icon: "textformat",
                    color: .green
                )
                
                ComponentExampleCard(
                    title: "Layout Metrics",
                    description: "Spacing, padding, and borders",
                    icon: "ruler",
                    color: .orange
                )
                
                ComponentExampleCard(
                    title: "Shadows",
                    description: "Depth and elevation effects",
                    icon: "shadow",
                    color: .purple
                )
            }
        }
    }
    
    // MARK: - Inheritance Chain Section
    
    private var inheritanceChainSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Inheritance Chain")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                InheritanceChainView(theme: themeManager.currentTheme)
            }
        }
    }
}

// MARK: - Supporting Views

struct ThemeCard: View {
    let name: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Circle()
                    .fill(themeColor(for: name))
                    .frame(width: 40, height: 40)
                
                Text(name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(isSelected ? Color.blue.opacity(0.1) : Color(.systemGray6))
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 2)
            )
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private func themeColor(for name: String) -> Color {
        switch name {
        case "Light": return .blue
        case "Dark": return .purple
        case "Corporate": return .gray
        case "Creative": return .pink
        default: return .blue
        }
    }
}

struct DemoButton: View {
    let title: String
    let subtitle: String
    let icon: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(.blue)
                    .frame(width: 30)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ComponentExampleCard: View {
    let title: String
    let description: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                
                Spacer()
            }
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct InheritanceChainView: View {
    let theme: CompositeTheme
    
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("Current Theme")
                    .font(.caption)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text("\(theme.getComponents().count) components")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            if let parent = theme.getParentTheme() {
                HStack {
                    Image(systemName: "arrow.down")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("Inherits from parent")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Spacer()
                }
                
                HStack {
                    Text("Parent Theme")
                        .font(.caption)
                        .fontWeight(.medium)
                    
                    Spacer()
                    
                    Text("\(parent.getComponents().count) components")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            } else {
                HStack {
                    Text("No parent theme")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Custom Button Style

struct ThemeButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.subheadline)
            .fontWeight(.medium)
            .foregroundColor(.white)
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(Color.blue)
            .cornerRadius(8)
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
    }
}

// MARK: - Theme Inspector View

struct ThemeInspectorView: View {
    @ObservedObject var themeManager: AdvancedThemeManager
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Theme Components") {
                    ForEach(themeManager.currentTheme.getComponents(), id: \.self) { component in
                        ComponentInspectorRow(component: component)
                    }
                }
                
                Section("Available Keys") {
                    ForEach(themeManager.currentTheme.getAllAvailableKeys(), id: \.self) { key in
                        KeyInspectorRow(key: key, theme: themeManager.currentTheme)
                    }
                }
            }
            .navigationTitle("Theme Inspector")
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

struct ComponentInspectorRow: View {
    let component: ThemeComponent
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(String(describing: type(of: component)))
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text("\(component.availableKeys().count) keys")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct KeyInspectorRow: View {
    let key: ThemeKey
    let theme: CompositeTheme
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(key.rawValue)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Text(key.category.rawValue)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if let value = theme.resolveValue(for: key) {
                Text(String(describing: value))
                    .font(.caption)
                    .foregroundColor(.secondary)
            } else {
                Text("Not set")
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
    }
}

// MARK: - Inheritance Demo View

struct InheritanceDemoView: View {
    @ObservedObject var themeManager: AdvancedThemeManager
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Inheritance Demo")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("This demo shows how themes can inherit properties from parent themes, creating a hierarchy of styling.")
                        .font(.body)
                        .multilineTextAlignment(.center)
                        .padding()
                    
                    InheritanceDemoContent(themeManager: themeManager)
                }
                .padding()
            }
            .navigationTitle("Inheritance Demo")
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

struct InheritanceDemoContent: View {
    @ObservedObject var themeManager: AdvancedThemeManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Create a parent theme
            let parentTheme = ThemeFactory.createDefaultLightTheme()
            
            // Create a child theme that inherits from parent
            let childTheme = parentTheme.createChildTheme(components: [
                ColorPaletteComponent(colors: [
                    .primaryColor: .red,
                    .secondaryColor: .orange
                ])
            ])
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Parent Theme")
                    .font(.headline)
                
                ThemePreviewCard(theme: parentTheme)
            }
            
            Image(systemName: "arrow.down")
                .font(.title2)
                .foregroundColor(.blue)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Child Theme (Inherits + Overrides)")
                    .font(.headline)
                
                ThemePreviewCard(theme: childTheme)
            }
        }
    }
}

// MARK: - Composition Demo View

struct CompositionDemoView: View {
    @ObservedObject var themeManager: AdvancedThemeManager
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Composition Demo")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("This demo shows how themes can be built by composing multiple components together.")
                        .font(.body)
                        .multilineTextAlignment(.center)
                        .padding()
                    
                    CompositionDemoContent(themeManager: themeManager)
                }
                .padding()
            }
            .navigationTitle("Composition Demo")
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

struct CompositionDemoContent: View {
    @ObservedObject var themeManager: AdvancedThemeManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Create individual components
            let colorComponent = ColorPaletteComponent(colors: [
                .primaryColor: .purple,
                .secondaryColor: .pink,
                .backgroundColor: .white
            ])
            
            let typographyComponent = TypographyComponent(typography: [
                .primaryFont: "Avenir",
                .fontSize: 18.0,
                .fontWeight: "Medium"
            ])
            
            let layoutComponent = LayoutMetricsComponent(metrics: [
                .spacing: 16.0,
                .padding: 20.0,
                .borderRadius: 12.0
            ])
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Individual Components")
                    .font(.headline)
                
                ComponentPreviewCard(component: colorComponent, title: "Color Palette")
                ComponentPreviewCard(component: typographyComponent, title: "Typography")
                ComponentPreviewCard(component: layoutComponent, title: "Layout Metrics")
            }
            
            Image(systemName: "plus")
                .font(.title2)
                .foregroundColor(.green)
            
            VStack(alignment: .leading, spacing: 12) {
                Text("Composed Theme")
                    .font(.headline)
                
                let composedTheme = CompositeTheme(components: [
                    colorComponent,
                    typographyComponent,
                    layoutComponent
                ])
                
                ThemePreviewCard(theme: composedTheme)
            }
        }
    }
}

// MARK: - Preview Cards

struct ThemePreviewCard: View {
    let theme: CompositeTheme
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Components: \(theme.getComponents().count)")
                    .font(.caption)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text("Keys: \(theme.getAllAvailableKeys().count)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            if let parent = theme.getParentTheme() {
                Text("Has parent theme")
                    .font(.caption)
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

struct ComponentPreviewCard: View {
    let component: ThemeComponent
    let title: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Spacer()
            
            Text("\(component.availableKeys().count) keys")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - Preview

struct AdvancedThemeArchitectureExample_Previews: PreviewProvider {
    static var previews: some View {
        AdvancedThemeArchitectureExample()
    }
} 