//
//  ThemeSchemaManager.swift
//  Aether SwiftUI App
//
//  Theme schema manager for handling schema import/export,
//  validation, and management using structured approach.
//

import SwiftUI
import Foundation

// MARK: - Theme Schema Manager

/// Manager for handling theme schemas with structured design approach
class ThemeSchemaManager: ObservableObject {
    @Published var schemas: [ThemeSchema] = []
    @Published var currentSchema: ThemeSchema?
    @Published var isLoading = false
    @Published var lastError: String?
    
    private let fileManager = FileManager.default
    private let schemasDirectory = "ThemeSchemas"
    
    init() {
        loadSchemas()
    }
    
    // MARK: - Schema Management
    
    /// Create a new schema
    func createSchema(name: String, author: String, description: String? = nil) -> ThemeSchema {
        let schema = ThemeSchema(
            metadata: ThemeMetadata(
                name: name,
                author: author,
                description: description
            ),
            properties: ThemeProperties()
        )
        
        schemas.append(schema)
        saveSchemas()
        
        if currentSchema == nil {
            currentSchema = schema
        }
        
        return schema
    }
    
    /// Update an existing schema
    func updateSchema(_ schema: ThemeSchema) {
        if let index = schemas.firstIndex(where: { $0.id == schema.id }) {
            var updatedSchema = schema
            updatedSchema.metadata.updatedAt = Date()
            schemas[index] = updatedSchema
            
            if currentSchema?.id == schema.id {
                currentSchema = updatedSchema
            }
            
            saveSchemas()
        }
    }
    
    /// Delete a schema
    func deleteSchema(_ schema: ThemeSchema) {
        schemas.removeAll { $0.id == schema.id }
        
        if currentSchema?.id == schema.id {
            currentSchema = schemas.first
        }
        
        saveSchemas()
    }
    
    /// Set the current schema
    func setCurrentSchema(_ schema: ThemeSchema) {
        currentSchema = schema
        UserDefaults.standard.set(schema.id, forKey: "currentSchemaId")
    }
    
    // MARK: - Import/Export
    
