/**
 * Advanced Theme Architecture Example
 * 
 * Comprehensive example demonstrating advanced theming architecture
 * with inheritance and composition using the Composite design pattern.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import {
  AdvancedThemeManager,
  ThemeFactory,
  CompositeTheme,
  ColorPaletteComponent,
  TypographyComponent,
  LayoutMetricsComponent,
  ThemeKey,
  ThemeKeyCategory,
} from '../theme/AdvancedThemeArchitecture';

// MARK: - Main Example Component

export const AdvancedThemeArchitectureExample: React.FC = () => {
  const [themeManager] = useState(() => new AdvancedThemeManager());
  const [selectedThemeName, setSelectedThemeName] = useState('Light');
  const [showingThemeInspector, setShowingThemeInspector] = useState(false);
  const [showingInheritanceDemo, setShowingInheritanceDemo] = useState(false);
  const [showingCompositionDemo, setShowingCompositionDemo] = useState(false);

  useEffect(() => {
    themeManager.switchTheme(selectedThemeName);
  }, [selectedThemeName, themeManager]);

  const currentTheme = themeManager.getCurrentTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header Section */}
          <HeaderSection />

          {/* Theme Selection */}
          <ThemeSelectionSection
            themeManager={themeManager}
            selectedThemeName={selectedThemeName}
            onThemeSelect={setSelectedThemeName}
          />

          {/* Live Preview */}
          <LivePreviewSection currentTheme={currentTheme} />

          {/* Demo Buttons */}
          <DemoButtonsSection
            onShowInspector={() => setShowingThemeInspector(true)}
            onShowInheritance={() => setShowingInheritanceDemo(true)}
            onShowComposition={() => setShowingCompositionDemo(true)}
          />

          {/* Component Examples */}
          <ComponentExamplesSection />

          {/* Inheritance Chain */}
          <InheritanceChainSection currentTheme={currentTheme} />
        </View>
      </ScrollView>

      {/* Modals */}
      <ThemeInspectorModal
        visible={showingThemeInspector}
        themeManager={themeManager}
        onClose={() => setShowingThemeInspector(false)}
      />

      <InheritanceDemoModal
        visible={showingInheritanceDemo}
        themeManager={themeManager}
        onClose={() => setShowingInheritanceDemo(false)}
      />

      <CompositionDemoModal
        visible={showingCompositionDemo}
        themeManager={themeManager}
        onClose={() => setShowingCompositionDemo(false)}
      />
    </SafeAreaView>
  );
};

// MARK: - Header Section

const HeaderSection: React.FC = () => (
  <View style={styles.headerSection}>
    <Text style={styles.headerTitle}>Advanced Theming Architecture</Text>
    <Text style={styles.headerSubtitle}>
      Demonstrating inheritance and composition using the Composite design pattern
    </Text>
    <View style={styles.headerFeatures}>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>📦</Text>
        <Text style={styles.featureText}>Component-Based</Text>
      </View>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>🔄</Text>
        <Text style={styles.featureText}>Inheritance</Text>
      </View>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>🧩</Text>
        <Text style={styles.featureText}>Composition</Text>
      </View>
    </View>
  </View>
);

// MARK: - Theme Selection Section

interface ThemeSelectionSectionProps {
  themeManager: AdvancedThemeManager;
  selectedThemeName: string;
  onThemeSelect: (name: string) => void;
}

const ThemeSelectionSection: React.FC<ThemeSelectionSectionProps> = ({
  themeManager,
  selectedThemeName,
  onThemeSelect,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Theme Selection</Text>
    <View style={styles.themeGrid}>
      {themeManager.getThemeNames().map((themeName) => (
        <ThemeCard
          key={themeName}
          name={themeName}
          isSelected={selectedThemeName === themeName}
          onPress={() => onThemeSelect(themeName)}
        />
      ))}
    </View>
  </View>
);

interface ThemeCardProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ name, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.themeCard, isSelected && styles.themeCardSelected]}
    onPress={onPress}
  >
    <View style={[styles.themeIcon, { backgroundColor: getThemeColor(name) }]} />
    <Text style={[styles.themeName, isSelected && styles.themeNameSelected]}>
      {name}
    </Text>
  </TouchableOpacity>
);

