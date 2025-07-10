//
//  AetherGlassCard.tsx
//  Aether React Native App
//
//  A reusable React Native component that implements glassmorphism styling
//  using @react-native-community/blur and styled-components.
//

import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import styled from 'styled-components/native';
import Animated, {
  AnimatedProps,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Animated BlurView component for smooth animations
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Styled components for the glassmorphism effect
const GlassContainer = styled(Animated.View)`
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
`;

const ContentContainer = styled(Animated.View)`
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
`;

const BackgroundImage = styled(ImageBackground)`
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
`;

// Props interface for the AetherGlassCard component
interface AetherGlassCardProps {
  /** The content to render inside the glass card */
  children: React.ReactNode;
  /** Background image source for the blur effect */
  backgroundImage: ImageSourcePropType;
  /** Additional styles for the container */
  style?: ViewStyle;
  /** Whether the card should be animated on mount */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Blur amount (default: 15) */
  blurAmount?: number;
  /** Blur type (default: 'light') */
  blurType?: 'light' | 'dark' | 'xlight' | 'prominent' | 'regular' | 'extraDark';
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Whether the card is pressable */
  pressable?: boolean;
}

/**
 * AetherGlassCard - A reusable React Native component that implements
 * glassmorphism styling with blur effects and animations.
 *
 * This component creates a glass-like card effect using:
 * - Background image with blur effect
 * - Semi-transparent white border (20% opacity)
 * - 20px border radius
 * - Animated entrance and press effects
 * - Configurable blur amount and type
 *
 * Usage:
 * ```tsx
 * <AetherGlassCard
 *   backgroundImage={require('./assets/background.jpg')}
 *   animated={true}
 * >
 *   <Text>Hello, Aether!</Text>
 * </AetherGlassCard>
 * ```
 */
const AetherGlassCard: React.FC<AetherGlassCardProps> = ({
  children,
  backgroundImage,
  style,
  animated = true,
  animationDuration = 800,
  blurAmount = 15,
  blurType = 'light',
  onPress,
  pressable = false,
}) => {
  // Shared values for animations
  const scale = useSharedValue(animated ? 0.8 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);
  const blurIntensity = useSharedValue(animated ? 0 : blurAmount);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedBlurStyle = useAnimatedStyle(() => ({
    opacity: blurIntensity.value / blurAmount,
  }));

  // Animate on mount
  React.useEffect(() => {
    if (animated) {
      // Stagger the animations for a smooth entrance
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
      
      opacity.value = withTiming(1, {
        duration: animationDuration,
      });
      
      blurIntensity.value = withTiming(blurAmount, {
        duration: animationDuration * 0.8,
      });
    }
  }, [animated, animationDuration, blurAmount]);

  // Press animation
  const handlePressIn = () => {
    if (pressable) {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 100,
      });
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    }
  };

  return (
    <GlassContainer
      style={[animatedContainerStyle, style]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
      onPress={pressable ? onPress : undefined}
    >
      <BackgroundImage
        source={backgroundImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <AnimatedBlurView
          style={[styles.blurView, animatedBlurStyle]}
          blurType={blurType}
          blurAmount={blurAmount}
        >
          <ContentContainer>
            {children}
          </ContentContainer>
        </AnimatedBlurView>
      </BackgroundImage>
    </GlassContainer>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    borderRadius: 20,
  },
  blurView: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default AetherGlassCard; 