//
//  ThemeSchemaExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating the Theme Schema system
//  with import/export, validation, and management features.
//

import SwiftUI
import UniformTypeIdentifiers

struct ThemeSchemaExample: View {
    @StateObject private var schemaManager = ThemeSchemaManager()
    @State private var showingImportSheet = false
    @State private var showingExportSheet = false
    @State private var showingCreateSheet = false
    @State private var showingTemplateSheet = false
    @State private var searchText = ""
    @State private var selectedCategory: ThemeCategory = .general
    @State private var selectedPlatform: Platform = .ios
    @State private var showingValidationAlert = false
    @State private var validationErrors: [SchemaValidationError] = []
    
    var filteredSchemas: [ThemeSchema] {
        var schemas = schemaManager.schemas
        
        // Apply search filter
        if !searchText.isEmpty {
            schemas = schemaManager.searchSchemas(query: searchText)
        }
        
        // Apply category filter
        if selectedCategory != .general {
            schemas = schemas.filter { $0.metadata.category == selectedCategory }
        }
        
        // Apply platform filter
        if selectedPlatform != .ios {
            schemas = schemas.filter { $0.metadata.platform.contains(selectedPlatform) }
        }
        
        return schemas
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header with controls
                headerView
                
                // Search and filter bar
                searchAndFilterView
                
                // Schema list
                schemaListView
            }
            .navigationTitle("Theme Schema")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button("Create New Schema") {
                            showingCreateSheet = true
                        }
                        
                        Button("Import from Template") {
                            showingTemplateSheet = true
                        }
                        
                        Button("Import from JSON") {
                            showingImportSheet = true
                        }
                        
                        if let currentSchema = schemaManager.currentSchema {
                            Button("Export Current") {
                                showingExportSheet = true
                            }
                        }
                    } label: {
                        Image(systemName: "plus.circle.fill")
                            .foregroundColor(.blue)
                    }
                }
            }
            .sheet(isPresented: $showingCreateSheet) {
                CreateSchemaView(schemaManager: schemaManager)
            }
            .sheet(isPresented: $showingTemplateSheet) {
                TemplateSelectionView(schemaManager: schemaManager)
            }
            .sheet(isPresented: $showingImportSheet) {
                ImportSchemaView(schemaManager: schemaManager)
            }
            .sheet(isPresented: $showingExportSheet) {
                if let currentSchema = schemaManager.currentSchema {
                    ExportSchemaView(schema: currentSchema)
                }
            }
            .alert("Schema Validation Errors", isPresented: $showingValidationAlert) {
                Button("OK") { }
            } message: {
                Text(validationErrors.map { $0.localizedDescription }.joined(separator: "\n"))
            }
        }
    }
    
    // MARK: - Header View
    
    private var headerView: some View {
        VStack(spacing: 16) {
            // Current schema info
            if let currentSchema = schemaManager.currentSchema {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("Current Schema")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        
                        Spacer()
                        
                        Button("Change") {
                            // Show schema selection
                        }
                        .font(.caption)
                        .foregroundColor(.blue)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text(currentSchema.metadata.name)
                            .font(.title2)
                            .fontWeight(.semibold)
                        
                        Text("by \(currentSchema.metadata.author)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        if let description = currentSchema.metadata.description {
                            Text(description)
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .lineLimit(2)
                        }
                    }
                }
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(12)
            }
            
            // Stats
            HStack(spacing: 20) {
                StatCard(
                    title: "Total Schemas",
                    value: "\(schemaManager.schemas.count)",
                    icon: "doc.text.fill"
                )
                
                StatCard(
                    title: "Valid Schemas",
                    value: "\(schemaManager.schemas.filter { schemaManager.isSchemaValid($0) }.count)",
                    icon: "checkmark.circle.fill",
                    color: .green
                )
                
                StatCard(
                    title: "Categories",
                    value: "\(Set(schemaManager.schemas.map { $0.metadata.category }).count)",
                    icon: "folder.fill",
                    color: .orange
                )
            }
        }
        .padding()
    }
    
    // MARK: - Search and Filter View
    
    private var searchAndFilterView: some View {
        VStack(spacing: 12) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                
                TextField("Search schemas...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                
                if !searchText.isEmpty {
                    Button("Clear") {
                        searchText = ""
                    }
                    .font(.caption)
                    .foregroundColor(.blue)
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            .cornerRadius(8)
            
            // Filter controls
            HStack(spacing: 12) {
                // Category filter
                Menu {
                    ForEach(ThemeCategory.allCases, id: \.self) { category in
                        Button(category.rawValue) {
                            selectedCategory = category
                        }
                    }
                } label: {
                    HStack {
                        Text(selectedCategory.rawValue)
                            .font(.caption)
                        Image(systemName: "chevron.down")
                            .font(.caption2)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color(.systemGray5))
                    .cornerRadius(6)
                }
                
                // Platform filter
                Menu {
                    ForEach(Platform.allCases, id: \.self) { platform in
                        Button(platform.rawValue) {
                            selectedPlatform = platform
                        }
                    }
                } label: {
                    HStack {
                        Text(selectedPlatform.rawValue)
                            .font(.caption)
                        Image(systemName: "chevron.down")
                            .font(.caption2)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color(.systemGray5))
                    .cornerRadius(6)
                }
                
                Spacer()
                
                // Clear filters
                if selectedCategory != .general || selectedPlatform != .ios {
                    Button("Clear Filters") {
                        selectedCategory = .general
                        selectedPlatform = .ios
                    }
                    .font(.caption)
                    .foregroundColor(.blue)
                }
            }
        }
        .padding(.horizontal)
    }
    
    // MARK: - Schema List View
    
    private var schemaListView: some View {
        List {
            ForEach(filteredSchemas, id: \.id) { schema in
                SchemaRowView(
                    schema: schema,
                    isCurrent: schemaManager.currentSchema?.id == schema.id,
                    onSelect: {
                        schemaManager.setCurrentSchema(schema)
                    },
                    onDelete: {
                        schemaManager.deleteSchema(schema)
                    },
                    onValidate: {
                        let errors = schemaManager.validateSchema(schema)
                        if !errors.isEmpty {
                            validationErrors = errors
                            showingValidationAlert = true
                        }
                    }
                )
            }
        }
        .listStyle(PlainListStyle())
        .refreshable {
            // Refresh schemas
        }
    }
}

