//
//  ThemeSchemaImportExportExample.swift
//  Aether SwiftUI App
//
//  Comprehensive example demonstrating import/export functionality
//  with multiple formats, file handling, and Share Sheet integration.
//

import SwiftUI
import UniformTypeIdentifiers

struct ThemeSchemaImportExportExample: View {
    @StateObject private var importExport = ThemeSchemaImportExport()
    @StateObject private var schemaManager = ThemeSchemaManager()
    
    @State private var showingExportSheet = false
    @State private var showingImportSheet = false
    @State private var showingFormatComparison = false
    @State private var selectedSchema: ThemeSchema?
    @State private var selectedFormat: ThemeSchemaImportExport.ExportFormat = .json
    @State private var exportFilename = ""
    @State private var importJsonText = ""
    @State private var showingFilePicker = false
    @State private var showingShareSheet = false
    @State private var shareURL: URL?
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    headerSection
                    
                    // Current Schema Info
                    if let currentSchema = schemaManager.currentSchema {
                        currentSchemaSection(schema: currentSchema)
                    }
                    
                    // Export Section
                    exportSection
                    
                    // Import Section
                    importSection
                    
                    // Format Comparison
                    formatComparisonSection
                    
                    // Recent Exports
                    recentExportsSection
                    
                    // Error Display
                    if let error = importExport.lastError {
                        errorSection(error: error)
                    }
                }
                .padding()
            }
            .navigationTitle("Import/Export")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Help") {
                        showingFormatComparison = true
                    }
                }
            }
            .sheet(isPresented: $showingExportSheet) {
                ExportOptionsView(
                    schema: selectedSchema ?? schemaManager.currentSchema!,
                    importExport: importExport,
                    onExport: { format, filename in
                        handleExport(format: format, filename: filename)
                    }
                )
            }
            .sheet(isPresented: $showingImportSheet) {
                ImportOptionsView(
                    importExport: importExport,
                    onImport: { schema in
                        handleImport(schema: schema)
                    }
                )
            }
            .sheet(isPresented: $showingFormatComparison) {
                FormatComparisonView()
            }
            .sheet(isPresented: $showingFilePicker) {
                DocumentPickerView { url in
                    handleFileImport(url: url)
                }
            }
            .sheet(isPresented: $showingShareSheet) {
                if let url = shareURL {
                    ShareSheetView(url: url)
                }
            }
        }
    }
    
    // MARK: - Header Section
    
    private var headerSection: some View {
        VStack(spacing: 16) {
            Text("Theme Schema Import/Export")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Export your themes in multiple formats and import from various sources")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            // Stats
            HStack(spacing: 20) {
                StatCard(
                    title: "Schemas",
                    value: "\(schemaManager.schemas.count)",
                    icon: "doc.text"
                )
                
                StatCard(
                    title: "Formats",
                    value: "\(ThemeSchemaImportExport.ExportFormat.allCases.count)",
                    icon: "square.and.arrow.up"
                )
                
                StatCard(
                    title: "Valid",
                    value: "\(schemaManager.schemas.filter { schemaManager.isSchemaValid($0) }.count)",
                    icon: "checkmark.circle"
                )
            }
        }
    }
    
    // MARK: - Current Schema Section
    
    private func currentSchemaSection(schema: ThemeSchema) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Current Schema")
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(schema.metadata.name)
                        .font(.title3)
                        .fontWeight(.semibold)
                    
                    Spacer()
                    
                    Text(schema.metadata.version)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(.systemGray5))
                        .cornerRadius(6)
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
                
                HStack {
                    ForEach(schema.metadata.tags, id: \.self) { tag in
                        Text(tag)
                            .font(.caption2)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.blue.opacity(0.1))
                            .foregroundColor(.blue)
                            .cornerRadius(4)
                    }
                    
                    Spacer()
                    
                    Button("Export") {
                        selectedSchema = schema
                        showingExportSheet = true
                    }
                    .font(.caption)
                    .foregroundColor(.blue)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
    
    // MARK: - Export Section
    
    private var exportSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Export")
                .font(.headline)
            
            VStack(spacing: 12) {
                // Format Selection
                VStack(alignment: .leading, spacing: 8) {
                    Text("Format")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    Picker("Format", selection: $selectedFormat) {
                        ForEach(ThemeSchemaImportExport.ExportFormat.allCases, id: \.self) { format in
                            Text(format.rawValue).tag(format)
                        }
                    }
                    .pickerStyle(SegmentedPickerStyle())
                }
                
                // Filename Input
                VStack(alignment: .leading, spacing: 8) {
                    Text("Filename")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    TextField("Enter filename", text: $exportFilename)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                }
                
                // Export Actions
                HStack(spacing: 12) {
                    Button("Export to File") {
                        exportToFile()
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(exportFilename.isEmpty || schemaManager.currentSchema == nil)
                    
                    Button("Share") {
                        exportToShare()
                    }
                    .buttonStyle(.bordered)
                    .disabled(schemaManager.currentSchema == nil)
                    
                    Button("Clipboard") {
                        exportToClipboard()
                    }
                    .buttonStyle(.bordered)
                    .disabled(schemaManager.currentSchema == nil)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
    
    // MARK: - Import Section
    
    private var importSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Import")
                .font(.headline)
            
            VStack(spacing: 12) {
                // Import Actions
                HStack(spacing: 12) {
                    Button("Choose File") {
                        showingFilePicker = true
                    }
                    .buttonStyle(.borderedProminent)
                    
                    Button("From URL") {
                        importFromURL()
                    }
                    .buttonStyle(.bordered)
                    
                    Button("Clipboard") {
                        importFromClipboard()
                    }
                    .buttonStyle(.bordered)
                }
                
                // JSON Input
                VStack(alignment: .leading, spacing: 8) {
                    Text("Or paste JSON directly:")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    TextEditor(text: $importJsonText)
                        .frame(height: 120)
                        .padding(8)
                        .background(Color(.systemBackground))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(.systemGray4), lineWidth: 1)
                        )
                    
                    Button("Import JSON") {
                        importFromJSON()
                    }
                    .buttonStyle(.bordered)
                    .disabled(importJsonText.isEmpty)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
    }
    
    // MARK: - Format Comparison Section
    
    private var formatComparisonSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Format Comparison")
                .font(.headline)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(importExport.getFormatComparison(), id: \.format) { comparison in
                        FormatComparisonCard(comparison: comparison)
                    }
                }
                .padding(.horizontal)
            }
        }
    }
    
    // MARK: - Recent Exports Section
    
    private var recentExportsSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Recent Exports")
                .font(.headline)
            
            VStack(spacing: 8) {
                ForEach(0..<3, id: \.self) { index in
                    HStack {
                        Image(systemName: "doc.text")
                            .foregroundColor(.blue)
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text("theme_export_\(index + 1).json")
                                .font(.subheadline)
                                .fontWeight(.medium)
                            
                            Text("2 hours ago • 1.2 KB")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        Spacer()
                        
                        Button("Share") {
                            // Share recent export
                        }
                        .font(.caption)
                        .foregroundColor(.blue)
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(8)
                }
            }
        }
    }
    
    // MARK: - Error Section
    
    private func errorSection(error: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(.orange)
                
                Text("Error")
                    .font(.headline)
                    .foregroundColor(.orange)
                
                Spacer()
                
                Button("Dismiss") {
                    importExport.lastError = nil
                }
                .font(.caption)
                .foregroundColor(.blue)
            }
            
            Text(error)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color.orange.opacity(0.1))
        .cornerRadius(12)
    }
    
    // MARK: - Action Handlers
    
    private func exportToFile() {
        guard let schema = schemaManager.currentSchema else { return }
        
        let filename = exportFilename.isEmpty ? schema.metadata.name : exportFilename
        let success = importExport.exportSchemaToFile(schema, format: selectedFormat, filename: filename)
        
        if success {
            exportFilename = ""
        }
    }
    
    private func exportToShare() {
        guard let schema = schemaManager.currentSchema else { return }
        importExport.exportSchemaToShareSheet(schema, format: selectedFormat)
    }
    
    private func exportToClipboard() {
        guard let schema = schemaManager.currentSchema else { return }
        importExport.exportSchemaToClipboard(schema, format: selectedFormat)
    }
    
    private func importFromURL() {
        // Show URL input alert
        let alert = UIAlertController(title: "Import from URL", message: "Enter the URL of the schema file", preferredStyle: .alert)
        
        alert.addTextField { textField in
            textField.placeholder = "https://example.com/schema.json"
        }
        
        alert.addAction(UIAlertAction(title: "Import", style: .default) { _ in
            if let urlString = alert.textFields?.first?.text, let url = URL(string: urlString) {
                importExport.importSchemaFromURL(url) { schema in
                    if let schema = schema {
                        handleImport(schema: schema)
                    }
                }
            }
        })
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        // Present alert
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first {
            window.rootViewController?.present(alert, animated: true)
        }
    }
    
    private func importFromClipboard() {
        if let schema = importExport.importSchemaFromClipboard() {
            handleImport(schema: schema)
        }
    }
    
    private func importFromJSON() {
        if let schema = importExport.importSchemaFromJSON(importJsonText) {
            handleImport(schema: schema)
            importJsonText = ""
        }
    }
    
    private func handleFileImport(url: URL) {
        if let schema = importExport.importSchemaFromURL(url) {
            handleImport(schema: schema)
        }
    }
    
    private func handleExport(format: ThemeSchemaImportExport.ExportFormat, filename: String) {
        guard let schema = selectedSchema ?? schemaManager.currentSchema else { return }
        
        let finalFilename = filename.isEmpty ? schema.metadata.name : filename
        let success = importExport.exportSchemaToFile(schema, format: format, filename: finalFilename)
        
        if success {
            showingExportSheet = false
        }
    }
    
    private func handleImport(schema: ThemeSchema) {
        schemaManager.importSchemaFromJSON(SchemaSerialization.encode(schema))
        showingImportSheet = false
    }
}

