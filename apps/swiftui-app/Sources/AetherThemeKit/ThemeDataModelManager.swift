//
//  ThemeDataModelManager.swift
//  Aether SwiftUI App
//
//  Theme data model manager for handling theme import/export,
//  validation, and management using JSON format for portability.
//

import SwiftUI
import Foundation

// MARK: - Theme Data Model Manager

/// Manager for handling theme data models with JSON serialization and validation
class ThemeDataModelManager: ObservableObject {
    @Published var themes: [ThemeDataModel] = []
    @Published var currentTheme: ThemeDataModel?
    @Published var isLoading = false
    @Published var lastError: String?
    
    private let fileManager = FileManager.default
    private let themesDirectory = "Themes"
    
    init() {
        loadThemes()
    }
    
    // MARK: - Theme Management
    
    /// Create a new theme
    func createTheme(name: String, description: String? = nil, author: String? = nil) -> ThemeDataModel {
        let theme = ThemeDataModel(
            name: name,
            description: description,
            author: author
        )
        
        themes.append(theme)
        saveThemes()
        
        if currentTheme == nil {
            currentTheme = theme
        }
        
        return theme
    }
    
    /// Update an existing theme
    func updateTheme(_ theme: ThemeDataModel) {
        if let index = themes.firstIndex(where: { $0.id == theme.id }) {
            var updatedTheme = theme
            updatedTheme.updatedAt = Date()
            themes[index] = updatedTheme
            
            if currentTheme?.id == theme.id {
                currentTheme = updatedTheme
            }
            
            saveThemes()
        }
    }
    
    /// Delete a theme
    func deleteTheme(_ theme: ThemeDataModel) {
        themes.removeAll { $0.id == theme.id }
        
        if currentTheme?.id == theme.id {
            currentTheme = themes.first
        }
        
        saveThemes()
    }
    
    /// Set the current theme
    func setCurrentTheme(_ theme: ThemeDataModel) {
        currentTheme = theme
        UserDefaults.standard.set(theme.id, forKey: "currentThemeId")
    }
    
    // MARK: - Import/Export
    
