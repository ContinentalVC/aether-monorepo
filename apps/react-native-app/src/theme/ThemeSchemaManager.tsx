/**
 * Theme Schema Manager
 * 
 * Manager for handling theme schemas with structured design approach
 */

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ThemeSchema,
  SchemaValidationError,
  SchemaValidator,
  SchemaSerialization,
  SchemaSerializationError,
  createDefaultThemeSchema,
  // SchemaTemplate is defined locally in this file
  ThemeCategory,
  Platform,
} from './ThemeSchema';

// MARK: - Template Interface

interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  platforms: Platform[];
  schema: ThemeSchema;
}

// MARK: - Theme Schema Manager Context

interface ThemeSchemaContextType {
  // Schema management
  schemas: ThemeSchema[];
  currentSchema: ThemeSchema | null;
  isLoading: boolean;
  lastError: string | null;
  
  // Schema operations
  createSchema: (name: string, author: string, description?: string) => ThemeSchema;
  updateSchema: (schema: ThemeSchema) => void;
  deleteSchema: (schema: ThemeSchema) => void;
  setCurrentSchema: (schema: ThemeSchema) => void;
  
  // Import/Export
  exportSchema: (schema: ThemeSchema) => string | null;
  exportSchemaToFile: (schema: ThemeSchema, filename: string) => Promise<boolean>;
  importSchema: (jsonString: string) => void;
  importSchemaFromJSON: (jsonString: string) => ThemeSchema | null;
  importSchemaFromURL: (url: string) => Promise<ThemeSchema | null>;
  
  // Validation
  validateSchema: (schema: ThemeSchema) => SchemaValidationError[];
  isSchemaValid: (schema: ThemeSchema) => boolean;
  
  // Search and filter
  searchSchemas: (query: string) => ThemeSchema[];
  filterSchemasByCategory: (category: ThemeCategory) => ThemeSchema[];
  filterSchemasByPlatform: (platform: Platform) => ThemeSchema[];
  
  // Templates
  getSchemaTemplates: () => SchemaTemplate[];
  createSchemaFromTemplate: (template: SchemaTemplate, name: string, author: string) => ThemeSchema;
  
  // Conversion
  convertSchemaToThemeDataModel: (schema: ThemeSchema) => any;
  convertThemeDataModelToSchema: (themeDataModel: any) => ThemeSchema;
  
  // Utilities
  clearError: () => void;
}

interface ThemeSchemaProviderProps {
  children: ReactNode;
}

// MARK: - Theme Schema Provider

