import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { 
  Box, 
  OrbitControls, 
  Text as DreiText
} from '@react-three/drei/native';
import * as THREE from 'three';

// TypeScript interfaces for type safety
interface BarData {
  label: string;
  value: number;
}

interface BarChart3DProps {
  data: BarData[];
  width?: number;
  height?: number;
  barWidth?: number;
  barSpacing?: number;
  baseHeight?: number;
  colors?: string[];
  backgroundColor?: string;
  showLabels?: boolean;
  animate?: boolean;
}

/**
 * 3D Bar Chart Component for React Native using react-three-fiber
 * 
 * This component renders an interactive 3D bar chart with the following features:
 * - Interactive bars that change color on tap
 * - Orbit controls for camera manipulation
 * - Proper lighting setup
 * - Responsive layout based on data
 * - Optional animations and labels
 * 
 * @param data - Array of objects with label and value properties
 * @param width - Width of the chart container
 * @param height - Height of the chart container
 * @param barWidth - Width of each bar
 * @param barSpacing - Spacing between bars
 * @param baseHeight - Base height for bars (minimum height)
 * @param colors - Array of colors for bars
 * @param backgroundColor - Background color of the scene
 * @param showLabels - Whether to show labels on bars
 * @param animate - Whether to animate bars on mount
 */
const BarChart3D: React.FC<BarChart3DProps> = ({
  data = [],
  width = Dimensions.get('window').width,
  height = 400,
  barWidth = 0.8,
  barSpacing = 1.2,
  baseHeight = 0.1,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
  backgroundColor = '#f0f0f0',
  showLabels = true,
  animate = true
}) => {
  // State to track which bar is currently active/selected
  const [activeBar, setActiveBar] = useState<number | null>(null);
  
  // Calculate chart dimensions based on data
  const totalWidth = data.length * barSpacing;
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  // Generate random colors if not enough provided
  const getBarColor = (index: number, isActive: boolean) => {
    if (isActive) {
      return '#FFD700'; // Gold color for active bars
    }
    return colors[index % colors.length];
  };

  /**
   * Individual Bar Component
   * Renders a single 3D bar with interactive features
   */
  const Bar: React.FC<{ 
    data: BarData; 
    index: number; 
    position: [number, number, number];
    isActive: boolean;
    onTap: () => void;
  }> = ({ data, index, position, isActive, onTap }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const barHeight = (data.value / maxValue) * 5 + baseHeight; // Scale height to reasonable 3D size
    
    // Animation for bar growth on mount
    const [animatedHeight, setAnimatedHeight] = useState(animate ? 0 : barHeight);
    
    // Animate bar height on mount if animation is enabled
    useFrame(() => {
      if (animate && meshRef.current && animatedHeight < barHeight) {
        setAnimatedHeight(prev => Math.min(prev + 0.1, barHeight));
      }
    });

    return (
      <group position={position}>
        {/* Main bar mesh */}
        <Box
          ref={meshRef}
          args={[barWidth, animatedHeight, barWidth]}
          position={[0, animatedHeight / 2, 0]}
          onClick={onTap}
        >
          <meshStandardMaterial 
            color={getBarColor(index, isActive)}
            roughness={0.3}
            metalness={0.1}
          />
        </Box>
        
        {/* Bar label */}
        {showLabels && (
          <DreiText
            position={[0, animatedHeight + 0.5, 0]}
            fontSize={0.3}
            color="#333"
            anchorX="center"
            anchorY="middle"
            maxWidth={barWidth * 2}
          >
            {data.label}
          </DreiText>
        )}
        
        {/* Value label */}
        <DreiText
          position={[0, animatedHeight / 2, barWidth / 2 + 0.2]}
          fontSize={0.25}
          color="#666"
          anchorX="center"
          anchorY="middle"
        >
          {data.value}
        </DreiText>
      </group>
    );
  };

  /**
   * Chart Scene Component
   * Contains the 3D scene with all bars and lighting
   */
  const ChartScene: React.FC = () => {
    return (
      <>
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Grid for reference */}
        <gridHelper args={[20, 20, '#ddd', '#ddd']} />
        
        {/* Render bars */}
        {data.map((item, index) => {
          const xPosition = (index - (data.length - 1) / 2) * barSpacing;
          
          return (
            <Bar
              key={`bar-${index}`}
              data={item}
              index={index}
              position={[xPosition, 0, 0]}
              isActive={activeBar === index}
              onTap={() => setActiveBar(activeBar === index ? null : index)}
            />
          );
        })}
        
        {/* Orbit controls for camera manipulation */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          autoRotate={false}
          autoRotateSpeed={1}
        />
      </>
    );
  };

  // Error handling for empty data
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { width, height }]}>
        <Text style={styles.errorText}>No data provided for chart</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Chart title */}
      <Text style={styles.title}>3D Bar Chart</Text>
      
      {/* 3D Canvas */}
      <Canvas
        style={styles.canvas}
        camera={{ 
          position: [0, 5, 8], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        <ChartScene />
      </Canvas>
      
      {/* Legend/Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tap bars to highlight • Drag to rotate • Pinch to zoom
        </Text>
        {activeBar !== null && (
          <Text style={styles.selectedText}>
            Selected: {data[activeBar].label} ({data[activeBar].value})
          </Text>
        )}
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    color: '#333',
  },
  canvas: {
    flex: 1,
  },
  infoContainer: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default BarChart3D; 