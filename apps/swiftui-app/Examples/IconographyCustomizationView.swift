//
//  IconographyCustomizationView.swift
//  Aether SwiftUI App
//
//  Comprehensive iconography customization interface with style controls,
//  icon browsing, and management features for consistent iconography.
//

import SwiftUI

// MARK: - Iconography Customization View

/// Main view for iconography customization
struct IconographyCustomizationView: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedTab = 0
    @State private var showingIconGuide = false
    @State private var searchText = ""
    @State private var selectedCategory: IconCategory = .navigation
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Tab selector
                IconographyTabSelector(selectedTab: $selectedTab)
                
                // Content area
                TabView(selection: $selectedTab) {
                    IconStyleCustomizationView()
                        .tag(0)
                    
                    IconBrowserView()
                        .tag(1)
                    
                    IconMappingView()
                        .tag(2)
                    
                    IconPreviewView()
                        .tag(3)
                }
                .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            }
            .navigationTitle("Iconography")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveIconographySettings()
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .sheet(isPresented: $showingIconGuide) {
            IconographyGuideView()
        }
    }
    
    private func saveIconographySettings() {
        // Save current iconography configuration
        // This would typically save to UserDefaults or a file
    }
}

// MARK: - Iconography Tab Selector

struct IconographyTabSelector: View {
    @Binding var selectedTab: Int
    
    private let tabs = ["Style", "Browse", "Mapping", "Preview"]
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(0..<tabs.count, id: \.self) { index in
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        selectedTab = index
                    }
                }) {
                    VStack(spacing: 4) {
                        Text(tabs[index])
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(selectedTab == index ? .primary : .secondary)
                        
                        Rectangle()
                            .fill(selectedTab == index ? Color.accentColor : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
    }
}

// MARK: - Icon Style Customization View

struct IconStyleCustomizationView: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Current style preview
                CurrentStylePreview()
                
                // Icon family selection
                IconFamilySection()
                
                // Icon weight selection
                IconWeightSection()
                
                // Icon size selection
                IconSizeSection()
                
                // Color treatment selection
                ColorTreatmentSection()
                
                // Positioning selection
                PositioningSection()
                
                // Animation selection
                AnimationSection()
            }
            .padding()
        }
    }
}

struct CurrentStylePreview: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Current Style Preview")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            HStack(spacing: 20) {
                // Icon preview
                VStack(spacing: 8) {
                    iconographyManager.icon("star.fill")
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
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
        .shadow(color: themeManager.currentTheme.shadow.opacity(0.1), radius: 4, x: 0, y: 2)
    }
}

struct StyleDetailRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .foregroundColor(themeManager.currentTheme.textSecondary)
            
            Spacer()
            
            Text(value)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .foregroundColor(themeManager.currentTheme.textPrimary)
        }
    }
}

struct IconFamilySection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Icon Family")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(IconFamily.allCases, id: \.self) { family in
                    IconFamilyCard(
                        family: family,
                        isSelected: iconographyManager.currentStyle.family == family
                    )
                }
            }
        }
    }
}

struct IconFamilyCard: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let family: IconFamily
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.family = family
        }) {
            VStack(spacing: 8) {
                Image(systemName: family.previewIcon)
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? .white : themeManager.currentTheme.textPrimary)
                
                Text(family.rawValue)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(isSelected ? .white : themeManager.currentTheme.textPrimary)
                    .multilineTextAlignment(.center)
                
                Text(family.description)
                    .font(themeManager.currentTheme.typography.body(size: .xs))
                    .foregroundColor(isSelected ? .white.opacity(0.8) : themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity)
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary : themeManager.currentTheme.surface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isSelected ? themeManager.currentTheme.primary : themeManager.currentTheme.border, lineWidth: 1)
            )
        }
    }
}

struct IconWeightSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Icon Weight")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                ForEach(IconWeight.allCases, id: \.self) { weight in
                    IconWeightRow(
                        weight: weight,
                        isSelected: iconographyManager.currentStyle.weight == weight
                    )
                }
            }
        }
    }
}

struct IconWeightRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let weight: IconWeight
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.weight = weight
        }) {
            HStack {
                Image(systemName: "star.fill")
                    .font(.system(size: 16, weight: weight.fontWeight))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(weight.rawValue)
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text(weight.description)
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(themeManager.currentTheme.primary)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary.opacity(0.1) : themeManager.currentTheme.surface)
            )
        }
    }
}

struct IconSizeSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Icon Size")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                ForEach(IconSize.allCases, id: \.self) { size in
                    IconSizeRow(
                        size: size,
                        isSelected: iconographyManager.currentStyle.size == size
                    )
                }
            }
        }
    }
}

