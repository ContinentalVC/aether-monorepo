/**
 * Theme Schema Import/Export Example
 * 
 * Comprehensive example demonstrating import/export functionality
 * with multiple formats, file picker, sharing, and validation.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
  Share,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ThemeSchemaImportExport,
  ExportFormat,
  FormatComparison,
  ImportExportResult,
} from '../theme/ThemeSchemaImportExport';
import { ThemeSchema } from '../theme/ThemeSchema';
import { useThemeSchema } from '../theme/ThemeSchemaManager';

const { width } = Dimensions.get('window');

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

interface FormatOptionProps {
  format: ExportFormat;
  isSelected: boolean;
  onSelect: () => void;
  description: string;
}

const FormatOption: React.FC<FormatOptionProps> = ({
  format,
  isSelected,
  onSelect,
  description,
}) => (
  <TouchableOpacity
    style={[styles.formatOption, isSelected && styles.formatOptionSelected]}
    onPress={onSelect}
  >
    <View style={styles.formatOptionContent}>
      <View>
        <Text style={styles.formatName}>{format}</Text>
        <Text style={styles.formatDescription}>{description}</Text>
      </View>
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </View>
  </TouchableOpacity>
);

interface ComparisonCardProps {
  comparison: FormatComparison;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ comparison }) => (
  <View style={styles.comparisonCard}>
    <Text style={styles.comparisonTitle}>{comparison.format}</Text>
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>Readability:</Text>
      <Text style={styles.comparisonValue}>{comparison.humanReadability}</Text>
    </View>
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>File Size:</Text>
      <Text style={styles.comparisonValue}>{comparison.fileSize}</Text>
    </View>
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>Performance:</Text>
      <Text style={styles.comparisonValue}>{comparison.parsingPerformance}</Text>
    </View>
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>Schema:</Text>
      <Text style={styles.comparisonValue}>{comparison.schemaEnforcement}</Text>
    </View>
    <Text style={styles.comparisonUseCase}>{comparison.primaryUseCase}</Text>
  </View>
);

export const ThemeSchemaImportExportExample: React.FC = () => {
  const { schemas, currentSchema, importSchema, exportSchema } = useThemeSchema();
  const importExport = new ThemeSchemaImportExport();
  
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.JSON);
  const [exportFilename, setExportFilename] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [showingExportModal, setShowingExportModal] = useState(false);
  const [showingImportModal, setShowingImportModal] = useState(false);
  const [showingComparisonModal, setShowingComparisonModal] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [importProgress, setImportProgress] = useState(0);

  // MARK: - Export Functions

  const handleExportToFile = useCallback(async () => {
    if (!currentSchema) return;

    try {
      setExportProgress(0);
      const filename = exportFilename || currentSchema.metadata.name;
      const success = await importExport.exportSchemaToFile(
        currentSchema,
        selectedFormat,
        filename
      );

      if (success) {
        Alert.alert('Success', 'Schema exported successfully!');
        setExportFilename('');
        setExportProgress(100);
      } else {
        setLastError('Failed to export schema');
      }
    } catch (error) {
      setLastError(`Export failed: ${error}`);
    }
  }, [currentSchema, selectedFormat, exportFilename]);

  const handleExportToShare = useCallback(async () => {
    if (!currentSchema) return;

    try {
      setExportProgress(0);
      const success = await importExport.exportSchemaToShare(
        currentSchema,
        selectedFormat
      );

      if (success) {
        setExportProgress(100);
      } else {
        setLastError('Failed to share schema');
      }
    } catch (error) {
      setLastError(`Share failed: ${error}`);
    }
  }, [currentSchema, selectedFormat]);

  const handleExportToClipboard = useCallback(async () => {
    if (!currentSchema) return;

    try {
      const success = await importExport.exportSchemaToClipboard(
        currentSchema,
        selectedFormat
      );

      if (success) {
        Alert.alert('Success', 'Schema copied to clipboard!');
      } else {
        setLastError('Failed to copy to clipboard');
      }
    } catch (error) {
      setLastError(`Clipboard export failed: ${error}`);
    }
  }, [currentSchema, selectedFormat]);

  // MARK: - Import Functions

  const handleImportFromFile = useCallback(async () => {
    try {
      setImportProgress(0);
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/json',
          'application/x-yaml',
          'application/xml',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const fileContent = await FileSystem.readAsStringAsync(file.uri);
      const format = importExport.detectFormatFromFilename(file.name);
      const schema = await importExport.importSchemaFromData(fileContent, format);

      if (schema) {
        importSchema(JSON.stringify(schema));
        Alert.alert('Success', 'Schema imported successfully!');
        setImportProgress(100);
      } else {
        setLastError('Failed to import schema from file');
      }
    } catch (error) {
      setLastError(`Import failed: ${error}`);
    }
  }, []);

  const handleImportFromURL = useCallback(async () => {
    Alert.prompt(
      'Import from URL',
      'Enter the URL of the schema file:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async (url) => {
            if (!url) return;

            try {
              setImportProgress(0);
              const schema = await importExport.importSchemaFromURL(url);

              if (schema) {
                importSchema(JSON.stringify(schema));
                Alert.alert('Success', 'Schema imported successfully!');
                setImportProgress(100);
              } else {
                setLastError('Failed to import schema from URL');
              }
            } catch (error) {
              setLastError(`URL import failed: ${error}`);
            }
          },
        },
      ],
      'plain-text'
    );
  }, []);

  const handleImportFromJSON = useCallback(async () => {
    if (!importJsonText.trim()) return;

    try {
      setImportProgress(0);
      const schema = await importExport.importSchemaFromData(
        importJsonText,
        ExportFormat.JSON
      );

      if (schema) {
        importSchema(JSON.stringify(schema));
        Alert.alert('Success', 'Schema imported successfully!');
        setImportJsonText('');
        setImportProgress(100);
      } else {
        setLastError('Failed to import schema from JSON');
      }
    } catch (error) {
      setLastError(`JSON import failed: ${error}`);
    }
  }, [importJsonText]);

  const handleImportFromClipboard = useCallback(async () => {
    try {
      const schema = await importExport.importSchemaFromClipboard();

      if (schema) {
        importSchema(JSON.stringify(schema));
        Alert.alert('Success', 'Schema imported from clipboard!');
      } else {
        setLastError('No valid schema data in clipboard');
      }
    } catch (error) {
      setLastError(`Clipboard import failed: ${error}`);
    }
  }, []);

  // MARK: - Utility Functions

  const getFormatInfo = (format: ExportFormat) => {
    return importExport.getFormatInfo(format);
  };

  const getFormatComparison = () => {
    return importExport.getFormatComparison();
  };

  const createSafeFilename = (name: string) => {
    return name.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_').toLowerCase();
  };

  // MARK: - Render

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Theme Schema Import/Export</Text>
        <Text style={styles.subtitle}>
          Export your themes in multiple formats and import from various sources
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard title="Schemas" value={schemas.length.toString()} icon="📄" />
          <StatCard
            title="Formats"
            value={Object.keys(ExportFormat).length.toString()}
            icon="📤"
          />
          <StatCard
            title="Valid"
            value={schemas.filter((s) => s.metadata.name).length.toString()}
            icon="✅"
          />
        </View>
      </View>

      {/* Current Schema Section */}
      {currentSchema && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Schema</Text>
          <View style={styles.schemaCard}>
            <View style={styles.schemaHeader}>
              <Text style={styles.schemaName}>{currentSchema.metadata.name}</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>{currentSchema.metadata.version}</Text>
              </View>
            </View>
            <Text style={styles.schemaAuthor}>by {currentSchema.metadata.author}</Text>
            {currentSchema.metadata.description && (
              <Text style={styles.schemaDescription} numberOfLines={2}>
                {currentSchema.metadata.description}
              </Text>
            )}
            <View style={styles.schemaFooter}>
              <View style={styles.tagsContainer}>
                {currentSchema.metadata.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={styles.exportButton}
                onPress={() => setShowingExportModal(true)}
              >
                <Text style={styles.exportButtonText}>Export</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Export Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export</Text>
        <View style={styles.exportCard}>
          {/* Format Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Format</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedFormat}
                onValueChange={(value) => setSelectedFormat(value)}
                style={styles.picker}
              >
                {Object.values(ExportFormat).map((format) => (
                  <Picker.Item key={format} label={format} value={format} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Filename Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Filename</Text>
            <TextInput
              style={styles.textInput}
              value={exportFilename}
              onChangeText={setExportFilename}
              placeholder="Enter filename"
            />
            <Text style={styles.helperText}>
              Will be saved as: {exportFilename || currentSchema?.metadata.name || 'schema'}.
              {getFormatInfo(selectedFormat).extension}
            </Text>
          </View>

          {/* Export Actions */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleExportToFile}
              disabled={!currentSchema}
            >
              <Text style={styles.buttonText}>Export to File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleExportToShare}
              disabled={!currentSchema}
            >
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleExportToClipboard}
              disabled={!currentSchema}
            >
              <Text style={styles.buttonText}>Clipboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Import Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Import</Text>
        <View style={styles.importCard}>
          {/* Import Actions */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleImportFromFile}
            >
              <Text style={styles.buttonText}>Choose File</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleImportFromURL}
            >
              <Text style={styles.buttonText}>From URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleImportFromClipboard}
            >
              <Text style={styles.buttonText}>Clipboard</Text>
            </TouchableOpacity>
          </View>

          {/* JSON Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Or paste JSON directly:</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={importJsonText}
              onChangeText={setImportJsonText}
              placeholder="Paste JSON schema here..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleImportFromJSON}
              disabled={!importJsonText.trim()}
            >
              <Text style={styles.buttonText}>Import JSON</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Format Comparison Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Format Comparison</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.comparisonContainer}>
            {getFormatComparison().map((comparison, index) => (
              <ComparisonCard key={index} comparison={comparison} />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Error Display */}
      {lastError && (
        <View style={styles.errorCard}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Error</Text>
            <TouchableOpacity onPress={() => setLastError(null)}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.errorMessage}>{lastError}</Text>
        </View>
      )}

      {/* Export Modal */}
      <Modal
        visible={showingExportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Export Options</Text>
            <TouchableOpacity onPress={() => setShowingExportModal(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {Object.values(ExportFormat).map((format) => (
              <FormatOption
                key={format}
                format={format}
                isSelected={selectedFormat === format}
                onSelect={() => setSelectedFormat(format)}
                description={getFormatInfo(format).description}
              />
            ))}
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                handleExportToFile();
                setShowingExportModal(false);
              }}
            >
              <Text style={styles.buttonText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showingImportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import Schema</Text>
            <TouchableOpacity onPress={() => setShowingImportModal(false)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Paste JSON schema:</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={importJsonText}
              onChangeText={setImportJsonText}
              placeholder="Paste JSON schema here..."
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                handleImportFromJSON();
                setShowingImportModal(false);
              }}
              disabled={!importJsonText.trim()}
            >
              <Text style={styles.buttonText}>Import</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Comparison Modal */}
      <Modal
        visible={showingComparisonModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Format Guide</Text>
            <TouchableOpacity onPress={() => setShowingComparisonModal(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.comparisonIntro}>
              Choose the best format for your use case
            </Text>
            {getFormatComparison().map((comparison, index) => (
              <ComparisonCard key={index} comparison={comparison} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerSection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  schemaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  schemaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  schemaName: {
    fontSize: 18,
    fontWeight: '600',
  },
  versionBadge: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  schemaAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  schemaDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  schemaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  exportButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  exportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  importCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1976d2',
  },
  comparisonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  comparisonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 280,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#666',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  comparisonUseCase: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    flex: 1,
  },
  dismissText: {
    fontSize: 14,
    color: '#1976d2',
  },
  errorMessage: {
    fontSize: 14,
    color: '#856404',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#1976d2',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  formatOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  formatOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  formatOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  formatName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  formatDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  comparisonIntro: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ThemeSchemaImportExportExample; 