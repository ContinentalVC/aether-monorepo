//
//  LayoutPreviewExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating the Layout and Hierarchy Preview system
//  integration with the existing theme customization interface.
//

import SwiftUI

// MARK: - Layout Preview Example

/// Main example view demonstrating the Layout Preview system
struct LayoutPreviewExample: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingLayoutPreview = false
    @State private var showingLayoutGuide = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header section
                    HeaderSection()
                    
                    // Description section
                    DescriptionSection()
                    
                    // Features section
                    FeaturesSection()
                    
                    // Preview types section
                    PreviewTypesSection()
                    
                    // Action buttons
                    ActionButtonsSection()
                }
                .padding()
            }
            .navigationTitle("Layout Preview")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingLayoutPreview) {
                LayoutPreviewView()
            }
            .sheet(isPresented: $showingLayoutGuide) {
                LayoutGuideView()
            }
        }
    }
}

// MARK: - Header Section

struct HeaderSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Layout & Hierarchy Preview")
                .font(themeManager.currentTheme.typography.heading(size: .h1))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("Real-time visual feedback for design changes")
                .font(themeManager.currentTheme.typography.body(size: .lg))
                .foregroundColor(themeManager.currentTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(24)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}

// MARK: - Description Section

struct DescriptionSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("What is Layout Preview?")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("The Layout Preview system provides real-time visual feedback as you modify design tokens. It shows how changes affect visual hierarchy, contrast, and spacing across different interface types.")
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .lineLimit(nil)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(themeManager.currentTheme.primary.opacity(0.1))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(themeManager.currentTheme.primary, lineWidth: 1)
                )
        )
    }
}

// MARK: - Features Section

struct FeaturesSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    private let features = [
        FeatureItem(
            icon: "🎨",
            title: "Live Preview",
            description: "See changes instantly across different interface types"
        ),
        FeatureItem(
            icon: "📊",
            title: "Hierarchy Analysis",
            description: "Understand how your design creates visual hierarchy"
        ),
        FeatureItem(
            icon: "📏",
            title: "Spacing Analysis",
            description: "Analyze spacing consistency and effectiveness"
        ),
        FeatureItem(
            icon: "🔍",
            title: "Contrast Analysis",
            description: "Ensure accessibility with contrast ratio checks"
        )
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Key Features")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVStack(spacing: 12) {
                ForEach(features, id: \.title) { feature in
                    FeatureRow(feature: feature)
                }
            }
        }
    }
}

struct FeatureItem {
    let icon: String
    let title: String
    let description: String
}

struct FeatureRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let feature: FeatureItem
    
    var body: some View {
        HStack(spacing: 16) {
            Text(feature.icon)
                .font(.system(size: 24))
            
            VStack(alignment: .leading, spacing: 4) {
                Text(feature.title)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text(feature.description)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .lineLimit(2)
            }
            
            Spacer()
        }
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Preview Types Section

struct PreviewTypesSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    private let previewTypes = [
        PreviewTypeItem(
            icon: "📊",
            title: "Dashboard",
            description: "Data visualization and metrics display"
        ),
        PreviewTypeItem(
            icon: "📄",
            title: "Article",
            description: "Long-form content and typography"
        ),
        PreviewTypeItem(
            icon: "👤",
            title: "Profile",
            description: "User profiles and social elements"
        ),
        PreviewTypeItem(
            icon: "⚙️",
            title: "Settings",
            description: "Configuration and preferences"
        ),
        PreviewTypeItem(
            icon: "🃏",
            title: "Card",
            description: "Content cards and containers"
        )
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Preview Types")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(previewTypes, id: \.title) { previewType in
                    PreviewTypeCard(previewType: previewType)
                }
            }
        }
    }
}

struct PreviewTypeItem {
    let icon: String
    let title: String
    let description: String
}

struct PreviewTypeCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    let previewType: PreviewTypeItem
    
    var body: some View {
        VStack(spacing: 12) {
            Text(previewType.icon)
                .font(.system(size: 32))
            
            VStack(spacing: 4) {
                Text(previewType.title)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .multilineTextAlignment(.center)
                
                Text(previewType.description)
                    .font(themeManager.currentTheme.typography.body(size: .xs))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Action Buttons Section

struct ActionButtonsSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var showingLayoutPreview: Bool
    @Binding var showingLayoutGuide: Bool
    
    var body: some View {
        VStack(spacing: 12) {
            Button(action: {
                showingLayoutPreview = true
            }) {
                HStack {
                    Image(systemName: "eye")
                        .font(.system(size: 16, weight: .semibold))
                    
                    Text("Open Layout Preview")
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .fontWeight(.semibold)
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(16)
                .background(themeManager.currentTheme.primary)
                .cornerRadius(12)
            }
            
            Button(action: {
                showingLayoutGuide = true
            }) {
                HStack {
                    Image(systemName: "book")
                        .font(.system(size: 16, weight: .semibold))
                    
                    Text("View Design Guide")
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .fontWeight(.semibold)
                }
                .foregroundColor(themeManager.currentTheme.primary)
                .frame(maxWidth: .infinity)
                .padding(16)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(themeManager.currentTheme.primary, lineWidth: 2)
                )
            }
        }
    }
}

// MARK: - Preview

struct LayoutPreviewExample_Previews: PreviewProvider {
    static var previews: some View {
        LayoutPreviewExample()
            .environmentObject(ThemeManager())
    }
} 