    /// Export schema to JSON
    func exportSchema(_ schema: ThemeSchema) -> String? {
        do {
            return try SchemaSerialization.encodeToString(schema)
        } catch {
            lastError = "Failed to export schema: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Export schema to file
    func exportSchemaToFile(_ schema: ThemeSchema, filename: String) -> Bool {
        guard let jsonString = exportSchema(schema) else { return false }
        
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let schemasPath = documentsPath.appendingPathComponent(schemasDirectory)
            
            // Create schemas directory if it doesn't exist
            if !fileManager.fileExists(atPath: schemasPath.path) {
                try fileManager.createDirectory(at: schemasPath, withIntermediateDirectories: true)
            }
            
            let fileURL = schemasPath.appendingPathComponent("\(filename).json")
            try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
            
            return true
        } catch {
            lastError = "Failed to save schema file: \(error.localizedDescription)"
            return false
        }
    }
    
    /// Import schema from JSON string
    func importSchemaFromJSON(_ jsonString: String) -> ThemeSchema? {
        do {
            let schema = try SchemaSerialization.decodeFromString(jsonString)
            
            // Validate the schema
            let validationErrors = SchemaValidation.validate(schema)
            if !validationErrors.isEmpty {
                lastError = "Schema validation failed: \(validationErrors.map { $0.localizedDescription }.joined(separator: ", "))"
                return nil
            }
            
            // Check if schema with same ID already exists
            if schemas.contains(where: { $0.id == schema.id }) {
                lastError = "Schema with ID \(schema.id) already exists"
                return nil
            }
            
            schemas.append(schema)
            saveSchemas()
            
            return schema
        } catch {
            lastError = "Failed to import schema: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import schema from file
    func importSchemaFromFile(_ fileURL: URL) -> ThemeSchema? {
        do {
            let jsonString = try String(contentsOf: fileURL, encoding: .utf8)
            return importSchemaFromJSON(jsonString)
        } catch {
            lastError = "Failed to read schema file: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import schema from URL
    func importSchemaFromURL(_ url: URL, completion: @escaping (ThemeSchema?) -> Void) {
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
                
                let schema = self?.importSchemaFromJSON(jsonString)
                completion(schema)
            }
        }.resume()
    }
    
    // MARK: - Schema Templates
    
    /// Get predefined schema templates
    func getSchemaTemplates() -> [SchemaTemplate] {
        return [
            SchemaTemplate(
                name: "Light Professional",
                description: "Clean, professional light schema",
                category: .business,
                template: createLightProfessionalTemplate()
            ),
            SchemaTemplate(
                name: "Dark Modern",
                description: "Modern dark schema with vibrant accents",
                category: .creative,
                template: createDarkModernTemplate()
            ),
            SchemaTemplate(
                name: "Gaming",
                description: "High contrast gaming schema",
                category: .gaming,
                template: createGamingTemplate()
            ),
            SchemaTemplate(
                name: "Health & Wellness",
                description: "Calming health and wellness schema",
                category: .health,
                template: createHealthWellnessTemplate()
            ),
            SchemaTemplate(
                name: "Finance",
                description: "Trustworthy financial schema",
                category: .finance,
                template: createFinanceTemplate()
            )
        ]
    }
    
    /// Create schema from template
    func createSchemaFromTemplate(_ template: SchemaTemplate, name: String, author: String) -> ThemeSchema {
        var schema = template.template
        schema.metadata.name = name
        schema.metadata.author = author
        schema.id = UUID().uuidString
        schema.metadata.createdAt = Date()
        schema.metadata.updatedAt = Date()
        
        schemas.append(schema)
        saveSchemas()
        
        return schema
    }
    
    // MARK: - Validation
    
    /// Validate a schema
    func validateSchema(_ schema: ThemeSchema) -> [SchemaValidationError] {
        return SchemaValidation.validate(schema)
    }
    
    /// Check if schema is valid
    func isSchemaValid(_ schema: ThemeSchema) -> Bool {
        return SchemaValidation.validate(schema).isEmpty
    }
    
    // MARK: - Search and Filter
    
    /// Search schemas by name or description
    func searchSchemas(query: String) -> [ThemeSchema] {
        let lowercasedQuery = query.lowercased()
        return schemas.filter { schema in
            schema.metadata.name.lowercased().contains(lowercasedQuery) ||
            (schema.metadata.description?.lowercased().contains(lowercasedQuery) ?? false) ||
            schema.metadata.tags.contains { $0.lowercased().contains(lowercasedQuery) }
        }
    }
    
    /// Filter schemas by category
    func filterSchemasByCategory(_ category: ThemeCategory) -> [ThemeSchema] {
        return schemas.filter { $0.metadata.category == category }
    }
    
    /// Filter schemas by platform
    func filterSchemasByPlatform(_ platform: Platform) -> [ThemeSchema] {
        return schemas.filter { $0.metadata.platform.contains(platform) }
    }
    
    // MARK: - Schema Conversion
    
    /// Convert schema to theme data model
    func convertSchemaToThemeDataModel(_ schema: ThemeSchema) -> ThemeDataModel {
        return ThemeDataModel(
            id: schema.id,
            name: schema.metadata.name,
            version: schema.metadata.version,
            description: schema.metadata.description,
            author: schema.metadata.author,
            createdAt: schema.metadata.createdAt,
            updatedAt: schema.metadata.updatedAt,
            metadata: ThemeMetadata(
                tags: schema.metadata.tags,
                category: schema.metadata.category,
                platform: schema.metadata.platform,
                license: schema.metadata.license,
                website: schema.metadata.website,
                previewImage: schema.metadata.previewImage
            ),
            colors: convertColorPropertiesToColorPalette(schema.properties.colors),
            typography: convertTypographyPropertiesToTypographySystem(schema.properties.typography),
            spacing: convertLayoutMetricsToSpacingSystem(schema.properties.layoutMetrics),
            shadows: schema.properties.shadows,
            animations: schema.properties.animations,
            icons: convertIconographyPropertiesToIconSystem(schema.properties.iconography),
            accessibility: convertAccessibilityPropertiesToAccessibilitySettings(schema.properties.accessibility)
        )
    }
    
    /// Convert theme data model to schema
    func convertThemeDataModelToSchema(_ theme: ThemeDataModel) -> ThemeSchema {
        return ThemeSchema(
            id: theme.id,
            metadata: ThemeMetadata(
                name: theme.name,
                author: theme.author ?? "Unknown",
                version: theme.version,
                description: theme.description,
                createdAt: theme.createdAt,
                updatedAt: theme.updatedAt,
                tags: theme.metadata.tags,
                category: theme.metadata.category,
                platform: theme.metadata.platform,
                license: theme.metadata.license,
                website: theme.metadata.website,
                previewImage: theme.metadata.previewImage
            ),
            properties: ThemeProperties(
                colors: convertColorPaletteToColorProperties(theme.colors),
                typography: convertTypographySystemToTypographyProperties(theme.typography),
                iconography: convertIconSystemToIconographyProperties(theme.icons),
                layoutMetrics: convertSpacingSystemToLayoutMetrics(theme.spacing),
                shadows: theme.shadows,
                animations: theme.animations,
                accessibility: convertAccessibilitySettingsToAccessibilityProperties(theme.accessibility)
            )
        )
    }
    
    // MARK: - Persistence
    
    private func loadSchemas() {
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let schemasPath = documentsPath.appendingPathComponent(schemasDirectory)
            
            if !fileManager.fileExists(atPath: schemasPath.path) {
                // Create default schemas if no schemas exist
                createDefaultSchemas()
                return
            }
            
            let schemaFiles = try fileManager.contentsOfDirectory(at: schemasPath, includingPropertiesForKeys: nil)
                .filter { $0.pathExtension == "json" }
            
            for fileURL in schemaFiles {
                if let schema = importSchemaFromFile(fileURL) {
                    schemas.append(schema)
                }
            }
            
            // Load current schema
            if let currentSchemaId = UserDefaults.standard.string(forKey: "currentSchemaId") {
                currentSchema = schemas.first { $0.id == currentSchemaId }
            }
            
            if currentSchema == nil {
                currentSchema = schemas.first
            }
            
        } catch {
            lastError = "Failed to load schemas: \(error.localizedDescription)"
        }
    }
    
    private func saveSchemas() {
        do {
            let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
            let schemasPath = documentsPath.appendingPathComponent(schemasDirectory)
            
            // Create schemas directory if it doesn't exist
            if !fileManager.fileExists(atPath: schemasPath.path) {
                try fileManager.createDirectory(at: schemasPath, withIntermediateDirectories: true)
            }
            
            // Save each schema to a separate file
            for schema in schemas {
                let filename = "\(schema.id).json"
                let fileURL = schemasPath.appendingPathComponent(filename)
                
                if let jsonString = exportSchema(schema) {
                    try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
                }
            }
            
        } catch {
            lastError = "Failed to save schemas: \(error.localizedDescription)"
        }
    }
    
    private func createDefaultSchemas() {
        let templates = getSchemaTemplates()
        for template in templates {
            let schema = createSchemaFromTemplate(template, name: template.name, author: "Aether Team")
            schemas.append(schema)
        }
        saveSchemas()
    }
}

// MARK: - Schema Template

struct SchemaTemplate {
    let name: String
    let description: String
    let category: ThemeCategory
    let template: ThemeSchema
}

// MARK: - Template Creators

extension ThemeSchemaManager {
    private func createLightProfessionalTemplate() -> ThemeSchema {
        return ThemeSchema(
            metadata: ThemeMetadata(
                name: "Light Professional",
                description: "Clean, professional light schema",
                author: "Aether Team",
                tags: ["professional", "clean", "light"],
                category: .business,
                platform: [.ios]
            ),
            properties: ThemeProperties(
                colors: ColorProperties(
                    primary: ColorDefinition(light: "#0A7AFF", dark: "#0A84FF"),
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
                        primary: ColorDefinition(light: "#1D1D1F", dark: "#FFFFFF"),
                        secondary: ColorDefinition(light: "#3C3C43", dark: "#EBEBF5"),
                        tertiary: ColorDefinition(light: "#787880", dark: "#EBEBF599"),
                        quaternary: ColorDefinition(light: "#787880", dark: "#EBEBF54D"),
                        inverse: ColorDefinition(light: "#FFFFFF", dark: "#1D1D1F")
                    ),
                    semantic: SemanticColors(
                        success: ColorDefinition(light: "#34C759", dark: "#30D158"),
                        warning: ColorDefinition(light: "#FF9500", dark: "#FF9F0A"),
                        error: ColorDefinition(light: "#FF3B30", dark: "#FF453A"),
                        info: ColorDefinition(light: "#007AFF", dark: "#0A84FF"),
                        destructive: ColorDefinition(light: "#FF3B30", dark: "#FF453A")
                    )
                ),
                typography: TypographyProperties(
                    primaryFontName: "HelveticaNeue-Bold",
                    bodyFontName: "HelveticaNeue",
                    headingScaleFactor: 1.5,
                    baseFontSize: 17
                )
            )
        )
    }
    
    private func createDarkModernTemplate() -> ThemeSchema {
        return ThemeSchema(
            metadata: ThemeMetadata(
                name: "Dark Modern",
                description: "Modern dark schema with vibrant accents",
                author: "Aether Team",
                tags: ["modern", "dark", "vibrant"],
                category: .creative,
                platform: [.ios]
            ),
            properties: ThemeProperties(
                colors: ColorProperties(
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
                        info: ColorDefinition(light: "#3498DB", dark: "#3498DB"),
                        destructive: ColorDefinition(light: "#E74C3C", dark: "#E74C3C")
                    )
                ),
                typography: TypographyProperties(
                    primaryFontName: "HelveticaNeue-Bold",
                    bodyFontName: "HelveticaNeue",
                    headingScaleFactor: 1.6,
                    baseFontSize: 16
                )
            )
        )
    }
    
