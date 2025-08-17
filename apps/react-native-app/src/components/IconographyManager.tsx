import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useEnhancedTheme } from '../theme/EnhancedThemeProvider';

// MARK: - Icon Style System

export interface IconStyle {
  // Icon family/set
  family: IconFamily;

  // Icon weight/style
  weight: IconWeight;

  // Icon size scale
  size: IconSize;

  // Icon color treatment
  colorTreatment: IconColorTreatment;

  // Icon positioning and alignment
  positioning: IconPositioning;

  // Animation style for interactive icons
  animation: IconAnimation;
}

// MARK: - Icon Family

export enum IconFamily {
  SF_SYMBOLS = 'SF Symbols',
  CUSTOM = 'Custom',
  OUTLINED = 'Outlined',
  FILLED = 'Filled',
  ROUNDED = 'Rounded',
  SHARP = 'Sharp',
  TWO_TONE = 'Two-Tone',
}

export const getIconFamilyDescription = (family: IconFamily): string => {
  switch (family) {
    case IconFamily.SF_SYMBOLS:
      return "Apple's system icons with consistent design language";
    case IconFamily.CUSTOM:
      return 'Custom icon set with unique visual style';
    case IconFamily.OUTLINED:
      return 'Clean outlined icons with minimal weight';
    case IconFamily.FILLED:
      return 'Solid filled icons with strong presence';
    case IconFamily.ROUNDED:
      return 'Soft rounded corners for friendly feel';
    case IconFamily.SHARP:
      return 'Sharp geometric shapes for modern look';
    case IconFamily.TWO_TONE:
      return 'Two-color icons for visual interest';
  }
};

export const getIconFamilyPreview = (family: IconFamily): string => {
  switch (family) {
    case IconFamily.SF_SYMBOLS: return '★';
    case IconFamily.CUSTOM: return '★';
    case IconFamily.OUTLINED: return '☆';
    case IconFamily.FILLED: return '★';
    case IconFamily.ROUNDED: return '●';
    case IconFamily.SHARP: return '◆';
    case IconFamily.TWO_TONE: return '◆';
  }
};

// MARK: - Icon Weight

export enum IconWeight {
  ULTRA_LIGHT = 'Ultra Light',
  THIN = 'Thin',
  LIGHT = 'Light',
  REGULAR = 'Regular',
  MEDIUM = 'Medium',
  SEMIBOLD = 'Semibold',
  BOLD = 'Bold',
  HEAVY = 'Heavy',
  BLACK = 'Black',
}

export const getIconWeightDescription = (weight: IconWeight): string => {
  switch (weight) {
    case IconWeight.ULTRA_LIGHT: return 'Very thin lines for subtle appearance';
    case IconWeight.THIN: return 'Thin lines for elegant look';
    case IconWeight.LIGHT: return 'Light weight for clean design';
    case IconWeight.REGULAR: return 'Standard weight for most use cases';
    case IconWeight.MEDIUM: return 'Medium weight for emphasis';
    case IconWeight.SEMIBOLD: return 'Semi-bold for strong presence';
    case IconWeight.BOLD: return 'Bold weight for high emphasis';
    case IconWeight.HEAVY: return 'Heavy weight for maximum impact';
    case IconWeight.BLACK: return 'Black weight for strongest presence';
  }
};

// MARK: - Icon Size

export enum IconSize {
  TINY = 'Tiny',
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
  EXTRA_LARGE = 'Extra Large',
  HUGE = 'Huge',
}

export const getIconSizeValue = (size: IconSize): number => {
  switch (size) {
    case IconSize.TINY: return 12;
    case IconSize.SMALL: return 16;
    case IconSize.MEDIUM: return 20;
    case IconSize.LARGE: return 24;
    case IconSize.EXTRA_LARGE: return 32;
    case IconSize.HUGE: return 48;
  }
};

