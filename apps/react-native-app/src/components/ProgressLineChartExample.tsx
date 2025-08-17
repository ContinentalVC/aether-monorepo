import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import ProgressLineChart, { DataPoint } from './ProgressLineChart';

// MARK: - Sample Data

/// Sample data for demonstration
const sampleData: DataPoint[] = [
  { x: 0, y: 10, label: 'Jan', value: 10 },
  { x: 1, y: 25, label: 'Feb', value: 25 },
  { x: 2, y: 15, label: 'Mar', value: 15 },
  { x: 3, y: 40, label: 'Apr', value: 40 },
  { x: 4, y: 30, label: 'May', value: 30 },
  { x: 5, y: 55, label: 'Jun', value: 55 },
  { x: 6, y: 45, label: 'Jul', value: 45 },
  { x: 7, y: 70, label: 'Aug', value: 70 },
  { x: 8, y: 60, label: 'Sep', value: 60 },
  { x: 9, y: 85, label: 'Oct', value: 85 },
  { x: 10, y: 75, label: 'Nov', value: 75 },
  { x: 11, y: 100, label: 'Dec', value: 100 }
];

/// Alternative dataset with different colors
const coloredData: DataPoint[] = [
  { x: 0, y: 20, label: 'Q1', value: 20, color: '#FF6B6B' },
  { x: 1, y: 35, label: 'Q2', value: 35, color: '#4ECDC4' },
  { x: 2, y: 50, label: 'Q3', value: 50, color: '#45B7D1' },
  { x: 3, y: 65, label: 'Q4', value: 65, color: '#96CEB4' }
];

/// Volatile dataset for testing animations
const volatileData: DataPoint[] = [
  { x: 0, y: 50, label: 'Mon', value: 50 },
  { x: 1, y: 20, label: 'Tue', value: 20 },
  { x: 2, y: 80, label: 'Wed', value: 80 },
  { x: 3, y: 30, label: 'Thu', value: 30 },
  { x: 4, y: 90, label: 'Fri', value: 90 },
  { x: 5, y: 40, label: 'Sat', value: 40 },
  { x: 6, y: 70, label: 'Sun', value: 70 }
];

// MARK: - Main Example Component

/**
 * ProgressLineChart Example Component
 *
 * Demonstrates the enhanced ProgressLineChart with:
 * - Multiple datasets with different characteristics
 * - Animation controls
 * - Haptic feedback settings
 * - Various styling options
 * - Interactive data point selection
 */