const getThemeColor = (name: string): string => {
  switch (name) {
    case 'Light': return '#007AFF';
    case 'Dark': return '#8B5CF6';
    case 'Corporate': return '#6B7280';
    case 'Creative': return '#EC4899';
    default: return '#007AFF';
  }
};

// MARK: - Live Preview Section

interface LivePreviewSectionProps {
  currentTheme: CompositeTheme;
}

const LivePreviewSection: React.FC<LivePreviewSectionProps> = ({ currentTheme }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Live Preview</Text>
    <View style={styles.previewContainer}>
      <SampleButton />
      <SampleCard />
      <SampleText />
      <SampleProgress />
    </View>
  </View>
);

const SampleButton: React.FC = () => (
  <TouchableOpacity style={styles.sampleButton} onPress={() => Alert.alert('Button Pressed')}>
    <Text style={styles.sampleButtonText}>Sample Button</Text>
  </TouchableOpacity>
);

const SampleCard: React.FC = () => (
  <View style={styles.sampleCard}>
    <Text style={styles.sampleCardTitle}>Sample Card</Text>
    <Text style={styles.sampleCardText}>
      This card demonstrates the current theme's styling applied to various UI elements.
    </Text>
  </View>
);

const SampleText: React.FC = () => (
  <View style={styles.sampleTextContainer}>
    <Text style={styles.sampleTextTitle}>Typography Sample</Text>
    <Text style={styles.sampleTextBody}>
      This demonstrates how typography components are applied across different text styles.
    </Text>
    <Text style={styles.sampleTextCaption}>Caption text with different styling</Text>
  </View>
);

const SampleProgress: React.FC = () => (
  <View style={styles.sampleProgressContainer}>
    <Text style={styles.sampleProgressTitle}>Progress Indicator</Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: '70%' }]} />
    </View>
  </View>
);

// MARK: - Demo Buttons Section

interface DemoButtonsSectionProps {
  onShowInspector: () => void;
  onShowInheritance: () => void;
  onShowComposition: () => void;
}

const DemoButtonsSection: React.FC<DemoButtonsSectionProps> = ({
  onShowInspector,
  onShowInheritance,
  onShowComposition,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Interactive Demos</Text>
    <View style={styles.demoButtonsContainer}>
      <DemoButton
        title="Theme Inspector"
        subtitle="Explore current theme structure"
        icon="🔍"
        onPress={onShowInspector}
      />
      <DemoButton
        title="Inheritance Demo"
        subtitle="See how themes inherit properties"
        icon="🔄"
        onPress={onShowInheritance}
      />
      <DemoButton
        title="Composition Demo"
        subtitle="Build themes from components"
        icon="🧩"
        onPress={onShowComposition}
      />
    </View>
  </View>
);

interface DemoButtonProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

const DemoButton: React.FC<DemoButtonProps> = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity style={styles.demoButton} onPress={onPress}>
    <Text style={styles.demoButtonIcon}>{icon}</Text>
    <View style={styles.demoButtonContent}>
      <Text style={styles.demoButtonTitle}>{title}</Text>
      <Text style={styles.demoButtonSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.demoButtonArrow}>›</Text>
  </TouchableOpacity>
);

// MARK: - Component Examples Section

const ComponentExamplesSection: React.FC = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Component Examples</Text>
    <View style={styles.componentGrid}>
      <ComponentExampleCard
        title="Color Palette"
        description="Primary, secondary, and semantic colors"
        icon="🎨"
        color="#007AFF"
      />
      <ComponentExampleCard
        title="Typography"
        description="Fonts, sizes, and text styles"
        icon="📝"
        color="#34C759"
      />
      <ComponentExampleCard
        title="Layout Metrics"
        description="Spacing, padding, and borders"
        icon="📏"
        color="#FF9500"
      />
      <ComponentExampleCard
        title="Shadows"
        description="Depth and elevation effects"
        icon="🌫️"
        color="#8B5CF6"
      />
    </View>
  </View>
);

