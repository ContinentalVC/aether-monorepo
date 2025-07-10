//
//  UserInteraction.tsx
//  AetherReactNativeApp
//
//  Created by AI Assistant
//  Copyright © 2025 Aether Design System. All rights reserved.
//

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';

// MARK: - User Interaction Foundation
/// Comprehensive user interaction system implementing advanced animations, gestures, and haptic feedback

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// MARK: - Advanced Animation Utilities
class AdvancedAnimation {
  // MARK: - Custom Easing Functions
  static createEaseOutBack(duration: number = 600): Animated.Value {
    return new Animated.Value(0);
  }

  static createEaseInBack(duration: number = 600): Animated.Value {
    return new Animated.Value(0);
  }

  static createSpringWithDamping(damping: number = 0.7, response: number = 0.5): Animated.Value {
    return new Animated.Value(0);
  }

  // MARK: - Animation Sequences
  static async animateSequence(animations: (() => Promise<void>)[]): Promise<void> {
    for (const animation of animations) {
      await animation();
    }
  }

  static createChoreographedAppear(delay: number = 0): Animated.Value {
    const animatedValue = new Animated.Value(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
    return animatedValue;
  }

  static createChoreographedDisappear(): Animated.Value {
    const animatedValue = new Animated.Value(1);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
    return animatedValue;
  }
}

// MARK: - Haptic Feedback Manager
class HapticFeedbackManager {
  static playSuccessHaptic(): void {
    Vibration.vibrate(100);
  }

  static playWarningHaptic(): void {
    Vibration.vibrate(150);
  }

  static playErrorHaptic(): void {
    Vibration.vibrate([0, 200, 100, 200]);
  }
}

// MARK: - Interactive Chart Component
export const InteractiveChartView: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const offsetAnim = useRef(new Animated.ValueXY()).current;

