//
// ThemeTransitionManager.ts
// Aether React Native App
//
// Dynamic theme transitions with smooth animations and system integration.
// This manager provides polished, delightful theme switching experiences
// that respect user preferences and accessibility settings.
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, Easing, AccessibilityInfo } from 'react-native';
import { Theme } from './ThemeProvider';

// MARK: - Transition Types

/**
 * Types of theme transitions available
 */
export enum ThemeTransitionType {
  FADE = 'fade',
  SLIDE = 'slide',
  SCALE = 'scale',
  MORPH = 'morph',
  CROSSFADE = 'crossfade',
  DISSOLVE = 'dissolve',
}

export const TransitionTypeLabels: Record<ThemeTransitionType, string> = {
  [ThemeTransitionType.FADE]: 'Fade',
  [ThemeTransitionType.SLIDE]: 'Slide',
  [ThemeTransitionType.SCALE]: 'Scale',
  [ThemeTransitionType.MORPH]: 'Morph',
  [ThemeTransitionType.CROSSFADE]: 'Crossfade',
  [ThemeTransitionType.DISSOLVE]: 'Dissolve',
};

export const TransitionTypeDescriptions: Record<ThemeTransitionType, string> = {
  [ThemeTransitionType.FADE]: 'Smooth fade between themes',
  [ThemeTransitionType.SLIDE]: 'Slide transition with direction',
  [ThemeTransitionType.SCALE]: 'Scale and fade combination',
  [ThemeTransitionType.MORPH]: 'Morphing color transitions',
  [ThemeTransitionType.CROSSFADE]: 'Crossfade with blur effect',
  [ThemeTransitionType.DISSOLVE]: 'Dissolve with particle effect',
};

// MARK: - Animation Curves

/**
 * Predefined animation curves for theme transitions
 */
export enum ThemeAnimationCurve {
  EASE_IN_OUT = 'easeInOut',
  EASE_IN = 'easeIn',
  EASE_OUT = 'easeOut',
  SPRING = 'spring',
  BOUNCY = 'bouncy',
  SMOOTH = 'smooth',
}

export const AnimationCurveLabels: Record<ThemeAnimationCurve, string> = {
  [ThemeAnimationCurve.EASE_IN_OUT]: 'Ease In Out',
  [ThemeAnimationCurve.EASE_IN]: 'Ease In',
  [ThemeAnimationCurve.EASE_OUT]: 'Ease Out',
  [ThemeAnimationCurve.SPRING]: 'Spring',
  [ThemeAnimationCurve.BOUNCY]: 'Bouncy',
  [ThemeAnimationCurve.SMOOTH]: 'Smooth',
};

export const getAnimationConfig = (curve: ThemeAnimationCurve) => {
  switch (curve) {
    case ThemeAnimationCurve.EASE_IN_OUT:
      return {
        duration: 600,
        easing: Easing.inOut(Easing.ease),
      };
    case ThemeAnimationCurve.EASE_IN:
      return {
        duration: 500,
        easing: Easing.in(Easing.ease),
      };
    case ThemeAnimationCurve.EASE_OUT:
      return {
        duration: 500,
        easing: Easing.out(Easing.ease),
      };
    case ThemeAnimationCurve.SPRING:
      return {
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
      };
    case ThemeAnimationCurve.BOUNCY:
      return {
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
      };
    case ThemeAnimationCurve.SMOOTH:
      return {
        duration: 800,
        easing: Easing.inOut(Easing.cubic),
      };
  }
};

// MARK: - Transition Direction

/**
 * Slide transition directions
 */
export enum TransitionDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
}

export const DirectionLabels: Record<TransitionDirection, string> = {
  [TransitionDirection.LEFT]: 'Left',
  [TransitionDirection.RIGHT]: 'Right',
  [TransitionDirection.UP]: 'Up',
  [TransitionDirection.DOWN]: 'Down',
};

// MARK: - Transition State

/**
 * State tracking for theme transitions
 */
export interface ThemeTransitionState {
  isTransitioning: boolean;
  transitionProgress: Animated.Value;
  currentTransitionType: ThemeTransitionType;
  currentAnimationCurve: ThemeAnimationCurve;
  transitionDirection: TransitionDirection;
  shouldReduceMotion: boolean;
  shouldReduceTransparency: boolean;
}

// MARK: - Theme Transition Manager

/**
 * Manager for handling smooth theme transitions with animations
 */
export class ThemeTransitionManager {
  private transitionState: ThemeTransitionState;
  private previousTheme: Theme | null = null;
  private nextTheme: Theme | null = null;
  private animationRef = useRef<Animated.CompositeAnimation | null>(null);
  private accessibilityListeners: Array<() => void> = [];