interface ComponentExampleCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const ComponentExampleCard: React.FC<ComponentExampleCardProps> = ({
  title,
  description,
  icon,
  color,
}) => (
  <View style={styles.componentCard}>
    <Text style={[styles.componentIcon, { color }]}>{icon}</Text>
    <Text style={styles.componentTitle}>{title}</Text>
    <Text style={styles.componentDescription}>{description}</Text>
  </View>
);

// MARK: - Inheritance Chain Section

interface InheritanceChainSectionProps {
  currentTheme: CompositeTheme;
}

const InheritanceChainSection: React.FC<InheritanceChainSectionProps> = ({ currentTheme }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Inheritance Chain</Text>
    <InheritanceChainView theme={currentTheme} />
  </View>
);

interface InheritanceChainViewProps {
  theme: CompositeTheme;
}

const InheritanceChainView: React.FC<InheritanceChainViewProps> = ({ theme }) => (
  <View style={styles.inheritanceContainer}>
    <View style={styles.inheritanceRow}>
      <Text style={styles.inheritanceLabel}>Current Theme</Text>
      <Text style={styles.inheritanceValue}>
        {theme.getComponents().length} components
      </Text>
    </View>
    
    {theme.getParentTheme() && (
      <>
        <View style={styles.inheritanceArrow}>
          <Text style={styles.inheritanceArrowText}>↓</Text>
          <Text style={styles.inheritanceArrowLabel}>Inherits from parent</Text>
        </View>
        <View style={styles.inheritanceRow}>
          <Text style={styles.inheritanceLabel}>Parent Theme</Text>
          <Text style={styles.inheritanceValue}>
            {theme.getParentTheme()!.getComponents().length} components
          </Text>
        </View>
      </>
    )}
    
    {!theme.getParentTheme() && (
      <View style={styles.inheritanceRow}>
        <Text style={styles.inheritanceLabel}>No parent theme</Text>
      </View>
    )}
  </View>
);

// MARK: - Modal Components

interface ThemeInspectorModalProps {
  visible: boolean;
  themeManager: AdvancedThemeManager;
  onClose: () => void;
}

