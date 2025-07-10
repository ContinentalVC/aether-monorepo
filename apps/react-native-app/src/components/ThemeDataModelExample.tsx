/**
 * Theme Data Model Example
 * 
 * Example component demonstrating the Theme Data Model system with
 * import/export, validation, and management features.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useThemeDataModel } from '../theme/ThemeDataModelManager';
import { ThemeDataModel, ThemeCategory } from '../theme/ThemeDataModel';
import styled from 'styled-components/native';

// MARK: - Main Example Component

const ThemeDataModelExample: React.FC = () => {
  const {
    themes,
    currentTheme,
    isLoading,
    lastError,
    createTheme,
    updateTheme,
    deleteTheme,
    setCurrentTheme,
    exportTheme,
    importThemeFromJSON,
    validateTheme,
    isThemeValid,
    searchThemes,
    filterThemesByCategory,
    getThemeTemplates,
    createThemeFromTemplate,
    clearError,
  } = useThemeDataModel();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeDataModel | null>(null);
  const [importText, setImportText] = useState('');
  const [exportText, setExportText] = useState('');
  const [themeName, setThemeName] = useState('');

  const filteredThemes = useMemo(() => {
    let filtered = themes;

    if (searchText) {
      filtered = searchThemes(searchText);
    }

    if (selectedCategory !== 'all') {
      filtered = filterThemesByCategory(selectedCategory);
    }

    return filtered;
  }, [themes, searchText, selectedCategory, searchThemes, filterThemesByCategory]);

  const handleImportTheme = () => {
    if (!importText.trim()) {
      Alert.alert('Error', 'Please enter theme JSON data');
      return;
    }

    const theme = importThemeFromJSON(importText);
    if (theme) {
      setShowImportModal(false);
      setImportText('');
      Alert.alert('Success', 'Theme imported successfully!');
    }
  };

  const handleExportTheme = (theme: ThemeDataModel) => {
    const exported = exportTheme(theme);
    if (exported) {
      setExportText(exported);
      setSelectedTheme(theme);
      setShowExportModal(true);
    }
  };

  const handleCreateFromTemplate = (template: any) => {
    if (!themeName.trim()) {
      Alert.alert('Error', 'Please enter a theme name');
      return;
    }

    createThemeFromTemplate(template, themeName);
    setShowTemplateModal(false);
    setThemeName('');
    Alert.alert('Success', 'Theme created from template!');
  };

  const handleDeleteTheme = (theme: ThemeDataModel) => {
    Alert.alert(
      'Delete Theme',
      `Are you sure you want to delete "${theme.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTheme(theme),
        },
      ]
    );
  };

  if (lastError) {
    Alert.alert('Error', lastError, [
      { text: 'OK', onPress: clearError },
    ]);
  }

  return (
    <Container>
      <HeaderSection>
        <Title>Theme Data Model System</Title>
        <Subtitle>
          Manage, import, export, and validate themes using JSON format for maximum portability and consistency.
        </Subtitle>
        <FeaturesOverview />
      </HeaderSection>

      <SearchFilterSection>
        <SearchBar
          placeholder="Search themes..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </SearchFilterSection>

      <ThemesList
        data={filteredThemes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemeRow
            theme={item}
            isCurrent={currentTheme?.id === item.id}
            onExport={() => handleExportTheme(item)}
            onSetCurrent={() => setCurrentTheme(item)}
            onDelete={() => handleDeleteTheme(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState>
            <Text>No themes found</Text>
          </EmptyState>
        }
      />

      <FloatingActionButton
        onPress={() => setShowTemplateModal(true)}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </FloatingActionButton>

      {/* Import Modal */}
      <ImportModal
        visible={showImportModal}
        importText={importText}
        onImportTextChange={setImportText}
        onImport={handleImportTheme}
        onClose={() => setShowImportModal(false)}
      />

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        exportText={exportText}
        theme={selectedTheme}
        onClose={() => setShowExportModal(false)}
      />

      {/* Template Modal */}
      <TemplateModal
        visible={showTemplateModal}
        templates={getThemeTemplates()}
        themeName={themeName}
        onThemeNameChange={setThemeName}
        onCreateTheme={handleCreateFromTemplate}
        onClose={() => setShowTemplateModal(false)}
      />
    </Container>
  );
};

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const HeaderSection = styled.View`
  padding: 20px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  line-height: 22px;
  margin-bottom: 16px;
`;

const SearchFilterSection = styled.View`
  padding: 16px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const SearchBar = styled.TextInput`
  height: 44px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
  padding-horizontal: 12px;
  margin-bottom: 12px;
  background-color: white;
`;

const CategoryFilter = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
`;

