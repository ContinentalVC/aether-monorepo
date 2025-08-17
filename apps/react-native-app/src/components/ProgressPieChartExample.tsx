//
//  ProgressPieChartExample.tsx
//  Aether React Native App
//
//  Enhanced example component demonstrating ProgressPieChart with AsyncStorage persistence
//  and PNG export functionality. Shows data management, storage operations, export features,
//  and comprehensive user interface for managing chart data.
//

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import styled from 'styled-components/native';
import ProgressPieChart, { PieChartData } from './ProgressPieChart';
import {
  loadChartData,
  clearAllChartData,
  getChartStatistics,
  PieChartData as StoragePieChartData
} from '../utils/chartStorage';
import { formatDateEnhanced, DATE_FORMATS } from '@aether/react-native-utils';

const { width } = Dimensions.get('window');

// MARK: - Styled Components

const Container = styled.ScrollView`
  flex: 1;
  background-color: #f8fafc;
`;

const Section = styled.View`
  margin: 16px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding-horizontal: 16px;
  padding-vertical: 10px;
  border-radius: 8px;
  min-width: 120px;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#3b82f6';
      case 'secondary': return '#6b7280';
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return '#3b82f6';
    }
  }};
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const StatCard = styled.View`
  flex: 1;
  min-width: 120px;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 4px;
`;

const StatusText = styled.Text<{ type: 'success' | 'error' | 'info' }>`
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#6b7280';
      default: return '#6b7280';
    }
  }};
