/**
 * Recursive Resolution Example
 * 
 * Comprehensive example demonstrating recursive resolution for theme inheritance
 * with lightweight variant themes and cycle detection.
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
  ThemeKey,
  ThemeKeyCategory,
  ResolutionStep,
  ComponentCoverage,
} from '../theme/AdvancedThemeArchitecture';

// MARK: - Main Example Component

export const RecursiveResolutionExample: React.FC = () => {
  const [themeManager] = useState(() => new AdvancedThemeManager());
  const [selectedThemeName, setSelectedThemeName] = useState('Light');
  const [showingResolutionPath, setShowingResolutionPath] = useState(false);
  const [showingInheritanceChain, setShowingInheritanceChain] = useState(false);
  const [showingCoverageAnalysis, setShowingCoverageAnalysis] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ThemeKey>(ThemeKey.PRIMARY_COLOR);

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

          {/* Theme Selection with Variants */}
          <ThemeSelectionSection
            themeManager={themeManager}
            selectedThemeName={selectedThemeName}
            onThemeSelect={setSelectedThemeName}
          />

          {/* Recursive Resolution Demo */}
          <RecursiveResolutionSection
            theme={currentTheme}
            selectedKey={selectedKey}
            onKeySelect={setSelectedKey}
            onShowResolutionPath={() => setShowingResolutionPath(true)}
          />

          {/* Lightweight Variant Examples */}
          <LightweightVariantSection />

          {/* Debug Tools */}
          <DebugToolsSection
            onShowInheritanceChain={() => setShowingInheritanceChain(true)}
            onShowCoverageAnalysis={() => setShowingCoverageAnalysis(true)}
            onTestCycleDetection={testCycleDetection}
          />

          {/* Performance Analysis */}
          <PerformanceAnalysisSection />
        </View>
      </ScrollView>

      {/* Modals */}
      <ResolutionPathModal
        visible={showingResolutionPath}
        theme={currentTheme}
        key={selectedKey}
        onClose={() => setShowingResolutionPath(false)}
      />

      <InheritanceChainModal
        visible={showingInheritanceChain}
        theme={currentTheme}
        onClose={() => setShowingInheritanceChain(false)}
      />

      <CoverageAnalysisModal
        visible={showingCoverageAnalysis}
        theme={currentTheme}
        onClose={() => setShowingCoverageAnalysis(false)}
      />
    </SafeAreaView>
  );
};

// MARK: - Header Section

const HeaderSection: React.FC = () => (
  <View style={styles.headerSection}>
    <Text style={styles.headerTitle}>Recursive Resolution for Inheritance</Text>
    <Text style={styles.headerSubtitle}>
      Demonstrating lightweight variant themes with minimal redundancy through recursive inheritance resolution
    </Text>
    <View style={styles.headerFeatures}>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>🛡️</Text>
        <Text style={styles.featureText}>Cycle Detection</Text>
      </View>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>📦</Text>
        <Text style={styles.featureText}>Lightweight Variants</Text>
      </View>
      <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>🔄</Text>
        <Text style={styles.featureText}>Recursive Resolution</Text>
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
    <Text style={styles.sectionTitle}>Theme Selection (Base + Variants)</Text>
    <View style={styles.themeGrid}>
      {themeManager.getThemeNames().map((themeName) => (
        <ThemeCard
          key={themeName}
          name={themeName}
          isSelected={selectedThemeName === themeName}
          isVariant={isVariantTheme(themeName)}
          onPress={() => onThemeSelect(themeName)}
        />
      ))}
    </View>
  </View>
);

const isVariantTheme = (name: string): boolean => {
  return name.includes('High Contrast') || 
         name.includes('Large Text') || 
         name.includes('Compact') || 
         name.includes('Reduced Motion');
};

