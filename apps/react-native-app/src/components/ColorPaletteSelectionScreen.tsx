//
//  ColorPaletteSelectionScreen.tsx
//  Aether React Native App
//
//  Comprehensive color palette selection interface with color wheel tools,
//  harmonious color schemes, and validation to guide users toward
//  professional and accessible color choices.
//

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  ColorPaletteProvider,
  useColorPalette,
  ColorWheel,
  ColorHarmonyType,
  PredefinedPalettes
} from './ColorPaletteManager';

const { width: screenWidth } = Dimensions.get('window');

// MARK: - Main Color Palette Selection Screen

export const ColorPaletteSelectionScreen: React.FC = () => {
  return (
    <ColorPaletteProvider>
      <ColorPaletteContent />
    </ColorPaletteProvider>
  );
};

const ColorPaletteContent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showingHarmonyGuide, setShowingHarmonyGuide] = useState(false);
  const [showingValidationGuide, setShowingValidationGuide] = useState(false);

  const {
    currentPalette,
    selectedHarmonyType,
    baseColor,
    updateBaseColor,
    updateHarmonyType,
    setPredefinedPalette,
    currentValidation,
    predefinedPalettes,
    harmonyTypes
  } = useColorPalette();

  const handleApplyPalette = () => {
    Alert.alert(
      'Apply Palette',
      'This palette will be applied to your theme. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Apply', onPress: () => console.log('Palette applied') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Color Palette</Text>
        <TouchableOpacity onPress={handleApplyPalette} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <ColorPaletteTabSelector
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 0 && <ColorWheelTab />}
        {selectedTab === 1 && <PredefinedPalettesTab />}
        {selectedTab === 2 && <HarmonyTypesTab />}
        {selectedTab === 3 && <ValidationTab />}
      </ScrollView>

      {/* Guide Modals */}
      {showingHarmonyGuide && (
        <ColorHarmonyGuideModal onClose={() => setShowingHarmonyGuide(false)} />
      )}
      {showingValidationGuide && (
        <ColorValidationGuideModal onClose={() => setShowingValidationGuide(false)} />
      )}
    </View>
  );
};

// MARK: - Tab Selector

interface ColorPaletteTabSelectorProps {
  selectedTab: number;
  onTabChange: (tab: number) => void;
}

