# Aether React Native Components

This directory contains reusable React Native components for the Aether project, implementing modern design patterns and glassmorphism effects.

## Components

### AetherGlassCard

A reusable React Native component that implements glassmorphism styling with blur effects and animations.

#### Features

- **Glassmorphism Effect**: Uses `@react-native-community/blur` for authentic glass-like appearance
- **Animated**: Smooth entrance animations with React Native Reanimated
- **Pressable**: Optional press interactions with scale animations
- **Customizable**: Configurable blur amount, type, and animation settings
- **TypeScript**: Fully typed with comprehensive prop interfaces
- **Styled Components**: Built with styled-components for maintainable styling

#### Installation

Make sure you have the required dependencies installed:

```bash
npm install @react-native-community/blur styled-components react-native-reanimated
```

For iOS, you'll also need to install pods:

```bash
cd ios && pod install
```

#### Usage

```tsx
import { AetherGlassCard } from '../components';

// Basic usage
<AetherGlassCard
  backgroundImage={require('../assets/background.jpg')}
>
  <Text>Hello, Aether!</Text>
</AetherGlassCard>

// With animations and press handling
<AetherGlassCard
  backgroundImage={require('../assets/background.jpg')}
  animated={true}
  pressable={true}
  onPress={() => console.log('Card pressed!')}
  blurAmount={20}
  blurType="light"
>
  <Text>Interactive Card</Text>
</AetherGlassCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content to render inside the card |
| `backgroundImage` | `ImageSourcePropType` | - | Background image for blur effect |
| `style` | `ViewStyle` | - | Additional styles for the container |
| `animated` | `boolean` | `true` | Whether to animate on mount |
| `animationDuration` | `number` | `800` | Animation duration in milliseconds |
| `blurAmount` | `number` | `15` | Blur intensity (0-100) |
| `blurType` | `'light' \| 'dark' \| 'xlight' \| 'prominent' \| 'regular' \| 'extraDark'` | `'light'` | Type of blur effect |
| `onPress` | `() => void` | - | Callback when card is pressed |
| `pressable` | `boolean` | `false` | Whether the card is pressable |

### ProgressPieChart

A React Native component that displays the distribution of mastered skills using a donut chart with interactive features and loading states.

#### Features

- **Donut Chart**: Uses `react-native-gifted-charts` for professional chart rendering
- **Interactive**: Tap segments to see detailed information
- **Loading States**: Handles loading and empty states gracefully
- **Center Label**: Shows total percentage of mastered skills
- **Legend**: Interactive legend with segment details
- **TypeScript**: Fully typed with comprehensive prop interfaces

#### Installation

Make sure you have the required dependencies installed:

```bash
npm install react-native-gifted-charts
```

#### Usage

```tsx
import { ProgressPieChart } from '../components';

// Basic usage
const skillsData = [
  { value: 25, color: '#6366f1', text: 'Programming' },
  { value: 20, color: '#10b981', text: 'Design' },
  { value: 15, color: '#f59e0b', text: 'Marketing' },
];

<ProgressPieChart
  data={skillsData}
  isLoading={false}
  title="Skills Mastery"
  onSegmentPress={(segment, index) => console.log(segment.text)}
/>