export const ThemeSchemaProvider: React.FC<ThemeSchemaProviderProps> = ({
  children,
}) => {
  const [schemas, setSchemas] = useState<ThemeSchema[]>([]);
  const [currentSchema, setCurrentSchemaState] = useState<ThemeSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load schemas on mount
  useEffect(() => {
    loadSchemas();
  }, []);

  // Load schemas from storage
  const loadSchemas = async () => {
    try {
      setIsLoading(true);
      const storedSchemas = await AsyncStorage.getItem('themeSchemas');
      
      if (storedSchemas) {
        const parsedSchemas = JSON.parse(storedSchemas) as ThemeSchema[];
        setSchemas(parsedSchemas);
        
        // Load current schema
        const currentSchemaId = await AsyncStorage.getItem('currentSchemaId');
        if (currentSchemaId) {
          const current = parsedSchemas.find(schema => schema.id === currentSchemaId);
          setCurrentSchemaState(current || parsedSchemas[0] || null);
        } else {
          setCurrentSchemaState(parsedSchemas[0] || null);
        }
      } else {
        // Create default schemas if none exist
        createDefaultSchemas();
      }
    } catch (error) {
      setLastError(`Failed to load schemas: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save schemas to storage
  const saveSchemas = async (newSchemas: ThemeSchema[]) => {
    try {
      await AsyncStorage.setItem('themeSchemas', JSON.stringify(newSchemas));
    } catch (error) {
      setLastError(`Failed to save schemas: ${error}`);
    }
  };

  // Create default schemas
  const createDefaultSchemas = () => {
    const templates = getSchemaTemplates();
    const defaultSchemas = templates.map(template => 
      createSchemaFromTemplate(template, template.name, 'Aether Team')
    );
    setSchemas(defaultSchemas);
    setCurrentSchemaState(defaultSchemas[0] || null);
    saveSchemas(defaultSchemas);
  };

  // Schema management operations
  const createSchema = (name: string, author: string, description?: string): ThemeSchema => {
    const schema = createDefaultThemeSchema(name, author);
    schema.metadata.description = description;
    
    const newSchemas = [...schemas, schema];
    setSchemas(newSchemas);
    saveSchemas(newSchemas);
    
    if (!currentSchema) {
      setCurrentSchemaState(schema);
      AsyncStorage.setItem('currentSchemaId', schema.id);
    }
    
    return schema;
  };

  const updateSchema = (schema: ThemeSchema) => {
    const updatedSchema = {
      ...schema,
      metadata: {
        ...schema.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    
    const newSchemas = schemas.map(s => s.id === schema.id ? updatedSchema : s);
    setSchemas(newSchemas);
    saveSchemas(newSchemas);
    
    if (currentSchema?.id === schema.id) {
      setCurrentSchemaState(updatedSchema);
    }
  };

  const deleteSchema = (schema: ThemeSchema) => {
    const newSchemas = schemas.filter(s => s.id !== schema.id);
    setSchemas(newSchemas);
    saveSchemas(newSchemas);
    
    if (currentSchema?.id === schema.id) {
      const newCurrent = newSchemas[0] || null;
      setCurrentSchemaState(newCurrent);
      AsyncStorage.setItem('currentSchemaId', newCurrent?.id || '');
    }
  };

  const setCurrentSchema = (schema: ThemeSchema) => {
    setCurrentSchemaState(schema);
    AsyncStorage.setItem('currentSchemaId', schema.id);
  };

  // Import/Export operations
  const exportSchema = (schema: ThemeSchema): string | null => {
    try {
      return SchemaSerialization.encode(schema);
    } catch (error) {
      setLastError(`Failed to export schema: ${error}`);
      return null;
    }
  };

  const exportSchemaToFile = async (schema: ThemeSchema, filename: string): Promise<boolean> => {
    try {
      const jsonString = exportSchema(schema);
      if (!jsonString) return false;
      
      // In React Native, we can't directly write to file system
      // Instead, we can share the JSON string or save to AsyncStorage
      await AsyncStorage.setItem(`schema_${filename}`, jsonString);
      return true;
    } catch (error) {
      setLastError(`Failed to save schema file: ${error}`);
      return false;
    }
  };

  const importSchemaFromJSON = (jsonString: string): ThemeSchema | null => {
    try {
      const schema = SchemaSerialization.decode(jsonString);
      
      // Validate the schema
      const validationErrors = SchemaValidator.validate(schema);
      if (validationErrors.length > 0) {
        setLastError(`Schema validation failed: ${validationErrors.map(e => e.message).join(', ')}`);
        return null;
      }
      
      // Check if schema with same ID already exists
      if (schemas.some(s => s.id === schema.id)) {
        setLastError(`Schema with ID ${schema.id} already exists`);
        return null;
      }
      
      const newSchemas = [...schemas, schema];
      setSchemas(newSchemas);
      saveSchemas(newSchemas);
      
      return schema;
    } catch (error) {
      setLastError(`Failed to import schema: ${error}`);
      return null;
    }
  };

  const importSchema = (jsonString: string) => {
    const schema = importSchemaFromJSON(jsonString);
    if (schema) {
      const newSchemas = [...schemas, schema];
      setSchemas(newSchemas);
      saveSchemas(newSchemas);
      setCurrentSchema(schema);
    }
  };

  const importSchemaFromURL = async (url: string): Promise<ThemeSchema | null> => {
    try {
      setIsLoading(true);
      setLastError(null);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const jsonString = await response.text();
      return importSchemaFromJSON(jsonString);
    } catch (error) {
      setLastError(`Failed to import schema from URL: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Validation operations
  const validateSchema = (schema: ThemeSchema): SchemaValidationError[] => {
    return SchemaValidator.validate(schema);
  };

  const isSchemaValid = (schema: ThemeSchema): boolean => {
    return SchemaValidator.isValid(schema);
  };

  // Search and filter operations
  const searchSchemas = (query: string): ThemeSchema[] => {
    const lowercasedQuery = query.toLowerCase();
    return schemas.filter(schema => 
      schema.metadata.name.toLowerCase().includes(lowercasedQuery) ||
      (schema.metadata.description?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      schema.metadata.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  };

  const filterSchemasByCategory = (category: ThemeCategory): ThemeSchema[] => {
    return schemas.filter(schema => schema.metadata.category === category);
  };

  const filterSchemasByPlatform = (platform: Platform): ThemeSchema[] => {
    return schemas.filter(schema => schema.metadata.platform.includes(platform));
  };

  // Template operations
  const getSchemaTemplates = (): SchemaTemplate[] => {
    return [
      {
        id: "light-professional",
        name: "Light Professional",
        description: "Clean, professional light schema",
        category: ThemeCategory.BUSINESS,
        platforms: [Platform.IOS, Platform.ANDROID],
        schema: createLightProfessionalTemplate(),
      },
      {
        id: "dark-modern",
        name: "Dark Modern",
        description: "Modern dark schema with vibrant accents",
        category: ThemeCategory.CREATIVE,
        platforms: [Platform.IOS, Platform.ANDROID],
        schema: createDarkModernTemplate(),
      },
      {
        id: "gaming",
        name: "Gaming",
        description: "High contrast gaming schema",
        category: ThemeCategory.GAMING,
        platforms: [Platform.IOS, Platform.ANDROID],
        schema: createGamingTemplate(),
      },
      {
        id: "health-wellness",
        name: "Health & Wellness",
        description: "Calming health and wellness schema",
        category: ThemeCategory.HEALTH,
        platforms: [Platform.IOS, Platform.ANDROID],
        schema: createHealthWellnessTemplate(),
      },
      {
        id: "finance",
        name: "Finance",
        description: "Trustworthy financial schema",
        category: ThemeCategory.FINANCE,
        platforms: [Platform.IOS, Platform.ANDROID],
        schema: createFinanceTemplate(),
      },
    ];
  };

  const createSchemaFromTemplate = (template: SchemaTemplate, name: string, author: string): ThemeSchema => {
    const schema = {
      ...template.schema,
      id: generateId(),
      metadata: {
        ...template.schema.metadata,
        name,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    
    return schema;
  };

  // Conversion operations
  const convertSchemaToThemeDataModel = (schema: ThemeSchema): any => {
    // Convert schema to theme data model format
    return {
      id: schema.id,
      name: schema.metadata.name,
      version: schema.metadata.version,
      description: schema.metadata.description,
      author: schema.metadata.author,
      createdAt: schema.metadata.createdAt,
      updatedAt: schema.metadata.updatedAt,
      metadata: {
        tags: schema.metadata.tags,
        category: schema.metadata.category,
        platform: schema.metadata.platform,
        license: schema.metadata.license,
        website: schema.metadata.website,
        previewImage: schema.metadata.previewImage,
      },
      colors: convertColorPropertiesToColorPalette(schema.properties.colors),
      typography: convertTypographyPropertiesToTypographySystem(schema.properties.typography),
      spacing: convertLayoutMetricsToSpacingSystem(schema.properties.layoutMetrics),
      shadows: schema.properties.shadows,
      animations: schema.properties.animations,
      icons: convertIconographyPropertiesToIconSystem(schema.properties.iconography),
      accessibility: convertAccessibilityPropertiesToAccessibilitySettings(schema.properties.accessibility),
    };
  };

  const convertThemeDataModelToSchema = (themeDataModel: any): ThemeSchema => {
    // Convert theme data model to schema format
    return {
      id: themeDataModel.id,
      metadata: {
        name: themeDataModel.name,
        author: themeDataModel.author || 'Unknown',
        version: themeDataModel.version,
        description: themeDataModel.description,
        createdAt: themeDataModel.createdAt,
        updatedAt: themeDataModel.updatedAt,
        tags: themeDataModel.metadata.tags,
        category: themeDataModel.metadata.category,
        platform: themeDataModel.metadata.platform,
        license: themeDataModel.metadata.license,
        website: themeDataModel.metadata.website,
        previewImage: themeDataModel.metadata.previewImage,
      },
      properties: {
        colors: convertColorPaletteToColorProperties(themeDataModel.colors),
        typography: convertTypographySystemToTypographyProperties(themeDataModel.typography),
        iconography: convertIconSystemToIconographyProperties(themeDataModel.icons),
        layoutMetrics: convertSpacingSystemToLayoutMetrics(themeDataModel.spacing),
        shadows: themeDataModel.shadows,
        animations: themeDataModel.animations,
        accessibility: convertAccessibilitySettingsToAccessibilityProperties(themeDataModel.accessibility),
        custom: {},
      },
    };
  };

  const clearError = () => {
    setLastError(null);
  };

  const contextValue: ThemeSchemaContextType = {
    schemas,
    currentSchema,
    isLoading,
    lastError,
    createSchema,
    updateSchema,
    deleteSchema,
    setCurrentSchema,
    exportSchema,
    exportSchemaToFile,
    importSchema,
    importSchemaFromJSON,
    importSchemaFromURL,
    validateSchema,
    isSchemaValid,
    searchSchemas,
    filterSchemasByCategory,
    filterSchemasByPlatform,
    getSchemaTemplates,
    createSchemaFromTemplate,
    convertSchemaToThemeDataModel,
    convertThemeDataModelToSchema,
    clearError,
  };

  return (
    <ThemeSchemaContext.Provider value={contextValue}>
      {children}
    </ThemeSchemaContext.Provider>
  );
};

// MARK: - Context

const ThemeSchemaContext = createContext<ThemeSchemaContextType | undefined>(undefined);

export const useThemeSchema = (): ThemeSchemaContextType => {
  const context = useContext(ThemeSchemaContext);
  if (!context) {
    throw new Error('useThemeSchema must be used within a ThemeSchemaProvider');
  }
  return context;
};

// MARK: - Template Creators

const createLightProfessionalTemplate = (): ThemeSchema => {
  return {
    ...createDefaultThemeSchema("Light Professional", "Aether Team"),
    metadata: {
      ...createDefaultThemeSchema("Light Professional", "Aether Team").metadata,
      description: "Clean, professional light schema",
      tags: ["professional", "clean", "light"],
      category: ThemeCategory.BUSINESS,
      platform: [Platform.IOS, Platform.ANDROID],
    },
    properties: {
      ...createDefaultThemeSchema("Light Professional", "Aether Team").properties,
      colors: {
        ...createDefaultThemeSchema("Light Professional", "Aether Team").properties.colors,
        primary: { light: '#0A7AFF', dark: '#0A84FF' },
        secondary: { light: '#5856D6', dark: '#5E5CE6' },
        tertiary: { light: '#FF9500', dark: '#FF9F0A' },
      },
      typography: {
        ...createDefaultThemeSchema("Light Professional", "Aether Team").properties.typography,
        primaryFontName: 'HelveticaNeue-Bold',
        bodyFontName: 'HelveticaNeue',
        headingScaleFactor: 1.5,
        baseFontSize: 17,
      },
    },
  };
};

const createDarkModernTemplate = (): ThemeSchema => {
  return {
    ...createDefaultThemeSchema("Dark Modern", "Aether Team"),
    metadata: {
      ...createDefaultThemeSchema("Dark Modern", "Aether Team").metadata,
      description: "Modern dark schema with vibrant accents",
      tags: ["modern", "dark", "vibrant"],
      category: ThemeCategory.CREATIVE,
      platform: [Platform.IOS, Platform.ANDROID],
    },
    properties: {
      ...createDefaultThemeSchema("Dark Modern", "Aether Team").properties,
      colors: {
        ...createDefaultThemeSchema("Dark Modern", "Aether Team").properties.colors,
        primary: { light: '#FF6B6B', dark: '#FF6B6B' },
        secondary: { light: '#4ECDC4', dark: '#4ECDC4' },
        tertiary: { light: '#45B7D1', dark: '#45B7D1' },
        background: {
          primary: { light: '#2C3E50', dark: '#2C3E50' },
          secondary: { light: '#34495E', dark: '#34495E' },
          tertiary: { light: '#3A4A5C', dark: '#3A4A5C' },
        },
        surface: {
          primary: { light: '#34495E', dark: '#34495E' },
          secondary: { light: '#3A4A5C', dark: '#3A4A5C' },
          tertiary: { light: '#4A5A6C', dark: '#4A5A6C' },
          elevated: { light: '#3A4A5C', dark: '#3A4A5C' },
        },
        text: {
          primary: { light: '#ECF0F1', dark: '#ECF0F1' },
          secondary: { light: '#BDC3C7', dark: '#BDC3C7' },
          tertiary: { light: '#95A5A6', dark: '#95A5A6' },
          quaternary: { light: '#7F8C8D', dark: '#7F8C8D' },
          inverse: { light: '#2C3E50', dark: '#2C3E50' },
        },
        semantic: {
          success: { light: '#2ECC71', dark: '#2ECC71' },
          warning: { light: '#F39C12', dark: '#F39C12' },
          error: { light: '#E74C3C', dark: '#E74C3C' },
          info: { light: '#3498DB', dark: '#3498DB' },
          destructive: { light: '#E74C3C', dark: '#E74C3C' },
        },
      },
      typography: {
        ...createDefaultThemeSchema("Dark Modern", "Aether Team").properties.typography,
        primaryFontName: 'HelveticaNeue-Bold',
        bodyFontName: 'HelveticaNeue',
        headingScaleFactor: 1.6,
        baseFontSize: 16,
      },
    },
  };
};

const createGamingTemplate = (): ThemeSchema => {
  return {
    ...createDefaultThemeSchema("Gaming", "Aether Team"),
    metadata: {
      ...createDefaultThemeSchema("Gaming", "Aether Team").metadata,
      description: "High contrast gaming schema",
      tags: ["gaming", "high-contrast", "vibrant"],
      category: ThemeCategory.GAMING,
      platform: [Platform.IOS, Platform.ANDROID],
    },
    properties: {
      ...createDefaultThemeSchema("Gaming", "Aether Team").properties,
      colors: {
        ...createDefaultThemeSchema("Gaming", "Aether Team").properties.colors,
        primary: { light: '#FFD700', dark: '#FFD700' },
        secondary: { light: '#FF4500', dark: '#FF4500' },
        tertiary: { light: '#00FF00', dark: '#00FF00' },
        background: {
          primary: { light: '#000000', dark: '#000000' },
          secondary: { light: '#1A1A1A', dark: '#1A1A1A' },
          tertiary: { light: '#2A2A2A', dark: '#2A2A2A' },
        },
        surface: {
          primary: { light: '#1A1A1A', dark: '#1A1A1A' },
          secondary: { light: '#2A2A2A', dark: '#2A2A2A' },
          tertiary: { light: '#3A3A3A', dark: '#3A3A3A' },
          elevated: { light: '#2A2A2A', dark: '#2A2A2A' },
        },
        text: {
          primary: { light: '#FFFFFF', dark: '#FFFFFF' },
          secondary: { light: '#CCCCCC', dark: '#CCCCCC' },
          tertiary: { light: '#999999', dark: '#999999' },
          quaternary: { light: '#666666', dark: '#666666' },
          inverse: { light: '#000000', dark: '#000000' },
        },
        semantic: {
          success: { light: '#00FF00', dark: '#00FF00' },
          warning: { light: '#FFD700', dark: '#FFD700' },
          error: { light: '#FF0000', dark: '#FF0000' },
          info: { light: '#00FFFF', dark: '#00FFFF' },
          destructive: { light: '#FF0000', dark: '#FF0000' },
        },
      },
      typography: {
        ...createDefaultThemeSchema("Gaming", "Aether Team").properties.typography,
        primaryFontName: 'HelveticaNeue-Bold',
        bodyFontName: 'HelveticaNeue',
        headingScaleFactor: 1.8,
        baseFontSize: 18,
      },
    },
  };
};

const createHealthWellnessTemplate = (): ThemeSchema => {
  return {
    ...createDefaultThemeSchema("Health & Wellness", "Aether Team"),
    metadata: {
      ...createDefaultThemeSchema("Health & Wellness", "Aether Team").metadata,
      description: "Calming health and wellness schema",
      tags: ["health", "wellness", "calming"],
      category: ThemeCategory.HEALTH,
      platform: [Platform.IOS, Platform.ANDROID],
    },
    properties: {
      ...createDefaultThemeSchema("Health & Wellness", "Aether Team").properties,
      colors: {
        ...createDefaultThemeSchema("Health & Wellness", "Aether Team").properties.colors,
        primary: { light: '#4CAF50', dark: '#4CAF50' },
        secondary: { light: '#81C784', dark: '#81C784' },
        tertiary: { light: '#66BB6A', dark: '#66BB6A' },
        background: {
          primary: { light: '#F1F8E9', dark: '#1B5E20' },
          secondary: { light: '#E8F5E8', dark: '#2E7D32' },
          tertiary: { light: '#C8E6C9', dark: '#388E3C' },
        },
        surface: {
          primary: { light: '#FFFFFF', dark: '#2E7D32' },
          secondary: { light: '#F1F8E9', dark: '#388E3C' },
          tertiary: { light: '#E8F5E8', dark: '#43A047' },
          elevated: { light: '#FFFFFF', dark: '#388E3C' },
        },
        text: {
          primary: { light: '#2E7D32', dark: '#FFFFFF' },
          secondary: { light: '#388E3C', dark: '#C8E6C9' },
          tertiary: { light: '#43A047', dark: '#A5D6A7' },
          quaternary: { light: '#4CAF50', dark: '#81C784' },
          inverse: { light: '#FFFFFF', dark: '#2E7D32' },
        },
        semantic: {
          success: { light: '#4CAF50', dark: '#4CAF50' },
          warning: { light: '#FF9800', dark: '#FF9800' },
          error: { light: '#F44336', dark: '#F44336' },
          info: { light: '#2196F3', dark: '#2196F3' },
          destructive: { light: '#F44336', dark: '#F44336' },
        },
      },
      typography: {
        ...createDefaultThemeSchema("Health & Wellness", "Aether Team").properties.typography,
        primaryFontName: 'HelveticaNeue-Light',
        bodyFontName: 'HelveticaNeue',
        headingScaleFactor: 1.4,
        baseFontSize: 16,
      },
    },
  };
};

const createFinanceTemplate = (): ThemeSchema => {
  return {
    ...createDefaultThemeSchema("Finance", "Aether Team"),
    metadata: {
      ...createDefaultThemeSchema("Finance", "Aether Team").metadata,
      description: "Trustworthy financial schema",
      tags: ["finance", "trustworthy", "professional"],
      category: ThemeCategory.FINANCE,
      platform: [Platform.IOS, Platform.ANDROID],
    },
    properties: {
      ...createDefaultThemeSchema("Finance", "Aether Team").properties,
      colors: {
        ...createDefaultThemeSchema("Finance", "Aether Team").properties.colors,
        primary: { light: '#1976D2', dark: '#1976D2' },
        secondary: { light: '#42A5F5', dark: '#42A5F5' },
        tertiary: { light: '#64B5F6', dark: '#64B5F6' },
        background: {
          primary: { light: '#FAFAFA', dark: '#0D47A1' },
          secondary: { light: '#F5F5F5', dark: '#1565C0' },
          tertiary: { light: '#EEEEEE', dark: '#1976D2' },
        },
        surface: {
          primary: { light: '#FFFFFF', dark: '#1565C0' },
          secondary: { light: '#FAFAFA', dark: '#1976D2' },
          tertiary: { light: '#F5F5F5', dark: '#1E88E5' },
          elevated: { light: '#FFFFFF', dark: '#1976D2' },
        },
        text: {
          primary: { light: '#0D47A1', dark: '#FFFFFF' },
          secondary: { light: '#1565C0', dark: '#BBDEFB' },
          tertiary: { light: '#1976D2', dark: '#90CAF9' },
          quaternary: { light: '#1E88E5', dark: '#64B5F6' },
          inverse: { light: '#FFFFFF', dark: '#0D47A1' },
        },
        semantic: {
          success: { light: '#4CAF50', dark: '#4CAF50' },
          warning: { light: '#FF9800', dark: '#FF9800' },
          error: { light: '#F44336', dark: '#F44336' },
          info: { light: '#2196F3', dark: '#2196F3' },
          destructive: { light: '#F44336', dark: '#F44336' },
        },
      },
      typography: {
        ...createDefaultThemeSchema("Finance", "Aether Team").properties.typography,
        primaryFontName: 'HelveticaNeue-Bold',
        bodyFontName: 'HelveticaNeue',
        headingScaleFactor: 1.3,
        baseFontSize: 15,
      },
    },
  };
};

// MARK: - Conversion Helpers

const convertColorPropertiesToColorPalette = (colors: any): any => {
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    semantic: colors.semantic,
    custom: colors.custom,
  };
};

const convertTypographyPropertiesToTypographySystem = (typography: any): any => {
  return {
    fontFamilies: {
      primary: typography.primaryFontName,
      secondary: typography.bodyFontName,
      monospace: typography.monospaceFontName,
    },
    fontSizes: {
      xs: typography.baseFontSize * 0.7,
      sm: typography.baseFontSize * 0.8,
      md: typography.baseFontSize,
      lg: typography.baseFontSize * 1.1,
      xl: typography.baseFontSize * 1.2,
      xxl: typography.baseFontSize * 1.4,
      xxxl: typography.baseFontSize * 1.9,
    },
    fontWeights: typography.fontWeights,
    lineHeights: typography.lineHeights,
    letterSpacing: typography.letterSpacing,
    textStyles: typography.textStyles,
  };
};

const convertLayoutMetricsToSpacingSystem = (layoutMetrics: any): any => {
  return {
    xs: layoutMetrics.spacing.xs,
    sm: layoutMetrics.spacing.sm,
    md: layoutMetrics.spacing.md,
    lg: layoutMetrics.spacing.lg,
    xl: layoutMetrics.spacing.xl,
    xxl: layoutMetrics.spacing.xxl,
    xxxl: layoutMetrics.spacing.xxxl,
  };
};

const convertIconographyPropertiesToIconSystem = (iconography: any): any => {
  return {
    family: iconography.family,
    sizes: iconography.sizes,
    weights: iconography.weights,
  };
};

const convertAccessibilityPropertiesToAccessibilitySettings = (accessibility: any): any => {
  return {
    highContrast: accessibility.highContrast,
    reducedMotion: accessibility.reducedMotion,
    increasedContrast: accessibility.increasedContrast,
    darkMode: accessibility.darkMode,
    dynamicType: accessibility.dynamicType,
  };
};

const convertColorPaletteToColorProperties = (colors: any): any => {
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    semantic: colors.semantic,
    custom: colors.custom,
  };
};

const convertTypographySystemToTypographyProperties = (typography: any): any => {
  return {
    primaryFontName: typography.fontFamilies.primary,
    bodyFontName: typography.fontFamilies.secondary,
    monospaceFontName: typography.fontFamilies.monospace,
    headingScaleFactor: 1.5,
    baseFontSize: typography.fontSizes.md,
    fontWeights: typography.fontWeights,
    lineHeights: typography.lineHeights,
    letterSpacing: typography.letterSpacing,
    textStyles: typography.textStyles,
  };
};

const convertSpacingSystemToLayoutMetrics = (spacing: any): any => {
  return {
    spacing: {
      xs: spacing.xs,
      sm: spacing.sm,
      md: spacing.md,
      lg: spacing.lg,
      xl: spacing.xl,
      xxl: spacing.xxl,
      xxxl: spacing.xxxl,
    },
    padding: {},
    margins: {},
    borderRadius: {},
    grid: {},
    breakpoints: {},
  };
};

const convertIconSystemToIconographyProperties = (icons: any): any => {
  return {
    family: icons.family,
    sizes: icons.sizes,
    weights: icons.weights,
    colors: {},
    custom: {},
  };
};

const convertAccessibilitySettingsToAccessibilityProperties = (accessibility: any): any => {
  return {
    highContrast: accessibility.highContrast,
    reducedMotion: accessibility.reducedMotion,
    increasedContrast: accessibility.increasedContrast,
    darkMode: accessibility.darkMode,
    dynamicType: accessibility.dynamicType,
    voiceOver: {},
    switchControl: {},
  };
};

// MARK: - Utilities

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export default ThemeSchemaProvider; 