    private func createGamingTemplate() -> ThemeSchema {
        return ThemeSchema(
            metadata: ThemeMetadata(
                name: "Gaming",
                description: "High contrast gaming schema",
                author: "Aether Team",
                tags: ["gaming", "high-contrast", "vibrant"],
                category: .gaming,
                platform: [.ios]
            ),
            properties: ThemeProperties(
                colors: ColorProperties(
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
                        info: ColorDefinition(light: "#00FFFF", dark: "#00FFFF"),
                        destructive: ColorDefinition(light: "#FF0000", dark: "#FF0000")
                    )
                ),
                typography: TypographyProperties(
                    primaryFontName: "HelveticaNeue-Bold",
                    bodyFontName: "HelveticaNeue",
                    headingScaleFactor: 1.8,
                    baseFontSize: 18
                )
            )
        )
    }
    
    private func createHealthWellnessTemplate() -> ThemeSchema {
        return ThemeSchema(
            metadata: ThemeMetadata(
                name: "Health & Wellness",
                description: "Calming health and wellness schema",
                author: "Aether Team",
                tags: ["health", "wellness", "calming"],
                category: .health,
                platform: [.ios]
            ),
            properties: ThemeProperties(
                colors: ColorProperties(
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
                        info: ColorDefinition(light: "#2196F3", dark: "#2196F3"),
                        destructive: ColorDefinition(light: "#F44336", dark: "#F44336")
                    )
                ),
                typography: TypographyProperties(
                    primaryFontName: "HelveticaNeue-Light",
                    bodyFontName: "HelveticaNeue",
                    headingScaleFactor: 1.4,
                    baseFontSize: 16
                )
            )
        )
    }
    
    private func createFinanceTemplate() -> ThemeSchema {
        return ThemeSchema(
            metadata: ThemeMetadata(
                name: "Finance",
                description: "Trustworthy financial schema",
                author: "Aether Team",
                tags: ["finance", "trustworthy", "professional"],
                category: .finance,
                platform: [.ios]
            ),
            properties: ThemeProperties(
                colors: ColorProperties(
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
                        info: ColorDefinition(light: "#2196F3", dark: "#2196F3"),
                        destructive: ColorDefinition(light: "#F44336", dark: "#F44336")
                    )
                ),
                typography: TypographyProperties(
                    primaryFontName: "HelveticaNeue-Bold",
                    bodyFontName: "HelveticaNeue",
                    headingScaleFactor: 1.3,
                    baseFontSize: 15
                )
            )
        )
    }
}

