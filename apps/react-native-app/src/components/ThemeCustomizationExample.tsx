import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { useEnhancedTheme, HeadingSize, BodySize, ColorBlindnessSupport } from '../theme/EnhancedThemeProvider';
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

const Card = styled.View`
  background-color: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 20px;
  margin: 10px;
  shadow-color: ${props => props.theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 16px;
`;

const ColorPreview = styled.View<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.color};
  border-width: 1px;
  border-color: ${props => props.theme.border};
`;

// MARK: - Theme Customization Example

const ThemeCustomizationExample: React.FC = () => {
  const {
    theme,
    themeName,
    typography,
    accessibility,
    switchTheme,
    toggleDarkMode,
    isDarkMode,
    updateTypography,
    toggleHighContrast,
    toggleReducedMotion,
    setColorBlindnessSupport,
    getRecommendedFontCombinations,
  } = useEnhancedTheme();

  const [showCustomization, setShowCustomization] = useState(false);

  return (
    <Container>
      <Header>
        <HeaderTitle>Theme Example</HeaderTitle>
      </Header>

      <ScrollView style={styles.scrollView}>
        {/* Theme Info Header */}
        <ThemeInfoHeader />

        {/* Typography Preview */}
        <TypographyPreviewCard />

        {/* Accessibility Status */}
        <AccessibilityStatusCard />

        {/* Theme Controls */}
        <ThemeControlsSection />

        {/* Sample UI Components */}
        <SampleUIComponents />

        {/* Customization Button */}
        <TouchableOpacity
          style={[styles.customizationButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowCustomization(true)}
        >
          <Text style={styles.customizationButtonText}>Customize Theme</Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

// MARK: - Theme Info Header

const ThemeInfoHeader: React.FC = () => {
  const { theme, themeName } = useEnhancedTheme();

  return (
    <Card>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Current Theme
      </Text>
      <Text style={[styles.themeName, { color: theme.textSecondary }]}>
        {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
      </Text>
      
      {/* Color palette preview */}
      <View style={styles.colorPalette}>
        {[
          theme.primary,
          theme.secondary,
          theme.background,
          theme.surface,
        ].map((color, index) => (
          <ColorPreview key={index} color={color} />
        ))}
      </View>
    </Card>
  );
};

// MARK: - Typography Preview Card

const TypographyPreviewCard: React.FC = () => {
  const { theme, typography } = useEnhancedTheme();

  return (
    <Card>
      <SectionTitle>Typography Preview</SectionTitle>
      
      <View style={styles.typographyPreview}>
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
      </View>
      
      {/* Font info */}
      <View style={styles.fontInfo}>
        <View style={styles.fontInfoItem}>
          <Text style={[styles.fontInfoLabel, { color: theme.textTertiary }]}>
            Primary Font
          </Text>
          <Text style={[styles.fontInfoValue, { color: theme.textSecondary }]}>
            {typography.primaryFont}
          </Text>
        </View>
        
        <View style={styles.fontInfoItem}>
          <Text style={[styles.fontInfoLabel, { color: theme.textTertiary }]}>
            Secondary Font
          </Text>
          <Text style={[styles.fontInfoValue, { color: theme.textSecondary }]}>
            {typography.secondaryFont}
          </Text>
        </View>
      </View>
    </Card>
  );
};

// MARK: - Accessibility Status Card

const AccessibilityStatusCard: React.FC = () => {
  const { theme, accessibility } = useEnhancedTheme();

  const getColorBlindnessDescription = () => {
    switch (accessibility.colorBlindnessSupport) {
      case ColorBlindnessSupport.NONE:
        return 'Standard colors';
      case ColorBlindnessSupport.DEUTERANOPIA:
        return 'Red-green color blindness support';
      case ColorBlindnessSupport.PROTANOPIA:
        return 'Red-green color blindness support';
      case ColorBlindnessSupport.TRITANOPIA:
        return 'Blue-yellow color blindness support';
      default:
        return 'Standard colors';
    }
  };

  return (
    <Card>
      <SectionTitle>Accessibility Status</SectionTitle>
      
      <View style={styles.accessibilityStatus}>
        <AccessibilityStatusRow
          title="High Contrast"
          isEnabled={accessibility.useHighContrast}
          icon="👁️"
        />
        
        <AccessibilityStatusRow
          title="Reduce Motion"
          isEnabled={accessibility.reduceMotion}
          icon="🤚"
        />
        
        <AccessibilityStatusRow
          title="Large Text"
          isEnabled={accessibility.useLargeText}
          icon="📏"
        />
        
        <View style={styles.accessibilityRow}>
          <Text style={styles.accessibilityIcon}>🎨</Text>
          <View style={styles.accessibilityInfo}>
            <Text style={[styles.accessibilityTitle, { color: theme.textPrimary }]}>
              Color Blindness Support
            </Text>
            <Text style={[styles.accessibilityDescription, { color: theme.textSecondary }]}>
              {getColorBlindnessDescription()}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const AccessibilityStatusRow: React.FC<{
  title: string;
  isEnabled: boolean;
  icon: string;
}> = ({ title, isEnabled, icon }) => {
  const { theme } = useEnhancedTheme();

  return (
    <View style={styles.accessibilityRow}>
      <Text style={styles.accessibilityIcon}>{icon}</Text>
      <Text style={[styles.accessibilityTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <View style={styles.accessibilitySpacer} />
      <Text style={[
        styles.accessibilityCheck,
        { color: isEnabled ? theme.success : theme.textTertiary }
      ]}>
        {isEnabled ? '✓' : '○'}
      </Text>
    </View>
  );
};

// MARK: - Theme Controls Section

const ThemeControlsSection: React.FC = () => {
  const { theme, themeName, switchTheme, toggleHighContrast, toggleReducedMotion } = useEnhancedTheme();

  const themeButtons = [
    { name: 'light', title: 'Light', icon: '☀️' },
    { name: 'dark', title: 'Dark', icon: '🌙' },
  ];

  return (
    <Card>
      <SectionTitle>Quick Controls</SectionTitle>
      
      {/* Theme buttons */}
      <View style={styles.themeButtons}>
        {themeButtons.map((button) => (
          <TouchableOpacity
            key={button.name}
            style={[
              styles.themeButton,
              {
                backgroundColor: themeName === button.name
                  ? theme.primary
                  : theme.backgroundSecondary,
              },
            ]}
            onPress={() => switchTheme(button.name)}
          >
            <Text style={styles.themeButtonIcon}>{button.icon}</Text>
            <Text style={[
              styles.themeButtonText,
              {
                color: themeName === button.name ? 'white' : theme.textPrimary,
              },
            ]}>
              {button.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Accessibility toggles */}
      <View style={styles.accessibilityToggles}>
        <AccessibilityToggle
          title="High Contrast"
          isOn={theme.accessibility.useHighContrast}
          onToggle={toggleHighContrast}
        />
        
        <AccessibilityToggle
          title="Reduce Motion"
          isOn={theme.accessibility.reduceMotion}
          onToggle={toggleReducedMotion}
        />
      </View>
    </Card>
  );
};

const AccessibilityToggle: React.FC<{
  title: string;
  isOn: boolean;
  onToggle: () => void;
}> = ({ title, isOn, onToggle }) => {
  const { theme } = useEnhancedTheme();

  return (
    <View style={styles.accessibilityToggle}>
      <Text style={[styles.accessibilityToggleTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Switch
        value={isOn}
        onValueChange={onToggle}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={isOn ? theme.primary : theme.textSecondary}
      />
    </View>
  );
};

// MARK: - Sample UI Components

const SampleUIComponents: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <Card>
      <SectionTitle>Sample UI Components</SectionTitle>
      
      <View style={styles.sampleComponents}>
        {/* Sample card */}
        <View style={[styles.sampleCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sampleCardTitle, { color: theme.textPrimary }]}>
            Sample Card
          </Text>
          <Text style={[styles.sampleCardDescription, { color: theme.textSecondary }]}>
            This is a sample card that demonstrates how your theme will look in practice.
          </Text>
          
          <View style={styles.sampleButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.primaryButtonText}>Primary Action</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.primary + '20' }]}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
                Secondary
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sample list item */}
        <View style={[styles.sampleListItem, { backgroundColor: theme.surface }]}>
          <View style={[styles.sampleListItemIcon, { backgroundColor: theme.primary }]}>
            <Text style={styles.sampleListItemIconText}>⭐</Text>
          </View>
          
          <View style={styles.sampleListItemContent}>
            <Text style={[styles.sampleListItemTitle, { color: theme.textPrimary }]}>
              Sample List Item
            </Text>
            <Text style={[styles.sampleListItemDescription, { color: theme.textSecondary }]}>
              This demonstrates how list items look with your theme.
            </Text>
          </View>
          
          <Text style={[styles.sampleListItemChevron, { color: theme.textTertiary }]}>
            ›
          </Text>
        </View>
      </View>
    </Card>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  typographyPreview: {
    marginBottom: 16,
  },
  previewHeading: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  previewHeading2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewBody: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
  },
  previewParagraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  fontInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontInfoItem: {
    flex: 1,
  },
  fontInfoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  fontInfoValue: {
    fontSize: 12,
  },
  accessibilityStatus: {
    gap: 12,
  },
  accessibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  accessibilityInfo: {
    flex: 1,
  },
  accessibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accessibilityDescription: {
    fontSize: 14,
  },
  accessibilitySpacer: {
    flex: 1,
  },
  accessibilityCheck: {
    fontSize: 20,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  themeButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  accessibilityToggles: {
    gap: 12,
  },
  accessibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  accessibilityToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sampleComponents: {
    gap: 12,
  },
  sampleCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sampleCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sampleCardDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  sampleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sampleListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sampleListItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sampleListItemIconText: {
    fontSize: 20,
  },
  sampleListItemContent: {
    flex: 1,
  },
  sampleListItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sampleListItemDescription: {
    fontSize: 14,
  },
  sampleListItemChevron: {
    fontSize: 20,
    fontWeight: '600',
  },
  customizationButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  customizationButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default ThemeCustomizationExample; 