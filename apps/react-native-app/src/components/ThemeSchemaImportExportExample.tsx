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
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {
  ThemeSchemaImportExport,
  ExportFormat,
  FormatComparison
} from '../theme/ThemeSchemaImportExport';
import { ThemeSchema } from '../theme/ThemeSchema';
import { useThemeSchema } from '../theme/ThemeSchemaManager';



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
  description
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
          'text/plain'
        ],
        copyToCacheDirectory: true
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
          }
        }
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
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  buttonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '500'
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#ddd',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24
  },
  checkboxSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2'
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeButton: {
    color: '#1976d2',
    fontSize: 16
  },
  comparisonCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    marginRight: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 280
  },
  comparisonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  comparisonIntro: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  comparisonLabel: {
    color: '#666',
    fontSize: 14
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  comparisonUseCase: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  dismissText: {
    color: '#1976d2',
    fontSize: 14
  },
  errorCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderRadius: 12,
    borderWidth: 1,
    margin: 20,
    padding: 16
  },
  errorHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8
  },
  errorMessage: {
    color: '#856404',
    fontSize: 14
  },
  errorTitle: {
    color: '#856404',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold'
  },
  exportButton: {
    backgroundColor: '#1976d2',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  exportButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },
  exportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  formatDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20
  },
  formatName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  formatOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8
  },
  formatOptionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  formatOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
    borderWidth: 2
  },
  headerSection: {
    alignItems: 'center',
    padding: 20
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4
  },
  importCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  inputGroup: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalFooter: {
    backgroundColor: 'white',
    borderTopColor: '#e0e0e0',
    borderTopWidth: 1,
    padding: 20
  },
  modalHeader: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  picker: {
    height: 50
  },
  pickerContainer: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden'
  },
  primaryButton: {
    backgroundColor: '#1976d2'
  },
  schemaAuthor: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8
  },
  schemaCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  schemaDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12
  },
  schemaFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  schemaHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  schemaName: {
    fontSize: 18,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    borderWidth: 1
  },
  section: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    minWidth: 80,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  statTitle: {
    color: '#666',
    fontSize: 12
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  tag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    marginBottom: 4,
    marginRight: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  tagText: {
    color: '#1976d2',
    fontSize: 12
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top'
  },
  textInput: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    padding: 12
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  versionBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500'
  }
});

export default ThemeSchemaImportExportExample;
