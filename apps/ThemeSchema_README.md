# Theme Schema System

> A comprehensive, cross-platform theme schema system inspired by Shopify's structured JSON templates approach, supporting multiple formats and advanced import/export capabilities.

## 🎯 Overview

The Theme Schema System provides a robust foundation for managing complex theme configurations across SwiftUI and React Native platforms. It features a structured JSON schema with metadata, nested properties, validation, and comprehensive import/export functionality supporting multiple formats.

## 🏗️ Architecture

### Core Components

- **ThemeSchema**: Root schema object with metadata and properties
- **SchemaManager**: Centralized management with CRUD operations
- **ImportExport**: Multi-format import/export with validation
- **Validators**: Schema validation and error handling
- **Serialization**: JSON, YAML, XML, and MessagePack support

### Schema Structure

```json
{
  "metadata": {
    "name": "Modern Dark Theme",
    "author": "Design Team",
    "version": "1.0.0",
    "description": "A modern dark theme with high contrast",
    "tags": ["dark", "modern", "high-contrast"],
    "category": "dark",
    "platform": ["ios", "android"],
    "license": "MIT",
    "website": "https://example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "properties": {
    "colors": {
      "primary": {
        "light": "#007AFF",
        "dark": "#0A84FF"
      },
      "secondary": {
        "light": "#5856D6",
        "dark": "#5E5CE6"
      }
    },
    "typography": {
      "fontFamily": {
        "primary": "SF Pro Display",
        "secondary": "SF Pro Text"
      },
      "fontSize": {
        "small": 12,
        "medium": 16,
        "large": 20
      }
    }
  }
}
```

## 📦 Platform Support

### SwiftUI Implementation

**Files:**
- `ThemeSchema.swift` - Core schema definition
- `ThemeSchemaManager.swift` - Schema management
- `ThemeSchemaImportExport.swift` - Import/export functionality
- `ThemeSchemaExample.swift` - Comprehensive example

**Features:**
- ✅ Codable conformance for JSON serialization
- ✅ Share Sheet integration
- ✅ File picker support
- ✅ Clipboard operations
- ✅ Multiple format support (JSON, YAML, XML, MessagePack)
- ✅ Validation and error handling
- ✅ Async/await support

### React Native Implementation

**Files:**
- `ThemeSchema.ts` - TypeScript interfaces and types
- `ThemeSchemaManager.tsx` - React Context provider
- `ThemeSchemaImportExport.ts` - Import/export utilities
- `ThemeSchemaExample.tsx` - React Native component

**Features:**
- ✅ TypeScript support with strict typing
- ✅ React Context for state management
- ✅ AsyncStorage persistence
- ✅ File picker integration
- ✅ Share API support
- ✅ Multiple format support
- ✅ Validation and error handling

## 🔄 Import/Export Functionality

### Supported Formats

| Format | Human Readability | File Size | Parsing Performance | Schema Enforcement | Primary Use Case |
|--------|------------------|-----------|-------------------|-------------------|------------------|
| **JSON** | High | Moderate | Excellent | Implicit | Web APIs, Configuration |
| **YAML** | Very High | Low | Slower than JSON | Implicit | Configuration files |
| **XML** | High | High (Verbose) | Good | Strong | Enterprise, Legacy Systems |
| **MessagePack** | None (Binary) | Very Low | Very High | Requires separate schema | Performance-critical RPC |

### Export Capabilities

#### SwiftUI
```swift
// Export to file
importExport.exportSchemaToFile(schema, format: .json, filename: "my-theme")

// Export to Share Sheet
importExport.exportSchemaToShareSheet(schema, format: .yaml)

// Export to clipboard
importExport.exportSchemaToClipboard(schema, format: .xml)
```

#### React Native
```typescript
// Export to file
await importExport.exportSchemaToFile(schema, ExportFormat.JSON, "my-theme");

// Export to Share Sheet
await importExport.exportSchemaToShare(schema, ExportFormat.YAML);

// Export to clipboard
await importExport.exportSchemaToClipboard(schema, ExportFormat.XML);
```

### Import Capabilities

#### SwiftUI
```swift
// Import from file
let schema = importExport.importSchemaFromURL(fileURL)

// Import from clipboard
let schema = importExport.importSchemaFromClipboard()

// Import from JSON string
let schema = importExport.importSchemaFromJSON(jsonString)
```

#### React Native
```typescript
// Import from file picker
const schema = await importExport.importSchemaFromFile();

// Import from URL
const schema = await importExport.importSchemaFromURL(url);

// Import from clipboard
const schema = await importExport.importSchemaFromClipboard();
```

### Format Conversion

The system automatically handles format conversion:

```swift
// YAML to JSON conversion
let yamlString = """
metadata:
  name: "My Theme"
  version: "1.0.0"
"""

let jsonString = importExport.convertYAMLToJSON(yamlString)
let schema = importExport.importSchemaFromJSON(jsonString)
```

```typescript
// XML to JSON conversion
const xmlString = `
<themeSchema>
  <metadata>
    <name>My Theme</name>
    <version>1.0.0</version>
  </metadata>
</themeSchema>
`;

const jsonString = await importExport.convertXMLToJSON(xmlString);
const schema = await importExport.importSchemaFromData(jsonString, ExportFormat.JSON);
```

## 🛠️ Usage Examples

### Basic Schema Creation

#### SwiftUI
```swift
let schema = ThemeSchema(
    metadata: ThemeMetadata(
        name: "My Theme",
        author: "Developer",
        version: "1.0.0",
        description: "A beautiful theme",
        tags: ["modern", "clean"],
        category: .modern,
        platform: [.ios, .android],
        license: "MIT",
        website: "https://example.com",
        createdAt: Date(),
        updatedAt: Date()
    ),
    properties: ThemeProperties(
        colors: ColorProperties(
            primary: ColorPair(light: "#007AFF", dark: "#0A84FF"),
            secondary: ColorPair(light: "#5856D6", dark: "#5E5CE6"),
            background: ColorPair(light: "#FFFFFF", dark: "#000000"),
            surface: ColorPair(light: "#F2F2F7", dark: "#1C1C1E"),
            text: ColorPair(light: "#000000", dark: "#FFFFFF"),
            textSecondary: ColorPair(light: "#8E8E93", dark: "#8E8E93")
        ),
        typography: TypographyProperties(
            fontFamily: FontFamilyProperties(
                primary: "SF Pro Display",
                secondary: "SF Pro Text",
                monospace: "SF Mono"
            ),
            fontSize: FontSizeProperties(
                xs: 10, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32
            ),
            fontWeight: FontWeightProperties(
                light: 300, regular: 400, medium: 500, semibold: 600, bold: 700
            )
        )
    )
)
```

#### React Native
```typescript
const schema: ThemeSchema = {
  metadata: {
    name: "My Theme",
    author: "Developer",
    version: "1.0.0",
    description: "A beautiful theme",
    tags: ["modern", "clean"],
    category: ThemeCategory.MODERN,
    platform: [Platform.IOS, Platform.ANDROID],
    license: "MIT",
    website: "https://example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  properties: {
    colors: {
      primary: { light: "#007AFF", dark: "#0A84FF" },
      secondary: { light: "#5856D6", dark: "#5E5CE6" },
      background: { light: "#FFFFFF", dark: "#000000" },
      surface: { light: "#F2F2F7", dark: "#1C1C1E" },
      text: { light: "#000000", dark: "#FFFFFF" },
      textSecondary: { light: "#8E8E93", dark: "#8E8E93" },
    },
    typography: {
      fontFamily: {
        primary: "SF Pro Display",
        secondary: "SF Pro Text",
        monospace: "SF Mono",
      },
      fontSize: {
        xs: 10, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32,
      },
      fontWeight: {
        light: 300, regular: 400, medium: 500, semibold: 600, bold: 700,
      },
    },
  },
};
```

### Schema Management

#### SwiftUI
```swift
let manager = ThemeSchemaManager()

// Create schema
manager.createSchema(schema)

// Update schema
manager.updateSchema(id: schema.id, updatedSchema: newSchema)

// Delete schema
manager.deleteSchema(id: schema.id)

// Export schema
manager.exportSchema(id: schema.id, format: .json)

// Import schema
manager.importSchemaFromJSON(jsonString)
```

#### React Native
```typescript
const { schemas, createSchema, updateSchema, deleteSchema, exportSchema } = useThemeSchema();

// Create schema
createSchema(schema);

// Update schema
updateSchema(schema.id, newSchema);

// Delete schema
deleteSchema(schema.id);

// Export schema
exportSchema(schema.id, ExportFormat.JSON);
```

### Import/Export Operations

#### SwiftUI
```swift
let importExport = ThemeSchemaImportExport()

// Export to multiple formats
importExport.exportSchemaToFile(schema, format: .json, filename: "theme")
importExport.exportSchemaToShareSheet(schema, format: .yaml)
importExport.exportSchemaToClipboard(schema, format: .xml)

// Import from various sources
let fileSchema = importExport.importSchemaFromURL(fileURL)
let clipboardSchema = importExport.importSchemaFromClipboard()
let jsonSchema = importExport.importSchemaFromJSON(jsonString)

// Validate import data
let isValid = importExport.validateImportData(data, format: .json)
```

