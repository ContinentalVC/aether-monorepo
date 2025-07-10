# ProgressPieChart

A comprehensive React Native pie chart component with data-driven animations, haptic feedback, comprehensive accessibility support, AsyncStorage persistence, and PNG export functionality.

## Features

### Core Features
- **Interactive Pie Chart**: Donut-style chart with interactive segments
- **Data-Driven Animations**: Smooth transitions using LayoutAnimation API
- **Haptic Feedback**: Tactile feedback on segment interactions
- **Comprehensive Accessibility**: Full VoiceOver and TalkBack support
- **AsyncStorage Persistence**: Save, load, and manage chart data
- **PNG Export**: Export chart as high-quality PNG image
- **JSON Export**: Export chart data as structured JSON

### Visual Customization
- Customizable chart size and inner radius
- Optional segment labels and text backgrounds
- Configurable colors and styling
- Smooth focus animations for selected segments

### Data Management
- Automatic data persistence with AsyncStorage
- Data validation and error handling
- Chart history management
- Statistics and analytics
- Import/export functionality

### Accessibility Features
- Individual segment accessibility with clear labels
- Center label component announcements
- Interactive legend with detailed information
- Screen reader announcements for selections
- Proper accessibility roles and states

## Installation

### Requirements
- React Native 0.63+
- Expo SDK 40+
- @react-native-async-storage/async-storage
- react-native-view-shot
- react-native-haptic-feedback
- react-native-gifted-charts

### Dependencies

Add the required dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.21.0",
    "react-native-view-shot": "^3.8.0",
    "react-native-haptic-feedback": "^1.4.2",
    "react-native-gifted-charts": "^1.3.47"
  }
}
```

Install dependencies:

```bash
npm install
# or
yarn install
```

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import ProgressPieChart, { PieChartData } from './ProgressPieChart';

const App = () => {
  const [chartData, setChartData] = useState<PieChartData[]>([
    { value: 30, color: '#3b82f6', text: 'JavaScript' },
    { value: 25, color: '#10b981', text: 'React Native' },
    { value: 20, color: '#f59e0b', text: 'TypeScript' },
    { value: 15, color: '#ef4444', text: 'Node.js' },
    { value: 10, color: '#8b5cf6', text: 'GraphQL' },
  ]);

  const handleSegmentPress = (segment: PieChartData, index: number) => {
    console.log(`Pressed: ${segment.text} (${segment.value})`);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ProgressPieChart
        data={chartData}
        title="Skills Mastery"
        subtitle="Distribution of mastered skills"
        size={250}
        enableAnimations={true}
        enableHaptics={true}
        enablePersistence={true}
        showExportButtons={true}
        onSegmentPress={handleSegmentPress}
      />
    </View>
  );
};
```

### With AsyncStorage Persistence

```tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import ProgressPieChart, { PieChartData } from './ProgressPieChart';

const App = () => {
  const [chartData, setChartData] = useState<PieChartData[]>([]);

  const handleDataSaved = (success: boolean, error?: string) => {
    if (success) {
      Alert.alert('Success', 'Chart data saved successfully!');
    } else {
      Alert.alert('Error', `Failed to save: ${error}`);
    }
  };

  const handleDataLoaded = (data: PieChartData[], success: boolean, error?: string) => {
    if (success && data.length > 0) {
      setChartData(data);
      Alert.alert('Success', `Loaded ${data.length} data points`);
    } else if (success) {
      Alert.alert('Info', 'No saved data found');
    } else {
      Alert.alert('Error', `Failed to load: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ProgressPieChart
        data={chartData}
        enablePersistence={true}
        showExportButtons={true}
        onDataSaved={handleDataSaved}
        onDataLoaded={handleDataLoaded}
      />
    </View>
  );
};
```

### With Custom Configuration

```tsx
import React from 'react';
import { View } from 'react-native';
import ProgressPieChart, { PieChartData } from './ProgressPieChart';

const App = () => {
  const data: PieChartData[] = [
    { value: 40, color: '#3b82f6', text: 'Mobile Apps' },
    { value: 30, color: '#10b981', text: 'Web Apps' },
    { value: 20, color: '#f59e0b', text: 'APIs' },
    { value: 10, color: '#ef4444', text: 'Tools' },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ProgressPieChart
        data={data}
        title="Project Distribution"
        subtitle="Current project allocation"
        size={300}
        innerRadius={80}
        showLabels={true}
        enableAnimations={true}
        animationDuration={500}
        enableHaptics={true}
        hapticType="impactMedium"
        enablePersistence={true}
        showExportButtons={true}
        accessibilityLabel="Project distribution chart"
        accessibilityHint="Interactive pie chart showing project allocation percentages"
        onSegmentPress={(segment, index) => {
          console.log(`Selected: ${segment.text}`);
        }}
      />
    </View>
  );
};
```

## API Reference

### Props

#### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieChartData[]` | `[]` | Array of data points for the pie chart |
| `isLoading` | `boolean` | `false` | Whether the component is in a loading state |
| `title` | `string` | `'Skills Mastery'` | Title displayed above the chart |
| `subtitle` | `string` | `'Distribution of mastered skills'` | Subtitle displayed below the title |

