//
//  LayoutPreviewView.swift
//  Aether SwiftUI App
//
//  Layout and Hierarchy Preview: As users modify colors, fonts, and spacing,
//  the impact on the overall application layout must be immediately apparent.
//  This live preview canvas dynamically updates to demonstrate how changes
//  affect visual hierarchy, contrast, and the effective use of white space.
//

import SwiftUI

// MARK: - Layout Preview View

/// Main layout preview view that shows real-time design changes
struct LayoutPreviewView: View {
    @EnvironmentObject var themeManager: ThemeManager
    @State private var selectedPreviewType: PreviewType = .dashboard
    @State private var showingLayoutGuide = false
    
    enum PreviewType: String, CaseIterable {
        case dashboard = "Dashboard"
        case article = "Article"
        case profile = "Profile"
        case settings = "Settings"
        case card = "Card"
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Preview type selector
            PreviewTypeSelector(selectedType: $selectedPreviewType)
            
            // Main preview area
            ScrollView {
                VStack(spacing: 20) {
                    // Layout preview canvas
                    LayoutPreviewCanvas(previewType: selectedPreviewType)
                    
                    // Hierarchy analysis
                    HierarchyAnalysisView()
                    
                    // Spacing analysis
                    SpacingAnalysisView()
                    
                    // Contrast analysis
                    ContrastAnalysisView()
                }
                .padding()
            }
        }
        .navigationTitle("Layout Preview")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Guide") {
                    showingLayoutGuide = true
                }
            }
        }
        .sheet(isPresented: $showingLayoutGuide) {
            LayoutGuideView()
        }
    }
}

// MARK: - Preview Type Selector

struct PreviewTypeSelector: View {
    @Binding var selectedType: LayoutPreviewView.PreviewType
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(LayoutPreviewView.PreviewType.allCases, id: \.self) { type in
                    Button(action: {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            selectedType = type
                        }
                    }) {
                        Text(type.rawValue)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(selectedType == type ? .white : .primary)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                RoundedRectangle(cornerRadius: 20)
                                    .fill(selectedType == type ? Color.accentColor : Color(.systemGray5))
                            )
                    }
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Layout Preview Canvas

struct LayoutPreviewCanvas: View {
    @EnvironmentObject var themeManager: ThemeManager
    let previewType: LayoutPreviewView.PreviewType
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Live Preview")
                .font(.title2)
                .fontWeight(.semibold)
            
            // Preview container with dynamic theming
            Group {
                switch previewType {
                case .dashboard:
                    DashboardPreview()
                case .article:
                    ArticlePreview()
                case .profile:
                    ProfilePreview()
                case .settings:
                    SettingsPreview()
                case .card:
                    CardPreview()
                }
            }
            .frame(maxWidth: .infinity)
            .padding(20)
            .background(themeManager.currentTheme.background)
            .cornerRadius(16)
            .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 8, x: 0, y: 4)
        }
    }
}

// MARK: - Dashboard Preview

struct DashboardPreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Dashboard")
                        .font(themeManager.currentTheme.typography.heading(size: .h1))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text("Welcome back, User")
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                Circle()
                    .fill(themeManager.currentTheme.primary)
                    .frame(width: 40, height: 40)
            }
            
            // Stats cards
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                StatCard(title: "Total Views", value: "1,234", color: themeManager.currentTheme.primary)
                StatCard(title: "Engagement", value: "89%", color: themeManager.currentTheme.secondary)
                StatCard(title: "Growth", value: "+12%", color: themeManager.currentTheme.success)
                StatCard(title: "Active Users", value: "567", color: themeManager.currentTheme.info)
            }
            
            // Recent activity
            VStack(alignment: .leading, spacing: 12) {
                Text("Recent Activity")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                ForEach(1...3, id: \.self) { index in
                    ActivityRow(
                        title: "Activity \(index)",
                        subtitle: "Description for activity \(index)",
                        time: "\(index)h ago"
                    )
                }
            }
        }
    }
}

// MARK: - Article Preview

