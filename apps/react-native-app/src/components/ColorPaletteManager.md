# ColorPaletteManager Component Documentation

## Overview

The `ColorPaletteManager` is a comprehensive React Native component that provides advanced color palette management with color wheel tools, harmonious color schemes, and validation to guide users toward professional and accessible color choices. Built with React Native Reanimated for smooth interactions and integrated with the Aether core color utilities.

## Features

### ✨ Core Features
- **Color Wheel Interface**: Interactive color wheel for intuitive color selection
- **Harmony Generation**: Automatic generation of harmonious color schemes
- **Palette Validation**: Real-time validation for accessibility and design quality
- **Predefined Palettes**: Curated collection of professional color palettes
- **Context Provider**: React Context for global palette management
- **Type Safety**: Full TypeScript support with comprehensive interfaces

### 🎨 Design Features
- **Multiple Harmony Types**: Complementary, Triadic, Analogous, Monochromatic, Split Complementary, Tetradic
- **Accessibility Focus**: Built-in contrast ratio validation
- **Professional Validation**: Saturation and harmony checking
- **Visual Feedback**: Real-time validation scores and messages
- **Responsive Design**: Adapts to different screen sizes

### 🔧 Technical Features
- **Smooth Animations**: Hardware-accelerated color transitions
- **Gesture Support**: Pan gesture handling for color wheel interaction
- **Performance Optimized**: Efficient color calculations and updates
- **Cross-Platform**: Works on iOS, Android, and Web
- **Integration Ready**: Seamless integration with Aether core utilities

## Installation

### Dependencies

The component requires the following dependencies:

```json
{
  "dependencies": {
    "@aether/core": "file:../../packages/aether-core",
    "react-native-reanimated": "~3.6.2",
    "react-native-gesture-handler": "~2.14.0",
    "expo-linear-gradient": "^14.1.5"
  }
}
```

### Import

```tsx
import { 
  ColorPaletteManager, 
  ColorPaletteProvider, 
  useColorPalette,
  ColorWheel,
  PredefinedPalettes,
  ColorHarmonyType,
  type ColorPalette,
  type PaletteValidation
} from './ColorPaletteManager';
```

## Usage

### Basic Usage with Context Provider

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { 
  ColorPaletteProvider, 
  useColorPalette,
  ColorPaletteManager 
} from './ColorPaletteManager';

const App = () => {
  return (
    <ColorPaletteProvider>
      <ColorPaletteManager />
    </ColorPaletteProvider>
  );
};

// Using the palette in other components
const MyComponent = () => {
  const { currentPalette, updateBaseColor } = useColorPalette();
  
  return (
    <View style={{ backgroundColor: currentPalette.primary }}>
      <Text style={{ color: currentPalette.neutral }}>
        Current Primary Color: {currentPalette.primary}
      </Text>
    </View>
  );
};
```

### Advanced Usage with Custom Configuration

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  ColorPaletteProvider, 
  useColorPalette,
  ColorHarmonyType,
  PredefinedPalettes 
} from './ColorPaletteManager';

const AdvancedExample = () => {
  const [selectedPalette, setSelectedPalette] = useState(PredefinedPalettes[0]);
  
  const {
    currentPalette,
    currentValidation,
    updateHarmonyType,
    generateNewPalette,
    setPredefinedPalette
  } = useColorPalette();

  const handlePaletteChange = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    setPredefinedPalette(palette);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Palette Selection */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Select Palette:
        </Text>
        {PredefinedPalettes.map((palette, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePaletteChange(palette)}
            style={{
              padding: 10,
              backgroundColor: palette.primary,
              marginBottom: 5,
              borderRadius: 8
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {palette.name}
            </Text>
            <Text style={{ color: 'white', opacity: 0.8 }}>
              {palette.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Palette Display */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Current Palette:
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: currentPalette.primary,
            borderRadius: 25
          }} />
          <View style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: currentPalette.secondary,
            borderRadius: 25
          }} />
          <View style={{ 
            width: 50, 
            height: 50, 
            backgroundColor: currentPalette.neutral,
            borderRadius: 25
          }} />
        </View>
      </View>

      {/* Validation Score */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Validation Score: {currentValidation.score}/100
        </Text>
        {currentValidation.messages.map((message, index) => (
          <Text key={index} style={{ color: 'red', marginBottom: 5 }}>
            ⚠️ {message}
          </Text>
        ))}
      </View>

      {/* Harmony Type Controls */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Harmony Type:
        </Text>
        <TouchableOpacity
          onPress={() => updateHarmonyType(ColorHarmonyType.COMPLEMENTARY)}
          style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 }}
        >
          <Text>Complementary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateHarmonyType(ColorHarmonyType.TRIADIC)}
          style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 }}
        >
          <Text>Triadic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateHarmonyType(ColorHarmonyType.ANALOGOUS)}
          style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5 }}
        >
          <Text>Analogous</Text>
        </TouchableOpacity>
      </View>

      {/* Generate New Palette */}
      <TouchableOpacity
        onPress={generateNewPalette}
        style={{ 
          padding: 15, 
          backgroundColor: '#007AFF', 
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Generate New Palette
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Color Wheel Component

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { ColorWheel } from './ColorPaletteManager';

const ColorWheelExample = () => {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');

  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Color Wheel
      </Text>
      
      <ColorWheel
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        size={300}
      />
      
      <View style={{ 
        marginTop: 20, 
        padding: 20, 
        backgroundColor: selectedColor,
        borderRadius: 10,
        minWidth: 200,
        alignItems: 'center'
      }}>
        <Text style={{ 
          color: 'white', 
          fontSize: 16, 
          fontWeight: 'bold' 
        }}>
          Selected Color: {selectedColor}
        </Text>
      </View>
    </View>
  );
};
```