#### Chart Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | `200` | Size of the chart in pixels |
| `innerRadius` | `number` | `60` | Inner radius for donut chart |
| `showLabels` | `boolean` | `true` | Whether to show labels on chart segments |

#### Animation & Interaction

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableAnimations` | `boolean` | `true` | Whether to enable data-driven animations |
| `animationDuration` | `number` | `300` | Duration of animations in milliseconds |
| `enableHaptics` | `boolean` | `true` | Whether to enable haptic feedback |
| `hapticType` | `'selection' \| 'impactLight' \| 'impactMedium' \| 'impactHeavy'` | `'selection'` | Type of haptic feedback |

#### Persistence & Export

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enablePersistence` | `boolean` | `false` | Whether to enable AsyncStorage persistence |
| `showExportButtons` | `boolean` | `false` | Whether to show export buttons |
| `onDataSaved` | `(success: boolean, error?: string) => void` | `undefined` | Callback when data is saved |
| `onDataLoaded` | `(data: PieChartData[], success: boolean, error?: string) => void` | `undefined` | Callback when data is loaded |

#### Accessibility

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accessibilityLabel` | `string` | `'Skills mastery distribution chart'` | Accessibility label for the chart |
| `accessibilityHint` | `string` | `'Interactive pie chart...'` | Accessibility hint for the chart |

#### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onSegmentPress` | `(segment: PieChartData, index: number) => void` | Callback when a segment is pressed |
| `style` | `any` | Additional styles for the container |

### Data Types

#### PieChartData

```tsx
interface PieChartData {
  value: number;    // Numeric value for the segment
  color: string;    // Color of the segment (hex, rgb, or named color)
  text: string;     // Label text for the segment
}
```

## Storage Utilities

### Chart Storage Functions

The component uses a comprehensive storage utility system for data persistence:

#### saveChartData(data, title)
Saves chart data to AsyncStorage with validation and error handling.

```tsx
import { saveChartData } from '../utils/chartStorage';

const data = [
  { id: '1', label: 'JavaScript', value: 30, color: '#3b82f6' },
  { id: '2', label: 'React Native', value: 25, color: '#10b981' },
];

try {
  const savedChart = await saveChartData(data, 'My Chart');
  console.log('Saved chart:', savedChart.id);
} catch (error) {
  console.error('Save failed:', error.message);
}
```

#### loadChartData()
Loads the most recent chart data from AsyncStorage.

```tsx
import { loadChartData } from '../utils/chartStorage';

try {
  const data = await loadChartData();
  if (data.length > 0) {
    console.log(`Loaded ${data.length} data points`);
  } else {
    console.log('No saved data found');
  }
} catch (error) {
  console.error('Load failed:', error.message);
}
```

#### clearAllChartData()
Clears all saved chart data from AsyncStorage.

```tsx
import { clearAllChartData } from '../utils/chartStorage';

try {
  await clearAllChartData();
  console.log('All data cleared');
} catch (error) {
  console.error('Clear failed:', error.message);
}
```

#### getChartStatistics()
Retrieves statistics about saved chart data.

```tsx
import { getChartStatistics } from '../utils/chartStorage';

try {
  const stats = await getChartStatistics();
  console.log('Total charts:', stats.totalCharts);
  console.log('Total data points:', stats.totalDataPoints);
  console.log('Average points per chart:', stats.averageDataPoints);
  console.log('Last updated:', stats.lastUpdated);
} catch (error) {
  console.error('Statistics failed:', error.message);
}
```

## Export Functionality

### PNG Export

The component can export the chart as a high-quality PNG image:

```tsx
// The export is handled automatically when showExportButtons={true}
// Users can tap the "Export PNG" button to capture and share the chart
```

### JSON Export

Chart data can be exported as structured JSON:

```tsx
import { exportChartDataAsJSON } from '../utils/chartStorage';

const data = [
  { id: '1', label: 'JavaScript', value: 30, color: '#3b82f6' },
  { id: '2', label: 'React Native', value: 25, color: '#10b981' },
];

const jsonData = exportChartDataAsJSON(data);
console.log(jsonData);
// Output:
// {
//   "version": "1.0",
//   "exportedAt": "2024-01-15T10:30:00.000Z",
//   "data": [...],
//   "total": 55,
//   "count": 2
// }
```

## Accessibility Support

### VoiceOver/TalkBack Integration

The component provides comprehensive accessibility support:

#### Chart Container
- **Label**: "Skills mastery distribution chart with 5 segments. 100% total mastered."
- **Role**: `radiogroup`
- **Hint**: "Interactive pie chart showing skill mastery percentages. Double tap on segments to select them."

#### Individual Segments
- **Label**: "JavaScript, 30% of total. Segment 1 of 5. Double tap to select."
- **Role**: `button`
- **State**: `selected` or `not selected`

