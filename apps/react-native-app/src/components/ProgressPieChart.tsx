//
//  ProgressPieChart.tsx
//  Aether React Native App
//
//  Enhanced React Native component that displays the distribution of mastered skills
//  using react-native-gifted-charts with data-driven animations, LayoutAnimation API,
//  haptic feedback for interactive features, comprehensive accessibility support,
//  AsyncStorage persistence, and PNG export functionality.
//  Features full VoiceOver and TalkBack integration with proper accessibility labels
//  for each pie slice and interactive elements.
//

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  AccessibilityInfo,
  Alert,
  Share
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ViewShot from 'react-native-view-shot';
import {
  saveChartData,
  loadChartData,
  PieChartData as StoragePieChartData,
  exportChartDataAsJSON
} from '../utils/chartStorage';

const { height } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// MARK: - Types

/// Data structure for pie chart segments
export interface PieChartData {
  value: number;
  color: string;
  text: string;
}

/// Props interface for the enhanced ProgressPieChart component
interface ProgressPieChartProps {
  /** Array of data points for the pie chart */
  data: PieChartData[];
  /** Whether the component is in a loading state */
  isLoading?: boolean;
  /** Title displayed above the chart */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Size of the chart (default: 200) */
  size?: number;
  /** Inner radius for donut chart (default: 60) */
  innerRadius?: number;
  /** Whether to show labels on chart segments */
  showLabels?: boolean;
  /** Callback when a segment is pressed */
  onSegmentPress?: (segment: PieChartData, index: number) => void;
  /** Additional styles for the container */
  style?: any;
  /** Whether to enable data-driven animations */
  enableAnimations?: boolean;
  /** Duration of data change animations in milliseconds */
  animationDuration?: number;
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean;
  /** Type of haptic feedback to trigger */
  hapticType?: 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy';
  /** Accessibility label for the chart container */
  accessibilityLabel?: string;
  /** Accessibility hint for the chart container */
  accessibilityHint?: string;
  /** Whether to enable AsyncStorage persistence */
  enablePersistence?: boolean;
  /** Whether to show export buttons */
  showExportButtons?: boolean;
  /** Callback when data is saved to storage */
  onDataSaved?: (success: boolean, error?: string) => void;
  /** Callback when data is loaded from storage */
  onDataLoaded?: (data: PieChartData[], success: boolean, error?: string) => void;
}

// MARK: - Haptic Feedback Configuration

/// Haptic feedback options for React Native Haptic Feedback
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

/// Trigger haptic feedback based on type
const triggerHapticFeedback = (type: string) => {
  try {
    switch (type) {
      case 'selection':
        ReactNativeHapticFeedback.trigger('selection', hapticOptions);
        break;
      case 'impactLight':
        ReactNativeHapticFeedback.trigger('impactLight', hapticOptions);
        break;
      case 'impactMedium':
        ReactNativeHapticFeedback.trigger('impactMedium', hapticOptions);
        break;
      case 'impactHeavy':
        ReactNativeHapticFeedback.trigger('impactHeavy', hapticOptions);
        break;
      default:
        ReactNativeHapticFeedback.trigger('selection', hapticOptions);
    }
  } catch (error) {
    console.warn('Haptic feedback not available:', error);
  }
};

// MARK: - Animation Configuration

/// LayoutAnimation configuration for smooth data transitions
const createLayoutAnimation = (duration: number = 300) => {
  return LayoutAnimation.create(
    duration,
    LayoutAnimation.Types.easeInEaseOut,
    LayoutAnimation.Properties.opacity
  );
};

// MARK: - Accessibility Utilities

/// Generate accessibility label for a pie chart segment
const generateSegmentAccessibilityLabel = (segment: PieChartData, percentage: number, index: number, totalSegments: number) => {
  return `${segment.text}, ${percentage}% of total. Segment ${index + 1} of ${totalSegments}. Double tap to select.`;
};

/// Generate accessibility label for the center label component
const generateCenterLabelAccessibilityLabel = (totalPercentage: number, totalSegments: number) => {
  return `Center label showing ${totalPercentage}% mastered skills from ${totalSegments} total segments.`;
};

