import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch
} from 'react-native';
import { useEnhancedTheme, ColorBlindnessSupport } from '../theme/EnhancedThemeProvider';
import styled from 'styled-components/native';

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
`;

const Header = styled.View`
  padding: 20px;
  background-color: ${props => props.theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${props => props.theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.active ? props.theme.primary : 'transparent'};
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? props.theme.primary : props.theme.textSecondary};
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 16px;
`;

const Card = styled.View`
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: ${props => props.theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const ColorPreview = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.color};
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;



// MARK: - Theme Customization Screen

const ThemeCustomizationScreen: React.FC = () => {
  const {
    theme,
    typography,
    accessibility
  } = useEnhancedTheme();

  const [activeTab, setActiveTab] = useState(0);
  const [showFontModal, setShowFontModal] = useState(false);
  const [selectedPrimaryFont, setSelectedPrimaryFont] = useState(typography.primaryFont);
  const [selectedSecondaryFont, setSelectedSecondaryFont] = useState(typography.secondaryFont);

  const tabs = ['Colors', 'Typography', 'Accessibility', 'Preview'];

  const renderColorsTab = () => (
    <View>
      <Section>
        <SectionTitle>Color Palette</SectionTitle>
        <ColorPaletteSection />
      </Section>

      <Section>
        <SectionTitle>Color Harmony Guide</SectionTitle>
        <ColorHarmonyGuide />
      </Section>

      <Section>
        <SectionTitle>Contrast Checker</SectionTitle>
        <ContrastCheckerSection />
      </Section>
    </View>
  );

  const renderTypographyTab = () => (
    <View>
      <Section>
        <SectionTitle>Typography</SectionTitle>
        <TypographySection />
      </Section>

      <Section>
        <SectionTitle>Typography Preview</SectionTitle>
        <TypographyPreviewSection />
      </Section>

      <Section>
        <SectionTitle>Font Hierarchy Guide</SectionTitle>
        <FontHierarchyGuide />
      </Section>
    </View>
  );

  const renderAccessibilityTab = () => (
    <View>
      <Section>
        <SectionTitle>Accessibility Settings</SectionTitle>
        <AccessibilityControlsSection />
      </Section>

      <Section>
        <SectionTitle>Color Blindness Support</SectionTitle>
        <ColorBlindnessSection />
      </Section>

      <Section>
        <SectionTitle>Accessibility Guidelines</SectionTitle>
        <AccessibilityGuidelinesSection />
      </Section>
    </View>
  );

  const renderPreviewTab = () => (
    <View>
      <Section>
        <SectionTitle>Theme Preview</SectionTitle>
        <SampleUIComponents />
      </Section>

      <Section>
        <SectionTitle>Real-time Preview</SectionTitle>
        <RealTimePreview />
      </Section>
    </View>
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Customize Theme</HeaderTitle>
      </Header>

      <TabContainer>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab}
            active={activeTab === index}
            onPress={() => setActiveTab(index)}
          >
            <TabText active={activeTab === index}>{tab}</TabText>
          </TabButton>
        ))}
      </TabContainer>

      <ContentContainer>
        {activeTab === 0 && renderColorsTab()}
        {activeTab === 1 && renderTypographyTab()}
        {activeTab === 2 && renderAccessibilityTab()}
        {activeTab === 3 && renderPreviewTab()}
      </ContentContainer>

      <FontSelectionModal
        visible={showFontModal}
        onClose={() => setShowFontModal(false)}
        selectedPrimaryFont={selectedPrimaryFont}
        selectedSecondaryFont={selectedSecondaryFont}
        onPrimaryFontChange={setSelectedPrimaryFont}
        onSecondaryFontChange={setSelectedSecondaryFont}
        onSave={() => {
          updateTypography(selectedPrimaryFont, selectedSecondaryFont);
          setShowFontModal(false);
        }}
      />
    </Container>
  );
};

// MARK: - Color Palette Section

