//
//  RecursiveResolutionExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating recursive resolution for theme inheritance
//  with lightweight variant themes and cycle detection.
//

import SwiftUI

// MARK: - Recursive Resolution Example View

struct RecursiveResolutionExample: View {
    @StateObject private var themeManager = AdvancedThemeManager()
    @State private var selectedThemeName = "Light"
    @State private var showingResolutionPath = false
    @State private var showingInheritanceChain = false
    @State private var showingCoverageAnalysis = false
    @State private var selectedKey: ThemeKey = .primaryColor
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Theme Selection with Variants
                    themeSelectionSection
                    
                    // Recursive Resolution Demo
                    recursiveResolutionSection
                    
                    // Lightweight Variant Examples
                    lightweightVariantSection
                    
                    // Debug Tools
                    debugToolsSection
                    
                    // Performance Analysis
                    performanceAnalysisSection
                }
                .padding()
            }
            .navigationTitle("Recursive Resolution")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingResolutionPath) {
                ResolutionPathView(
                    theme: themeManager.currentTheme,
                    key: selectedKey
                )
            }
            .sheet(isPresented: $showingInheritanceChain) {
                InheritanceChainView(theme: themeManager.currentTheme)
            }
            .sheet(isPresented: $showingCoverageAnalysis) {
                CoverageAnalysisView(theme: themeManager.currentTheme)
            }
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recursive Resolution for Inheritance")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("Demonstrating lightweight variant themes with minimal redundancy through recursive inheritance resolution")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            HStack {
                Label("Cycle Detection", systemImage: "shield.checkered")
                Spacer()
                Label("Lightweight Variants", systemImage: "cube.box")
                Spacer()
                Label("Recursive Resolution", systemImage: "arrow.triangle.branch")
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
            Text("Theme Selection (Base + Variants)")
                .font(.headline)
                .fontWeight(.semibold)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(themeManager.getThemeNames(), id: \.self) { themeName in
                    ThemeCard(
                        name: themeName,
                        isSelected: selectedThemeName == themeName,
                        isVariant: isVariantTheme(themeName),
                        action: {
                            selectedThemeName = themeName
                            themeManager.switchTheme(themeName)
                        }
                    )
                }
            }
        }
    }
    
    private func isVariantTheme(_ name: String) -> Bool {
        return name.contains("High Contrast") || 
               name.contains("Large Text") || 
               name.contains("Compact") || 
               name.contains("Reduced Motion")
    }
    
    // MARK: - Recursive Resolution Section
    
    private var recursiveResolutionSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Recursive Resolution Demo")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                // Key Selection
                HStack {
                    Text("Theme Key:")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    Picker("Key", selection: $selectedKey) {
                        ForEach(ThemeKey.allCases, id: \.self) { key in
                            Text(key.rawValue).tag(key)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                
                // Resolution Result
                ResolutionResultView(
                    theme: themeManager.currentTheme,
                    key: selectedKey
                )
                
                // Resolution Path Button
                Button("Show Resolution Path") {
                    showingResolutionPath = true
                }
                .buttonStyle(.borderedProminent)
            }
        }
    }
    
    // MARK: - Lightweight Variant Section
    
    private var lightweightVariantSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Lightweight Variant Examples")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                VariantExampleCard(
                    title: "High Contrast Theme",
                    description: "Only overrides colors, inherits typography and layout from Light theme",
                    componentCount: 1,
                    inheritanceDepth: 1
                )
                
                VariantExampleCard(
                    title: "Large Text Theme",
                    description: "Only overrides typography, inherits colors and layout from Light theme",
                    componentCount: 1,
                    inheritanceDepth: 1
                )
                
                VariantExampleCard(
                    title: "Compact Layout Theme",
                    description: "Only overrides layout metrics, inherits colors and typography from Light theme",
                    componentCount: 1,
                    inheritanceDepth: 1
                )
                
                VariantExampleCard(
                    title: "Reduced Motion Theme",
                    description: "Overrides animation and accessibility, inherits everything else from Light theme",
                    componentCount: 2,
                    inheritanceDepth: 1
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
                    title: "Inheritance Chain",
                    subtitle: "View the complete inheritance hierarchy",
                    icon: "arrow.triangle.branch",
                    action: { showingInheritanceChain = true }
                )
                
                DebugButton(
                    title: "Coverage Analysis",
                    subtitle: "Analyze component coverage and statistics",
                    icon: "chart.bar",
                    action: { showingCoverageAnalysis = true }
                )
                
                DebugButton(
                    title: "Cycle Detection Test",
                    subtitle: "Test cycle detection in inheritance chains",
                    icon: "exclamationmark.triangle",
                    action: { testCycleDetection() }
                )
            }
        }
    }
    
    // MARK: - Performance Analysis Section
    
    private var performanceAnalysisSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Performance Analysis")
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 12) {
                PerformanceMetricCard(
                    title: "Resolution Speed",
                    value: "O(n) where n = inheritance depth",
                    description: "Linear time complexity with cycle detection"
                )
                
                PerformanceMetricCard(
                    title: "Memory Usage",
                    value: "Minimal overhead",
                    description: "Weak references prevent retain cycles"
                )
                
                PerformanceMetricCard(
                    title: "Redundancy Reduction",
                    value: "90%+ reduction",
                    description: "Variant themes only store overrides"
                )
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func testCycleDetection() {
        // Create a cycle for testing
        let theme1 = ThemeFactory.createDefaultLightTheme()
        let theme2 = theme1.createChildTheme()
        let theme3 = theme2.createChildTheme()
        
        // Create a cycle (this should be detected)
        theme1.setParentTheme(theme3)
        
        // This should trigger cycle detection warnings
        let _ = theme1.resolveValue(for: .primaryColor)
        
        // Show alert
        DispatchQueue.main.async {
            // In a real app, you'd show an alert here
            print("Cycle detection test completed - check console for warnings")
        }
    }
}