    /// Export theme to JSON
    func exportTheme(_ theme: ThemeDataModel) -> String? {
        do {
            return try ThemeSerialization.encodeToString(theme)
        } catch {
            lastError = "Failed to export theme: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Export theme to file
    func exportThemeToFile(_ theme: ThemeDataModel, filename: String) -> Bool {
        guard let jsonString = exportTheme(theme) else { return false }
        
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let themesPath = documentsPath.appendingPathComponent(themesDirectory)
            
            // Create themes directory if it doesn't exist
            if !fileManager.fileExists(atPath: themesPath.path) {
                try fileManager.createDirectory(at: themesPath, withIntermediateDirectories: true)
            }
            
            let fileURL = themesPath.appendingPathComponent("\(filename).json")
            try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
            
            return true
        } catch {
            lastError = "Failed to save theme file: \(error.localizedDescription)"
            return false
        }
    }
    
    /// Import theme from JSON string
    func importThemeFromJSON(_ jsonString: String) -> ThemeDataModel? {
        do {
            let theme = try ThemeSerialization.decodeFromString(jsonString)
            
            // Validate the theme
            let validationErrors = ThemeValidation.validate(theme)
            if !validationErrors.isEmpty {
                lastError = "Theme validation failed: \(validationErrors.map { $0.localizedDescription }.joined(separator: ", "))"
                return nil
            }
            
            // Check if theme with same ID already exists
            if themes.contains(where: { $0.id == theme.id }) {
                lastError = "Theme with ID \(theme.id) already exists"
                return nil
            }
            
            themes.append(theme)
            saveThemes()
            
            return theme
        } catch {
            lastError = "Failed to import theme: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import theme from file
    func importThemeFromFile(_ fileURL: URL) -> ThemeDataModel? {
        do {
            let jsonString = try String(contentsOf: fileURL, encoding: .utf8)
            return importThemeFromJSON(jsonString)
        } catch {
            lastError = "Failed to read theme file: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import theme from URL
    func importThemeFromURL(_ url: URL, completion: @escaping (ThemeDataModel?) -> Void) {
        isLoading = true
        lastError = nil
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    self?.lastError = "Network error: \(error.localizedDescription)"
                    completion(nil)
                    return
                }
                
                guard let data = data else {
                    self?.lastError = "No data received"
                    completion(nil)
                    return
                }
                
                guard let jsonString = String(data: data, encoding: .utf8) else {
                    self?.lastError = "Invalid data encoding"
                    completion(nil)
                    return
                }
                
                let theme = self?.importThemeFromJSON(jsonString)
                completion(theme)
            }
        }.resume()
    }
    
    // MARK: - Theme Templates
    
    /// Get predefined theme templates
    func getThemeTemplates() -> [ThemeTemplate] {
        return [
            ThemeTemplate(
                name: "Light Professional",
                description: "Clean, professional light theme",
                category: .business,
                template: createLightProfessionalTemplate()
            ),
            ThemeTemplate(
                name: "Dark Modern",
                description: "Modern dark theme with vibrant accents",
                category: .creative,
                template: createDarkModernTemplate()
            ),
            ThemeTemplate(
                name: "Gaming",
                description: "High contrast gaming theme",
                category: .gaming,
                template: createGamingTemplate()
            ),
            ThemeTemplate(
                name: "Health & Wellness",
                description: "Calming health and wellness theme",
                category: .health,
                template: createHealthWellnessTemplate()
            ),
            ThemeTemplate(
                name: "Finance",
                description: "Trustworthy financial theme",
                category: .finance,
                template: createFinanceTemplate()
            )
        ]
    }
    
    /// Create theme from template
    func createThemeFromTemplate(_ template: ThemeTemplate, name: String) -> ThemeDataModel {
        var theme = template.template
        theme.name = name
        theme.id = UUID().uuidString
        theme.createdAt = Date()
        theme.updatedAt = Date()
        
        themes.append(theme)
        saveThemes()
        
        return theme
    }
    
    // MARK: - Validation
    
    /// Validate a theme
    func validateTheme(_ theme: ThemeDataModel) -> [ThemeValidationError] {
        return ThemeValidation.validate(theme)
    }
    
    /// Check if theme is valid
    func isThemeValid(_ theme: ThemeDataModel) -> Bool {
        return ThemeValidation.validate(theme).isEmpty
    }
    
    // MARK: - Search and Filter
    
    /// Search themes by name or description
    func searchThemes(query: String) -> [ThemeDataModel] {
        let lowercasedQuery = query.lowercased()
        return themes.filter { theme in
            theme.name.lowercased().contains(lowercasedQuery) ||
            (theme.description?.lowercased().contains(lowercasedQuery) ?? false) ||
            theme.metadata.tags.contains { $0.lowercased().contains(lowercasedQuery) }
        }
    }
    
    /// Filter themes by category
    func filterThemesByCategory(_ category: ThemeCategory) -> [ThemeDataModel] {
        return themes.filter { $0.metadata.category == category }
    }
    
    /// Filter themes by platform
    func filterThemesByPlatform(_ platform: Platform) -> [ThemeDataModel] {
        return themes.filter { $0.metadata.platform.contains(platform) }
    }
    
    // MARK: - Persistence
    
    private func loadThemes() {
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let themesPath = documentsPath.appendingPathComponent(themesDirectory)
            
            if !fileManager.fileExists(atPath: themesPath.path) {
                // Create default themes if no themes exist
                createDefaultThemes()
                return
            }
            
            let themeFiles = try fileManager.contentsOfDirectory(at: themesPath, includingPropertiesForKeys: nil)
                .filter { $0.pathExtension == "json" }
            
            for fileURL in themeFiles {
                if let theme = importThemeFromFile(fileURL) {
                    themes.append(theme)
                }
            }
            
            // Load current theme
            if let currentThemeId = UserDefaults.standard.string(forKey: "currentThemeId") {
                currentTheme = themes.first { $0.id == currentThemeId }
            }
            
            if currentTheme == nil {
                currentTheme = themes.first
            }
            
        } catch {
            lastError = "Failed to load themes: \(error.localizedDescription)"
        }
    }
    
    private func saveThemes() {
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let themesPath = documentsPath.appendingPathComponent(themesDirectory)
            
            // Create themes directory if it doesn't exist
            if !fileManager.fileExists(atPath: themesPath.path) {
                try fileManager.createDirectory(at: themesPath, withIntermediateDirectories: true)
            }
            
            // Save each theme to a separate file
            for theme in themes {
                let filename = "\(theme.id).json"
                let fileURL = themesPath.appendingPathComponent(filename)
                
                if let jsonString = exportTheme(theme) {
                    try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
                }
            }
            
        } catch {
            lastError = "Failed to save themes: \(error.localizedDescription)"
        }
    }
    
