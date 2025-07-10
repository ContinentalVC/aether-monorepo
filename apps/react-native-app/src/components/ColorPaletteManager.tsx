//
//  ColorPaletteManager.tsx
//  Aether React Native App
//
//  Comprehensive color palette management system with color wheel tools,
//  harmonious color schemes, and validation to guide users toward
//  professional and accessible color choices.
//

import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// MARK: - Types and Interfaces

export interface HSLColor {
  hue: number;        // 0-360 degrees
  saturation: number; // 0-100 percentage
  lightness: number;  // 0-100 percentage
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent?: string;
  neutral: string;
  neutralLight: string;
  neutralDark: string;
  name: string;
  description: string;
  harmonyType: ColorHarmonyType;
}

export enum ColorHarmonyType {
  COMPLEMENTARY = 'Complementary',
  TRIADIC = 'Triadic',
  ANALOGOUS = 'Analogous',
  MONOCHROMATIC = 'Monochromatic',
  SPLIT_COMPLEMENTARY = 'Split Complementary',
  TETRADIC = 'Tetradic',
}

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

// MARK: - Color Utility Functions

export const ColorUtils = {
  // Convert HSL to hex color
  hslToHex: (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  },

  // Convert hex to HSL
  hexToHsl: (hex: string): HSLColor => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    const s = max === 0 ? 0 : delta / max;
    const l = (max + min) / 2;

    if (delta !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / delta) % 6;
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    return {
      hue: h,
      saturation: s * 100,
      lightness: l * 100,
    };
  },

  // Calculate contrast ratio
  calculateContrastRatio: (color1: string, color2: string): number => {
    const getLuminance = (hex: string): number => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

      return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  },
};

// MARK: - Color Harmony Generator

export class ColorHarmonyGenerator {
  static generateHarmoniousColors(
    baseColor: string,
    harmonyType: ColorHarmonyType,
    includeAccent: boolean = false
  ): ColorPalette {
    const baseHSL = ColorUtils.hexToHsl(baseColor);
    const { secondary, accent } = this.generateHarmoniousHSL(baseHSL, harmonyType);
    
    const secondaryColor = ColorUtils.hslToHex(
      secondary.hue,
      secondary.saturation,
      secondary.lightness
    );
    
    const accentColor = accent ? ColorUtils.hslToHex(
      accent.hue,
      accent.saturation,
      accent.lightness
    ) : undefined;
    
    const neutralColor = this.generateNeutralColor(baseHSL);
    
    return {
      primary: baseColor,
      secondary: secondaryColor,
      accent: accentColor,
      neutral: neutralColor,
      neutralLight: ColorUtils.hslToHex(baseHSL.hue, baseHSL.saturation * 0.1, 70),
      neutralDark: ColorUtils.hslToHex(baseHSL.hue, baseHSL.saturation * 0.1, 30),
      name: `${harmonyType} Harmony`,
      description: this.getHarmonyDescription(harmonyType),
      harmonyType,
    };
  }

