/**
 * Custom View Transitions for React Native
 *
 * Sophisticated custom view transitions with asymmetric animations and
 * transition container views for complex, overlapping theme transitions.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Text
} from 'react-native';
import { useTheme } from './ThemeProvider';

// MARK: - Types and Interfaces

export interface CustomTransitionType {
  name: string;
  description: string;
  duration: number;
  type: 'slideInOut' | 'scaleRotate' | 'morphBlur' | 'crossfadeOverlap' | 'dissolveParticle' | 'flipCard';
}

export interface TransitionState {
  fromViewOpacity: Animated.Value;
  toViewOpacity: Animated.Value;
  fromViewOffset: Animated.ValueXY;
  toViewOffset: Animated.ValueXY;
  fromViewScale: Animated.Value;
  toViewScale: Animated.Value;
  fromViewRotation: Animated.Value;
  toViewRotation: Animated.Value;
  fromViewBlur: Animated.Value;
  toViewBlur: Animated.Value;
}

export interface TransitionContainerProps {
  fromView: React.ReactNode;
  toView: React.ReactNode;
  transitionProgress: Animated.Value;
  transitionType: CustomTransitionType;
  isTransitioning: boolean;
  style?: ViewStyle;
}

// MARK: - Custom Transition Types

export const CUSTOM_TRANSITION_TYPES: CustomTransitionType[] = [
  {
    name: 'Slide In/Out',
    description: 'Asymmetric slide with fade',
    duration: 800,
    type: 'slideInOut'
  },
  {
    name: 'Scale & Rotate',
    description: 'Scale and rotation combination',
    duration: 1000,
    type: 'scaleRotate'
  },
  {
    name: 'Morph & Blur',
    description: 'Morphing with blur effects',
    duration: 900,
    type: 'morphBlur'
  },
  {
    name: 'Crossfade Overlap',
    description: 'Overlapping crossfade',
    duration: 700,
    type: 'crossfadeOverlap'
  },
  {
    name: 'Dissolve Particle',
    description: 'Particle-like dissolve',
    duration: 600,
    type: 'dissolveParticle'
  },
  {
    name: 'Flip Card',
    description: '3D card flip effect',
    duration: 1200,
    type: 'flipCard'
  }
];

// MARK: - Transition Container View

/**
 * Container view that can host both "from" and "to" view states simultaneously
 * for complex, overlapping animations during theme transitions
 */
