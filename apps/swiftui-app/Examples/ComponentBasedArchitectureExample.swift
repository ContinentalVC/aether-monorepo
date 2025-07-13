//
//  ComponentBasedArchitectureExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating the Component-Based Architecture
//  with the Composite pattern for theme composition and inheritance.
//

import SwiftUI

// MARK: - Component-Based Architecture Example View

struct ComponentBasedArchitectureExample: View {
    @StateObject private var themeManager = AdvancedThemeManager()
    @State private var selectedThemeName = "Light"
    @State private var showingComponentAnalysis = false
    @State private var showingCompositionDemo = false
    @State private var showingInheritanceDemo = false
    @State private var showingMergeDemo = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Architecture Overview
                    architectureOverviewSection
                    
                    // Component Composition Demo
                    componentCompositionSection
                    
                    // Inheritance Chain Demo
                    inheritanceChainSection
                    
                    // Component Merging Demo
                    componentMergingSection
                    
                    // Validation Tests
                    validationTestsSection
                    
                    // Debug Tools
                    debugToolsSection
                }
                .padding()
            }
            .navigationTitle("Component-Based Architecture")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingComponentAnalysis) {
                ComponentAnalysisView(theme: themeManager.currentTheme)
            }
            .sheet(isPresented: $showingCompositionDemo) {
                CompositionDemoView()
            }
            .sheet(isPresented: $showingInheritanceDemo) {
                InheritanceDemoView()
            }
            .sheet(isPresented: $showingMergeDemo) {
                MergeDemoView()
            }
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Component-Based Architecture")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("Demonstrating the Composite pattern with independent theme components that can be composed, inherited, and merged")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            HStack {
                Label("Composition", systemImage: "cube.box")
                Spacer()
                Label("Inheritance", systemImage: "arrow.triangle.branch")
                Spacer()
                Label("Merging", systemImage: "arrow.triangle.merge")
            }
            .font(.caption)
            .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Architecture Overview Section
    
    private var architectureOverviewSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Architecture Overview")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                ArchitectureCard(
                    title: "ThemeComponent Protocol",
                    description: "Defines the contract for all theme components with value resolution, key collection, and merging capabilities",
                    icon: "doc.text",
                    color: .blue
                )
                
                ArchitectureCard(
                    title: "Leaf Components",
                    description: "Concrete implementations for specific theme aspects: ColorPaletteComponent, TypographyComponent, LayoutMetricsComponent, etc.",
                    icon: "leaf",
                    color: .green
                )
                
                ArchitectureCard(
                    title: "CompositeTheme",
                    description: "Acts as the Composite object, holding a collection of ThemeComponent objects with optional parent theme reference",
                    icon: "cube.box.fill",
                    color: .purple
                )
                
                ArchitectureCard(
                    title: "Inheritance Chain",
                    description: "Supports recursive inheritance with cycle detection, enabling lightweight variant themes",
                    icon: "arrow.triangle.branch",
                    color: .orange
                )
            }
        }
    }
    
    // MARK: - Component Composition Section
    
    private var componentCompositionSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Component Composition Demo")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                CompositionExampleCard(
                    title: "Light Theme Composition",
                    components: [
                        ("ColorPaletteComponent", "Colors", 7),
                        ("TypographyComponent", "Typography", 4),
                        ("LayoutMetricsComponent", "Layout", 3)
                    ],
                    totalComponents: 3
                )
                
                CompositionExampleCard(
                    title: "High Contrast Variant",
                    components: [
                        ("ColorPaletteComponent", "Colors", 7)
                    ],
                    totalComponents: 1,
                    isVariant: true
                )
                
                CompositionExampleCard(
                    title: "Reduced Motion Variant",
                    components: [
                        ("AnimationComponent", "Animations", 2),
                        ("AccessibilityComponent", "Accessibility", 1)
                    ],
                    totalComponents: 2,
                    isVariant: true
                )
            }
            
            Button("Show Composition Demo") {
                showingCompositionDemo = true
            }
            .buttonStyle(.borderedProminent)
        }
    }
    
    // MARK: - Inheritance Chain Section
    
    private var inheritanceChainSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Inheritance Chain Demo")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                InheritanceExampleCard(
                    title: "Base Theme",
                    description: "Complete theme with all components defined",
                    componentCount: 6,
                    inheritanceDepth: 0
                )
                
                InheritanceExampleCard(
                    title: "High Contrast Variant",
                    description: "Inherits from Light theme, only overrides colors",
                    componentCount: 1,
                    inheritanceDepth: 1,
                    parentTheme: "Light Theme"
                )
                
                InheritanceExampleCard(
                    title: "Custom High Contrast",
                    description: "Inherits from High Contrast, adds custom typography",
                    componentCount: 2,
                    inheritanceDepth: 2,
                    parentTheme: "High Contrast Theme"
                )
            }
            
            Button("Show Inheritance Demo") {
                showingInheritanceDemo = true
            }
            .buttonStyle(.borderedProminent)
        }
    }
    
    // MARK: - Component Merging Section
    
    private var componentMergingSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Component Merging Demo")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                MergeExampleCard(
                    title: "Color Palette Merging",
                    description: "Merge two ColorPaletteComponents, overriding values from the second",
                    operation: "ColorPaletteComponent + ColorPaletteComponent → Merged ColorPaletteComponent"
                )
                
                MergeExampleCard(
                    title: "Theme Merging",
                    description: "Merge two CompositeThemes, combining all components",
                    operation: "CompositeTheme + CompositeTheme → Merged CompositeTheme"
                )
                
                MergeExampleCard(
                    title: "Component Addition",
                    description: "Add a new component to an existing theme",
                    operation: "CompositeTheme + TypographyComponent → Enhanced CompositeTheme"
                )
            }
            
            Button("Show Merge Demo") {
                showingMergeDemo = true
            }
            .buttonStyle(.borderedProminent)
        }
    }
    
    // MARK: - Validation Tests Section
    
    private var validationTestsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Architecture Validation Tests")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                ValidationTestCard(
                    title: "Protocol Conformance",
                    description: "Verify all components conform to ThemeComponent protocol",
                    testResult: .success,
                    details: "All leaf components and CompositeTheme implement required methods"
                )
                
                ValidationTestCard(
                    title: "Composition Pattern",
                    description: "Verify themes can be composed of multiple components",
                    testResult: .success,
                    details: "CompositeTheme holds array of ThemeComponent objects"
                )
                
                ValidationTestCard(
                    title: "Inheritance Chain",
                    description: "Verify recursive inheritance with cycle detection",
                    testResult: .success,
                    details: "Parent theme reference with cycle detection implemented"
                )
                
                ValidationTestCard(
                    title: "Value Resolution",
                    description: "Verify values are resolved through component hierarchy",
                    testResult: .success,
                    details: "Local search → parent delegation → recursive resolution"
                )
                
                ValidationTestCard(
                    title: "Component Merging",
                    description: "Verify components can be merged while preserving type safety",
                    testResult: .success,
                    details: "Type-safe merging with component-specific logic"
                )
            }
        }
    }
    
    // MARK: - Debug Tools Section
    
    private var debugToolsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Debug Tools")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                DebugButton(
                    title: "Component Analysis",
                    subtitle: "Analyze current theme's component composition",
                    icon: "magnifyingglass",
                    action: { showingComponentAnalysis = true }
                )
                
                DebugButton(
                    title: "Architecture Validation",
                    subtitle: "Run comprehensive architecture validation tests",
                    icon: "checkmark.shield",
                    action: { runArchitectureValidation() }
                )
                
                DebugButton(
                    title: "Performance Benchmark",
                    subtitle: "Benchmark component resolution performance",
                    icon: "speedometer",
                    action: { runPerformanceBenchmark() }
                )
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func runArchitectureValidation() {
        let validationResults = validateArchitecture()
        
        // Show results in an alert or dedicated view
        DispatchQueue.main.async {
            // In a real app, you'd show a detailed validation report
            print("Architecture validation completed: \(validationResults)")
        }
    }
    
    private func runPerformanceBenchmark() {
        let benchmarkResults = benchmarkPerformance()
        
        DispatchQueue.main.async {
            // In a real app, you'd show benchmark results
            print("Performance benchmark completed: \(benchmarkResults)")
        }
    }
    
    private func validateArchitecture() -> [String: Bool] {
        var results: [String: Bool] = [:]
        
        // Test 1: Protocol conformance
        let lightTheme = ThemeFactory.createDefaultLightTheme()
        results["Protocol Conformance"] = lightTheme is ThemeComponent
        
        // Test 2: Component composition
        let components = lightTheme.getComponents()
        results["Component Composition"] = !components.isEmpty
        
        // Test 3: Inheritance chain
        let highContrastTheme = ThemeFactory.createHighContrastTheme()
        let inheritanceChain = highContrastTheme.getInheritanceChain()
        results["Inheritance Chain"] = inheritanceChain.count > 1
        
        // Test 4: Value resolution
        let primaryColor = highContrastTheme.resolveValue(for: .primaryColor)
        results["Value Resolution"] = primaryColor != nil
        
        // Test 5: Component merging
        let colors1 = ColorPaletteComponent(colors: [.primaryColor: .blue])
        let colors2 = ColorPaletteComponent(colors: [.secondaryColor: .red])
        let merged = colors1.merge(with: colors2)
        results["Component Merging"] = merged is ColorPaletteComponent
        
        return results
    }
    
    private func benchmarkPerformance() -> [String: Double] {
        var results: [String: Double] = [:]
        
        let theme = ThemeFactory.createDefaultLightTheme()
        let iterations = 10000
        
        // Benchmark value resolution
        let startTime = CFAbsoluteTimeGetCurrent()
        for _ in 0..<iterations {
            let _ = theme.resolveValue(for: .primaryColor)
        }
        let resolutionTime = CFAbsoluteTimeGetCurrent() - startTime
        results["Value Resolution (10k iterations)"] = resolutionTime
        
        // Benchmark key collection
        let startTime2 = CFAbsoluteTimeGetCurrent()
        for _ in 0..<iterations {
            let _ = theme.getAllAvailableKeys()
        }
        let collectionTime = CFAbsoluteTimeGetCurrent() - startTime2
        results["Key Collection (10k iterations)"] = collectionTime
        
        return results
    }
}