// MARK: - Supporting Views

struct ThemeCard: View {
    let name: String
    let isSelected: Bool
    let isVariant: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                HStack {
                    Circle()
                        .fill(themeColor(for: name))
                        .frame(width: 40, height: 40)
                    
                    Spacer()
                    
                    if isVariant {
                        Image(systemName: "arrow.triangle.branch")
                            .font(.caption)
                            .foregroundColor(.blue)
                    }
                }
                
                Text(name)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
                
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
        case let x where x.contains("High Contrast"): return .black
        case let x where x.contains("Large Text"): return .green
        case let x where x.contains("Compact"): return .orange
        case let x where x.contains("Reduced Motion"): return .red
        default: return .blue
        }
    }
}

struct ResolutionResultView: View {
    let theme: CompositeTheme
    let key: ThemeKey
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Resolution Result:")
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text(key.rawValue)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            if let value = theme.resolveValue(for: key) {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    
                    Text("Found: \(String(describing: value))")
                        .font(.subheadline)
                        .foregroundColor(.primary)
                    
                    Spacer()
                }
            } else {
                HStack {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.red)
                    
                    Text("Not found in inheritance chain")
                        .font(.subheadline)
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

struct VariantExampleCard: View {
    let title: String
    let description: String
    let componentCount: Int
    let inheritanceDepth: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
                
                Spacer()
                
                Text("\(componentCount) component\(componentCount == 1 ? "" : "s")")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
            
            HStack {
                Label("Depth: \(inheritanceDepth)", systemImage: "arrow.triangle.branch")
                    .font(.caption)
                    .foregroundColor(.blue)
                
                Spacer()
                
                Label("Lightweight", systemImage: "cube.box")
                    .font(.caption)
                    .foregroundColor(.green)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
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

struct PerformanceMetricCard: View {
    let title: String
    let value: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
            
            Text(value)
                .font(.headline)
                .foregroundColor(.blue)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
        .shadow(radius: 2)
    }
}

// MARK: - Modal Views

struct ResolutionPathView: View {
    let theme: CompositeTheme
    let key: ThemeKey
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Resolution Path for \(key.rawValue)") {
                    ForEach(theme.getResolutionPath(for: key), id: \.description) { step in
                        ResolutionStepRow(step: step)
                    }
                }
                
                Section("Summary") {
                    HStack {
                        Text("Total Steps:")
                        Spacer()
                        Text("\(theme.getResolutionPath(for: key).count)")
                            .fontWeight(.medium)
                    }
                    
                    HStack {
                        Text("Found:")
                        Spacer()
                        Text(theme.resolveValue(for: key) != nil ? "Yes" : "No")
                            .fontWeight(.medium)
                            .foregroundColor(theme.resolveValue(for: key) != nil ? .green : .red)
                    }
                }
            }
            .navigationTitle("Resolution Path")
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

struct ResolutionStepRow: View {
    let step: ResolutionStep
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(step.description)
                    .font(.subheadline)
                
                Spacer()
                
                if step.found {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                } else {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.red)
                }
            }
            
            Text("Component: \(String(describing: type(of: step.component)))")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct InheritanceChainView: View {
    let theme: CompositeTheme
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Inheritance Chain") {
                    ForEach(Array(theme.getInheritanceChain().enumerated()), id: \.offset) { index, chainTheme in
                        InheritanceChainRow(
                            theme: chainTheme,
                            level: index,
                            isCurrent: chainTheme === theme
                        )
                    }
                }
                
                Section("Chain Statistics") {
                    HStack {
                        Text("Total Depth:")
                        Spacer()
                        Text("\(theme.getInheritanceChain().count)")
                            .fontWeight(.medium)
                    }
                    
                    HStack {
                        Text("Components:")
                        Spacer()
                        Text("\(theme.getComponents().count)")
                            .fontWeight(.medium)
                    }
                }
            }
            .navigationTitle("Inheritance Chain")
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

struct InheritanceChainRow: View {
    let theme: CompositeTheme
    let level: Int
    let isCurrent: Bool
    
    var body: some View {
        HStack {
            Text(String(repeating: "  ", count: level))
                .font(.caption)
                .foregroundColor(.secondary)
            
            Image(systemName: "circle.fill")
                .font(.caption2)
                .foregroundColor(isCurrent ? .blue : .secondary)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(isCurrent ? "Current Theme" : "Parent Theme")
                    .font(.subheadline)
                    .fontWeight(isCurrent ? .medium : .regular)
                
                Text("\(theme.getComponents().count) components")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if isCurrent {
                Text("CURRENT")
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.blue)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(4)
            }
        }
    }
}

struct CoverageAnalysisView: View {
    let theme: CompositeTheme
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Coverage Statistics") {
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
                
                Section("Coverage by Category") {
                    let coverage = theme.getComponentCoverage()
                    ForEach(ThemeKeyCategory.allCases, id: \.self) { category in
                        HStack {
                            Text(category.rawValue)
                            Spacer()
                            Text("\(coverage.coverageByCategory[category] ?? 0)")
                                .fontWeight(.medium)
                        }
                    }
                }
            }
            .navigationTitle("Coverage Analysis")
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

// MARK: - Preview

struct RecursiveResolutionExample_Previews: PreviewProvider {
    static var previews: some View {
        RecursiveResolutionExample()
    }
} 