const ColorPaletteSection: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const colorItems = [
    { title: 'Primary', color: theme.primary, description: 'Main brand color' },
    { title: 'Secondary', color: theme.secondary, description: 'Supporting color' },
    { title: 'Background', color: theme.background, description: 'Main background' },
    { title: 'Surface', color: theme.surface, description: 'Card backgrounds' }
  ];

  return (
    <View>
      {colorItems.map((item) => (
        <Card key={item.title}>
          <View style={styles.colorItemContainer}>
            <View style={styles.colorItemInfo}>
              <Text style={[styles.colorItemTitle, { color: theme.textPrimary }]}>
                {item.title}
              </Text>
              <Text style={[styles.colorItemDescription, { color: theme.textSecondary }]}>
                {item.description}
              </Text>
            </View>
            <ColorPreview color={item.color} />
          </View>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Color Harmony Guide

const ColorHarmonyGuide: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const tips = [
    {
      icon: '🎨',
      title: 'Limit Your Palette',
      description: 'Use 2-3 main colors for consistency'
    },
    {
      icon: '👁️',
      title: 'Consider Contrast',
      description: 'Ensure text is readable on backgrounds'
    },
    {
      icon: '♿',
      title: 'Accessibility First',
      description: 'Test with color blindness simulators'
    }
  ];

  return (
    <View>
      {tips.map((tip) => (
        <Card key={tip.title}>
          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: theme.textPrimary }]}>
                {tip.title}
              </Text>
              <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
                {tip.description}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Contrast Checker Section

const ContrastCheckerSection: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const contrastTests = [
    {
      label: 'Primary on Background',
      textColor: theme.primary,
      backgroundColor: theme.background
    },
    {
      label: 'Text on Surface',
      textColor: theme.textPrimary,
      backgroundColor: theme.surface
    }
  ];

  return (
    <View>
      {contrastTests.map((test) => (
        <Card key={test.label}>
          <View style={styles.contrastTestContainer}>
            <Text style={[styles.contrastTestLabel, { color: theme.textSecondary }]}>
              {test.label}
            </Text>
            <View style={styles.contrastTestPreview}>
              <View
                style={[
                  styles.contrastTestBox,
                  { backgroundColor: test.backgroundColor }
                ]}
              >
                <Text style={[styles.contrastTestText, { color: test.textColor }]}>
                  Sample Text
                </Text>
              </View>
              <Text style={[styles.contrastTestCheck, { color: theme.success }]}>
                ✓
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Typography Section

const TypographySection: React.FC = () => {
  const { theme, typography, updateTypography } = useEnhancedTheme();

  const handleFontUpdate = (primaryFont: string, secondaryFont: string) => {
    updateTypography(primaryFont, secondaryFont);
  };

  return (
    <View>
      <Card>
        <Text style={[styles.sectionSubtitle, { color: theme.textPrimary }]}>
          Primary Font
        </Text>
        <Text style={[styles.fontDisplay, { color: theme.textSecondary }]}>
          {typography.primaryFont}
        </Text>
        <Text style={[styles.fontDescription, { color: theme.textSecondary }]}>
          Used for headings and main text
        </Text>
      </Card>

      <Card>
        <Text style={[styles.sectionSubtitle, { color: theme.textPrimary }]}>
          Secondary Font
        </Text>
        <Text style={[styles.fontDisplay, { color: theme.textSecondary }]}>
          {typography.secondaryFont}
        </Text>
        <Text style={[styles.fontDescription, { color: theme.textSecondary }]}>
          Used for accents and special text
        </Text>
      </Card>

      <RecommendedFontCombinations />
    </View>
  );
};

// MARK: - Recommended Font Combinations

const RecommendedFontCombinations: React.FC = () => {
  const { theme, getRecommendedFontCombinations, updateTypography } = useEnhancedTheme();

  const combinations = getRecommendedFontCombinations();

  return (
    <View>
      <Text style={[styles.sectionSubtitle, { color: theme.textPrimary, marginBottom: 12 }]}>
        Recommended Combinations
      </Text>
      {combinations.map((combination) => (
        <Card key={combination.primary}>
          <TouchableOpacity
            onPress={() => updateTypography(combination.primary, combination.secondary)}
            style={styles.combinationContainer}
          >
            <View style={styles.combinationInfo}>
              <Text style={[styles.combinationPrimary, { color: theme.textPrimary }]}>
                {combination.primary}
              </Text>
              <Text style={[styles.combinationSecondary, { color: theme.textSecondary }]}>
                {combination.secondary}
              </Text>
              <Text style={[styles.combinationDescription, { color: theme.textSecondary }]}>
                {combination.description}
              </Text>
            </View>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Typography Preview Section

const TypographyPreviewSection: React.FC = () => {
  const { theme, typography } = useEnhancedTheme();

  return (
    <Card>
      <Text style={[styles.previewHeading, { color: theme.textPrimary }]}>
        Heading 1
      </Text>
      <Text style={[styles.previewHeading2, { color: theme.textPrimary }]}>
        Heading 2
      </Text>
      <Text style={[styles.previewBody, { color: theme.textPrimary }]}>
        Body Text
      </Text>
      <Text style={[styles.previewParagraph, { color: theme.textSecondary }]}>
        This is a sample paragraph that demonstrates how your typography choices will look in practice. It includes various text elements to help you evaluate readability and visual hierarchy.
      </Text>
    </Card>
  );
};

// MARK: - Font Hierarchy Guide

const FontHierarchyGuide: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const tips = [
    {
      icon: '📏',
      title: 'Use 2-3 Fonts Maximum',
      description: 'More fonts create visual chaos'
    },
    {
      icon: '📝',
      title: 'Establish Clear Hierarchy',
      description: 'Use size and weight for emphasis'
    },
    {
      icon: '👀',
      title: 'Prioritize Readability',
      description: 'Choose fonts that are easy to read'
    }
  ];

  return (
    <View>
      {tips.map((tip) => (
        <Card key={tip.title}>
          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>{tip.icon}</Text>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: theme.textPrimary }]}>
                {tip.title}
              </Text>
              <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
                {tip.description}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Accessibility Controls Section

const AccessibilityControlsSection: React.FC = () => {
  const { theme, accessibility, toggleHighContrast, toggleReducedMotion } = useEnhancedTheme();

  return (
    <View>
      <Card>
        <View style={styles.accessibilityItem}>
          <View style={styles.accessibilityInfo}>
            <Text style={[styles.accessibilityTitle, { color: theme.textPrimary }]}>
              High Contrast
            </Text>
            <Text style={[styles.accessibilityDescription, { color: theme.textSecondary }]}>
              Increase contrast for better visibility
            </Text>
          </View>
          <Switch
            value={accessibility.useHighContrast}
            onValueChange={toggleHighContrast}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={accessibility.useHighContrast ? theme.primary : theme.textSecondary}
          />
        </View>
      </Card>

      <Card>
        <View style={styles.accessibilityItem}>
          <View style={styles.accessibilityInfo}>
            <Text style={[styles.accessibilityTitle, { color: theme.textPrimary }]}>
              Reduce Motion
            </Text>
            <Text style={[styles.accessibilityDescription, { color: theme.textSecondary }]}>
              Minimize animations for vestibular disorders
            </Text>
          </View>
          <Switch
            value={accessibility.reduceMotion}
            onValueChange={toggleReducedMotion}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={accessibility.reduceMotion ? theme.primary : theme.textSecondary}
          />
        </View>
      </Card>
    </View>
  );
};

// MARK: - Color Blindness Section

const ColorBlindnessSection: React.FC = () => {
  const { theme, accessibility, setColorBlindnessSupport } = useEnhancedTheme();

  const options = [
    { value: ColorBlindnessSupport.NONE, label: 'None', description: 'Standard colors' },
    { value: ColorBlindnessSupport.DEUTERANOPIA, label: 'Deuteranopia', description: 'Red-green color blindness' },
    { value: ColorBlindnessSupport.PROTANOPIA, label: 'Protanopia', description: 'Red-green color blindness' },
    { value: ColorBlindnessSupport.TRITANOPIA, label: 'Tritanopia', description: 'Blue-yellow color blindness' }
  ];

  return (
    <View>
      {options.map((option) => (
        <Card key={option.value}>
          <TouchableOpacity
            onPress={() => setColorBlindnessSupport(option.value)}
            style={styles.colorBlindnessOption}
          >
            <View style={styles.colorBlindnessInfo}>
              <Text style={[styles.colorBlindnessTitle, { color: theme.textPrimary }]}>
                {option.label}
              </Text>
              <Text style={[styles.colorBlindnessDescription, { color: theme.textSecondary }]}>
                {option.description}
              </Text>
            </View>
            <Text style={[styles.colorBlindnessCheck, { color: theme.primary }]}>
              {accessibility.colorBlindnessSupport === option.value ? '✓' : '○'}
            </Text>
          </TouchableOpacity>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Accessibility Guidelines Section

const AccessibilityGuidelinesSection: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const guidelines = [
    {
      icon: '👁️',
      title: 'WCAG 2.1 Compliance',
      description: 'Ensure 4.5:1 contrast ratio for normal text'
    },
    {
      icon: '🤝',
      title: 'Test with Users',
      description: 'Validate accessibility with real users'
    },
    {
      icon: '⚙️',
      title: 'System Integration',
      description: 'Respect user\'s system accessibility settings'
    }
  ];

  return (
    <View>
      {guidelines.map((guideline) => (
        <Card key={guideline.title}>
          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>{guideline.icon}</Text>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: theme.textPrimary }]}>
                {guideline.title}
              </Text>
              <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
                {guideline.description}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

// MARK: - Sample UI Components

const SampleUIComponents: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <Card>
      <Text style={[styles.sampleTitle, { color: theme.textPrimary }]}>
        Sample Card
      </Text>
      <Text style={[styles.sampleDescription, { color: theme.textSecondary }]}>
        This is a sample card that demonstrates how your theme will look in practice.
      </Text>
      <View style={styles.sampleButtons}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.primaryButtonText, { color: 'white' }]}>
            Primary Action
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: `${theme.primary }20` }]}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Secondary
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

// MARK: - Real Time Preview

const RealTimePreview: React.FC = () => {
  const { theme, typography } = useEnhancedTheme();

  return (
    <Card>
      <Text style={[styles.previewHeading, { color: theme.textPrimary }]}>
        Heading 1
      </Text>
      <Text style={[styles.previewHeading2, { color: theme.textPrimary }]}>
        Heading 2
      </Text>
      <Text style={[styles.previewBody, { color: theme.textSecondary }]}>
        Body text with your selected typography and colors.
      </Text>
    </Card>
  );
};

// MARK: - Font Selection Modal

interface FontSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedPrimaryFont: string;
  selectedSecondaryFont: string;
  onPrimaryFontChange: (font: string) => void;
  onSecondaryFontChange: (font: string) => void;
  onSave: () => void;
}

const FontSelectionModal: React.FC<FontSelectionModalProps> = ({
  visible,
  onClose,
  selectedPrimaryFont,
  selectedSecondaryFont,
  onPrimaryFontChange,
  onSecondaryFontChange,
  onSave
}) => {
  const { theme, availableFontFamilies } = useEnhancedTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: theme.surface }]}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            Select Fonts
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalClose, { color: theme.primary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.fontSection}>
            <Text style={[styles.fontSectionTitle, { color: theme.textPrimary }]}>
              Primary Font
            </Text>
            {availableFontFamilies.map((font) => (
              <TouchableOpacity
                key={font}
                style={[
                  styles.fontOption,
                  selectedPrimaryFont === font && { backgroundColor: `${theme.primary }20` }
                ]}
                onPress={() => onPrimaryFontChange(font)}
              >
                <Text style={[styles.fontOptionText, { color: theme.textPrimary }]}>
                  {font}
                </Text>
                {selectedPrimaryFont === font && (
                  <Text style={[styles.fontOptionCheck, { color: theme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.fontSection}>
            <Text style={[styles.fontSectionTitle, { color: theme.textPrimary }]}>
              Secondary Font
            </Text>
            {availableFontFamilies.map((font) => (
              <TouchableOpacity
                key={font}
                style={[
                  styles.fontOption,
                  selectedSecondaryFont === font && { backgroundColor: `${theme.primary }20` }
                ]}
                onPress={() => onSecondaryFontChange(font)}
              >
                <Text style={[styles.fontOptionText, { color: theme.textPrimary }]}>
                  {font}
                </Text>
                {selectedSecondaryFont === font && (
                  <Text style={[styles.fontOptionCheck, { color: theme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.modalFooter, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.primary }]}
            onPress={onSave}
          >
            <Text style={[styles.saveButtonText, { color: 'white' }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  accessibilityDescription: {
    fontSize: 14
  },
  accessibilityInfo: {
    flex: 1
  },
  accessibilityItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  accessibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  colorBlindnessCheck: {
    fontSize: 20,
    fontWeight: '600'
  },
  colorBlindnessDescription: {
    fontSize: 14
  },
  colorBlindnessInfo: {
    flex: 1
  },
  colorBlindnessOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  colorBlindnessTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  colorItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  colorItemDescription: {
    fontSize: 14
  },
  colorItemInfo: {
    flex: 1
  },
  colorItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  combinationContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  combinationDescription: {
    fontSize: 12
  },
  combinationInfo: {
    flex: 1
  },
  combinationPrimary: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  combinationSecondary: {
    fontSize: 14,
    marginBottom: 4
  },
  contrastTestBox: {
    borderRadius: 4,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  contrastTestCheck: {
    fontSize: 16,
    fontWeight: '600'
  },
  contrastTestContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  contrastTestLabel: {
    flex: 1,
    fontSize: 14
  },
  contrastTestPreview: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  contrastTestText: {
    fontSize: 12
  },
  fontDescription: {
    fontSize: 14
  },
  fontDisplay: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4
  },
  fontOption: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 16
  },
  fontOptionCheck: {
    fontSize: 18,
    fontWeight: '600'
  },
  fontOptionText: {
    fontSize: 16
  },
  fontSection: {
    marginBottom: 24
  },
  fontSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1
  },
  modalContent: {
    flex: 1,
    padding: 20
  },
  modalFooter: {
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    padding: 20
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600'
  },
  previewBody: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8
  },
  previewHeading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8
  },
  previewHeading2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8
  },
  previewParagraph: {
    fontSize: 16,
    lineHeight: 24
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  sampleButtons: {
    flexDirection: 'row',
    gap: 12
  },
  sampleDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },
  sampleTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600'
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  tipContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  tipContent: {
    flex: 1
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  }
});

export default ThemeCustomizationScreen;