// MARK: - Stat Card

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    var color: Color = .blue
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Schema Row View

struct SchemaRowView: View {
    let schema: ThemeSchema
    let isCurrent: Bool
    let onSelect: () -> Void
    let onDelete: () -> Void
    let onValidate: () -> Void
    
    @State private var showingDetails = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(schema.metadata.name)
                            .font(.headline)
                            .fontWeight(.semibold)
                        
                        if isCurrent {
                            Text("CURRENT")
                                .font(.caption2)
                                .fontWeight(.bold)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(4)
                        }
                        
                        Spacer()
                    }
                    
                    Text("by \(schema.metadata.author)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    if let description = schema.metadata.description {
                        Text(description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text(schema.metadata.version)
                        .font(.caption)
                        .fontWeight(.medium)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(.systemGray5))
                        .cornerRadius(4)
                    
                    Text(schema.metadata.category.rawValue)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            
            // Tags and platforms
            HStack {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(schema.metadata.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.caption2)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color(.systemGray5))
                                .cornerRadius(4)
                        }
                    }
                }
                
                Spacer()
                
                HStack(spacing: 4) {
                    ForEach(schema.metadata.platform, id: \.self) { platform in
                        Image(systemName: platformIcon(for: platform))
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Actions
            HStack(spacing: 12) {
                Button("Select") {
                    onSelect()
                }
                .font(.caption)
                .foregroundColor(.blue)
                
                Button("Details") {
                    showingDetails = true
                }
                .font(.caption)
                .foregroundColor(.secondary)
                
                Button("Validate") {
                    onValidate()
                }
                .font(.caption)
                .foregroundColor(.orange)
                
                Spacer()
                
                Button("Delete") {
                    onDelete()
                }
                .font(.caption)
                .foregroundColor(.red)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
        .sheet(isPresented: $showingDetails) {
            SchemaDetailView(schema: schema)
        }
    }
    
    private func platformIcon(for platform: Platform) -> String {
        switch platform {
        case .ios: return "iphone"
        case .watchos: return "applewatch"
        case .tvos: return "appletv"
        case .visionos: return "visionpro"
        }
    }
}

// MARK: - Create Schema View

struct CreateSchemaView: View {
    @ObservedObject var schemaManager: ThemeSchemaManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var name = ""
    @State private var author = ""
    @State private var description = ""
    @State private var category: ThemeCategory = .general
    @State private var platforms: Set<Platform> = [.ios]
    
    var body: some View {
        NavigationView {
            Form {
                Section("Basic Information") {
                    TextField("Schema Name", text: $name)
                    TextField("Author", text: $author)
                    TextField("Description", text: $description, axis: .vertical)
                        .lineLimit(3...6)
                }
                
                Section("Category") {
                    Picker("Category", selection: $category) {
                        ForEach(ThemeCategory.allCases, id: \.self) { category in
                            Text(category.rawValue).tag(category)
                        }
                    }
                    .pickerStyle(MenuPickerStyle())
                }
                
                Section("Platforms") {
                    ForEach(Platform.allCases, id: \.self) { platform in
                        Toggle(platform.rawValue, isOn: Binding(
                            get: { platforms.contains(platform) },
                            set: { isOn in
                                if isOn {
                                    platforms.insert(platform)
                                } else {
                                    platforms.remove(platform)
                                }
                            }
                        ))
                    }
                }
            }
            .navigationTitle("Create Schema")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Create") {
                        let schema = schemaManager.createSchema(
                            name: name,
                            author: author,
                            description: description.isEmpty ? nil : description
                        )
                        dismiss()
                    }
                    .disabled(name.isEmpty || author.isEmpty)
                }
            }
        }
    }
}