// With custom styling
<ProgressPieChart
  data={skillsData}
  size={250}
  innerRadius={70}
  showLabels={true}
  onSegmentPress={handleSegmentPress}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieChartData[]` | - | Array of data points for the pie chart |
| `isLoading` | `boolean` | `false` | Whether the component is in a loading state |
| `title` | `string` | `'Skills Mastery'` | Title displayed above the chart |
| `subtitle` | `string` | `'Distribution of mastered skills'` | Subtitle displayed below the title |
| `size` | `number` | `200` | Size of the chart |
| `innerRadius` | `number` | `60` | Inner radius for donut chart |
| `showLabels` | `boolean` | `true` | Whether to show labels on chart segments |
| `onSegmentPress` | `(segment: PieChartData, index: number) => void` | - | Callback when a segment is pressed |
| `style` | `any` | - | Additional styles for the container |

#### Data Structure

```tsx
interface PieChartData {
  value: number;    // Percentage value (0-100)
  color: string;    // Hex color for the segment
  text: string;     // Label for the segment
}
```

#### Blur Types

- **light**: Subtle light blur effect
- **dark**: Dark blur effect for light backgrounds
- **xlight**: Extra light blur effect
- **prominent**: Strong blur effect
- **regular**: Standard blur effect
- **extraDark**: Extra dark blur effect

#### Styling

The component uses styled-components for styling and includes:

- **Border Radius**: 20px for modern rounded corners
- **Border**: 1px solid white with 20% opacity
- **Background**: Semi-transparent white overlay
- **Overflow**: Hidden to maintain clean edges

#### Animation

The component includes several animation features:

- **Entrance Animation**: Scale and opacity transitions on mount
- **Press Animation**: Scale down effect when pressed (if pressable)
- **Blur Animation**: Gradual blur intensity increase
- **Staggered Timing**: Different animation timings for smooth effect

#### Performance Considerations

- Uses React Native Reanimated for 60fps animations
- Blur effects are hardware accelerated on supported devices
- Images are cached and optimized for performance
- Minimal re-renders with proper memoization

#### Platform Support

- **iOS**: Full support with native blur effects
- **Android**: Full support with native blur effects
- **Web**: Limited support (fallback to CSS blur)

#### Example

See `AetherGlassCardExample.tsx` for comprehensive usage examples including:

- Basic glass cards
- Animated entrance effects
- Pressable interactions
- Custom blur settings
- Grid layouts
- Different blur types

See `ProgressPieChartExample.tsx` for comprehensive usage examples including:

- Basic pie charts
- Interactive segment selection
- Loading and empty states
- Custom styling and colors
- Data manipulation controls

### BarChart3D

A React Native component that renders an interactive 3D bar chart using `react-three-fiber` and `@react-three/drei` with orbit controls and lighting.

#### Features

- **3D Visualization**: Uses Three.js via react-three-fiber for high-quality 3D rendering
- **Interactive Bars**: Tap bars to highlight and change colors
- **Orbit Controls**: Full camera control with drag, zoom, and rotation
- **Professional Lighting**: Ambient and directional lighting for realistic appearance
- **Responsive Layout**: Automatically adjusts to data and screen size
- **Animations**: Optional bar growth animations on mount
- **TypeScript**: Fully typed with comprehensive prop interfaces

#### Installation

Make sure you have the required dependencies installed:

```bash
npm install @react-three/fiber @react-three/drei three
npm install @types/three
```

For Expo projects, you may need to install additional packages:

```bash
npx expo install expo-gl expo-gl-cpp
```

#### Usage

```tsx
import { BarChart3D } from '../components';

// Basic usage
const data = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 180 },
  { label: 'Mar', value: 150 },
];

<BarChart3D
  data={data}
  width={350}
  height={400}
/>

// With custom styling and interactions
<BarChart3D
  data={data}
  colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
  showLabels={true}
  animate={true}
  barWidth={0.8}
  barSpacing={1.2}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `BarData[]` | - | Array of objects with label and value properties |
| `width` | `number` | `screen width` | Width of the chart container |
| `height` | `number` | `400` | Height of the chart container |
| `barWidth` | `number` | `0.8` | Width of each bar in 3D units |
| `barSpacing` | `number` | `1.2` | Spacing between bars in 3D units |
| `baseHeight` | `number` | `0.1` | Base height for bars (minimum height) |
| `colors` | `string[]` | `default palette` | Array of colors for bars |
| `backgroundColor` | `string` | `'#f0f0f0'` | Background color of the scene |
| `showLabels` | `boolean` | `true` | Whether to show labels on bars |
| `animate` | `boolean` | `true` | Whether to animate bars on mount |

#### Data Structure

```tsx
interface BarData {
  label: string;    // Label for the bar
  value: number;    // Numeric value (height will be proportional)
}
```

#### 3D Controls

The component includes full 3D camera controls:

- **Drag**: Rotate the view around the chart
- **Pinch**: Zoom in and out
- **Pan**: Move the camera position
- **Auto-rotation**: Optional automatic rotation

#### Lighting Setup

The 3D scene includes professional lighting:

- **Ambient Light**: Provides overall illumination
- **Directional Light**: Creates shadows and depth
- **Point Light**: Additional fill lighting
- **Grid Helper**: Reference grid for orientation

#### Performance Considerations

- Uses Three.js for hardware-accelerated 3D rendering
- Optimized mesh creation and material usage
- Efficient state management for interactions
- Responsive design that adapts to screen size

#### Platform Support

- **iOS**: Full support with native OpenGL rendering
- **Android**: Full support with native OpenGL rendering
- **Web**: Full support via WebGL

#### Example

See `BarChart3DExample.tsx` for comprehensive usage examples including:

- Multiple data sets (sales, revenue, users, performance)
- Different color schemes (default, warm, cool, monochrome)
- Interactive controls for labels and animations
- Data summary and statistics
- Usage instructions and tips
- Interactive segment selection
- Loading state simulation
- Data manipulation
- Statistics display
- Different data sets

## Development

### Adding New Components

1. Create the component file in this directory
2. Add TypeScript interfaces for props
3. Include comprehensive documentation
4. Add to the index.ts export file
5. Create example usage if needed

### Styling Guidelines

- Use styled-components for component styling
- Follow the Aether design system colors and spacing
- Ensure components work in both light and dark modes
- Maintain consistent border radius and shadows

### Testing

- Test on both iOS and Android devices
- Verify animations work smoothly
- Check accessibility features
- Test with different screen sizes 