  constructor() {
    this.transitionState = {
      isTransitioning: false,
      transitionProgress: new Animated.Value(0),
      currentTransitionType: ThemeTransitionType.FADE,
      currentAnimationCurve: ThemeAnimationCurve.EASE_IN_OUT,
      transitionDirection: TransitionDirection.RIGHT,
      shouldReduceMotion: false,
      shouldReduceTransparency: false,
    };

    this.setupAccessibilityListeners();
  }

  // MARK: - Setup

  private setupAccessibilityListeners() {
    // Listen for reduce motion changes
    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      this.handleReduceMotionChange
    );

    // Listen for reduce transparency changes
    const reduceTransparencyListener = AccessibilityInfo.addEventListener(
      'reduceTransparencyChanged',
      this.handleReduceTransparencyChange
    );

    this.accessibilityListeners.push(() => reduceMotionListener?.remove());
    this.accessibilityListeners.push(() => reduceTransparencyListener?.remove());

    // Get initial accessibility settings
    this.updateAccessibilitySettings();
  }

  private handleReduceMotionChange = (isReduceMotionEnabled: boolean) => {
    this.transitionState.shouldReduceMotion = isReduceMotionEnabled;
    this.updateAccessibilitySettings();
  };

  private handleReduceTransparencyChange = (isReduceTransparencyEnabled: boolean) => {
    this.transitionState.shouldReduceTransparency = isReduceTransparencyEnabled;
    this.updateAccessibilitySettings();
  };

  private async updateAccessibilitySettings() {
    try {
      const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      const isReduceTransparencyEnabled = await AccessibilityInfo.isReduceTransparencyEnabled();

      this.transitionState.shouldReduceMotion = isReduceMotionEnabled;
      this.transitionState.shouldReduceTransparency = isReduceTransparencyEnabled;

      // Adjust transition behavior based on accessibility settings
      if (isReduceMotionEnabled) {
        this.transitionState.currentAnimationCurve = ThemeAnimationCurve.EASE_IN_OUT;
      }
    } catch (error) {
      console.warn('Failed to get accessibility settings:', error);
    }
  }

  // MARK: - Public Methods

  /**
   * Perform a smooth theme transition
   */
  public transitionToTheme = (
    currentTheme: Theme,
    newTheme: Theme,
    type: ThemeTransitionType = ThemeTransitionType.FADE,
    curve: ThemeAnimationCurve = ThemeAnimationCurve.EASE_IN_OUT,
    direction: TransitionDirection = TransitionDirection.RIGHT,
    onComplete?: () => void
  ) => {
    if (this.transitionState.isTransitioning) {
      return;
    }

    // Store transition parameters
    this.previousTheme = currentTheme;
    this.nextTheme = newTheme;
    this.transitionState.currentTransitionType = type;
    this.transitionState.currentAnimationCurve = curve;
    this.transitionState.transitionDirection = direction;

    // Check accessibility settings
    if (this.transitionState.shouldReduceMotion) {
      // Instant transition for reduced motion
      this.performInstantTransition(newTheme, onComplete);
    } else {
      // Animated transition
      this.performAnimatedTransition(newTheme, type, curve, onComplete);
    }
  };

  /**
   * Get current transition state
   */
  public getTransitionState(): ThemeTransitionState {
    return this.transitionState;
  }

  /**
   * Get transition progress value for animations
   */
  public getTransitionProgress(): Animated.Value {
    return this.transitionState.transitionProgress;
  }

  /**
   * Check if currently transitioning
   */
  public isTransitioning(): boolean {
    return this.transitionState.isTransitioning;
  }

  /**
   * Get interpolated color between two themes
   */
  public interpolateColor(
    startColor: string,
    endColor: string,
    progress: number
  ): string {
    // Simple color interpolation - in a real implementation,
    // you'd want to interpolate RGB/HSB values properly
    return progress > 0.5 ? endColor : startColor;
  }

  /**
   * Cleanup resources
   */
  public cleanup() {
    this.accessibilityListeners.forEach(listener => listener());
    this.accessibilityListeners = [];
    
    if (this.animationRef.current) {
      this.animationRef.current.stop();
      this.animationRef.current = null;
    }
  }

  // MARK: - Private Methods

  private performInstantTransition(newTheme: Theme, onComplete?: () => void) {
    this.transitionState.isTransitioning = true;
    this.transitionState.transitionProgress.setValue(1);

    // Apply theme change immediately
    setTimeout(() => {
      this.transitionState.isTransitioning = false;
      this.transitionState.transitionProgress.setValue(0);
      this.previousTheme = null;
      this.nextTheme = null;
      onComplete?.();
    }, 100);
  }

  private performAnimatedTransition(
    newTheme: Theme,
    type: ThemeTransitionType,
    curve: ThemeAnimationCurve,
    onComplete?: () => void
  ) {
    this.transitionState.isTransitioning = true;
    this.transitionState.transitionProgress.setValue(0);

    const config = getAnimationConfig(curve);

    // Start transition animation
    this.animationRef.current = Animated.timing(
      this.transitionState.transitionProgress,
      {
        toValue: 1,
        duration: config.duration,
        easing: config.easing,
        useNativeDriver: true,
      }
    );

    this.animationRef.current.start((result) => {
      if (result.finished) {
        this.completeTransition(onComplete);
      }
    });
  }

  private completeTransition(onComplete?: () => void) {
    this.transitionState.isTransitioning = false;
    
    // Reset progress
    setTimeout(() => {
      this.transitionState.transitionProgress.setValue(0);
      this.previousTheme = null;
      this.nextTheme = null;
      onComplete?.();
    }, 200);
  }
}

