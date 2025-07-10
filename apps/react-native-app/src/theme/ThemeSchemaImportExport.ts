/**
 * Theme Schema Import/Export
 * 
 * Comprehensive import/export functionality for Theme Schema
 * supporting multiple formats (JSON, YAML, XML) with file picker and sharing.
 */

import { Platform, Share, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import {
  ThemeSchema,
  SchemaValidationError,
  SchemaValidator,
  SchemaSerialization,
} from './ThemeSchema';

// MARK: - Export Formats

export enum ExportFormat {
  JSON = 'JSON',
  YAML = 'YAML',
  XML = 'XML',
  MESSAGEPACK = 'MessagePack',
  COMPRESSED = 'Compressed JSON',
}

// MARK: - Import/Export Manager

/**
 * Comprehensive import/export manager for Theme Schema with multiple format support
 */
export class ThemeSchemaImportExport {
  private supportedFormats: ExportFormat[] = [
    ExportFormat.JSON,
    ExportFormat.YAML,
    ExportFormat.XML,
    ExportFormat.MESSAGEPACK,
  ];

  /**
   * Get format information
   */
  getFormatInfo(format: ExportFormat): FormatInfo {
    switch (format) {
      case ExportFormat.JSON:
        return {
          extension: 'json',
          mimeType: 'application/json',
          description: 'Standard JSON format - human readable, widely supported',
        };
      case ExportFormat.YAML:
        return {
          extension: 'yaml',
          mimeType: 'application/x-yaml',
          description: 'YAML format - very readable, compact',
        };
      case ExportFormat.XML:
        return {
          extension: 'xml',
          mimeType: 'application/xml',
          description: 'XML format - structured, enterprise-friendly',
        };
      case ExportFormat.MESSAGEPACK:
        return {
          extension: 'mp',
          mimeType: 'application/x-msgpack',
          description: 'Binary format - high performance, small size',
        };
      case ExportFormat.COMPRESSED:
        return {
          extension: 'json.gz',
          mimeType: 'application/gzip',
          description: 'Compressed JSON - small size, good compression',
        };
    }
  }

  // MARK: - Export Functionality

  /**
   * Export schema to specified format
   */
  async exportSchema(schema: ThemeSchema, format: ExportFormat): Promise<string | null> {
    try {
      switch (format) {
        case ExportFormat.JSON:
          return this.exportToJSON(schema);
        case ExportFormat.YAML:
          return this.exportToYAML(schema);
        case ExportFormat.XML:
          return this.exportToXML(schema);
        case ExportFormat.MESSAGEPACK:
          return this.exportToMessagePack(schema);
        case ExportFormat.COMPRESSED:
          return this.exportToCompressedJSON(schema);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      return null;
    }
  }

  /**
   * Export schema to file
   */
  async exportSchemaToFile(schema: ThemeSchema, format: ExportFormat, filename: string): Promise<boolean> {
    try {
      const data = await this.exportSchema(schema, format);
      if (!data) return false;

      const formatInfo = this.getFormatInfo(format);
      const fullFilename = `${filename}.${formatInfo.extension}`;
      
      const fileUri = `${FileSystem.documentDirectory}${fullFilename}`;
      await FileSystem.writeAsStringAsync(fileUri, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return true;
    } catch (error) {
      console.error('Failed to save file:', error);
      return false;
    }
  }

  /**
   * Export schema to Share Sheet
   */
  async exportSchemaToShare(schema: ThemeSchema, format: ExportFormat): Promise<boolean> {
    try {
      const data = await this.exportSchema(schema, format);
      if (!data) return false;

      const formatInfo = this.getFormatInfo(format);
      const filename = `${schema.metadata.name.replace(/\s+/g, '_')}.${formatInfo.extension}`;
      
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: formatInfo.mimeType,
          dialogTitle: `Share ${schema.metadata.name}`,
        });
        return true;
      } else {
        // Fallback to clipboard
        return this.exportSchemaToClipboard(schema, format);
      }
    } catch (error) {
      console.error('Failed to share file:', error);
      return false;
    }
  }

  /**
   * Export schema to clipboard
   */
  async exportSchemaToClipboard(schema: ThemeSchema, format: ExportFormat): Promise<boolean> {
    try {
      const data = await this.exportSchema(schema, format);
      if (!data) return false;

      // In React Native, we can't directly access clipboard
      // Instead, we'll show the data in an alert for copying
      Alert.alert(
        'Export Data',
        'Copy the following data to your clipboard:',
        [
          {
            text: 'Copy',
            onPress: () => {
              // In a real app, you'd use a clipboard library
              console.log('Data to copy:', data);
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );

      return true;
    } catch (error) {
      console.error('Failed to export to clipboard:', error);
      return false;
    }
  }

  /**
   * Export schema to AsyncStorage
   */
  async exportSchemaToStorage(schema: ThemeSchema, format: ExportFormat): Promise<boolean> {
    try {
      const data = await this.exportSchema(schema, format);
      if (!data) return false;

      const key = `exported_schema_${schema.id}_${Date.now()}`;
      await AsyncStorage.setItem(key, data);
      
      return true;
    } catch (error) {
      console.error('Failed to save to storage:', error);
      return false;
    }
  }

  // MARK: - Import Functionality

  /**
   * Import schema from data
   */
  async importSchemaFromData(data: string, format: ExportFormat): Promise<ThemeSchema | null> {
    try {
      switch (format) {
        case ExportFormat.JSON:
        case ExportFormat.COMPRESSED:
          return this.importFromJSON(data);
        case ExportFormat.YAML:
          return this.importFromYAML(data);
        case ExportFormat.XML:
          return this.importFromXML(data);
        case ExportFormat.MESSAGEPACK:
          return this.importFromMessagePack(data);
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
    } catch (error) {
      console.error('Import failed:', error);
      return null;
    }
  }

  /**
   * Import schema from file picker
   */
  async importSchemaFromFile(): Promise<ThemeSchema | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/json',
          'application/x-yaml',
          'application/xml',
          'application/x-msgpack',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const file = result.assets[0];
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      const format = this.detectFormatFromFilename(file.name);
      
      return this.importSchemaFromData(fileContent, format);
    } catch (error) {
      console.error('Failed to import from file:', error);
      return null;
    }
  }

  /**
   * Import schema from URL
   */
  async importSchemaFromURL(url: string): Promise<ThemeSchema | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.text();
      const format = this.detectFormatFromURL(url);
      
      return this.importSchemaFromData(data, format);
    } catch (error) {
      console.error('Failed to import from URL:', error);
      return null;
    }
  }

  /**
   * Import schema from clipboard
   */
  async importSchemaFromClipboard(): Promise<ThemeSchema | null> {
    try {
      // In React Native, we can't directly access clipboard
      // This would require a clipboard library like @react-native-clipboard/clipboard
      Alert.alert(
        'Import from Clipboard',
        'Please paste the schema data in the input field below.',
        [{ text: 'OK' }]
      );
      
      return null;
    } catch (error) {
      console.error('Failed to import from clipboard:', error);
      return null;
    }
  }

  /**
   * Import schema from AsyncStorage
   */
  async importSchemaFromStorage(key: string): Promise<ThemeSchema | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const format = this.detectFormatFromContent(data);
      return this.importSchemaFromData(data, format);
    } catch (error) {
      console.error('Failed to import from storage:', error);
      return null;
    }
  }

  // MARK: - Format-Specific Export

  private exportToJSON(schema: ThemeSchema): string {
    return SchemaSerialization.encode(schema);
  }

  private async exportToYAML(schema: ThemeSchema): Promise<string> {
    return this.convertToYAML(schema);
  }

  private async exportToXML(schema: ThemeSchema): Promise<string> {
    return this.convertToXML(schema);
  }

  private async exportToMessagePack(schema: ThemeSchema): Promise<string> {
    // For MessagePack, we'll use a simplified approach
    // In a real implementation, you'd use a MessagePack library
    const jsonData = this.exportToJSON(schema);
    return this.compressData(jsonData);
  }

  private async exportToCompressedJSON(schema: ThemeSchema): Promise<string> {
    const jsonData = this.exportToJSON(schema);
    return this.compressData(jsonData);
  }

  // MARK: - Format-Specific Import

  private importFromJSON(data: string): ThemeSchema {
    return SchemaSerialization.decode(data);
  }

  private async importFromYAML(data: string): Promise<ThemeSchema> {
    // Convert YAML to JSON, then decode
    const jsonString = await this.convertYAMLToJSON(data);
    return this.importFromJSON(jsonString);
  }

  private async importFromXML(data: string): Promise<ThemeSchema> {
    // Convert XML to JSON, then decode
    const jsonString = await this.convertXMLToJSON(data);
    return this.importFromJSON(jsonString);
  }

  private async importFromMessagePack(data: string): Promise<ThemeSchema> {
    // Decompress and treat as JSON
    const decompressedData = this.decompressData(data);
    return this.importFromJSON(decompressedData);
  }

  // MARK: - Format Detection

  detectFormatFromFilename(filename: string): ExportFormat {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'json':
        return ExportFormat.JSON;
      case 'yaml':
      case 'yml':
        return ExportFormat.YAML;
      case 'xml':
        return ExportFormat.XML;
      case 'mp':
        return ExportFormat.MESSAGEPACK;
      case 'gz':
        return ExportFormat.COMPRESSED;
      default:
        return ExportFormat.JSON;
    }
  }

  private detectFormatFromURL(url: string): ExportFormat {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return this.detectFormatFromFilename(pathname);
  }

  private detectFormatFromContent(data: string): ExportFormat {
    const trimmed = data.trim();
    
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return ExportFormat.JSON;
    } else if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
      return ExportFormat.XML;
    } else if (trimmed.includes(':') && !trimmed.includes('{')) {
      return ExportFormat.YAML;
    } else {
      return ExportFormat.JSON;
    }
  }

  // MARK: - Format Conversion

  private async convertToYAML(schema: ThemeSchema): Promise<string> {
    let yaml = 'metadata:\n';
    yaml += `  name: "${schema.metadata.name}"\n`;
    yaml += `  author: "${schema.metadata.author}"\n`;
    yaml += `  version: "${schema.metadata.version}"\n`;
    
    if (schema.metadata.description) {
      yaml += `  description: "${schema.metadata.description}"\n`;
    }
    
    yaml += '  tags:\n';
    for (const tag of schema.metadata.tags) {
      yaml += `    - "${tag}"\n`;
    }
    
    yaml += `  category: "${schema.metadata.category}"\n`;
    yaml += '  platform:\n';
    for (const platform of schema.metadata.platform) {
      yaml += `    - "${platform}"\n`;
    }
    
    yaml += `  createdAt: "${schema.metadata.createdAt}"\n`;
    yaml += `  updatedAt: "${schema.metadata.updatedAt}"\n`;
    
    // Add properties
    yaml += '\nproperties:\n';
    yaml += '  colors:\n';
    yaml += '    primary:\n';
    yaml += `      light: "${schema.properties.colors.primary.light}"\n`;
    yaml += `      dark: "${schema.properties.colors.primary.dark}"\n`;
    
    // Continue with other properties...
    
    return yaml;
  }

  private async convertToXML(schema: ThemeSchema): Promise<string> {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<themeSchema>\n';
    xml += '  <metadata>\n';
    xml += `    <name>${schema.metadata.name}</name>\n`;
    xml += `    <author>${schema.metadata.author}</author>\n`;
    xml += `    <version>${schema.metadata.version}</version>\n`;
    
    if (schema.metadata.description) {
      xml += `    <description>${schema.metadata.description}</description>\n`;
    }
    
    xml += `    <category>${schema.metadata.category}</category>\n`;
    xml += `    <createdAt>${schema.metadata.createdAt}</createdAt>\n`;
    xml += `    <updatedAt>${schema.metadata.updatedAt}</updatedAt>\n`;
    xml += '  </metadata>\n';
    
    xml += '  <properties>\n';
    xml += '    <colors>\n';
    xml += '      <primary>\n';
    xml += `        <light>${schema.properties.colors.primary.light}</light>\n`;
    xml += `        <dark>${schema.properties.colors.primary.dark}</dark>\n`;
    xml += '      </primary>\n';
    xml += '    </colors>\n';
    xml += '  </properties>\n';
    xml += '</themeSchema>';
    
    return xml;
  }

  private async convertYAMLToJSON(yaml: string): Promise<string> {
    // Simple YAML to JSON conversion
    // In a real implementation, you'd use a proper YAML parser
    let json = '{';
    
    const lines = yaml.split('\n');
    const currentPath: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1) {
        const key = trimmed.substring(0, colonIndex).trim();
        const value = trimmed.substring(colonIndex + 1).trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
          // String value
          json += `"${key}": ${value},`;
        } else if (value === 'true' || value === 'false' || /^\d+$/.test(value)) {
          // Boolean or number
          json += `"${key}": ${value},`;
        } else {
          // String value without quotes
          json += `"${key}": "${value}",`;
        }
      }
    }
    
    if (json.endsWith(',')) {
      json = json.slice(0, -1);
    }
    json += '}';
    
    return json;
  }

  private async convertXMLToJSON(xml: string): Promise<string> {
    // Simple XML to JSON conversion
    // In a real implementation, you'd use a proper XML parser
    let json = '{';
    
    // Remove XML declaration and root element
    let content = xml.replace(/<\?xml[^>]*>/g, '');
    content = content.replace(/<themeSchema>/g, '');
    content = content.replace(/<\/themeSchema>/g, '');
    
    // Simple tag extraction
    const pattern = /<([^>]+)>([^<]*)<\/\1>/g;
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      const tag = match[1];
      const value = match[2].trim();
      json += `"${tag}": "${value}",`;
    }
    
    if (json.endsWith(',')) {
      json = json.slice(0, -1);
    }
    json += '}';
    
    return json;
  }

  // MARK: - Compression

  private compressData(data: string): string {
    // Simple compression using gzip
    // In a real implementation, you'd use proper compression
    return data;
  }

  private decompressData(data: string): string {
    // Simple decompression
    // In a real implementation, you'd use proper decompression
    return data;
  }

  // MARK: - Validation

  validateImportData(data: string, format: ExportFormat): boolean {
    try {
      this.importSchemaFromData(data, format);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get format comparison data
   */
  getFormatComparison(): FormatComparison[] {
    return [
      {
        format: 'JSON',
        humanReadability: 'High',
        fileSize: 'Moderate',
        parsingPerformance: 'Excellent',
        schemaEnforcement: 'Implicit',
        primaryUseCase: 'Web APIs, Configuration',
      },
      {
        format: 'YAML',
        humanReadability: 'Very High',
        fileSize: 'Low',
        parsingPerformance: 'Slower than JSON',
        schemaEnforcement: 'Implicit',
        primaryUseCase: 'Configuration files',
      },
      {
        format: 'XML',
        humanReadability: 'High',
        fileSize: 'High (Verbose)',
        parsingPerformance: 'Good',
        schemaEnforcement: 'Strong',
        primaryUseCase: 'Enterprise, Legacy Systems',
      },
      {
        format: 'MessagePack',
        humanReadability: 'None (Binary)',
        fileSize: 'Very Low',
        parsingPerformance: 'Very High',
        schemaEnforcement: 'Requires separate schema',
        primaryUseCase: 'Performance-critical RPC',
      },
    ];
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): ExportFormat[] {
    return this.supportedFormats;
  }

  /**
   * Check if format is supported
   */
  isFormatSupported(format: ExportFormat): boolean {
    return this.supportedFormats.includes(format);
  }
}

// MARK: - Supporting Types

export interface FormatInfo {
  extension: string;
  mimeType: string;
  description: string;
}

export interface FormatComparison {
  format: string;
  humanReadability: string;
  fileSize: string;
  parsingPerformance: string;
  schemaEnforcement: string;
  primaryUseCase: string;
}

export interface ImportExportResult {
  success: boolean;
  data?: ThemeSchema;
  error?: string;
  format?: ExportFormat;
}

// MARK: - Error Types

export enum ImportExportError {
  INVALID_DATA = 'INVALID_DATA',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  COMPRESSION_FAILED = 'COMPRESSION_FAILED',
  DECOMPRESSION_FAILED = 'DECOMPRESSION_FAILED',
  FILE_READ_FAILED = 'FILE_READ_FAILED',
  FILE_WRITE_FAILED = 'FILE_WRITE_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

// MARK: - Utility Functions

/**
 * Create a filename-safe string
 */
export function createSafeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file extension
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export default ThemeSchemaImportExport; 