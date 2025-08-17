//
//  ColorPaletteManager.tsx
//  Aether React Native App
//
//  Comprehensive color palette management system with color wheel tools,
//  harmonious color schemes, and validation to guide users toward
//  professional and accessible color choices.
//

import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ColorUtils,
  ColorHarmonyGenerator,
  ColorHarmonyType,
  HSLColor,
  RGBColor,
  ColorPalette
} from '@aether/core';

// MARK: - Types and Interfaces

// Re-export types and enums from core
export type { HSLColor, RGBColor, ColorPalette };
export { ColorHarmonyType };

// MARK: - Color Utility Functions

// Use core ColorUtils instead of local implementation
export { ColorUtils };

// MARK: - Color Harmony Generator

// Use core ColorHarmonyGenerator instead of local implementation
export { ColorHarmonyGenerator };

// MARK: - Additional Interfaces

export interface PaletteValidation {
  hasGoodContrast: boolean;
  isHarmonious: boolean;
  hasBalancedSaturation: boolean;
  score: number;
  messages: string[];
}

export interface ColorPaletteContextType {
  currentPalette: ColorPalette;
  selectedHarmonyType: ColorHarmonyType;
  baseColor: string;
  updateBaseColor: (color: string) => void;
  updateHarmonyType: (harmonyType: ColorHarmonyType) => void;
  setPredefinedPalette: (palette: ColorPalette) => void;
  generateNewPalette: () => void;
  currentValidation: PaletteValidation;
  predefinedPalettes: ColorPalette[];
  harmonyTypes: ColorHarmonyType[];
}

// MARK: - Predefined Color Palettes

export const PredefinedPalettes: ColorPalette[] = [
  {
    primary: '#3366CC',
    secondary: '#99CCFF',
    neutral: '#E6E6E6',
    neutralLight: '#F2F2F2',
    neutralDark: '#B3B3B3',
    name: 'Modern Blue',
    description: 'Professional and trustworthy',
    harmonyType: ColorHarmonyType.COMPLEMENTARY
  },
  {
    primary: '#33CC66',
    secondary: '#66FF99',
    neutral: '#F2FFF2',
    neutralLight: '#F8FFF8',
    neutralDark: '#CCE6CC',
    name: 'Nature Green',
    description: 'Fresh and organic',
    harmonyType: ColorHarmonyType.ANALOGOUS
  },
  {
    primary: '#FF6633',
    secondary: '#FF9966',
    neutral: '#FFF5F2',
    neutralLight: '#FFF8F5',
    neutralDark: '#FFE6D9',
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    harmonyType: ColorHarmonyType.MONOCHROMATIC
  },
  {
    primary: '#9933CC',
    secondary: '#CC66FF',
    neutral: '#F8F2FF',
    neutralLight: '#FAF5FF',
    neutralDark: '#E6D9FF',
    name: 'Royal Purple',
    description: 'Creative and luxurious',
    harmonyType: ColorHarmonyType.TRIADIC
  },
  {
    primary: '#0099CC',
    secondary: '#33CCCC',
    neutral: '#F2FFFF',
    neutralLight: '#F5FFFF',
    neutralDark: '#CCF2F2',
    name: 'Ocean Teal',
    description: 'Calm and refreshing',
    harmonyType: ColorHarmonyType.SPLIT_COMPLEMENTARY
  }
];

// MARK: - Palette Validation

export class PaletteValidation {
  static validate(palette: ColorPalette): PaletteValidation {
    const hasGoodContrast = this.checkContrast(palette);
    const isHarmonious = this.checkHarmony(palette);
    const hasBalancedSaturation = this.checkSaturation(palette);

    let score = 0;
    if (hasGoodContrast) score += 40;
    if (isHarmonious) score += 30;
    if (hasBalancedSaturation) score += 30;

    const messages: string[] = [];
    if (!hasGoodContrast) {
      messages.push('Colors may not have sufficient contrast for accessibility');
    }
    if (!isHarmonious) {
      messages.push('Colors don\'t follow the selected harmony type');
    }
    if (!hasBalancedSaturation) {
      messages.push('Colors may be too saturated for professional use');
    }

    return {
      hasGoodContrast,
      isHarmonious,
      hasBalancedSaturation,
      score,
      messages
    };
  }

  private static checkContrast(palette: ColorPalette): boolean {
    const primaryContrast = ColorUtils.calculateContrastRatio(palette.primary, palette.neutral);
    const secondaryContrast = ColorUtils.calculateContrastRatio(palette.secondary, palette.neutral);

    return (primaryContrast ?? 0) >= 4.5 && (secondaryContrast ?? 0) >= 4.5;
  }

  private static checkHarmony(palette: ColorPalette): boolean {
    const primaryHSL = ColorUtils.hexToHsl(palette.primary);
    const secondaryHSL = ColorUtils.hexToHsl(palette.secondary);

    const hueDiff = Math.abs(primaryHSL.hue - secondaryHSL.hue);

    switch (palette.harmonyType) {
      case ColorHarmonyType.COMPLEMENTARY:
        return hueDiff >= 150 && hueDiff <= 210;
      case ColorHarmonyType.TRIADIC:
        return (hueDiff >= 110 && hueDiff <= 130) || (hueDiff >= 230 && hueDiff <= 250);
      case ColorHarmonyType.ANALOGOUS:
        return hueDiff >= 15 && hueDiff <= 45;
      case ColorHarmonyType.MONOCHROMATIC:
        return hueDiff < 15;
      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        return (hueDiff >= 150 && hueDiff <= 210) || (hueDiff >= 30 && hueDiff <= 90);
      case ColorHarmonyType.TETRADIC:
        return (hueDiff >= 80 && hueDiff <= 100) || (hueDiff >= 170 && hueDiff <= 190);
    }
  }

