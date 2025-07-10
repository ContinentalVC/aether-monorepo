# ProgressLineChart Component Documentation

## Overview

The `ProgressLineChart` component is an enhanced React Native line chart that provides smooth animations, haptic feedback, and interactive data visualization. Built with React Native Skia for high-performance rendering and React Native Reanimated for smooth animations.

## Features

### ✨ Core Features
- **Smooth Entrance Animation**: Line draws from left to right when the component appears
- **Haptic Feedback**: Tactile feedback when tapping data points
- **Interactive Data Points**: Tap to view detailed information
- **Customizable Styling**: Extensive theming and styling options
- **Responsive Design**: Adapts to different screen sizes
- **High Performance**: Built with React Native Skia for 60fps rendering

### 🎨 Visual Features
- **Grid Lines**: Optional background grid for better readability
- **Area Fill**: Optional area fill under the line
- **Data Point Labels**: Customizable labels for each data point
- **Multiple Variants**: Different visual styles and configurations
- **Color Customization**: Full control over colors and styling

### 📱 Interaction Features
- **Data Point Selection**: Tap to select and view point details
- **Haptic Feedback**: Light impact feedback on successful taps
- **Animation Controls**: Enable/disable and customize animations
- **Real-time Updates**: Smooth transitions when data changes

## Installation

### Dependencies

The component requires the following dependencies:

```json
{
  "dependencies": {
    "@shopify/react-native-skia": "^0.1.235",
    "react-native-reanimated": "~3.6.2",
    "expo-haptics": "~12.8.1"
  }
}
```

### Import

```tsx
import ProgressLineChart, { DataPoint } from './ProgressLineChart';
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import ProgressLineChart, { DataPoint } from './ProgressLineChart';

const MyComponent = () => {
  const data: DataPoint[] = [
    { x: 0, y: 10, label: 'Jan', value: 10 },
    { x: 1, y: 25, label: 'Feb', value: 25 },
    { x: 2, y: 15, label: 'Mar', value: 15 },
    { x: 3, y: 40, label: 'Apr', value: 40 },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ProgressLineChart
        data={data}
        width={350}
        height={250}
        animate={true}
        enableHaptics={true}
        onDataPointPress={(point, index) => {
          console.log(`Tapped ${point.label}: ${point.value}`);
        }}
      />
    </View>
  );
};
```

### Advanced Usage

```tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import ProgressLineChart, { DataPoint } from './ProgressLineChart';

const AdvancedExample = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const data: DataPoint[] = [
    { x: 0, y: 20, label: 'Q1', value: 20, color: '#FF6B6B' },
    { x: 1, y: 35, label: 'Q2', value: 35, color: '#4ECDC4' },
    { x: 2, y: 50, label: 'Q3', value: 50, color: '#45B7D1' },
    { x: 3, y: 65, label: 'Q4', value: 65, color: '#96CEB4' },
  ];

  const handleDataPointPress = (point: DataPoint, index: number) => {
    setSelectedPoint(index);
    Alert.alert(
      'Data Point Selected',
      `${point.label}: ${point.value}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ProgressLineChart
        data={data}
        width={350}
        height={250}
        lineColor="#8B5CF6"
        strokeWidth={4}
        pointSize={10}
        showLabels={true}
        showGrid={true}
        showArea={true}
        areaColor="#8B5CF6"
        areaOpacity={0.2}
        animate={true}
        animationDuration={2000}
        enableHaptics={true}
        onDataPointPress={handleDataPointPress}
      />
    </View>
  );
};
```

## Props

### DataPoint Interface

```tsx
interface DataPoint {
  x: number;           // X coordinate
  y: number;           // Y coordinate
  label: string;       // Display label
  value: number;       // Numeric value
  color?: string;      // Optional custom color
}
```

### ProgressLineChartProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `DataPoint[]` | `[]` | Array of data points to display |
| `width` | `number` | `Dimensions.get('window').width - 40` | Width of the chart container |
| `height` | `number` | `300` | Height of the chart container |
| `padding` | `number` | `20` | Padding around the chart |
| `lineColor` | `string` | `'#3B82F6'` | Color of the line stroke |
| `strokeWidth` | `number` | `3` | Width of the line stroke |
| `pointColor` | `string` | `'#3B82F6'` | Color of data points |
| `pointSize` | `number` | `8` | Size of data points |
| `showLabels` | `boolean` | `true` | Whether to show data point labels |
| `animate` | `boolean` | `true` | Whether to animate the chart on mount |
| `animationDuration` | `number` | `1500` | Duration of entrance animation in milliseconds |
| `enableHaptics` | `boolean` | `true` | Whether to enable haptic feedback |
| `style` | `ViewStyle` | `undefined` | Custom style for the container |
| `onDataPointPress` | `(point: DataPoint, index: number) => void` | `undefined` | Callback when a data point is tapped |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `gridColor` | `string` | `'#E5E7EB'` | Grid line color |
| `showArea` | `boolean` | `false` | Whether to show the area under the line |
| `areaColor` | `string` | `'#3B82F6'` | Area fill color |
| `areaOpacity` | `number` | `0.2` | Area fill opacity |

## Animation Features

### Entrance Animation

The component features a smooth entrance animation that draws the line from left to right:

```tsx
<ProgressLineChart
  animate={true}
  animationDuration={1500} // 1.5 seconds
  data={data}
