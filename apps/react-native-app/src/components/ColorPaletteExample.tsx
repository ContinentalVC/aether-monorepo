//
//  ColorPaletteExample.tsx
//  Aether React Native App
//
//  Example usage of the comprehensive color palette selection system
//  demonstrating color wheel tools, harmonious color schemes, and validation.
//

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ColorPaletteProvider,
  useColorPalette,
  ColorHarmonyType,
  PredefinedPalettes,
} from './ColorPaletteManager';
import ColorPaletteSelectionScreen from './ColorPaletteSelectionScreen';

const { width: screenWidth } = Dimensions.get('window');

// MARK: - Main Color Palette Example

export const ColorPaletteExample: React.FC = () => {
  return (
    <ColorPaletteProvider>
      <ColorPaletteExampleContent />
    </ColorPaletteProvider>
  );
};

const ColorPaletteExampleContent: React.FC = () => {
  const [showingColorPaletteSelection, setShowingColorPaletteSelection] = useState(false);
  
  const {
    currentPalette,
    selectedHarmonyType,
    updateBaseColor,
    updateHarmonyType,
    setPredefinedPalette,
    currentValidation,
    predefinedPalettes,
    harmonyTypes,
  } = useColorPalette();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <ColorPaletteHeader />
      
      {/* Current Palette Display */}
      <CurrentPaletteDisplay />
      
      {/* Quick Actions */}
      <QuickActionsSection />
      
      {/* Validation Status */}
      <ValidationStatusSection />
      
      {/* Predefined Palettes Preview */}
      <PredefinedPalettesPreview />
      
      {/* Color Harmony Examples */}
      <ColorHarmonyExamples />
      
      {/* Integration Example */}
      <ThemeIntegrationExample />
      
      {/* Customize Button */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => setShowingColorPaletteSelection(true)}
      >
        <Ionicons name="color-palette" size={20} color="#FFFFFF" />
        <Text style={styles.customizeButtonText}>Customize Palette</Text>
      </TouchableOpacity>
      
      {/* Color Palette Selection Modal */}
      {showingColorPaletteSelection && (
        <ColorPaletteSelectionScreen />
      )}
    </ScrollView>
  );
};

// MARK: - Color Palette Header

const ColorPaletteHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Ionicons name="color-palette" size={48} color="#007AFF" />
      <Text style={styles.headerTitle}>Color Palette Manager</Text>
      <Text style={styles.headerDescription}>
        Create harmonious and accessible color schemes with guided tools
      </Text>
    </View>
  );
};

// MARK: - Current Palette Display

const CurrentPaletteDisplay: React.FC = () => {
  const { currentPalette } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Current Palette</Text>
      
      <View style={styles.paletteDisplay}>
        {/* Color swatches */}
        <View style={styles.colorSwatchesGrid}>
          <ColorSwatchLarge color={currentPalette.primary} label="Primary" />
          <ColorSwatchLarge color={currentPalette.secondary} label="Secondary" />
          {currentPalette.accent && (
            <ColorSwatchLarge color={currentPalette.accent} label="Accent" />
          )}
          <ColorSwatchLarge color={currentPalette.neutral} label="Neutral" />
          <ColorSwatchLarge color={currentPalette.neutralLight} label="Light" />
          <ColorSwatchLarge color={currentPalette.neutralDark} label="Dark" />
        </View>
        
        {/* Palette info */}
        <View style={styles.paletteInfo}>
          <View style={styles.paletteHeader}>
            <Text style={styles.paletteName}>{currentPalette.name}</Text>
            <Ionicons name="color-palette" size={20} color="#007AFF" />
          </View>
          
          <Text style={styles.paletteDescription}>
            {currentPalette.description}
          </Text>
          
          <View style={styles.harmonyTypeBadge}>
            <Text style={styles.harmonyTypeText}>
              {currentPalette.harmonyType}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface ColorSwatchLargeProps {
  color: string;
  label: string;
}

const ColorSwatchLarge: React.FC<ColorSwatchLargeProps> = ({ color, label }) => {
  return (
    <View style={styles.colorSwatchLarge}>
      <View style={[styles.colorSwatchLargeBox, { backgroundColor: color }]} />
      <Text style={styles.colorSwatchLargeLabel}>{label}</Text>
    </View>
  );
};

// MARK: - Quick Actions Section

const QuickActionsSection: React.FC = () => {
  const { updateBaseColor, setPredefinedPalette } = useColorPalette();

  const generateRandomPalette = () => {
    const randomHue = Math.random() * 360;
    const randomColor = `hsl(${randomHue}, 70%, 50%)`;
    updateBaseColor(randomColor);
  };

  const resetToDefault = () => {
    setPredefinedPalette(PredefinedPalettes[0]);
  };

  const exportPalette = () => {
    Alert.alert('Export Palette', 'Palette export functionality would be implemented here');
  };

  const importPalette = () => {
    Alert.alert('Import Palette', 'Palette import functionality would be implemented here');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.quickActionsGrid}>
        <QuickActionButton
          title="Random Palette"
          icon="dice"
          color="#007AFF"
          onPress={generateRandomPalette}
        />
        
        <QuickActionButton
          title="Reset to Default"
          icon="refresh"
          color="#FF9500"
          onPress={resetToDefault}
        />
        
        <QuickActionButton
          title="Export Palette"
          icon="share"
          color="#34C759"
          onPress={exportPalette}
        />
        
        <QuickActionButton
          title="Import Palette"
          icon="download"
          color="#AF52DE"
          onPress={importPalette}
        />
      </View>
    </View>
  );
};