    private func createDefaultThemes() {
        let templates = getThemeTemplates()
        for template in templates {
            let theme = createThemeFromTemplate(template, name: template.name)
            themes.append(theme)
        }
        saveThemes()
    }
}

// MARK: - Theme Template

struct ThemeTemplate {
    let name: String
    let description: String
    let category: ThemeCategory
    let template: ThemeDataModel
}

// MARK: - Template Creators

extension ThemeDataModelManager {
    private func createLightProfessionalTemplate() -> ThemeDataModel {
        return ThemeDataModel(
            name: "Light Professional",
            description: "Clean, professional light theme",
            author: "Aether Team",
            metadata: ThemeMetadata(
                tags: ["professional", "clean", "light"],
                category: .business,
                platform: [.ios]
            ),
            colors: ColorPalette(
                primary: ColorDefinition(light: "#007AFF", dark: "#0A84FF"),
                secondary: ColorDefinition(light: "#5856D6", dark: "#5E5CE6"),
                tertiary: ColorDefinition(light: "#FF9500", dark: "#FF9F0A"),
                background: BackgroundColors(
                    primary: ColorDefinition(light: "#FFFFFF", dark: "#000000"),
                    secondary: ColorDefinition(light: "#F2F2F7", dark: "#1C1C1E"),
                    tertiary: ColorDefinition(light: "#E5E5EA", dark: "#2C2C2E")
                ),
                surface: SurfaceColors(
                    primary: ColorDefinition(light: "#FFFFFF", dark: "#1C1C1E"),
                    secondary: ColorDefinition(light: "#F2F2F7", dark: "#2C2C2E"),
                    tertiary: ColorDefinition(light: "#E5E5EA", dark: "#3A3A3C"),
                    elevated: ColorDefinition(light: "#FFFFFF", dark: "#2C2C2E")
                ),
                text: TextColors(
                    primary: ColorDefinition(light: "#000000", dark: "#FFFFFF"),
                    secondary: ColorDefinition(light: "#3C3C43", dark: "#EBEBF5"),
                    tertiary: ColorDefinition(light: "#787880", dark: "#EBEBF599"),
                    quaternary: ColorDefinition(light: "#787880", dark: "#EBEBF54D"),
                    inverse: ColorDefinition(light: "#FFFFFF", dark: "#000000")
                ),
                semantic: SemanticColors(
                    success: ColorDefinition(light: "#34C759", dark: "#30D158"),
                    warning: ColorDefinition(light: "#FF9500", dark: "#FF9F0A"),
                    error: ColorDefinition(light: "#FF3B30", dark: "#FF453A"),
                    info: ColorDefinition(light: "#007AFF", dark: "#0A84FF")
                )
            )
        )
    }
    