const ThemesList = styled.FlatList`
  flex: 1;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const FloatingActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #007AFF;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

// MARK: - Features Overview

const FeaturesOverview: React.FC = () => {
  const features = [
    { icon: '📄', title: 'JSON Format', description: 'Lightweight, human-readable format' },
    { icon: '🔄', title: 'Import/Export', description: 'Easy theme sharing and backup' },
    { icon: '✅', title: 'Validation', description: 'Automatic theme validation' },
    { icon: '📱', title: 'Cross-Platform', description: 'Works across all platforms' },
    { icon: '🎨', title: 'Templates', description: 'Pre-built theme templates' },
    { icon: '🔍', title: 'Search & Filter', description: 'Find themes quickly' },
  ];

  return (
    <FeaturesGrid>
      {features.map((feature, index) => (
        <FeatureCard key={index}>
          <FeatureIcon>{feature.icon}</FeatureIcon>
          <FeatureTitle>{feature.title}</FeatureTitle>
          <FeatureDescription>{feature.description}</FeatureDescription>
        </FeatureCard>
      ))}
    </FeaturesGrid>
  );
};

const FeaturesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FeatureCard = styled.View`
  width: 48%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const FeatureIcon = styled.Text`
  font-size: 20px;
  margin-bottom: 4px;
`;

const FeatureTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const FeatureDescription = styled.Text`
  font-size: 12px;
  color: #666;
  line-height: 16px;
`;

// MARK: - Category Filter

interface CategoryFilterProps {
  selectedCategory: ThemeCategory | 'all';
  onSelectCategory: (category: ThemeCategory | 'all') => void;
}

const CategoryFilterComponent: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { key: 'all', label: 'All' },
    { key: ThemeCategory.GENERAL, label: 'General' },
    { key: ThemeCategory.BUSINESS, label: 'Business' },
    { key: ThemeCategory.CREATIVE, label: 'Creative' },
    { key: ThemeCategory.GAMING, label: 'Gaming' },
    { key: ThemeCategory.HEALTH, label: 'Health' },
    { key: ThemeCategory.FINANCE, label: 'Finance' },
  ];

  return (
    <CategoryFilter>
      {categories.map((category) => (
        <CategoryButton
          key={category.key}
          isSelected={selectedCategory === category.key}
          onPress={() => onSelectCategory(category.key as ThemeCategory | 'all')}
        >
          <CategoryButtonText isSelected={selectedCategory === category.key}>
            {category.label}
          </CategoryButtonText>
        </CategoryButton>
      ))}
    </CategoryFilter>
  );
};

const CategoryButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 20px;
  background-color: ${props => props.isSelected ? '#007AFF' : 'white'};
  border-width: 1px;
  border-color: ${props => props.isSelected ? '#007AFF' : '#e0e0e0'};
  margin-right: 8px;
`;

const CategoryButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  color: ${props => props.isSelected ? 'white' : '#333'};
`;

// MARK: - Theme Row

interface ThemeRowProps {
  theme: ThemeDataModel;
  isCurrent: boolean;
  onExport: () => void;
  onSetCurrent: () => void;
  onDelete: () => void;
}