const ColorPaletteTabSelector: React.FC<ColorPaletteTabSelectorProps> = ({
  selectedTab,
  onTabChange
}) => {
  const tabs = ['Color Wheel', 'Predefined', 'Harmony', 'Validation'];

  return (
    <View style={styles.tabSelector}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, selectedTab === index && styles.tabButtonActive]}
          onPress={() => onTabChange(index)}
        >
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === index && styles.tabButtonTextActive
            ]}
          >
            {tab}
          </Text>
          {selectedTab === index && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// MARK: - Color Wheel Tab

const ColorWheelTab: React.FC = () => {
  const { baseColor, updateBaseColor, currentPalette, selectedHarmonyType, updateHarmonyType } = useColorPalette();

  return (
    <View style={styles.tabContent}>
      {/* Color Wheel Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Wheel</Text>

        <View style={styles.colorWheelContainer}>
          <ColorWheel
            selectedColor={baseColor}
            onColorChange={updateBaseColor}
            size={280}
          />

          {/* Color Info */}
          <ColorInfoDisplay color={baseColor} />
        </View>
      </View>

      {/* Current Palette Preview */}
      <CurrentPalettePreview />

      {/* Harmony Type Selector */}
      <HarmonyTypeSelector />

      {/* Color Guidance */}
      <ColorGuidanceSection />
    </View>
  );
};

// MARK: - Color Info Display

interface ColorInfoDisplayProps {
  color: string;
}

const ColorInfoDisplay: React.FC<ColorInfoDisplayProps> = ({ color }) => {
  const hsl = useColorPalette().currentPalette.primary; // This would need proper HSL conversion

  return (
    <View style={styles.colorInfoContainer}>
      <View style={styles.colorInfoItem}>
        <Text style={styles.colorInfoLabel}>Selected Color</Text>
        <Text style={styles.colorInfoValue}>360°</Text>
      </View>

      <View style={styles.colorInfoItem}>
        <Text style={styles.colorInfoLabel}>Saturation</Text>
        <Text style={styles.colorInfoValue}>100%</Text>
      </View>

      <View style={styles.colorInfoItem}>
        <Text style={styles.colorInfoLabel}>Lightness</Text>
        <Text style={styles.colorInfoValue}>50%</Text>
      </View>
    </View>
  );
};

// MARK: - Current Palette Preview

const CurrentPalettePreview: React.FC = () => {
  const { currentPalette } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Generated Palette</Text>

      <View style={styles.palettePreview}>
        {/* Color Swatches */}
        <View style={styles.colorSwatches}>
          <ColorSwatch color={currentPalette.primary} label="Primary" />
          <ColorSwatch color={currentPalette.secondary} label="Secondary" />
          {currentPalette.accent && (
            <ColorSwatch color={currentPalette.accent} label="Accent" />
          )}
          <ColorSwatch color={currentPalette.neutral} label="Neutral" />
          <ColorSwatch color={currentPalette.neutralLight} label="Light" />
          <ColorSwatch color={currentPalette.neutralDark} label="Dark" />
        </View>

        {/* Palette Info */}
        <View style={styles.paletteInfo}>
          <Text style={styles.paletteName}>{currentPalette.name}</Text>
          <Text style={styles.paletteDescription}>{currentPalette.description}</Text>
          <View style={styles.harmonyTypeInfo}>
            <Ionicons name="color-palette" size={16} color="#666" />
            <Text style={styles.harmonyTypeText}>{currentPalette.harmonyType}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// MARK: - Color Swatch

interface ColorSwatchProps {
  color: string;
  label: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, label }) => {
  return (
    <View style={styles.colorSwatch}>
      <View style={[styles.colorSwatchBox, { backgroundColor: color }]} />
      <Text style={styles.colorSwatchLabel}>{label}</Text>
    </View>
  );
};

// MARK: - Harmony Type Selector

const HarmonyTypeSelector: React.FC = () => {
  const { selectedHarmonyType, updateHarmonyType, harmonyTypes } = useColorPalette();

  const getHarmonyIcon = (harmonyType: ColorHarmonyType): string => {
    switch (harmonyType) {
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

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Harmony Type</Text>

      <View style={styles.harmonyGrid}>
        {harmonyTypes.map((harmonyType) => (
          <TouchableOpacity
            key={harmonyType}
            style={[
              styles.harmonyCard,
              selectedHarmonyType === harmonyType && styles.harmonyCardActive
            ]}
            onPress={() => updateHarmonyType(harmonyType)}
          >
            <Ionicons
              name={getHarmonyIcon(harmonyType) as any}
              size={24}
              color={selectedHarmonyType === harmonyType ? '#FFFFFF' : '#333'}
            />
            <Text
              style={[
                styles.harmonyCardTitle,
                selectedHarmonyType === harmonyType && styles.harmonyCardTitleActive
              ]}
            >
              {harmonyType}
            </Text>
            <Text
              style={[
                styles.harmonyCardDescription,
                selectedHarmonyType === harmonyType && styles.harmonyCardDescriptionActive
              ]}
              numberOfLines={2}
            >
              {getHarmonyDescription(harmonyType)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getHarmonyDescription = (harmonyType: ColorHarmonyType): string => {
  switch (harmonyType) {
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

// MARK: - Color Guidance Section

const ColorGuidanceSection: React.FC = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Color Guidelines</Text>

      <View style={styles.guidanceContainer}>
        <ColorGuidanceTip
          icon="paintbrush"
          title="Limit Your Palette"
          description="Use 2-3 main colors plus neutrals for consistency"
        />

        <ColorGuidanceTip
          icon="eye"
          title="Consider Contrast"
          description="Ensure sufficient contrast for accessibility"
        />

        <ColorGuidanceTip
          icon="color-palette"
          title="Follow Harmony"
          description="Use color theory to create pleasing combinations"
        />
      </View>
    </View>
  );
};

interface ColorGuidanceTipProps {
  icon: string;
  title: string;
  description: string;
}

const ColorGuidanceTip: React.FC<ColorGuidanceTipProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <View style={styles.guidanceTip}>
      <Ionicons name={icon as any} size={20} color="#007AFF" />
      <View style={styles.guidanceTipContent}>
        <Text style={styles.guidanceTipTitle}>{title}</Text>
        <Text style={styles.guidanceTipDescription}>{description}</Text>
      </View>
    </View>
  );
};

// MARK: - Predefined Palettes Tab

const PredefinedPalettesTab: React.FC = () => {
  const { setPredefinedPalette, currentPalette } = useColorPalette();

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Predefined Palettes</Text>

      <View style={styles.predefinedPalettesList}>
        {PredefinedPalettes.map((palette) => (
          <PredefinedPaletteCard
            key={palette.name}
            palette={palette}
            isSelected={currentPalette.name === palette.name}
            onSelect={() => setPredefinedPalette(palette)}
          />
        ))}
      </View>
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
  onSelect
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.predefinedPaletteCard,
        isSelected && styles.predefinedPaletteCardActive
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
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
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

// MARK: - Harmony Types Tab

const HarmonyTypesTab: React.FC = () => {
  const { selectedHarmonyType, updateHarmonyType, harmonyTypes } = useColorPalette();

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Color Harmony Types</Text>

      <View style={styles.harmonyTypesList}>
        {harmonyTypes.map((harmonyType) => (
          <HarmonyTypeDetailCard
            key={harmonyType}
            harmonyType={harmonyType}
            isSelected={selectedHarmonyType === harmonyType}
            onSelect={() => updateHarmonyType(harmonyType)}
          />
        ))}
      </View>
    </View>
  );
};

interface HarmonyTypeDetailCardProps {
  harmonyType: ColorHarmonyType;
  isSelected: boolean;
  onSelect: () => void;
}

const HarmonyTypeDetailCard: React.FC<HarmonyTypeDetailCardProps> = ({
  harmonyType,
  isSelected,
  onSelect
}) => {
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

  return (
    <TouchableOpacity
      style={[
        styles.harmonyTypeDetailCard,
        isSelected && styles.harmonyTypeDetailCardActive
      ]}
      onPress={onSelect}
    >
      <Ionicons
        name={getHarmonyIcon(harmonyType) as any}
        size={24}
        color={isSelected ? '#007AFF' : '#333'}
      />

      <View style={styles.harmonyTypeDetailContent}>
        <Text style={styles.harmonyTypeDetailTitle}>{harmonyType}</Text>
        <Text style={styles.harmonyTypeDetailDescription}>
          {getHarmonyDescription(harmonyType)}
        </Text>
      </View>

      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );
};

// MARK: - Validation Tab

const ValidationTab: React.FC = () => {
  const { currentValidation } = useColorPalette();

  return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Palette Validation</Text>

      {/* Validation Score */}
      <ValidationScoreCard />

      {/* Validation Details */}
      <ValidationDetailsSection />

      {/* Recommendations */}
      <ValidationRecommendationsSection />
    </View>
  );
};

const ValidationScoreCard: React.FC = () => {
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
    <View style={styles.validationScoreCard}>
      <Text style={styles.validationScoreTitle}>Overall Score</Text>

      <View style={styles.validationScoreCircle}>
        <Text style={[styles.validationScoreValue, { color: getScoreColor(currentValidation.score) }]}>
          {currentValidation.score}
        </Text>
        <Text style={styles.validationScoreMax}>/ 100</Text>
      </View>

      <Text style={[styles.validationScoreDescription, { color: getScoreColor(currentValidation.score) }]}>
        {getScoreDescription(currentValidation.score)}
      </Text>
    </View>
  );
};

const ValidationDetailsSection: React.FC = () => {
  const { currentValidation } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Validation Details</Text>

      <View style={styles.validationDetailsContainer}>
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
  description
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

const ValidationRecommendationsSection: React.FC = () => {
  const { currentValidation } = useColorPalette();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recommendations</Text>

      {currentValidation.messages.length === 0 ? (
        <View style={styles.recommendationSuccess}>
          <Text style={styles.recommendationSuccessText}>
            Great job! Your palette meets all accessibility and design standards.
          </Text>
        </View>
      ) : (
        <View style={styles.recommendationWarning}>
          {currentValidation.messages.map((message, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="warning" size={16} color="#FF9500" />
              <Text style={styles.recommendationText}>{message}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// MARK: - Guide Modals

interface ColorHarmonyGuideModalProps {
  onClose: () => void;
}

const ColorHarmonyGuideModal: React.FC<ColorHarmonyGuideModalProps> = ({ onClose }) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Color Harmony Guide</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <HarmonyGuideSection
            title="Complementary"
            description="Two opposite colors on the color wheel. Creates high contrast and visual impact."
            icon="contrast"
          />

          <HarmonyGuideSection
            title="Triadic"
            description="Three evenly spaced colors on the color wheel. Creates balanced and vibrant schemes."
            icon="triangle"
          />

          <HarmonyGuideSection
            title="Analogous"
            description="Colors that are next to each other on the color wheel. Creates harmonious and serene schemes."
            icon="arrow-forward"
          />

          <HarmonyGuideSection
            title="Monochromatic"
            description="Different shades and tints of the same color. Creates sophisticated and cohesive schemes."
            icon="radio-button-on"
          />
        </ScrollView>
      </View>
    </View>
  );
};

interface HarmonyGuideSectionProps {
  title: string;
  description: string;
  icon: string;
}

const HarmonyGuideSection: React.FC<HarmonyGuideSectionProps> = ({
  title,
  description,
  icon
}) => {
  return (
    <View style={styles.harmonyGuideSection}>
      <View style={styles.harmonyGuideHeader}>
        <Ionicons name={icon as any} size={20} color="#007AFF" />
        <Text style={styles.harmonyGuideTitle}>{title}</Text>
      </View>

      <Text style={styles.harmonyGuideDescription}>{description}</Text>
    </View>
  );
};

interface ColorValidationGuideModalProps {
  onClose: () => void;
}

const ColorValidationGuideModal: React.FC<ColorValidationGuideModalProps> = ({ onClose }) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Color Validation Guide</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <ValidationGuideSection
            title="Contrast Ratio"
            description="Ensure 4.5:1 contrast ratio for normal text and 3:1 for large text to meet WCAG 2.1 standards."
            icon="eye"
          />

          <ValidationGuideSection
            title="Color Harmony"
            description="Colors should follow the selected harmony type to create visually pleasing combinations."
            icon="color-palette"
          />

          <ValidationGuideSection
            title="Saturation Balance"
            description="Avoid overly saturated colors that can be overwhelming and unprofessional."
            icon="paintbrush"
          />
        </ScrollView>
      </View>
    </View>
  );
};

interface ValidationGuideSectionProps {
  title: string;
  description: string;
  icon: string;
}

const ValidationGuideSection: React.FC<ValidationGuideSectionProps> = ({
  title,
  description,
  icon
}) => {
  return (
    <View style={styles.validationGuideSection}>
      <View style={styles.validationGuideHeader}>
        <Ionicons name={icon as any} size={20} color="#007AFF" />
        <Text style={styles.validationGuideTitle}>{title}</Text>
      </View>

      <Text style={styles.validationGuideDescription}>{description}</Text>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  colorInfoContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16
  },
  colorInfoItem: {
    alignItems: 'center'
  },
  colorInfoLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4
  },
  colorInfoValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600'
  },
  colorSwatch: {
    alignItems: 'center',
    flex: 1,
    minWidth: 60
  },
  colorSwatchBox: {
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    marginBottom: 8,
    width: 40
  },
  colorSwatchLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500'
  },
  colorSwatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  colorWheelContainer: {
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1
  },
  content: {
    flex: 1
  },
  guidanceContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16
  },
  guidanceTip: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 12
  },
  guidanceTipContent: {
    flex: 1,
    marginLeft: 12
  },
  guidanceTipDescription: {
    color: '#666',
    fontSize: 12
  },
  guidanceTipTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  harmonyCard: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 52) / 2
  },
  harmonyCardActive: {
    backgroundColor: '#007AFF'
  },
  harmonyCardDescription: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center'
  },
  harmonyCardDescriptionActive: {
    color: '#FFFFFF',
    opacity: 0.8
  },
  harmonyCardTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center'
  },
  harmonyCardTitleActive: {
    color: '#FFFFFF'
  },
  harmonyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  harmonyGuideDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20
  },
  harmonyGuideHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  harmonyGuideSection: {
    marginBottom: 20
  },
  harmonyGuideTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  harmonyTypeDetailCard: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16
  },
  harmonyTypeDetailCardActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
    borderWidth: 2
  },
  harmonyTypeDetailContent: {
    flex: 1,
    marginLeft: 16
  },
  harmonyTypeDetailDescription: {
    color: '#666',
    fontSize: 14
  },
  harmonyTypeDetailTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  harmonyTypeInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  },
  harmonyTypeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500'
  },
  harmonyTypesList: {
    gap: 12
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 60
  },
  headerTitle: {
    color: '#333',
    fontSize: 28,
    fontWeight: 'bold'
  },
  modalBody: {
    padding: 20
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '80%',
    width: screenWidth - 40
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000
  },
  modalTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold'
  },
  paletteDescription: {
    color: '#666',
    fontSize: 14
  },
  paletteInfo: {
    gap: 4
  },
  paletteName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold'
  },
  palettePreview: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16
  },
  predefinedPaletteCard: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16
  },
  predefinedPaletteCardActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
    borderWidth: 2
  },
  predefinedPaletteDescription: {
    color: '#666',
    fontSize: 14
  },
  predefinedPaletteHarmony: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4
  },
  predefinedPaletteHarmonyText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500'
  },
  predefinedPaletteHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  predefinedPaletteInfo: {
    gap: 4
  },
  predefinedPaletteName: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold'
  },
  predefinedPaletteSwatch: {
    borderColor: '#E0E0E0',
    borderRadius: 6,
    borderWidth: 1,
    height: 32,
    width: 32
  },
  predefinedPaletteSwatches: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  predefinedPalettesList: {
    gap: 16
  },
  recommendationItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 8
  },
  recommendationSuccess: {
    backgroundColor: '#D4EDDA',
    borderRadius: 12,
    padding: 16
  },
  recommendationSuccessText: {
    color: '#155724',
    fontSize: 14,
    textAlign: 'center'
  },
  recommendationText: {
    color: '#856404',
    flex: 1,
    fontSize: 14,
    marginLeft: 8
  },
  recommendationWarning: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12
  },
  tabButtonActive: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2
  },
  tabButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500'
  },
  tabButtonTextActive: {
    color: '#007AFF'
  },
  tabContent: {
    padding: 20
  },
  tabIndicator: {
    backgroundColor: '#007AFF',
    bottom: 0,
    height: 2,
    position: 'absolute',
    width: '100%'
  },
  tabSelector: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 8
  },
  validationDetailContent: {
    flex: 1,
    marginLeft: 12
  },
  validationDetailDescription: {
    color: '#666',
    fontSize: 12
  },
  validationDetailRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 12
  },
  validationDetailTitle: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  validationDetailsContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16
  },
  validationGuideDescription: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20
  },
  validationGuideHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  validationGuideSection: {
    marginBottom: 20
  },
  validationGuideTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  validationScoreCard: {
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    marginBottom: 24,
    padding: 24
  },
  validationScoreCircle: {
    alignItems: 'center',
    marginBottom: 16
  },
  validationScoreDescription: {
    fontSize: 16,
    fontWeight: '600'
  },
  validationScoreMax: {
    color: '#666',
    fontSize: 16
  },
  validationScoreTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  validationScoreValue: {
    fontSize: 48,
    fontWeight: 'bold'
  }
});

export default ColorPaletteSelectionScreen;