  private static generateHarmoniousHSL(
    baseHSL: HSLColor,
    harmonyType: ColorHarmonyType
  ): { secondary: HSLColor; accent?: HSLColor } {
    switch (harmonyType) {
      case ColorHarmonyType.COMPLEMENTARY:
        const secondaryHue = (baseHSL.hue + 180) % 360;
        const secondaryHSL = {
          hue: secondaryHue,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        return { secondary: secondaryHSL };

      case ColorHarmonyType.TRIADIC:
        const secondaryHue1 = (baseHSL.hue + 120) % 360;
        const accentHue1 = (baseHSL.hue + 240) % 360;
        
        const secondaryHSL1 = {
          hue: secondaryHue1,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        const accentHSL1 = {
          hue: accentHue1,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        return { secondary: secondaryHSL1, accent: accentHSL1 };

      case ColorHarmonyType.ANALOGOUS:
        const secondaryHue2 = (baseHSL.hue + 30) % 360;
        const accentHue2 = (baseHSL.hue - 30 + 360) % 360;
        
        const secondaryHSL2 = {
          hue: secondaryHue2,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        const accentHSL2 = {
          hue: accentHue2,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        return { secondary: secondaryHSL2, accent: accentHSL2 };

      case ColorHarmonyType.MONOCHROMATIC:
        const secondaryHSL3 = {
          hue: baseHSL.hue,
          saturation: baseHSL.saturation * 0.8,
          lightness: baseHSL.lightness * 0.8,
        };
        const accentHSL3 = {
          hue: baseHSL.hue,
          saturation: baseHSL.saturation * 1.2,
          lightness: baseHSL.lightness * 1.2,
        };
        return { secondary: secondaryHSL3, accent: accentHSL3 };

      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        const complementHue = (baseHSL.hue + 180) % 360;
        const secondaryHue3 = (complementHue + 30) % 360;
        const accentHue3 = (complementHue - 30 + 360) % 360;
        
        const secondaryHSL4 = {
          hue: secondaryHue3,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        const accentHSL4 = {
          hue: accentHue3,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        return { secondary: secondaryHSL4, accent: accentHSL4 };

      case ColorHarmonyType.TETRADIC:
        const secondaryHue4 = (baseHSL.hue + 90) % 360;
        const accentHue4 = (baseHSL.hue + 180) % 360;
        
        const secondaryHSL5 = {
          hue: secondaryHue4,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        const accentHSL5 = {
          hue: accentHue4,
          saturation: baseHSL.saturation,
          lightness: baseHSL.lightness,
        };
        return { secondary: secondaryHSL5, accent: accentHSL5 };
    }
  }

  private static generateNeutralColor(baseHSL: HSLColor): string {
    return ColorUtils.hslToHex(
      baseHSL.hue,
      baseHSL.saturation * 0.1,
      50
    );
  }

  private static getHarmonyDescription(harmonyType: ColorHarmonyType): string {
    switch (harmonyType) {
      case ColorHarmonyType.COMPLEMENTARY:
        return 'Two opposite colors on the color wheel';
      case ColorHarmonyType.TRIADIC:
        return 'Three evenly spaced colors on the color wheel';
      case ColorHarmonyType.ANALOGOUS:
        return 'Colors that are next to each other on the color wheel';
      case ColorHarmonyType.MONOCHROMATIC:
        return 'Different shades and tints of the same color';
      case ColorHarmonyType.SPLIT_COMPLEMENTARY:
        return 'One base color and two colors adjacent to its complement';
      case ColorHarmonyType.TETRADIC:
        return 'Two pairs of complementary colors';
    }
  }
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
    harmonyType: ColorHarmonyType.COMPLEMENTARY,
  },
  {
    primary: '#33CC66',
    secondary: '#66FF99',
    neutral: '#F2FFF2',
    neutralLight: '#F8FFF8',
    neutralDark: '#CCE6CC',
    name: 'Nature Green',
    description: 'Fresh and organic',
    harmonyType: ColorHarmonyType.ANALOGOUS,
  },
  {
    primary: '#FF6633',
    secondary: '#FF9966',
    neutral: '#FFF5F2',
    neutralLight: '#FFF8F5',
    neutralDark: '#FFE6D9',
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    harmonyType: ColorHarmonyType.MONOCHROMATIC,
  },
  {
    primary: '#9933CC',
    secondary: '#CC66FF',
    neutral: '#F8F2FF',
    neutralLight: '#FAF5FF',
    neutralDark: '#E6D9FF',
    name: 'Royal Purple',
    description: 'Creative and luxurious',
    harmonyType: ColorHarmonyType.TRIADIC,
  },
  {
    primary: '#0099CC',
    secondary: '#33CCCC',
    neutral: '#F2FFFF',
    neutralLight: '#F5FFFF',
    neutralDark: '#CCF2F2',
    name: 'Ocean Teal',
    description: 'Calm and refreshing',
    harmonyType: ColorHarmonyType.SPLIT_COMPLEMENTARY,
  },
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
      messages,
    };
  }

  private static checkContrast(palette: ColorPalette): boolean {
    const primaryContrast = ColorUtils.calculateContrastRatio(palette.primary, palette.neutral);
    const secondaryContrast = ColorUtils.calculateContrastRatio(palette.secondary, palette.neutral);
    
    return primaryContrast >= 4.5 && secondaryContrast >= 4.5;
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
    harmonyTypes: Object.values(ColorHarmonyType),
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
  size = 280,
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
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: centerX.value - 10, translateY: centerY.value - 10 },
    ] as any,
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
  colorWheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorWheel: {
    position: 'absolute',
  },
  centerArea: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  selectionIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});

// MARK: - Export

export default ColorPaletteProvider; 