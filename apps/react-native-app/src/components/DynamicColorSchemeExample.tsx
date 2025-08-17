/**
 * Dynamic Color Scheme Example for React Native
 *
 * Comprehensive example demonstrating dynamic color scheme support
 * with automatic adaptation to system appearance changes.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import {
  useDynamicTheme,
  DynamicColorKey,
  DynamicTheme
} from '../theme/DynamicColorScheme';

const { width: screenWidth } = Dimensions.get('window');

// MARK: - Dynamic Color Scheme Example

/**
 * Main component demonstrating dynamic color scheme support
 */
const DynamicColorSchemeExample: React.FC = () => {
  const {
    currentTheme,
    availableThemes,
    colorScheme,
    isHighContrastEnabled,
    setTheme,
    getColor,
    getDynamicColor,
    exportTheme,
    importTheme
  } = useDynamicTheme();

  const [showingDebugInfo, setShowingDebugInfo] = useState(false);

  // MARK: - Header Section

  const renderHeaderSection = () => (
    <View style={styles.section}>
      <Text style={[styles.largeTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Dynamic Color Scheme
      </Text>
      <Text style={[styles.bodyText, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
        Experience automatic adaptation to system appearance changes including light, dark, and high contrast modes.
      </Text>

      {/* Current theme indicator */}
      <View style={[styles.themeIndicator, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
        <View style={[styles.themeDot, { backgroundColor: getColor(DynamicColorKey.PRIMARY) }]} />
        <Text style={[styles.themeText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
          Current: {currentTheme.name}
        </Text>
        <View style={styles.spacer} />
        <Text style={[styles.durationText, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
          v{currentTheme.version}
        </Text>
      </View>
    </View>
  );

  // MARK: - Appearance Info Section

  const renderAppearanceInfoSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Current Appearance
      </Text>

      <View style={styles.appearanceContainer}>
        {/* Color Scheme */}
        <View style={styles.appearanceItem}>
          <Text style={[styles.appearanceIcon, { color: getColor(DynamicColorKey.PRIMARY) }]}>
            {colorScheme === 'dark' ? '🌙' : '☀️'}
          </Text>
          <Text style={[styles.appearanceText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
            {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>

        {/* High Contrast */}
        <View style={styles.appearanceItem}>
          <Text style={[styles.appearanceIcon, { color: getColor(DynamicColorKey.SECONDARY) }]}>
            {isHighContrastEnabled ? '🔍' : '👁️'}
          </Text>
          <Text style={[styles.appearanceText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
            {isHighContrastEnabled ? 'High Contrast' : 'Standard'}
          </Text>
        </View>

        {/* Dynamic Colors */}
        <View style={styles.appearanceItem}>
          <Text style={[styles.appearanceIcon, { color: getColor(DynamicColorKey.ACCENT) }]}>
            🎨
          </Text>
          <Text style={[styles.appearanceText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
            Dynamic
          </Text>
        </View>
      </View>
    </View>
  );

  // MARK: - Theme Selection Section

  const renderThemeSelectionSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Available Themes
      </Text>

      <View style={styles.themeGrid}>
        {availableThemes.map((theme) => (
          <DynamicThemeCard
            key={theme.id}
            theme={theme}
            isSelected={currentTheme.id === theme.id}
            onPress={() => setTheme(theme)}
            getColor={getColor}
          />
        ))}
      </View>
    </View>
  );

  // MARK: - Dynamic Color Preview Section

  const renderDynamicColorPreviewSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Dynamic Color Preview
      </Text>

      <View style={styles.colorPreviewContainer}>
        {Object.values(DynamicColorKey).map((colorKey) => (
          <DynamicColorPreviewRow
            key={colorKey}
            colorKey={colorKey}
            getColor={getColor}
            getDynamicColor={getDynamicColor}
          />
        ))}
      </View>
    </View>
  );

  // MARK: - Color Palette Section

  const renderColorPaletteSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Color Palette
      </Text>

      <View style={styles.colorPaletteGrid}>
        {Object.values(DynamicColorKey).map((colorKey) => (
          <DynamicColorSwatch
            key={colorKey}
            colorKey={colorKey}
            getColor={getColor}
          />
        ))}
      </View>
    </View>
  );

  // MARK: - Live Preview Section

  const renderLivePreviewSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Live Preview
      </Text>

      <View style={styles.previewContainer}>
        {/* Sample Card */}
        <View style={[styles.sampleCard, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: getColor(DynamicColorKey.PRIMARY) }]} />
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
                Sample Card
              </Text>
              <Text style={[styles.cardSubtitle, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
                This card adapts to your system appearance
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: getColor(DynamicColorKey.PRIMARY) }]}
              onPress={() => Alert.alert('Action', 'Button pressed!')}
            >
              <Text style={[styles.cardButtonText, { color: getColor(DynamicColorKey.SURFACE) }]}>
                Action
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.cardDivider, { backgroundColor: getColor(DynamicColorKey.BORDER) }]} />

          <View style={styles.cardStatusContainer}>
            <View style={styles.statusItem}>
              <Text style={[styles.statusIcon, { color: getColor(DynamicColorKey.SUCCESS) }]}>
                ✓
              </Text>
              <Text style={[styles.statusText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
                Success
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={[styles.statusIcon, { color: getColor(DynamicColorKey.WARNING) }]}>
                ⚠️
              </Text>
              <Text style={[styles.statusText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
                Warning
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={[styles.statusIcon, { color: getColor(DynamicColorKey.ERROR) }]}>
                ✗
              </Text>
              <Text style={[styles.statusText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
                Error
              </Text>
            </View>
          </View>
        </View>

        {/* Status Indicators */}
        <View style={styles.statusIndicatorsContainer}>
          <StatusIndicator
            title="Primary"
            color={getColor(DynamicColorKey.PRIMARY)}
            getColor={getColor}
          />
          <StatusIndicator
            title="Secondary"
            color={getColor(DynamicColorKey.SECONDARY)}
            getColor={getColor}
          />
          <StatusIndicator
            title="Accent"
            color={getColor(DynamicColorKey.ACCENT)}
            getColor={getColor}
          />
        </View>
      </View>
    </View>
  );

  // MARK: - Controls Section

  const renderControlsSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Controls
      </Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: getColor(DynamicColorKey.PRIMARY) }]}
          onPress={() => Alert.alert('Edit Theme', 'Theme editor would open here')}
        >
          <Text style={[styles.buttonText, { color: getColor(DynamicColorKey.SURFACE) }]}>
            Edit Theme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: getColor(DynamicColorKey.PRIMARY) }]}
          onPress={() => exportCurrentTheme()}
        >
          <Text style={[styles.buttonText, { color: getColor(DynamicColorKey.PRIMARY) }]}>
            Export Theme
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // MARK: - Debug Info Section

  const renderDebugInfoSection = () => (
    <View style={[styles.section, { backgroundColor: getColor(DynamicColorKey.SURFACE) }]}>
      <Text style={[styles.sectionTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        Debug Information
      </Text>

      <View style={styles.debugContainer}>
        <DebugInfoRow
          label="Current Theme"
          value={currentTheme.name}
          getColor={getColor}
        />
        <DebugInfoRow
          label="Color Scheme"
          value={colorScheme || 'Unknown'}
          getColor={getColor}
        />
        <DebugInfoRow
          label="High Contrast"
          value={isHighContrastEnabled ? 'Enabled' : 'Disabled'}
          getColor={getColor}
        />
        <DebugInfoRow
          label="Theme Version"
          value={currentTheme.version}
          getColor={getColor}
        />
        <DebugInfoRow
          label="Available Themes"
          value={availableThemes.length.toString()}
          getColor={getColor}
        />
      </View>
    </View>
  );

  // MARK: - Helper Methods

  const exportCurrentTheme = () => {
    const jsonString = exportTheme(currentTheme);
    if (jsonString) {
      Alert.alert('Theme Exported', 'Theme JSON copied to console');
      console.log('Exported theme JSON:', jsonString);
    } else {
      Alert.alert('Export Failed', 'Failed to export theme');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: getColor(DynamicColorKey.BACKGROUND) }]}
      contentContainerStyle={styles.contentContainer}
    >
      {renderHeaderSection()}
      {renderAppearanceInfoSection()}
      {renderThemeSelectionSection()}
      {renderDynamicColorPreviewSection()}
      {renderColorPaletteSection()}
      {renderLivePreviewSection()}
      {renderControlsSection()}
      {showingDebugInfo && renderDebugInfoSection()}
    </ScrollView>
  );
};

// MARK: - Supporting Components

interface DynamicThemeCardProps {
  theme: DynamicTheme;
  isSelected: boolean;
  onPress: () => void;
  getColor: (colorKey: DynamicColorKey) => string;
}

const DynamicThemeCard: React.FC<DynamicThemeCardProps> = ({
  theme,
  isSelected,
  onPress,
  getColor
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.themeCard,
        {
          backgroundColor: isSelected
            ? `${getColor(DynamicColorKey.PRIMARY) }20`
            : getColor(DynamicColorKey.SURFACE),
          borderColor: isSelected
            ? getColor(DynamicColorKey.PRIMARY)
            : getColor(DynamicColorKey.BORDER)
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.themePreview}>
        <View style={[styles.themeColorDot, { backgroundColor: theme.primaryColor.light }]} />
        <View style={[styles.themeColorDot, { backgroundColor: theme.secondaryColor.light }]} />
        <View style={[styles.themeColorDot, { backgroundColor: theme.accentColor.light }]} />
      </View>

      <Text style={[styles.themeName, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        {theme.name}
      </Text>

      {theme.description && (
        <Text style={[styles.themeDescription, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
          {theme.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

interface DynamicColorPreviewRowProps {
  colorKey: DynamicColorKey;
  getColor: (colorKey: DynamicColorKey) => string;
  getDynamicColor: (colorKey: DynamicColorKey) => any;
}

const DynamicColorPreviewRow: React.FC<DynamicColorPreviewRowProps> = ({
  colorKey,
  getColor,
  getDynamicColor
}) => {
  const dynamicColor = getDynamicColor(colorKey);
  const colorKeyName = colorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  return (
    <View style={styles.colorPreviewRow}>
      <View style={[styles.colorPreviewDot, { backgroundColor: getColor(colorKey) }]} />
      <View style={styles.colorPreviewText}>
        <Text style={[styles.colorPreviewTitle, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
          {colorKeyName}
        </Text>
        <Text style={[styles.colorPreviewDescription, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
          Light: {dynamicColor.light}, Dark: {dynamicColor.dark}
        </Text>
      </View>
    </View>
  );
};

interface DynamicColorSwatchProps {
  colorKey: DynamicColorKey;
  getColor: (colorKey: DynamicColorKey) => string;
}

const DynamicColorSwatch: React.FC<DynamicColorSwatchProps> = ({ colorKey, getColor }) => {
  const colorKeyName = colorKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  return (
    <View style={styles.colorSwatch}>
      <View style={[styles.colorSwatchDot, { backgroundColor: getColor(colorKey) }]} />
      <Text style={[styles.colorSwatchText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        {colorKeyName}
      </Text>
    </View>
  );
};

interface StatusIndicatorProps {
  title: string;
  color: string;
  getColor: (colorKey: DynamicColorKey) => string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ title, color, getColor }) => {
  return (
    <View style={styles.statusIndicator}>
      <View style={[styles.statusIndicatorDot, { backgroundColor: color }]} />
      <Text style={[styles.statusIndicatorText, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
        {title}
      </Text>
    </View>
  );
};

interface DebugInfoRowProps {
  label: string;
  value: string;
  getColor: (colorKey: DynamicColorKey) => string;
}

const DebugInfoRow: React.FC<DebugInfoRowProps> = ({ label, value, getColor }) => (
  <View style={styles.debugRow}>
    <Text style={[styles.debugLabel, { color: getColor(DynamicColorKey.TEXT_SECONDARY) }]}>
      {label}
    </Text>
    <Text style={[styles.debugValue, { color: getColor(DynamicColorKey.TEXT_PRIMARY) }]}>
      {value}
    </Text>
  </View>
);

// MARK: - Styles

const styles = StyleSheet.create({
  appearanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  appearanceIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  appearanceItem: {
    alignItems: 'center'
  },
  appearanceText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center'
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  cardButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: '500'
  },
  cardDivider: {
    height: 1,
    marginBottom: 16
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  cardIcon: {
    borderRadius: 20,
    height: 40,
    marginRight: 12,
    width: 40
  },
  cardStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  cardTextContainer: {
    flex: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  colorPaletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  colorPreviewContainer: {
    gap: 12
  },
  colorPreviewDescription: {
    fontSize: 12,
    marginTop: 2
  },
  colorPreviewDot: {
    borderRadius: 12,
    height: 24,
    marginRight: 12,
    width: 24
  },
  colorPreviewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8
  },
  colorPreviewText: {
    flex: 1
  },
  colorPreviewTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  colorSwatch: {
    alignItems: 'center',
    marginBottom: 16,
    width: (screenWidth - 80) / 4
  },
  colorSwatchDot: {
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    marginBottom: 8,
    width: 40
  },
  colorSwatchText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center'
  },
  container: {
    flex: 1
  },
  contentContainer: {
    padding: 16
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  debugContainer: {
    gap: 8
  },
  debugLabel: {
    fontSize: 12
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  debugValue: {
    fontSize: 12,
    fontWeight: '500'
  },
  durationText: {
    fontSize: 12
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  previewContainer: {
    gap: 16
  },
  primaryButton: {
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  sampleCard: {
    borderRadius: 12,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  secondaryButton: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  section: {
    borderRadius: 16,
    elevation: 4,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16
  },
  spacer: {
    flex: 1
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 4
  },
  statusIndicator: {
    alignItems: 'center'
  },
  statusIndicatorDot: {
    borderRadius: 8,
    height: 16,
    marginBottom: 4,
    width: 16
  },
  statusIndicatorText: {
    fontSize: 10,
    fontWeight: '500'
  },
  statusIndicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statusItem: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  statusText: {
    fontSize: 12
  },
  themeCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    width: (screenWidth - 64) / 2
  },
  themeColorDot: {
    borderRadius: 10,
    height: 20,
    marginHorizontal: 4,
    width: 20
  },
  themeDescription: {
    fontSize: 10,
    textAlign: 'center'
  },
  themeDot: {
    borderRadius: 10,
    height: 20,
    marginRight: 12,
    width: 20
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  themeIndicator: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center'
  },
  themePreview: {
    flexDirection: 'row',
    marginBottom: 12
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600'
  }
});

export default DynamicColorSchemeExample;