export const TransitionContainerView: React.FC<TransitionContainerProps> = ({
  fromView,
  toView,
  transitionProgress,
  transitionType,
  isTransitioning,
  style
}) => {
  const theme = useTheme();

  // Create animated values for transition states
  const [transitionState] = useState<TransitionState>(() => ({
    fromViewOpacity: new Animated.Value(1),
    toViewOpacity: new Animated.Value(0),
    fromViewOffset: new Animated.ValueXY({ x: 0, y: 0 }),
    toViewOffset: new Animated.ValueXY({ x: 0, y: 0 }),
    fromViewScale: new Animated.Value(1),
    toViewScale: new Animated.Value(1),
    fromViewRotation: new Animated.Value(0),
    toViewRotation: new Animated.Value(0),
    fromViewBlur: new Animated.Value(0),
    toViewBlur: new Animated.Value(0)
  }));

  const setupInitialState = useCallback(() => {
    switch (transitionType.type) {
      case 'slideInOut':
        transitionState.fromViewOffset.setValue({ x: 0, y: 0 });
        transitionState.toViewOffset.setValue({ x: 300, y: 0 });
        transitionState.fromViewOpacity.setValue(1);
        transitionState.toViewOpacity.setValue(0);
        break;
      case 'scaleRotate':
        transitionState.fromViewScale.setValue(1);
        transitionState.toViewScale.setValue(0.5);
        transitionState.fromViewRotation.setValue(0);
        transitionState.toViewRotation.setValue(180);
        break;
      case 'morphBlur':
        transitionState.fromViewOpacity.setValue(1);
        transitionState.toViewOpacity.setValue(0);
        transitionState.fromViewScale.setValue(1);
        transitionState.toViewScale.setValue(0.8);
        break;
      case 'crossfadeOverlap':
        transitionState.fromViewOpacity.setValue(1);
        transitionState.toViewOpacity.setValue(0);
        transitionState.fromViewOffset.setValue({ x: 0, y: 0 });
        transitionState.toViewOffset.setValue({ x: 50, y: 0 });
        break;
      case 'dissolveParticle':
        transitionState.fromViewOpacity.setValue(1);
        transitionState.toViewOpacity.setValue(0);
        transitionState.fromViewScale.setValue(1);
        transitionState.toViewScale.setValue(1.2);
        break;
      case 'flipCard':
        transitionState.fromViewRotation.setValue(0);
        transitionState.toViewRotation.setValue(90);
        transitionState.fromViewOpacity.setValue(1);
        transitionState.toViewOpacity.setValue(0);
        break;
    }
  }, [transitionType.type]);

  const updateTransitionState = useCallback((progress: number) => {
    switch (transitionType.type) {
      case 'slideInOut':
        transitionState.fromViewOffset.setValue({ x: -300 * progress, y: 0 });
        transitionState.toViewOffset.setValue({ x: 300 * (1 - progress), y: 0 });
        transitionState.fromViewOpacity.setValue(1 - progress);
        transitionState.toViewOpacity.setValue(progress);
        break;
      case 'scaleRotate':
        transitionState.fromViewScale.setValue(1 - (0.3 * progress));
        transitionState.toViewScale.setValue(0.5 + (0.5 * progress));
        transitionState.fromViewRotation.setValue(progress * 90);
        transitionState.toViewRotation.setValue(180 - (90 * progress));
        transitionState.fromViewOpacity.setValue(1 - progress);
        transitionState.toViewOpacity.setValue(progress);
        break;
      case 'morphBlur':
        transitionState.fromViewOpacity.setValue(1 - progress);
        transitionState.toViewOpacity.setValue(progress);
        transitionState.fromViewScale.setValue(1 - (0.1 * progress));
        transitionState.toViewScale.setValue(0.8 + (0.2 * progress));
        transitionState.fromViewBlur.setValue(2 * progress);
        transitionState.toViewBlur.setValue(2 * (1 - progress));
        break;
      case 'crossfadeOverlap':
        transitionState.fromViewOpacity.setValue(1 - (progress * 0.7));
        transitionState.toViewOpacity.setValue(progress);
        transitionState.fromViewOffset.setValue({ x: -50 * progress, y: 0 });
        transitionState.toViewOffset.setValue({ x: 50 * (1 - progress), y: 0 });
        transitionState.fromViewBlur.setValue(progress);
        transitionState.toViewBlur.setValue(1 - progress);
        break;
      case 'dissolveParticle':
        transitionState.fromViewOpacity.setValue(1 - progress);
        transitionState.toViewOpacity.setValue(progress);
        transitionState.fromViewScale.setValue(1 + (0.2 * progress));
        transitionState.toViewScale.setValue(1.2 - (0.2 * progress));
        break;
      case 'flipCard':
        if (progress < 0.5) {
          transitionState.fromViewRotation.setValue(progress * 90);
          transitionState.toViewRotation.setValue(90);
          transitionState.fromViewOpacity.setValue(1);
          transitionState.toViewOpacity.setValue(0);
        } else {
          transitionState.fromViewRotation.setValue(90);
          transitionState.toViewRotation.setValue(90 - ((progress - 0.5) * 90));
          transitionState.fromViewOpacity.setValue(0);
          transitionState.toViewOpacity.setValue(1);
        }
        break;
    }
  }, [transitionType.type]);

  // Setup initial state based on transition type
  useEffect(() => {
    setupInitialState();
  }, [setupInitialState]);

  // Update transition state based on progress
  useEffect(() => {
    const listener = transitionProgress.addListener(({ value }) => {
      updateTransitionState(value);
    });

    return () => {
      transitionProgress.removeListener(listener);
    };
  }, [transitionProgress, updateTransitionState]);

  return (
    <View style={[styles.container, style]}>
      {/* From view (outgoing) */}
      <Animated.View
        style={[
          styles.viewContainer,
          {
            opacity: transitionState.fromViewOpacity,
            transform: [
              { translateX: transitionState.fromViewOffset.x },
              { translateY: transitionState.fromViewOffset.y },
              { scale: transitionState.fromViewScale },
              {
                rotate: transitionState.fromViewRotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                })
              }
            ]
          }
        ]}
      >
        {fromView}
      </Animated.View>

      {/* To view (incoming) */}
      <Animated.View
        style={[
          styles.viewContainer,
          {
            opacity: transitionState.toViewOpacity,
            transform: [
              { translateX: transitionState.toViewOffset.x },
              { translateY: transitionState.toViewOffset.y },
              { scale: transitionState.toViewScale },
              {
                rotate: transitionState.toViewRotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                })
              }
            ]
          }
        ]}
      >
        {toView}
      </Animated.View>
    </View>
  );
};

// MARK: - Advanced Transition Manager

export interface AdvancedTransitionManagerState {
  transitionProgress: Animated.Value;
  isTransitioning: boolean;
  currentTransitionType: CustomTransitionType;
  fromTheme: any;
  toTheme: any;
}

