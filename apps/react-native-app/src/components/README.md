# Aether React Native Components

A comprehensive collection of React Native components for the Aether monorepo, featuring modern design patterns, accessibility features, and cross-platform compatibility.

## 📚 Documentation

### Core Components
- [AetherGlassCard](./AetherGlassCard.md) - Beautiful glassmorphism card component
- [ProgressPieChart](./ProgressPieChart.md) - Interactive pie chart with animations
- [BarChart3D](./BarChart3D.md) - 3D bar chart with Three.js integration
- [ColorPaletteManager](./ColorPaletteManager.md) - Dynamic color palette management
- [IconographyManager](./IconographyManager.md) - Icon system and management

### Package Documentation
- [@aether/react-native-accessibility](./packages/aether-react-native-accessibility/README.md) - Accessibility utilities and components
- [@aether/react-native-charts](./packages/aether-react-native-charts/README.md) - Chart components and data visualization
- [@aether/react-native-forms](./packages/aether-react-native-forms/README.md) - Form components and validation
- [@aether/react-native-theme](./packages/aether-react-native-theme/README.md) - React Native theming system
- [@aether/react-native-ui](./packages/aether-react-native-ui/README.md) - React Native UI components
- [@aether/react-native-utils](./packages/aether-react-native-utils/README.md) - React Native utilities and helpers

### Web Components
- [@aether/web-theme](./packages/aether-web-theme/README.md) - Web theming system with styled-components
- [@aether/web-ui](./packages/aether-web-ui/README.md) - Web UI components with glassmorphism design
- [@aether/web-components](./packages/AetherWeb/README.md) - Web-optimized React Native components
- [@aether/web-components](./packages/aether-web-components/README.md) - Web-specific UI components

### Core Packages
- [@aether/core](./packages/aether-core/README.md) - Core utilities and functions
- [@aether/shared-types](./packages/aether-shared-types/README.md) - Shared TypeScript types
- [@aether/core-logic](./packages/core-logic/README.md) - Business logic and state management
- [@aether/ui-components](./packages/ui-components/README.md) - Shared UI components and design system

## 🚀 Quick Start

### Installation

```bash
# Install the main package
npm install @aether/react-native-ui

# Install additional packages as needed
npm install @aether/react-native-charts
npm install @aether/react-native-forms
npm install @aether/react-native-accessibility
```

### Basic Usage

```tsx
import React from 'react';
import { 
  AetherGlassCard, 
  ProgressPieChart,
  BarChart3D 
} from '@aether/react-native-ui';

const App = () => {
  return (
    <div style={{ padding: 20 }}>
      <AetherGlassCard blur={15}>
        <h1>Welcome to Aether</h1>
        <p>Beautiful, accessible components for modern applications.</p>
      </AetherGlassCard>
      
      <ProgressPieChart
        data={[
          { label: 'React', value: 40, color: '#61dafb' },
          { label: 'TypeScript', value: 30, color: '#3178c6' },
          { label: 'Node.js', value: 30, color: '#339933' }
        ]}
        size={200}
      />
    </div>
  );
};
```

## 🏗️ Component Library

### Glassmorphism Components

#### AetherGlassCard
Beautiful glassmorphism card component with blur effects and animations.

```tsx
import { AetherGlassCard } from '@aether/react-native-ui';

<AetherGlassCard
  backgroundImage={{ uri: 'https://example.com/bg.jpg' }}
  blurAmount={15}
  blurType="light"
  animated={true}
  animationDuration={800}
  pressable={true}
  onPress={() => console.log('Card pressed!')}
>
  <h2>Glass Card</h2>
  <p>Beautiful frosted glass effect</p>
</AetherGlassCard>
```

**Props:**
- `children` - Content to render inside the card
- `backgroundImage` - Background image for blur effect
- `style` - Additional styles for the container
- `animated` - Whether to animate on mount (default: true)
- `animationDuration` - Animation duration in milliseconds (default: 800)
- `blurAmount` - Blur intensity (0-100, default: 15)
- `blurType` - Type of blur effect
- `onPress` - Callback when card is pressed
- `pressable` - Whether the card is pressable (default: false)

### Chart Components

#### ProgressPieChart
Interactive pie chart component with animations and touch support.