// MARK: - Hook for React Components

/**
 * Hook for using theme transitions in React components
 */
export const useThemeTransition = () => {
  const [transitionManager] = useState(() => new ThemeTransitionManager());
  const [transitionState, setTransitionState] = useState<ThemeTransitionState>(
    transitionManager.getTransitionState()
  );

  useEffect(() => {
    // Update state when transition state changes
    const interval = setInterval(() => {
      setTransitionState(transitionManager.getTransitionState());
    }, 16); // ~60fps

    return () => {
      clearInterval(interval);
      transitionManager.cleanup();
    };
  }, [transitionManager]);

  const transitionToTheme = useCallback(
    (
      currentTheme: Theme,
      newTheme: Theme,
      type: ThemeTransitionType = ThemeTransitionType.FADE,
      curve: ThemeAnimationCurve = ThemeAnimationCurve.EASE_IN_OUT,
      direction: TransitionDirection = TransitionDirection.RIGHT,
      onComplete?: () => void
    ) => {
      transitionManager.transitionToTheme(
        currentTheme,
        newTheme,
        type,
        curve,
        direction,
        onComplete
      );
    },
    [transitionManager]
  );

  return {
    transitionState,
    transitionToTheme,
    getTransitionProgress: () => transitionManager.getTransitionProgress(),
    isTransitioning: () => transitionManager.isTransitioning(),
    interpolateColor: (startColor: string, endColor: string, progress: number) =>
      transitionManager.interpolateColor(startColor, endColor, progress),
  };
};

// MARK: - Animation Helpers

/**
 * Create animated style for fade transition
 */
export const createFadeStyle = (progress: Animated.Value) => ({
  opacity: progress,
});

/**
 * Create animated style for slide transition
 */
export const createSlideStyle = (
  progress: Animated.Value,
  direction: TransitionDirection
) => {
  const distance = 100;
  
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: direction === TransitionDirection.LEFT 
      ? [-distance, 0] 
      : direction === TransitionDirection.RIGHT 
      ? [distance, 0] 
      : [0, 0],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: direction === TransitionDirection.UP 
      ? [-distance, 0] 
      : direction === TransitionDirection.DOWN 
      ? [distance, 0] 
      : [0, 0],
  });

  return {
    transform: [{ translateX }, { translateY }],
  };
};

/**
 * Create animated style for scale transition
 */
export const createScaleStyle = (progress: Animated.Value) => {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return {
    transform: [{ scale }],
    opacity: progress,
  };
};

/**
 * Create animated style for morph transition
 */
export const createMorphStyle = (progress: Animated.Value) => {
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  return {
    transform: [{ scale }],
  };
};

/**
 * Create animated style for crossfade transition
 */
export const createCrossfadeStyle = (progress: Animated.Value) => ({
  opacity: progress,
});

/**
 * Create animated style for dissolve transition
 */
export const createDissolveStyle = (progress: Animated.Value) => ({
  opacity: progress,
});

/**
 * Get transition style based on type
 */
export const getTransitionStyle = (
  type: ThemeTransitionType,
  progress: Animated.Value,
  direction?: TransitionDirection
) => {
  switch (type) {
    case ThemeTransitionType.FADE:
      return createFadeStyle(progress);
    case ThemeTransitionType.SLIDE:
      return createSlideStyle(progress, direction || TransitionDirection.RIGHT);
    case ThemeTransitionType.SCALE:
      return createScaleStyle(progress);
    case ThemeTransitionType.MORPH:
      return createMorphStyle(progress);
    case ThemeTransitionType.CROSSFADE:
      return createCrossfadeStyle(progress);
    case ThemeTransitionType.DISSOLVE:
      return createDissolveStyle(progress);
    default:
      return createFadeStyle(progress);
  }
}; 