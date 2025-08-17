//
//  chartStorage.ts
//  Aether React Native App
//
//  AsyncStorage utilities for persisting chart data.
//  Provides functions to save, load, and manage chart data with proper error handling.
//

import AsyncStorage from '@react-native-async-storage/async-storage';

// MARK: - Types

export interface PieChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

export interface ChartData {
  id: string;
  title: string;
  data: PieChartData[];
  createdAt: string;
  updatedAt: string;
}

export interface StorageError {
  message: string;
  code: string;
  timestamp: string;
}

// MARK: - Storage Keys

const STORAGE_KEYS = {
  CHART_DATA: 'pie_chart_data',
  CHART_HISTORY: 'pie_chart_history',
  SETTINGS: 'pie_chart_settings'
} as const;

// MARK: - Utility Functions

/**
 * Save chart data to AsyncStorage
 * @param data - The chart data to save
 * @param title - Optional title for the chart
 * @returns Promise<ChartData> - The saved chart data
 */
export const saveChartData = async (
  data: PieChartData[],
  title: string = 'Pie Chart'
): Promise<ChartData> => {
  try {
    // Validate input data
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid chart data: must be a non-empty array');
    }

    // Calculate percentages if not provided
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const processedData = data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    }));

    // Create chart data object
    const chartData: ChartData = {
      id: generateId(),
      title,
      data: processedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.CHART_DATA, JSON.stringify(chartData));

    // Add to history
    await addToHistory(chartData);

    console.log(`Chart data saved successfully: ${chartData.id}`);
    return chartData;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'SAVE_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error saving chart data:', storageError);
    throw storageError;
  }
};

/**
 * Load chart data from AsyncStorage
 * @returns Promise<PieChartData[]> - The loaded chart data
 */
export const loadChartData = async (): Promise<PieChartData[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEYS.CHART_DATA);

    if (!storedData) {
      console.log('No saved chart data found');
      return [];
    }

    const chartData: ChartData = JSON.parse(storedData);

    // Validate loaded data
    if (!isValidChartData(chartData)) {
      throw new Error('Invalid chart data format');
    }

    console.log(`Chart data loaded successfully: ${chartData.id}`);
    return chartData.data;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'LOAD_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error loading chart data:', storageError);
    throw storageError;
  }
};

/**
 * Load specific chart data by ID
 * @param id - The chart ID to load
 * @returns Promise<ChartData | null> - The loaded chart data or null if not found
 */
export const loadChartDataById = async (id: string): Promise<ChartData | null> => {
  try {
    const history = await loadChartHistory();
    const chartData = history.find(chart => chart.id === id);

    if (!chartData) {
      console.log(`Chart data not found for ID: ${id}`);
      return null;
    }

    console.log(`Chart data loaded by ID: ${id}`);
    return chartData;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'LOAD_BY_ID_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error loading chart data by ID:', storageError);
    throw storageError;
  }
};

/**
 * Update existing chart data
 * @param id - The chart ID to update
 * @param data - The new chart data
 * @param title - Optional new title
 * @returns Promise<ChartData> - The updated chart data
 */
export const updateChartData = async (
  id: string,
  data: PieChartData[],
  title?: string
): Promise<ChartData> => {
  try {
    // Validate input data
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid chart data: must be a non-empty array');
    }

    // Load existing chart data
    const existingChart = await loadChartDataById(id);
    if (!existingChart) {
      throw new Error(`Chart data not found for ID: ${id}`);
    }

    // Calculate percentages if not provided
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const processedData = data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    }));

    // Update chart data
    const updatedChart: ChartData = {
      ...existingChart,
      title: title || existingChart.title,
      data: processedData,
      updatedAt: new Date().toISOString()
    };

    // Save updated data
    await AsyncStorage.setItem(STORAGE_KEYS.CHART_DATA, JSON.stringify(updatedChart));

    // Update in history
    await updateInHistory(updatedChart);

    console.log(`Chart data updated successfully: ${id}`);
    return updatedChart;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'UPDATE_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error updating chart data:', storageError);
    throw storageError;
  }
};

/**
 * Delete chart data
 * @param id - The chart ID to delete
 * @returns Promise<boolean> - True if deleted successfully
 */
export const deleteChartData = async (id: string): Promise<boolean> => {
  try {
    const history = await loadChartHistory();
    const updatedHistory = history.filter(chart => chart.id !== id);

    await AsyncStorage.setItem(STORAGE_KEYS.CHART_HISTORY, JSON.stringify(updatedHistory));

    // If deleting current chart, clear current data
    const currentData = await AsyncStorage.getItem(STORAGE_KEYS.CHART_DATA);
    if (currentData) {
      const currentChart: ChartData = JSON.parse(currentData);
      if (currentChart.id === id) {
        await AsyncStorage.removeItem(STORAGE_KEYS.CHART_DATA);
      }
    }

    console.log(`Chart data deleted successfully: ${id}`);
    return true;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'DELETE_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error deleting chart data:', storageError);
    throw storageError;
  }
};