export const getIconSizeDescription = (size: IconSize): string => {
  switch (size) {
    case IconSize.TINY: return '12pt - For very small spaces';
    case IconSize.SMALL: return '16pt - For compact interfaces';
    case IconSize.MEDIUM: return '20pt - Standard size for most uses';
    case IconSize.LARGE: return '24pt - For emphasis and buttons';
    case IconSize.EXTRA_LARGE: return '32pt - For prominent features';
    case IconSize.HUGE: return '48pt - For hero sections';
  }
};

// MARK: - Icon Color Treatment

export enum IconColorTreatment {
  THEME = 'Theme',
  MONOCHROME = 'Monochrome',
  ACCENT = 'Accent',
  SEMANTIC = 'Semantic',
  CUSTOM = 'Custom',
}

export const getIconColorTreatmentDescription = (treatment: IconColorTreatment): string => {
  switch (treatment) {
    case IconColorTreatment.THEME:
      return 'Uses theme colors for consistency';
    case IconColorTreatment.MONOCHROME:
      return 'Single color for minimal look';
    case IconColorTreatment.ACCENT:
      return 'Uses accent colors for emphasis';
    case IconColorTreatment.SEMANTIC:
      return 'Colors based on meaning (success, warning, etc.)';
    case IconColorTreatment.CUSTOM:
      return 'Custom color palette';
  }
};

// MARK: - Icon Positioning

export enum IconPositioning {
  CENTER = 'Center',
  LEADING = 'Leading',
  TRAILING = 'Trailing',
  TOP = 'Top',
  BOTTOM = 'Bottom',
}

export const getIconPositioningDescription = (positioning: IconPositioning): string => {
  switch (positioning) {
    case IconPositioning.CENTER: return 'Centered alignment';
    case IconPositioning.LEADING: return 'Left-aligned positioning';
    case IconPositioning.TRAILING: return 'Right-aligned positioning';
    case IconPositioning.TOP: return 'Top-aligned positioning';
    case IconPositioning.BOTTOM: return 'Bottom-aligned positioning';
  }
};

// MARK: - Icon Animation

export enum IconAnimation {
  NONE = 'None',
  SUBTLE = 'Subtle',
  BOUNCE = 'Bounce',
  PULSE = 'Pulse',
  ROTATE = 'Rotate',
  SCALE = 'Scale',
}

export const getIconAnimationDescription = (animation: IconAnimation): string => {
  switch (animation) {
    case IconAnimation.NONE: return 'No animation';
    case IconAnimation.SUBTLE: return 'Gentle hover effects';
    case IconAnimation.BOUNCE: return 'Bouncy interaction feedback';
    case IconAnimation.PULSE: return 'Pulsing attention effect';
    case IconAnimation.ROTATE: return 'Rotation on interaction';
    case IconAnimation.SCALE: return 'Scale transformation';
  }
};

// MARK: - Icon Category

export enum IconCategory {
  NAVIGATION = 'Navigation',
  ACTIONS = 'Actions',
  STATUS = 'Status',
  MEDIA = 'Media',
  COMMUNICATION = 'Communication',
  COMMERCE = 'Commerce',
  SOCIAL = 'Social',
  SYSTEM = 'System',
  CUSTOM = 'Custom',
}

export const getIconCategoryDescription = (category: IconCategory): string => {
  switch (category) {
    case IconCategory.NAVIGATION: return 'Navigation and wayfinding icons';
    case IconCategory.ACTIONS: return 'Action and interaction icons';
    case IconCategory.STATUS: return 'Status and state indicators';
    case IconCategory.MEDIA: return 'Media and content icons';
    case IconCategory.COMMUNICATION: return 'Communication and messaging';
    case IconCategory.COMMERCE: return 'Shopping and commerce';
    case IconCategory.SOCIAL: return 'Social media and sharing';
    case IconCategory.SYSTEM: return 'System and settings';
    case IconCategory.CUSTOM: return 'Custom application icons';
  }
};

// MARK: - Icon Definition

export interface IconDefinition {
  name: string;
  category: IconCategory;
  description: string;
  tags: string[];
  accessibilityLabel: string;
  unicode?: string;
  customPath?: string;
}

// MARK: - Default Icons