/// Generate accessibility label for legend items
const generateLegendAccessibilityLabel = (segment: PieChartData, percentage: number, isFocused: boolean) => {
  const focusState = isFocused ? 'Selected' : 'Not selected';
  return `${segment.text}, ${percentage}%. ${focusState}. Double tap to select this segment.`;
};

/**
 * Enhanced ProgressPieChart - A React Native component that displays mastered skills distribution
 * using a donut chart with data-driven animations, LayoutAnimation API, haptic feedback,
 * comprehensive accessibility support, AsyncStorage persistence, and PNG export functionality.
 *
 * This component creates an interactive pie chart that:
 * - Displays skill mastery distribution as a donut chart
 * - Shows total percentage in the center
 * - Animates smoothly when data changes using LayoutAnimation API
 * - Provides haptic feedback on segment interactions
 * - Handles loading states with activity indicator
 * - Provides interactive segment selection
 * - Supports custom styling and callbacks
 * - Features comprehensive accessibility support for VoiceOver and TalkBack
 * - Persists data using AsyncStorage
 * - Exports chart as PNG image
 *
 * Accessibility Features:
 * - Each pie slice is individually accessible with clear labels
 * - Center label component announces total percentage and segment count
 * - Legend items provide detailed accessibility information
 * - Interactive elements include proper accessibility hints
 * - Focus states are announced to screen readers
 *
 * Usage:
 * ```tsx
 * <ProgressPieChart
 *   data={skillsData}
 *   isLoading={false}
 *   title="Skills Mastery"
 *   enableAnimations={true}
 *   enableHaptics={true}
 *   enablePersistence={true}
 *   showExportButtons={true}
 *   accessibilityLabel="Skills mastery distribution chart"
 *   accessibilityHint="Interactive pie chart showing skill mastery percentages"
 *   onSegmentPress={(segment, index) => console.log(segment.text)}
 * />
 * ```
 */