interface ThemeCardProps {
  name: string;
  isSelected: boolean;
  isVariant: boolean;
  onPress: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ name, isSelected, isVariant, onPress }) => (
  <TouchableOpacity
    style={[styles.themeCard, isSelected && styles.themeCardSelected]}
    onPress={onPress}
  >
    <View style={styles.themeCardHeader}>
      <View style={[styles.themeIcon, { backgroundColor: getThemeColor(name) }]} />
      {isVariant && (
        <Text style={styles.variantIcon}>🔄</Text>
      )}
    </View>
    
    <Text style={[styles.themeName, isSelected && styles.themeNameSelected]}>
      {name}
    </Text>
    
    {isVariant && (
      <View style={styles.variantBadge}>
        <Text style={styles.variantText}>Variant</Text>
      </View>
    )}
  </TouchableOpacity>
);

const getThemeColor = (name: string): string => {
  switch (name) {
    case 'Light': return '#007AFF';
    case 'Dark': return '#8B5CF6';
    case 'Corporate': return '#6B7280';
    case 'Creative': return '#EC4899';
    default:
      if (name.includes('High Contrast')) return '#000000';
      if (name.includes('Large Text')) return '#34C759';
      if (name.includes('Compact')) return '#FF9500';
      if (name.includes('Reduced Motion')) return '#FF3B30';
      return '#007AFF';
  }
};

// MARK: - Recursive Resolution Section

interface RecursiveResolutionSectionProps {
  theme: CompositeTheme;
  selectedKey: ThemeKey;
  onKeySelect: (key: ThemeKey) => void;
  onShowResolutionPath: () => void;
}