  const data = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45];

  const handlePointPress = (index: number) => {
    setSelectedPoint(selectedPoint === index ? null : index);
    HapticFeedbackManager.playSuccessHaptic();
  };

  const animateChart = () => {
    setIsAnimating(true);
    
    // Animate each bar sequentially
    data.forEach((_, index) => {
      setTimeout(() => {
        setSelectedPoint(index);
        HapticFeedbackManager.playSuccessHaptic();
        
        setTimeout(() => {
          setSelectedPoint(null);
        }, 200);
      }, index * 100);
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, data.length * 100 + 500);
  };

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scaleAnim } }],
    { useNativeDriver: true }
  );

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: offsetAnim.x, translationY: offsetAnim.y } }],
    { useNativeDriver: true }
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Interactive Chart</Text>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <View style={styles.chartBackground}>
            <View style={styles.chartBars}>
              {data.map((value, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.bar,
                    {
                      height: value * 3,
                      backgroundColor: selectedPoint === index ? '#007AFF' : '#8E8E93',
                      transform: [{ scale: selectedPoint === index ? 1.1 : 1.0 }],
                    },
                  ]}
                  onPress={() => handlePointPress(index)}
                  accessible={true}
                  accessibilityLabel={`Data point ${index + 1}`}
                  accessibilityValue={{ text: `Value: ${Math.round(value)}` }}
                  accessibilityHint="Double tap to select this data point"
                >
                  {selectedPoint === index && (
                    <Text style={styles.barValue}>{Math.round(value)}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.primaryButton} onPress={animateChart}>
            <Text style={styles.primaryButtonText}>Animate Chart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setSelectedPoint(null)}
          >
            <Text style={styles.secondaryButtonText}>Reset Selection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={HapticFeedbackManager.playSuccessHaptic}
          >
            <Text style={styles.secondaryButtonText}>Test Haptic Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// MARK: - Gesture-Based Data Visualization
export const GestureDataVisualization: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCanvasPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (!isDrawing) {
      setIsDrawing(true);
      setDataPoints(prev => [...prev, { x: locationX, y: locationY }]);
      HapticFeedbackManager.playWarningHaptic();
    } else {
      setDataPoints(prev => [...prev, { x: locationX, y: locationY }]);
    }
  };

  const handleCanvasRelease = () => {
    setIsDrawing(false);
    HapticFeedbackManager.playSuccessHaptic();
  };

  const handlePointPress = (index: number) => {
    setSelectedPoint(selectedPoint === index ? null : index);
    HapticFeedbackManager.playSuccessHaptic();
  };

  const generateRandomPoints = () => {
    const newPoints = [];
    for (let i = 0; i < 10; i++) {
      newPoints.push({
        x: Math.random() * 250 + 50,
        y: Math.random() * 200 + 50,
      });
    }
    setDataPoints(newPoints);
    setSelectedPoint(null);
    HapticFeedbackManager.playSuccessHaptic();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Gesture Data Visualization</Text>

        {/* Drawing Canvas */}
        <View style={styles.canvasContainer}>
          <TouchableOpacity
            style={styles.canvas}
            onPress={handleCanvasPress}
            onPressIn={() => setIsDrawing(true)}
            onPressOut={handleCanvasRelease}
            activeOpacity={1}
          >
            {/* Data Points */}
            {dataPoints.map((point, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    left: point.x - 10,
                    top: point.y - 10,
                    backgroundColor: selectedPoint === index ? '#FF3B30' : '#007AFF',
                    transform: [{ scale: selectedPoint === index ? 1.5 : 1.0 }],
                  },
                ]}
                onPress={() => handlePointPress(index)}
                accessible={true}
                accessibilityLabel={`Data point ${index + 1}`}
                accessibilityValue={{ text: `Position: ${Math.round(point.x)}, ${Math.round(point.y)}` }}
              />
            ))}

            {/* Connection Lines */}
            {dataPoints.length > 1 && (
              <View style={styles.connectionLines}>
                {/* This would require a custom SVG or canvas implementation for lines */}
                <Text style={styles.connectionText}>Connection lines would be drawn here</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setDataPoints([]);
              setSelectedPoint(null);
            }}
          >
            <Text style={styles.primaryButtonText}>Clear Points</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={generateRandomPoints}>
            <Text style={styles.secondaryButtonText}>Generate Random Points</Text>
          </TouchableOpacity>

          <Text style={styles.pointsCount}>Points: {dataPoints.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// MARK: - Animated Dashboard Component
export const AnimatedDashboardView: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const metrics = [
    { title: 'Revenue', value: '$125K', color: '#34C759' },
    { title: 'Users', value: '2.4K', color: '#007AFF' },
    { title: 'Growth', value: '+12%', color: '#FF9500' },
    { title: 'Engagement', value: '89%', color: '#AF52DE' },
  ];

  useEffect(() => {
    setIsVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMetricPress = (index: number) => {
    setSelectedMetric(index);
    HapticFeedbackManager.playSuccessHaptic();
  };

  const animateDashboard = () => {
    setIsVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setIsVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 300);
    });
    HapticFeedbackManager.playSuccessHaptic();
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Animated Dashboard</Text>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              color={metric.color}
              isSelected={selectedMetric === index}
              delay={index * 100}
              onPress={() => handleMetricPress(index)}
            />
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.primaryButton} onPress={animateDashboard}>
            <Text style={styles.primaryButtonText}>Animate Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setSelectedMetric(0)}
          >
            <Text style={styles.secondaryButtonText}>Reset Selection</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

// MARK: - Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  color: string;
  isSelected: boolean;
  delay: number;
  onPress: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  color,
  isSelected,
  delay,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, delay);
  }, []);

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.metricCard,
        {
          borderColor: color,
          borderWidth: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2],
          }),
          transform: [
            {
              scale: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, isSelected ? 1.05 : 1.0],
              }),
            },
          ],
        },
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${title} metric`}
      accessibilityValue={{ text: value }}
      accessibilityHint="Double tap to select this metric"
    >
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </AnimatedTouchableOpacity>
  );
};

// MARK: - User Interaction Testing View
export const UserInteractionTestingView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <InteractiveChartView />;
      case 1:
        return <GestureDataVisualization />;
      case 2:
        return <AnimatedDashboardView />;
      default:
        return <InteractiveChartView />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>
            Chart
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 1 && styles.activeTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>
            Gestures
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 2 && styles.activeTab]}
          onPress={() => setSelectedTab(2)}
        >
          <Text style={[styles.tabText, selectedTab === 2 && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {renderContent()}
    </View>
  );
};

// MARK: - Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    height: 200,
    marginBottom: 20,
  },
  chartBackground: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'flex-end',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  canvasContainer: {
    height: 300,
    marginBottom: 20,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    position: 'relative',
  },
  dataPoint: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionText: {
    color: '#666',
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pointsCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default UserInteractionTestingView; 