    private func createDarkModernTemplate() -> ThemeDataModel {
        return ThemeDataModel(
            name: "Dark Modern",
            description: "Modern dark theme with vibrant accents",
            author: "Aether Team",
            metadata: ThemeMetadata(
                tags: ["modern", "dark", "vibrant"],
                category: .creative,
                platform: [.ios]
            ),
            colors: ColorPalette(
                primary: ColorDefinition(light: "#FF6B6B", dark: "#FF6B6B"),
                secondary: ColorDefinition(light: "#4ECDC4", dark: "#4ECDC4"),
                tertiary: ColorDefinition(light: "#45B7D1", dark: "#45B7D1"),
                background: BackgroundColors(
                    primary: ColorDefinition(light: "#2C3E50", dark: "#2C3E50"),
                    secondary: ColorDefinition(light: "#34495E", dark: "#34495E"),
                    tertiary: ColorDefinition(light: "#3A4A5C", dark: "#3A4A5C")
                ),
                surface: SurfaceColors(
                    primary: ColorDefinition(light: "#34495E", dark: "#34495E"),
                    secondary: ColorDefinition(light: "#3A4A5C", dark: "#3A4A5C"),
                    tertiary: ColorDefinition(light: "#4A5A6C", dark: "#4A5A6C"),
                    elevated: ColorDefinition(light: "#3A4A5C", dark: "#3A4A5C")
                ),
                text: TextColors(
                    primary: ColorDefinition(light: "#ECF0F1", dark: "#ECF0F1"),
                    secondary: ColorDefinition(light: "#BDC3C7", dark: "#BDC3C7"),
                    tertiary: ColorDefinition(light: "#95A5A6", dark: "#95A5A6"),
                    quaternary: ColorDefinition(light: "#7F8C8D", dark: "#7F8C8D"),
                    inverse: ColorDefinition(light: "#2C3E50", dark: "#2C3E50")
                ),
                semantic: SemanticColors(
                    success: ColorDefinition(light: "#2ECC71", dark: "#2ECC71"),
                    warning: ColorDefinition(light: "#F39C12", dark: "#F39C12"),
                    error: ColorDefinition(light: "#E74C3C", dark: "#E74C3C"),
                    info: ColorDefinition(light: "#3498DB", dark: "#3498DB")
                )
            )
        )
    }
    
    private func createGamingTemplate() -> ThemeDataModel {
        return ThemeDataModel(
            name: "Gaming",
            description: "High contrast gaming theme",
            author: "Aether Team",
            metadata: ThemeMetadata(
                tags: ["gaming", "high-contrast", "vibrant"],
                category: .gaming,
                platform: [.ios]
            ),
            colors: ColorPalette(
                primary: ColorDefinition(light: "#FFD700", dark: "#FFD700"),
                secondary: ColorDefinition(light: "#FF4500", dark: "#FF4500"),
                tertiary: ColorDefinition(light: "#00FF00", dark: "#00FF00"),
                background: BackgroundColors(
                    primary: ColorDefinition(light: "#000000", dark: "#000000"),
                    secondary: ColorDefinition(light: "#1A1A1A", dark: "#1A1A1A"),
                    tertiary: ColorDefinition(light: "#2A2A2A", dark: "#2A2A2A")
                ),
                surface: SurfaceColors(
                    primary: ColorDefinition(light: "#1A1A1A", dark: "#1A1A1A"),
                    secondary: ColorDefinition(light: "#2A2A2A", dark: "#2A2A2A"),
                    tertiary: ColorDefinition(light: "#3A3A3A", dark: "#3A3A3A"),
                    elevated: ColorDefinition(light: "#2A2A2A", dark: "#2A2A2A")
                ),
                text: TextColors(
                    primary: ColorDefinition(light: "#FFFFFF", dark: "#FFFFFF"),
                    secondary: ColorDefinition(light: "#CCCCCC", dark: "#CCCCCC"),
                    tertiary: ColorDefinition(light: "#999999", dark: "#999999"),
                    quaternary: ColorDefinition(light: "#666666", dark: "#666666"),
                    inverse: ColorDefinition(light: "#000000", dark: "#000000")
                ),
                semantic: SemanticColors(
                    success: ColorDefinition(light: "#00FF00", dark: "#00FF00"),
                    warning: ColorDefinition(light: "#FFD700", dark: "#FFD700"),
                    error: ColorDefinition(light: "#FF0000", dark: "#FF0000"),
                    info: ColorDefinition(light: "#00FFFF", dark: "#00FFFF")
                )
            )
        )
    }
    