  private static checkSaturation(palette: ColorPalette): boolean {
    const primaryHSL = ColorUtils.hexToHsl(palette.primary);
    const secondaryHSL = ColorUtils.hexToHsl(palette.secondary);

    return primaryHSL.saturation <= 80 && secondaryHSL.saturation <= 80;
  }
}

// MARK: - Color Palette Context

const ColorPaletteContext = createContext<ColorPaletteContextType | undefined>(undefined);

export const useColorPalette = () => {
  const context = useContext(ColorPaletteContext);
  if (!context) {
    throw new Error('useColorPalette must be used within a ColorPaletteProvider');
  }
  return context;
};

export const ColorPaletteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(PredefinedPalettes[0]);
  const [selectedHarmonyType, setSelectedHarmonyType] = useState<ColorHarmonyType>(
    ColorHarmonyType.COMPLEMENTARY
  );
  const [baseColor, setBaseColor] = useState<string>('#3366CC');

  const updateBaseColor = useCallback((color: string) => {
    setBaseColor(color);
    const newPalette = ColorHarmonyGenerator.generateHarmoniousColors(
      color,
      selectedHarmonyType
    );
    setCurrentPalette(newPalette);
  }, [selectedHarmonyType]);

  const updateHarmonyType = useCallback((harmonyType: ColorHarmonyType) => {
    setSelectedHarmonyType(harmonyType);
    const newPalette = ColorHarmonyGenerator.generateHarmoniousColors(
      baseColor,
      harmonyType
    );
    setCurrentPalette(newPalette);
  }, [baseColor]);

  const setPredefinedPalette = useCallback((palette: ColorPalette) => {
    setCurrentPalette(palette);
    setBaseColor(palette.primary);
    setSelectedHarmonyType(palette.harmonyType);
  }, []);

  const generateNewPalette = useCallback(() => {
    const newPalette = ColorHarmonyGenerator.generateHarmoniousColors(
      baseColor,
      selectedHarmonyType
    );
    setCurrentPalette(newPalette);
  }, [baseColor, selectedHarmonyType]);

  const currentValidation = PaletteValidation.validate(currentPalette);

  const value: ColorPaletteContextType = {
    currentPalette,
    selectedHarmonyType,
    baseColor,
    updateBaseColor,
    updateHarmonyType,
    setPredefinedPalette,
    generateNewPalette,
    currentValidation,
    predefinedPalettes: PredefinedPalettes,
    harmonyTypes: Object.values(ColorHarmonyType)
  };

  return (
    <ColorPaletteContext.Provider value={value}>
      {children}
    </ColorPaletteContext.Provider>
  );
};

// MARK: - Color Wheel Component

interface ColorWheelProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  size?: number;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  selectedColor,
  onColorChange,
  size = 280
}) => {
  const centerX = useSharedValue(size / 2);
  const centerY = useSharedValue(size / 2);
  const isDragging = useSharedValue(false);

  const wheelRadius = size / 2;
  const centerRadius = 20;

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = centerX.value;
      context.startY = centerY.value;
      isDragging.value = true;
    },
    onActive: (event, context: any) => {
      const deltaX = event.translationX;
      const deltaY = event.translationY;

      const newX = context.startX + deltaX;
      const newY = context.startY + deltaY;

      const distance = Math.sqrt(newX * newX + newY * newY);

      if (distance <= centerRadius) {
        // Center area - neutral colors
        const grayValue = 1 - (distance / centerRadius);
        const grayHex = Math.round(grayValue * 255).toString(16).padStart(2, '0');
        const neutralColor = `#${grayHex}${grayHex}${grayHex}`;
        runOnJS(onColorChange)(neutralColor);
      } else if (distance <= wheelRadius) {
        // Color wheel area
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        const hue = angle < 0 ? angle + 360 : angle;
        const saturation = Math.min(1, (distance - centerRadius) / (wheelRadius - centerRadius));
        const lightness = 0.5;

        const newColor = ColorUtils.hslToHex(hue, saturation * 100, lightness * 100);
        runOnJS(onColorChange)(newColor);
      }
    },
    onEnd: () => {
      isDragging.value = false;
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: centerX.value - 10, translateY: centerY.value - 10 }
    ] as any
  }));

  return (
    <View style={[styles.colorWheelContainer, { width: size, height: size }]}>
      {/* Color wheel background */}
      <LinearGradient
        colors={generateHueSpectrum() as any}
        style={[styles.colorWheel, { width: size, height: size, borderRadius: size / 2 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Center neutral area */}
      <View style={[styles.centerArea, { width: centerRadius * 2, height: centerRadius * 2 }]} />

      {/* Selection indicator */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.selectionIndicator, animatedStyle]}>
          <View style={[styles.indicator, { backgroundColor: selectedColor }]} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const generateHueSpectrum = (): string[] => {
  const colors: string[] = [];
  for (let hue = 0; hue <= 360; hue++) {
    colors.push(ColorUtils.hslToHex(hue, 100, 50));
  }
  return colors;
};

// MARK: - Styles

const styles = StyleSheet.create({
  centerArea: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    position: 'absolute'
  },
  colorWheel: {
    position: 'absolute'
  },
  colorWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  indicator: {
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 3,
    height: 20,
    width: 20
  },
  selectionIndicator: {
    height: 20,
    position: 'absolute',
    width: 20
  }
});

// MARK: - Export

export default ColorPaletteProvider;