/**
 * Clear all chart data
 * @returns Promise<boolean> - True if cleared successfully
 */
export const clearAllChartData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CHART_DATA,
      STORAGE_KEYS.CHART_HISTORY
    ]);

    console.log('All chart data cleared successfully');
    return true;
  } catch (error) {
    const storageError: StorageError = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      code: 'CLEAR_ERROR',
      timestamp: new Date().toISOString()
    };
    console.error('Error clearing chart data:', storageError);
    throw storageError;
  }
};

/**
 * Load chart history
 * @returns Promise<ChartData[]> - Array of saved charts
 */
export const loadChartHistory = async (): Promise<ChartData[]> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHART_HISTORY);

    if (!historyData) {
      return [];
    }

    const history: ChartData[] = JSON.parse(historyData);

    // Validate history data
    if (!Array.isArray(history)) {
      throw new Error('Invalid history data format');
    }

    return history.filter(chart => isValidChartData(chart));
  } catch (error) {
    console.error('Error loading chart history:', error);
    return [];
  }
};

/**
 * Get chart statistics
 * @returns Promise<object> - Statistics about saved charts
 */
export const getChartStatistics = async (): Promise<{
  totalCharts: number;
  totalDataPoints: number;
  averageDataPoints: number;
  lastUpdated: string | null;
}> => {
  try {
    const history = await loadChartHistory();

    if (history.length === 0) {
      return {
        totalCharts: 0,
        totalDataPoints: 0,
        averageDataPoints: 0,
        lastUpdated: null
      };
    }

    const totalDataPoints = history.reduce((sum, chart) => sum + chart.data.length, 0);
    const averageDataPoints = totalDataPoints / history.length;
    const lastUpdated = history.reduce((latest, chart) =>
      chart.updatedAt > latest ? chart.updatedAt : latest, history[0].updatedAt
    );

    return {
      totalCharts: history.length,
      totalDataPoints,
      averageDataPoints: Math.round(averageDataPoints * 100) / 100,
      lastUpdated
    };
  } catch (error) {
    console.error('Error getting chart statistics:', error);
    return {
      totalCharts: 0,
      totalDataPoints: 0,
      averageDataPoints: 0,
      lastUpdated: null
    };
  }
};

// MARK: - Helper Functions

/**
 * Generate a unique ID
 * @returns string - Unique identifier
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Add chart data to history
 * @param chartData - The chart data to add
 */
const addToHistory = async (chartData: ChartData): Promise<void> => {
  try {
    const history = await loadChartHistory();

    // Remove existing entry with same ID if exists
    const filteredHistory = history.filter(chart => chart.id !== chartData.id);

    // Add new entry at the beginning
    const updatedHistory = [chartData, ...filteredHistory].slice(0, 50); // Keep last 50 charts

    await AsyncStorage.setItem(STORAGE_KEYS.CHART_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};

/**
 * Update chart data in history
 * @param chartData - The updated chart data
 */
const updateInHistory = async (chartData: ChartData): Promise<void> => {
  try {
    const history = await loadChartHistory();
    const updatedHistory = history.map(chart =>
      chart.id === chartData.id ? chartData : chart
    );

    await AsyncStorage.setItem(STORAGE_KEYS.CHART_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error updating in history:', error);
  }
};

/**
 * Validate chart data structure
 * @param chartData - The chart data to validate
 * @returns boolean - True if valid
 */
const isValidChartData = (chartData: any): chartData is ChartData => {
  return (
    chartData &&
    typeof chartData === 'object' &&
    typeof chartData.id === 'string' &&
    typeof chartData.title === 'string' &&
    Array.isArray(chartData.data) &&
    chartData.data.length > 0 &&
    typeof chartData.createdAt === 'string' &&
    typeof chartData.updatedAt === 'string' &&
    chartData.data.every((item: any) =>
      item &&
      typeof item.id === 'string' &&
      typeof item.label === 'string' &&
      typeof item.value === 'number' &&
      typeof item.color === 'string'
    )
  );
};

/**
 * Export chart data as JSON
 * @param data - The chart data to export
 * @returns string - JSON string representation
 */
export const exportChartDataAsJSON = (data: PieChartData[]): string => {
  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data,
    total: data.reduce((sum, item) => sum + item.value, 0),
    count: data.length
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Import chart data from JSON
 * @param jsonString - JSON string to import
 * @returns PieChartData[] - Parsed chart data
 */
export const importChartDataFromJSON = (jsonString: string): PieChartData[] => {
  try {
    const parsed = JSON.parse(jsonString);

    if (parsed.data && Array.isArray(parsed.data)) {
      return parsed.data.map((item: any) => ({
        id: item.id || generateId(),
        label: item.label || 'Unknown',
        value: typeof item.value === 'number' ? item.value : 0,
        color: item.color || '#007AFF',
        percentage: item.percentage
      }));
    }

    throw new Error('Invalid JSON format: missing data array');
  } catch (error) {
    throw new Error(`Failed to import chart data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