const ThemeRow: React.FC<ThemeRowProps> = ({
  theme,
  isCurrent,
  onExport,
  onSetCurrent,
  onDelete,
}) => {
  return (
    <ThemeRowContainer>
      <ThemeRowContent>
        <ThemeRowHeader>
          <ThemeName>{theme.name}</ThemeName>
          {isCurrent && <CurrentBadge>Current</CurrentBadge>}
        </ThemeRowHeader>
        
        {theme.description && (
          <ThemeDescription>{theme.description}</ThemeDescription>
        )}
        
        <ThemeMeta>
          <ThemeMetaText>v{theme.version}</ThemeMetaText>
          <ThemeMetaText>•</ThemeMetaText>
          <ThemeMetaText>{theme.metadata.category}</ThemeMetaText>
          {theme.author && (
            <>
              <ThemeMetaText>•</ThemeMetaText>
              <ThemeMetaText>by {theme.author}</ThemeMetaText>
            </>
          )}
        </ThemeMeta>
        
        {theme.metadata.tags.length > 0 && (
          <TagsContainer>
            {theme.metadata.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsContainer>
        )}
      </ThemeRowContent>
      
      <ThemeRowActions>
        <ActionButton onPress={onExport}>
          <ActionButtonText>Export</ActionButtonText>
        </ActionButton>
        
        {!isCurrent && (
          <ActionButton onPress={onSetCurrent}>
            <ActionButtonText>Set Current</ActionButtonText>
          </ActionButton>
        )}
        
        <ActionButton onPress={onDelete}>
          <ActionButtonText style={{ color: '#FF3B30' }}>Delete</ActionButtonText>
        </ActionButton>
      </ThemeRowActions>
    </ThemeRowContainer>
  );
};

const ThemeRowContainer = styled.View`
  background-color: white;
  margin-horizontal: 16px;
  margin-vertical: 4px;
  border-radius: 8px;
  padding: 16px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const ThemeRowContent = styled.View`
  flex: 1;
`;

const ThemeRowHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const ThemeName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const CurrentBadge = styled.Text`
  font-size: 12px;
  color: white;
  background-color: #007AFF;
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: 4px;
`;

const ThemeDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 18px;
`;

const ThemeMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const ThemeMetaText = styled.Text`
  font-size: 12px;
  color: #999;
  margin-right: 4px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Tag = styled.Text`
  font-size: 12px;
  color: #007AFF;
  background-color: rgba(0, 122, 255, 0.1);
  padding-horizontal: 8px;
  padding-vertical: 2px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 4px;
`;

const ThemeRowActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 12px;
`;

const ActionButton = styled.TouchableOpacity`
  margin-left: 12px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  color: #007AFF;
`;

// MARK: - Import Modal

interface ImportModalProps {
  visible: boolean;
  importText: string;
  onImportTextChange: (text: string) => void;
  onImport: () => void;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({
  visible,
  importText,
  onImportTextChange,
  onImport,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Import Theme</ModalTitle>
          <CloseButton onPress={onClose}>
            <CloseButtonText>Cancel</CloseButtonText>
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <ModalSubtitle>Paste JSON theme data to import</ModalSubtitle>
          
          <ImportTextInput
            placeholder="Paste theme JSON here..."
            value={importText}
            onChangeText={onImportTextChange}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          
          <ModalActions>
            <ModalButton onPress={onImport} disabled={!importText.trim()}>
              <ModalButtonText>Import Theme</ModalButtonText>
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// MARK: - Export Modal

interface ExportModalProps {
  visible: boolean;
  exportText: string;
  theme: ThemeDataModel | null;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  exportText,
  theme,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Export Theme</ModalTitle>
          <CloseButton onPress={onClose}>
            <CloseButtonText>Done</CloseButtonText>
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {theme && (
            <ExportThemeInfo>
              <ExportThemeName>Theme: {theme.name}</ExportThemeName>
              <ExportThemeVersion>Version: {theme.version}</ExportThemeVersion>
            </ExportThemeInfo>
          )}
          
          <ExportTextContainer>
            <ExportText>{exportText}</ExportText>
          </ExportTextContainer>
          
          <ModalActions>
            <ModalButton onPress={() => {}}>
              <ModalButtonText>Copy to Clipboard</ModalButtonText>
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// MARK: - Template Modal

interface TemplateModalProps {
  visible: boolean;
  templates: any[];
  themeName: string;
  onThemeNameChange: (name: string) => void;
  onCreateTheme: (template: any) => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  visible,
  templates,
  themeName,
  onThemeNameChange,
  onCreateTheme,
  onClose,
}) => {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Create from Template</ModalTitle>
          <CloseButton onPress={onClose}>
            <CloseButtonText>Cancel</CloseButtonText>
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <ModalSubtitle>Choose a template to create a new theme</ModalSubtitle>
          
          <TemplatesGrid>
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                onPress={() => onCreateTheme(template)}
              >
                <TemplateName>{template.name}</TemplateName>
                <TemplateDescription>{template.description}</TemplateDescription>
                <TemplateCategory>{template.category}</TemplateCategory>
              </TemplateCard>
            ))}
          </TemplatesGrid>
          
          <ThemeNameInput
            placeholder="Enter theme name"
            value={themeName}
            onChangeText={onThemeNameChange}
          />
          
          <ModalActions>
            <ModalButton onPress={onClose} disabled={!themeName.trim()}>
              <ModalButtonText>Create Theme</ModalButtonText>
            </ModalButton>
          </ModalActions>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

// MARK: - Modal Styled Components

const ModalContainer = styled.View`
  flex: 1;
  background-color: white;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.TouchableOpacity``;

const CloseButtonText = styled.Text`
  font-size: 16px;
  color: #007AFF;
`;

const ModalContent = styled.View`
  flex: 1;
  padding: 16px;
`;

const ModalSubtitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const ImportTextInput = styled.TextInput`
  height: 200px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
  padding: 12px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  font-family: monospace;
`;

const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const ModalButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#ccc' : '#007AFF'};
  padding-horizontal: 20px;
  padding-vertical: 12px;
  border-radius: 8px;
`;

const ModalButtonText = styled.Text`
  font-size: 16px;
  color: white;
  font-weight: 600;
`;

const ExportThemeInfo = styled.View`
  margin-bottom: 16px;
`;

const ExportThemeName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ExportThemeVersion = styled.Text`
  font-size: 14px;
  color: #666;
`;

const ExportTextContainer = styled.ScrollView`
  height: 300px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
  padding: 12px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
`;

const ExportText = styled.Text`
  font-family: monospace;
  font-size: 12px;
  color: #333;
`;

const TemplatesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TemplateCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const TemplateName = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const TemplateDescription = styled.Text`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  line-height: 16px;
`;

const TemplateCategory = styled.Text`
  font-size: 12px;
  color: #999;
`;

const ThemeNameInput = styled.TextInput`
  height: 44px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
  padding-horizontal: 12px;
  margin-bottom: 20px;
  background-color: white;
`;

// MARK: - Styles

const styles = StyleSheet.create({
  fab: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ThemeDataModelExample; 