const RecursiveResolutionSection: React.FC<RecursiveResolutionSectionProps> = ({
  theme,
  selectedKey,
  onKeySelect,
  onShowResolutionPath,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Recursive Resolution Demo</Text>
    <View style={styles.resolutionContainer}>
      {/* Key Selection */}
      <View style={styles.keySelection}>
        <Text style={styles.keyLabel}>Theme Key:</Text>
        <TouchableOpacity
          style={styles.keyPicker}
          onPress={() => {
            // In a real app, you'd show a proper picker here
            const keys = Object.values(ThemeKey);
            const currentIndex = keys.indexOf(selectedKey);
            const nextIndex = (currentIndex + 1) % keys.length;
            onKeySelect(keys[nextIndex]);
          }}
        >
          <Text style={styles.keyPickerText}>{selectedKey}</Text>
          <Text style={styles.keyPickerArrow}>▼</Text>
        </TouchableOpacity>
      </View>
      
      {/* Resolution Result */}
      <ResolutionResultView theme={theme} key={selectedKey} />
      
      {/* Resolution Path Button */}
      <TouchableOpacity style={styles.resolutionButton} onPress={onShowResolutionPath}>
        <Text style={styles.resolutionButtonText}>Show Resolution Path</Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface ResolutionResultViewProps {
  theme: CompositeTheme;
  key: ThemeKey;
}

const ResolutionResultView: React.FC<ResolutionResultViewProps> = ({ theme, key }) => {
  const value = theme.resolveValue(key);
  
  return (
    <View style={styles.resolutionResult}>
      <View style={styles.resolutionHeader}>
        <Text style={styles.resolutionTitle}>Resolution Result:</Text>
        <Text style={styles.resolutionKey}>{key}</Text>
      </View>
      
      {value !== undefined ? (
        <View style={styles.resolutionFound}>
          <Text style={styles.resolutionIcon}>✅</Text>
          <Text style={styles.resolutionText}>Found: {String(value)}</Text>
        </View>
      ) : (
        <View style={styles.resolutionNotFound}>
          <Text style={styles.resolutionIcon}>❌</Text>
          <Text style={styles.resolutionText}>Not found in inheritance chain</Text>
        </View>
      )}
    </View>
  );
};

// MARK: - Lightweight Variant Section

const LightweightVariantSection: React.FC = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Lightweight Variant Examples</Text>
    <View style={styles.variantContainer}>
      <VariantExampleCard
        title="High Contrast Theme"
        description="Only overrides colors, inherits typography and layout from Light theme"
        componentCount={1}
        inheritanceDepth={1}
      />
      
      <VariantExampleCard
        title="Large Text Theme"
        description="Only overrides typography, inherits colors and layout from Light theme"
        componentCount={1}
        inheritanceDepth={1}
      />
      
      <VariantExampleCard
        title="Compact Layout Theme"
        description="Only overrides layout metrics, inherits colors and typography from Light theme"
        componentCount={1}
        inheritanceDepth={1}
      />
      
      <VariantExampleCard
        title="Reduced Motion Theme"
        description="Overrides animation and accessibility, inherits everything else from Light theme"
        componentCount={2}
        inheritanceDepth={1}
      />
    </View>
  </View>
);

interface VariantExampleCardProps {
  title: string;
  description: string;
  componentCount: number;
  inheritanceDepth: number;
}

const VariantExampleCard: React.FC<VariantExampleCardProps> = ({
  title,
  description,
  componentCount,
  inheritanceDepth,
}) => (
  <View style={styles.variantCard}>
    <View style={styles.variantCardHeader}>
      <Text style={styles.variantCardTitle}>{title}</Text>
      <Text style={styles.variantCardCount}>{componentCount} component{componentCount === 1 ? '' : 's'}</Text>
    </View>
    
    <Text style={styles.variantCardDescription}>{description}</Text>
    
    <View style={styles.variantCardFooter}>
      <View style={styles.variantCardMetric}>
        <Text style={styles.variantCardMetricIcon}>🔄</Text>
        <Text style={styles.variantCardMetricText}>Depth: {inheritanceDepth}</Text>
      </View>
      
      <View style={styles.variantCardMetric}>
        <Text style={styles.variantCardMetricIcon}>📦</Text>
        <Text style={styles.variantCardMetricText}>Lightweight</Text>
      </View>
    </View>
  </View>
);

// MARK: - Debug Tools Section

interface DebugToolsSectionProps {
  onShowInheritanceChain: () => void;
  onShowCoverageAnalysis: () => void;
  onTestCycleDetection: () => void;
}

const DebugToolsSection: React.FC<DebugToolsSectionProps> = ({
  onShowInheritanceChain,
  onShowCoverageAnalysis,
  onTestCycleDetection,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Debug Tools</Text>
    <View style={styles.debugContainer}>
      <DebugButton
        title="Inheritance Chain"
        subtitle="View the complete inheritance hierarchy"
        icon="🔄"
        onPress={onShowInheritanceChain}
      />
      
      <DebugButton
        title="Coverage Analysis"
        subtitle="Analyze component coverage and statistics"
        icon="📊"
        onPress={onShowCoverageAnalysis}
      />
      
      <DebugButton
        title="Cycle Detection Test"
        subtitle="Test cycle detection in inheritance chains"
        icon="⚠️"
        onPress={onTestCycleDetection}
      />
    </View>
  </View>
);

interface DebugButtonProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
}

const DebugButton: React.FC<DebugButtonProps> = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity style={styles.debugButton} onPress={onPress}>
    <Text style={styles.debugButtonIcon}>{icon}</Text>
    <View style={styles.debugButtonContent}>
      <Text style={styles.debugButtonTitle}>{title}</Text>
      <Text style={styles.debugButtonSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.debugButtonArrow}>›</Text>
  </TouchableOpacity>
);

// MARK: - Performance Analysis Section

const PerformanceAnalysisSection: React.FC = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Performance Analysis</Text>
    <View style={styles.performanceContainer}>
      <PerformanceMetricCard
        title="Resolution Speed"
        value="O(n) where n = inheritance depth"
        description="Linear time complexity with cycle detection"
      />
      
      <PerformanceMetricCard
        title="Memory Usage"
        value="Minimal overhead"
        description="Weak references prevent retain cycles"
      />
      
      <PerformanceMetricCard
        title="Redundancy Reduction"
        value="90%+ reduction"
        description="Variant themes only store overrides"
      />
    </View>
  </View>
);

