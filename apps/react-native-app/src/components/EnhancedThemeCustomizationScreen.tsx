/**
 * EnhancedThemeCustomizationScreen.tsx
 *
 * Enhanced theme customization with interactive accessibility feedback.
 * Provides real-time validation and educational guidance for accessible design.
 *
 * @author AI Assistant
 * @copyright 2025 Aether
 */

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
import { useEnhancedTheme, HeadingSize, BodySize, ColorBlindnessSupport } from '../theme/EnhancedThemeProvider';
import { useInteractiveFeedback, InteractiveFeedbackView, InteractiveColorPicker } from './InteractiveThemeFeedback';
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

const EducationBanner = styled.View<{ color: string }>`
  background-color: ${props => props.color}20;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${props => props.color};
`;

const BannerTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 8px;
`;

const BannerDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  line-height: 20px;
`;

const ColorGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const HarmonyCard = styled.View`
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const HarmonyTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 8px;
`;

const HarmonyDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 12px;
`;

const ColorExample = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const ColorSwatch = styled.TouchableOpacity<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background-color: ${props => props.color};
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;

const ToggleCard = styled.View`
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const ToggleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ToggleInfo = styled.View`
  flex: 1;
`;

const ToggleTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 4px;
`;

const ToggleDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textSecondary};
`;

