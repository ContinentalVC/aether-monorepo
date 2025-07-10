import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useEnhancedTheme } from '../theme/EnhancedThemeProvider';
import LayoutPreviewView from './LayoutPreviewView';
import LayoutGuideView from './LayoutGuideView';
import styled from 'styled-components/native';

// MARK: - Layout Preview Example

const LayoutPreviewExample: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const [showLayoutPreview, setShowLayoutPreview] = useState(false);
  const [showLayoutGuide, setShowLayoutGuide] = useState(false);

  return (
    <Container>
      <Header>
        <HeaderTitle>Layout & Hierarchy Preview</HeaderTitle>
        <HeaderSubtitle>
          Real-time visual feedback for design changes
        </HeaderSubtitle>
      </Header>

      <Content>
        <DescriptionSection>
          <DescriptionTitle>What is Layout Preview?</DescriptionTitle>
          <DescriptionText>
            The Layout Preview system provides real-time visual feedback as you modify design tokens. 
            It shows how changes affect visual hierarchy, contrast, and spacing across different interface types.
          </DescriptionText>
        </DescriptionSection>

        <FeaturesSection>
          <FeaturesTitle>Key Features</FeaturesTitle>
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>🎨</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Live Preview</FeatureTitle>
                <FeatureDescription>
                  See changes instantly across different interface types
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Hierarchy Analysis</FeatureTitle>
                <FeatureDescription>
                  Understand how your design creates visual hierarchy
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📏</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Spacing Analysis</FeatureTitle>
                <FeatureDescription>
                  Analyze spacing consistency and effectiveness
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Contrast Analysis</FeatureTitle>
                <FeatureDescription>
                  Ensure accessibility with contrast ratio checks
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </FeatureList>
        </FeaturesSection>

        <PreviewTypesSection>
          <PreviewTypesTitle>Preview Types</PreviewTypesTitle>
          <PreviewTypesGrid>
            <PreviewTypeCard>
              <PreviewTypeIcon>📊</PreviewTypeIcon>
              <PreviewTypeTitle>Dashboard</PreviewTypeTitle>
              <PreviewTypeDescription>
                Data visualization and metrics display
              </PreviewTypeDescription>
            </PreviewTypeCard>

            <PreviewTypeCard>
              <PreviewTypeIcon>📄</PreviewTypeIcon>
              <PreviewTypeTitle>Article</PreviewTypeTitle>
              <PreviewTypeDescription>
                Long-form content and typography
              </PreviewTypeDescription>
            </PreviewTypeCard>

            <PreviewTypeCard>
              <PreviewTypeIcon>👤</PreviewTypeIcon>
              <PreviewTypeTitle>Profile</PreviewTypeTitle>
              <PreviewTypeDescription>
                User profiles and social elements
              </PreviewTypeDescription>
            </PreviewTypeCard>

            <PreviewTypeCard>
              <PreviewTypeIcon>⚙️</PreviewTypeIcon>
              <PreviewTypeTitle>Settings</PreviewTypeTitle>
              <PreviewTypeDescription>
                Configuration and preferences
              </PreviewTypeDescription>
            </PreviewTypeCard>

            <PreviewTypeCard>
              <PreviewTypeIcon>🃏</PreviewTypeIcon>
              <PreviewTypeTitle>Card</PreviewTypeTitle>
              <PreviewTypeDescription>
                Content cards and containers
              </PreviewTypeDescription>
            </PreviewTypeCard>
          </PreviewTypesGrid>
        </PreviewTypesSection>

        <ActionButtons>
          <PrimaryButton onPress={() => setShowLayoutPreview(true)}>
            <PrimaryButtonText>Open Layout Preview</PrimaryButtonText>
          </PrimaryButton>

          <SecondaryButton onPress={() => setShowLayoutGuide(true)}>
            <SecondaryButtonText>View Design Guide</SecondaryButtonText>
          </SecondaryButton>
        </ActionButtons>
      </Content>

      {/* Layout Preview Modal */}
      <Modal
        visible={showLayoutPreview}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LayoutPreviewView />
          <CloseButton onPress={() => setShowLayoutPreview(false)}>
            <CloseButtonText>Close Preview</CloseButtonText>
          </CloseButton>
        </SafeAreaView>
      </Modal>

      {/* Layout Guide Modal */}
      <Modal
        visible={showLayoutGuide}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <LayoutGuideView onClose={() => setShowLayoutGuide(false)} />
        </SafeAreaView>
      </Modal>
    </Container>
  );
};

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.View`
  padding: 24px 20px;
  background-color: ${({ theme }) => theme.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.border};
`;

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

const HeaderSubtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const DescriptionSection = styled.View`
  margin-bottom: 32px;
  padding: 20px;
  background-color: ${({ theme }) => theme.primary}10;
  border-radius: 12px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.primary};
`;

const DescriptionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 24px;
`;

const FeaturesSection = styled.View`
  margin-bottom: 32px;
`;

const FeaturesTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const FeatureList = styled.View`
  gap: 16px;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const FeatureIcon = styled.Text`
  font-size: 24px;
  margin-right: 16px;
`;

const FeatureContent = styled.View`
  flex: 1;
`;

const FeatureTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

const FeatureDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 20px;
`;

const PreviewTypesSection = styled.View`
  margin-bottom: 32px;
`;

const PreviewTypesTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const PreviewTypesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const PreviewTypeCard = styled.View`
  width: calc(50% - 6px);
  padding: 16px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
  align-items: center;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const PreviewTypeIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
`;

const PreviewTypeTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
  text-align: center;
`;

const PreviewTypeDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  line-height: 16px;
`;

const ActionButtons = styled.View`
  gap: 12px;
  margin-bottom: 32px;
`;

const PrimaryButton = styled.TouchableOpacity`
  padding: 16px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 12px;
  align-items: center;
`;

const PrimaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
`;

const SecondaryButton = styled.TouchableOpacity`
  padding: 16px;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  align-items: center;
`;

const SecondaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  right: 20px;
  padding: 12px 20px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 20px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

const CloseButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

// MARK: - Styles

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
});

export default LayoutPreviewExample; 