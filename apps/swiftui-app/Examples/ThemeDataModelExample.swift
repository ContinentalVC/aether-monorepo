//
//  ThemeDataModelExample.swift
//  Aether SwiftUI App
//
//  Example view demonstrating the Theme Data Model system with
//  import/export, validation, and management features.
//

import SwiftUI
import UniformTypeIdentifiers

// MARK: - Theme Data Model Example View

/// Main example view for the Theme Data Model system
struct ThemeDataModelExample: View {
    @StateObject private var themeDataManager = ThemeDataModelManager()
    @EnvironmentObject var themeManager: ThemeManager
    @State private var showingImportSheet = false
    @State private var showingExportSheet = false
    @State private var showingTemplateSheet = false
    @State private var selectedTheme: ThemeDataModel?
    @State private var searchText = ""
    @State private var selectedCategory: ThemeCategory = .general
    
    var filteredThemes: [ThemeDataModel] {
        var themes = themeDataManager.themes
        
        if !searchText.isEmpty {
            themes = themeDataManager.searchThemes(query: searchText)
        }
        
        if selectedCategory != .general {
            themes = themes.filter { $0.metadata.category == selectedCategory }
        }
        
        return themes
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header section
                HeaderSection()
                
                // Search and filter section
                SearchFilterSection()
                
                // Themes list
                ThemesListSection()
            }
            .navigationTitle("Theme Data Model")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button("Import Theme") {
                            showingImportSheet = true
                        }
                        
                        Button("Create from Template") {
                            showingTemplateSheet = true
                        }
                        
                        Button("Export All") {
                            exportAllThemes()
                        }
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .sheet(isPresented: $showingImportSheet) {
            ThemeImportView(themeDataManager: themeDataManager)
        }
        .sheet(isPresented: $showingExportSheet) {
            ThemeExportView(theme: selectedTheme, themeDataManager: themeDataManager)
        }
        .sheet(isPresented: $showingTemplateSheet) {
            ThemeTemplateView(themeDataManager: themeDataManager)
        }
        .alert("Error", isPresented: .constant(themeDataManager.lastError != nil)) {
            Button("OK") {
                themeDataManager.lastError = nil
            }
        } message: {
            Text(themeDataManager.lastError ?? "")
        }
    }
    
    private func exportAllThemes() {
        // Implementation for exporting all themes
    }
}

// MARK: - Header Section

struct HeaderSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Theme Data Model System")
                .font(themeManager.currentTheme.typography.heading(size: .h1))
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text("Manage, import, export, and validate themes using JSON format for maximum portability and consistency.")
                .font(themeManager.currentTheme.typography.body(size: .md))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .lineSpacing(4)
            
            // Features overview
            FeaturesOverview()
        }
        .padding()
        .background(themeManager.currentTheme.surface)
    }
}

struct FeaturesOverview: View {
    @EnvironmentObject var themeManager: ThemeManager
    
    let features = [
        (icon: "📄", title: "JSON Format", description: "Lightweight, human-readable format"),
        (icon: "🔄", title: "Import/Export", description: "Easy theme sharing and backup"),
        (icon: "✅", title: "Validation", description: "Automatic theme validation"),
        (icon: "📱", title: "Cross-Platform", description: "Works across all platforms"),
        (icon: "🎨", title: "Templates", description: "Pre-built theme templates"),
        (icon: "🔍", title: "Search & Filter", description: "Find themes quickly")
    ]
    
    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 12) {
            ForEach(features, id: \.title) { feature in
                FeatureCard(
                    icon: feature.icon,
                    title: feature.title,
                    description: feature.description
                )
            }
        }
    }
}

struct FeatureCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(icon)
                .font(.title2)
            
            Text(title)
                .font(themeManager.currentTheme.typography.body(size: .sm))
                .fontWeight(.semibold)
                .foregroundColor(themeManager.currentTheme.textPrimary)
            
            Text(description)
                .font(themeManager.currentTheme.typography.body(size: .xs))
                .foregroundColor(themeManager.currentTheme.textSecondary)
                .lineLimit(2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(themeManager.currentTheme.background.secondary)
        .cornerRadius(8)
    }
}

// MARK: - Search and Filter Section

struct SearchFilterSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var searchText: String
    @Binding var selectedCategory: ThemeCategory
    
    var body: some View {
        VStack(spacing: 12) {
            // Search bar
            SearchBar(text: $searchText)
            
            // Category filter
            CategoryFilter(selectedCategory: $selectedCategory)
        }
        .padding(.horizontal)
        .padding(.bottom, 8)
        .background(themeManager.currentTheme.background.secondary)
    }
}