const ProgressPieChart: React.FC<ProgressPieChartProps> = ({
  data,
  isLoading = false,
  title = 'Skills Mastery',
  subtitle = 'Distribution of mastered skills',
  size = 200,
  innerRadius = 60,
  showLabels = true,
  onSegmentPress,
  style,
  enableAnimations = true,
  animationDuration = 300,
  enableHaptics = true,
  hapticType = 'selection',
  accessibilityLabel = 'Skills mastery distribution chart',
  accessibilityHint = 'Interactive pie chart showing skill mastery percentages. Double tap on segments to select them.',
  enablePersistence = false,
  showExportButtons = false,
  onDataSaved,
  onDataLoaded
}) => {
  // MARK: - State Management

  /// Currently focused segment index
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  /// Animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);

  /// Previous data for comparison
  const previousDataRef = useRef<PieChartData[]>([]);

  /// Chart container reference for animations
  const chartContainerRef = useRef<View>(null);

  /// ViewShot reference for PNG export
  const viewShotRef = useRef<ViewShot>(null);

  /// Storage state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // MARK: - Data Processing

  /// Calculate total value for percentage calculation
  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  /// Calculate total percentage of mastered skills
  const totalPercentage = useMemo(() => {
    if (totalValue === 0) return 0;
    return Math.round((totalValue / 100) * 100);
  }, [totalValue]);

  /// Check if data has changed significantly
  const hasDataChanged = useMemo(() => {
    if (previousDataRef.current.length !== data.length) return true;

    return data.some((item, index) => {
      const prevItem = previousDataRef.current[index];
      return !prevItem || prevItem.value !== item.value || prevItem.text !== item.text;
    });
  }, [data]);

  // MARK: - Animation Effects

  /// Handle data changes with animations
  useEffect(() => {
    if (enableAnimations && hasDataChanged && !isLoading) {
      setIsAnimating(true);

      // Configure LayoutAnimation for smooth transitions
      LayoutAnimation.configureNext(createLayoutAnimation(animationDuration));

      // Update previous data reference
      previousDataRef.current = [...data];

      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration);

      return () => clearTimeout(timer);
    } else {
      previousDataRef.current = [...data];
    }
  }, [data, enableAnimations, hasDataChanged, isLoading, animationDuration]);

  // MARK: - Storage Effects

  /// Load data from AsyncStorage on mount if persistence is enabled
  useEffect(() => {
    if (enablePersistence && data.length === 0) {
      loadDataFromStorage();
    }
  }, [enablePersistence]);

  // MARK: - Storage Functions

  /// Load data from AsyncStorage
  const loadDataFromStorage = async () => {
    if (!enablePersistence) return;

    setIsLoadingFromStorage(true);
    try {
      const savedData = await loadChartData();
      if (savedData.length > 0) {
        // Convert storage format to component format
        const convertedData: PieChartData[] = savedData.map(item => ({
          value: item.value,
          color: item.color,
          text: item.label
        }));

        // Note: In a real implementation, you would update the data source
        // This is a simplified example - you might want to use a callback or state management
        console.log(`Loaded ${convertedData.length} data points from storage`);
        onDataLoaded?.(convertedData, true);
      } else {
        onDataLoaded?.([], true);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error loading data from storage:', errorMessage);
      onDataLoaded?.([], false, errorMessage);
    } finally {
      setIsLoadingFromStorage(false);
    }
  };

  /// Save data to AsyncStorage
  const saveDataToStorage = async () => {
    if (!enablePersistence || data.length === 0) return;

    setIsSaving(true);
    try {
      // Convert component format to storage format
      const storageData: StoragePieChartData[] = data.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        label: item.text,
        value: item.value,
        color: item.color
      }));

      await saveChartData(storageData, title);
      console.log(`Saved ${storageData.length} data points to storage`);
      onDataSaved?.(true);

      // Trigger haptic feedback for successful save
      if (enableHaptics) {
        triggerHapticFeedback('impactLight');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving data to storage:', errorMessage);
      onDataSaved?.(false, errorMessage);

      Alert.alert('Save Error', `Failed to save chart data: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // MARK: - Export Functions

  /// Export chart as PNG image
  const exportAsPNG = async () => {
    if (!viewShotRef.current?.capture) return;

    setIsExporting(true);
    try {
      const uri = await viewShotRef.current.capture();

      // Share the image
      await Share.share({
        url: uri,
        title: `${title} Chart`,
        message: `Exported ${title} chart as PNG image`
      });

      // Trigger haptic feedback for successful export
      if (enableHaptics) {
        triggerHapticFeedback('impactMedium');
      }

      console.log('Chart exported as PNG successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error exporting chart as PNG:', errorMessage);
      Alert.alert('Export Error', `Failed to export chart: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  /// Export chart data as JSON
  const exportAsJSON = async () => {
    try {
      // Convert component format to storage format
      const storageData: StoragePieChartData[] = data.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        label: item.text,
        value: item.value,
        color: item.color
      }));

      const jsonData = exportChartDataAsJSON(storageData);

      // Share the JSON data
      await Share.share({
        title: `${title} Data`,
        message: jsonData
      });

      // Trigger haptic feedback for successful export
      if (enableHaptics) {
        triggerHapticFeedback('impactLight');
      }

      console.log('Chart data exported as JSON successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error exporting chart data as JSON:', errorMessage);
      Alert.alert('Export Error', `Failed to export chart data: ${errorMessage}`);
    }
  };

  // MARK: - Event Handlers

  /// Handle segment press with haptic feedback and focus animation
  const handleSegmentPress = (item: any, index: number) => {
    // Trigger haptic feedback
    if (enableHaptics) {
      triggerHapticFeedback(hapticType);
    }

    // Toggle focus with animation
    const newFocusedIndex = focusedIndex === index ? null : index;
    setFocusedIndex(newFocusedIndex);

    // Announce selection to screen readers
    const segment = data[index];
    const percentage = Math.round((segment.value / totalValue) * 100);
    const announcement = newFocusedIndex === index
      ? `Selected ${segment.text}, ${percentage}%`
      : `Deselected ${segment.text}`;

    AccessibilityInfo.announceForAccessibility(announcement);

    // Call the callback
    onSegmentPress?.(data[index], index);
  };

  /// Handle legend item press with haptic feedback
  const handleLegendPress = (item: PieChartData, index: number) => {
    // Trigger haptic feedback
    if (enableHaptics) {
      triggerHapticFeedback(hapticType);
    }

    // Toggle focus with animation
    const newFocusedIndex = focusedIndex === index ? null : index;
    setFocusedIndex(newFocusedIndex);

    // Announce selection to screen readers
    const percentage = Math.round((item.value / totalValue) * 100);
    const announcement = newFocusedIndex === index
      ? `Selected ${item.text}, ${percentage}%`
      : `Deselected ${item.text}`;

    AccessibilityInfo.announceForAccessibility(announcement);

    // Call the callback
    onSegmentPress?.(item, index);
  };

  // MARK: - Render Components

  /// Center label component showing total percentage with animation and accessibility
  const CenterLabelComponent = () => {
    const centerLabelAccessibilityLabel = generateCenterLabelAccessibilityLabel(totalPercentage, data.length);

    return (
      <View
        style={[
          styles.centerLabelContainer,
          isAnimating && styles.centerLabelAnimating
        ]}
        accessible={true}
        accessibilityLabel={centerLabelAccessibilityLabel}
        accessibilityRole="text"
        accessibilityHint="Shows the total percentage of mastered skills"
      >
        <Text style={[
          styles.percentageText,
          isAnimating && styles.percentageTextAnimating
        ]}>
          {totalPercentage}%
        </Text>
        <Text style={[
          styles.centerLabelText,
          isAnimating && styles.centerLabelTextAnimating
        ]}>
          Mastered
        </Text>
      </View>
    );
  };

  /// Loading component with animation and accessibility
  const LoadingComponent = () => (
    <View
      style={[
        styles.chartContainer,
        { width: size, height: size },
        isAnimating && styles.chartContainerAnimating
      ]}
      accessible={true}
      accessibilityLabel="Loading skills data"
      accessibilityRole="progressbar"
      accessibilityHint="Chart is currently loading data"
    >
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>Loading skills data...</Text>
    </View>
  );

  /// Empty state component with animation and accessibility
  const EmptyStateComponent = () => (
    <View
      style={[
        styles.chartContainer,
        { width: size, height: size },
        isAnimating && styles.chartContainerAnimating
      ]}
      accessible={true}
      accessibilityLabel="No skills data available"
      accessibilityRole="text"
      accessibilityHint="There is no data to display in the chart"
    >
      <Text style={styles.emptyStateText}>No skills data available</Text>
    </View>
  );

  /// Export buttons component
  const ExportButtonsComponent = () => {
    if (!showExportButtons || data.length === 0) return null;

    return (
      <View
        style={styles.exportButtonsContainer}
        accessible={true}
        accessibilityLabel="Export options"
        accessibilityRole="toolbar"
        accessibilityHint="Buttons to export chart as image or data"
      >
        {enablePersistence && (
          <TouchableOpacity
            style={[
              styles.exportButton,
              styles.saveButton,
              isSaving && styles.exportButtonDisabled
            ]}
            onPress={saveDataToStorage}
            disabled={isSaving}
            accessible={true}
            accessibilityLabel="Save chart data"
            accessibilityHint="Save current chart data to device storage"
            accessibilityRole="button"
          >
            <Text style={styles.exportButtonText}>
              {isSaving ? 'Saving...' : 'Save Data'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.exportButton,
            styles.pngButton,
            isExporting && styles.exportButtonDisabled
          ]}
          onPress={exportAsPNG}
          disabled={isExporting}
          accessible={true}
          accessibilityLabel="Export as PNG"
          accessibilityHint="Export chart as PNG image and share"
          accessibilityRole="button"
        >
          <Text style={styles.exportButtonText}>
            {isExporting ? 'Exporting...' : 'Export PNG'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.exportButton,
            styles.jsonButton
          ]}
          onPress={exportAsJSON}
          accessible={true}
          accessibilityLabel="Export as JSON"
          accessibilityHint="Export chart data as JSON and share"
          accessibilityRole="button"
        >
          <Text style={styles.exportButtonText}>Export JSON</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /// Render the main chart component with animations and accessibility
  const renderChart = () => {
    if (isLoading || isLoadingFromStorage) {
      return <LoadingComponent />;
    }

    if (!data || data.length === 0) {
      return <EmptyStateComponent />;
    }

    // Prepare data with accessibility labels for each segment
    const chartDataWithAccessibility = data.map((item, index) => {
      const percentage = Math.round((item.value / totalValue) * 100);
      const segmentAccessibilityLabel = generateSegmentAccessibilityLabel(item, percentage, index, data.length);

      return {
        ...item,
        accessibilityLabel: segmentAccessibilityLabel,
        accessibilityRole: 'button',
        accessibilityHint: 'Double tap to select this segment',
        accessibilityState: {
          selected: focusedIndex === index
        }
      };
    });

    return (
      <ViewShot
        ref={viewShotRef}
        options={{
          format: 'png',
          quality: 0.9,
          result: 'data-uri'
        }}
        style={[
          styles.chartContainer,
          { width: size, height: size },
          isAnimating && styles.chartContainerAnimating
        ]}
      >
        <View
          ref={chartContainerRef}
          accessible={true}
          accessibilityLabel={`${accessibilityLabel}. ${data.length} segments. ${totalPercentage}% total mastered.`}
          accessibilityRole="radiogroup"
          accessibilityHint={accessibilityHint}
        >
          <PieChart
            data={chartDataWithAccessibility}
            donut
            innerRadius={innerRadius}
            centerLabelComponent={CenterLabelComponent}
            radius={size / 2 - 20}
            strokeWidth={2}
            strokeColor="white"
            showText={showLabels}
            textColor="white"
            textSize={12}
            fontWeight="bold"
            onPress={handleSegmentPress}
            focusOnPress={true}
            extraRadius={focusedIndex !== null ? 10 : 0}
            initialAngle={0}
            endAngle={360}
            showTextBackground={true}
            textBackgroundColor="rgba(0,0,0,0.7)"
            textBackgroundRadius={4}
          />
        </View>
      </ViewShot>
    );
  };

  /// Render legend for chart segments with animations and accessibility
  const renderLegend = () => {
    if (!data || data.length === 0) return null;

    return (
      <View
        style={[
          styles.legendContainer,
          isAnimating && styles.legendContainerAnimating
        ]}
        accessible={true}
        accessibilityLabel="Chart legend"
        accessibilityRole="list"
        accessibilityHint="List of chart segments with their values"
      >
        {data.map((item, index) => {
          const percentage = Math.round((item.value / totalValue) * 100);
          const legendAccessibilityLabel = generateLegendAccessibilityLabel(item, percentage, focusedIndex === index);

          return (
            <TouchableOpacity
              key={`${item.text}-${index}-${item.value}`}
              style={[
                styles.legendItem,
                focusedIndex === index && styles.legendItemFocused,
                isAnimating && styles.legendItemAnimating
              ]}
              onPress={() => handleLegendPress(item, index)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={legendAccessibilityLabel}
              accessibilityRole="button"
              accessibilityHint="Double tap to select this segment"
              accessibilityState={{
                selected: focusedIndex === index
              }}
            >
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: item.color },
                  focusedIndex === index && styles.legendColorFocused,
                  isAnimating && styles.legendColorAnimating
                ]}
                accessible={false}
              />
              <View
                style={styles.legendTextContainer}
                accessible={false}
              >
                <Text style={[
                  styles.legendText,
                  isAnimating && styles.legendTextAnimating
                ]}>
                  {item.text}
                </Text>
                <Text style={[
                  styles.legendValue,
                  isAnimating && styles.legendValueAnimating
                ]}>
                  {percentage}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // MARK: - Main Render

  return (
    <View
      style={[
        styles.container,
        style,
        isAnimating && styles.containerAnimating
      ]}
      accessible={true}
      accessibilityLabel={`${title}. ${subtitle}. ${accessibilityLabel}`}
      accessibilityRole="none"
      accessibilityHint={accessibilityHint}
    >
      {/* Header with animation and accessibility */}
      <View
        style={[
          styles.header,
          isAnimating && styles.headerAnimating
        ]}
        accessible={true}
        accessibilityLabel={`${title}. ${subtitle}`}
        accessibilityRole="header"
      >
        <Text style={[
          styles.title,
          isAnimating && styles.titleAnimating
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.subtitle,
          isAnimating && styles.subtitleAnimating
        ]}>
          {subtitle}
        </Text>
      </View>

      {/* Chart with animations and accessibility */}
      {renderChart()}

      {/* Legend with animations and accessibility */}
      {renderLegend()}

      {/* Export buttons */}
      <ExportButtonsComponent />

      {/* Summary with animation and accessibility */}
      {!isLoading && data && data.length > 0 && (
        <View
          style={[
            styles.summaryContainer,
            isAnimating && styles.summaryContainerAnimating
          ]}
          accessible={true}
          accessibilityLabel={`Summary: ${data.length} total skills, ${totalPercentage}% mastered`}
          accessibilityRole="text"
        >
          <Text style={[
            styles.summaryText,
            isAnimating && styles.summaryTextAnimating
          ]}>
            Total Skills: {data.length} • Mastered: {totalPercentage}%
          </Text>
        </View>
      )}
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  centerLabelAnimating: {
    transform: [{ scale: 1.1 }]
  },
  centerLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerLabelText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '500'
  },
  centerLabelTextAnimating: {
    opacity: 0.9
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  chartContainerAnimating: {
    transform: [{ scale: 1.05 }]
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20
  },
  containerAnimating: {
    opacity: 0.95
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 16,
    textAlign: 'center'
  },
  exportButton: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  exportButtonDisabled: {
    opacity: 0.6
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  headerAnimating: {
    transform: [{ scale: 0.98 }]
  },
  jsonButton: {
    backgroundColor: '#8b5cf6'
  },
  legendColor: {
    borderRadius: 8,
    height: 16,
    marginRight: 12,
    width: 16
  },
  legendColorAnimating: {
    transform: [{ scale: 1.1 }]
  },
  legendColorFocused: {
    transform: [{ scale: 1.2 }]
  },
  legendContainer: {
    marginBottom: 16,
    maxWidth: 300,
    width: '100%'
  },
  legendContainerAnimating: {
    transform: [{ translateY: 5 }]
  },
  legendItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  legendItemAnimating: {
    transform: [{ scale: 0.98 }]
  },
  legendItemFocused: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366f1',
    borderWidth: 1
  },
  legendText: {
    color: '#1f2937',
    flex: 1,
    fontSize: 14,
    fontWeight: '500'
  },
  legendTextAnimating: {
    transform: [{ translateX: 2 }]
  },
  legendTextContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  legendValue: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold'
  },
  legendValueAnimating: {
    transform: [{ scale: 1.05 }]
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center'
  },
  percentageText: {
    color: '#1f2937',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2
  },
  percentageTextAnimating: {
    transform: [{ scale: 1.15 }]
  },
  pngButton: {
    backgroundColor: '#3b82f6'
  },
  saveButton: {
    backgroundColor: '#10b981'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center'
  },
  subtitleAnimating: {
    opacity: 0.8
  },
  summaryContainer: {
    alignItems: 'center',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    paddingTop: 16,
    width: '100%'
  },
  summaryContainerAnimating: {
    transform: [{ translateY: 3 }]
  },
  summaryText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500'
  },
  summaryTextAnimating: {
    opacity: 0.8
  },
  title: {
    color: '#1f2937',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  titleAnimating: {
    transform: [{ scale: 1.02 }]
  }
});

export default ProgressPieChart;
