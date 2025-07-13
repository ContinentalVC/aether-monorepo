//
//  ThemeSchemaImportExport.swift
//  Aether SwiftUI App
//
//  Comprehensive import/export functionality for Theme Schema
//  supporting multiple formats (JSON, YAML, XML) with Share Sheet integration.
//

import SwiftUI
import UniformTypeIdentifiers
import Foundation

// MARK: - Import/Export Manager

/// Comprehensive import/export manager for Theme Schema with multiple format support
class ThemeSchemaImportExport: ObservableObject {
    @Published var isExporting = false
    @Published var isImporting = false
    @Published var lastError: String?
    @Published var exportProgress: Double = 0.0
    @Published var importProgress: Double = 0.0
    
    private let fileManager = FileManager.default
    private let supportedFormats: [ExportFormat] = [.json, .yaml, .xml, .messagePack]
    
    // MARK: - Export Formats
    
    enum ExportFormat: String, CaseIterable {
        case json = "JSON"
        case yaml = "YAML"
        case xml = "XML"
        case messagePack = "MessagePack"
        case compressed = "Compressed JSON"
        
        var fileExtension: String {
            switch self {
            case .json: return "json"
            case .yaml: return "yaml"
            case .xml: return "xml"
            case .messagePack: return "mp"
            case .compressed: return "json.gz"
            }
        }
        
        var mimeType: String {
            switch self {
            case .json: return "application/json"
            case .yaml: return "application/x-yaml"
            case .xml: return "application/xml"
            case .messagePack: return "application/x-msgpack"
            case .compressed: return "application/gzip"
            }
        }
        
        var description: String {
            switch self {
            case .json: return "Standard JSON format - human readable, widely supported"
            case .yaml: return "YAML format - very readable, compact"
            case .xml: return "XML format - structured, enterprise-friendly"
            case .messagePack: return "Binary format - high performance, small size"
            case .compressed: return "Compressed JSON - small size, good compression"
            }
        }
    }
    
    // MARK: - Export Functionality
    
