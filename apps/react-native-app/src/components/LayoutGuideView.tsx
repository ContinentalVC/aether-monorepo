import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useEnhancedTheme } from '../theme/EnhancedThemeProvider';
import styled from 'styled-components/native';

// MARK: - Layout Guide View

const LayoutGuideView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme } = useEnhancedTheme();

  const guideSections = [
    {
      title: 'Visual Hierarchy',
      description: 'Use size, weight, and color to create clear information hierarchy. Primary elements should be most prominent, followed by secondary and tertiary elements.',
      examples: [
        'Headings: Use larger, bolder fonts for main titles',
        'Body text: Use regular weight for readable content',
        'Captions: Use smaller, lighter fonts for supporting text',
      ],
    },
    {
      title: 'White Space',
      description: 'Adequate spacing between elements improves readability and creates visual breathing room. Use consistent spacing scales throughout your design.',
      examples: [
        'XS (4pt): Tight spacing for related elements',
        'SM (8pt): Component-level spacing',
        'MD (16pt): Section spacing',
        'LG (24pt): Major section separation',
        'XL (32pt): Page-level margins',
      ],
    },
    {
      title: 'Contrast',
      description: 'Ensure sufficient contrast between text and background colors for accessibility. Aim for a minimum contrast ratio of 4.5:1 for normal text.',
      examples: [
        'Primary text: High contrast for main content',
        'Secondary text: Medium contrast for supporting content',
        'Tertiary text: Lower contrast for subtle information',
        'Interactive elements: High contrast for buttons and links',
      ],
    },
    {
      title: 'Consistency',
      description: 'Maintain consistent spacing, typography, and color usage throughout your interface to create a cohesive user experience.',
      examples: [
        'Use the same spacing scale everywhere',
        'Apply consistent typography hierarchy',
        'Maintain color consistency across components',
        'Follow established patterns for similar elements',
      ],
    },
    {
      title: 'Alignment',
      description: 'Proper alignment creates visual order and helps users scan content efficiently. Use consistent alignment patterns throughout your design.',
      examples: [
        'Left-align text for optimal readability',
        'Center-align headings and titles',
        'Right-align numbers and dates',
        'Use grid systems for complex layouts',
      ],
    },
    {
      title: 'Proximity',
      description: 'Group related elements together and separate unrelated elements to create clear visual relationships.',
      examples: [
        'Group form fields with their labels',
        'Keep related actions close together',
        'Separate different content sections',
        'Use spacing to indicate relationships',
      ],
    },
  ];

  return (
    <Container>
      <Header>
        <HeaderTitle>Layout Design Principles</HeaderTitle>
        <CloseButton onPress={onClose}>
          <CloseButtonText>✕</CloseButtonText>
        </CloseButton>
      </Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Content>
          <Introduction>
            <IntroductionTitle>Mastering Layout Design</IntroductionTitle>
            <IntroductionText>
              Understanding layout principles helps you create interfaces that are both beautiful and functional. 
              These guidelines will help you make informed design decisions that improve user experience.
            </IntroductionText>
          </Introduction>

          {guideSections.map((section, index) => (
            <GuideSection key={index}>
              <SectionHeader>
                <SectionNumber>{index + 1}</SectionNumber>
                <SectionTitle>{section.title}</SectionTitle>
              </SectionHeader>
              
              <SectionDescription>{section.description}</SectionDescription>
              
              <ExamplesContainer>
                <ExamplesTitle>Examples:</ExamplesTitle>
                {section.examples.map((example, exampleIndex) => (
                  <ExampleItem key={exampleIndex}>
                    <ExampleBullet>•</ExampleBullet>
                    <ExampleText>{example}</ExampleText>
                  </ExampleItem>
                ))}
              </ExamplesContainer>
            </GuideSection>
          ))}

          <BestPracticesSection>
            <BestPracticesTitle>Best Practices Checklist</BestPracticesTitle>
            <ChecklistContainer>
              <ChecklistItem>✓ Use consistent spacing throughout</ChecklistItem>
              <ChecklistItem>✓ Maintain clear visual hierarchy</ChecklistItem>
              <ChecklistItem>✓ Ensure sufficient contrast ratios</ChecklistItem>
              <ChecklistItem>✓ Group related elements together</ChecklistItem>
              <ChecklistItem>✓ Align elements consistently</ChecklistItem>
              <ChecklistItem>✓ Test with different screen sizes</ChecklistItem>
              <ChecklistItem>✓ Consider accessibility guidelines</ChecklistItem>
              <ChecklistItem>✓ Use whitespace effectively</ChecklistItem>
            </ChecklistContainer>
          </BestPracticesSection>

          <ResourcesSection>
            <ResourcesTitle>Additional Resources</ResourcesTitle>
            <ResourceItem onPress={() => Alert.alert('Resource', 'Design System Documentation')}>
              <ResourceIcon>📚</ResourceIcon>
              <ResourceText>Design System Documentation</ResourceText>
            </ResourceItem>
            <ResourceItem onPress={() => Alert.alert('Resource', 'Accessibility Guidelines')}>
              <ResourceIcon>♿</ResourceIcon>
              <ResourceText>Accessibility Guidelines</ResourceText>
            </ResourceItem>
            <ResourceItem onPress={() => Alert.alert('Resource', 'Typography Guide')}>
              <ResourceIcon>🔤</ResourceIcon>
              <ResourceText>Typography Guide</ResourceText>
            </ResourceItem>
          </ResourcesSection>
        </Content>
      </ScrollView>
    </Container>
  );
};

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.border};
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  align-items: center;
  justify-content: center;
`;

const CloseButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Content = styled.View`
  padding: 20px;
`;

const Introduction = styled.View`
  margin-bottom: 32px;
  padding: 20px;
  background-color: ${({ theme }) => theme.primary}10;
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.primary};
`;

const IntroductionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const IntroductionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 24px;
`;

const GuideSection = styled.View`
  margin-bottom: 32px;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionNumber = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.primary};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  flex: 1;
`;

const SectionDescription = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 24px;
  margin-bottom: 16px;
`;

const ExamplesContainer = styled.View`
  gap: 8px;
`;

const ExamplesTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

const ExampleItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

const ExampleBullet = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  margin-top: 2px;
`;

const ExampleText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 20px;
  flex: 1;
`;

const BestPracticesSection = styled.View`
  margin-bottom: 32px;
  padding: 20px;
  background-color: ${({ theme }) => theme.success}10;
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.success};
`;

const BestPracticesTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const ChecklistContainer = styled.View`
  gap: 8px;
`;

const ChecklistItem = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 20px;
`;

const ResourcesSection = styled.View`
  margin-bottom: 32px;
`;

const ResourcesTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const ResourceItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  margin-bottom: 8px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
  elevation: 1;
`;

const ResourceIcon = styled.Text`
  font-size: 20px;
  margin-right: 12px;
`;

const ResourceText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  flex: 1;
`;

// MARK: - Styles

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default LayoutGuideView; 