// MARK: - Template Selection View

struct TemplateSelectionView: View {
    @ObservedObject var schemaManager: ThemeSchemaManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var name = ""
    @State private var author = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Form
                VStack(spacing: 16) {
                    TextField("Schema Name", text: $name)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    
                    TextField("Author", text: $author)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }
                .padding()
                
                // Templates
                ScrollView {
                    LazyVGrid(columns: [
                        GridItem(.flexible()),
                        GridItem(.flexible())
                    ], spacing: 16) {
                        ForEach(schemaManager.getSchemaTemplates(), id: \.name) { template in
                            TemplateCard(
                                template: template,
                                onSelect: {
                                    let schema = schemaManager.createSchemaFromTemplate(
                                        template,
                                        name: name.isEmpty ? template.name : name,
                                        author: author.isEmpty ? "Unknown" : author
                                    )
                                    dismiss()
                                }
                            )
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Choose Template")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Template Card

struct TemplateCard: View {
    let template: SchemaTemplate
    let onSelect: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 8) {
                Text(template.name)
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Text(template.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
                
                Text(template.category.rawValue)
                    .font(.caption2)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color(.systemGray5))
                    .cornerRadius(4)
            }
            
            Spacer()
            
            Button("Use Template") {
                onSelect()
            }
            .font(.caption)
            .foregroundColor(.blue)
        }
        .padding()
        .frame(height: 120)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Import Schema View

struct ImportSchemaView: View {
    @ObservedObject var schemaManager: ThemeSchemaManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var jsonText = ""
    @State private var showingFilePicker = false
    @State private var showingURLInput = false
    @State private var urlString = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Import options
                VStack(spacing: 16) {
                    Button("Import from JSON") {
                        showingFilePicker = true
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button("Import from URL") {
                        showingURLInput = true
                    }
                    .buttonStyle(.bordered)
                    
                    Button("Paste JSON") {
                        // Handle paste
                    }
                    .buttonStyle(.bordered)
                }
                .padding()
                
                // JSON input
                VStack(alignment: .leading, spacing: 8) {
                    Text("Or paste JSON directly:")
                        .font(.headline)
                    
                    TextEditor(text: $jsonText)
                        .frame(height: 200)
                        .padding(8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
                .padding()
                
                Spacer()
            }
            .navigationTitle("Import Schema")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Import") {
                        if !jsonText.isEmpty {
                            _ = schemaManager.importSchemaFromJSON(jsonText)
                            dismiss()
                        }
                    }
                    .disabled(jsonText.isEmpty)
                }
            }
            .sheet(isPresented: $showingURLInput) {
                URLInputView(urlString: $urlString) { url in
                    schemaManager.importSchemaFromURL(url) { _ in
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - URL Input View

struct URLInputView: View {
    @Binding var urlString: String
    let onImport: (URL) -> Void
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                TextField("Enter URL", text: $urlString)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .keyboardType(.URL)
                    .autocapitalization(.none)
                
                Button("Import") {
                    if let url = URL(string: urlString) {
                        onImport(url)
                        dismiss()
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(urlString.isEmpty)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Import from URL")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Export Schema View

struct ExportSchemaView: View {
    let schema: ThemeSchema
    @Environment(\.dismiss) private var dismiss
    
    @State private var exportFormat: ExportFormat = .json
    @State private var includeMetadata = true
    @State private var includeValidation = true
    
    enum ExportFormat: String, CaseIterable {
        case json = "JSON"
        case base64 = "Base64"
        case compressed = "Compressed"
    }
    
    var exportedData: String {
        switch exportFormat {
        case .json:
            return SchemaSerialization.encodeToString(schema) ?? ""
        case .base64:
            return SchemaSerialization.encodeToBase64(schema) ?? ""
        case .compressed:
            // Implement compression
            return SchemaSerialization.encodeToString(schema) ?? ""
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Export options
                VStack(spacing: 16) {
                    Picker("Format", selection: $exportFormat) {
                        ForEach(ExportFormat.allCases, id: \.self) { format in
                            Text(format.rawValue).tag(format)
                        }
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    
                    Toggle("Include Metadata", isOn: $includeMetadata)
                    Toggle("Include Validation", isOn: $includeValidation)
                }
                .padding()
                
                // Preview
                VStack(alignment: .leading, spacing: 8) {
                    Text("Preview:")
                        .font(.headline)
                    
                    ScrollView {
                        Text(exportedData)
                            .font(.caption)
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(8)
                    }
                    .frame(maxHeight: 300)
                }
                .padding()
                
                // Actions
                HStack(spacing: 16) {
                    Button("Copy") {
                        UIPasteboard.general.string = exportedData
                    }
                    .buttonStyle(.bordered)
                    
                    Button("Save to File") {
                        // Implement file save
                    }
                    .buttonStyle(.borderedProminent)
                }
                .padding()
                
                Spacer()
            }
            .navigationTitle("Export Schema")
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

// MARK: - Schema Detail View

struct SchemaDetailView: View {
    let schema: ThemeSchema
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Metadata
                    metadataSection
                    
                    // Colors
                    colorsSection
                    
                    // Typography
                    typographySection
                    
                    // Layout
                    layoutSection
                    
                    // Validation
                    validationSection
                }
                .padding()
            }
            .navigationTitle("Schema Details")
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
    
    private var metadataSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Metadata")
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 8) {
                DetailRow(title: "Name", value: schema.metadata.name)
                DetailRow(title: "Author", value: schema.metadata.author)
                DetailRow(title: "Version", value: schema.metadata.version)
                DetailRow(title: "Category", value: schema.metadata.category.rawValue)
                DetailRow(title: "Created", value: schema.metadata.createdAt.formatted())
                DetailRow(title: "Updated", value: schema.metadata.updatedAt.formatted())
                
                if let description = schema.metadata.description {
                    DetailRow(title: "Description", value: description)
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private var colorsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Colors")
                .font(.headline)
            
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                ColorCard(title: "Primary", color: schema.properties.colors.primary)
                ColorCard(title: "Secondary", color: schema.properties.colors.secondary)
                ColorCard(title: "Tertiary", color: schema.properties.colors.tertiary)
                ColorCard(title: "Success", color: schema.properties.colors.semantic.success)
                ColorCard(title: "Warning", color: schema.properties.colors.semantic.warning)
                ColorCard(title: "Error", color: schema.properties.colors.semantic.error)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private var typographySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Typography")
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 8) {
                DetailRow(title: "Primary Font", value: schema.properties.typography.primaryFontName)
                DetailRow(title: "Body Font", value: schema.properties.typography.bodyFontName)
                DetailRow(title: "Base Size", value: "\(schema.properties.typography.baseFontSize)")
                DetailRow(title: "Scale Factor", value: "\(schema.properties.typography.headingScaleFactor)")
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private var layoutSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Layout")
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 8) {
                DetailRow(title: "Grid Columns", value: "\(schema.properties.layoutMetrics.grid.columns)")
                DetailRow(title: "Grid Gutter", value: "\(schema.properties.layoutMetrics.grid.gutter)")
                DetailRow(title: "Base Spacing", value: "\(schema.properties.layoutMetrics.spacing.md)")
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private var validationSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Validation")
                .font(.headline)
            
            let errors = SchemaValidation.validate(schema)
            
            if errors.isEmpty {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Schema is valid")
                        .foregroundColor(.green)
                }
            } else {
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(errors, id: \.localizedDescription) { error in
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.orange)
                            Text(error.localizedDescription)
                                .font(.caption)
                        }
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Detail Row

struct DetailRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.caption)
                .fontWeight(.medium)
        }
    }
}

// MARK: - Color Card

struct ColorCard: View {
    let title: String
    let color: ColorDefinition
    
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Circle()
                    .fill(Color(hex: color.light))
                    .frame(width: 20, height: 20)
                
                Circle()
                    .fill(Color(hex: color.dark))
                    .frame(width: 20, height: 20)
            }
            
            Text(title)
                .font(.caption)
                .fontWeight(.medium)
            
            Text(color.light)
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(8)
    }
}

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Preview

struct ThemeSchemaExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeSchemaExample()
    }
} 