const PreviewCard = styled.View`
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

const SummaryCard = styled.View`
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SummaryTitle = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textPrimary};
`;

const SummaryCount = styled.Text<{ color: string }>`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color};
`;

// MARK: - Enhanced Theme Customization Screen

const EnhancedThemeCustomizationScreen: React.FC = () => {
  const {
    theme,
    typography,
    accessibility,
    updateTypography,
    updateAccessibility,
    toggleHighContrast,
    toggleReducedMotion,
    setColorBlindnessSupport,
    getRecommendedFontCombinations,
    availableFontFamilies
  } = useEnhancedTheme();

  const feedbackManager = useInteractiveFeedback();
  const [activeTab, setActiveTab] = useState(0);
  const [showEducationalGuide, setShowEducationalGuide] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [selectedPrimaryFont, setSelectedPrimaryFont] = useState(typography.primaryFont);
  const [selectedSecondaryFont, setSelectedSecondaryFont] = useState(typography.secondaryFont);

  const tabs = ['Colors', 'Typography', 'Accessibility', 'Preview'];

  const renderColorsTab = () => (
    <View>
      {/* Accessibility Education Banner */}
      <EducationBanner color="#3B82F6">
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerIcon}>👁️</Text>
          <Text style={styles.bannerTitle}>Accessibility First</Text>
        </View>
        <BannerDescription>
          This interface provides real-time feedback to help you create accessible color combinations that meet WCAG AA standards.
        </BannerDescription>
      </EducationBanner>

      {/* Enhanced Color Palette Section */}
      <Section>
        <SectionTitle>Color Palette</SectionTitle>
        <ColorGrid>
          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={theme.primary}
            onColorChange={(color) => {
              // Update theme primary color
              console.log('Primary color changed to:', color);
            }}
            title="Primary"
            description="Main brand color"
            testBackground={theme.background}
          />

          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={theme.secondary}
            onColorChange={(color) => {
              // Update theme secondary color
              console.log('Secondary color changed to:', color);
            }}
            title="Secondary"
            description="Supporting color"
            testBackground={theme.background}
          />

          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={theme.background}
            onColorChange={(color) => {
              // Update theme background color
              console.log('Background color changed to:', color);
            }}
            title="Background"
            description="Main background"
            testBackground="#FFFFFF"
          />

          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={theme.surface}
            onColorChange={(color) => {
              // Update theme surface color
              console.log('Surface color changed to:', color);
            }}
            title="Surface"
            description="Card backgrounds"
            testBackground={theme.background}
          />
        </ColorGrid>
      </Section>

      {/* Enhanced Color Harmony Guide */}
      <Section>
        <SectionTitle>Color Harmony Guide</SectionTitle>
        <HarmonyCard>
          <HarmonyTitle>Complementary Colors</HarmonyTitle>
          <HarmonyDescription>
            Colors opposite on the color wheel create high contrast but can be harsh.
          </HarmonyDescription>
          <ColorExample>
            {['#FF0000', '#00FFFF'].map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                onPress={() => {
                  feedbackManager.validateColorCombination(color, '#FFFFFF', 'example');
                }}
              />
            ))}
          </ColorExample>
        </HarmonyCard>

        <HarmonyCard>
          <HarmonyTitle>Analogous Colors</HarmonyTitle>
          <HarmonyDescription>
            Colors next to each other create harmony but may lack contrast.
          </HarmonyDescription>
          <ColorExample>
            {['#FF0000', '#FF8000'].map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                onPress={() => {
                  feedbackManager.validateColorCombination(color, '#FFFFFF', 'example');
                }}
              />
            ))}
          </ColorExample>
        </HarmonyCard>

        <HarmonyCard>
          <HarmonyTitle>Triadic Colors</HarmonyTitle>
          <HarmonyDescription>
            Three colors equally spaced create balance and good contrast.
          </HarmonyDescription>
          <ColorExample>
            {['#FF0000', '#00FF00', '#0000FF'].map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                onPress={() => {
                  feedbackManager.validateColorCombination(color, '#FFFFFF', 'example');
                }}
              />
            ))}
          </ColorExample>
        </HarmonyCard>
      </Section>

      {/* Advanced Contrast Checker */}
      <Section>
        <SectionTitle>Advanced Contrast Checker</SectionTitle>
        <AdvancedContrastChecker feedbackManager={feedbackManager} />
      </Section>

      {/* Color Blindness Simulation */}
      <Section>
        <SectionTitle>Color Blindness Simulation</SectionTitle>
        <ColorBlindnessSimulation feedbackManager={feedbackManager} />
      </Section>
    </View>
  );

  const renderTypographyTab = () => (
    <View>
      {/* Typography Education Banner */}
      <EducationBanner color="#8B5CF6">
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerIcon}>📝</Text>
          <Text style={styles.bannerTitle}>Typography & Readability</Text>
        </View>
        <BannerDescription>
          Good typography improves readability and accessibility. Consider font size, line height, and contrast for optimal user experience.
        </BannerDescription>
      </EducationBanner>

      {/* Font Selection Section */}
      <Section>
        <SectionTitle>Font Selection</SectionTitle>
        <FontSelectionSection feedbackManager={feedbackManager} />
      </Section>

      {/* Font Size Guidelines */}
      <Section>
        <SectionTitle>Font Size Guidelines</SectionTitle>
        <FontSizeGuidelines feedbackManager={feedbackManager} />
      </Section>

      {/* Readability Preview */}
      <Section>
        <SectionTitle>Readability Preview</SectionTitle>
        <ReadabilityPreview feedbackManager={feedbackManager} />
      </Section>
    </View>
  );

  const renderAccessibilityTab = () => (
    <View>
      {/* Accessibility Education Banner */}
      <EducationBanner color="#10B981">
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerIcon}>♿</Text>
          <Text style={styles.bannerTitle}>Accessibility Settings</Text>
        </View>
        <BannerDescription>
          Configure accessibility features to make your app usable by people with diverse abilities and needs.
        </BannerDescription>
      </EducationBanner>

      {/* Accessibility Settings */}
      <Section>
        <SectionTitle>Accessibility Settings</SectionTitle>
        <AccessibilitySettingsSection feedbackManager={feedbackManager} />
      </Section>

      {/* Accessibility Preview */}
      <Section>
        <SectionTitle>Accessibility Preview</SectionTitle>
        <AccessibilityPreviewSection feedbackManager={feedbackManager} />
      </Section>
    </View>
  );

  const renderPreviewTab = () => (
    <View>
      <Section>
        <SectionTitle>Theme Preview</SectionTitle>
        <ThemePreviewSection feedbackManager={feedbackManager} />
      </Section>

      <Section>
        <SectionTitle>Accessibility Summary</SectionTitle>
        <AccessibilitySummarySection feedbackManager={feedbackManager} />
      </Section>
    </View>
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>Enhanced Theme Customization</HeaderTitle>
      </Header>

      {/* Interactive Feedback Display */}
      <InteractiveFeedbackView feedbackManager={feedbackManager} />

      {/* Tab Navigation */}
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

      {/* Content */}
      <ContentContainer>
        {activeTab === 0 && renderColorsTab()}
        {activeTab === 1 && renderTypographyTab()}
        {activeTab === 2 && renderAccessibilityTab()}
        {activeTab === 3 && renderPreviewTab()}
      </ContentContainer>

      {/* Educational Guide Modal */}
      <Modal
        visible={showEducationalGuide}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EducationalGuide onClose={() => setShowEducationalGuide(false)} />
      </Modal>
    </Container>
  );
};

// MARK: - Advanced Contrast Checker Component

const AdvancedContrastChecker: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [elementType, setElementType] = useState('Normal Text');

  const elementTypes = ['Normal Text', 'Large Text', 'UI Components'];

  return (
    <View>
      <View style={styles.contrastCheckerContainer}>
        <Text style={styles.contrastCheckerLabel}>Element Type</Text>
        <View style={styles.elementTypeSelector}>
          {elementTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.elementTypeButton,
                elementType === type && styles.elementTypeButtonActive
              ]}
              onPress={() => setElementType(type)}
            >
              <Text
                style={[
                  styles.elementTypeButtonText,
                  elementType === type && styles.elementTypeButtonTextActive
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.colorInputsContainer}>
        <View style={styles.colorInputColumn}>
          <Text style={styles.colorInputLabel}>Foreground</Text>
          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={foregroundColor}
            onColorChange={setForegroundColor}
            title="Foreground"
            description="Text or icon color"
            testBackground={backgroundColor}
          />
        </View>

        <View style={styles.colorInputColumn}>
          <Text style={styles.colorInputLabel}>Background</Text>
          <InteractiveColorPicker
            feedbackManager={feedbackManager}
            selectedColor={backgroundColor}
            onColorChange={setBackgroundColor}
            title="Background"
            description="Background color"
            testBackground="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.validateButton}
        onPress={() => {
          feedbackManager.validateColorCombination(
            foregroundColor,
            backgroundColor,
            elementType.toLowerCase()
          );
        }}
      >
        <Text style={styles.validateButtonText}>Validate Contrast</Text>
      </TouchableOpacity>
    </View>
  );
};

// MARK: - Color Blindness Simulation Component

const ColorBlindnessSimulation: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [selectedSimulation, setSelectedSimulation] = useState('Normal');

  const simulations = ['Normal', 'Protanopia', 'Deuteranopia', 'Tritanopia'];

  return (
    <View>
      <InteractiveColorPicker
        feedbackManager={feedbackManager}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        title="Test Color"
        description="Color to simulate"
        testBackground="#FFFFFF"
      />

      <View style={styles.simulationSelector}>
        {simulations.map((simulation) => (
          <TouchableOpacity
            key={simulation}
            style={[
              styles.simulationButton,
              selectedSimulation === simulation && styles.simulationButtonActive
            ]}
            onPress={() => setSelectedSimulation(simulation)}
          >
            <Text
              style={[
                styles.simulationButtonText,
                selectedSimulation === simulation && styles.simulationButtonTextActive
              ]}
            >
              {simulation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.simulationPreview}>
        <Text style={styles.simulationPreviewLabel}>Simulation Preview</Text>
        <View style={styles.simulationPreviewContent}>
          <View style={styles.simulationColorContainer}>
            <View
              style={[
                styles.simulationColor,
                { backgroundColor: selectedColor }
              ]}
            />
            <Text style={styles.simulationColorLabel}>Original</Text>
          </View>
          <View style={styles.simulationColorContainer}>
            <View
              style={[
                styles.simulationColor,
                { backgroundColor: selectedColor, opacity: 0.7 }
              ]}
            />
            <Text style={styles.simulationColorLabel}>{selectedSimulation}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// MARK: - Font Selection Section Component

const FontSelectionSection: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  return (
    <View>
      <FontSelectionCard
        title="Primary Font"
        currentFont="System"
        description="Main font for headings and important text"
        feedbackManager={feedbackManager}
      />
      <FontSelectionCard
        title="Secondary Font"
        currentFont="System"
        description="Supporting font for body text"
        feedbackManager={feedbackManager}
      />
    </View>
  );
};

// MARK: - Font Selection Card Component

const FontSelectionCard: React.FC<{
  title: string;
  currentFont: string;
  description: string;
  feedbackManager: ReturnType<typeof useInteractiveFeedback>;
}> = ({ title, currentFont, description, feedbackManager }) => {
  return (
    <Card>
      <Text style={styles.fontCardTitle}>{title}</Text>
      <Text style={styles.fontCardDescription}>{description}</Text>
      <View style={styles.fontCardPreview}>
        <Text style={styles.fontCardPreviewText}>{currentFont}</Text>
      </View>
    </Card>
  );
};

// MARK: - Font Size Guidelines Component

const FontSizeGuidelines: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  const guidelines = [
    { size: '16px', description: 'Minimum readable size for body text' },
    { size: '18px', description: 'Recommended size for better readability' },
    { size: '24px', description: 'Large text for headings and emphasis' }
  ];

  return (
    <View>
      {guidelines.map((guideline, index) => (
        <View key={index} style={styles.guidelineCard}>
          <Text style={styles.guidelineSize}>{guideline.size}</Text>
          <Text style={styles.guidelineDescription}>{guideline.description}</Text>
        </View>
      ))}
    </View>
  );
};

// MARK: - Readability Preview Component

const ReadabilityPreview: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  return (
    <PreviewCard>
      <Text style={styles.previewHeading}>Sample Heading</Text>
      <Text style={styles.previewBody}>
        This is a sample paragraph that demonstrates how your typography choices will look in practice. Good typography improves readability and accessibility for all users.
      </Text>
      <Text style={styles.previewCaption}>Secondary text example</Text>
    </PreviewCard>
  );
};

// MARK: - Accessibility Settings Section Component

const AccessibilitySettingsSection: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <View>
      <ToggleCard>
        <ToggleRow>
          <ToggleInfo>
            <ToggleTitle>High Contrast</ToggleTitle>
            <ToggleDescription>Increase contrast for better visibility</ToggleDescription>
          </ToggleInfo>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </ToggleRow>
      </ToggleCard>

      <ToggleCard>
        <ToggleRow>
          <ToggleInfo>
            <ToggleTitle>Large Text</ToggleTitle>
            <ToggleDescription>Increase font sizes for better readability</ToggleDescription>
          </ToggleInfo>
          <Switch value={largeText} onValueChange={setLargeText} />
        </ToggleRow>
      </ToggleCard>

      <ToggleCard>
        <ToggleRow>
          <ToggleInfo>
            <ToggleTitle>Reduced Motion</ToggleTitle>
            <ToggleDescription>Minimize animations for users with vestibular disorders</ToggleDescription>
          </ToggleInfo>
          <Switch value={reducedMotion} onValueChange={setReducedMotion} />
        </ToggleRow>
      </ToggleCard>
    </View>
  );
};

// MARK: - Accessibility Preview Section Component

const AccessibilityPreviewSection: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  return (
    <View>
      <PreviewCard>
        <Text style={styles.previewHeading}>Normal</Text>
        <Text style={styles.previewBody}>
          This is sample text that demonstrates the current accessibility settings.
        </Text>
      </PreviewCard>
    </View>
  );
};

// MARK: - Theme Preview Section Component

const ThemePreviewSection: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  return (
    <View>
      <PreviewCard>
        <Text style={styles.previewHeading}>Sample UI Components</Text>
        <Text style={styles.previewBody}>
          This preview shows how your theme will look in practice with various UI components.
        </Text>
      </PreviewCard>
    </View>
  );
};

// MARK: - Accessibility Summary Section Component

const AccessibilitySummarySection: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager
}) => {
  const errorCount = feedbackManager.feedbackHistory.filter(
    (f) => f.type.type === 'error' || f.type.type === 'warning'
  ).length;
  const successCount = feedbackManager.feedbackHistory.filter(
    (f) => f.type.type === 'success'
  ).length;
  const totalCount = feedbackManager.feedbackHistory.length;

  return (
    <View>
      <SummaryCard>
        <SummaryRow>
          <SummaryTitle>Contrast Issues</SummaryTitle>
          <SummaryCount color="#F59E0B">{errorCount}</SummaryCount>
        </SummaryRow>
      </SummaryCard>

      <SummaryCard>
        <SummaryRow>
          <SummaryTitle>Passed Tests</SummaryTitle>
          <SummaryCount color="#10B981">{successCount}</SummaryCount>
        </SummaryRow>
      </SummaryCard>

      <SummaryCard>
        <SummaryRow>
          <SummaryTitle>Total Validations</SummaryTitle>
          <SummaryCount color="#3B82F6">{totalCount}</SummaryCount>
        </SummaryRow>
      </SummaryCard>
    </View>
  );
};

// MARK: - Educational Guide Component

const EducationalGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const sections = [
    {
      title: 'WCAG Guidelines',
      content: 'Web Content Accessibility Guidelines (WCAG) ensure digital content is accessible to people with disabilities. WCAG AA is the standard level of compliance.'
    },
    {
      title: 'Contrast Ratios',
      content: 'Contrast ratio measures the difference in luminance between foreground and background colors. Higher ratios provide better readability.'
    },
    {
      title: 'Color Blindness',
      content: 'Approximately 8% of men and 0.5% of women have some form of color blindness. Avoid relying solely on color to convey information.'
    },
    {
      title: 'Typography',
      content: 'Good typography improves readability for all users. Consider font size, line height, and spacing for optimal accessibility.'
    }
  ];

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Accessibility Guide</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.modalButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalContent}>
        {sections.map((section, index) => (
          <View key={index} style={styles.educationalSection}>
            <Text style={styles.educationalTitle}>{section.title}</Text>
            <Text style={styles.educationalContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  bannerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  bannerIcon: {
    fontSize: 20,
    marginRight: 8
  },
  bannerTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600'
  },
  colorInputColumn: {
    flex: 1
  },
  colorInputLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  colorInputsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16
  },
  contrastCheckerContainer: {
    marginBottom: 16
  },
  contrastCheckerLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  educationalContent: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20
  },
  educationalSection: {
    marginBottom: 20
  },
  educationalTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  elementTypeButton: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  elementTypeButtonActive: {
    backgroundColor: '#3b82f6'
  },
  elementTypeButtonText: {
    color: '#64748b',
    fontSize: 12
  },
  elementTypeButtonTextActive: {
    color: 'white',
    fontWeight: '500'
  },
  elementTypeSelector: {
    flexDirection: 'row',
    gap: 8
  },
  fontCardDescription: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 12
  },
  fontCardPreview: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12
  },
  fontCardPreviewText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '500'
  },
  fontCardTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  guidelineCard: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 12
  },
  guidelineDescription: {
    color: '#64748b',
    flex: 1,
    fontSize: 14
  },
  guidelineSize: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
    width: 60
  },
  modalButton: {
    color: '#64748b',
    fontSize: 16
  },
  modalContainer: {
    backgroundColor: 'white',
    flex: 1
  },
  modalContent: {
    flex: 1,
    padding: 16
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16
  },
  modalTitle: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '600'
  },
  previewBody: {
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8
  },
  previewCaption: {
    color: '#94a3b8',
    fontSize: 14
  },
  previewHeading: {
    color: '#1e293b',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8
  },
  simulationButton: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  simulationButtonActive: {
    backgroundColor: '#3b82f6'
  },
  simulationButtonText: {
    color: '#64748b',
    fontSize: 12
  },
  simulationButtonTextActive: {
    color: 'white',
    fontWeight: '500'
  },
  simulationColor: {
    borderColor: '#e2e8f0',
    borderRadius: 8,
    borderWidth: 1,
    height: 60,
    marginBottom: 8,
    width: 60
  },
  simulationColorContainer: {
    alignItems: 'center'
  },
  simulationColorLabel: {
    color: '#64748b',
    fontSize: 12
  },
  simulationPreview: {
    marginBottom: 16
  },
  simulationPreviewContent: {
    flexDirection: 'row',
    gap: 16
  },
  simulationPreviewLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  simulationSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  validateButton: {
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  validateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  }
});

export default EnhancedThemeCustomizationScreen;
