import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Import the actual component after mocking dependencies
import AetherGlassCard from '../AetherGlassCard';

describe('AetherGlassCard', () => {
  const mockBackgroundImage = { uri: 'test-image.jpg' };

  describe('Rendering', () => {
    it('should render with basic props', () => {
      const { getByText, getByTestId } = render(
        <AetherGlassCard backgroundImage={mockBackgroundImage}>
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();
      expect(getByText('Test Content')).toBeTruthy();
    });

    it('should render with custom style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          style={customStyle}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();
    });

    it('should render with different blur amounts', () => {
      const { getByTestId, rerender } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          blurAmount={10}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();

      rerender(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          blurAmount={25}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();
    });

    it('should render with different blur types', () => {
      const blurTypes = ['light', 'dark', 'xlight', 'prominent', 'regular', 'extraDark'] as const;
      
      blurTypes.forEach(blurType => {
        const { getByTestId, unmount } = render(
          <AetherGlassCard 
            backgroundImage={mockBackgroundImage}
            blurType={blurType}
          >
            <Text>Test Content</Text>
          </AetherGlassCard>
        );

        expect(getByTestId('blur-view')).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Animation', () => {
    it('should render with animation disabled', () => {
      const { getByTestId } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          animated={false}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();
    });

    it('should render with custom animation duration', () => {
      const { getByTestId } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          animationDuration={1500}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('blur-view')).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should handle press when pressable is true', () => {
      const mockOnPress = jest.fn();
      const { getAllByTestId } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          pressable={true}
          onPress={mockOnPress}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      // There may be multiple elements with this testID, so fireEvent.press on the first TouchableOpacity
      const pressables = getAllByTestId('aether-glass-card');
      fireEvent.press(pressables[0]);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should not handle press when pressable is false', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          pressable={false}
          onPress={mockOnPress}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      fireEvent.press(getByTestId('aether-glass-card'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      expect(() => {
        render(
          <AetherGlassCard backgroundImage={mockBackgroundImage}>
            {null}
          </AetherGlassCard>
        );
      }).not.toThrow();
    });

    it('should handle undefined children gracefully', () => {
      expect(() => {
        render(
          <AetherGlassCard backgroundImage={mockBackgroundImage}>
            {undefined}
          </AetherGlassCard>
        );
      }).not.toThrow();
    });

    it('should handle complex nested content', () => {
      const { getByText } = render(
        <AetherGlassCard backgroundImage={mockBackgroundImage}>
          <View>
            <Text>Nested Content 1</Text>
            <View>
              <Text>Nested Content 2</Text>
            </View>
          </View>
        </AetherGlassCard>
      );

      expect(getByText('Nested Content 1')).toBeTruthy();
      expect(getByText('Nested Content 2')).toBeTruthy();
    });

    it('should handle very long content', () => {
      const longText = 'a'.repeat(1000);
      const { getByText } = render(
        <AetherGlassCard backgroundImage={mockBackgroundImage}>
          <Text>{longText}</Text>
        </AetherGlassCard>
      );

      expect(getByText(longText)).toBeTruthy();
    });

    it('should handle special characters in content', () => {
      const specialText = 'Test with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const { getByText } = render(
        <AetherGlassCard backgroundImage={mockBackgroundImage}>
          <Text>{specialText}</Text>
        </AetherGlassCard>
      );

      expect(getByText(specialText)).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render multiple cards efficiently', () => {
      const cards = Array.from({ length: 10 }, (_, i) => (
        <AetherGlassCard 
          key={i}
          backgroundImage={mockBackgroundImage}
        >
          <Text>Card {i}</Text>
        </AetherGlassCard>
      ));

      const { getByText } = render(<View>{cards}</View>);

      expect(getByText('Card 0')).toBeTruthy();
      expect(getByText('Card 9')).toBeTruthy();
    });

    it('should handle rapid prop changes', () => {
      const { getByTestId, rerender } = render(
        <AetherGlassCard 
          backgroundImage={mockBackgroundImage}
          blurAmount={10}
        >
          <Text>Test Content</Text>
        </AetherGlassCard>
      );

      expect(getByTestId('aether-glass-card')).toBeTruthy();

      // Rapid prop changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <AetherGlassCard 
            backgroundImage={mockBackgroundImage}
            blurAmount={10 + i}
            animationDuration={800 + i * 100}
          >
            <Text>Test Content</Text>
          </AetherGlassCard>
        );
      }

      expect(getByTestId('aether-glass-card')).toBeTruthy();
    });
  });

  describe('Integration', () => {
    it('should work with other React Native components', () => {
      const { getByText } = render(
        <AetherGlassCard backgroundImage={mockBackgroundImage}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Title</Text>
            <Text style={{ fontSize: 14, marginTop: 8 }}>Description</Text>
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Text style={{ marginRight: 8 }}>Tag 1</Text>
              <Text style={{ marginRight: 8 }}>Tag 2</Text>
            </View>
          </View>
        </AetherGlassCard>
      );

      expect(getByText('Title')).toBeTruthy();
      expect(getByText('Description')).toBeTruthy();
      expect(getByText('Tag 1')).toBeTruthy();
      expect(getByText('Tag 2')).toBeTruthy();
    });
  });
}); 