    private func createHealthWellnessTemplate() -> ThemeDataModel {
        return ThemeDataModel(
            name: "Health & Wellness",
            description: "Calming health and wellness theme",
            author: "Aether Team",
            metadata: ThemeMetadata(
                tags: ["health", "wellness", "calming"],
                category: .health,
                platform: [.ios]
            ),
            colors: ColorPalette(
                primary: ColorDefinition(light: "#4CAF50", dark: "#4CAF50"),
                secondary: ColorDefinition(light: "#81C784", dark: "#81C784"),
                tertiary: ColorDefinition(light: "#66BB6A", dark: "#66BB6A"),
                background: BackgroundColors(
                    primary: ColorDefinition(light: "#F1F8E9", dark: "#1B5E20"),
                    secondary: ColorDefinition(light: "#E8F5E8", dark: "#2E7D32"),
                    tertiary: ColorDefinition(light: "#C8E6C9", dark: "#388E3C")
                ),
                surface: SurfaceColors(
                    primary: ColorDefinition(light: "#FFFFFF", dark: "#2E7D32"),
                    secondary: ColorDefinition(light: "#F1F8E9", dark: "#388E3C"),
                    tertiary: ColorDefinition(light: "#E8F5E8", dark: "#43A047"),
                    elevated: ColorDefinition(light: "#FFFFFF", dark: "#388E3C")
                ),
                text: TextColors(
                    primary: ColorDefinition(light: "#2E7D32", dark: "#FFFFFF"),
                    secondary: ColorDefinition(light: "#388E3C", dark: "#C8E6C9"),
                    tertiary: ColorDefinition(light: "#43A047", dark: "#A5D6A7"),
                    quaternary: ColorDefinition(light: "#4CAF50", dark: "#81C784"),
                    inverse: ColorDefinition(light: "#FFFFFF", dark: "#2E7D32")
                ),
                semantic: SemanticColors(
                    success: ColorDefinition(light: "#4CAF50", dark: "#4CAF50"),
                    warning: ColorDefinition(light: "#FF9800", dark: "#FF9800"),
                    error: ColorDefinition(light: "#F44336", dark: "#F44336"),
                    info: ColorDefinition(light: "#2196F3", dark: "#2196F3")
                )
            )
        )
    }
    
    private func createFinanceTemplate() -> ThemeDataModel {
        return ThemeDataModel(
            name: "Finance",
            description: "Trustworthy financial theme",
            author: "Aether Team",
            metadata: ThemeMetadata(
                tags: ["finance", "trustworthy", "professional"],
                category: .finance,
                platform: [.ios]
            ),
            colors: ColorPalette(
                primary: ColorDefinition(light: "#1976D2", dark: "#1976D2"),
                secondary: ColorDefinition(light: "#42A5F5", dark: "#42A5F5"),
                tertiary: ColorDefinition(light: "#64B5F6", dark: "#64B5F6"),
                background: BackgroundColors(
                    primary: ColorDefinition(light: "#FAFAFA", dark: "#0D47A1"),
                    secondary: ColorDefinition(light: "#F5F5F5", dark: "#1565C0"),
                    tertiary: ColorDefinition(light: "#EEEEEE", dark: "#1976D2")
                ),
                surface: SurfaceColors(
                    primary: ColorDefinition(light: "#FFFFFF", dark: "#1565C0"),
                    secondary: ColorDefinition(light: "#FAFAFA", dark: "#1976D2"),
                    tertiary: ColorDefinition(light: "#F5F5F5", dark: "#1E88E5"),
                    elevated: ColorDefinition(light: "#FFFFFF", dark: "#1976D2")
                ),
                text: TextColors(
                    primary: ColorDefinition(light: "#0D47A1", dark: "#FFFFFF"),
                    secondary: ColorDefinition(light: "#1565C0", dark: "#BBDEFB"),
                    tertiary: ColorDefinition(light: "#1976D2", dark: "#90CAF9"),
                    quaternary: ColorDefinition(light: "#1E88E5", dark: "#64B5F6"),
                    inverse: ColorDefinition(light: "#FFFFFF", dark: "#0D47A1")
                ),
                semantic: SemanticColors(
                    success: ColorDefinition(light: "#4CAF50", dark: "#4CAF50"),
                    warning: ColorDefinition(light: "#FF9800", dark: "#FF9800"),
                    error: ColorDefinition(light: "#F44336", dark: "#F44336"),
                    info: ColorDefinition(light: "#2196F3", dark: "#2196F3")
                )
            )
        )
    }
}

// MARK: - Preview

struct ThemeDataModelManager_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("Theme Data Model Manager")
                .font(.title)
            
            Text("Manages theme import/export and validation")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
    }
} 