struct IconSizeRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let size: IconSize
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.size = size
        }) {
            HStack {
                Image(systemName: "star.fill")
                    .font(.system(size: size.size))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(size.rawValue)
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text(size.description)
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(themeManager.currentTheme.primary)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary.opacity(0.1) : themeManager.currentTheme.surface)
            )
        }
    }
}

struct ColorTreatmentSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Color Treatment")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
                ForEach(IconColorTreatment.allCases, id: \.self) { treatment in
                    ColorTreatmentCard(
                        treatment: treatment,
                        isSelected: iconographyManager.currentStyle.colorTreatment == treatment
                    )
                }
            }
        }
    }
}

struct ColorTreatmentCard: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let treatment: IconColorTreatment
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.colorTreatment = treatment
        }) {
            VStack(spacing: 8) {
                Image(systemName: "star.fill")
                    .font(.system(size: 20))
                    .foregroundColor(iconColor)
                
                Text(treatment.rawValue)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .multilineTextAlignment(.center)
                
                Text(treatment.description)
                    .font(themeManager.currentTheme.typography.body(size: .xs))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
            }
            .frame(maxWidth: .infinity)
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary.opacity(0.1) : themeManager.currentTheme.surface)
            )
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(isSelected ? themeManager.currentTheme.primary : themeManager.currentTheme.border, lineWidth: 1)
            )
        }
    }
    
    private var iconColor: Color {
        switch treatment {
        case .theme: return themeManager.currentTheme.primary
        case .monochrome: return themeManager.currentTheme.textSecondary
        case .accent: return themeManager.currentTheme.secondary
        case .semantic: return themeManager.currentTheme.success
        case .custom: return themeManager.currentTheme.primary
        }
    }
}

struct PositioningSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Positioning")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                ForEach(IconPositioning.allCases, id: \.self) { positioning in
                    PositioningRow(
                        positioning: positioning,
                        isSelected: iconographyManager.currentStyle.positioning == positioning
                    )
                }
            }
        }
    }
}

struct PositioningRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let positioning: IconPositioning
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.positioning = positioning
        }) {
            HStack {
                Image(systemName: "star.fill")
                    .font(.system(size: 16))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(positioning.rawValue)
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text(positioning.description)
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(themeManager.currentTheme.primary)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary.opacity(0.1) : themeManager.currentTheme.surface)
            )
        }
    }
}

struct AnimationSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Animation")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                ForEach(IconAnimation.allCases, id: \.self) { animation in
                    AnimationRow(
                        animation: animation,
                        isSelected: iconographyManager.currentStyle.animation == animation
                    )
                }
            }
        }
    }
}

struct AnimationRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let animation: IconAnimation
    let isSelected: Bool
    
    var body: some View {
        Button(action: {
            iconographyManager.currentStyle.animation = animation
        }) {
            HStack {
                Image(systemName: "star.fill")
                    .font(.system(size: 16))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                    .animation(animation.animationValue, value: isSelected)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(animation.rawValue)
                        .font(themeManager.currentTheme.typography.body(size: .md))
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    Text(animation.description)
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(themeManager.currentTheme.primary)
                }
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(isSelected ? themeManager.currentTheme.primary.opacity(0.1) : themeManager.currentTheme.surface)
            )
        }
    }
}

// MARK: - Icon Browser View

struct IconBrowserView: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var selectedCategory: IconCategory = .navigation
    @State private var searchText = ""
    
    var filteredIcons: [IconDefinition] {
        let categoryIcons = iconographyManager.icons(for: selectedCategory)
        if searchText.isEmpty {
            return categoryIcons
        }
        return iconographyManager.searchIcons(query: searchText)
    }
    
    var body: some View {
        VStack(spacing: 16) {
            // Search bar
            SearchBar(text: $searchText)
            
            // Category selector
            CategorySelector(selectedCategory: $selectedCategory)
            
            // Icon grid
            ScrollView {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 16) {
                    ForEach(filteredIcons, id: \.name) { icon in
                        IconGridItem(icon: icon)
                    }
                }
                .padding()
            }
        }
    }
}

struct SearchBar: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(themeManager.currentTheme.textSecondary)
            
            TextField("Search icons...", text: $text)
                .textFieldStyle(PlainTextFieldStyle())
            
            if !text.isEmpty {
                Button(action: {
                    text = ""
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(themeManager.currentTheme.textSecondary)
                }
            }
        }
        .padding(12)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(themeManager.currentTheme.border, lineWidth: 1)
        )
        .padding(.horizontal)
    }
}

struct CategorySelector: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var selectedCategory: IconCategory
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(IconCategory.allCases, id: \.self) { category in
                    CategoryButton(
                        category: category,
                        isSelected: selectedCategory == category
                    ) {
                        selectedCategory = category
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}

struct CategoryButton: View {
    @EnvironmentObject var themeManager: ThemeManager
    let category: IconCategory
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(category.rawValue)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .foregroundColor(isSelected ? .white : themeManager.currentTheme.textPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 20)
                        .fill(isSelected ? themeManager.currentTheme.primary : themeManager.currentTheme.surface)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(isSelected ? themeManager.currentTheme.primary : themeManager.currentTheme.border, lineWidth: 1)
                )
        }
    }
}