const ProgressLineChartExample: React.FC = () => {
  // MARK: - State Management

  /// Currently selected dataset
  const [selectedDataset, setSelectedDataset] = useState<'yearly' | 'quarterly' | 'weekly'>('yearly');

  /// Animation settings
  const [animate, setAnimate] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(1500);

  /// Display settings
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showArea, setShowArea] = useState(false);

  /// Haptic feedback settings
  const [enableHaptics, setEnableHaptics] = useState(true);

  /// Styling options
  const [lineColor, setLineColor] = useState('#3B82F6');
  const [pointSize, setPointSize] = useState(8);
  const [strokeWidth, setStrokeWidth] = useState(3);

  // MARK: - Data Selection

  /// Get current dataset based on selection
  const getCurrentData = (): DataPoint[] => {
    switch (selectedDataset) {
      case 'quarterly':
        return coloredData;
      case 'weekly':
        return volatileData;
      default:
        return sampleData;
    }
  };

  // MARK: - Event Handlers

  /// Handle data point press with haptic feedback
  const handleDataPointPress = (point: DataPoint, index: number) => {
    Alert.alert(
      'Data Point Selected',
      `${point.label}: ${point.value}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'Details', onPress: () => showPointDetails(point, index) }
      ]
    );
  };

  /// Show detailed information about a data point
  const showPointDetails = (point: DataPoint, index: number) => {
    Alert.alert(
      'Point Details',
      `Index: ${index}\nLabel: ${point.label}\nValue: ${point.value}\nCoordinates: (${point.x}, ${point.y})${point.color ? `\nColor: ${point.color}` : ''}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  /// Reset animation
  const resetAnimation = () => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  };

  /// Change line color
  const changeLineColor = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
    const currentIndex = colors.indexOf(lineColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setLineColor(colors[nextIndex]);
  };

  // MARK: - Render Functions

  /// Render dataset selector
  const renderDatasetSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dataset</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedDataset === 'yearly' && styles.buttonActive
          ]}
          onPress={() => setSelectedDataset('yearly')}
        >
          <Text style={[
            styles.buttonText,
            selectedDataset === 'yearly' && styles.buttonTextActive
          ]}>
            Yearly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedDataset === 'quarterly' && styles.buttonActive
          ]}
          onPress={() => setSelectedDataset('quarterly')}
        >
          <Text style={[
            styles.buttonText,
            selectedDataset === 'quarterly' && styles.buttonTextActive
          ]}>
            Quarterly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedDataset === 'weekly' && styles.buttonActive
          ]}
          onPress={() => setSelectedDataset('weekly')}
        >
          <Text style={[
            styles.buttonText,
            selectedDataset === 'weekly' && styles.buttonTextActive
          ]}>
            Weekly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /// Render animation controls
  const renderAnimationControls = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Animation</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Animation</Text>
        <Switch
          value={animate}
          onValueChange={setAnimate}
          trackColor={{ false: '#767577', true: lineColor }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Duration: {animationDuration}ms</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setAnimationDuration(prev => Math.max(500, prev - 200))}
        >
          <Text style={styles.smallButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setAnimationDuration(prev => Math.min(3000, prev + 200))}
        >
          <Text style={styles.smallButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={resetAnimation}>
        <Text style={styles.actionButtonText}>Reset Animation</Text>
      </TouchableOpacity>
    </View>
  );

  /// Render display controls
  const renderDisplayControls = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Display Options</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Show Labels</Text>
        <Switch
          value={showLabels}
          onValueChange={setShowLabels}
          trackColor={{ false: '#767577', true: lineColor }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Show Grid</Text>
        <Switch
          value={showGrid}
          onValueChange={setShowGrid}
          trackColor={{ false: '#767577', true: lineColor }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Show Area</Text>
        <Switch
          value={showArea}
          onValueChange={setShowArea}
          trackColor={{ false: '#767577', true: lineColor }}
        />
      </View>
    </View>
  );

  /// Render haptic feedback controls
  const renderHapticControls = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Haptic Feedback</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Haptics</Text>
        <Switch
          value={enableHaptics}
          onValueChange={setEnableHaptics}
          trackColor={{ false: '#767577', true: lineColor }}
        />
      </View>

      <Text style={styles.hintText}>
        Tap on data points to feel haptic feedback
      </Text>
    </View>
  );

  /// Render styling controls
  const renderStylingControls = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Styling</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Line Color</Text>
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: lineColor }]}
          onPress={changeLineColor}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Point Size: {pointSize}</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setPointSize(prev => Math.max(4, prev - 1))}
        >
          <Text style={styles.smallButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setPointSize(prev => Math.min(16, prev + 1))}
        >
          <Text style={styles.smallButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Stroke Width: {strokeWidth}</Text>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setStrokeWidth(prev => Math.max(1, prev - 1))}
        >
          <Text style={styles.smallButtonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setStrokeWidth(prev => Math.min(8, prev + 1))}
        >
          <Text style={styles.smallButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // MARK: - Main Render

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Progress Line Chart</Text>
        <Text style={styles.subtitle}>
          Enhanced with animations and haptic feedback
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <ProgressLineChart
          data={getCurrentData()}
          width={350}
          height={250}
          lineColor={lineColor}
          strokeWidth={strokeWidth}
          pointSize={pointSize}
          showLabels={showLabels}
          animate={animate}
          animationDuration={animationDuration}
          enableHaptics={enableHaptics}
          showGrid={showGrid}
          showArea={showArea}
          onDataPointPress={handleDataPointPress}
        />
      </View>

      {/* Controls */}
      {renderDatasetSelector()}
      {renderAnimationControls()}
      {renderDisplayControls()}
      {renderHapticControls()}
      {renderStylingControls()}

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to Use:</Text>
        <Text style={styles.instructionText}>
          • Tap on data points to see details and feel haptic feedback
        </Text>
        <Text style={styles.instructionText}>
          • Use the controls above to customize the chart
        </Text>
        <Text style={styles.instructionText}>
          • Watch the smooth entrance animation when data changes
        </Text>
        <Text style={styles.instructionText}>
          • Try different datasets to see various patterns
        </Text>
      </View>
    </ScrollView>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  buttonActive: {
    backgroundColor: '#3B82F6'
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8
  },
  buttonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500'
  },
  buttonTextActive: {
    color: 'white'
  },
  chartContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  colorButton: {
    borderColor: '#E5E7EB',
    borderRadius: 16,
    borderWidth: 2,
    height: 32,
    width: 32
  },
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1
  },
  header: {
    alignItems: 'center',
    padding: 20
  },
  hintText: {
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8
  },
  instructionText: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    margin: 20,
    marginTop: 0,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  instructionsTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 4,
    margin: 20,
    marginTop: 0,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  settingLabel: {
    color: '#374151',
    flex: 1,
    fontSize: 16
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  smallButton: {
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    marginLeft: 8,
    width: 32
  },
  smallButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    textAlign: 'center'
  },
  title: {
    color: '#1E293B',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  }
});

// MARK: - Exports

export default ProgressLineChartExample;