## API Reference

### ColorPalette Interface

```tsx
interface ColorPalette {
  primary: string;        // Primary color (hex)
  secondary: string;      // Secondary color (hex)
  neutral: string;        // Neutral color (hex)
  neutralLight: string;   // Light neutral color (hex)
  neutralDark: string;    // Dark neutral color (hex)
  name: string;           // Palette name
  description: string;    // Palette description
  harmonyType: ColorHarmonyType; // Harmony type used
}
```

### PaletteValidation Interface

```tsx
interface PaletteValidation {
  hasGoodContrast: boolean;      // Whether colors meet contrast requirements
  isHarmonious: boolean;         // Whether colors follow harmony rules
  hasBalancedSaturation: boolean; // Whether saturation is balanced
  score: number;                 // Overall validation score (0-100)
  messages: string[];            // Validation messages
}
```

### ColorPaletteContextType Interface

```tsx
interface ColorPaletteContextType {
  currentPalette: ColorPalette;                    // Current active palette
  selectedHarmonyType: ColorHarmonyType;           // Current harmony type
  baseColor: string;                               // Base color for generation
  updateBaseColor: (color: string) => void;        // Update base color
  updateHarmonyType: (harmonyType: ColorHarmonyType) => void; // Update harmony type
  setPredefinedPalette: (palette: ColorPalette) => void; // Set predefined palette
  generateNewPalette: () => void;                  // Generate new palette
  currentValidation: PaletteValidation;            // Current validation state
  predefinedPalettes: ColorPalette[];              // Available predefined palettes
  harmonyTypes: ColorHarmonyType[];                // Available harmony types
}
```

### ColorWheel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedColor` | `string` | - | Currently selected color (hex) |
| `onColorChange` | `(color: string) => void` | - | Callback when color changes |
| `size` | `number` | `280` | Size of the color wheel |

### ColorHarmonyType Enum

```tsx
enum ColorHarmonyType {
  COMPLEMENTARY = 'complementary',           // Opposite colors
  TRIADIC = 'triadic',                      // Three colors equally spaced
  ANALOGOUS = 'analogous',                  // Adjacent colors
  MONOCHROMATIC = 'monochromatic',          // Single color variations
  SPLIT_COMPLEMENTARY = 'split_complementary', // Split complementary
  TETRADIC = 'tetradic'                     // Four colors in rectangle
}
```

## Predefined Palettes

The component includes 5 professionally curated color palettes:

1. **Modern Blue** - Professional and trustworthy
2. **Nature Green** - Fresh and organic
3. **Sunset Orange** - Warm and energetic
4. **Royal Purple** - Creative and luxurious
5. **Ocean Teal** - Calm and refreshing

## Validation Features

### Contrast Validation
- Ensures sufficient contrast ratio (≥4.5:1) for accessibility
- Validates primary and secondary colors against neutral background
- Provides specific feedback for contrast issues

### Harmony Validation
- Checks if colors follow the selected harmony type rules
- Validates hue differences according to color theory
- Supports all 6 harmony types with specific validation rules

### Saturation Validation
- Ensures colors are not overly saturated for professional use
- Recommends balanced saturation levels
- Provides guidance for color refinement

## Performance Considerations

- **Efficient Color Calculations**: Uses optimized color conversion algorithms
- **Memoized Components**: Prevents unnecessary re-renders
- **Gesture Optimization**: Smooth pan gesture handling with React Native Reanimated
- **Memory Management**: Proper cleanup of animation values and listeners

## Accessibility Features

- **High Contrast Support**: Built-in contrast ratio validation
- **Screen Reader Support**: Proper accessibility labels and hints
- **Reduced Motion**: Respects user's motion preferences
- **Color Blindness Support**: Validation considers color blindness types

## Platform Support

- **iOS**: Full support with native gesture handling
- **Android**: Full support with native gesture handling
- **Web**: Full support with mouse and touch events

## Troubleshooting

### Common Issues

1. **Color wheel not responding to touches**
   - Ensure `react-native-gesture-handler` is properly installed
   - Check that gesture handler is imported at the top of your app

2. **Colors not updating**
   - Verify the context provider is wrapping your component
   - Check that the `useColorPalette` hook is used within the provider

3. **Validation score always 0**
   - Ensure the palette object has all required properties
   - Check that colors are valid hex values

### Performance Tips

- Use `useMemo` for expensive color calculations
- Avoid frequent palette updates in animations
- Consider using predefined palettes for better performance

## Examples

See `ColorPaletteExample.tsx` for comprehensive usage examples including:

- Basic palette management
- Color wheel interaction
- Harmony type switching
- Validation feedback
- Predefined palette selection
- Custom palette creation
- Integration with other components 