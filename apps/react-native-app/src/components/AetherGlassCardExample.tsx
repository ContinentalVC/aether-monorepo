//
//  AetherGlassCardExample.tsx
//  Aether React Native App
//
//  Example usage of the AetherGlassCard component with different configurations
//  and use cases.
//

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import AetherGlassCard from './AetherGlassCard';

const { width } = Dimensions.get('window');

/**
 * Example component demonstrating various uses of AetherGlassCard
 */
const AetherGlassCardExample: React.FC = () => {
  // Mock background images (replace with actual images in your project)
  const backgroundImages = {
    gradient: require('../../assets/backgrounds/gradient.jpg'),
    nature: require('../../assets/backgrounds/nature.jpg'),
    abstract: require('../../assets/backgrounds/abstract.jpg'),
  };

  const handleCardPress = (cardName: string) => {
    Alert.alert('Card Pressed', `${cardName} was pressed!`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Aether Glass Card Examples</Text>
        <Text style={styles.subtitle}>
          Demonstrating glassmorphism effects with React Native
        </Text>
      </View>

      {/* Basic Glass Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Glass Card</Text>
        <AetherGlassCard
          backgroundImage={backgroundImages.gradient}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Welcome to Aether</Text>
          <Text style={styles.cardDescription}>
            This is a basic glassmorphism card with default settings.
          </Text>
        </AetherGlassCard>
      </View>

      {/* Animated Glass Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Animated Glass Card</Text>
        <AetherGlassCard
          backgroundImage={backgroundImages.nature}
          animated={true}
          animationDuration={1000}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Animated Entrance</Text>
          <Text style={styles.cardDescription}>
            This card animates in with a smooth scale and opacity transition.
          </Text>
        </AetherGlassCard>
      </View>

      {/* Pressable Glass Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pressable Glass Card</Text>
        <AetherGlassCard
          backgroundImage={backgroundImages.abstract}
          pressable={true}
          onPress={() => handleCardPress('Pressable Card')}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Tap Me!</Text>
          <Text style={styles.cardDescription}>
            This card responds to touch with a scale animation.
          </Text>
        </AetherGlassCard>
      </View>

      {/* Custom Blur Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Blur Settings</Text>
        <AetherGlassCard
          backgroundImage={backgroundImages.gradient}
          blurAmount={25}
          blurType="dark"
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Strong Blur Effect</Text>
          <Text style={styles.cardDescription}>
            This card uses a higher blur amount and dark blur type.
          </Text>
        </AetherGlassCard>
      </View>

      {/* Multiple Cards Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Grid</Text>
        <View style={styles.grid}>
          <AetherGlassCard
            backgroundImage={backgroundImages.nature}
            style={styles.gridCard}
            pressable={true}
            onPress={() => handleCardPress('Grid Card 1')}
          >
            <Text style={styles.gridCardTitle}>Card 1</Text>
          </AetherGlassCard>

          <AetherGlassCard
            backgroundImage={backgroundImages.abstract}
            style={styles.gridCard}
            pressable={true}
            onPress={() => handleCardPress('Grid Card 2')}
          >
            <Text style={styles.gridCardTitle}>Card 2</Text>
          </AetherGlassCard>

          <AetherGlassCard
            backgroundImage={backgroundImages.gradient}
            style={styles.gridCard}
            pressable={true}
            onPress={() => handleCardPress('Grid Card 3')}
          >
            <Text style={styles.gridCardTitle}>Card 3</Text>
          </AetherGlassCard>

          <AetherGlassCard
            backgroundImage={backgroundImages.nature}
            style={styles.gridCard}
            pressable={true}
            onPress={() => handleCardPress('Grid Card 4')}
          >
            <Text style={styles.gridCardTitle}>Card 4</Text>
          </AetherGlassCard>
        </View>
      </View>

      {/* Different Blur Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Different Blur Types</Text>
        
        <AetherGlassCard
          backgroundImage={backgroundImages.gradient}
          blurType="light"
          style={styles.smallCard}
        >
          <Text style={styles.smallCardTitle}>Light Blur</Text>
        </AetherGlassCard>

        <AetherGlassCard
          backgroundImage={backgroundImages.gradient}
          blurType="dark"
          style={styles.smallCard}
        >
          <Text style={styles.smallCardTitle}>Dark Blur</Text>
        </AetherGlassCard>

        <AetherGlassCard
          backgroundImage={backgroundImages.gradient}
          blurType="prominent"
          style={styles.smallCard}
        >
          <Text style={styles.smallCardTitle}>Prominent Blur</Text>
        </AetherGlassCard>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark background for better glassmorphism effect
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    lineHeight: 24,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  card: {
    height: 200,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 60) / 2,
    height: 120,
    marginBottom: 16,
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  smallCard: {
    height: 80,
    marginBottom: 12,
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default AetherGlassCardExample; 