struct SearchBar: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var text: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(themeManager.currentTheme.textSecondary)
            
            TextField("Search themes...", text: $text)
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
    }
}

struct CategoryFilter: View {
    @EnvironmentObject var themeManager: ThemeManager
    @Binding var selectedCategory: ThemeCategory
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(ThemeCategory.allCases, id: \.self) { category in
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
    let category: ThemeCategory
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

// MARK: - Themes List Section

struct ThemesListSection: View {
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var themeDataManager: ThemeDataModelManager
    let themes: [ThemeDataModel]
    @Binding var selectedTheme: ThemeDataModel?
    @Binding var showingExportSheet: Bool
    
    var body: some View {
        List {
            ForEach(themes) { theme in
                ThemeRow(
                    theme: theme,
                    isCurrent: themeDataManager.currentTheme?.id == theme.id,
                    onSelect: {
                        selectedTheme = theme
                        showingExportSheet = true
                    },
                    onSetCurrent: {
                        themeDataManager.setCurrentTheme(theme)
                    },
                    onDelete: {
                        themeDataManager.deleteTheme(theme)
                    }
                )
            }
        }
        .listStyle(PlainListStyle())
    }
}

struct ThemeRow: View {
    @EnvironmentObject var themeManager: ThemeManager
    let theme: ThemeDataModel
    let isCurrent: Bool
    let onSelect: () -> Void
    let onSetCurrent: () -> Void
    let onDelete: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(theme.name)
                            .font(themeManager.currentTheme.typography.body(size: .md))
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        if isCurrent {
                            Text("Current")
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(themeManager.currentTheme.primary)
                                .cornerRadius(4)
                        }
                    }
                    
                    if let description = theme.description {
                        Text(description)
                            .font(themeManager.currentTheme.typography.body(size: .sm))
                            .foregroundColor(themeManager.currentTheme.textSecondary)
                            .lineLimit(2)
                    }
                    
                    HStack {
                        Text("v\(theme.version)")
                            .font(themeManager.currentTheme.typography.body(size: .xs))
                            .foregroundColor(themeManager.currentTheme.textTertiary)
                        
                        Text("•")
                            .font(themeManager.currentTheme.typography.body(size: .xs))
                            .foregroundColor(themeManager.currentTheme.textTertiary)
                        
                        Text(theme.metadata.category.rawValue)
                            .font(themeManager.currentTheme.typography.body(size: .xs))
                            .foregroundColor(themeManager.currentTheme.textTertiary)
                        
                        if let author = theme.author {
                            Text("•")
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.textTertiary)
                            
                            Text("by \(author)")
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.textTertiary)
                        }
                    }
                }
                
                Spacer()
                
                VStack(spacing: 4) {
                    Button(action: onSelect) {
                        Image(systemName: "square.and.arrow.up")
                            .foregroundColor(themeManager.currentTheme.primary)
                    }
                    
                    if !isCurrent {
                        Button(action: onSetCurrent) {
                            Image(systemName: "checkmark.circle")
                                .foregroundColor(themeManager.currentTheme.secondary)
                        }
                    }
                    
                    Button(action: onDelete) {
                        Image(systemName: "trash")
                            .foregroundColor(themeManager.currentTheme.error)
                    }
                }
            }
            
            // Tags
            if !theme.metadata.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(theme.metadata.tags, id: \.self) { tag in
                            Text(tag)
                                .font(themeManager.currentTheme.typography.body(size: .xs))
                                .foregroundColor(themeManager.currentTheme.primary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 2)
                                .background(themeManager.currentTheme.primary.opacity(0.1))
                                .cornerRadius(4)
                        }
                    }
                }
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Theme Import View

struct ThemeImportView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var themeDataManager: ThemeDataModelManager
    @State private var importText = ""
    @State private var showingFilePicker = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Import Theme")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Paste JSON theme data or import from a file")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.center)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Theme JSON")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    TextEditor(text: $importText)
                        .frame(height: 200)
                        .padding(8)
                        .background(themeManager.currentTheme.surface)
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(themeManager.currentTheme.border, lineWidth: 1)
                        )
                }
                
                HStack(spacing: 12) {
                    Button("Import from File") {
                        showingFilePicker = true
                    }
                    .buttonStyle(.bordered)
                    
                    Spacer()
                    
                    Button("Import") {
                        importTheme()
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(importText.isEmpty)
                }
                
                Spacer()
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
        .fileImporter(
            isPresented: $showingFilePicker,
            allowedContentTypes: [UTType.json],
            allowsMultipleSelection: false
        ) { result in
            handleFileImport(result)
        }
    }
    
    private func importTheme() {
        if let theme = themeDataManager.importThemeFromJSON(importText) {
            dismiss()
        }
    }
    
    private func handleFileImport(_ result: Result<[URL], Error>) {
        switch result {
        case .success(let urls):
            if let url = urls.first {
                if let theme = themeDataManager.importThemeFromFile(url) {
                    dismiss()
                }
            }
        case .failure(let error):
            themeDataManager.lastError = error.localizedDescription
        }
    }
}