// MARK: - Conversion Helpers

extension ThemeSchemaManager {
    private func convertColorPropertiesToColorPalette(_ colors: ColorProperties) -> ColorPalette {
        return ColorPalette(
            primary: colors.primary,
            secondary: colors.secondary,
            tertiary: colors.tertiary,
            background: colors.background,
            surface: colors.surface,
            text: colors.text,
            semantic: colors.semantic,
            custom: colors.custom
        )
    }
    
    private func convertTypographyPropertiesToTypographySystem(_ typography: TypographyProperties) -> TypographySystem {
        return TypographySystem(
            fontFamilies: FontFamilies(
                primary: typography.primaryFontName,
                secondary: typography.bodyFontName,
                monospace: typography.monospaceFontName
            ),
            fontSizes: FontSizes(
                xs: typography.baseFontSize * 0.7,
                sm: typography.baseFontSize * 0.8,
                md: typography.baseFontSize,
                lg: typography.baseFontSize * 1.1,
                xl: typography.baseFontSize * 1.2,
                xxl: typography.baseFontSize * 1.4,
                xxxl: typography.baseFontSize * 1.9
            ),
            fontWeights: typography.fontWeights,
            lineHeights: typography.lineHeights,
            letterSpacing: typography.letterSpacing,
            textStyles: typography.textStyles
        )
    }
    