export class AdvancedTransitionManager {
  private state: AdvancedTransitionManagerState;
  private listeners: Set<(state: AdvancedTransitionManagerState) => void> = new Set();
  private animationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.state = {
      transitionProgress: new Animated.Value(0),
      isTransitioning: false,
      currentTransitionType: CUSTOM_TRANSITION_TYPES[0],
      fromTheme: null,
      toTheme: null
    };
  }

  /**
   * Perform a sophisticated custom transition
   */
  performCustomTransition = (
    fromTheme: any,
    toTheme: any,
    type: CustomTransitionType,
    onComplete?: () => void
  ): void => {
    if (this.state.isTransitioning) return;

    this.state.fromTheme = fromTheme;
    this.state.toTheme = toTheme;
    this.state.currentTransitionType = type;
    this.state.isTransitioning = true;
    this.state.transitionProgress.setValue(0);

    this.notifyListeners();

    // Start animation
    const duration = type.duration;
    const steps = 60; // 60fps
    const stepDuration = duration / steps;
    let currentStep = 0;

    this.animationTimer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      this.state.transitionProgress.setValue(progress);

      if (progress >= 1.0) {
        this.completeTransition(onComplete);
      }
    }, stepDuration);
  };

  /**
   * Create a transition container view
   */
  createTransitionContainer = (
    fromView: React.ReactNode,
    toView: React.ReactNode,
    style?: ViewStyle
  ): React.ReactElement => {
    return React.createElement(TransitionContainerView, {
      fromView,
      toView,
      transitionProgress: this.state.transitionProgress,
      transitionType: this.state.currentTransitionType,
      isTransitioning: this.state.isTransitioning,
      style
    });
  };

  /**
   * Subscribe to state changes
   */
  subscribe = (listener: (state: AdvancedTransitionManagerState) => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /**
   * Get current state
   */
  getState = (): AdvancedTransitionManagerState => ({ ...this.state });

  private completeTransition = (onComplete?: () => void): void => {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }

    this.state.isTransitioning = false;
    this.notifyListeners();

    setTimeout(() => {
      this.state.transitionProgress.setValue(0);
      this.state.fromTheme = null;
      this.state.toTheme = null;
      this.notifyListeners();
      onComplete?.();
    }, 200);
  };

  private notifyListeners = (): void => {
    this.listeners.forEach(listener => {
      listener({ ...this.state });
    });
  };
}

// MARK: - Custom Hook for Transition Manager

export const useAdvancedTransitionManager = (): {
  manager: AdvancedTransitionManager;
  state: AdvancedTransitionManagerState;
} => {
  const [manager] = useState(() => new AdvancedTransitionManager());
  const [state, setState] = useState<AdvancedTransitionManagerState>(manager.getState());

  useEffect(() => {
    const unsubscribe = manager.subscribe(setState);
    return unsubscribe;
  }, [manager]);

  return { manager, state };
};

// MARK: - Transition Preview Components

export interface TransitionPreviewCardProps {
  theme: any;
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

/**
 * Preview component for demonstrating custom transitions
 */
export const TransitionPreviewCard: React.FC<TransitionPreviewCardProps> = ({
  theme,
  title,
  subtitle,
  style
}) => {
  return (
    <View style={[styles.previewCard, { backgroundColor: theme.surface }, style]}>
      {/* Header */}
      <View style={styles.previewHeader}>
        <View style={[styles.previewIcon, { backgroundColor: theme.primary }]} />
        <View style={styles.previewTextContainer}>
          <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.previewSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.previewSpacer} />
        <View style={[styles.previewButton, { backgroundColor: theme.primary }]}>
          <Text style={[styles.previewButtonText, { color: theme.surface }]}>
            Action
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.previewDivider, { backgroundColor: theme.border }]} />

      {/* Content */}
      <View style={styles.previewContent}>
        <View style={styles.previewLeftContent}>
          <View style={styles.previewColorItem}>
            <View style={[styles.previewColorDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.previewColorText, { color: theme.textPrimary }]}>
              Primary Color
            </Text>
          </View>
          <View style={styles.previewColorItem}>
            <View style={[styles.previewColorDot, { backgroundColor: theme.secondary }]} />
            <Text style={[styles.previewColorText, { color: theme.textPrimary }]}>
              Secondary Color
            </Text>
          </View>
          <View style={styles.previewColorItem}>
            <View style={[styles.previewColorDot, { backgroundColor: theme.success }]} />
            <Text style={[styles.previewColorText, { color: theme.textPrimary }]}>
              Success Color
            </Text>
          </View>
        </View>

        <View style={styles.previewRightContent}>
          <Text style={[styles.previewSampleText, { color: theme.textPrimary }]}>
            Sample Text
          </Text>
          <Text style={[styles.previewSampleText, { color: theme.textSecondary }]}>
            Secondary Text
          </Text>
        </View>
      </View>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  previewButton: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '500'
  },
  previewCard: {
    borderRadius: 12,
    elevation: 4,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  previewColorDot: {
    borderRadius: 6,
    height: 12,
    marginRight: 8,
    width: 12
  },
  previewColorItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8
  },
  previewColorText: {
    fontSize: 12
  },
  previewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  previewDivider: {
    height: 1,
    marginBottom: 16
  },
  previewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  previewIcon: {
    borderRadius: 20,
    height: 40,
    marginRight: 12,
    width: 40
  },
  previewLeftContent: {
    flex: 1
  },
  previewRightContent: {
    alignItems: 'flex-end'
  },
  previewSampleText: {
    fontSize: 12,
    marginBottom: 4
  },
  previewSpacer: {
    flex: 1
  },
  previewSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  previewTextContainer: {
    flex: 1
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  viewContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

// MARK: - Export Default

export default {
  TransitionContainerView,
  AdvancedTransitionManager,
  useAdvancedTransitionManager,
  TransitionPreviewCard,
  CUSTOM_TRANSITION_TYPES
};