```tsx
import { ProgressPieChart } from '@aether/react-native-charts';

<ProgressPieChart
  data={[
    { label: 'Completed', value: 75, color: '#4CAF50' },
    { label: 'In Progress', value: 20, color: '#FF9800' },
    { label: 'Pending', value: 5, color: '#F44336' }
  ]}
  size={250}
  innerRadius={60}
  showLabels={true}
  title="Project Progress"
  subtitle="Current status overview"
  onSegmentPress={(segment, index) => console.log('Segment pressed:', segment)}
/>
```

**Props:**
- `data` - Array of pie chart data objects
- `isLoading` - Whether the component is in a loading state
- `title` - Title displayed above the chart
- `subtitle` - Subtitle displayed below the title
- `size` - Size of the chart (default: 200)
- `innerRadius` - Inner radius for donut chart (default: 60)
- `showLabels` - Whether to show labels on chart segments (default: true)
- `onSegmentPress` - Callback when a segment is pressed
- `style` - Additional styles for the container

#### BarChart3D
3D bar chart component with Three.js integration.

```tsx
import { BarChart3D } from '@aether/react-native-charts';

<BarChart3D
  data={[
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 180 },
    { label: 'Q3', value: 150 },
    { label: 'Q4', value: 220 }
  ]}
  width={600}
  height={400}
  barWidth={0.8}
  barSpacing={1.2}
  colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
  showLabels={true}
  animate={true}
/>
```

**Props:**
- `data` - Array of objects with label and value properties
- `width` - Width of the chart container (default: screen width)
- `height` - Height of the chart container (default: 400)
- `barWidth` - Width of each bar in 3D units (default: 0.8)
- `barSpacing` - Spacing between bars in 3D units (default: 1.2)
- `baseHeight` - Base height for bars (minimum height, default: 0.1)
- `colors` - Array of colors for bars (default: default palette)
- `backgroundColor` - Background color of the scene (default: '#f0f0f0')
- `showLabels` - Whether to show labels on bars (default: true)
- `animate` - Whether to animate bars on mount (default: true)

### Management Components

#### ColorPaletteManager
Dynamic color palette management with real-time updates.

```tsx
import { ColorPaletteManager } from './ColorPaletteManager';

<ColorPaletteManager
  initialPalette={defaultPalette}
  onPaletteChange={handlePaletteChange}
  enableLivePreview={true}
  showAdvancedControls={false}
/>
```

#### IconographyManager
Icon system management with search and categorization.

```tsx
import { IconographyManager } from './IconographyManager';

<IconographyManager
  icons={iconLibrary}
  onIconSelect={handleIconSelect}
  searchEnabled={true}
  categories={['navigation', 'actions', 'status']}
/>
```

## 🎯 Features

### Cross-Platform Compatibility
All components work seamlessly across React Native and web platforms:

```tsx
// Same component works on both platforms
import { AetherGlassCard } from '@aether/react-native-ui';

// React Native
<AetherGlassCard>
  <Text>Native Content</Text>
</AetherGlassCard>

// Web
<AetherGlassCard>
  <div>Web Content</div>
</AetherGlassCard>
```

### Accessibility
Built-in accessibility features for all components:

```tsx
<AetherGlassCard
  accessible={true}
  accessibilityLabel="Information card"
  accessibilityHint="Double tap to view details"
  accessibilityRole="button"
>
  <Text accessibilityRole="heading" accessibilityLevel={1}>
    Accessible Content
  </Text>
</AetherGlassCard>
```

### Theme Integration
Seamless integration with Aether theme system:

```tsx
import { useTheme } from '@aether/react-native-theme';

const ThemedComponent = () => {
  const theme = useTheme();
  
  return (
    <AetherGlassCard
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <Text style={{ color: theme.colors.text.primary }}>
        Themed Content
      </Text>
    </AetherGlassCard>
  );
};
```

### Performance Optimization
Optimized for performance with memoization and lazy loading:

```tsx
// Memoized components for better performance
const MemoizedCard = memo(AetherGlassCard);
const MemoizedChart = memo(ProgressPieChart);

// Lazy loading for heavy components
const HeavyChart = lazy(() => import('@aether/react-native-charts').then(m => ({ 
  default: m.BarChart3D 
})));
```

## 🔧 Configuration