#### Center Label
- **Label**: "Center label showing 100% mastered skills from 5 total segments."
- **Role**: `text`
- **Hint**: "Shows the total percentage of mastered skills"

#### Legend Items
- **Label**: "JavaScript, 30%. Not selected. Double tap to select this segment."
- **Role**: `button`
- **State**: `selected` or `not selected`

#### Export Buttons
- **Save Button**: "Save chart data" with hint "Save current chart data to device storage"
- **PNG Button**: "Export as PNG" with hint "Export chart as PNG image and share"
- **JSON Button**: "Export as JSON" with hint "Export chart data as JSON and share"

### Screen Reader Announcements

The component announces selection changes to screen readers:

```tsx
// When a segment is selected
AccessibilityInfo.announceForAccessibility("Selected JavaScript, 30%");

// When a segment is deselected
AccessibilityInfo.announceForAccessibility("Deselected JavaScript");
```

## Animation Features

### Data-Driven Animations

The component uses React Native's LayoutAnimation API for smooth transitions:

```tsx
// Animation is triggered when data changes
useEffect(() => {
  if (enableAnimations && hasDataChanged && !isLoading) {
    setIsAnimating(true);
    LayoutAnimation.configureNext(createLayoutAnimation(animationDuration));
    // ... animation logic
  }
}, [data, enableAnimations, hasDataChanged, isLoading, animationDuration]);
```

### Interactive Animations

- **Segment Focus**: Selected segments scale and change color
- **Legend Focus**: Legend items highlight when selected
- **Smooth Transitions**: All state changes are animated
- **Loading States**: Smooth loading indicators

## Haptic Feedback

### Haptic Types

The component supports multiple haptic feedback types:

```tsx
// Selection feedback (light tap)
hapticType="selection"

// Light impact feedback
hapticType="impactLight"

// Medium impact feedback
hapticType="impactMedium"

// Heavy impact feedback
hapticType="impactHeavy"
```

### Haptic Triggers

Haptic feedback is triggered on:
- Segment press
- Legend item press
- Successful data save
- Successful export operations

## Error Handling

### Storage Errors

The component handles various storage-related errors:

```tsx
try {
  await saveChartData(data, title);
} catch (error) {
  const storageError: StorageError = {
    message: error.message,
    code: 'SAVE_ERROR',
    timestamp: new Date().toISOString(),
  };
  // Handle error appropriately
}
```

### Export Errors

Export operations include comprehensive error handling:

```tsx
try {
  const uri = await viewShotRef.current.capture();
  await Share.share({ url: uri, title: 'Chart Export' });
} catch (error) {
  Alert.alert('Export Error', `Failed to export chart: ${error.message}`);
}
```

## Performance Considerations

### Memory Management
- Efficient data structures for chart rendering
- Proper cleanup of ViewShot references
- Optimized animation configurations

### Storage Optimization
- Background processing for heavy operations
- Efficient AsyncStorage operations
- Data validation before storage

### Animation Performance
- 60fps animations using LayoutAnimation API
- Efficient state management
- Proper cleanup of animation timers

## Best Practices

### Data Management
- Validate data before saving to storage
- Handle storage errors gracefully
- Provide user feedback for operations
- Implement proper loading states

### Accessibility
- Test with VoiceOver/TalkBack enabled
- Provide clear, descriptive labels
- Include helpful accessibility hints
- Maintain logical focus order

### Performance
- Limit animation duration for large datasets
- Use efficient data structures
- Implement proper error boundaries
- Optimize re-renders with useMemo

### User Experience
- Provide clear feedback for all interactions
- Include loading states for async operations
- Handle edge cases gracefully
- Maintain consistent interaction patterns

## Example Implementation

See `ProgressPieChartExample.tsx` for a complete implementation demonstrating:
- Multiple dataset switching
- AsyncStorage persistence
- PNG and JSON export
- Data management operations
- Statistics display
- Comprehensive user interface
- Error handling
- Loading states

## Troubleshooting

### Common Issues

1. **Storage Not Working**
   - Ensure AsyncStorage is properly installed
   - Check for storage permissions
   - Verify data format is correct

2. **Export Not Working**
   - Ensure react-native-view-shot is installed
   - Check for file system permissions
   - Verify ViewShot reference is available

3. **Animations Not Smooth**
   - Enable LayoutAnimation on Android
   - Check animation duration settings
   - Verify data changes are significant enough

4. **Accessibility Issues**
   - Test with screen readers enabled
   - Verify accessibility labels are descriptive
   - Check for proper accessibility roles

### Debug Tips

```tsx
// Enable debug logging
console.log('Chart data:', data);
console.log('Storage operations:', storageOperations);
console.log('Export operations:', exportOperations);

// Check storage state
const stats = await getChartStatistics();
console.log('Storage statistics:', stats);
```

## License

This component is part of the Aether React Native App and follows the same licensing terms. 