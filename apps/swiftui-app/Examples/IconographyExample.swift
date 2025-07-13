//
//  IconographyExample.swift
//  Aether SwiftUI App
//
//  Example view demonstrating the Iconography system with style customization,
//  icon browsing, and management features for consistent iconography.
//

import SwiftUI

// MARK: - Iconography Example View

/// Main example view for the Iconography system
struct IconographyExample: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingIconographyCustomization = false
    
    let sampleIcons = ["star.fill", "heart.fill", "gear", "person.fill", "house.fill", "magnifyingglass", "plus", "checkmark"]
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 32) {
                    // Header section
                    HeaderSection()
                    
                    // Description section
                    DescriptionSection()
                    
                    // Current style section
                    CurrentStyleSection()
                    
                    // Features section
                    FeaturesSection()
                    
                    // Icon families section
                    IconFamiliesSection()
                    
                    // Sample icons section
                    SampleIconsSection()
                    
                    // Icon categories section
                    IconCategoriesSection()
                    
                    // Action buttons
                    ActionButtonsSection()
                }
                .padding()
            }
            .navigationTitle("Iconography System")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingIconographyCustomization) {
                IconographyCustomizationView()
            }
        }
    }
}

// MARK: - Header Section

struct HeaderSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Iconography System")
                .font(themeManager.currentTheme.typography.heading(size: .h1))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("Consistent icon styling and management")
                .font(themeManager.currentTheme.typography.body(size: .lg))
                .foregroundColor(themeManager.currentTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - Description Section

struct DescriptionSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("What is Iconography?")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("The Iconography system provides consistent icon styling across your application. It ensures all icons follow the same design principles regarding size, weight, positioning, and color treatment.")
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .lineSpacing(4)
        }
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(themeManager.currentTheme.primary.opacity(0.1))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(themeManager.currentTheme.primary, lineWidth: 2)
                .padding(.leading, -2)
        )
    }
}

// MARK: - Current Style Section

struct CurrentStyleSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Current Icon Style")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            HStack(spacing: 20) {
                // Icon preview
                VStack(spacing: 8) {
                    iconographyManager.icon("star.fill")
                        .font(.system(size: 32))
                    Text("Sample Icon")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                // Style details
                VStack(alignment: .leading, spacing: 4) {
                    StyleDetailRow(label: "Family", value: iconographyManager.currentStyle.family.rawValue)
                    StyleDetailRow(label: "Weight", value: iconographyManager.currentStyle.weight.rawValue)
                    StyleDetailRow(label: "Size", value: iconographyManager.currentStyle.size.rawValue)
                    StyleDetailRow(label: "Color", value: iconographyManager.currentStyle.colorTreatment.rawValue)
                }
                
                Spacer()
            }
            .padding(20)
            .background(themeManager.currentTheme.surface)
            .cornerRadius(12)
            .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
        }
    }
}

// MARK: - Features Section

struct FeaturesSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    let features = [
        (icon: "🎨", title: "Style Consistency", description: "Maintain consistent icon styling across your app"),
        (icon: "📏", title: "Size Management", description: "Standardized icon sizes for different contexts"),
        (icon: "⚖️", title: "Weight Control", description: "Adjust icon weight for visual hierarchy"),
        (icon: "🎭", title: "Animation Support", description: "Add subtle animations to interactive icons")
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Key Features")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 12) {
                ForEach(features, id: \.title) { feature in
                    FeatureRow(
                        icon: feature.icon,
                        title: feature.title,
                        description: feature.description
                    )
                }
            }
        }
    }
}

struct FeatureRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 16) {
            Text(icon)
                .font(.system(size: 24))
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .fontWeight(.semibold)
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text(description)
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

// MARK: - Icon Families Section

struct IconFamiliesSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    let families = [
        (name: "SF Symbols", description: "Apple's system icons", icon: "★"),
        (name: "Custom", description: "Custom icon set", icon: "★"),
        (name: "Outlined", description: "Clean outlined icons", icon: "☆"),
        (name: "Filled", description: "Solid filled icons", icon: "★"),
        (name: "Rounded", description: "Soft rounded corners", icon: "●"),
        (name: "Sharp", description: "Sharp geometric shapes", icon: "◆")
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Icon Families")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(families, id: \.name) { family in
                    IconFamilyCard(
                        name: family.name,
                        description: family.description,
                        icon: family.icon
                    )
                }
            }
        }
    }
}

struct IconFamilyCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    let name: String
    let description: String
    let icon: String
    
    var body: some View {
        VStack(spacing: 12) {
            Text(icon)
                .font(.system(size: 32))
            
            Text(name)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .fontWeight(.semibold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
                .multilineTextAlignment(.center)
            
            Text(description)
                .font(themeManager.currentTheme.typography.body(size: .xs))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .multilineTextAlignment(.center)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Sample Icons Section

struct SampleIconsSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    let sampleIcons = ["star.fill", "heart.fill", "gear", "person.fill", "house.fill", "magnifyingglass", "plus", "checkmark"]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Sample Icons")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 12) {
                ForEach(sampleIcons, id: \.self) { iconName in
                    SampleIconCard(iconName: iconName)
                }
            }
        }
    }
}

struct SampleIconCard: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let iconName: String
    
    var body: some View {
        VStack(spacing: 8) {
            iconographyManager.icon(iconName)
                .font(.system(size: 24))
            
            Text(iconName)
                .font(themeManager.currentTheme.typography.body(size: .xs))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .multilineTextAlignment(.center)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Icon Categories Section

struct IconCategoriesSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Icon Categories")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                ForEach(IconCategory.allCases, id: \.self) { category in
                    IconCategoryRow(category: category)
                }
            }
        }
    }
}

struct IconCategoryRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let category: IconCategory
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(category.rawValue)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("\(iconographyManager.icons(for: category).count) icons")
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundColor(themeManager.currentTheme.textTertiary)
        }
        .padding(16)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

// MARK: - Action Buttons Section

struct ActionButtonsSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var showingIconographyCustomization: Bool
    
    var body: some View {
        VStack(spacing: 12) {
            Button(action: {
                showingIconographyCustomization = true
            }) {
                Text("Customize Iconography")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(16)
                    .background(themeManager.currentTheme.primary)
                    .cornerRadius(12)
            }
        }
    }
}

// MARK: - Preview

struct IconographyExample_Previews: PreviewProvider {
    static var previews: some View {
        IconographyExample()
            .environmentObject(IconographyManager())
            .environmentObject(ThemeManager())
    }
} 