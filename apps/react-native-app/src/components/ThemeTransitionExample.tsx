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
  Animated,
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
  getTransitionStyle,
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
    isTransitioning,
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
      switchTheme,
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
      { themeName: 'green', type: ThemeTransitionType.MORPH, curve: ThemeAnimationCurve.SMOOTH },
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
      green: { primary: '#10B981', background: '#F0FDF4', textPrimary: '#064E3B' },
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
                  borderColor: theme.border,
                },
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
                  borderColor: theme.border,
                },
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
                    borderColor: theme.border,
                  },
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
                  themeName === themeName ? theme.primary + '20' : theme.surface,
                borderColor: themeName === themeName ? theme.primary : theme.border,
              },
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
          ) as any,
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
      green: '#10B981',
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
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  headerSection: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
    marginRight: 8,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  controlButtonDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  directionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  directionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  themeButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  themeColorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewSubtitle: {
    fontSize: 14,
  },
  previewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  previewDivider: {
    height: 1,
    marginVertical: 12,
  },
  previewColors: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorItem: {
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  colorLabel: {
    fontSize: 12,
  },
  demoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  demoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  demoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  transitionStatus: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  transitionStatusText: {
    fontSize: 14,
  },
  debugInfo: {
    gap: 8,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugLabel: {
    fontSize: 14,
  },
  debugValue: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 