export const defaultIcons: IconDefinition[] = [
  // Navigation
  {
    name: 'chevron-left',
    category: IconCategory.NAVIGATION,
    description: 'Back navigation',
    tags: ['back', 'previous', 'left'],
    accessibilityLabel: 'Back navigation',
    unicode: '‹'
  },
  {
    name: 'chevron-right',
    category: IconCategory.NAVIGATION,
    description: 'Forward navigation',
    tags: ['forward', 'next', 'right'],
    accessibilityLabel: 'Forward navigation',
    unicode: '›'
  },
  {
    name: 'home',
    category: IconCategory.NAVIGATION,
    description: 'Home',
    tags: ['home', 'main'],
    accessibilityLabel: 'Home',
    unicode: '⌂'
  },
  {
    name: 'search',
    category: IconCategory.NAVIGATION,
    description: 'Search',
    tags: ['search', 'find'],
    accessibilityLabel: 'Search',
    unicode: '🔍'
  },

  // Actions
  {
    name: 'plus',
    category: IconCategory.ACTIONS,
    description: 'Add',
    tags: ['add', 'create', 'new'],
    accessibilityLabel: 'Add',
    unicode: '+'
  },
  {
    name: 'minus',
    category: IconCategory.ACTIONS,
    description: 'Remove',
    tags: ['remove', 'delete', 'subtract'],
    accessibilityLabel: 'Remove',
    unicode: '−'
  },
  {
    name: 'checkmark',
    category: IconCategory.ACTIONS,
    description: 'Confirm',
    tags: ['confirm', 'done', 'success'],
    accessibilityLabel: 'Confirm',
    unicode: '✓'
  },
  {
    name: 'xmark',
    category: IconCategory.ACTIONS,
    description: 'Cancel',
    tags: ['cancel', 'close', 'dismiss'],
    accessibilityLabel: 'Cancel',
    unicode: '✕'
  },

  // Status
  {
    name: 'checkmark-circle',
    category: IconCategory.STATUS,
    description: 'Success',
    tags: ['success', 'complete', 'done'],
    accessibilityLabel: 'Success',
    unicode: '✓'
  },
  {
    name: 'exclamation-triangle',
    category: IconCategory.STATUS,
    description: 'Warning',
    tags: ['warning', 'alert', 'caution'],
    accessibilityLabel: 'Warning',
    unicode: '⚠'
  },
  {
    name: 'x-circle',
    category: IconCategory.STATUS,
    description: 'Error',
    tags: ['error', 'fail', 'stop'],
    accessibilityLabel: 'Error',
    unicode: '✕'
  },
  {
    name: 'info-circle',
    category: IconCategory.STATUS,
    description: 'Information',
    tags: ['info', 'help', 'information'],
    accessibilityLabel: 'Information',
    unicode: 'ℹ'
  },

  // Media
  {
    name: 'play',
    category: IconCategory.MEDIA,
    description: 'Play',
    tags: ['play', 'start', 'media'],
    accessibilityLabel: 'Play',
    unicode: '▶'
  },
  {
    name: 'pause',
    category: IconCategory.MEDIA,
    description: 'Pause',
    tags: ['pause', 'stop', 'media'],
    accessibilityLabel: 'Pause',
    unicode: '⏸'
  },
  {
    name: 'photo',
    category: IconCategory.MEDIA,
    description: 'Photo',
    tags: ['photo', 'image', 'picture'],
    accessibilityLabel: 'Photo',
    unicode: '📷'
  },
  {
    name: 'video',
    category: IconCategory.MEDIA,
    description: 'Video',
    tags: ['video', 'movie', 'media'],
    accessibilityLabel: 'Video',
    unicode: '🎥'
  },

  // Communication
  {
    name: 'message',
    category: IconCategory.COMMUNICATION,
    description: 'Message',
    tags: ['message', 'chat', 'communication'],
    accessibilityLabel: 'Message',
    unicode: '💬'
  },
  {
    name: 'envelope',
    category: IconCategory.COMMUNICATION,
    description: 'Email',
    tags: ['email', 'mail', 'communication'],
    accessibilityLabel: 'Email',
    unicode: '✉'
  },
  {
    name: 'phone',
    category: IconCategory.COMMUNICATION,
    description: 'Phone',
    tags: ['phone', 'call', 'communication'],
    accessibilityLabel: 'Phone',
    unicode: '📞'
  },
  {
    name: 'person',
    category: IconCategory.COMMUNICATION,
    description: 'Person',
    tags: ['person', 'user', 'profile'],
    accessibilityLabel: 'Person',
    unicode: '👤'
  },

  // Commerce
  {
    name: 'cart',
    category: IconCategory.COMMERCE,
    description: 'Shopping cart',
    tags: ['cart', 'shopping', 'buy'],
    accessibilityLabel: 'Shopping cart',
    unicode: '🛒'
  },
  {
    name: 'creditcard',
    category: IconCategory.COMMERCE,
    description: 'Payment',
    tags: ['payment', 'card', 'money'],
    accessibilityLabel: 'Payment',
    unicode: '💳'
  },
  {
    name: 'bag',
    category: IconCategory.COMMERCE,
    description: 'Bag',
    tags: ['bag', 'shopping', 'store'],
    accessibilityLabel: 'Bag',
    unicode: '👜'
  },
  {
    name: 'heart',
    category: IconCategory.COMMERCE,
    description: 'Favorite',
    tags: ['favorite', 'like', 'love'],
    accessibilityLabel: 'Favorite',
    unicode: '❤'
  },

  // Social
  {
    name: 'share',
    category: IconCategory.SOCIAL,
    description: 'Share',
    tags: ['share', 'social', 'export'],
    accessibilityLabel: 'Share',
    unicode: '↗'
  },
  {
    name: 'bookmark',
    category: IconCategory.SOCIAL,
    description: 'Bookmark',
    tags: ['bookmark', 'save', 'favorite'],
    accessibilityLabel: 'Bookmark',
    unicode: '🔖'
  },
  {
    name: 'star',
    category: IconCategory.SOCIAL,
    description: 'Star',
    tags: ['star', 'rating', 'favorite'],
    accessibilityLabel: 'Star',
    unicode: '★'
  },
  {
    name: 'thumbsup',
    category: IconCategory.SOCIAL,
    description: 'Like',
    tags: ['like', 'thumbsup', 'approve'],
    accessibilityLabel: 'Like',
    unicode: '👍'
  },

  // System
  {
    name: 'gear',
    category: IconCategory.SYSTEM,
    description: 'Settings',
    tags: ['settings', 'gear', 'preferences'],
    accessibilityLabel: 'Settings',
    unicode: '⚙'
  },
  {
    name: 'bell',
    category: IconCategory.SYSTEM,
    description: 'Notifications',
    tags: ['notifications', 'bell', 'alerts'],
    accessibilityLabel: 'Notifications',
    unicode: '🔔'
  },
  {
    name: 'lock',
    category: IconCategory.SYSTEM,
    description: 'Security',
    tags: ['security', 'lock', 'privacy'],
    accessibilityLabel: 'Security',
    unicode: '🔒'
  },
  {
    name: 'wifi',
    category: IconCategory.SYSTEM,
    description: 'WiFi',
    tags: ['wifi', 'network', 'connection'],
    accessibilityLabel: 'WiFi',
    unicode: '📶'
  }
];