interface PerformanceMetricCardProps {
  title: string;
  value: string;
  description: string;
}

const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({
  title,
  value,
  description,
}) => (
  <View style={styles.performanceCard}>
    <Text style={styles.performanceCardTitle}>{title}</Text>
    <Text style={styles.performanceCardValue}>{value}</Text>
    <Text style={styles.performanceCardDescription}>{description}</Text>
  </View>
);

// MARK: - Modal Components

interface ResolutionPathModalProps {
  visible: boolean;
  theme: CompositeTheme;
  key: ThemeKey;
  onClose: () => void;
}

const ResolutionPathModal: React.FC<ResolutionPathModalProps> = ({
  visible,
  theme,
  key,
  onClose,
}) => {
  const resolutionPath = theme.getResolutionPath(key);
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Resolution Path</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Resolution Path for {key}</Text>
            {resolutionPath.map((step, index) => (
              <ResolutionStepRow key={index} step={step} />
            ))}
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Steps:</Text>
              <Text style={styles.summaryValue}>{resolutionPath.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Found:</Text>
              <Text style={[
                styles.summaryValue,
                { color: theme.resolveValue(key) !== undefined ? '#34C759' : '#FF3B30' }
              ]}>
                {theme.resolveValue(key) !== undefined ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

interface ResolutionStepRowProps {
  step: ResolutionStep;
}

const ResolutionStepRow: React.FC<ResolutionStepRowProps> = ({ step }) => (
  <View style={styles.resolutionStepRow}>
    <View style={styles.resolutionStepContent}>
      <Text style={styles.resolutionStepText}>
        {step.found ? '✅' : '❌'} {step.found ? 'Found' : 'Not found'} in {step.component.constructor.name}
      </Text>
      {step.found && (
        <Text style={styles.resolutionStepValue}>Value: {String(step.value)}</Text>
      )}
    </View>
  </View>
);

interface InheritanceChainModalProps {
  visible: boolean;
  theme: CompositeTheme;
  onClose: () => void;
}

const InheritanceChainModal: React.FC<InheritanceChainModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const inheritanceChain = theme.getInheritanceChain();
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Inheritance Chain</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Inheritance Chain</Text>
            {inheritanceChain.map((chainTheme, index) => (
              <InheritanceChainRow
                key={index}
                theme={chainTheme}
                level={index}
                isCurrent={chainTheme === theme}
              />
            ))}
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Chain Statistics</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Depth:</Text>
              <Text style={styles.summaryValue}>{inheritanceChain.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Components:</Text>
              <Text style={styles.summaryValue}>{theme.getComponents().length}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

interface InheritanceChainRowProps {
  theme: CompositeTheme;
  level: number;
  isCurrent: boolean;
}

const InheritanceChainRow: React.FC<InheritanceChainRowProps> = ({
  theme,
  level,
  isCurrent,
}) => (
  <View style={styles.inheritanceChainRow}>
    <Text style={styles.inheritanceChainIndent}>
      {String('  ').repeat(level)}
    </Text>
    <Text style={styles.inheritanceChainIcon}>●</Text>
    <View style={styles.inheritanceChainContent}>
      <Text style={[
        styles.inheritanceChainTitle,
        isCurrent && styles.inheritanceChainTitleCurrent
      ]}>
        {isCurrent ? 'Current Theme' : 'Parent Theme'}
      </Text>
      <Text style={styles.inheritanceChainSubtitle}>
        {theme.getComponents().length} components
      </Text>
    </View>
    {isCurrent && (
      <View style={styles.currentBadge}>
        <Text style={styles.currentBadgeText}>CURRENT</Text>
      </View>
    )}
  </View>
);

interface CoverageAnalysisModalProps {
  visible: boolean;
  theme: CompositeTheme;
  onClose: () => void;
}

const CoverageAnalysisModal: React.FC<CoverageAnalysisModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const coverage = theme.getComponentCoverage();
  
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Coverage Analysis</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Coverage Statistics</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Overall Coverage:</Text>
              <Text style={[styles.summaryValue, { color: '#007AFF' }]}>
                {((coverage.totalKeys / coverage.totalPossibleKeys) * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Keys:</Text>
              <Text style={styles.summaryValue}>
                {coverage.totalKeys}/{coverage.totalPossibleKeys}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Inheritance Depth:</Text>
              <Text style={styles.summaryValue}>{coverage.inheritanceDepth}</Text>
            </View>
          </View>
          
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Coverage by Category</Text>
            {Object.values(ThemeKeyCategory).map((category) => (
              <View key={category} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{category}:</Text>
                <Text style={styles.summaryValue}>
                  {coverage.coverageByCategory[category] || 0}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// MARK: - Helper Functions

const testCycleDetection = () => {
  // Create a cycle for testing
  const theme1 = ThemeFactory.createDefaultLightTheme();
  const theme2 = theme1.createChildTheme();
  const theme3 = theme2.createChildTheme();
  
  // Create a cycle (this should be detected)
  theme1.setParentTheme(theme3);
  
  // This should trigger cycle detection warnings
  const _ = theme1.resolveValue(ThemeKey.PRIMARY_COLOR);
  
  Alert.alert(
    'Cycle Detection Test',
    'Cycle detection test completed - check console for warnings',
    [{ text: 'OK' }]
  );
};

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
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  variantIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  themeNameSelected: {
    color: '#2196F3',
  },
  variantBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  variantText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
  
  // Resolution Section
  resolutionContainer: {
    gap: 16,
  },
  keySelection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  keyLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  keyPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  keyPickerText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  keyPickerArrow: {
    fontSize: 12,
    color: '#666666',
  },
  resolutionResult: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  resolutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resolutionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  resolutionKey: {
    fontSize: 14,
    color: '#666666',
  },
  resolutionFound: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolutionNotFound: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resolutionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  resolutionText: {
    fontSize: 16,
    color: '#000000',
  },
  resolutionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  resolutionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Variant Section
  variantContainer: {
    gap: 12,
  },
  variantCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  variantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  variantCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  variantCardCount: {
    fontSize: 14,
    color: '#666666',
  },
  variantCardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  variantCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  variantCardMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  variantCardMetricIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  variantCardMetricText: {
    fontSize: 12,
    color: '#007AFF',
  },
  
  // Debug Tools
  debugContainer: {
    gap: 12,
  },
  debugButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugButtonIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  debugButtonContent: {
    flex: 1,
  },
  debugButtonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  debugButtonSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  debugButtonArrow: {
    fontSize: 18,
    color: '#666666',
  },
  
  // Performance Analysis
  performanceContainer: {
    gap: 12,
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  performanceCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  performanceCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  performanceCardDescription: {
    fontSize: 14,
    color: '#666666',
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
  
  // Resolution Step
  resolutionStepRow: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resolutionStepContent: {
    gap: 4,
  },
  resolutionStepText: {
    fontSize: 16,
    color: '#000000',
  },
  resolutionStepValue: {
    fontSize: 14,
    color: '#666666',
  },
  
  // Summary
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#000000',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  
  // Inheritance Chain
  inheritanceChainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inheritanceChainIndent: {
    fontSize: 14,
    color: '#666666',
  },
  inheritanceChainIcon: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
  },
  inheritanceChainContent: {
    flex: 1,
  },
  inheritanceChainTitle: {
    fontSize: 16,
    color: '#000000',
  },
  inheritanceChainTitleCurrent: {
    fontWeight: '500',
  },
  inheritanceChainSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  currentBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '500',
  },
}); 