// MARK: - Theme Export View

struct ThemeExportView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    let theme: ThemeDataModel?
    @ObservedObject var themeDataManager: ThemeDataModelManager
    @State private var exportText = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Export Theme")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                if let theme = theme {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Theme: \(theme.name)")
                            .font(themeManager.currentTheme.typography.body(size: .md))
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        Text("Version: \(theme.version)")
                            .font(themeManager.currentTheme.typography.body(size: .sm))
                            .foregroundColor(themeManager.currentTheme.textSecondary)
                    }
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Theme JSON")
                        .font(themeManager.currentTheme.typography.body(size: .sm))
                        .fontWeight(.semibold)
                        .foregroundColor(themeManager.currentTheme.textPrimary)
                    
                    ScrollView {
                        Text(exportText)
                            .font(.system(.caption, design: .monospaced))
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                            .padding(8)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(themeManager.currentTheme.surface)
                            .cornerRadius(8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(themeManager.currentTheme.border, lineWidth: 1)
                            )
                    }
                    .frame(height: 300)
                }
                
                HStack(spacing: 12) {
                    Button("Copy to Clipboard") {
                        UIPasteboard.general.string = exportText
                    }
                    .buttonStyle(.bordered)
                    
                    Spacer()
                    
                    Button("Save to File") {
                        saveToFile()
                    }
                    .buttonStyle(.borderedProminent)
                }
                
                Spacer()
            }
            .padding()
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            if let theme = theme {
                exportText = themeDataManager.exportTheme(theme) ?? "Failed to export theme"
            }
        }
    }
    
    private func saveToFile() {
        if let theme = theme {
            let filename = "\(theme.name.replacingOccurrences(of: " ", with: "_")).json"
            _ = themeDataManager.exportThemeToFile(theme, filename: filename)
        }
    }
}

// MARK: - Theme Template View

struct ThemeTemplateView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var themeManager: ThemeManager
    @ObservedObject var themeDataManager: ThemeDataModelManager
    @State private var selectedTemplate: ThemeTemplate?
    @State private var themeName = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Create from Template")
                    .font(themeManager.currentTheme.typography.heading(size: .h2))
                    .foregroundColor(themeManager.currentTheme.textPrimary)
                
                Text("Choose a template to create a new theme")
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .foregroundColor(themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.center)
                
                ScrollView {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                        ForEach(themeDataManager.getThemeTemplates(), id: \.name) { template in
                            TemplateCard(
                                template: template,
                                isSelected: selectedTemplate?.name == template.name
                            ) {
                                selectedTemplate = template
                                themeName = template.name
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                
                if let template = selectedTemplate {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Theme Name")
                            .font(themeManager.currentTheme.typography.body(size: .sm))
                            .fontWeight(.semibold)
                            .foregroundColor(themeManager.currentTheme.textPrimary)
                        
                        TextField("Enter theme name", text: $themeName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    .padding(.horizontal)
                }
                
                HStack(spacing: 12) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .buttonStyle(.bordered)
                    
                    Spacer()
                    
                    Button("Create Theme") {
                        createTheme()
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(selectedTemplate == nil || themeName.isEmpty)
                }
                .padding(.horizontal)
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    private func createTheme() {
        if let template = selectedTemplate {
            _ = themeDataManager.createThemeFromTemplate(template, name: themeName)
            dismiss()
        }
    }
}

struct TemplateCard: View {
    @EnvironmentObject var themeManager: ThemeManager
    let template: ThemeTemplate
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 8) {
                Text(template.name)
                    .font(themeManager.currentTheme.typography.body(size: .md))
                    .fontWeight(.semibold)
                    .foregroundColor(isSelected ? .white : themeManager.currentTheme.textPrimary)
                    .multilineTextAlignment(.leading)
                
                Text(template.description)
                    .font(themeManager.currentTheme.typography.body(size: .sm))
                    .foregroundColor(isSelected ? .white.opacity(0.8) : themeManager.currentTheme.textSecondary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
                
                Text(template.category.rawValue)
                    .font(themeManager.currentTheme.typography.body(size: .xs))
                    .foregroundColor(isSelected ? .white.opacity(0.6) : themeManager.currentTheme.textTertiary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
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

// MARK: - Preview

struct ThemeDataModelExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeDataModelExample()
            .environmentObject(ThemeManager())
    }
} 