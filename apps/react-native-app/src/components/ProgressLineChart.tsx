import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Canvas, Path, useClock, Group, Circle } from '@shopify/react-native-skia';
import { useSharedValue, useDerivedValue, withTiming, withSpring, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// MARK: - Types

/// Data point interface for the line chart
interface DataPoint {
  x: number;
  y: number;
  label: string;
  value: number;
  color?: string;
}

/// Props for the ProgressLineChart component
interface ProgressLineChartProps {
  /// Array of data points to display
  data: DataPoint[];

  /// Width of the chart container
  width?: number;

  /// Height of the chart container
  height?: number;

  /// Padding around the chart
  padding?: number;

  /// Color of the line
  lineColor?: string;

  /// Width of the line stroke
  strokeWidth?: number;

  /// Color of data points
  pointColor?: string;

  /// Size of data points
  pointSize?: number;

  /// Whether to show data point labels
  showLabels?: boolean;

  /// Whether to animate the chart on mount
  animate?: boolean;

  /// Duration of the entrance animation in milliseconds
  animationDuration?: number;

  /// Whether to enable haptic feedback
  enableHaptics?: boolean;

  /// Custom style for the container
  style?: any;

  /// Callback when a data point is tapped
  onDataPointPress?: (point: DataPoint, index: number) => void;

  /// Whether to show grid lines
  showGrid?: boolean;

  /// Grid line color
  gridColor?: string;

  /// Whether to show the area under the line
  showArea?: boolean;

  /// Area fill color
  areaColor?: string;

  /// Area fill opacity
  areaOpacity?: number;
}

// MARK: - Constants

const DEFAULT_COLORS = {
  line: '#3B82F6',
  point: '#3B82F6',
  grid: '#E5E7EB',
  area: '#3B82F6',
  text: '#374151'
};

const DEFAULT_SIZES = {
  strokeWidth: 3,
  pointSize: 8,
  padding: 20
};

// MARK: - Utility Functions

/// Calculate the path for the line chart
const createLinePath = (points: DataPoint[], width: number, height: number, padding: number): string => {
  if (points.length < 2) return '';

  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const xRange = maxX - minX;
  const yRange = maxY - minY;

  let path = '';

  points.forEach((point, index) => {
    const x = padding + ((point.x - minX) / xRange) * chartWidth;
    const y = height - padding - ((point.y - minY) / yRange) * chartHeight;

    if (index === 0) {
      path += `M ${x} ${y}`;
    } else {
      path += ` L ${x} ${y}`;
    }
  });

  return path;
};

/// Calculate the area path for filling under the line
const createAreaPath = (points: DataPoint[], width: number, height: number, padding: number): string => {
  if (points.length < 2) return '';

  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const xRange = maxX - minX;
  const yRange = maxY - minY;

  let path = '';

  // Start at the bottom-left
  const firstX = padding + ((points[0].x - minX) / xRange) * chartWidth;
  const firstY = height - padding - ((points[0].y - minY) / yRange) * chartHeight;
  path += `M ${firstX} ${height - padding}`;
  path += ` L ${firstX} ${firstY}`;

  // Draw the line
  points.forEach((point, index) => {
    if (index === 0) return;

    const x = padding + ((point.x - minX) / xRange) * chartWidth;
    const y = height - padding - ((point.y - minY) / yRange) * chartHeight;
    path += ` L ${x} ${y}`;
  });

  // Close the path
  const lastX = padding + ((points[points.length - 1].x - minX) / xRange) * chartWidth;
  path += ` L ${lastX} ${height - padding}`;
  path += ' Z';

  return path;
};

/// Trigger haptic feedback
const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (Platform.OS === 'ios') {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } else if (Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

// MARK: - Main Component

/**
 * Enhanced ProgressLineChart Component
 *
 * A React Native component that renders an animated line chart with:
 * - Smooth entrance animation drawing the line from left to right
 * - Haptic feedback on data point interactions
 * - Interactive data points with annotations
 * - Optional area fill and grid lines
 * - Responsive design with customizable styling
 *
 * @param data - Array of data points with x, y coordinates and metadata
 * @param width - Width of the chart container
 * @param height - Height of the chart container
 * @param padding - Padding around the chart
 * @param lineColor - Color of the line stroke
 * @param strokeWidth - Width of the line stroke
 * @param pointColor - Color of data points
 * @param pointSize - Size of data points
 * @param showLabels - Whether to show data point labels
 * @param animate - Whether to animate the chart on mount
 * @param animationDuration - Duration of entrance animation
 * @param enableHaptics - Whether to enable haptic feedback
 * @param style - Custom container style
 * @param onDataPointPress - Callback for data point taps
 * @param showGrid - Whether to show grid lines
 * @param gridColor - Color of grid lines
 * @param showArea - Whether to show area fill
 * @param areaColor - Color of area fill
 * @param areaOpacity - Opacity of area fill
 */
const ProgressLineChart: React.FC<ProgressLineChartProps> = ({
  data = [],
  width = Dimensions.get('window').width - 40,
  height = 300,
  padding = DEFAULT_SIZES.padding,
  lineColor = DEFAULT_COLORS.line,
  strokeWidth = DEFAULT_SIZES.strokeWidth,
  pointColor = DEFAULT_COLORS.point,
  pointSize = DEFAULT_SIZES.pointSize,
  showLabels = true,
  animate = true,
  animationDuration = 1500,
  enableHaptics = true,
  style,
  onDataPointPress,
  showGrid = true,
  gridColor = DEFAULT_COLORS.grid,
  showArea = false,
  areaColor = DEFAULT_COLORS.area,
  areaOpacity = 0.2
}) => {
  // MARK: - State Management

  /// Currently selected data point
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  /// Animation progress (0 to 1)
  const animationProgress = useSharedValue(animate ? 0 : 1);

  /// Clock for animations
  const clock = useClock();

  /// Reference for the chart container
  const chartRef = useRef<View>(null);

  // MARK: - Animation Setup

  /// Start entrance animation on mount
  useEffect(() => {
    if (animate && data.length > 0) {
      animationProgress.value = withTiming(1, {
        duration: animationDuration
      });
    }
  }, [animate, animationDuration, data.length]);

  // MARK: - Computed Values

  /// Calculate chart dimensions
  const chartDimensions = useDerivedValue(() => {
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    const minX = Math.min(...data.map(p => p.x));
    const maxX = Math.max(...data.map(p => p.x));
    const minY = Math.min(...data.map(p => p.y));
    const maxY = Math.max(...data.map(p => p.y));

    return {
      chartWidth,
      chartHeight,
      minX,
      maxX,
      minY,
      maxY,
      xRange: maxX - minX,
      yRange: maxY - minY
    };
  }, [data, width, height, padding]);

  /// Create animated line path
  const animatedLinePath = useDerivedValue(() => {
    if (data.length < 2) return '';

    const dimensions = chartDimensions.value;
    const progress = animationProgress.value;

    // Calculate how many points to show based on animation progress
    const pointsToShow = Math.ceil(data.length * progress);
    const visiblePoints = data.slice(0, pointsToShow);

    let path = '';

    visiblePoints.forEach((point, index) => {
      const x = padding + ((point.x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
      const y = height - padding - ((point.y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;

      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  }, [animationProgress, chartDimensions, data, width, height, padding]);

  /// Create animated area path
  const animatedAreaPath = useDerivedValue(() => {
    if (!showArea || data.length < 2) return '';

    const dimensions = chartDimensions.value;
    const progress = animationProgress.value;

    const pointsToShow = Math.ceil(data.length * progress);
    const visiblePoints = data.slice(0, pointsToShow);

    if (visiblePoints.length < 2) return '';

    let path = '';

    // Start at the bottom-left
    const firstX = padding + ((visiblePoints[0].x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
    const firstY = height - padding - ((visiblePoints[0].y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;
    path += `M ${firstX} ${height - padding}`;
    path += ` L ${firstX} ${firstY}`;

    // Draw the line
    visiblePoints.forEach((point, index) => {
      if (index === 0) return;

      const x = padding + ((point.x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
      const y = height - padding - ((point.y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;
      path += ` L ${x} ${y}`;
    });

    // Close the path
    const lastX = padding + ((visiblePoints[visiblePoints.length - 1].x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
    path += ` L ${lastX} ${height - padding}`;
    path += ' Z';

    return path;
  }, [animationProgress, chartDimensions, data, width, height, padding, showArea]);

  // MARK: - Event Handlers

  /// Handle data point press
  const handleDataPointPress = (index: number) => {
    if (enableHaptics) {
      triggerHapticFeedback('light');
    }

    setSelectedPoint(selectedPoint === index ? null : index);

    if (onDataPointPress) {
      onDataPointPress(data[index], index);
    }
  };

  /// Handle chart press to deselect points
  const handleChartPress = () => {
    if (selectedPoint !== null) {
      setSelectedPoint(null);
    }
  };

  // MARK: - Render Functions

  /// Render grid lines
  const renderGridLines = () => {
    if (!showGrid || data.length < 2) return null;

    const dimensions = chartDimensions.value;
    const gridLines = [];

    // Vertical grid lines
    const numVerticalLines = 5;
    for (let i = 0; i <= numVerticalLines; i++) {
      const x = padding + (i / numVerticalLines) * dimensions.chartWidth;
      gridLines.push(
        <Path
          key={`v-${i}`}
          path={`M ${x} ${padding} L ${x} ${height - padding}`}
          style="stroke"
          color={gridColor}
          strokeWidth={0.5}
        />
      );
    }

    // Horizontal grid lines
    const numHorizontalLines = 4;
    for (let i = 0; i <= numHorizontalLines; i++) {
      const y = padding + (i / numHorizontalLines) * dimensions.chartHeight;
      gridLines.push(
        <Path
          key={`h-${i}`}
          path={`M ${padding} ${y} L ${width - padding} ${y}`}
          style="stroke"
          color={gridColor}
          strokeWidth={0.5}
        />
      );
    }

    return gridLines;
  };

  /// Render data points
  const renderDataPoints = () => {
    if (data.length === 0) return null;

    const dimensions = chartDimensions.value;
    const progress = animationProgress.value;

    return data.map((point, index) => {
      const x = padding + ((point.x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
      const y = height - padding - ((point.y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;
      const isVisible = index < data.length * progress;
      const isSelected = selectedPoint === index;

      if (!isVisible) return null;

      return (
        <Circle
          key={`point-${index}`}
          cx={x}
          cy={y}
          r={isSelected ? pointSize * 1.5 : pointSize}
          color={point.color || pointColor}
          style="fill"
        />
      );
    });
  };

  /// Render data point labels
  const renderLabels = () => {
    if (!showLabels || data.length === 0) return null;

    const dimensions = chartDimensions.value;
    const progress = animationProgress.value;

    return data.map((point, index) => {
      const x = padding + ((point.x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
      const y = height - padding - ((point.y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;
      const isVisible = index < data.length * progress;
      const isSelected = selectedPoint === index;

      if (!isVisible) return null;

      return (
        <Group key={`label-${index}`}>
          {/* Label background for selected points */}
          {isSelected && (
            <Circle
              cx={x}
              cy={y - 30}
              r={40}
              color="rgba(0, 0, 0, 0.8)"
              style="fill"
            />
          )}

          {/* Label text */}
          <Text
            style={[
              styles.label,
              {
                position: 'absolute',
                left: x - 30,
                top: y - 45,
                color: isSelected ? 'white' : DEFAULT_COLORS.text,
                fontSize: isSelected ? 12 : 10,
                fontWeight: isSelected ? 'bold' : 'normal'
              }
            ]}
          >
            {point.label}
          </Text>

          {/* Value text for selected points */}
          {isSelected && (
            <Text
              style={[
                styles.value,
                {
                  position: 'absolute',
                  left: x - 20,
                  top: y - 30,
                  color: 'white',
                  fontSize: 10
                }
              ]}
            >
              {point.value}
            </Text>
          )}
        </Group>
      );
    });
  };

  // MARK: - Main Render

  return (
    <View style={[styles.container, style]} ref={chartRef}>
      {/* Chart Canvas */}
      <Canvas style={[styles.canvas, { width, height }]} onTouch={handleChartPress}>
        {/* Grid Lines */}
        {renderGridLines()}

        {/* Area Fill */}
        {showArea && (
          <Path
            path={animatedAreaPath}
            style="fill"
            color={areaColor}
            opacity={areaOpacity}
          />
        )}

        {/* Line Path */}
        <Path
          path={animatedLinePath}
          style="stroke"
          color={lineColor}
          strokeWidth={strokeWidth}
          strokeCap="round"
          strokeJoin="round"
        />

        {/* Data Points */}
        {renderDataPoints()}
      </Canvas>

      {/* Interactive Data Points */}
      <View style={[styles.interactiveLayer, { width, height }]}>
        {data.map((point, index) => {
          const dimensions = chartDimensions.value;
          const progress = animationProgress.value;
          const isVisible = index < data.length * progress;

          if (!isVisible) return null;

          const x = padding + ((point.x - dimensions.minX) / dimensions.xRange) * dimensions.chartWidth;
          const y = height - padding - ((point.y - dimensions.minY) / dimensions.yRange) * dimensions.chartHeight;

          return (
            <TouchableOpacity
              key={`touch-${index}`}
              style={[
                styles.touchPoint,
                {
                  left: x - 15,
                  top: y - 15,
                  width: 30,
                  height: 30
                }
              ]}
              onPress={() => handleDataPointPress(index)}
              activeOpacity={0.7}
            />
          );
        })}
      </View>

      {/* Labels Layer */}
      <View style={[styles.labelsLayer, { width, height }]}>
        {renderLabels()}
      </View>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'transparent'
  },
  container: {
    position: 'relative'
  },
  interactiveLayer: {
    backgroundColor: 'transparent',
    left: 0,
    position: 'absolute',
    top: 0
  },
  label: {
    backgroundColor: 'transparent',
    textAlign: 'center'
  },
  labelsLayer: {
    backgroundColor: 'transparent',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0
  },
  touchPoint: {
    backgroundColor: 'transparent',
    position: 'absolute'
  },
  value: {
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});

// MARK: - Type Exports

export type { ProgressLineChartProps, DataPoint };
export default ProgressLineChart;
