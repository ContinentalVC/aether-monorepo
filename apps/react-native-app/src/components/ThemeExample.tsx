import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemeProvider, useTheme, getAvailableThemes } from '../theme/ThemeProvider';
import { AetherGlassCard } from './AetherGlassCard.styled';

// MARK: - Theme Switcher Component

/// Component for switching between different themes
const ThemeSwitcher: React.FC = () => {
  const { theme, themeName, switchTheme, toggleDarkMode, isDarkMode } = useTheme();
  const availableThemes = getAvailableThemes();
  
  return (
    <AetherGlassCard
      title="Theme Controls"
      subtitle="Switch between different themes and toggle dark mode"
      variant="elevated"
      size="medium"
      style={{ marginBottom: 16 }}
    >
      <View style={{ gap: 12 }}>
        {/* Theme Selection */}
        <View>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Available Themes
          </Text>
          <View style={styles.themeGrid}>
            {availableThemes.map((themeKey) => (
              <TouchableOpacity
                key={themeKey}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeKey === themeName ? theme.primary : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => switchTheme(themeKey)}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color: themeKey === themeName ? 'white' : theme.textPrimary,
                    },
                  ]}
                >
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Dark Mode Toggle */}
        <View>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Dark Mode
          </Text>
          <TouchableOpacity
            style={[
              styles.darkModeButton,
              {
                backgroundColor: isDarkMode ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={toggleDarkMode}
          >
            <Text
              style={[
                styles.darkModeButtonText,
                {
                  color: isDarkMode ? 'white' : theme.textPrimary,
                },
              ]}
            >
              {isDarkMode ? 'Dark Mode On' : 'Dark Mode Off'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Current Theme Info */}
        <View>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Current Theme
          </Text>
          <Text style={[styles.themeInfo, { color: theme.textSecondary }]}>
            Name: {themeName}
          </Text>
          <Text style={[styles.themeInfo, { color: theme.textSecondary }]}>
            Mode: {isDarkMode ? 'Dark' : 'Light'}
          </Text>
        </View>
      </View>
    </AetherGlassCard>
  );
};

// MARK: - Card Examples Component

/// Component showing different card variants and examples
const CardExamples: React.FC = () => {
  const { theme } = useTheme();
  
  const handleCardPress = (variant: string) => {
    Alert.alert('Card Pressed', `You pressed the ${variant} card!`);
  };
  
  const handleActionPress = (action: string) => {
    Alert.alert('Action Pressed', `You pressed: ${action}`);
  };
  
  return (
    <View style={{ gap: 16 }}>
      {/* Default Card */}
      <AetherGlassCard
        title="Default Glass Card"
        subtitle="A beautiful glass-morphism design"
        description="This card uses the default theme styling with a subtle glass effect and elegant shadows."
        badge="New"
        variant="default"
        size="medium"
        onPress={() => handleCardPress('default')}
        actions={[
          {
            label: 'Learn More',
            onPress: () => handleActionPress('Learn More'),
            type: 'primary',
          },
          {
            label: 'Dismiss',
            onPress: () => handleActionPress('Dismiss'),
            type: 'outline',
          },
        ]}
      />
      
      {/* Elevated Card */}
      <AetherGlassCard
        title="Elevated Card"
        subtitle="More prominent styling"
        description="This elevated variant has stronger shadows and more prominent borders for a premium feel."
        badge="Premium"
        badgeType="success"
        variant="elevated"
        size="medium"
        onPress={() => handleCardPress('elevated')}
        actions={[
          {
            label: 'Upgrade',
            onPress: () => handleActionPress('Upgrade'),
            type: 'primary',
          },
          {
            label: 'Details',
            onPress: () => handleActionPress('Details'),
            type: 'secondary',
          },
        ]}
      />
      
      {/* Subtle Card */}
      <AetherGlassCard
        title="Subtle Card"
        subtitle="Minimal and clean"
        description="A subtle variant with lighter colors and minimal visual impact for secondary content."
        badge="Info"
        badgeType="info"
        variant="subtle"
        size="medium"
        onPress={() => handleCardPress('subtle')}
        actions={[
          {
            label: 'View',
            onPress: () => handleActionPress('View'),
            type: 'outline',
          },
        ]}
      />
      
      {/* Small Card */}
      <AetherGlassCard
        title="Small Card"
        subtitle="Compact design"
        description="Perfect for lists and compact layouts."
        size="small"
        onPress={() => handleCardPress('small')}
      />
      
      {/* Large Card with Custom Content */}
      <AetherGlassCard
        title="Large Card with Custom Content"
        subtitle="Showcasing children content"
        description="This card demonstrates how to include custom React components as children."
        variant="elevated"
        size="large"
        onPress={() => handleCardPress('large')}
      >
        <View style={[styles.customContent, { backgroundColor: theme.backgroundSecondary }]}>
          <Text style={[styles.customContentText, { color: theme.textPrimary }]}>
            This is custom content inside the card. You can add any React components here!
          </Text>
          <View style={[styles.colorPalette, { borderColor: theme.border }]}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.primary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.secondary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.success }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.warning }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.error }]} />
          </View>
        </View>
      </AetherGlassCard>
      
      {/* Error Card */}
      <AetherGlassCard
        title="Error Card"
        subtitle="Something went wrong"
        description="This card demonstrates error styling with appropriate colors and messaging."
        badge="Error"
        badgeType="error"
        variant="elevated"
        size="medium"
        onPress={() => handleCardPress('error')}
        actions={[
          {
            label: 'Retry',
            onPress: () => handleActionPress('Retry'),
            type: 'primary',
          },
          {
            label: 'Report',
            onPress: () => handleActionPress('Report'),
            type: 'outline',
          },
        ]}
      />
    </View>
  );
};

// MARK: - Main Example Component

/// Main example component that demonstrates theme integration
export const ThemeExample: React.FC = () => {
  return (
    <ThemeProvider initialTheme="light">
      <ThemeExampleContent />
    </ThemeProvider>
  );
};

/// Inner content component that uses the theme context
const ThemeExampleContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Theme Integration Example
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Demonstrating styled-components ThemeProvider with AetherGlassCard
        </Text>
      </View>
      
      {/* Theme Switcher */}
      <ThemeSwitcher />
      
      {/* Card Examples */}
      <CardExamples />
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textTertiary }]}>
          All cards automatically adapt to the selected theme
        </Text>
      </View>
    </ScrollView>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  darkModeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  darkModeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  customContent: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  customContentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

// MARK: - Type Exports

// No additional type exports needed 