# IconographyManager Component Documentation

## Overview

The `IconographyManager` is a comprehensive React Native component that provides a complete icon management system with customizable icon styles, families, weights, sizes, and animations. Built with React Context for global state management and integrated with the Aether theme system for consistent design language.

## Features

### ✨ Core Features
- **Icon Style System**: Complete icon styling with family, weight, size, color, positioning, and animation
- **Multiple Icon Families**: SF Symbols, Custom, Outlined, Filled, Rounded, Sharp, Two-Tone
- **Flexible Weight System**: 9 weight options from Ultra Light to Black
- **Size Scale**: 6 size options from Tiny (12pt) to Huge (48pt)
- **Color Treatments**: Theme, Monochrome, Accent, Semantic, and Custom color options
- **Animation Support**: 6 animation types including Bounce, Pulse, Rotate, and Scale

### 🎨 Design Features
- **Icon Categories**: Organized icons by Actions, Status, Media, Communication, Commerce, Social, System
- **Accessibility Focus**: Built-in accessibility labels and screen reader support
- **Theme Integration**: Seamless integration with Aether theme system
- **Custom Icon Support**: Add and manage custom icon definitions
- **Icon Mapping**: Map original icon names to custom implementations

### 🔧 Technical Features
- **Context Provider**: React Context for global icon management
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Performance Optimized**: Efficient icon rendering and caching
- **Search & Filter**: Advanced icon search and category filtering
- **Persistence**: Automatic saving and loading of icon preferences

## Installation

### Dependencies

The component requires the following dependencies:

```json
{
  "dependencies": {
    "@aether/core": "file:../../packages/aether-core",
    "react-native": "0.73.6",
    "react": "18.2.0"
  }
}
```

### Import

```tsx
import { 
  IconographyProvider, 
  useIconography,
  IconFamily,
  IconWeight,
  IconSize,
  IconColorTreatment,
  IconPositioning,
  IconAnimation,
  IconCategory,
  type IconStyle,
  type IconDefinition
} from './IconographyManager';
```

## Usage

### Basic Usage with Provider

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { 
  IconographyProvider, 
  useIconography,
  IconFamily,
  IconWeight 
} from './IconographyManager';

const App = () => {
  return (
    <IconographyProvider>
      <MyComponent />
    </IconographyProvider>
  );
};

const MyComponent = () => {
  const { 
    currentStyle, 
    getIcon, 
    setIconFamily, 
    setIconWeight 
  } = useIconography();
  
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Display current icon style */}
      <Text>Family: {currentStyle.family}</Text>
      <Text>Weight: {currentStyle.weight}</Text>
      <Text>Size: {currentStyle.size}</Text>
      
      {/* Render an icon */}
      {getIcon('star')}
      
      {/* Change icon style */}
      <TouchableOpacity onPress={() => setIconFamily(IconFamily.FILLED)}>
        <Text>Switch to Filled Icons</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Advanced Usage with Custom Configuration

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { 
  IconographyProvider, 
  useIconography,
  IconFamily,
  IconWeight,
  IconSize,
  IconColorTreatment,
  IconAnimation,
  IconCategory
} from './IconographyManager';