    private func convertLayoutMetricsToSpacingSystem(_ layoutMetrics: LayoutMetricsProperties) -> SpacingSystem {
        return SpacingSystem(
            xs: layoutMetrics.spacing.xs,
            sm: layoutMetrics.spacing.sm,
            md: layoutMetrics.spacing.md,
            lg: layoutMetrics.spacing.lg,
            xl: layoutMetrics.spacing.xl,
            xxl: layoutMetrics.spacing.xxl,
            xxxl: layoutMetrics.spacing.xxxl
        )
    }
    
    private func convertIconographyPropertiesToIconSystem(_ iconography: IconographyProperties) -> IconSystem {
        return IconSystem(
            family: iconography.family,
            sizes: iconography.sizes,
            weights: iconography.weights
        )
    }
    
    private func convertAccessibilityPropertiesToAccessibilitySettings(_ accessibility: AccessibilityProperties) -> AccessibilitySettings {
        return AccessibilitySettings(
            highContrast: accessibility.highContrast,
            reducedMotion: accessibility.reducedMotion,
            increasedContrast: accessibility.increasedContrast,
            darkMode: accessibility.darkMode,
            dynamicType: accessibility.dynamicType
        )
    }
    
    private func convertColorPaletteToColorProperties(_ colors: ColorPalette) -> ColorProperties {
        return ColorProperties(
            primary: colors.primary,
            secondary: colors.secondary,
            tertiary: colors.tertiary,
            background: colors.background,
            surface: colors.surface,
            text: colors.text,
            semantic: colors.semantic,
            custom: colors.custom
        )
    }
    
    private func convertTypographySystemToTypographyProperties(_ typography: TypographySystem) -> TypographyProperties {
        return TypographyProperties(
            primaryFontName: typography.fontFamilies.primary,
            bodyFontName: typography.fontFamilies.secondary,
            monospaceFontName: typography.fontFamilies.monospace,
            headingScaleFactor: 1.5,
            baseFontSize: typography.fontSizes.md,
            fontWeights: typography.fontWeights,
            lineHeights: typography.lineHeights,
            letterSpacing: typography.letterSpacing,
            textStyles: typography.textStyles
        )
    }
    
    private func convertSpacingSystemToLayoutMetrics(_ spacing: SpacingSystem) -> LayoutMetricsProperties {
        return LayoutMetricsProperties(
            spacing: SpacingMetrics(
                xs: spacing.xs,
                sm: spacing.sm,
                md: spacing.md,
                lg: spacing.lg,
                xl: spacing.xl,
                xxl: spacing.xxl,
                xxxl: spacing.xxxl
            ),
            padding: PaddingMetrics(),
            margins: MarginMetrics(),
            borderRadius: BorderRadiusMetrics(),
            grid: GridMetrics(),
            breakpoints: BreakpointMetrics()
        )
    }
    
    private func convertIconSystemToIconographyProperties(_ icons: IconSystem) -> IconographyProperties {
        return IconographyProperties(
            family: icons.family,
            sizes: icons.sizes,
            weights: icons.weights,
            colors: IconColors(),
            custom: [:]
        )
    }
    
    private func convertAccessibilitySettingsToAccessibilityProperties(_ accessibility: AccessibilitySettings) -> AccessibilityProperties {
        return AccessibilityProperties(
            highContrast: accessibility.highContrast,
            reducedMotion: accessibility.reducedMotion,
            increasedContrast: accessibility.increasedContrast,
            darkMode: accessibility.darkMode,
            dynamicType: accessibility.dynamicType,
            voiceOver: VoiceOverSettings(),
            switchControl: SwitchControlSettings()
        )
    }
}

// MARK: - Preview

struct ThemeSchemaManager_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("Theme Schema Manager")
                .font(.title)
            
            Text("Manages theme schemas with structured design")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
    }
} 