`;

// MARK: - Sample Data

const sampleDataSets = {
  'Skills Mastery': [
    { value: 30, color: '#3b82f6', text: 'JavaScript' },
    { value: 25, color: '#10b981', text: 'React Native' },
    { value: 20, color: '#f59e0b', text: 'TypeScript' },
    { value: 15, color: '#ef4444', text: 'Node.js' },
    { value: 10, color: '#8b5cf6', text: 'GraphQL' }
  ],
  'Project Distribution': [
    { value: 40, color: '#3b82f6', text: 'Mobile Apps' },
    { value: 30, color: '#10b981', text: 'Web Apps' },
    { value: 20, color: '#f59e0b', text: 'APIs' },
    { value: 10, color: '#ef4444', text: 'Tools' }
  ],
  'Time Allocation': [
    { value: 35, color: '#3b82f6', text: 'Development' },
    { value: 25, color: '#10b981', text: 'Testing' },
    { value: 20, color: '#f59e0b', text: 'Planning' },
    { value: 15, color: '#ef4444', text: 'Documentation' },
    { value: 5, color: '#8b5cf6', text: 'Meetings' }
  ]
};

// MARK: - Enhanced ProgressPieChartExample Component

/**
 * Enhanced ProgressPieChartExample - Demonstrates the ProgressPieChart component
 * with AsyncStorage persistence and PNG export functionality.
 *
 * Features:
 * - Multiple sample datasets
 * - AsyncStorage data persistence
 * - PNG and JSON export functionality
 * - Data management operations
 * - Statistics display
 * - Comprehensive user interface
 *
 * Usage:
 * ```tsx
 * <ProgressPieChartExample />
 * ```
 */
const ProgressPieChartExample: React.FC = () => {
  // MARK: - State Management

  const [currentData, setCurrentData] = useState<PieChartData[]>(sampleDataSets['Skills Mastery']);
  const [selectedDataset, setSelectedDataset] = useState<string>('Skills Mastery');
  const [enablePersistence, setEnablePersistence] = useState<boolean>(true);
  const [showExportButtons, setShowExportButtons] = useState<boolean>(true);
  const [enableAnimations, setEnableAnimations] = useState<boolean>(true);
  const [enableHaptics, setEnableHaptics] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [statistics, setStatistics] = useState<{
    totalCharts: number;
    totalDataPoints: number;
    averageDataPoints: number;
    lastUpdated: string | null;
  }>({
    totalCharts: 0,
    totalDataPoints: 0,
    averageDataPoints: 0,
    lastUpdated: null
  });

  // MARK: - Effects

  useEffect(() => {
    loadStatistics();
  }, []);

  // MARK: - Data Management Functions

  const loadStatistics = async () => {
    try {
      const stats = await getChartStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleDatasetChange = (datasetName: string) => {
    setSelectedDataset(datasetName);
    setCurrentData(sampleDataSets[datasetName as keyof typeof sampleDataSets]);
    setStatusMessage(`Switched to ${datasetName} dataset`);
    setStatusType('info');
  };

  const handleDataSaved = (success: boolean, error?: string) => {
    if (success) {
      setStatusMessage('Chart data saved successfully!');
      setStatusType('success');
      loadStatistics(); // Refresh statistics
    } else {
      setStatusMessage(`Failed to save data: ${error}`);
      setStatusType('error');
    }
  };

  const handleDataLoaded = (data: PieChartData[], success: boolean, error?: string) => {
    if (success && data.length > 0) {
      setCurrentData(data);
      setStatusMessage(`Loaded ${data.length} data points from storage`);
      setStatusType('success');
    } else if (success) {
      setStatusMessage('No saved data found');
      setStatusType('info');
    } else {
      setStatusMessage(`Failed to load data: ${error}`);
      setStatusType('error');
    }
  };

  const handleSegmentPress = (segment: PieChartData, index: number) => {
    console.log(`Pressed segment: ${segment.text} (${segment.value})`);
    setStatusMessage(`Selected: ${segment.text} (${segment.value})`);
    setStatusType('info');
  };

  const loadDataFromStorage = async () => {
    setIsLoading(true);
    try {
      const savedData = await loadChartData();
      if (savedData.length > 0) {
        // Convert storage format to component format
        const convertedData: PieChartData[] = savedData.map(item => ({
          value: item.value,
          color: item.color,
          text: item.label
        }));
        setCurrentData(convertedData);
        setStatusMessage(`Loaded ${convertedData.length} data points from storage`);
        setStatusType('success');
      } else {
        setStatusMessage('No saved data found');
        setStatusType('info');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Failed to load data: ${errorMessage}`);
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorageData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all saved chart data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await clearAllChartData();
              setStatusMessage('All saved data cleared successfully');
              setStatusType('success');
              loadStatistics(); // Refresh statistics
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              setStatusMessage(`Failed to clear data: ${errorMessage}`);
              setStatusType('error');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const resetToSampleData = () => {
    setCurrentData(sampleDataSets['Skills Mastery']);
    setSelectedDataset('Skills Mastery');
    setStatusMessage('Reset to sample data');
    setStatusType('info');
  };

  // MARK: - Render Functions

  const renderDatasetSelector = () => (
    <Section>
      <SectionTitle>Dataset Selection</SectionTitle>
      <Text style={styles.sectionDescription}>
        Choose from different sample datasets to see how the chart adapts to different data.
      </Text>
      <ButtonContainer>
        {Object.keys(sampleDataSets).map((datasetName) => (
          <ActionButton
            key={datasetName}
            variant={selectedDataset === datasetName ? 'primary' : 'secondary'}
            onPress={() => handleDatasetChange(datasetName)}
          >
            <ButtonText>{datasetName}</ButtonText>
          </ActionButton>
        ))}
      </ButtonContainer>
    </Section>
  );

  const renderChartControls = () => (
    <Section>
      <SectionTitle>Chart Controls</SectionTitle>
      <Text style={styles.sectionDescription}>
        Customize the chart behavior and appearance.
      </Text>
      <ButtonContainer>
        <ActionButton
          variant={enablePersistence ? 'success' : 'secondary'}
          onPress={() => setEnablePersistence(!enablePersistence)}
        >
          <ButtonText>
            {enablePersistence ? 'Persistence: ON' : 'Persistence: OFF'}
          </ButtonText>
        </ActionButton>

        <ActionButton
          variant={showExportButtons ? 'success' : 'secondary'}
          onPress={() => setShowExportButtons(!showExportButtons)}
        >
          <ButtonText>
            {showExportButtons ? 'Export: ON' : 'Export: OFF'}
          </ButtonText>
        </ActionButton>

        <ActionButton
          variant={enableAnimations ? 'success' : 'secondary'}
          onPress={() => setEnableAnimations(!enableAnimations)}
        >
          <ButtonText>
            {enableAnimations ? 'Animations: ON' : 'Animations: OFF'}
          </ButtonText>
        </ActionButton>

        <ActionButton
          variant={enableHaptics ? 'success' : 'secondary'}
          onPress={() => setEnableHaptics(!enableHaptics)}
        >
          <ButtonText>
            {enableHaptics ? 'Haptics: ON' : 'Haptics: OFF'}
          </ButtonText>
        </ActionButton>
      </ButtonContainer>
    </Section>
  );

  const renderDataManagement = () => (
    <Section>
      <SectionTitle>Data Management</SectionTitle>
      <Text style={styles.sectionDescription}>
        Manage chart data persistence and storage operations.
      </Text>
      <ButtonContainer>
        <ActionButton
          variant="primary"
          onPress={loadDataFromStorage}
        >
          <ButtonText>Load from Storage</ButtonText>
        </ActionButton>

        <ActionButton
          variant="success"
          onPress={resetToSampleData}
        >
          <ButtonText>Reset to Sample</ButtonText>
        </ActionButton>

        <ActionButton
          variant="danger"
          onPress={clearStorageData}
        >
          <ButtonText>Clear All Data</ButtonText>
        </ActionButton>
      </ButtonContainer>
    </Section>
  );

  const renderStatistics = () => (
    <Section>
      <SectionTitle>Storage Statistics</SectionTitle>
      <Text style={styles.sectionDescription}>
        Overview of saved chart data and storage usage.
      </Text>
      <StatsContainer>
        <StatCard>
          <StatValue>{statistics.totalCharts}</StatValue>
          <StatLabel>Total Charts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{statistics.totalDataPoints}</StatValue>
          <StatLabel>Data Points</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{statistics.averageDataPoints.toFixed(1)}</StatValue>
          <StatLabel>Avg Points</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {statistics.lastUpdated
              ? formatDateEnhanced(new Date(statistics.lastUpdated), { format: DATE_FORMATS.US_SHORT })
              : 'Never'
            }
          </StatValue>
          <StatLabel>Last Updated</StatLabel>
        </StatCard>
      </StatsContainer>
    </Section>
  );

  const renderStatus = () => {
    if (!statusMessage) return null;

    return (
      <Section>
        <SectionTitle>Status</SectionTitle>
        <StatusText type={statusType}>{statusMessage}</StatusText>
      </Section>
    );
  };

  // MARK: - Main Render

  return (
    <Container>
      {/* Header */}
      <Section>
        <SectionTitle>Progress Pie Chart Demo</SectionTitle>
        <Text style={styles.sectionDescription}>
          Enhanced pie chart component with AsyncStorage persistence, PNG export functionality,
          data-driven animations, haptic feedback, and comprehensive accessibility support.
        </Text>
      </Section>

      {/* Dataset Selector */}
      {renderDatasetSelector()}

      {/* Chart Controls */}
      {renderChartControls()}

      {/* Main Chart */}
      <Section>
        <SectionTitle>Interactive Chart</SectionTitle>
        <Text style={styles.sectionDescription}>
          Tap on chart segments to select them. Use the export buttons to save or share data.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <ProgressPieChart
            data={currentData}
            title={selectedDataset}
            subtitle={`${currentData.length} data points`}
            size={250}
            enableAnimations={enableAnimations}
            enableHaptics={enableHaptics}
            enablePersistence={enablePersistence}
            showExportButtons={showExportButtons}
            onSegmentPress={handleSegmentPress}
            onDataSaved={handleDataSaved}
            onDataLoaded={handleDataLoaded}
            accessibilityLabel={`${selectedDataset} distribution chart`}
            accessibilityHint="Interactive pie chart showing data distribution. Double tap on segments to select them."
          />
        )}
      </Section>

      {/* Data Management */}
      {renderDataManagement()}

      {/* Statistics */}
      {renderStatistics()}

      {/* Status */}
      {renderStatus()}

      {/* Footer */}
      <Section>
        <Text style={styles.footerText}>
          This demo showcases the enhanced ProgressPieChart component with:
        </Text>
        <Text style={styles.featureList}>
          • AsyncStorage data persistence{'\n'}
          • PNG image export functionality{'\n'}
          • JSON data export{'\n'}
          • Data-driven animations{'\n'}
          • Haptic feedback{'\n'}
          • Comprehensive accessibility support{'\n'}
          • Interactive segment selection{'\n'}
          • Multiple dataset support
        </Text>
      </Section>
    </Container>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  featureList: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 18
  },
  footerText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 12
  },
  sectionDescription: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  }
});

export default ProgressPieChartExample;