// MARK: - Export Options View

struct ExportOptionsView: View {
    let schema: ThemeSchema
    let importExport: ThemeSchemaImportExport
    let onExport: (ThemeSchemaImportExport.ExportFormat, String) -> Void
    
    @State private var selectedFormat: ThemeSchemaImportExport.ExportFormat = .json
    @State private var filename = ""
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Schema Info
                VStack(alignment: .leading, spacing: 8) {
                    Text("Export Schema")
                        .font(.headline)
                    
                    Text(schema.metadata.name)
                        .font(.title3)
                        .fontWeight(.semibold)
                    
                    Text("by \(schema.metadata.author)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                // Format Selection
                VStack(alignment: .leading, spacing: 12) {
                    Text("Format")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    ForEach(ThemeSchemaImportExport.ExportFormat.allCases, id: \.self) { format in
                        FormatOptionRow(
                            format: format,
                            isSelected: selectedFormat == format,
                            onSelect: { selectedFormat = format }
                        )
                    }
                }
                
                // Filename Input
                VStack(alignment: .leading, spacing: 8) {
                    Text("Filename")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    TextField("Enter filename", text: $filename)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    
                    Text("Will be saved as: \(filename.isEmpty ? schema.metadata.name : filename).\(selectedFormat.fileExtension)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                // Export Button
                Button("Export") {
                    onExport(selectedFormat, filename)
                }
                .buttonStyle(.borderedProminent)
                .frame(maxWidth: .infinity)
            }
            .padding()
            .navigationTitle("Export Options")
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

// MARK: - Import Options View

struct ImportOptionsView: View {
    let importExport: ThemeSchemaImportExport
    let onImport: (ThemeSchema) -> Void
    
    @State private var importJsonText = ""
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Import Schema")
                    .font(.headline)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text("Paste JSON schema:")
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    TextEditor(text: $importJsonText)
                        .frame(height: 200)
                        .padding(8)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                }
                
                Spacer()
                
                Button("Import") {
                    if let schema = importExport.importSchemaFromJSON(importJsonText) {
                        onImport(schema)
                    }
                }
                .buttonStyle(.borderedProminent)
                .disabled(importJsonText.isEmpty)
                .frame(maxWidth: .infinity)
            }
            .padding()
            .navigationTitle("Import Schema")
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

// MARK: - Format Comparison View

struct FormatComparisonView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    Text("Format Comparison")
                        .font(.title)
                        .fontWeight(.bold)
                    
                    Text("Choose the best format for your use case")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                    
                    LazyVStack(spacing: 16) {
                        ForEach(ThemeSchemaImportExport().getFormatComparison(), id: \.format) { comparison in
                            FormatComparisonCard(comparison: comparison)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Format Guide")
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

// MARK: - Supporting Views

struct FormatOptionRow: View {
    let format: ThemeSchemaImportExport.ExportFormat
    let isSelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(format.rawValue)
                        .font(.subheadline)
                        .fontWeight(.medium)
                    
                    Text(format.description)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
                
                Spacer()
                
                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.blue)
                } else {
                    Image(systemName: "circle")
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(isSelected ? Color.blue.opacity(0.1) : Color(.systemGray6))
            .cornerRadius(8)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct FormatComparisonCard: View {
    let comparison: FormatComparison
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(comparison.format)
                .font(.headline)
                .fontWeight(.semibold)
            
            VStack(spacing: 8) {
                ComparisonRow(title: "Readability", value: comparison.humanReadability)
                ComparisonRow(title: "File Size", value: comparison.fileSize)
                ComparisonRow(title: "Performance", value: comparison.parsingPerformance)
                ComparisonRow(title: "Schema", value: comparison.schemaEnforcement)
            }
            
            Text(comparison.primaryUseCase)
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, 4)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .frame(width: 280)
    }
}

struct ComparisonRow: View {
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

struct DocumentPickerView: UIViewControllerRepresentable {
    let onSelect: (URL) -> Void
    
    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [
            UTType.json,
            UTType.text,
            UTType.xml,
            UTType.data
        ])
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {}
    
    func makeCoordinator() -> Coordinator {
        Coordinator(onSelect: onSelect)
    }
    
    class Coordinator: NSObject, UIDocumentPickerDelegate {
        let onSelect: (URL) -> Void
        
        init(onSelect: @escaping (URL) -> Void) {
            self.onSelect = onSelect
        }
        
        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
            guard let url = urls.first else { return }
            onSelect(url)
        }
    }
}

struct ShareSheetView: UIViewControllerRepresentable {
    let url: URL
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let activityVC = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        return activityVC
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

// MARK: - Preview

struct ThemeSchemaImportExportExample_Previews: PreviewProvider {
    static var previews: some View {
        ThemeSchemaImportExportExample()
    }
} 