interface QuickActionButtonProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.quickActionButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// MARK: - Validation Status Section

const ValidationStatusSection: React.FC = () => {
  const { currentValidation } = useColorPalette();

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#34C759';
    if (score >= 60) return '#FF9500';
    return '#FF3B30';
  };

  const getScoreDescription = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Validation Status</Text>
      
      <View style={styles.validationStatus}>
        {/* Score indicator */}
        <View style={styles.validationScore}>
          <View style={styles.validationScoreLeft}>
            <Text style={styles.validationScoreLabel}>Overall Score</Text>
            <Text style={[styles.validationScoreValue, { color: getScoreColor(currentValidation.score) }]}>
              {currentValidation.score}
            </Text>
            <Text style={styles.validationScoreMax}>/100</Text>
          </View>
          
          <View style={styles.validationScoreRight}>
            <Text style={styles.validationScoreLabel}>Status</Text>
            <Text style={[styles.validationScoreDescription, { color: getScoreColor(currentValidation.score) }]}>
              {getScoreDescription(currentValidation.score)}
            </Text>
          </View>
        </View>
        
        {/* Validation details */}
        <View style={styles.validationDetails}>
          <ValidationDetailRow
            title="Contrast"
            isPassing={currentValidation.hasGoodContrast}
            description="Colors have sufficient contrast for accessibility"
          />
          
          <ValidationDetailRow
            title="Harmony"
            isPassing={currentValidation.isHarmonious}
            description="Colors follow the selected harmony type"
          />
          
          <ValidationDetailRow
            title="Saturation"
            isPassing={currentValidation.hasBalancedSaturation}
            description="Colors have balanced saturation levels"
          />
        </View>
      </View>
    </View>
  );
};

interface ValidationDetailRowProps {
  title: string;
  isPassing: boolean;
  description: string;
}

const ValidationDetailRow: React.FC<ValidationDetailRowProps> = ({
  title,
  isPassing,
  description,
}) => {
  return (
    <View style={styles.validationDetailRow}>
      <Ionicons
        name={isPassing ? 'checkmark-circle' : 'close-circle'}
        size={20}
        color={isPassing ? '#34C759' : '#FF3B30'}
      />
      
      <View style={styles.validationDetailContent}>
        <Text style={styles.validationDetailTitle}>{title}</Text>
        <Text style={styles.validationDetailDescription}>{description}</Text>
      </View>
    </View>
  );
};

// MARK: - Predefined Palettes Preview