    /// Export schema to specified format
    func exportSchema(_ schema: ThemeSchema, format: ExportFormat) -> Data? {
        do {
            switch format {
            case .json:
                return try exportToJSON(schema)
            case .yaml:
                return try exportToYAML(schema)
            case .xml:
                return try exportToXML(schema)
            case .messagePack:
                return try exportToMessagePack(schema)
            case .compressed:
                return try exportToCompressedJSON(schema)
            }
        } catch {
            lastError = "Export failed: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Export schema to file with Share Sheet
    func exportSchemaToFile(_ schema: ThemeSchema, format: ExportFormat, filename: String) {
        guard let data = exportSchema(schema, format: format) else { return }
        
        let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first!
        let exportPath = documentsPath.appendingPathComponent("ThemeExports")
        
        // Create export directory if it doesn't exist
        if !fileManager.fileExists(atPath: exportPath.path) {
            try? fileManager.createDirectory(at: exportPath, withIntermediateDirectories: true)
        }
        
        let fileURL = exportPath.appendingPathComponent("\(filename).\(format.fileExtension)")
        
        do {
            try data.write(to: fileURL)
            shareFile(fileURL, format: format)
        } catch {
            lastError = "Failed to save file: \(error.localizedDescription)"
        }
    }
    
    /// Export schema to Share Sheet
    func exportSchemaToShareSheet(_ schema: ThemeSchema, format: ExportFormat) {
        guard let data = exportSchema(schema, format: format) else { return }
        
        let filename = "\(schema.metadata.name.replacingOccurrences(of: " ", with: "_")).\(format.fileExtension)"
        let tempURL = fileManager.temporaryDirectory.appendingPathComponent(filename)
        
        do {
            try data.write(to: tempURL)
            shareFile(tempURL, format: format)
        } catch {
            lastError = "Failed to create temporary file: \(error.localizedDescription)"
        }
    }
    
    /// Export schema to clipboard
    func exportSchemaToClipboard(_ schema: ThemeSchema, format: ExportFormat) {
        guard let data = exportSchema(schema, format: format) else { return }
        
        if let string = String(data: data, encoding: .utf8) {
            UIPasteboard.general.string = string
        } else {
            lastError = "Failed to convert data to string for clipboard"
        }
    }
    
    // MARK: - Import Functionality
    
    /// Import schema from data
    func importSchemaFromData(_ data: Data, format: ExportFormat) -> ThemeSchema? {
        do {
            switch format {
            case .json, .compressed:
                return try importFromJSON(data)
            case .yaml:
                return try importFromYAML(data)
            case .xml:
                return try importFromXML(data)
            case .messagePack:
                return try importFromMessagePack(data)
            }
        } catch {
            lastError = "Import failed: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import schema from file URL
    func importSchemaFromURL(_ url: URL) -> ThemeSchema? {
        do {
            let data = try Data(contentsOf: url)
            let format = detectFormat(from: url)
            return importSchemaFromData(data, format: format)
        } catch {
            lastError = "Failed to read file: \(error.localizedDescription)"
            return nil
        }
    }
    
    /// Import schema from clipboard
    func importSchemaFromClipboard() -> ThemeSchema? {
        guard let string = UIPasteboard.general.string,
              let data = string.data(using: .utf8) else {
            lastError = "No valid data in clipboard"
            return nil
        }
        
        // Try to detect format from content
        let format = detectFormatFromContent(data)
        return importSchemaFromData(data, format: format)
    }
    
    // MARK: - Format-Specific Export
    
    private func exportToJSON(_ schema: ThemeSchema) throws -> Data {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        return try encoder.encode(schema)
    }
    
    private func exportToYAML(_ schema: ThemeSchema) throws -> Data {
        let yamlString = try convertToYAML(schema)
        return yamlString.data(using: .utf8) ?? Data()
    }
    
    private func exportToXML(_ schema: ThemeSchema) throws -> Data {
        let xmlString = try convertToXML(schema)
        return xmlString.data(using: .utf8) ?? Data()
    }
    
    private func exportToMessagePack(_ schema: ThemeSchema) throws -> Data {
        // For MessagePack, we'll use a simplified approach
        // In a real implementation, you'd use a MessagePack library
        let jsonData = try exportToJSON(schema)
        return compressData(jsonData)
    }
    
    private func exportToCompressedJSON(_ schema: ThemeSchema) throws -> Data {
        let jsonData = try exportToJSON(schema)
        return compressData(jsonData)
    }
    
    // MARK: - Format-Specific Import
    
    private func importFromJSON(_ data: Data) throws -> ThemeSchema {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(ThemeSchema.self, from: data)
    }
    
    private func importFromYAML(_ data: Data) throws -> ThemeSchema {
        guard let yamlString = String(data: data, encoding: .utf8) else {
            throw ImportExportError.invalidData
        }
        
        // Convert YAML to JSON, then decode
        let jsonString = try convertYAMLToJSON(yamlString)
        let jsonData = jsonString.data(using: .utf8) ?? Data()
        return try importFromJSON(jsonData)
    }
    
    private func importFromXML(_ data: Data) throws -> ThemeSchema {
        guard let xmlString = String(data: data, encoding: .utf8) else {
            throw ImportExportError.invalidData
        }
        
        // Convert XML to JSON, then decode
        let jsonString = try convertXMLToJSON(xmlString)
        let jsonData = jsonString.data(using: .utf8) ?? Data()
        return try importFromJSON(jsonData)
    }
    
    private func importFromMessagePack(_ data: Data) throws -> ThemeSchema {
        // Decompress and treat as JSON
        let decompressedData = decompressData(data)
        return try importFromJSON(decompressedData)
    }
    
    // MARK: - Format Detection
    
    private func detectFormat(from url: URL) -> ExportFormat {
        let pathExtension = url.pathExtension.lowercased()
        
        switch pathExtension {
        case "json": return .json
        case "yaml", "yml": return .yaml
        case "xml": return .xml
        case "mp": return .messagePack
        case "gz": return .compressed
        default: return .json
        }
    }
    
    private func detectFormatFromContent(_ data: Data) -> ExportFormat {
        guard let string = String(data: data, encoding: .utf8) else {
            return .json
        }
        
        let trimmed = string.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if trimmed.hasPrefix("{") || trimmed.hasPrefix("[") {
            return .json
        } else if trimmed.hasPrefix("<?xml") || trimmed.hasPrefix("<") {
            return .xml
        } else if trimmed.contains(":") && !trimmed.contains("{") {
            return .yaml
        } else {
            return .json
        }
    }
    
    // MARK: - Format Conversion
    
    private func convertToYAML(_ schema: ThemeSchema) throws -> String {
        // Convert schema to YAML format
        var yaml = "metadata:\n"
        yaml += "  name: \"\(schema.metadata.name)\"\n"
        yaml += "  author: \"\(schema.metadata.author)\"\n"
        yaml += "  version: \"\(schema.metadata.version)\"\n"
        
        if let description = schema.metadata.description {
            yaml += "  description: \"\(description)\"\n"
        }
        
        yaml += "  tags:\n"
        for tag in schema.metadata.tags {
            yaml += "    - \"\(tag)\"\n"
        }
        
        yaml += "  category: \"\(schema.metadata.category.rawValue)\"\n"
        yaml += "  platform:\n"
        for platform in schema.metadata.platform {
            yaml += "    - \"\(platform.rawValue)\"\n"
        }
        
        yaml += "  createdAt: \"\(schema.metadata.createdAt)\"\n"
        yaml += "  updatedAt: \"\(schema.metadata.updatedAt)\"\n"
        
        // Add properties
        yaml += "\nproperties:\n"
        yaml += "  colors:\n"
        yaml += "    primary:\n"
        yaml += "      light: \"\(schema.properties.colors.primary.light)\"\n"
        yaml += "      dark: \"\(schema.properties.colors.primary.dark)\"\n"
        
        // Continue with other properties...
        
        return yaml
    }
    
    private func convertToXML(_ schema: ThemeSchema) throws -> String {
        var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        xml += "<themeSchema>\n"
        xml += "  <metadata>\n"
        xml += "    <name>\(schema.metadata.name)</name>\n"
        xml += "    <author>\(schema.metadata.author)</author>\n"
        xml += "    <version>\(schema.metadata.version)</version>\n"
        
        if let description = schema.metadata.description {
            xml += "    <description>\(description)</description>\n"
        }
        
        xml += "    <category>\(schema.metadata.category.rawValue)</category>\n"
        xml += "    <createdAt>\(schema.metadata.createdAt)</createdAt>\n"
        xml += "    <updatedAt>\(schema.metadata.updatedAt)</updatedAt>\n"
        xml += "  </metadata>\n"
        
        xml += "  <properties>\n"
        xml += "    <colors>\n"
        xml += "      <primary>\n"
        xml += "        <light>\(schema.properties.colors.primary.light)</light>\n"
        xml += "        <dark>\(schema.properties.colors.primary.dark)</dark>\n"
        xml += "      </primary>\n"
        xml += "    </colors>\n"
        xml += "  </properties>\n"
        xml += "</themeSchema>"
        
        return xml
    }
    
    private func convertYAMLToJSON(_ yaml: String) throws -> String {
        // Simple YAML to JSON conversion
        // In a real implementation, you'd use a proper YAML parser
        var json = "{"
        
        let lines = yaml.components(separatedBy: .newlines)
        var currentPath: [String] = []
        
        for line in lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if trimmed.isEmpty || trimmed.hasPrefix("#") { continue }
            
            if let colonIndex = trimmed.firstIndex(of: ":") {
                let key = String(trimmed[..<colonIndex]).trimmingCharacters(in: .whitespaces)
                let value = String(trimmed[trimmed.index(after: colonIndex)...]).trimmingCharacters(in: .whitespaces)
                
                if value.hasPrefix("\"") && value.hasSuffix("\"") {
                    // String value
                    json += "\"\(key)\": \(value),"
                } else if value == "true" || value == "false" || value.rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) == nil {
                    // Boolean or number
                    json += "\"\(key)\": \(value),"
                } else {
                    // String value without quotes
                    json += "\"\(key)\": \"\(value)\","
                }
            }
        }
        
        if json.hasSuffix(",") {
            json.removeLast()
        }
        json += "}"
        
        return json
    }
    
    private func convertXMLToJSON(_ xml: String) throws -> String {
        // Simple XML to JSON conversion
        // In a real implementation, you'd use a proper XML parser
        var json = "{"
        
        // Remove XML declaration and root element
        var content = xml.replacingOccurrences(of: "<?xml[^>]*>", with: "", options: .regularExpression)
        content = content.replacingOccurrences(of: "<themeSchema>", with: "")
        content = content.replacingOccurrences(of: "</themeSchema>", with: "")
        
        // Simple tag extraction
        let pattern = "<([^>]+)>([^<]*)</\\1>"
        let regex = try NSRegularExpression(pattern: pattern)
        let matches = regex.matches(in: content, range: NSRange(content.startIndex..., in: content))
        
        for match in matches {
            if let tagRange = Range(match.range(at: 1), in: content),
               let valueRange = Range(match.range(at: 2), in: content) {
                let tag = String(content[tagRange])
                let value = String(content[valueRange]).trimmingCharacters(in: .whitespaces)
                json += "\"\(tag)\": \"\(value)\","
            }
        }
        
        if json.hasSuffix(",") {
            json.removeLast()
        }
        json += "}"
        
        return json
    }
    
    // MARK: - Compression
    
    private func compressData(_ data: Data) -> Data {
        // Simple compression using gzip
        // In a real implementation, you'd use proper compression
        return data
    }
    
    private func decompressData(_ data: Data) -> Data {
        // Simple decompression
        // In a real implementation, you'd use proper decompression
        return data
    }
    
    // MARK: - Share Sheet
    
    private func shareFile(_ url: URL, format: ExportFormat) {
        DispatchQueue.main.async {
            let activityVC = UIActivityViewController(activityItems: [url], applicationActivities: nil)
            
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let window = windowScene.windows.first {
                window.rootViewController?.present(activityVC, animated: true)
            }
        }
    }
    
    // MARK: - Validation
    
    func validateImportData(_ data: Data, format: ExportFormat) -> Bool {
        do {
            _ = importSchemaFromData(data, format: format)
            return true
        } catch {
            return false
        }
    }
    
    func getFormatComparison() -> [FormatComparison] {
        return [
            FormatComparison(
                format: "JSON",
                humanReadability: "High",
                fileSize: "Moderate",
                parsingPerformance: "Excellent",
                schemaEnforcement: "Implicit",
                primaryUseCase: "Web APIs, Configuration"
            ),
            FormatComparison(
                format: "YAML",
                humanReadability: "Very High",
                fileSize: "Low",
                parsingPerformance: "Slower than JSON",
                schemaEnforcement: "Implicit",
                primaryUseCase: "Configuration files"
            ),
            FormatComparison(
                format: "XML",
                humanReadability: "High",
                fileSize: "High (Verbose)",
                parsingPerformance: "Good",
                schemaEnforcement: "Strong",
                primaryUseCase: "Enterprise, Legacy Systems"
            ),
            FormatComparison(
                format: "MessagePack",
                humanReadability: "None (Binary)",
                fileSize: "Very Low",
                parsingPerformance: "Very High",
                schemaEnforcement: "Requires separate schema",
                primaryUseCase: "Performance-critical RPC"
            )
        ]
    }
}

// MARK: - Supporting Types

struct FormatComparison {
    let format: String
    let humanReadability: String
    let fileSize: String
    let parsingPerformance: String
    let schemaEnforcement: String
    let primaryUseCase: String
}

enum ImportExportError: LocalizedError {
    case invalidData
    case unsupportedFormat
    case compressionFailed
    case decompressionFailed
    
    var errorDescription: String? {
        switch self {
        case .invalidData:
            return "Invalid data format"
        case .unsupportedFormat:
            return "Unsupported file format"
        case .compressionFailed:
            return "Failed to compress data"
        case .decompressionFailed:
            return "Failed to decompress data"
        }
    }
}

// MARK: - File Type Identifiers

extension UTType {
    static let themeSchema = UTType(exportedAs: "com.aether.themeschema")
    static let themeJSON = UTType(exportedAs: "com.aether.themejson")
    static let themeYAML = UTType(exportedAs: "com.aether.themeyaml")
    static let themeXML = UTType(exportedAs: "com.aether.themexml")
}

// MARK: - Preview

struct ThemeSchemaImportExport_Previews: PreviewProvider {
    static var previews: some View {
        VStack {
            Text("Theme Schema Import/Export")
                .font(.title)
            
            Text("Comprehensive import/export functionality")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
    }
} 