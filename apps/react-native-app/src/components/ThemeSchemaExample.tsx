/**
 * Theme Schema Example
 *
 * Comprehensive example demonstrating the Theme Schema system
 * with import/export, validation, and management features.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useThemeSchema } from '../theme/ThemeSchemaManager';
import {
  ThemeSchema,
  ThemeCategory,
  Platform,
  SchemaValidationError
} from '../theme/ThemeSchema';
import { formatDateEnhanced, DATE_FORMATS } from '@aether/react-native-utils';

const { width } = Dimensions.get('window');

export const ThemeSchemaExample: React.FC = () => {
  const {
    schemas,
    currentSchema,
    isLoading,
    lastError,
    createSchema,
    updateSchema,
    deleteSchema,
    setCurrentSchema,
    exportSchema,
    importSchemaFromJSON,
    validateSchema,
    isSchemaValid,
    searchSchemas,
    filterSchemasByCategory,
    filterSchemasByPlatform,
    getSchemaTemplates,
    createSchemaFromTemplate,
    clearError
  } = useThemeSchema();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>(ThemeCategory.GENERAL);
  const [selectedPlatform] = useState<Platform>(Platform.IOS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<ThemeSchema | null>(null);
  const [validationErrors, setValidationErrors] = useState<SchemaValidationError[]>([]);

  // Form states
  const [newSchemaName, setNewSchemaName] = useState('');
  const [newSchemaAuthor, setNewSchemaAuthor] = useState('');
  const [newSchemaDescription, setNewSchemaDescription] = useState('');
  const [importJsonText, setImportJsonText] = useState('');

  const filteredSchemas = React.useMemo(() => {
    let filtered = schemas;

    // Apply search filter
    if (searchText) {
      filtered = searchSchemas(searchText);
    }

    // Apply category filter
    if (selectedCategory !== ThemeCategory.GENERAL) {
      filtered = filtered.filter(schema => schema.metadata.category === selectedCategory);
    }

    // Apply platform filter
    if (selectedPlatform !== Platform.IOS) {
      filtered = filtered.filter(schema => schema.metadata.platform.includes(selectedPlatform));
    }

    return filtered;
  }, [schemas, searchText, selectedCategory, selectedPlatform]);

  const handleCreateSchema = () => {
    if (!newSchemaName.trim() || !newSchemaAuthor.trim()) {
      Alert.alert('Error', 'Name and author are required');
      return;
    }

    createSchema(
      newSchemaName.trim(),
      newSchemaAuthor.trim(),
      newSchemaDescription.trim() || undefined
    );

    setNewSchemaName('');
    setNewSchemaAuthor('');
    setNewSchemaDescription('');
    setShowCreateModal(false);
  };

  const handleImportSchema = () => {
    if (!importJsonText.trim()) {
      Alert.alert('Error', 'Please enter JSON data');
      return;
    }

    const schema = importSchemaFromJSON(importJsonText);
    if (schema) {
      setImportJsonText('');
      setShowImportModal(false);
      Alert.alert('Success', 'Schema imported successfully');
    }
  };

  const handleExportSchema = (schema: ThemeSchema) => {
    const exported = exportSchema(schema);
    if (exported) {
      // In a real app, you might want to share this or save to file
      Alert.alert('Exported Schema', exported);
    }
  };

  const handleValidateSchema = (schema: ThemeSchema) => {
    const errors = validateSchema(schema);
    if (errors.length > 0) {
      setValidationErrors(errors);
      Alert.alert(
        'Validation Errors',
        errors.map(error => error.message).join('\n')
      );
    } else {
      Alert.alert('Success', 'Schema is valid');
    }
  };

  const handleDeleteSchema = (schema: ThemeSchema) => {
    Alert.alert(
      'Delete Schema',
      `Are you sure you want to delete "${schema.metadata.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSchema(schema)
        }
      ]
    );
  };

  const renderSchemaCard = ({ item }: { item: ThemeSchema }) => (
    <View style={styles.schemaCard}>
      <View style={styles.schemaHeader}>
        <View style={styles.schemaInfo}>
          <Text style={styles.schemaName}>
            {item.metadata.name}
            {currentSchema?.id === item.id && (
              <Text style={styles.currentBadge}> CURRENT</Text>
            )}
          </Text>
          <Text style={styles.schemaAuthor}>by {item.metadata.author}</Text>
          {item.metadata.description && (
            <Text style={styles.schemaDescription} numberOfLines={2}>
              {item.metadata.description}
            </Text>
          )}
        </View>
        <View style={styles.schemaMeta}>
          <Text style={styles.schemaVersion}>{item.metadata.version}</Text>
          <Text style={styles.schemaCategory}>{item.metadata.category}</Text>
        </View>
      </View>

      <View style={styles.schemaTags}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.metadata.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.schemaActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setCurrentSchema(item)}
        >
          <Text style={styles.actionButtonText}>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedSchema(item);
            setShowDetailModal(true);
          }}
        >
          <Text style={styles.actionButtonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleValidateSchema(item)}
        >
          <Text style={styles.actionButtonText}>Validate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteSchema(item)}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTemplateCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => {
        const schema = createSchemaFromTemplate(
          item,
          newSchemaName || item.name,
          newSchemaAuthor || 'Unknown'
        );
        setShowTemplateModal(false);
        setNewSchemaName('');
        setNewSchemaAuthor('');
      }}
    >
      <Text style={styles.templateName}>{item.name}</Text>
      <Text style={styles.templateDescription}>{item.description}</Text>
      <Text style={styles.templateCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Theme Schema Manager</Text>

        {currentSchema && (
          <View style={styles.currentSchema}>
            <Text style={styles.currentSchemaTitle}>Current: {currentSchema.metadata.name}</Text>
            <Text style={styles.currentSchemaAuthor}>by {currentSchema.metadata.author}</Text>
          </View>
        )}

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{schemas.length}</Text>
            <Text style={styles.statLabel}>Total Schemas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {schemas.filter(schema => isSchemaValid(schema)).length}
            </Text>
            <Text style={styles.statLabel}>Valid Schemas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {new Set(schemas.map(schema => schema.metadata.category)).size}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search schemas..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.filters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === ThemeCategory.GENERAL && styles.filterChipActive
              ]}
              onPress={() => setSelectedCategory(ThemeCategory.GENERAL)}
            >
              <Text style={styles.filterChipText}>All Categories</Text>
            </TouchableOpacity>
            {Object.values(ThemeCategory).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.filterChipText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Text style={styles.primaryButtonText}>Create New</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowTemplateModal(true)}
        >
          <Text style={styles.secondaryButtonText}>Templates</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowImportModal(true)}
        >
          <Text style={styles.secondaryButtonText}>Import</Text>
        </TouchableOpacity>
        {currentSchema && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleExportSchema(currentSchema)}
          >
            <Text style={styles.secondaryButtonText}>Export</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Schema List */}
      <FlatList
        data={filteredSchemas}
        renderItem={renderSchemaCard}
        keyExtractor={(item) => item.id}
        style={styles.schemaList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No schemas found</Text>
            <Text style={styles.emptyStateSubtext}>
              Create a new schema or import one to get started
            </Text>
          </View>
        }
      />

      {/* Error Display */}
      {lastError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{lastError}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Create Schema Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Schema</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Schema Name"
              value={newSchemaName}
              onChangeText={setNewSchemaName}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={newSchemaAuthor}
              onChangeText={setNewSchemaAuthor}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newSchemaDescription}
              onChangeText={setNewSchemaDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButton]}
              onPress={handleCreateSchema}
            >
              <Text style={styles.primaryButtonText}>Create Schema</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Template Selection Modal */}
      <Modal
        visible={showTemplateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Template</Text>
            <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Schema Name (optional)"
              value={newSchemaName}
              onChangeText={setNewSchemaName}
            />
            <TextInput
              style={styles.input}
              placeholder="Author (optional)"
              value={newSchemaAuthor}
              onChangeText={setNewSchemaAuthor}
            />

            <FlatList
              data={getSchemaTemplates()}
              renderItem={renderTemplateCard}
              keyExtractor={(item) => item.name}
              numColumns={2}
              columnWrapperStyle={styles.templateGrid}
            />
          </View>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import Schema</Text>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Paste JSON schema here..."
              value={importJsonText}
              onChangeText={setImportJsonText}
              multiline
              numberOfLines={10}
            />

            <TouchableOpacity
              style={[styles.primaryButton, styles.modalButton]}
              onPress={handleImportSchema}
            >
              <Text style={styles.primaryButtonText}>Import Schema</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schema Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedSchema && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schema Details</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Text style={styles.modalClose}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <SchemaDetailView schema={selectedSchema} />
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

// MARK: - Schema Detail View

const SchemaDetailView: React.FC<{ schema: ThemeSchema }> = ({ schema }) => {
  const { validateSchema } = useThemeSchema();
  const [validationErrors, setValidationErrors] = useState<SchemaValidationError[]>([]);

  const handleValidate = () => {
    const errors = validateSchema(schema);
    setValidationErrors(errors);
  };

  return (
    <View style={styles.detailContainer}>
      {/* Metadata */}
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Metadata</Text>
        <DetailRow title="Name" value={schema.metadata.name} />
        <DetailRow title="Author" value={schema.metadata.author} />
        <DetailRow title="Version" value={schema.metadata.version} />
        <DetailRow title="Category" value={schema.metadata.category} />
        <DetailRow title="Created" value={formatDateEnhanced(new Date(schema.metadata.createdAt), { format: DATE_FORMATS.US_SHORT })} />
        <DetailRow title="Updated" value={formatDateEnhanced(new Date(schema.metadata.updatedAt), { format: DATE_FORMATS.US_SHORT })} />
        {schema.metadata.description && (
          <DetailRow title="Description" value={schema.metadata.description} />
        )}
      </View>

      {/* Colors */}
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Colors</Text>
        <View style={styles.colorGrid}>
          <ColorCard title="Primary" color={schema.properties.colors.primary} />
          <ColorCard title="Secondary" color={schema.properties.colors.secondary} />
          <ColorCard title="Tertiary" color={schema.properties.colors.tertiary} />
          <ColorCard title="Success" color={schema.properties.colors.semantic.success} />
          <ColorCard title="Warning" color={schema.properties.colors.semantic.warning} />
          <ColorCard title="Error" color={schema.properties.colors.semantic.error} />
        </View>
      </View>

      {/* Typography */}
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Typography</Text>
        <DetailRow title="Primary Font" value={schema.properties.typography.primaryFontName} />
        <DetailRow title="Body Font" value={schema.properties.typography.bodyFontName} />
        <DetailRow title="Base Size" value={schema.properties.typography.baseFontSize.toString()} />
        <DetailRow title="Scale Factor" value={schema.properties.typography.headingScaleFactor.toString()} />
      </View>

      {/* Layout */}
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Layout</Text>
        <DetailRow title="Grid Columns" value={schema.properties.layoutMetrics.grid.columns.toString()} />
        <DetailRow title="Grid Gutter" value={schema.properties.layoutMetrics.grid.gutter.toString()} />
        <DetailRow title="Base Spacing" value={schema.properties.layoutMetrics.spacing.md.toString()} />
      </View>

      {/* Validation */}
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>Validation</Text>
        <TouchableOpacity style={styles.validateButton} onPress={handleValidate}>
          <Text style={styles.validateButtonText}>Validate Schema</Text>
        </TouchableOpacity>

        {validationErrors.length > 0 ? (
          <View style={styles.validationErrors}>
            {validationErrors.map((error, index) => (
              <Text key={index} style={styles.validationError}>
                • {error.message}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.validationSuccess}>✓ Schema is valid</Text>
        )}
      </View>
    </View>
  );
};

// MARK: - Detail Row

const DetailRow: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailRowTitle}>{title}</Text>
    <Text style={styles.detailRowValue}>{value}</Text>
  </View>
);

// MARK: - Color Card

const ColorCard: React.FC<{ title: string; color: any }> = ({ title, color }) => (
  <View style={styles.colorCard}>
    <View style={styles.colorSwatches}>
      <View style={[styles.colorSwatch, { backgroundColor: color.light }]} />
      <View style={[styles.colorSwatch, { backgroundColor: color.dark }]} />
    </View>
    <Text style={styles.colorCardTitle}>{title}</Text>
    <Text style={styles.colorCardValue}>{color.light}</Text>
  </View>
);

// MARK: - Styles

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  actionButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600'
  },
  actionButtons: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 16
  },
  colorCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    width: (width - 80) / 3
  },
  colorCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  colorCardValue: {
    color: '#666',
    fontSize: 10
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  colorSwatch: {
    borderColor: '#ddd',
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    marginHorizontal: 2,
    width: 20
  },
  colorSwatches: {
    flexDirection: 'row',
    marginBottom: 8
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  currentSchema: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12
  },
  currentSchemaAuthor: {
    color: '#666',
    fontSize: 14
  },
  currentSchemaTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  deleteButton: {
    backgroundColor: '#ffebee'
  },
  deleteButtonText: {
    color: '#d32f2f'
  },
  detailContainer: {
    padding: 20
  },
  detailRow: {
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  detailRowTitle: {
    color: '#666',
    fontSize: 14
  },
  detailRowValue: {
    fontSize: 14,
    fontWeight: '600'
  },
  detailSection: {
    marginBottom: 24
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  emptyState: {
    alignItems: 'center',
    padding: 40
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center'
  },
  emptyStateText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    padding: 12
  },
  errorDismiss: {
    color: '#d32f2f',
    fontSize: 20,
    fontWeight: 'bold'
  },
  errorText: {
    color: '#d32f2f',
    flex: 1
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  filterChipActive: {
    backgroundColor: '#007AFF'
  },
  filterChipText: {
    color: '#333',
    fontSize: 12
  },
  filters: {
    flexDirection: 'row'
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    padding: 20
  },
  input: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    marginBottom: 16,
    paddingHorizontal: 12
  },
  modalButton: {
    marginTop: 16
  },
  modalClose: {
    color: '#666',
    fontSize: 24
  },
  modalContainer: {
    backgroundColor: '#fff',
    flex: 1
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalHeader: {
    alignItems: 'center',
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
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  schemaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  schemaAuthor: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4
  },
  schemaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  schemaCategory: {
    color: '#666',
    fontSize: 10
  },
  schemaDescription: {
    color: '#999',
    fontSize: 12
  },
  schemaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  schemaInfo: {
    flex: 1
  },
  schemaList: {
    flex: 1,
    padding: 16
  },
  schemaMeta: {
    alignItems: 'flex-end'
  },
  schemaName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4
  },
  schemaTags: {
    marginBottom: 12
  },
  schemaVersion: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  searchInput: {
    borderColor: '#ddd',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 12
  },
  searchSection: {
    backgroundColor: '#fff',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    padding: 16
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '600'
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    padding: 12
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center'
  },
  statValue: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tagText: {
    color: '#666',
    fontSize: 10
  },
  templateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    width: (width - 60) / 2
  },
  templateCategory: {
    color: '#999',
    fontSize: 10
  },
  templateDescription: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8
  },
  templateGrid: {
    justifyContent: 'space-between'
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16
  },
  validateButton: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  validateButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  validationError: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 4
  },
  validationErrors: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12
  },
  validationSuccess: {
    color: '#388e3c',
    fontSize: 14,
    fontWeight: '600'
  }
});

export default ThemeSchemaExample;