const PredefinedPalettesPreview: React.FC = () => {
  const { setPredefinedPalette, currentPalette } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Predefined Palettes</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.predefinedPalettesContainer}>
          {PredefinedPalettes.map((palette) => (
            <PredefinedPaletteCard
              key={palette.name}
              palette={palette}
              isSelected={currentPalette.name === palette.name}
              onSelect={() => setPredefinedPalette(palette)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

interface PredefinedPaletteCardProps {
  palette: any;
  isSelected: boolean;
  onSelect: () => void;
}

const PredefinedPaletteCard: React.FC<PredefinedPaletteCardProps> = ({
  palette,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.predefinedPaletteCard,
        isSelected && styles.predefinedPaletteCardActive,
      ]}
      onPress={onSelect}
    >
      {/* Color swatches */}
      <View style={styles.predefinedPaletteSwatches}>
        {[palette.primary, palette.secondary, palette.neutral].map((color, index) => (
          <View
            key={index}
            style={[styles.predefinedPaletteSwatch, { backgroundColor: color }]}
          />
        ))}
      </View>
      
      {/* Palette info */}
      <View style={styles.predefinedPaletteInfo}>
        <View style={styles.predefinedPaletteHeader}>
          <Text style={styles.predefinedPaletteName}>{palette.name}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          )}
        </View>
        
        <Text style={styles.predefinedPaletteDescription}>
          {palette.description}
        </Text>
        
        <View style={styles.predefinedPaletteHarmony}>
          <Ionicons name="color-palette" size={16} color="#666" />
          <Text style={styles.predefinedPaletteHarmonyText}>
            {palette.harmonyType}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// MARK: - Color Harmony Examples

const ColorHarmonyExamples: React.FC = () => {
  const { harmonyTypes } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Harmony Examples</Text>
      
      <View style={styles.harmonyExamplesGrid}>
        {harmonyTypes.map((harmonyType) => (
          <HarmonyExampleCard key={harmonyType} harmonyType={harmonyType} />
        ))}
      </View>
    </View>
  );
};

interface HarmonyExampleCardProps {
  harmonyType: ColorHarmonyType;
}

const HarmonyExampleCard: React.FC<HarmonyExampleCardProps> = ({ harmonyType }) => {
  const getHarmonyIcon = (type: ColorHarmonyType): string => {
    switch (type) {
      case ColorHarmonyType.COMPLEMENTARY:
        return 'contrast';
      case ColorHarmonyType.TRIADIC:
        return 'triangle';
      case ColorHarmonyType.ANALOGOUS:
        return 'arrow-forward';
      case ColorHarmonyType.MONOCHROMATIC:
        return 'radio-button-on';
      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        return 'git-branch';
      case ColorHarmonyType.TETRADIC:
        return 'grid';
      default:
        return 'color-palette';
    }
  };

  const getHarmonyDescription = (type: ColorHarmonyType): string => {
    switch (type) {
      case ColorHarmonyType.COMPLEMENTARY:
        return 'Two opposite colors on the color wheel';
      case ColorHarmonyType.TRIADIC:
        return 'Three evenly spaced colors on the color wheel';
      case ColorHarmonyType.ANALOGOUS:
        return 'Colors that are next to each other on the color wheel';
      case ColorHarmonyType.MONOCHROMATIC:
        return 'Different shades and tints of the same color';
      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        return 'One base color and two colors adjacent to its complement';
      case ColorHarmonyType.TETRADIC:
        return 'Two pairs of complementary colors';
    }
  };

  // Example colors for each harmony type
  const getExampleColors = (type: ColorHarmonyType): string[] => {
    switch (type) {
      case ColorHarmonyType.COMPLEMENTARY:
        return ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      case ColorHarmonyType.TRIADIC:
        return ['#FF6B6B', '#4ECDC4', '#96CEB4'];
      case ColorHarmonyType.ANALOGOUS:
        return ['#FF6B6B', '#FF8E8E', '#FFB3B3'];
      case ColorHarmonyType.MONOCHROMATIC:
        return ['#FF6B6B', '#FF8E8E', '#FFB3B3'];
      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        return ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      case ColorHarmonyType.TETRADIC:
        return ['#FF6B6B', '#4ECDC4', '#96CEB4', '#FFE66D'];
    }
  };

  return (
    <View style={styles.harmonyExampleCard}>
      {/* Header */}
      <View style={styles.harmonyExampleHeader}>
        <Ionicons name={getHarmonyIcon(harmonyType) as any} size={20} color="#007AFF" />
        <Text style={styles.harmonyExampleTitle}>{harmonyType}</Text>
      </View>
      
      {/* Color preview */}
      <View style={styles.harmonyExampleColors}>
        {getExampleColors(harmonyType).slice(0, 3).map((color, index) => (
          <View
            key={index}
            style={[styles.harmonyExampleColor, { backgroundColor: color }]}
          />
        ))}
      </View>
      
      {/* Description */}
      <Text style={styles.harmonyExampleDescription}>
        {getHarmonyDescription(harmonyType)}
      </Text>
    </View>
  );
};

// MARK: - Theme Integration Example

const ThemeIntegrationExample: React.FC = () => {
  const { currentPalette } = useColorPalette();

  const applyPaletteToAppTheme = () => {
    Alert.alert(
      'Apply Palette',
      `This palette (${currentPalette.name}) will be applied to your app's theme. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => console.log('Applied palette:', currentPalette.name) },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Theme Integration</Text>
      
      <View style={styles.themeIntegration}>
        {/* Example UI using the current palette */}
        <View style={styles.exampleUI}>
          <Text style={styles.exampleUITitle}>Example UI</Text>
          
          <View style={styles.exampleButtons}>
            <TouchableOpacity
              style={[styles.exampleButton, { backgroundColor: currentPalette.primary }]}
            >
              <Text style={styles.exampleButtonText}>Primary Action</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.exampleButtonSecondary, { borderColor: currentPalette.secondary }]}
            >
              <Text style={[styles.exampleButtonTextSecondary, { color: currentPalette.secondary }]}>
                Secondary Action
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.exampleCard, { backgroundColor: currentPalette.neutralLight }]}>
            <Text style={[styles.exampleCardTitle, { color: currentPalette.primary }]}>
              Example Card
            </Text>
            <Text style={styles.exampleCardText}>
              This card demonstrates how the palette colors can be used throughout your app's UI.
            </Text>
          </View>
        </View>
        
        {/* Apply button */}
        <TouchableOpacity
          style={styles.applyThemeButton}
          onPress={applyPaletteToAppTheme}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.applyThemeButtonText}>Apply to App Theme</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// MARK: - Usage Instructions Component

const UsageInstructions: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Usage Instructions</Text>
      
      <View style={styles.instructionsContainer}>
        <InstructionItem
          number="1"
          title="Basic Integration"
          description="Add ColorPaletteProvider to your app root and use useColorPalette hook"
        />
        
        <InstructionItem
          number="2"
          title="Quick Palette Changes"
          description="Use setPredefinedPalette() for quick changes or updateBaseColor() for custom colors"
        />
        
        <InstructionItem
          number="3"
          title="Validation"
          description="Check currentValidation.score for overall quality and accessibility compliance"
        />
        
        <InstructionItem
          number="4"
          title="Custom Integration"
          description="Apply palette colors to your app's theme system and UI components"
        />
        
        <InstructionItem
          number="5"
          title="Best Practices"
          description="Always validate palettes, provide fallback colors, and test in light/dark modes"
        />
      </View>
    </View>
  );
};

interface InstructionItemProps {
  number: string;
  title: string;
  description: string;
}

const InstructionItem: React.FC<InstructionItemProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <View style={styles.instructionItem}>
      <View style={styles.instructionNumber}>
        <Text style={styles.instructionNumberText}>{number}</Text>
      </View>
      
      <View style={styles.instructionContent}>
        <Text style={styles.instructionTitle}>{title}</Text>
        <Text style={styles.instructionDescription}>{description}</Text>
      </View>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  paletteDisplay: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
  },
  colorSwatchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorSwatchLarge: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
  },
  colorSwatchLargeBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  colorSwatchLargeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  paletteInfo: {
    gap: 8,
  },
  paletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paletteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paletteDescription: {
    fontSize: 14,
    color: '#666',
  },
  harmonyTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  harmonyTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: (screenWidth - 52) / 2,
  },
  quickActionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  validationStatus: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
  },
  validationScore: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  validationScoreLeft: {
    alignItems: 'flex-start',
  },
  validationScoreRight: {
    alignItems: 'flex-end',
  },
  validationScoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  validationScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  validationScoreMax: {
    fontSize: 14,
    color: '#666',
  },
  validationScoreDescription: {
    fontSize: 16,
    fontWeight: '600',
  },
  validationDetails: {
    gap: 8,
  },
  validationDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  validationDetailContent: {
    marginLeft: 12,
    flex: 1,
  },
  validationDetailTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  validationDetailDescription: {
    fontSize: 12,
    color: '#666',
  },
  predefinedPalettesContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 4,
  },
  predefinedPaletteCard: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    width: 200,
  },
  predefinedPaletteCardActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  predefinedPaletteSwatches: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  predefinedPaletteSwatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  predefinedPaletteInfo: {
    gap: 4,
  },
  predefinedPaletteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predefinedPaletteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  predefinedPaletteDescription: {
    fontSize: 14,
    color: '#666',
  },
  predefinedPaletteHarmony: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  predefinedPaletteHarmonyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  harmonyExamplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  harmonyExampleCard: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    width: (screenWidth - 52) / 2,
  },
  harmonyExampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  harmonyExampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  harmonyExampleColors: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  harmonyExampleColor: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  harmonyExampleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  themeIntegration: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
  },
  exampleUI: {
    marginBottom: 16,
  },
  exampleUITitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  exampleButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exampleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  exampleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  exampleButtonSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  exampleButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  exampleCard: {
    padding: 16,
    borderRadius: 12,
  },
  exampleCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exampleCardText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  applyThemeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  applyThemeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  customizeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  instructionsContainer: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default ColorPaletteExample; 