// MARK: - Iconography Context

interface IconographyContextType {
  // Current icon style
  currentStyle: IconStyle;

  // Custom icons and mappings
  customIcons: Record<string, IconDefinition>;
  iconMappings: Record<string, string>;

  // Style management
  updateIconStyle: (style: Partial<IconStyle>) => void;
  setIconFamily: (family: IconFamily) => void;
  setIconWeight: (weight: IconWeight) => void;
  setIconSize: (size: IconSize) => void;
  setIconColorTreatment: (treatment: IconColorTreatment) => void;
  setIconPositioning: (positioning: IconPositioning) => void;
  setIconAnimation: (animation: IconAnimation) => void;

  // Icon management
  addCustomIcon: (icon: IconDefinition) => void;
  removeCustomIcon: (name: string) => void;
  mapIcon: (originalName: string, mappedName: string) => void;

  // Icon retrieval
  getIcon: (name: string, style?: Partial<IconStyle>) => ReactNode;
  getIconColor: (style?: Partial<IconStyle>) => string;
  getIconSize: (style?: Partial<IconStyle>) => number;

  // Icon search and filtering
  getIconsByCategory: (category: IconCategory) => IconDefinition[];
  searchIcons: (query: string) => IconDefinition[];

  // Available options
  availableFamilies: IconFamily[];
  availableWeights: IconWeight[];
  availableSizes: IconSize[];
  availableColorTreatments: IconColorTreatment[];
  availablePositionings: IconPositioning[];
  availableAnimations: IconAnimation[];
  availableCategories: IconCategory[];
}