const ThemeInspectorModal: React.FC<ThemeInspectorModalProps> = ({
  visible,
  themeManager,
  onClose,
}) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Theme Inspector</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCloseButton}>Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalContent}>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>Theme Components</Text>
          {themeManager.getCurrentTheme().getComponents().map((component, index) => (
            <ComponentInspectorRow key={index} component={component} />
          ))}
        </View>
        <View style={styles.modalSection}>
          <Text style={styles.modalSectionTitle}>Available Keys</Text>
          {themeManager.getCurrentTheme().getAllAvailableKeys().map((key) => (
            <KeyInspectorRow
              key={key}
              themeKey={key}
              theme={themeManager.getCurrentTheme()}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

interface ComponentInspectorRowProps {
  component: any;
}

const ComponentInspectorRow: React.FC<ComponentInspectorRowProps> = ({ component }) => (
  <View style={styles.inspectorRow}>
    <Text style={styles.inspectorTitle}>{component.constructor.name}</Text>
    <Text style={styles.inspectorSubtitle}>
      {component.getAvailableKeys().length} keys
    </Text>
  </View>
);

interface KeyInspectorRowProps {
  themeKey: ThemeKey;
  theme: CompositeTheme;
}

const KeyInspectorRow: React.FC<KeyInspectorRowProps> = ({ themeKey, theme }) => (
  <View style={styles.inspectorRow}>
    <View style={styles.keyInspectorContent}>
      <Text style={styles.keyInspectorTitle}>{themeKey}</Text>
      <Text style={styles.keyInspectorCategory}>
        {ThemeKeyCategory[getThemeKeyCategory(themeKey)]}
      </Text>
    </View>
    <Text style={styles.keyInspectorValue}>
      {theme.resolveValue(themeKey)?.toString() || 'Not set'}
    </Text>
  </View>
);

const getThemeKeyCategory = (key: ThemeKey): keyof typeof ThemeKeyCategory => {
  switch (key) {
    case ThemeKey.PRIMARY_COLOR:
    case ThemeKey.SECONDARY_COLOR:
    case ThemeKey.TERTIARY_COLOR:
    case ThemeKey.BACKGROUND_COLOR:
    case ThemeKey.SURFACE_COLOR:
    case ThemeKey.TEXT_COLOR:
    case ThemeKey.SUCCESS_COLOR:
    case ThemeKey.WARNING_COLOR:
    case ThemeKey.ERROR_COLOR:
      return 'COLORS';
    case ThemeKey.PRIMARY_FONT:
    case ThemeKey.BODY_FONT:
    case ThemeKey.HEADING_FONT:
    case ThemeKey.FONT_SIZE:
    case ThemeKey.FONT_WEIGHT:
    case ThemeKey.LINE_HEIGHT:
    case ThemeKey.LETTER_SPACING:
      return 'TYPOGRAPHY';
    case ThemeKey.SPACING:
    case ThemeKey.PADDING:
    case ThemeKey.MARGIN:
    case ThemeKey.BORDER_RADIUS:
    case ThemeKey.GRID_COLUMNS:
    case ThemeKey.GRID_GUTTER:
      return 'LAYOUT';
    case ThemeKey.SHADOW_RADIUS:
    case ThemeKey.SHADOW_OFFSET:
    case ThemeKey.SHADOW_OPACITY:
    case ThemeKey.SHADOW_COLOR:
      return 'SHADOWS';
    case ThemeKey.ANIMATION_DURATION:
    case ThemeKey.ANIMATION_EASING:
    case ThemeKey.SPRING_RESPONSE:
    case ThemeKey.SPRING_DAMPING:
      return 'ANIMATIONS';
    case ThemeKey.HIGH_CONTRAST:
    case ThemeKey.REDUCED_MOTION:
    case ThemeKey.DYNAMIC_TYPE:
      return 'ACCESSIBILITY';
  }
};

interface InheritanceDemoModalProps {
  visible: boolean;
  themeManager: AdvancedThemeManager;
  onClose: () => void;
}

const InheritanceDemoModal: React.FC<InheritanceDemoModalProps> = ({
  visible,
  themeManager,
  onClose,
}) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Inheritance Demo</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCloseButton}>Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.demoDescription}>
          This demo shows how themes can inherit properties from parent themes, creating a hierarchy of styling.
        </Text>
        <InheritanceDemoContent />
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

const InheritanceDemoContent: React.FC = () => {
  // Create a parent theme
  const parentTheme = ThemeFactory.createDefaultLightTheme();
  
  // Create a child theme that inherits from parent
  const childTheme = parentTheme.createChildTheme([
    new ColorPaletteComponent({
      [ThemeKey.PRIMARY_COLOR]: '#FF0000',
      [ThemeKey.SECONDARY_COLOR]: '#FFA500',
    }),
  ]);

  return (
    <View style={styles.demoContent}>
      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>Parent Theme</Text>
        <ThemePreviewCard theme={parentTheme} />
      </View>
      
      <View style={styles.demoArrow}>
        <Text style={styles.demoArrowText}>↓</Text>
      </View>
      
      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>Child Theme (Inherits + Overrides)</Text>
        <ThemePreviewCard theme={childTheme} />
      </View>
    </View>
  );
};

interface CompositionDemoModalProps {
  visible: boolean;
  themeManager: AdvancedThemeManager;
  onClose: () => void;
}

const CompositionDemoModal: React.FC<CompositionDemoModalProps> = ({
  visible,
  themeManager,
  onClose,
}) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
    <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Composition Demo</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalCloseButton}>Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.modalContent}>
        <Text style={styles.demoDescription}>
          This demo shows how themes can be built by composing multiple components together.
        </Text>
        <CompositionDemoContent />
      </ScrollView>
    </SafeAreaView>
  </Modal>
);