### Theme Setup
Configure the theme system for your application:

```tsx
import { ThemeProvider } from '@aether/react-native-theme';

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};
```

### Accessibility Setup
Configure accessibility features:

```tsx
import { AccessibilityProvider } from '@aether/react-native-accessibility';

const App = () => {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
};
```

### Form Validation
Set up form validation with the forms package:

```tsx
import { FormProvider } from '@aether/react-native-forms';

const App = () => {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
};
```

## 🧪 Testing

### Unit Tests
Test individual components:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { AetherGlassCard } from '@aether/react-native-ui';

describe('AetherGlassCard', () => {
  it('should render with children', () => {
    const { getByText } = render(
      <AetherGlassCard>
        <Text>Test Content</Text>
      </AetherGlassCard>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
  
  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <AetherGlassCard onPress={onPress} testID="glass-card">
        <Text>Test Content</Text>
      </AetherGlassCard>
    );
    
    fireEvent.press(getByTestId('glass-card'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Tests
Test component interactions:

```tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProgressPieChart } from '@aether/react-native-charts';

describe('ProgressPieChart', () => {
  it('should handle segment press', async () => {
    const onSegmentPress = jest.fn();
    const data = [
      { label: 'Test', value: 50, color: '#ff0000' }
    ];
    
    const { getByTestId } = render(
      <ProgressPieChart
        data={data}
        onSegmentPress={onSegmentPress}
        testID="pie-chart"
      />
    );
    
    fireEvent.press(getByTestId('pie-chart'));
    
    await waitFor(() => {
      expect(onSegmentPress).toHaveBeenCalled();
    });
  });
});
```

## 📚 API Reference

### Common Props
All components support these common props:

```typescript
interface CommonProps {
  style?: ViewStyle;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
}
```

### Animation Props
Components with animations support:

```typescript
interface AnimationProps {
  animated?: boolean;
  animationDuration?: number;
  animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}
```

### Interaction Props
Components with interactions support:

```typescript
interface InteractionProps {
  pressable?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}
```

## 🎨 Styling Guidelines

### Using Theme Values
Always use theme values instead of hardcoded values:

```tsx
// ✅ Good - Uses theme values
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md
  }
});

// ❌ Bad - Hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8
  }
});
```

### Responsive Design
Use responsive utilities for different screen sizes:

```tsx
// ✅ Good - Responsive design
const styles = StyleSheet.create({
  container: {
    padding: responsive({
      xs: theme.spacing.sm,
      sm: theme.spacing.md,
      md: theme.spacing.lg,
      lg: theme.spacing.xl
    })
  }
});

// ❌ Bad - Fixed values
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md
  }
});
```

### Performance Optimization
Optimize component performance:

```tsx
// ✅ Good - Memoized components
const MemoizedComponent = memo(MyComponent);

// ✅ Good - Lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));

// ❌ Bad - No optimization
const Component = MyComponent;
```

## 🔍 Troubleshooting

### Common Issues

#### Components not rendering
Check imports and dependencies:

```tsx
// ✅ Correct
import { AetherGlassCard } from '@aether/react-native-ui';

// ❌ Incorrect
import AetherGlassCard from '@aether/react-native-ui/AetherGlassCard';
```

#### Theme not applying
Check theme provider setup:

```tsx
// ✅ Correct
<ThemeProvider>
  <App />
</ThemeProvider>

// ❌ Incorrect
<App />
```

#### Performance issues
Optimize with memoization and lazy loading:

```tsx
// ✅ Good - Optimized imports
import { AetherGlassCard } from '@aether/react-native-ui';
const HeavyChart = lazy(() => import('@aether/react-native-charts').then(m => ({ 
  default: m.BarChart3D 
})));

// ❌ Bad - Import everything
import * as Components from '@aether/react-native-ui';
```

### Debug Mode
Enable debug mode for troubleshooting:

```tsx
import { setDebugMode } from '@aether/react-native-ui';

// Enable debug mode
setDebugMode(true);

// Check component state
console.log('Component debug info:', componentDebugInfo);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Packages

- `@aether/core` - Core utilities
- `@aether/shared-types` - Shared TypeScript types
- `@aether/react-native-theme` - React Native theming
- `@aether/web-ui` - Web UI components