interface IconographyProviderProps {
  children: ReactNode;
  initialStyle?: Partial<IconStyle>;
}

// MARK: - Iconography Provider

export const IconographyProvider: React.FC<IconographyProviderProps> = ({
  children,
  initialStyle = {}
}) => {
  const { theme } = useEnhancedTheme();

  const [currentStyle, setCurrentStyle] = useState<IconStyle>({
    family: IconFamily.SF_SYMBOLS,
    weight: IconWeight.REGULAR,
    size: IconSize.MEDIUM,
    colorTreatment: IconColorTreatment.THEME,
    positioning: IconPositioning.CENTER,
    animation: IconAnimation.SUBTLE,
    ...initialStyle
  });

  const [customIcons, setCustomIcons] = useState<Record<string, IconDefinition>>({});
  const [iconMappings, setIconMappings] = useState<Record<string, string>>({});

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    saveData();
  }, [currentStyle, customIcons, iconMappings]);

  const loadSavedData = async () => {
    try {
      // Load from AsyncStorage or other persistence
      // This is a simplified version - you'd implement actual storage
      const savedStyle = await getSavedIconStyle();
      if (savedStyle) {
        setCurrentStyle(prev => ({ ...prev, ...savedStyle }));
      }
    } catch (error) {
      console.warn('Failed to load iconography data:', error);
    }
  };

  const saveData = async () => {
    try {
      // Save to AsyncStorage or other persistence
      await saveIconStyle(currentStyle);
    } catch (error) {
      console.warn('Failed to save iconography data:', error);
    }
  };

  const updateIconStyle = (style: Partial<IconStyle>) => {
    setCurrentStyle(prev => ({ ...prev, ...style }));
  };

  const setIconFamily = (family: IconFamily) => {
    updateIconStyle({ family });
  };

  const setIconWeight = (weight: IconWeight) => {
    updateIconStyle({ weight });
  };

  const setIconSize = (size: IconSize) => {
    updateIconStyle({ size });
  };

  const setIconColorTreatment = (treatment: IconColorTreatment) => {
    updateIconStyle({ colorTreatment: treatment });
  };

  const setIconPositioning = (positioning: IconPositioning) => {
    updateIconStyle({ positioning });
  };

  const setIconAnimation = (animation: IconAnimation) => {
    updateIconStyle({ animation });
  };

  const addCustomIcon = (icon: IconDefinition) => {
    setCustomIcons(prev => ({ ...prev, [icon.name]: icon }));
  };

  const removeCustomIcon = (name: string) => {
    setCustomIcons(prev => {
      const newIcons = { ...prev };
      delete newIcons[name];
      return newIcons;
    });
  };

  const mapIcon = (originalName: string, mappedName: string) => {
    setIconMappings(prev => ({ ...prev, [originalName]: mappedName }));
  };

  const getIconColor = (style?: Partial<IconStyle>): string => {
    const iconStyle = style ? { ...currentStyle, ...style } : currentStyle;

    switch (iconStyle.colorTreatment) {
      case IconColorTreatment.THEME:
        return theme.textPrimary;
      case IconColorTreatment.MONOCHROME:
        return theme.textSecondary;
      case IconColorTreatment.ACCENT:
        return theme.primary;
      case IconColorTreatment.SEMANTIC:
        return theme.textPrimary;
      case IconColorTreatment.CUSTOM:
        return theme.textPrimary;
    }
  };

  const getIconSize = (style?: Partial<IconStyle>): number => {
    const iconStyle = style ? { ...currentStyle, ...style } : currentStyle;
    return getIconSizeValue(iconStyle.size);
  };

  const getIcon = (name: string, style?: Partial<IconStyle>): ReactNode => {
    const iconStyle = style ? { ...currentStyle, ...style } : currentStyle;
    const iconName = iconMappings[name] || name;

    // Find the icon definition
    const allIcons = [...defaultIcons, ...Object.values(customIcons)];
    const iconDef = allIcons.find(icon => icon.name === iconName);

    if (!iconDef) {
      return null;
    }

    const color = getIconColor(iconStyle);
    const size = getIconSize(iconStyle);

    return (
      <Text
        style={[
          styles.icon,
          {
            fontSize: size,
            color,
            fontWeight: getFontWeight(iconStyle.weight) as any
          }
        ]}
        accessibilityLabel={iconDef.accessibilityLabel}
      >
        {iconDef.unicode || iconDef.name}
      </Text>
    );
  };

  const getIconsByCategory = (category: IconCategory): IconDefinition[] => {
    return defaultIcons.filter(icon => icon.category === category) ||
           Object.values(customIcons).filter(icon => icon.category === category);
  };

  const searchIcons = (query: string): IconDefinition[] => {
    const allIcons = [...defaultIcons, ...Object.values(customIcons)];
    return allIcons.filter(icon =>
      icon.name.toLowerCase().includes(query.toLowerCase()) ||
      icon.description.toLowerCase().includes(query.toLowerCase()) ||
      icon.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getFontWeight = (weight: IconWeight): string => {
    switch (weight) {
      case IconWeight.ULTRA_LIGHT: return '100';
      case IconWeight.THIN: return '200';
      case IconWeight.LIGHT: return '300';
      case IconWeight.REGULAR: return '400';
      case IconWeight.MEDIUM: return '500';
      case IconWeight.SEMIBOLD: return '600';
      case IconWeight.BOLD: return '700';
      case IconWeight.HEAVY: return '800';
      case IconWeight.BLACK: return '900';
    }
  };

  const contextValue: IconographyContextType = {
    currentStyle,
    customIcons,
    iconMappings,
    updateIconStyle,
    setIconFamily,
    setIconWeight,
    setIconSize,
    setIconColorTreatment,
    setIconPositioning,
    setIconAnimation,
    addCustomIcon,
    removeCustomIcon,
    mapIcon,
    getIcon,
    getIconColor,
    getIconSize,
    getIconsByCategory,
    searchIcons,
    availableFamilies: Object.values(IconFamily),
    availableWeights: Object.values(IconWeight),
    availableSizes: Object.values(IconSize),
    availableColorTreatments: Object.values(IconColorTreatment),
    availablePositionings: Object.values(IconPositioning),
    availableAnimations: Object.values(IconAnimation),
    availableCategories: Object.values(IconCategory)
  };

  return (
    <IconographyContext.Provider value={contextValue}>
      {children}
    </IconographyContext.Provider>
  );
};

// MARK: - Context

const IconographyContext = createContext<IconographyContextType | undefined>(undefined);

export const useIconography = (): IconographyContextType => {
  const context = useContext(IconographyContext);
  if (!context) {
    throw new Error('useIconography must be used within an IconographyProvider');
  }
  return context;
};

// MARK: - Helper Functions

const getSavedIconStyle = async (): Promise<Partial<IconStyle> | null> => {
  // Implement actual storage logic
  return null;
};

const saveIconStyle = async (style: IconStyle): Promise<void> => {
  // Implement actual storage logic
};

// MARK: - Styles

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center'
  }
});

export default IconographyProvider;