struct ArticlePreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Article header
            VStack(alignment: .leading, spacing: 8) {
                Text("Design Principles for Modern Interfaces")
                    .font(themeManager.currentTheme.typography.heading(size: .h1))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .lineLimit(2)
                
                HStack {
                    Text("By John Doe")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                    
                    Spacer()
                    
                    Text("5 min read")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
            }
            
            // Article content
            VStack(alignment: .leading, spacing: 12) {
                Text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .lineLimit(3)
                
                Text("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .lineLimit(3)
            }
            
            // Tags
            HStack {
                ForEach(["Design", "UI/UX", "Typography"], id: \.self) { tag in
                    Text(tag)
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.primary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(themeManager.currentTheme.primary.opacity(0.1))
                        )
                }
                Spacer()
            }
        }
    }
}

// MARK: - Profile Preview

struct ProfilePreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 20) {
            // Profile header
            VStack(spacing: 16) {
                Circle()
                    .fill(themeManager.currentTheme.primary)
                    .frame(width: 80, height: 80)
                
                VStack(spacing: 4) {
                    Text("Jane Smith")
                        .font(themeManager.currentTheme.typography.heading(size: .h2))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text("Product Designer")
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
            }
            
            // Stats
            HStack(spacing: 20) {
                StatItem(title: "Projects", value: "24")
                StatItem(title: "Followers", value: "1.2k")
                StatItem(title: "Following", value: "890")
            }
            
            // Bio
            Text("Passionate about creating beautiful and functional user experiences. Always learning and exploring new design trends.")
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.textPrimary)
                .multilineTextAlignment(.center)
                .lineLimit(3)
            
            // Action buttons
            HStack(spacing: 12) {
                Button("Follow") {
                    // Action
                }
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(.white)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(themeManager.currentTheme.primary)
                )
                
                Button("Message") {
                    // Action
                }
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.primary)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(themeManager.currentTheme.primary, lineWidth: 1)
                )
            }
        }
    }
}

// MARK: - Settings Preview

struct SettingsPreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(spacing: 16) {
            // Settings header
            HStack {
                Text("Settings")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                Spacer()
            }
            
            // Settings sections
            VStack(spacing: 12) {
                SettingsRow(title: "Notifications", subtitle: "Manage your notifications", icon: "bell")
                SettingsRow(title: "Privacy", subtitle: "Control your privacy settings", icon: "lock")
                SettingsRow(title: "Appearance", subtitle: "Customize your theme", icon: "paintbrush")
                SettingsRow(title: "Language", subtitle: "English (US)", icon: "globe")
            }
        }
    }
}

// MARK: - Card Preview

struct CardPreview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Card image placeholder
            RoundedRectangle(cornerRadius: 12)
                .fill(themeManager.currentTheme.primary.opacity(0.2))
                .frame(height: 120)
                .overlay(
                    Image(systemName: "photo")
                        .font(.system(size: 32))
                        .foregroundColor(themeManager.currentTheme.primary)
                )
            
            // Card content
            VStack(alignment: .leading, spacing: 8) {
                Text("Card Title")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("This is a sample card that demonstrates how your theme affects the visual hierarchy and spacing of content elements.")
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .lineLimit(2)
                
                HStack {
                    Text("Read More")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.primary)
                    
                    Spacer()
                    
                    Image(systemName: "arrow.right")
                        .font(.system(size: 12))
                        .foregroundColor(themeManager.currentTheme.primary)
                }
            }
        }
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(16)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Supporting Views

struct StatCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(value)
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(color)
            
            Text(title)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .foregroundColor(themeManager.currentTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
    }
}

struct ActivityRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let title: String
    let subtitle: String
    let time: String
    
    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(themeManager.currentTheme.primary.opacity(0.2))
                .frame(width: 32, height: 32)
                .overlay(
                    Image(systemName: "circle.fill")
                        .font(.system(size: 8))
                        .foregroundColor(themeManager.currentTheme.primary)
                )
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text(subtitle)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
            }
            
            Spacer()
            
            Text(time)
                .font(themeManager.currentTheme.typography.body(size: .xs))
                .foregroundColor(themeManager.currentTheme.textTertiary)
        }
    }
}

struct StatItem: View {
    @EnvironmentObject var themeManager: ThemeManager
    let title: String
    let value: String
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text(title)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .foregroundColor(themeManager.currentTheme.textSecondary)
        }
    }
}

