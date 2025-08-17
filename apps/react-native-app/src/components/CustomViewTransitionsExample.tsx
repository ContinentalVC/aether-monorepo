/**
 * Custom View Transitions Example for React Native
 *
 * Comprehensive example demonstrating sophisticated custom view transitions
 * with asymmetric animations, transition container views, and complex effects.
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
  ActivityIndicator
} from 'react-native';
import {
  TransitionContainerView,
  AdvancedTransitionManager,
  useAdvancedTransitionManager,
  TransitionPreviewCard,
  CUSTOM_TRANSITION_TYPES,
  CustomTransitionType
} from '../theme/CustomViewTransitions';
import { useTheme, themes } from '../theme/ThemeProvider';

const { width: screenWidth } = Dimensions.get('window');

// MARK: - Custom View Transitions Example

/**
 * Main component demonstrating sophisticated custom view transitions
 */
const CustomViewTransitionsExample: React.FC = () => {
  const themeContext = useTheme();
  const theme = themeContext.theme;
  const { manager, state } = useAdvancedTransitionManager();
  const [selectedTransitionType, setSelectedTransitionType] = useState<CustomTransitionType>(
    CUSTOM_TRANSITION_TYPES[0]
  );
  const [showingDebugInfo, setShowingDebugInfo] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  const themeOptions = [
    themes.light,
    themes.dark
  ];

  // MARK: - Header Section

  const renderHeaderSection = () => (
    <View style={styles.section}>
      <Text style={[styles.largeTitle, { color: theme.textPrimary }]}>
        Sophisticated Custom Transitions
      </Text>
      <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
        Experience advanced asymmetric animations with transition container views that host both 'from' and 'to' states simultaneously for complex, overlapping effects.
      </Text>

      {/* Current theme indicator */}
      <View style={[styles.themeIndicator, { backgroundColor: theme.surface }]}>
        <View style={[styles.themeDot, { backgroundColor: theme.primary }]} />
        <Text style={[styles.themeText, { color: theme.textPrimary }]}>
          Current: {getThemeName(themeOptions[currentThemeIndex])}
        </Text>
        <View style={styles.spacer} />
        <Text style={[styles.durationText, { color: theme.textSecondary }]}>
          Duration: {selectedTransitionType.duration}ms
        </Text>
      </View>
    </View>
  );

  // MARK: - Transition Type Section

  const renderTransitionTypeSection = () => (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Custom Transition Types
      </Text>

      <View style={styles.transitionGrid}>
        {CUSTOM_TRANSITION_TYPES.map((type) => (
          <CustomTransitionTypeButton
            key={type.type}
            type={type}
            isSelected={selectedTransitionType.type === type.type}
            theme={theme}
            onPress={() => setSelectedTransitionType(type)}
          />
        ))}
      </View>
    </View>
  );

  // MARK: - Live Preview Section

  const renderLivePreviewSection = () => (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Live Preview with Container
      </Text>

      {/* Transition container with both views */}
      {state.isTransitioning && state.fromTheme && state.toTheme ? (
        <View style={styles.previewContainer}>
          {manager.createTransitionContainer(
            <TransitionPreviewCard
              theme={state.fromTheme}
              title="From Theme"
              subtitle="Outgoing state"
            />,
            <TransitionPreviewCard
              theme={state.toTheme}
              title="To Theme"
              subtitle="Incoming state"
            />,
            { height: 200 }
          )}
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <TransitionPreviewCard
            theme={theme}
            title="Current Theme"
            subtitle="Static preview"
            style={{ height: 200 }}
          />
        </View>
      )}

      {/* Progress indicator */}
      {state.isTransitioning && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${(state.transitionProgress as any)._value * 100}%`
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            Progress: {Math.round((state.transitionProgress as any)._value * 100)}%
          </Text>
        </View>
      )}
    </View>
  );

  // MARK: - Theme Selection Section

  const renderThemeSelectionSection = () => (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Available Themes
      </Text>

      <View style={styles.themeGrid}>
        {Object.entries(themes).map(([themeName, themeOption], index) => (
          <ThemeButton
            key={index}
            theme={themeOption}
            themeName={themeName}
            isSelected={currentThemeIndex === index}
            currentTheme={theme}
            onPress={() => performCustomTransition(themeOption, index)}
          />
        ))}
      </View>
    </View>
  );

  // MARK: - Advanced Controls Section

  const renderAdvancedControlsSection = () => (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Advanced Controls
      </Text>

      {/* Demo buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={performQuickDemo}
          disabled={state.isTransitioning}
        >
          <Text style={[styles.buttonText, { color: theme.surface }]}>
            Quick Demo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.primary }]}
          onPress={performSequenceDemo}
          disabled={state.isTransitioning}
        >
          <Text style={[styles.buttonText, { color: theme.primary }]}>
            Sequence Demo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transition status */}
      {state.isTransitioning && (
        <View style={[styles.statusContainer, { backgroundColor: theme.surface }]}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            Performing {selectedTransitionType.name}...
          </Text>
        </View>
      )}
    </View>
  );

  // MARK: - Debug Info Section

  const renderDebugInfoSection = () => (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Debug Information
      </Text>

      <View style={styles.debugContainer}>
        <DebugInfoRow
          label="Transition Type"
          value={selectedTransitionType.name}
          theme={theme}
        />
        <DebugInfoRow
          label="Duration"
          value={`${selectedTransitionType.duration}ms`}
          theme={theme}
        />
        <DebugInfoRow
          label="Is Transitioning"
          value={state.isTransitioning ? 'Yes' : 'No'}
          theme={theme}
        />
        <DebugInfoRow
          label="Progress"
          value={(state.transitionProgress as any)._value.toFixed(2)}
          theme={theme}
        />
        <DebugInfoRow
          label="From Theme"
          value={state.fromTheme ? 'Set' : 'None'}
          theme={theme}
        />
        <DebugInfoRow
          label="To Theme"
          value={state.toTheme ? 'Set' : 'None'}
          theme={theme}
        />
      </View>
    </View>
  );

  // MARK: - Helper Methods

  const getThemeName = (themeOption: any): string => {
    if (themeOption.primary === themes.light.primary) return 'Light';
    if (themeOption.primary === themes.dark.primary) return 'Dark';
    return 'Custom';
  };

  const performCustomTransition = (newTheme: any, index: number) => {
    manager.performCustomTransition(
      theme,
      newTheme,
      selectedTransitionType,
      () => {
        // Theme change would be handled by the theme provider
        setCurrentThemeIndex(index);
      }
    );
  };

  const performQuickDemo = () => {
    const demoSequence = [
      { theme: themes.light, type: CUSTOM_TRANSITION_TYPES[0] },
      { theme: themes.dark, type: CUSTOM_TRANSITION_TYPES[1] }
    ];

    demoSequence.forEach((item, index) => {
      setTimeout(() => {
        setSelectedTransitionType(item.type);
        performCustomTransition(item.theme, index);
      }, index * 2000);
    });
  };

  const performSequenceDemo = () => {
    const sequence = [
      { theme: themes.light, type: CUSTOM_TRANSITION_TYPES[0] },
      { theme: themes.dark, type: CUSTOM_TRANSITION_TYPES[1] }
    ];

    sequence.forEach((item, index) => {
      setTimeout(() => {
        setSelectedTransitionType(item.type);
        performCustomTransition(item.theme, index);
      }, index * 2500);
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {renderHeaderSection()}
      {renderTransitionTypeSection()}
      {renderLivePreviewSection()}
      {renderThemeSelectionSection()}
      {renderAdvancedControlsSection()}
      {showingDebugInfo && renderDebugInfoSection()}
    </ScrollView>
  );
};

// MARK: - Supporting Components

interface CustomTransitionTypeButtonProps {
  type: CustomTransitionType;
  isSelected: boolean;
  theme: any;
  onPress: () => void;
}

const CustomTransitionTypeButton: React.FC<CustomTransitionTypeButtonProps> = ({
  type,
  isSelected,
  theme,
  onPress
}) => {
  const getIconName = () => {
    switch (type.type) {
      case 'slideInOut': return '↔️';
      case 'scaleRotate': return '🔄';
      case 'morphBlur': return '✨';
      case 'crossfadeOverlap': return '📚';
      case 'dissolveParticle': return '💫';
      case 'flipCard': return '🃏';
      default: return '🎨';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.transitionTypeButton,
        {
          backgroundColor: isSelected ? theme.primary : theme.surface,
          borderColor: theme.border
        }
      ]}
      onPress={onPress}
    >
      <Text style={styles.transitionIcon}>{getIconName()}</Text>
      <Text
        style={[
          styles.transitionTypeTitle,
          { color: isSelected ? theme.surface : theme.textPrimary }
        ]}
      >
        {type.name}
      </Text>
      <Text
        style={[
          styles.transitionTypeDescription,
          { color: isSelected ? theme.surface : theme.textSecondary }
        ]}
      >
        {type.description}
      </Text>
      <Text
        style={[
          styles.transitionTypeDuration,
          { color: isSelected ? theme.surface : theme.textSecondary }
        ]}
      >
        {type.duration}ms
      </Text>
    </TouchableOpacity>
  );
};

interface ThemeButtonProps {
  theme: any;
  themeName: string;
  isSelected: boolean;
  currentTheme: any;
  onPress: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  theme: themeOption,
  themeName,
  isSelected,
  currentTheme,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.themeButton,
        {
          backgroundColor: isSelected ? `${currentTheme.primary }20` : currentTheme.surface,
          borderColor: isSelected ? currentTheme.primary : currentTheme.border
        }
      ]}
      onPress={onPress}
    >
      <View style={[styles.themeButtonIcon, { backgroundColor: themeOption.primary }]} />
      <Text
        style={[
          styles.themeButtonText,
          { color: currentTheme.textPrimary }
        ]}
      >
        {themeName}
      </Text>
    </TouchableOpacity>
  );
};

interface DebugInfoRowProps {
  label: string;
  value: string;
  theme: any;
}

const DebugInfoRow: React.FC<DebugInfoRowProps> = ({ label, value, theme }) => (
  <View style={styles.debugRow}>
    <Text style={[styles.debugLabel, { color: theme.textSecondary }]}>
      {label}
    </Text>
    <Text style={[styles.debugValue, { color: theme.textPrimary }]}>
      {value}
    </Text>
  </View>
);

// MARK: - Styles

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  container: {
    flex: 1
  },
  contentContainer: {
    padding: 16
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
    marginBottom: 16
  },
  primaryButton: {
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  progressBar: {
    borderRadius: 2,
    height: 4,
    marginBottom: 8,
    width: '100%'
  },
  progressContainer: {
    alignItems: 'center'
  },
  progressFill: {
    borderRadius: 2,
    height: '100%'
  },
  progressText: {
    fontSize: 12
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
  statusContainer: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12
  },
  statusText: {
    fontSize: 12,
    marginLeft: 8
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 16,
    paddingVertical: 12,
    width: (screenWidth - 80) / 3
  },
  themeButtonIcon: {
    borderRadius: 20,
    height: 40,
    marginBottom: 8,
    width: 40
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '500'
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
  themeText: {
    fontSize: 16,
    fontWeight: '600'
  },
  transitionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  transitionIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  transitionTypeButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    width: (screenWidth - 64) / 2
  },
  transitionTypeDescription: {
    fontSize: 10,
    marginBottom: 4,
    textAlign: 'center'
  },
  transitionTypeDuration: {
    fontSize: 10
  },
  transitionTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center'
  }
});

export default CustomViewTransitionsExample;