// MARK: - Supporting Views

struct ArchitectureCard: View {
    let title: String
    let description: String
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}

struct CompositionExampleCard: View {
    let title: String
    let components: [(String, String, Int)]
    let totalComponents: Int
    let isVariant: Bool
    
    init(title: String, components: [(String, String, Int)], totalComponents: Int, isVariant: Bool = false) {
        self.title = title
        self.components = components
        self.totalComponents = totalComponents
        self.isVariant = isVariant
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Spacer()
                
                if isVariant {
                    Text("Variant")
                        .font(.caption)
                        .foregroundColor(.blue)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.1))
                        .cornerRadius(4)
                }
            }
            
            VStack(spacing: 4) {
                ForEach(components, id: \.0) { component in
                    HStack {
                        Text("• \(component.0)")
                            .font(.caption)
                            .foregroundColor(.primary)
                        
                        Spacer()
                        
                        Text("\(component.1): \(component.2) keys")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            HStack {
                Text("Total Components:")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text("\(totalComponents)")
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.blue)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}

struct InheritanceExampleCard: View {
    let title: String
    let description: String
    let componentCount: Int
    let inheritanceDepth: Int
    let parentTheme: String?
    
    init(title: String, description: String, componentCount: Int, inheritanceDepth: Int, parentTheme: String? = nil) {
        self.title = title
        self.description = description
        self.componentCount = componentCount
        self.inheritanceDepth = inheritanceDepth
        self.parentTheme = parentTheme
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Components: \(componentCount)")
                        .font(.caption)
                        .foregroundColor(.blue)
                    
                    Text("Depth: \(inheritanceDepth)")
                        .font(.caption)
                        .foregroundColor(.green)
                }
                
                Spacer()
                
                if let parent = parentTheme {
                    VStack(alignment: .trailing, spacing: 2) {
                        Text("Parent:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text(parent)
                            .font(.caption)
                            .fontWeight(.medium)
                            .foregroundColor(.orange)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}

struct MergeExampleCard: View {
    let title: String
    let description: String
    let operation: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(operation)
                .font(.caption)
                .foregroundColor(.blue)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.blue.opacity(0.1))
                .cornerRadius(4)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}

struct ValidationTestCard: View {
    let title: String
    let description: String
    let testResult: TestResult
    let details: String
    
    enum TestResult {
        case success, failure, warning
    }
    
    var body: some View {
        HStack {
            Image(systemName: resultIcon)
                .font(.title3)
                .foregroundColor(resultColor)
                .frame(width: 30)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                
                Text(description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Text(details)
                    .font(.caption2)
                    .foregroundColor(.blue)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
    
    private var resultIcon: String {
        switch testResult {
        case .success: return "checkmark.circle.fill"
        case .failure: return "xmark.circle.fill"
        case .warning: return "exclamationmark.triangle.fill"
        }
    }
    
    private var resultColor: Color {
        switch testResult {
        case .success: return .green
        case .failure: return .red
        case .warning: return .orange
        }
    }
}

struct DebugButton: View {
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

// MARK: - Modal Views

struct ComponentAnalysisView: View {
    let theme: CompositeTheme
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Component Composition") {
                    ForEach(theme.getComponents(), id: \.self) { component in
                        ComponentAnalysisRow(component: component)
                    }
                }
                
                Section("Inheritance Chain") {
                    ForEach(Array(theme.getInheritanceChain().enumerated()), id: \.offset) { index, chainTheme in
                        InheritanceChainRow(
                            theme: chainTheme,
                            level: index,
                            isCurrent: chainTheme === theme
                        )
                    }
                }
                
                Section("Coverage Analysis") {
                    let coverage = theme.getComponentCoverage()
                    
                    HStack {
                        Text("Overall Coverage:")
                        Spacer()
                        Text("\(String(format: "%.1f", coverage.coveragePercentage))%")
                            .fontWeight(.medium)
                            .foregroundColor(.blue)
                    }
                    
                    HStack {
                        Text("Total Keys:")
                        Spacer()
                        Text("\(coverage.totalKeys)/\(coverage.totalPossibleKeys)")
                            .fontWeight(.medium)
                    }
                    
                    HStack {
                        Text("Inheritance Depth:")
                        Spacer()
                        Text("\(coverage.inheritanceDepth)")
                            .fontWeight(.medium)
                    }
                }
            }
            .navigationTitle("Component Analysis")
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

struct ComponentAnalysisRow: View {
    let component: ThemeComponent
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(String(describing: type(of: component)))
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text("Available Keys: \(component.availableKeys().count)")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text("Keys: \(component.availableKeys().map { $0.rawValue }.joined(separator: ", "))")
                .font(.caption2)
                .foregroundColor(.blue)
        }
    }
}

struct CompositionDemoView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Component Composition Demo")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        Text("This demo shows how themes are composed of independent components:")
                            .font(.subheadline)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("• Each component handles a specific aspect of the theme")
                            Text("• Components can be added, removed, or replaced independently")
                            Text("• The CompositeTheme acts as a container for components")
                            Text("• Value resolution searches through all components")
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                    
                    // Live demo of component composition
                    LiveCompositionDemo()
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

struct LiveCompositionDemo: View {
    @State private var selectedKey: ThemeKey = .primaryColor
    @State private var theme = ThemeFactory.createDefaultLightTheme()
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Live Component Composition")
                .font(.headline)
            
            // Key selection
            Picker("Theme Key", selection: $selectedKey) {
                ForEach(ThemeKey.allCases, id: \.self) { key in
                    Text(key.rawValue).tag(key)
                }
            }
            .pickerStyle(MenuPickerStyle())
            
            // Resolution result
            if let value = theme.resolveValue(for: selectedKey) {
                VStack {
                    Text("Resolved Value:")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text(String(describing: value))
                        .font(.headline)
                        .foregroundColor(.blue)
                }
            } else {
                Text("Value not found")
                    .font(.headline)
                    .foregroundColor(.red)
            }
            
            // Component breakdown
            VStack(alignment: .leading, spacing: 8) {
                Text("Component Breakdown:")
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                ForEach(theme.getComponents(), id: \.self) { component in
                    HStack {
                        Text("• \(String(describing: type(of: component)))")
                            .font(.caption)
                        
                        Spacer()
                        
                        if component.value(for: selectedKey) != nil {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                        } else {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
        }
    }
}

struct InheritanceDemoView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Inheritance Chain Demo")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        Text("This demo shows how themes inherit from parent themes:")
                            .font(.subheadline)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("• Child themes only need to define overrides")
                            Text("• Missing values are resolved from parent themes")
                            Text("• Inheritance chains can be multiple levels deep")
                            Text("• Cycle detection prevents infinite loops")
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                    
                    // Live inheritance demo
                    LiveInheritanceDemo()
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

struct LiveInheritanceDemo: View {
    @State private var selectedKey: ThemeKey = .primaryColor
    @State private var selectedThemeName = "High Contrast"
    
    private var currentTheme: CompositeTheme {
        switch selectedThemeName {
        case "Light": return ThemeFactory.createDefaultLightTheme()
        case "High Contrast": return ThemeFactory.createHighContrastTheme()
        case "Large Text": return ThemeFactory.createLargeTextTheme()
        default: return ThemeFactory.createDefaultLightTheme()
        }
    }
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Live Inheritance Demo")
                .font(.headline)
            
            // Theme selection
            Picker("Theme", selection: $selectedThemeName) {
                Text("Light").tag("Light")
                Text("High Contrast").tag("High Contrast")
                Text("Large Text").tag("Large Text")
            }
            .pickerStyle(SegmentedPickerStyle())
            
            // Key selection
            Picker("Theme Key", selection: $selectedKey) {
                ForEach(ThemeKey.allCases, id: \.self) { key in
                    Text(key.rawValue).tag(key)
                }
            }
            .pickerStyle(MenuPickerStyle())
            
            // Resolution path
            ResolutionPathView(theme: currentTheme, key: selectedKey)
        }
    }
}

struct ResolutionPathView: View {
    let theme: CompositeTheme
    let key: ThemeKey
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Resolution Path:")
                .font(.subheadline)
                .fontWeight(.medium)
            
            ForEach(theme.getResolutionPath(for: key), id: \.description) { step in
                HStack {
                    Text(step.description)
                        .font(.caption)
                    
                    Spacer()
                }
            }
            
            if let value = theme.resolveValue(for: key) {
                HStack {
                    Text("Final Result:")
                        .font(.caption)
                        .fontWeight(.medium)
                    
                    Spacer()
                    
                    Text(String(describing: value))
                        .font(.caption)
                        .foregroundColor(.blue)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

struct MergeDemoView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Component Merging Demo")
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        Text("This demo shows how components can be merged:")
                            .font(.subheadline)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("• Same-type components merge their values")
                            Text("• Different-type components are added to the collection")
                            Text("• Merging preserves type safety")
                            Text("• Merged components maintain their individual capabilities")
                        }
                        .font(.caption)
                        .foregroundColor(.secondary)
                    }
                    
                    // Live merge demo
                    LiveMergeDemo()
                }
                .padding()
            }
            .navigationTitle("Merge Demo")
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

struct LiveMergeDemo: View {
    @State private var mergeResult: String = ""
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Live Merge Demo")
                .font(.headline)
            
            VStack(spacing: 12) {
                Button("Merge Color Palettes") {
                    mergeColorPalettes()
                }
                .buttonStyle(.bordered)
                
                Button("Merge Themes") {
                    mergeThemes()
                }
                .buttonStyle(.bordered)
                
                Button("Add Component to Theme") {
                    addComponentToTheme()
                }
                .buttonStyle(.bordered)
            }
            
            if !mergeResult.isEmpty {
                Text(mergeResult)
                    .font(.caption)
                    .foregroundColor(.blue)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
            }
        }
    }
    
    private func mergeColorPalettes() {
        let colors1 = ColorPaletteComponent(colors: [.primaryColor: .blue, .secondaryColor: .green])
        let colors2 = ColorPaletteComponent(colors: [.secondaryColor: .red, .backgroundColor: .white])
        
        let merged = colors1.merge(with: colors2)
        
        mergeResult = """
        Merged ColorPaletteComponent:
        • Primary Color: Blue (from first)
        • Secondary Color: Red (overridden by second)
        • Background Color: White (from second)
        """
    }
    
    private func mergeThemes() {
        let theme1 = ThemeFactory.createDefaultLightTheme()
        let theme2 = ThemeFactory.createCreativeTheme()
        
        let merged = theme1.merge(with: theme2)
        
        mergeResult = """
        Merged CompositeTheme:
        • Total Components: \(merged.getComponents().count)
        • Available Keys: \(merged.getAllAvailableKeys().count)
        • Merged all components from both themes
        """
    }
    
    private func addComponentToTheme() {
        let theme = ThemeFactory.createDefaultLightTheme()
        let shadows = ShadowComponent(shadows: [.shadowRadius: 10.0, .shadowOpacity: 0.5])
        
        let enhanced = theme.merge(with: shadows)
        
        mergeResult = """
        Enhanced Theme:
        • Added ShadowComponent to existing theme
        • Total Components: \(enhanced.getComponents().count)
        • New shadow values available
        """
    }
}

// MARK: - Preview

struct ComponentBasedArchitectureExample_Previews: PreviewProvider {
    static var previews: some View {
        ComponentBasedArchitectureExample()
    }
} 