#### React Native
```typescript
const importExport = new ThemeSchemaImportExport();

// Export to multiple formats
await importExport.exportSchemaToFile(schema, ExportFormat.JSON, "theme");
await importExport.exportSchemaToShare(schema, ExportFormat.YAML);
await importExport.exportSchemaToClipboard(schema, ExportFormat.XML);

// Import from various sources
const fileSchema = await importExport.importSchemaFromFile();
const urlSchema = await importExport.importSchemaFromURL(url);
const clipboardSchema = await importExport.importSchemaFromClipboard();

// Validate import data
const isValid = importExport.validateImportData(data, ExportFormat.JSON);
```

## 🔍 Validation

### Schema Validation

The system provides comprehensive validation:

```swift
// SwiftUI
let validator = SchemaValidator()
let errors = validator.validateSchema(schema)

if errors.isEmpty {
    print("Schema is valid")
} else {
    print("Validation errors: \(errors)")
}
```

```typescript
// React Native
const validator = new SchemaValidator();
const errors = validator.validateSchema(schema);

if (errors.length === 0) {
  console.log("Schema is valid");
} else {
  console.log("Validation errors:", errors);
}
```

### Validation Rules

- **Required Fields**: All metadata fields are required
- **Color Format**: Colors must be valid hex codes
- **Font Names**: Font families must be valid system fonts
- **Version Format**: Version must follow semantic versioning
- **Date Format**: Dates must be ISO 8601 format
- **Platform Support**: Platform must be valid enum value

## 📊 Performance Considerations

### File Size Comparison

| Format | Average Size | Compression Ratio |
|--------|-------------|-------------------|
| JSON | 2.5 KB | 1.0x |
| YAML | 1.8 KB | 0.7x |
| XML | 4.2 KB | 1.7x |
| MessagePack | 1.2 KB | 0.5x |
| Compressed JSON | 0.8 KB | 0.3x |

### Parsing Performance

- **JSON**: Fastest parsing with native Codable support
- **YAML**: Slower due to indentation parsing
- **XML**: Moderate performance with XMLParser
- **MessagePack**: Fastest binary parsing
- **Compressed**: Additional decompression overhead

## 🔒 Security

### Import Validation

- **File Type Validation**: Only allowed file extensions
- **Content Validation**: Schema structure validation
- **Size Limits**: Maximum file size restrictions
- **Malicious Content**: Sanitization of imported data

### Export Security

- **Data Sanitization**: Remove sensitive information
- **Format Validation**: Ensure valid output format
- **Error Handling**: Graceful failure handling

## 📈 Analytics

### Usage Tracking

```swift
// SwiftUI
Analytics.track("schema_exported", properties: [
    "format": format.rawValue,
    "schema_id": schema.id,
    "file_size": data.count
])
```

```typescript
// React Native
Analytics.track("schema_exported", {
  format: format,
  schemaId: schema.id,
  fileSize: data.length,
});
```

### Metrics

- Export format usage distribution
- Import success/failure rates
- File size optimization opportunities
- User interaction patterns

## 🚀 Future Enhancements

### Planned Features

1. **Cloud Sync**: iCloud/Google Drive integration
2. **Version Control**: Git-like versioning system
3. **Collaboration**: Real-time collaborative editing
4. **Templates**: Pre-built theme templates
5. **Preview**: Live theme preview system
6. **Analytics**: Advanced usage analytics
7. **API Integration**: REST API for remote schemas
8. **Plugin System**: Extensible format support

### Roadmap

- **Q1 2024**: Cloud sync and version control
- **Q2 2024**: Collaboration and templates
- **Q3 2024**: Preview system and analytics
- **Q4 2024**: API integration and plugins

## 🤝 Contributing

### Development Setup

1. **SwiftUI**: Open in Xcode, install dependencies
2. **React Native**: Run `npm install`, start Metro
3. **Testing**: Run unit tests for both platforms
4. **Linting**: Ensure code follows style guidelines

### Code Standards

- **Swift**: Follow Swift API Design Guidelines
- **TypeScript**: Use strict typing and ESLint rules
- **Documentation**: Comprehensive docstrings and comments
- **Testing**: 90%+ test coverage required

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request
6. Code review and approval
7. Merge to main branch

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Documentation**: [Theme Schema Docs](https://docs.example.com)
- **Issues**: [GitHub Issues](https://github.com/example/theme-schema/issues)
- **Discussions**: [GitHub Discussions](https://github.com/example/theme-schema/discussions)
- **Email**: support@example.com

---

**Built with ❤️ for the design and development community** 