/>
```

### Animation Controls

```tsx
const [animate, setAnimate] = useState(true);
const [animationDuration, setAnimationDuration] = useState(1500);

// Reset animation
const resetAnimation = () => {
  setAnimate(false);
  setTimeout(() => setAnimate(true), 100);
};

<ProgressLineChart
  animate={animate}
  animationDuration={animationDuration}
  data={data}
/>
```

## Haptic Feedback

### Enabling Haptic Feedback

```tsx
<ProgressLineChart
  enableHaptics={true}
  onDataPointPress={(point, index) => {
    // Haptic feedback will be triggered automatically
    console.log(`Tapped ${point.label}`);
  }}
/>
```

### Custom Haptic Feedback

```tsx
import * as Haptics from 'expo-haptics';

const handleDataPointPress = (point: DataPoint, index: number) => {
  // Custom haptic feedback
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  
  // Your custom logic
  console.log(`Tapped ${point.label}: ${point.value}`);
};
```

## Styling Examples

### Different Color Schemes

```tsx
// Blue theme
<ProgressLineChart
  lineColor="#3B82F6"
  pointColor="#3B82F6"
  areaColor="#3B82F6"
  data={data}
/>

// Purple theme
<ProgressLineChart
  lineColor="#8B5CF6"
  pointColor="#8B5CF6"
  areaColor="#8B5CF6"
  data={data}
/>

// Green theme
<ProgressLineChart
  lineColor="#10B981"
  pointColor="#10B981"
  areaColor="#10B981"
  data={data}
/>
```

### Custom Point Colors

```tsx
const data: DataPoint[] = [
  { x: 0, y: 20, label: 'Q1', value: 20, color: '#FF6B6B' },
  { x: 1, y: 35, label: 'Q2', value: 35, color: '#4ECDC4' },
  { x: 2, y: 50, label: 'Q3', value: 50, color: '#45B7D1' },
  { x: 3, y: 65, label: 'Q4', value: 65, color: '#96CEB4' },
];

<ProgressLineChart
  data={data}
  // Each point will use its custom color
/>
```

### Grid and Area Styling

```tsx
<ProgressLineChart
  data={data}
  showGrid={true}
  gridColor="#E5E7EB"
  showArea={true}
  areaColor="#3B82F6"
  areaOpacity={0.3}
/>
```

## Performance Considerations

### Large Datasets

For large datasets, consider:

```tsx
<ProgressLineChart
  data={largeDataset}
  animate={false} // Disable animation for better performance
  showLabels={false} // Hide labels for cleaner look
  pointSize={4} // Smaller points for dense data
/>
```

### Memory Management

```tsx
const [data, setData] = useState<DataPoint[]>([]);

// Clean up data when component unmounts
useEffect(() => {
  return () => {
    setData([]);
  };
}, []);
```

## Best Practices

### 1. Data Preparation

```tsx
// Ensure data is properly formatted
const prepareData = (rawData: any[]): DataPoint[] => {
  return rawData.map((item, index) => ({
    x: index,
    y: item.value,
    label: item.label,
    value: item.value,
  }));
};
```

### 2. Responsive Design

```tsx
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

<ProgressLineChart
  data={data}
  width={width - 40} // Responsive width
  height={250}
/>
```

### 3. Error Handling

```tsx
const handleDataPointPress = (point: DataPoint, index: number) => {
  try {
    // Your logic here
    console.log(`Point ${index}: ${point.value}`);
  } catch (error) {
    console.error('Error handling data point press:', error);
  }
};
```

### 4. Accessibility

```tsx
<ProgressLineChart
  data={data}
  onDataPointPress={(point, index) => {
    // Provide accessibility information
    AccessibilityInfo.announceForAccessibility(
      `${point.label}: ${point.value}`
    );
  }}
/>
```

## Troubleshooting

### Common Issues

1. **Animation not working**
   - Ensure `animate={true}` is set
   - Check that data array is not empty
   - Verify `animationDuration` is a positive number

2. **Haptic feedback not working**
   - Ensure `enableHaptics={true}` is set
   - Check that expo-haptics is properly installed
   - Verify device supports haptic feedback

3. **Performance issues**
   - Reduce `pointSize` for large datasets
   - Disable animations with `animate={false}`
   - Consider hiding labels with `showLabels={false}`

4. **Data not displaying**
   - Verify data array is not empty
   - Check that x and y values are numbers
   - Ensure width and height are positive numbers

### Debug Mode

```tsx
<ProgressLineChart
  data={data}
  onDataPointPress={(point, index) => {
    console.log('Data point pressed:', { point, index });
  }}
/>
```

## Examples

See `ProgressLineChartExample.tsx` for a complete demonstration of all features including:

- Multiple datasets
- Animation controls
- Haptic feedback settings
- Styling options
- Interactive features

## Contributing

When contributing to this component:

1. Maintain TypeScript types
2. Add comprehensive JSDoc comments
3. Test with various data scenarios
4. Ensure accessibility compliance
5. Follow React Native best practices

## License

This component is part of the Aether React Native App and follows the same licensing terms. 