struct SettingsRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let title: String
    let subtitle: String
    let icon: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundColor(themeManager.currentTheme.primary)
                .frame(width: 24)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text(subtitle)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.system(size: 12))
                .foregroundColor(themeManager.currentTheme.textTertiary)
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Analysis Views

struct HierarchyAnalysisView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Visual Hierarchy Analysis")
                .font(.title3)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                HierarchyItem(
                    level: "Primary",
                    description: "Main headings and key elements",
                    color: themeManager.currentTheme.primary
                )
                
                HierarchyItem(
                    level: "Secondary",
                    description: "Subheadings and supporting text",
                    color: themeManager.currentTheme.textSecondary
                )
                
                HierarchyItem(
                    level: "Tertiary",
                    description: "Muted text and subtle elements",
                    color: themeManager.currentTheme.textTertiary
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct HierarchyItem: View {
    let level: String
    let description: String
    let color: Color
    
    var body: some View {
        HStack {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            
            Text(level)
                .font(.system(size: 14, weight: .medium))
            
            Spacer()
            
            Text(description)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
        }
    }
}

struct SpacingAnalysisView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Spacing Analysis")
                .font(.title3)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                SpacingItem(label: "XS", value: "4pt", usage: "Tight spacing")
                SpacingItem(label: "SM", value: "8pt", usage: "Component spacing")
                SpacingItem(label: "MD", value: "16pt", usage: "Section spacing")
                SpacingItem(label: "LG", value: "24pt", usage: "Major sections")
                SpacingItem(label: "XL", value: "32pt", usage: "Page margins")
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct SpacingItem: View {
    let label: String
    let value: String
    let usage: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .medium))
                .frame(width: 30, alignment: .leading)
            
            Text(value)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.secondary)
                .frame(width: 40, alignment: .leading)
            
            Spacer()
            
            Text(usage)
                .font(.system(size: 12))
                .foregroundColor(.secondary)
        }
    }
}

struct ContrastAnalysisView: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Contrast Analysis")
                .font(.title3)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                ContrastItem(
                    label: "Primary Text",
                    ratio: calculateContrastRatio(
                        foreground: themeManager.currentTheme.textPrimary,
                        background: themeManager.currentTheme.background
                    )
                )
                
                ContrastItem(
                    label: "Secondary Text",
                    ratio: calculateContrastRatio(
                        foreground: themeManager.currentTheme.textSecondary,
                        background: themeManager.currentTheme.background
                    )
                )
                
                ContrastItem(
                    label: "Primary Button",
                    ratio: calculateContrastRatio(
                        foreground: .white,
                        background: themeManager.currentTheme.primary
                    )
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private func calculateContrastRatio(foreground: Color, background: Color) -> Double {
        // Simplified contrast calculation - in a real implementation,
        // you would convert colors to luminance values
        return 4.5 // Placeholder
    }
}

struct ContrastItem: View {
    let label: String
    let ratio: Double
    
    var body: some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .medium))
            
            Spacer()
            
            Text(String(format: "%.1f:1", ratio))
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(ratio >= 4.5 ? .green : .orange)
        }
    }
}

// MARK: - Layout Guide View

struct LayoutGuideView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Layout Design Principles")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    VStack(alignment: .leading, spacing: 16) {
                        GuideSection(
                            title: "Visual Hierarchy",
                            description: "Use size, weight, and color to create clear information hierarchy. Primary elements should be most prominent, followed by secondary and tertiary elements."
                        )
                        
                        GuideSection(
                            title: "White Space",
                            description: "Adequate spacing between elements improves readability and creates visual breathing room. Use consistent spacing scales throughout your design."
                        )
                        
                        GuideSection(
                            title: "Contrast",
                            description: "Ensure sufficient contrast between text and background colors for accessibility. Aim for a minimum contrast ratio of 4.5:1 for normal text."
                        )
                        
                        GuideSection(
                            title: "Consistency",
                            description: "Maintain consistent spacing, typography, and color usage throughout your interface to create a cohesive user experience."
                        )
                    }
                }
                .padding()
            }
            .navigationTitle("Layout Guide")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct GuideSection: View {
    let title: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .fontWeight(.semibold)
            
            Text(description)
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
}

// MARK: - Preview

struct LayoutPreviewView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            LayoutPreviewView()
                .environmentObject(ThemeManager())
        }
    }
} 