struct IconGridItem: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let icon: IconDefinition
    
    var body: some View {
        VStack(spacing: 8) {
            iconographyManager.icon(icon.name)
                .font(.system(size: 24))
            
            Text(icon.name)
                .font(themeManager.currentTheme.typography.body(size: .xs))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .multilineTextAlignment(.center)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity)
        .padding(8)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(themeManager.currentTheme.border, lineWidth: 1)
        )
    }
}

// MARK: - Icon Mapping View

struct IconMappingView: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var newMapping = ""
    @State private var selectedIcon = ""
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Icon Mappings")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("Map icon names to different icons for consistent usage across your app.")
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .multilineTextAlignment(.center)
            
            // Add new mapping
            AddMappingSection()
            
            // Existing mappings
            ExistingMappingsSection()
            
            Spacer()
        }
        .padding()
    }
}

struct AddMappingSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    @State private var originalName = ""
    @State private var mappedName = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Add New Mapping")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            VStack(spacing: 8) {
                TextField("Original icon name", text: $originalName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                TextField("Mapped icon name", text: $mappedName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button("Add Mapping") {
                    if !originalName.isEmpty && !mappedName.isEmpty {
                        iconographyManager.mapIcon(originalName, to: mappedName)
                        originalName = ""
                        mappedName = ""
                    }
                }
                .disabled(originalName.isEmpty || mappedName.isEmpty)
                .buttonStyle(.borderedProminent)
            }
        }
        .padding()
        .background(themeManager.currentTheme.surface)
        .cornerRadius(12)
    }
}

struct ExistingMappingsSection: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Existing Mappings")
                .font(themeManager.currentTheme.typography.heading(size: .h3))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            if iconographyManager.iconMappings.isEmpty {
                Text("No mappings defined")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding()
            } else {
                ForEach(Array(iconographyManager.iconMappings.keys.sorted()), id: \.self) { key in
                    MappingRow(
                        originalName: key,
                        mappedName: iconographyManager.iconMappings[key] ?? ""
                    )
                }
            }
        }
    }
}

struct MappingRow: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    let originalName: String
    let mappedName: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(originalName)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("→ \(mappedName)")
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
            }
            
            Spacer()
            
            Button("Remove") {
                // Remove mapping
            }
            .font(themeManager.currentTheme.typography.body(size: .sm))
            .foregroundColor(themeManager.currentTheme.error)
        }
        .padding(12)
        .background(themeManager.currentTheme.surface)
        .cornerRadius(8)
    }
}

// MARK: - Icon Preview View

struct IconPreviewView: View {
    @EnvironmentObject var iconographyManager: IconographyManager
    @EnvironmentObject var themeManager: ThemeManager
    
    let sampleIcons = ["star.fill", "heart.fill", "gear", "person.fill", "house.fill", "magnifyingglass"]
    
    var body: some View {
        VStack(spacing: 24) {
            Text("Icon Preview")
                .font(themeManager.currentTheme.typography.heading(size: .h2))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            // Different sizes
            VStack(alignment: .leading, spacing: 16) {
                Text("Different Sizes")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                HStack(spacing: 20) {
                    ForEach(IconSize.allCases, id: \.self) { size in
                        VStack(spacing: 4) {
                            iconographyManager.icon("star.fill", size: size)
                            Text(size.rawValue)
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.textSecondary)
                        }
                    }
                }
            }
            
            // Different weights
            VStack(alignment: .leading, spacing: 16) {
                Text("Different Weights")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                HStack(spacing: 20) {
                    ForEach(IconWeight.allCases, id: \.self) { weight in
                        VStack(spacing: 4) {
                            var style = iconographyManager.currentStyle
                            style.weight = weight
                            iconographyManager.icon("star.fill", style: style)
                            Text(weight.rawValue)
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.textSecondary)
                        }
                    }
                }
            }
            
            // Sample icons
            VStack(alignment: .leading, spacing: 16) {
                Text("Sample Icons")
                    .font(themeManager.currentTheme.typography.heading(size: .h3))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 3), spacing: 16) {
                    ForEach(sampleIcons, id: \.self) { iconName in
                        VStack(spacing: 8) {
                            iconographyManager.icon(iconName)
                            Text(iconName)
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                    }
                }
            }
            
            Spacer()
        }
        .padding()
    }
}

// MARK: - Preview

struct IconographyCustomizationView_Previews: PreviewProvider {
    static var previews: some View {
        IconographyCustomizationView()
            .environmentObject(IconographyManager())
            .environmentObject(ThemeManager())
    }
} 