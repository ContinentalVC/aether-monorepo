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
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useDynamicTheme,
  DynamicColorKey,
  DynamicTheme,
  createDynamicColor,
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
    importTheme,
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
  getColor,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.themeCard,
        {
          backgroundColor: isSelected 
            ? getColor(DynamicColorKey.PRIMARY) + '20' 
            : getColor(DynamicColorKey.SURFACE),
          borderColor: isSelected 
            ? getColor(DynamicColorKey.PRIMARY) 
            : getColor(DynamicColorKey.BORDER),
        },
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
  getDynamicColor,
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  themeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  durationText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  appearanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  appearanceItem: {
    alignItems: 'center',
  },
  appearanceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  appearanceText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: (screenWidth - 64) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  themePreview: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  themeColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 10,
    textAlign: 'center',
  },
  colorPreviewContainer: {
    gap: 12,
  },
  colorPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorPreviewDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  colorPreviewText: {
    flex: 1,
  },
  colorPreviewTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  colorPreviewDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  colorPaletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorSwatch: {
    width: (screenWidth - 80) / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  colorSwatchDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorSwatchText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  previewContainer: {
    gap: 16,
  },
  sampleCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cardButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cardButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    marginBottom: 16,
  },
  cardStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
  },
  statusIndicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusIndicator: {
    alignItems: 'center',
  },
  statusIndicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusIndicatorText: {
    fontSize: 10,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    gap: 8,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugLabel: {
    fontSize: 12,
  },
  debugValue: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default DynamicColorSchemeExample; 