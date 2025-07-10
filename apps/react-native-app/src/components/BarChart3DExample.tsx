import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import BarChart3D from './BarChart3D';

// Sample data sets for demonstration
const sampleDataSets = {
  sales: [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 180 },
    { label: 'Mar', value: 150 },
    { label: 'Apr', value: 220 },
    { label: 'May', value: 280 },
    { label: 'Jun', value: 320 },
  ],
  revenue: [
    { label: 'Q1', value: 45000 },
    { label: 'Q2', value: 52000 },
    { label: 'Q3', value: 48000 },
    { label: 'Q4', value: 61000 },
  ],
  users: [
    { label: 'iOS', value: 1250 },
    { label: 'Android', value: 980 },
    { label: 'Web', value: 750 },
    { label: 'Desktop', value: 420 },
  ],
  performance: [
    { label: 'CPU', value: 85 },
    { label: 'Memory', value: 72 },
    { label: 'Storage', value: 45 },
    { label: 'Network', value: 93 },
    { label: 'GPU', value: 78 },
  ],
};

// Color schemes for different themes
const colorSchemes = {
  default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  warm: ['#FF6B6B', '#FF8E53', '#FFA726', '#FFB74D', '#FFCC02', '#FFD54F', '#FFE082'],
  cool: ['#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39'],
  monochrome: ['#424242', '#616161', '#757575', '#9E9E9E', '#BDBDBD', '#E0E0E0', '#F5F5F5'],
};

/**
 * Example component demonstrating the BarChart3D usage
 * 
 * This component shows how to:
 * - Use different data sets
 * - Customize colors and styling
 * - Handle user interactions
 * - Toggle various features
 */
const BarChart3DExample: React.FC = () => {
  const [currentDataSet, setCurrentDataSet] = useState<keyof typeof sampleDataSets>('sales');
  const [currentColors, setCurrentColors] = useState<keyof typeof colorSchemes>('default');
  const [showLabels, setShowLabels] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [selectedBar, setSelectedBar] = useState<{ label: string; value: number } | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const chartHeight = 400;

  // Handle bar selection
  const handleBarSelect = (data: { label: string; value: number }) => {
    setSelectedBar(data);
    Alert.alert(
      'Bar Selected',
      `${data.label}: ${data.value.toLocaleString()}`,
      [{ text: 'OK' }]
    );
  };

  // Get current data
  const currentData = sampleDataSets[currentDataSet];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>3D Bar Chart Demo</Text>
        <Text style={styles.subtitle}>
          Interactive 3D visualization with react-three-fiber
        </Text>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <BarChart3D
          data={currentData}
          width={screenWidth - 32}
          height={chartHeight}
          colors={colorSchemes[currentColors]}
          showLabels={showLabels}
          animate={animate}
        />
      </View>

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
        {/* Data Set Selector */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Data Set</Text>
          <View style={styles.buttonRow}>
            {Object.keys(sampleDataSets).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.button,
                  currentDataSet === key && styles.activeButton,
                ]}
                onPress={() => setCurrentDataSet(key as keyof typeof sampleDataSets)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    currentDataSet === key && styles.activeButtonText,
                  ]}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Scheme Selector */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Color Scheme</Text>
          <View style={styles.buttonRow}>
            {Object.keys(colorSchemes).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.button,
                  currentColors === key && styles.activeButton,
                ]}
                onPress={() => setCurrentColors(key as keyof typeof colorSchemes)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    currentColors === key && styles.activeButtonText,
                  ]}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggle Controls */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Options</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, showLabels && styles.activeToggle]}
              onPress={() => setShowLabels(!showLabels)}
            >
              <Text style={[styles.toggleText, showLabels && styles.activeToggleText]}>
                Labels {showLabels ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, animate && styles.activeToggle]}
              onPress={() => setAnimate(!animate)}
            >
              <Text style={[styles.toggleText, animate && styles.activeToggleText]}>
                Animation {animate ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Summary */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>Data Summary</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total: {currentData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </Text>
            <Text style={styles.summaryText}>
              Average: {(currentData.reduce((sum, item) => sum + item.value, 0) / currentData.length).toFixed(0)}
            </Text>
            <Text style={styles.summaryText}>
              Max: {Math.max(...currentData.map(item => item.value)).toLocaleString()}
            </Text>
            <Text style={styles.summaryText}>
              Min: {Math.min(...currentData.map(item => item.value)).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.controlSection}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionText}>• Tap any bar to highlight it</Text>
            <Text style={styles.instructionText}>• Drag to rotate the view</Text>
            <Text style={styles.instructionText}>• Pinch to zoom in/out</Text>
            <Text style={styles.instructionText}>• Pan to move the camera</Text>
            <Text style={styles.instructionText}>• Try different data sets and colors</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles for the example component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  chartContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  controlsContainer: {
    padding: 16,
  },
  controlSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#fff',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  instructionsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default BarChart3DExample; 