const AdvancedExample = () => {
  const {
    currentStyle,
    updateIconStyle,
    getIconsByCategory,
    searchIcons,
    availableFamilies,
    availableWeights,
    availableSizes
  } = useIconography();

  const [searchQuery, setSearchQuery] = useState('');

  const handleStyleChange = (property: keyof IconStyle, value: any) => {
    updateIconStyle({ [property]: value });
  };

  const actionIcons = getIconsByCategory(IconCategory.ACTIONS);
  const searchResults = searchIcons(searchQuery);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Style Controls */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Icon Style Controls
        </Text>
        
        {/* Family Selection */}
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Family:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableFamilies.map((family) => (
            <TouchableOpacity
              key={family}
              onPress={() => handleStyleChange('family', family)}
              style={{
                padding: 8,
                marginRight: 8,
                backgroundColor: currentStyle.family === family ? '#007AFF' : '#f0f0f0',
                borderRadius: 6
              }}
            >
              <Text style={{ 
                color: currentStyle.family === family ? 'white' : 'black',
                fontSize: 12
              }}>
                {family}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Weight Selection */}
        <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Weight:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableWeights.map((weight) => (
            <TouchableOpacity
              key={weight}
              onPress={() => handleStyleChange('weight', weight)}
              style={{
                padding: 8,
                marginRight: 8,
                backgroundColor: currentStyle.weight === weight ? '#007AFF' : '#f0f0f0',
                borderRadius: 6
              }}
            >
              <Text style={{ 
                color: currentStyle.weight === weight ? 'white' : 'black',
                fontSize: 12
              }}>
                {weight}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Size Selection */}
        <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 5 }}>Size:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableSizes.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => handleStyleChange('size', size)}
              style={{
                padding: 8,
                marginRight: 8,
                backgroundColor: currentStyle.size === size ? '#007AFF' : '#f0f0f0',
                borderRadius: 6
              }}
            >
              <Text style={{ 
                color: currentStyle.size === size ? 'white' : 'black',
                fontSize: 12
              }}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Icon Preview */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Icon Preview
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {actionIcons.slice(0, 6).map((icon) => (
            <View key={icon.name} style={{ alignItems: 'center' }}>
              {getIcon(icon.name)}
              <Text style={{ fontSize: 10, marginTop: 4 }}>{icon.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Search Icons */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Search Icons
        </Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search icons..."
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 10
          }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {searchResults.slice(0, 8).map((icon) => (
            <View key={icon.name} style={{ alignItems: 'center' }}>
              {getIcon(icon.name)}
              <Text style={{ fontSize: 10, marginTop: 4 }}>{icon.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
```

### Custom Icon Management

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { 
  useIconography,
  IconCategory,
  type IconDefinition
} from './IconographyManager';

const CustomIconExample = () => {
  const {
    customIcons,
    addCustomIcon,
    removeCustomIcon,
    mapIcon
  } = useIconography();

  const [newIconName, setNewIconName] = useState('');
  const [newIconUnicode, setNewIconUnicode] = useState('');

  const handleAddCustomIcon = () => {
    if (newIconName && newIconUnicode) {
      const customIcon: IconDefinition = {
        name: newIconName,
        category: IconCategory.CUSTOM,
        description: `Custom icon: ${newIconName}`,
        tags: ['custom', newIconName.toLowerCase()],
        accessibilityLabel: newIconName,
        unicode: newIconUnicode
      };
      
      addCustomIcon(customIcon);
      setNewIconName('');
      setNewIconUnicode('');
    }
  };

  const handleMapIcon = (originalName: string) => {
    mapIcon(originalName, `custom_${originalName}`);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Add Custom Icon */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Add Custom Icon
        </Text>
        
        <TextInput
          value={newIconName}
          onChangeText={setNewIconName}
          placeholder="Icon name"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 10
          }}
        />
        
        <TextInput
          value={newIconUnicode}
          onChangeText={setNewIconUnicode}
          placeholder="Unicode character (e.g., ★)"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            marginBottom: 10
          }}
        />
        
        <TouchableOpacity
          onPress={handleAddCustomIcon}
          style={{
            padding: 15,
            backgroundColor: '#007AFF',
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Add Custom Icon
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Icons List */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Custom Icons ({Object.keys(customIcons).length})
        </Text>
        
        {Object.values(customIcons).map((icon) => (
          <View key={icon.name} style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#f0f0f0',
            marginBottom: 5,
            borderRadius: 8
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, marginRight: 10 }}>
                {icon.unicode}
              </Text>
              <Text>{icon.name}</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => removeCustomIcon(icon.name)}
              style={{
                padding: 5,
                backgroundColor: '#FF3B30',
                borderRadius: 4
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Icon Mapping */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Icon Mapping
        </Text>
        
        <TouchableOpacity
          onPress={() => handleMapIcon('star')}
          style={{
            padding: 10,
            backgroundColor: '#f0f0f0',
            borderRadius: 8,
            marginBottom: 5
          }}
        >
          <Text>Map 'star' to custom implementation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

## API Reference

### IconStyle Interface

```tsx
interface IconStyle {
  family: IconFamily;           // Icon family/set
  weight: IconWeight;           // Icon weight/style
  size: IconSize;               // Icon size scale
  colorTreatment: IconColorTreatment; // Icon color treatment
  positioning: IconPositioning; // Icon positioning and alignment
  animation: IconAnimation;     // Animation style for interactive icons
}
```

### IconDefinition Interface

```tsx
interface IconDefinition {
  name: string;                 // Icon name
  category: IconCategory;       // Icon category
  description: string;          // Icon description
  tags: string[];               // Search tags
  accessibilityLabel: string;   // Accessibility label
  unicode?: string;             // Unicode character
  customPath?: string;          // Custom SVG path
}
```

### IconographyContextType Interface

```tsx
interface IconographyContextType {
  // Current icon style
  currentStyle: IconStyle;
  
  // Custom icons and mappings
  customIcons: Record<string, IconDefinition>;
  iconMappings: Record<string, string>;
  
  // Style management
  updateIconStyle: (style: Partial<IconStyle>) => void;
  setIconFamily: (family: IconFamily) => void;
  setIconWeight: (weight: IconWeight) => void;
  setIconSize: (size: IconSize) => void;
  setIconColorTreatment: (treatment: IconColorTreatment) => void;
  setIconPositioning: (positioning: IconPositioning) => void;
  setIconAnimation: (animation: IconAnimation) => void;
  
  // Icon management
  addCustomIcon: (icon: IconDefinition) => void;
  removeCustomIcon: (name: string) => void;
  mapIcon: (originalName: string, mappedName: string) => void;
  
  // Icon retrieval
  getIcon: (name: string, style?: Partial<IconStyle>) => ReactNode;
  getIconColor: (style?: Partial<IconStyle>) => string;
  getIconSize: (style?: Partial<IconStyle>) => number;
  
  // Icon search and filtering
  getIconsByCategory: (category: IconCategory) => IconDefinition[];
  searchIcons: (query: string) => IconDefinition[];
  
  // Available options
  availableFamilies: IconFamily[];
  availableWeights: IconWeight[];
  availableSizes: IconSize[];
  availableColorTreatments: IconColorTreatment[];
  availablePositionings: IconPositioning[];
  availableAnimations: IconAnimation[];
  availableCategories: IconCategory[];
}
```

### IconFamily Enum

```tsx
enum IconFamily {
  SF_SYMBOLS = 'SF Symbols',    // Apple's system icons
  CUSTOM = 'Custom',            // Custom icon set
  OUTLINED = 'Outlined',        // Clean outlined icons
  FILLED = 'Filled',            // Solid filled icons
  ROUNDED = 'Rounded',          // Soft rounded corners
  SHARP = 'Sharp',              // Sharp geometric shapes
  TWO_TONE = 'Two-Tone'         // Two-color icons
}
```

### IconWeight Enum

```tsx
enum IconWeight {
  ULTRA_LIGHT = 'Ultra Light',  // Very thin lines
  THIN = 'Thin',                // Thin lines
  LIGHT = 'Light',              // Light weight
  REGULAR = 'Regular',          // Standard weight
  MEDIUM = 'Medium',            // Medium weight
  SEMIBOLD = 'Semibold',        // Semi-bold
  BOLD = 'Bold',                // Bold weight
  HEAVY = 'Heavy',              // Heavy weight
  BLACK = 'Black'               // Black weight
}
```

### IconSize Enum

```tsx
enum IconSize {
  TINY = 'Tiny',                // 12pt
  SMALL = 'Small',              // 16pt
  MEDIUM = 'Medium',            // 20pt
  LARGE = 'Large',              // 24pt
  EXTRA_LARGE = 'Extra Large',  // 32pt
  HUGE = 'Huge'                 // 48pt
}
```

### IconColorTreatment Enum

```tsx
enum IconColorTreatment {
  THEME = 'Theme',              // Uses theme colors
  MONOCHROME = 'Monochrome',    // Single color
  ACCENT = 'Accent',            // Uses accent colors
  SEMANTIC = 'Semantic',        // Colors based on meaning
  CUSTOM = 'Custom'             // Custom color palette
}
```

### IconPositioning Enum

```tsx
enum IconPositioning {
  CENTER = 'Center',            // Centered alignment
  LEADING = 'Leading',          // Left-aligned
  TRAILING = 'Trailing',        // Right-aligned
  TOP = 'Top',                  // Top-aligned
  BOTTOM = 'Bottom'             // Bottom-aligned
}
```

### IconAnimation Enum

```tsx
enum IconAnimation {
  NONE = 'None',                // No animation
  SUBTLE = 'Subtle',            // Gentle hover effects
  BOUNCE = 'Bounce',            // Bouncy interaction
  PULSE = 'Pulse',              // Pulsing attention
  ROTATE = 'Rotate',            // Rotation on interaction
  SCALE = 'Scale'               // Scale transformation
}
```

### IconCategory Enum

```tsx
enum IconCategory {
  ACTIONS = 'Actions',          // Action icons
  STATUS = 'Status',            // Status indicators
  MEDIA = 'Media',              // Media controls
  COMMUNICATION = 'Communication', // Communication icons
  COMMERCE = 'Commerce',        // Commerce icons
  SOCIAL = 'Social',            // Social media icons
  SYSTEM = 'System',            // System icons
  CUSTOM = 'Custom'             // Custom icons
}
```

## Icon Families

### SF Symbols
Apple's system icons with consistent design language and accessibility features.

### Custom
Custom icon set with unique visual style and branding.

### Outlined
Clean outlined icons with minimal weight for a modern, minimal look.

### Filled
Solid filled icons with strong presence for emphasis and clarity.

### Rounded
Soft rounded corners for a friendly, approachable feel.

### Sharp
Sharp geometric shapes for a modern, technical appearance.

### Two-Tone
Two-color icons for visual interest and depth.

## Performance Considerations

- **Icon Caching**: Icons are cached for better performance
- **Lazy Loading**: Icons are loaded on demand
- **Memory Management**: Proper cleanup of icon resources
- **Optimized Rendering**: Efficient icon rendering with React Native

## Accessibility Features

- **Screen Reader Support**: All icons have accessibility labels
- **VoiceOver Integration**: Proper VoiceOver announcements
- **High Contrast Support**: Icons adapt to high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Platform Support

- **iOS**: Full support with SF Symbols integration
- **Android**: Full support with Material Design icons
- **Web**: Full support with web-safe fonts

## Troubleshooting

### Common Issues

1. **Icons not displaying**
   - Ensure the IconographyProvider is wrapping your component
   - Check that icon names match the available icons
   - Verify font files are properly loaded

2. **Custom icons not working**
   - Ensure custom icons have valid unicode or customPath
   - Check that icon names are unique
   - Verify accessibility labels are provided

3. **Style changes not applying**
   - Check that the useIconography hook is used within the provider
   - Verify that style properties are valid
   - Ensure theme integration is working

### Performance Tips

- Use appropriate icon sizes for your use case
- Avoid frequent style changes in animations
- Consider using predefined icon families for better performance
- Cache frequently used icons

## Examples

See `IconographyExample.tsx` for comprehensive usage examples including:

- Basic icon management
- Style customization
- Custom icon creation
- Icon search and filtering
- Category-based icon browsing
- Animation examples
- Theme integration
- Accessibility features 