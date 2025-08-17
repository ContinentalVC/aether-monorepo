//
// ThemeTransitionExample.tsx
// Aether React Native App
//
// Comprehensive example demonstrating dynamic theme transitions with smooth animations.
// This component showcases various transition types, animation curves, and system integration.
//

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AetherGlassCard } from './AetherGlassCard.styled';
import {
  useThemeTransition,
  ThemeTransitionType,
  ThemeAnimationCurve,
  TransitionDirection,
  TransitionTypeLabels,
  TransitionTypeDescriptions,
  AnimationCurveLabels,
  DirectionLabels,
  getTransitionStyle
} from '../theme/ThemeTransitionManager';

// MARK: - Theme Transition Example Component

/**
 * Main component demonstrating theme transitions with animations
 */
export const ThemeTransitionExample: React.FC = () => {
  const { theme, themeName, switchTheme } = useTheme();
  const {
    transitionState,
    transitionToTheme,
    getTransitionProgress,
    isTransitioning
  } = useThemeTransition();

  const [selectedTransitionType, setSelectedTransitionType] = useState<ThemeTransitionType>(
    ThemeTransitionType.FADE
  );
  const [selectedAnimationCurve, setSelectedAnimationCurve] = useState<ThemeAnimationCurve>(
    ThemeAnimationCurve.EASE_IN_OUT
  );
  const [selectedDirection, setSelectedDirection] = useState<TransitionDirection>(
    TransitionDirection.RIGHT
  );
  const [showingDebugInfo, setShowingDebugInfo] = useState(false);

  const availableThemes = ['light', 'dark']; // Simplified for now

  // MARK: - Theme Transition Handlers

  const handleThemeTransition = useCallback(
    (newThemeName: string) => {
      const newTheme = getTheme(newThemeName);
      if (newTheme) {
        transitionToTheme(
          theme,
          newTheme,
          selectedTransitionType,
          selectedAnimationCurve,
          selectedDirection,
          () => {
            // Apply the theme change after transition completes
            switchTheme(newThemeName as any);
          }
        );
      }
    },
    [
      theme,
      selectedTransitionType,
      selectedAnimationCurve,
      selectedDirection,
      transitionToTheme,
      switchTheme
    ]
  );

  const performQuickDemo = useCallback(() => {
    const themes = ['light', 'dark', 'purple'];
    const types = [ThemeTransitionType.FADE, ThemeTransitionType.SLIDE, ThemeTransitionType.SCALE];

    themes.forEach((themeName, index) => {
      setTimeout(() => {
        const newTheme = getTheme(themeName);
        if (newTheme) {
          transitionToTheme(
            theme,
            newTheme,
            types[index % types.length],
            ThemeAnimationCurve.SPRING,
            TransitionDirection.RIGHT,
            () => {
              switchTheme(themeName as any);
            }
          );
        }
      }, index * 1500);
    });
  }, [theme, transitionToTheme, switchTheme]);

  const performSequenceDemo = useCallback(() => {
    const sequence: Array<{
      themeName: string;
      type: ThemeTransitionType;
      curve: ThemeAnimationCurve;
    }> = [
      { themeName: 'light', type: ThemeTransitionType.FADE, curve: ThemeAnimationCurve.EASE_IN_OUT },
      { themeName: 'dark', type: ThemeTransitionType.SLIDE, curve: ThemeAnimationCurve.SPRING },
      { themeName: 'purple', type: ThemeTransitionType.SCALE, curve: ThemeAnimationCurve.BOUNCY },
      { themeName: 'green', type: ThemeTransitionType.MORPH, curve: ThemeAnimationCurve.SMOOTH }
    ];

    sequence.forEach(({ themeName, type, curve }, index) => {
      setTimeout(() => {
        const newTheme = getTheme(themeName);
        if (newTheme) {
          transitionToTheme(
            theme,
            newTheme,
            type,
            curve,
            TransitionDirection.RIGHT,
            () => {
              switchTheme(themeName as any);
            }
          );
        }
      }, index * 2000);
    });
  }, [theme, transitionToTheme, switchTheme]);

  // MARK: - Helper Functions

  const getTheme = (themeName: string) => {
    // This would typically come from your theme provider
    // For now, we'll use a simple mapping
    const themeMap: Record<string, any> = {
      light: { primary: '#3B82F6', background: '#F8FAFC', textPrimary: '#1E293B' },
      dark: { primary: '#60A5FA', background: '#0F172A', textPrimary: '#F8FAFC' },
      purple: { primary: '#8B5CF6', background: '#FAF5FF', textPrimary: '#1E1B4B' },
      green: { primary: '#10B981', background: '#F0FDF4', textPrimary: '#064E3B' }
    };
    return themeMap[themeName];
  };

  // MARK: - Render Methods

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Dynamic Theme Transitions
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Experience smooth, animated theme switching with various transition effects and animation curves.
      </Text>

      {/* Current theme indicator */}
      <View style={[styles.themeIndicator, { backgroundColor: theme.surface }]}>
        <View style={[styles.themeDot, { backgroundColor: theme.primary }]} />
        <Text style={[styles.themeName, { color: theme.textPrimary }]}>
          Current: {themeName}
        </Text>
      </View>
    </View>
  );

  const renderTransitionControls = () => (
    <AetherGlassCard
      title="Transition Controls"
      subtitle="Configure transition type and animation curve"
      variant="elevated"
      size="medium"
      style={styles.card}
    >
      {/* Transition Type Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Transition Type
        </Text>
        <View style={styles.grid}>
          {Object.values(ThemeTransitionType).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.controlButton,
                {
                  backgroundColor:
                    selectedTransitionType === type ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setSelectedTransitionType(type)}
            >
              <Text style={[styles.controlButtonText, { color: theme.textPrimary }]}>
                {TransitionTypeLabels[type]}
              </Text>
              <Text style={[styles.controlButtonDescription, { color: theme.textSecondary }]}>
                {TransitionTypeDescriptions[type]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Animation Curve Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Animation Curve
        </Text>
        <View style={styles.grid}>
          {Object.values(ThemeAnimationCurve).map((curve) => (
            <TouchableOpacity
              key={curve}
              style={[
                styles.controlButton,
                {
                  backgroundColor:
                    selectedAnimationCurve === curve ? theme.primary : theme.surface,
                  borderColor: theme.border
                }
              ]}
              onPress={() => setSelectedAnimationCurve(curve)}
            >
              <Text style={[styles.controlButtonText, { color: theme.textPrimary }]}>
                {AnimationCurveLabels[curve]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Direction Selection (for slide transitions) */}
      {selectedTransitionType === ThemeTransitionType.SLIDE && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Slide Direction
          </Text>
          <View style={styles.directionRow}>
            {Object.values(TransitionDirection).map((direction) => (
              <TouchableOpacity
                key={direction}
                style={[
                  styles.directionButton,
                  {
                    backgroundColor:
                      selectedDirection === direction ? theme.primary : theme.surface,
                    borderColor: theme.border
                  }
                ]}
                onPress={() => setSelectedDirection(direction)}
              >
                <Text style={[styles.directionButtonText, { color: theme.textPrimary }]}>
                  {DirectionLabels[direction]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </AetherGlassCard>
  );

  const renderThemeSelection = () => (
    <AetherGlassCard
      title="Available Themes"
      subtitle="Select a theme to transition to"
      variant="elevated"
      size="medium"
      style={styles.card}
    >
      <View style={styles.themeGrid}>
        {availableThemes.map((themeName) => (
          <TouchableOpacity
            key={themeName}
            style={[
              styles.themeButton,
              {
                backgroundColor:
                  themeName === themeName ? `${theme.primary }20` : theme.surface,
                borderColor: themeName === themeName ? theme.primary : theme.border
              }
            ]}
            onPress={() => handleThemeTransition(themeName)}
            disabled={isTransitioning()}
          >
            <View style={[styles.themeColorDot, { backgroundColor: getThemeColor(themeName) }]} />
            <Text style={[styles.themeButtonText, { color: theme.textPrimary }]}>
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </AetherGlassCard>
  );

  const renderLivePreview = () => (
    <AetherGlassCard
      title="Live Preview"
      subtitle="See the current theme applied"
      variant="elevated"
      size="medium"
      style={styles.card}
    >
      <Animated.View
        style={[
          styles.previewCard,
          { backgroundColor: theme.surface },
          getTransitionStyle(
            selectedTransitionType,
            getTransitionProgress(),
            selectedDirection
          ) as any
        ]}
      >
        <View style={styles.previewHeader}>
          <View style={[styles.previewIcon, { backgroundColor: theme.primary }]} />
          <View style={styles.previewContent}>
            <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
              Preview Card
            </Text>
            <Text style={[styles.previewSubtitle, { color: theme.textSecondary }]}>
              This card shows the current theme colors
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.previewButton, { backgroundColor: theme.primary }]}
            onPress={() => Alert.alert('Action', 'Demo action pressed!')}
          >
            <Text style={styles.previewButtonText}>Action</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.previewDivider, { backgroundColor: theme.border }]} />

        <View style={styles.previewColors}>
          <View style={styles.colorItem}>
            <View style={[styles.colorDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.colorLabel, { color: theme.textSecondary }]}>Primary</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorDot, { backgroundColor: theme.secondary }]} />
            <Text style={[styles.colorLabel, { color: theme.textSecondary }]}>Secondary</Text>
          </View>
          <View style={styles.colorItem}>
            <View style={[styles.colorDot, { backgroundColor: theme.success }]} />
            <Text style={[styles.colorLabel, { color: theme.textSecondary }]}>Success</Text>
          </View>
        </View>
      </Animated.View>
    </AetherGlassCard>
  );

  const renderTransitionDemo = () => (
    <AetherGlassCard
      title="Transition Demo"
      subtitle="Try different transition sequences"
      variant="elevated"
      size="medium"
      style={styles.card}
    >
      <View style={styles.demoButtons}>
        <TouchableOpacity
          style={[styles.demoButton, { backgroundColor: theme.primary }]}
          onPress={performQuickDemo}
          disabled={isTransitioning()}
        >
          <Text style={styles.demoButtonText}>Quick Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.demoButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
          onPress={performSequenceDemo}
          disabled={isTransitioning()}
        >
          <Text style={[styles.demoButtonText, { color: theme.primary }]}>Sequence Demo</Text>
        </TouchableOpacity>
      </View>

      {/* Transition status */}
      {isTransitioning() && (
        <View style={[styles.transitionStatus, { backgroundColor: theme.surface }]}>
          <Text style={[styles.transitionStatusText, { color: theme.textSecondary }]}>
            Transitioning...
          </Text>
        </View>
      )}
    </AetherGlassCard>
  );

  const renderDebugInfo = () => {
    if (!showingDebugInfo) return null;

    return (
      <AetherGlassCard
        title="Debug Information"
        subtitle="Technical details about the transition"
        variant="elevated"
        size="medium"
        style={styles.card}
      >
        <View style={styles.debugInfo}>
          <DebugInfoRow label="Transition Type" value={selectedTransitionType} theme={theme} />
          <DebugInfoRow label="Animation Curve" value={selectedAnimationCurve} theme={theme} />
          <DebugInfoRow label="Is Transitioning" value={isTransitioning() ? 'Yes' : 'No'} theme={theme} />
          <DebugInfoRow label="Reduce Motion" value={transitionState.shouldReduceMotion ? 'Enabled' : 'Disabled'} theme={theme} />
          <DebugInfoRow label="Reduce Transparency" value={transitionState.shouldReduceTransparency ? 'Enabled' : 'Disabled'} theme={theme} />
        </View>
      </AetherGlassCard>
    );
  };

  // MARK: - Helper Functions

  const getThemeColor = (themeName: string): string => {
    const colorMap: Record<string, string> = {
      light: '#3B82F6',
      dark: '#6B7280',
      purple: '#8B5CF6',
      green: '#10B981'
    };
    return colorMap[themeName] || '#3B82F6';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {renderHeader()}
        {renderTransitionControls()}
        {renderThemeSelection()}
        {renderLivePreview()}
        {renderTransitionDemo()}
        {renderDebugInfo()}
      </View>
    </ScrollView>
  );
};

// MARK: - Supporting Components

/**
 * Debug information row component
 */
const DebugInfoRow: React.FC<{
  label: string;
  value: string;
  theme: any;
}> = ({ label, value, theme }) => (
  <View style={styles.debugRow}>
    <Text style={[styles.debugLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.debugValue, { color: theme.textPrimary }]}>{value}</Text>
  </View>
);

// MARK: - Styles

const styles = StyleSheet.create({
  card: {
    marginBottom: 16
  },
  colorDot: {
    borderRadius: 10,
    height: 20,
    width: 20
  },
  colorItem: {
    alignItems: 'center',
    gap: 4
  },
  colorLabel: {
    fontSize: 12
  },
  container: {
    flex: 1
  },
  content: {
    gap: 24,
    padding: 16
  },
  controlButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
    padding: 12
  },
  controlButtonDescription: {
    fontSize: 12,
    textAlign: 'center'
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  debugInfo: {
    gap: 8
  },
  debugLabel: {
    fontSize: 14
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  debugValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  demoButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12
  },
  directionButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  directionButtonText: {
    fontSize: 14,
    fontWeight: '500'
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  headerSection: {
    alignItems: 'center',
    gap: 16
  },
  previewButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  previewCard: {
    borderRadius: 12,
    elevation: 2,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  previewColors: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  previewContent: {
    flex: 1
  },
  previewDivider: {
    height: 1,
    marginVertical: 12
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12
  },
  previewIcon: {
    borderRadius: 20,
    height: 40,
    marginRight: 12,
    width: 40
  },
  previewSubtitle: {
    fontSize: 14
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center'
  },
  themeButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    gap: 8,
    minWidth: '45%',
    padding: 16
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  themeColorDot: {
    borderRadius: 20,
    height: 40,
    width: 40
  },
  themeDot: {
    borderRadius: 10,
    height: 20,
    marginRight: 8,
    width: 20
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
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
    fontSize: 16,
    fontWeight: '600'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  transitionStatus: {
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 12,
    padding: 12
  },
  transitionStatusText: {
    fontSize: 14
  }
});