const CompositionDemoContent: React.FC = () => {
  // Create individual components
  const colorComponent = new ColorPaletteComponent({
    [ThemeKey.PRIMARY_COLOR]: '#8B5CF6',
    [ThemeKey.SECONDARY_COLOR]: '#EC4899',
    [ThemeKey.BACKGROUND_COLOR]: '#FAF5FF',
  });
  
  const typographyComponent = new TypographyComponent({
    [ThemeKey.PRIMARY_FONT]: 'Avenir',
    [ThemeKey.FONT_SIZE]: 18,
    [ThemeKey.FONT_WEIGHT]: 'Medium',
  });
  
  const layoutComponent = new LayoutMetricsComponent({
    [ThemeKey.SPACING]: 16,
    [ThemeKey.PADDING]: 20,
    [ThemeKey.BORDER_RADIUS]: 12,
  });

  return (
    <View style={styles.demoContent}>
      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>Individual Components</Text>
        <ComponentPreviewCard component={colorComponent} title="Color Palette" />
        <ComponentPreviewCard component={typographyComponent} title="Typography" />
        <ComponentPreviewCard component={layoutComponent} title="Layout Metrics" />
      </View>
      
      <View style={styles.demoArrow}>
        <Text style={styles.demoArrowText}>+</Text>
      </View>
      
      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>Composed Theme</Text>
        <ThemePreviewCard
          theme={new CompositeTheme([colorComponent, typographyComponent, layoutComponent])}
        />
      </View>
    </View>
  );
};

// MARK: - Preview Cards

interface ThemePreviewCardProps {
  theme: CompositeTheme;
}

const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({ theme }) => (
  <View style={styles.previewCard}>
    <View style={styles.previewCardRow}>
      <Text style={styles.previewCardLabel}>Components: {theme.getComponents().length}</Text>
      <Text style={styles.previewCardValue}>Keys: {theme.getAllAvailableKeys().length}</Text>
    </View>
    {theme.getParentTheme() && (
      <Text style={styles.previewCardInheritance}>Has parent theme</Text>
    )}
  </View>
);

interface ComponentPreviewCardProps {
  component: any;
  title: string;
}

const ComponentPreviewCard: React.FC<ComponentPreviewCardProps> = ({ component, title }) => (
  <View style={styles.componentPreviewCard}>
    <Text style={styles.componentPreviewTitle}>{title}</Text>
    <Text style={styles.componentPreviewValue}>
      {component.getAvailableKeys().length} keys
    </Text>
  </View>
);

// MARK: - Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  
  // Header Section
  headerSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  headerFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  
  // Theme Selection
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  themeCardSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  themeNameSelected: {
    color: '#2196F3',
  },
  
  // Live Preview
  previewContainer: {
    gap: 16,
  },
  sampleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  sampleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  sampleCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sampleCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sampleCardText: {
    fontSize: 16,
    color: '#666666',
  },
  sampleTextContainer: {
    gap: 8,
  },
  sampleTextTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  sampleTextBody: {
    fontSize: 16,
    color: '#000000',
  },
  sampleTextCaption: {
    fontSize: 14,
    color: '#666666',
  },
  sampleProgressContainer: {
    gap: 8,
  },
  sampleProgressTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  
  // Demo Buttons
  demoButtonsContainer: {
    gap: 12,
  },
  demoButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  demoButtonContent: {
    flex: 1,
  },
  demoButtonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  demoButtonSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  demoButtonArrow: {
    fontSize: 18,
    color: '#666666',
  },
  
  // Component Examples
  componentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  componentCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: 150,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  componentIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  componentDescription: {
    fontSize: 14,
    color: '#666666',
  },
  
  // Inheritance Chain
  inheritanceContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  inheritanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inheritanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  inheritanceValue: {
    fontSize: 14,
    color: '#666666',
  },
  inheritanceArrow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  inheritanceArrowText: {
    fontSize: 20,
    color: '#007AFF',
  },
  inheritanceArrowLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  demoDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  
  // Inspector
  inspectorRow: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  inspectorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  inspectorSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  keyInspectorContent: {
    flex: 1,
  },
  keyInspectorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  keyInspectorCategory: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  keyInspectorValue: {
    fontSize: 14,
    color: '#666666',
  },
  
  // Demo Content
  demoContent: {
    gap: 16,
  },
  demoSection: {
    gap: 12,
  },
  demoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  demoArrow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  demoArrowText: {
    fontSize: 24,
    color: '#007AFF',
  },
  
  // Preview Cards
  previewCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  previewCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  previewCardValue: {
    fontSize: 14,
    color: '#666666',
  },
  previewCardInheritance: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
  componentPreviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentPreviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  componentPreviewValue: {
    fontSize: 14,
    color: '#666666',
  },
}); 