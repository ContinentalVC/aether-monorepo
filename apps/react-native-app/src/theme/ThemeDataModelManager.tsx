/**
 * Theme Data Model Manager
 * 
 * Manager for handling theme data models with JSON serialization and validation
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ThemeDataModel,
  ThemeValidationError,
  ThemeValidator,
  ThemeSerialization,
  ThemeSerializationError,
  createDefaultThemeDataModel,
  ThemeCategory,
  ThemePlatform,
} from './ThemeDataModel';

// MARK: - Theme Template Interface

interface ThemeTemplate {
  name: string;
  description: string;
  category: ThemeCategory;
  template: ThemeDataModel;
}

// MARK: - Theme Data Model Manager Context

interface ThemeDataModelContextType {
  // Theme management
  themes: ThemeDataModel[];
  currentTheme: ThemeDataModel | null;
  isLoading: boolean;
  lastError: string | null;
  
  // Theme operations
  createTheme: (name: string, description?: string, author?: string) => ThemeDataModel;
  updateTheme: (theme: ThemeDataModel) => void;
  deleteTheme: (theme: ThemeDataModel) => void;
  setCurrentTheme: (theme: ThemeDataModel) => void;
  
  // Import/Export
  exportTheme: (theme: ThemeDataModel) => string | null;
  exportThemeToFile: (theme: ThemeDataModel, filename: string) => Promise<boolean>;
  importThemeFromJSON: (jsonString: string) => ThemeDataModel | null;
  importThemeFromURL: (url: string) => Promise<ThemeDataModel | null>;
  
  // Validation
  validateTheme: (theme: ThemeDataModel) => ThemeValidationError[];
  isThemeValid: (theme: ThemeDataModel) => boolean;
  
  // Search and filter
  searchThemes: (query: string) => ThemeDataModel[];
  filterThemesByCategory: (category: ThemeCategory) => ThemeDataModel[];
  filterThemesByPlatform: (platform: ThemePlatform) => ThemeDataModel[];
  
  // Templates
  getThemeTemplates: () => ThemeTemplate[];
  createThemeFromTemplate: (template: ThemeTemplate, name: string) => ThemeDataModel;
  
  // Utilities
  clearError: () => void;
}

interface ThemeDataModelProviderProps {
  children: ReactNode;
}

// MARK: - Theme Data Model Provider

export const ThemeDataModelProvider: React.FC<ThemeDataModelProviderProps> = ({
  children,
}) => {
  const [themes, setThemes] = useState<ThemeDataModel[]>([]);
  const [currentTheme, setCurrentThemeState] = useState<ThemeDataModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load themes on mount
  useEffect(() => {
    loadThemes();
  }, []);

  // Load themes from storage
  const loadThemes = async () => {
    try {
      setIsLoading(true);
      const storedThemes = await AsyncStorage.getItem('themes');
      
      if (storedThemes) {
        const parsedThemes = JSON.parse(storedThemes) as ThemeDataModel[];
        setThemes(parsedThemes);
        
        // Load current theme
        const currentThemeId = await AsyncStorage.getItem('currentThemeId');
        if (currentThemeId) {
          const current = parsedThemes.find(theme => theme.id === currentThemeId);
          setCurrentThemeState(current || parsedThemes[0] || null);
        } else {
          setCurrentThemeState(parsedThemes[0] || null);
        }
      } else {
        // Create default themes if none exist
        createDefaultThemes();
      }
    } catch (error) {
      setLastError(`Failed to load themes: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save themes to storage
  const saveThemes = async (newThemes: ThemeDataModel[]) => {
    try {
      await AsyncStorage.setItem('themes', JSON.stringify(newThemes));
    } catch (error) {
      setLastError(`Failed to save themes: ${error}`);
    }
  };

  // Create default themes
  const createDefaultThemes = () => {
    const templates = getThemeTemplates();
    const defaultThemes = templates.map(template => 
      createThemeFromTemplate(template, template.name)
    );
    setThemes(defaultThemes);
    setCurrentThemeState(defaultThemes[0] || null);
    saveThemes(defaultThemes);
  };

  // Theme management operations
  const createTheme = (name: string, description?: string, author?: string): ThemeDataModel => {
    const theme = createDefaultThemeDataModel(name);
    theme.description = description;
    theme.author = author;
    
    const newThemes = [...themes, theme];
    setThemes(newThemes);
    saveThemes(newThemes);
    
    if (!currentTheme) {
      setCurrentThemeState(theme);
      AsyncStorage.setItem('currentThemeId', theme.id);
    }
    
    return theme;
  };

  const updateTheme = (theme: ThemeDataModel) => {
    const updatedTheme = {
      ...theme,
      updatedAt: new Date().toISOString(),
    };
    
    const newThemes = themes.map(t => t.id === theme.id ? updatedTheme : t);
    setThemes(newThemes);
    saveThemes(newThemes);
    
    if (currentTheme?.id === theme.id) {
      setCurrentThemeState(updatedTheme);
    }
  };

  const deleteTheme = (theme: ThemeDataModel) => {
    const newThemes = themes.filter(t => t.id !== theme.id);
    setThemes(newThemes);
    saveThemes(newThemes);
    
    if (currentTheme?.id === theme.id) {
      const newCurrent = newThemes[0] || null;
      setCurrentThemeState(newCurrent);
      AsyncStorage.setItem('currentThemeId', newCurrent?.id || '');
    }
  };

  const setCurrentTheme = (theme: ThemeDataModel) => {
    setCurrentThemeState(theme);
    AsyncStorage.setItem('currentThemeId', theme.id);
  };

  // Import/Export operations
  const exportTheme = (theme: ThemeDataModel): string | null => {
    try {
      return ThemeSerialization.encode(theme);
    } catch (error) {
      setLastError(`Failed to export theme: ${error}`);
      return null;
    }
  };

  const exportThemeToFile = async (theme: ThemeDataModel, filename: string): Promise<boolean> => {
    try {
      const jsonString = exportTheme(theme);
      if (!jsonString) return false;
      
      // In React Native, we can't directly write to file system
      // Instead, we can share the JSON string or save to AsyncStorage
      await AsyncStorage.setItem(`theme_${filename}`, jsonString);
      return true;
    } catch (error) {
      setLastError(`Failed to save theme file: ${error}`);
      return false;
    }
  };

  const importThemeFromJSON = (jsonString: string): ThemeDataModel | null => {
    try {
      const theme = ThemeSerialization.decode(jsonString);
      
      // Validate the theme
      const validationErrors = ThemeValidator.validate(theme);
      if (validationErrors.length > 0) {
        setLastError(`Theme validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
        return null;
      }
      
      // Check if theme with same ID already exists
      if (themes.some(t => t.id === theme.id)) {
        setLastError(`Theme with ID ${theme.id} already exists`);
        return null;
      }
      
      const newThemes = [...themes, theme];
      setThemes(newThemes);
      saveThemes(newThemes);
      
      return theme;
    } catch (error) {
      setLastError(`Failed to import theme: ${error}`);
      return null;
    }
  };

  const importThemeFromURL = async (url: string): Promise<ThemeDataModel | null> => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const jsonString = await response.text();
      return importThemeFromJSON(jsonString);
    } catch (error) {
      setLastError(`Failed to import theme from URL: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Validation operations
  const validateTheme = (theme: ThemeDataModel): ThemeValidationError[] => {
    return ThemeValidator.validate(theme);
  };

  const isThemeValid = (theme: ThemeDataModel): boolean => {
    return ThemeValidator.isValid(theme);
  };

  // Search and filter operations
  const searchThemes = (query: string): ThemeDataModel[] => {
    const lowercasedQuery = query.toLowerCase();
    return themes.filter(theme => 
      theme.name.toLowerCase().includes(lowercasedQuery) ||
      (theme.description?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      theme.metadata.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  };

  const filterThemesByCategory = (category: ThemeCategory): ThemeDataModel[] => {
    return themes.filter(theme => theme.metadata.category === category);
  };

  const filterThemesByPlatform = (platform: ThemePlatform): ThemeDataModel[] => {
    return themes.filter(theme => theme.metadata.platform.includes(platform));
  };

  // Template operations
  const getThemeTemplates = (): ThemeTemplate[] => {
    return [
      {
        name: "Light Professional",
        description: "Clean, professional light theme",
        category: ThemeCategory.BUSINESS,
        template: createLightProfessionalTemplate(),
      },
      {
        name: "Dark Modern",
        description: "Modern dark theme with vibrant accents",
        category: ThemeCategory.CREATIVE,
        template: createDarkModernTemplate(),
      },
      {
        name: "Gaming",
        description: "High contrast gaming theme",
        category: ThemeCategory.GAMING,
        template: createGamingTemplate(),
      },
      {
        name: "Health & Wellness",
        description: "Calming health and wellness theme",
        category: ThemeCategory.HEALTH,
        template: createHealthWellnessTemplate(),
      },
      {
        name: "Finance",
        description: "Trustworthy financial theme",
        category: ThemeCategory.FINANCE,
        template: createFinanceTemplate(),
      },
    ];
  };

  const createThemeFromTemplate = (template: ThemeTemplate, name: string): ThemeDataModel => {
    const theme = {
      ...template.template,
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return theme;
  };

  const clearError = () => {
    setLastError(null);
  };

  const contextValue: ThemeDataModelContextType = {
    themes,
    currentTheme,
    isLoading,
    lastError,
    createTheme,
    updateTheme,
    deleteTheme,
    setCurrentTheme,
    exportTheme,
    exportThemeToFile,
    importThemeFromJSON,
    importThemeFromURL,
    validateTheme,
    isThemeValid,
    searchThemes,
    filterThemesByCategory,
    filterThemesByPlatform,
    getThemeTemplates,
    createThemeFromTemplate,
    clearError,
  };

  return (
    <ThemeDataModelContext.Provider value={contextValue}>
      {children}
    </ThemeDataModelContext.Provider>
  );
};

// MARK: - Context

const ThemeDataModelContext = createContext<ThemeDataModelContextType | undefined>(undefined);

export const useThemeDataModel = (): ThemeDataModelContextType => {
  const context = useContext(ThemeDataModelContext);
  if (!context) {
    throw new Error('useThemeDataModel must be used within a ThemeDataModelProvider');
  }
  return context;
};

// MARK: - Template Creators

const createLightProfessionalTemplate = (): ThemeDataModel => {
  return {
    ...createDefaultThemeDataModel("Light Professional"),
    description: "Clean, professional light theme",
    author: "Aether Team",
    metadata: {
      ...createDefaultThemeDataModel("").metadata,
      tags: ["professional", "clean", "light"],
      category: ThemeCategory.BUSINESS,
      platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
    },
    colors: {
      ...createDefaultThemeDataModel("").colors,
      primary: { light: "#007AFF", dark: "#0A84FF" },
      secondary: { light: "#5856D6", dark: "#5E5CE6" },
      tertiary: { light: "#FF9500", dark: "#FF9F0A" },
    },
  };
};

const createDarkModernTemplate = (): ThemeDataModel => {
  return {
    ...createDefaultThemeDataModel("Dark Modern"),
    description: "Modern dark theme with vibrant accents",
    author: "Aether Team",
    metadata: {
      ...createDefaultThemeDataModel("").metadata,
      tags: ["modern", "dark", "vibrant"],
      category: ThemeCategory.CREATIVE,
      platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
    },
    colors: {
      ...createDefaultThemeDataModel("").colors,
      primary: { light: "#FF6B6B", dark: "#FF6B6B" },
      secondary: { light: "#4ECDC4", dark: "#4ECDC4" },
      tertiary: { light: "#45B7D1", dark: "#45B7D1" },
      background: {
        primary: { light: "#2C3E50", dark: "#2C3E50" },
        secondary: { light: "#34495E", dark: "#34495E" },
        tertiary: { light: "#3A4A5C", dark: "#3A4A5C" },
      },
      surface: {
        primary: { light: "#34495E", dark: "#34495E" },
        secondary: { light: "#3A4A5C", dark: "#3A4A5C" },
        tertiary: { light: "#4A5A6C", dark: "#4A5A6C" },
        elevated: { light: "#3A4A5C", dark: "#3A4A5C" },
      },
      text: {
        primary: { light: "#ECF0F1", dark: "#ECF0F1" },
        secondary: { light: "#BDC3C7", dark: "#BDC3C7" },
        tertiary: { light: "#95A5A6", dark: "#95A5A6" },
        quaternary: { light: "#7F8C8D", dark: "#7F8C8D" },
        inverse: { light: "#2C3E50", dark: "#2C3E50" },
      },
      semantic: {
        success: { light: "#2ECC71", dark: "#2ECC71" },
        warning: { light: "#F39C12", dark: "#F39C12" },
        error: { light: "#E74C3C", dark: "#E74C3C" },
        info: { light: "#3498DB", dark: "#3498DB" },
      },
    },
  };
};

const createGamingTemplate = (): ThemeDataModel => {
  return {
    ...createDefaultThemeDataModel("Gaming"),
    description: "High contrast gaming theme",
    author: "Aether Team",
    metadata: {
      ...createDefaultThemeDataModel("").metadata,
      tags: ["gaming", "high-contrast", "vibrant"],
      category: ThemeCategory.GAMING,
      platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
    },
    colors: {
      ...createDefaultThemeDataModel("").colors,
      primary: { light: "#FFD700", dark: "#FFD700" },
      secondary: { light: "#FF4500", dark: "#FF4500" },
      tertiary: { light: "#00FF00", dark: "#00FF00" },
      background: {
        primary: { light: "#000000", dark: "#000000" },
        secondary: { light: "#1A1A1A", dark: "#1A1A1A" },
        tertiary: { light: "#2A2A2A", dark: "#2A2A2A" },
      },
      surface: {
        primary: { light: "#1A1A1A", dark: "#1A1A1A" },
        secondary: { light: "#2A2A2A", dark: "#2A2A2A" },
        tertiary: { light: "#3A3A3A", dark: "#3A3A3A" },
        elevated: { light: "#2A2A2A", dark: "#2A2A2A" },
      },
      text: {
        primary: { light: "#FFFFFF", dark: "#FFFFFF" },
        secondary: { light: "#CCCCCC", dark: "#CCCCCC" },
        tertiary: { light: "#999999", dark: "#999999" },
        quaternary: { light: "#666666", dark: "#666666" },
        inverse: { light: "#000000", dark: "#000000" },
      },
      semantic: {
        success: { light: "#00FF00", dark: "#00FF00" },
        warning: { light: "#FFD700", dark: "#FFD700" },
        error: { light: "#FF0000", dark: "#FF0000" },
        info: { light: "#00FFFF", dark: "#00FFFF" },
      },
    },
  };
};

const createHealthWellnessTemplate = (): ThemeDataModel => {
  return {
    ...createDefaultThemeDataModel("Health & Wellness"),
    description: "Calming health and wellness theme",
    author: "Aether Team",
    metadata: {
      ...createDefaultThemeDataModel("").metadata,
      tags: ["health", "wellness", "calming"],
      category: ThemeCategory.HEALTH,
      platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
    },
    colors: {
      ...createDefaultThemeDataModel("").colors,
      primary: { light: "#4CAF50", dark: "#4CAF50" },
      secondary: { light: "#81C784", dark: "#81C784" },
      tertiary: { light: "#66BB6A", dark: "#66BB6A" },
      background: {
        primary: { light: "#F1F8E9", dark: "#1B5E20" },
        secondary: { light: "#E8F5E8", dark: "#2E7D32" },
        tertiary: { light: "#C8E6C9", dark: "#388E3C" },
      },
      surface: {
        primary: { light: "#FFFFFF", dark: "#2E7D32" },
        secondary: { light: "#F1F8E9", dark: "#388E3C" },
        tertiary: { light: "#E8F5E8", dark: "#43A047" },
        elevated: { light: "#FFFFFF", dark: "#388E3C" },
      },
      text: {
        primary: { light: "#2E7D32", dark: "#FFFFFF" },
        secondary: { light: "#388E3C", dark: "#C8E6C9" },
        tertiary: { light: "#43A047", dark: "#A5D6A7" },
        quaternary: { light: "#4CAF50", dark: "#81C784" },
        inverse: { light: "#FFFFFF", dark: "#2E7D32" },
      },
      semantic: {
        success: { light: "#4CAF50", dark: "#4CAF50" },
        warning: { light: "#FF9800", dark: "#FF9800" },
        error: { light: "#F44336", dark: "#F44336" },
        info: { light: "#2196F3", dark: "#2196F3" },
      },
    },
  };
};

const createFinanceTemplate = (): ThemeDataModel => {
  return {
    ...createDefaultThemeDataModel("Finance"),
    description: "Trustworthy financial theme",
    author: "Aether Team",
    metadata: {
      ...createDefaultThemeDataModel("").metadata,
      tags: ["finance", "trustworthy", "professional"],
      category: ThemeCategory.FINANCE,
      platform: [ThemePlatform.IOS, ThemePlatform.ANDROID],
    },
    colors: {
      ...createDefaultThemeDataModel("").colors,
      primary: { light: "#1976D2", dark: "#1976D2" },
      secondary: { light: "#42A5F5", dark: "#42A5F5" },
      tertiary: { light: "#64B5F6", dark: "#64B5F6" },
      background: {
        primary: { light: "#FAFAFA", dark: "#0D47A1" },
        secondary: { light: "#F5F5F5", dark: "#1565C0" },
        tertiary: { light: "#EEEEEE", dark: "#1976D2" },
      },
      surface: {
        primary: { light: "#FFFFFF", dark: "#1565C0" },
        secondary: { light: "#FAFAFA", dark: "#1976D2" },
        tertiary: { light: "#F5F5F5", dark: "#1E88E5" },
        elevated: { light: "#FFFFFF", dark: "#1976D2" },
      },
      text: {
        primary: { light: "#0D47A1", dark: "#FFFFFF" },
        secondary: { light: "#1565C0", dark: "#BBDEFB" },
        tertiary: { light: "#1976D2", dark: "#90CAF9" },
        quaternary: { light: "#1E88E5", dark: "#64B5F6" },
        inverse: { light: "#FFFFFF", dark: "#0D47A1" },
      },
      semantic: {
        success: { light: "#4CAF50", dark: "#4CAF50" },
        warning: { light: "#FF9800", dark: "#FF9800" },
        error: { light: "#F44336", dark: "#F44336" },
        info: { light: "#2196F3", dark: "#2196F3" },
      },
    },
  };
};

// MARK: - Utilities

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export default ThemeDataModelProvider; 