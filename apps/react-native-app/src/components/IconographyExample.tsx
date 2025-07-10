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
import { useIconography, IconCategory } from './IconographyManager';
import IconographyCustomizationView from './IconographyCustomizationView';
import styled from 'styled-components/native';

// MARK: - Iconography Example

const IconographyExample: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const { currentStyle, getIcon, getIconsByCategory } = useIconography();
  const [showIconographyCustomization, setShowIconographyCustomization] = useState(false);

  const sampleIcons = ['star', 'heart', 'gear', 'person', 'house', 'search', 'plus', 'checkmark'];

  return (
    <Container>
      <Header>
        <HeaderTitle>Iconography System</HeaderTitle>
        <HeaderSubtitle>
          Consistent icon styling and management
        </HeaderSubtitle>
      </Header>

      <Content>
        <DescriptionSection>
          <DescriptionTitle>What is Iconography?</DescriptionTitle>
          <DescriptionText>
            The Iconography system provides consistent icon styling across your application. 
            It ensures all icons follow the same design principles regarding size, weight, 
            positioning, and color treatment.
          </DescriptionText>
        </DescriptionSection>

        <CurrentStyleSection>
          <CurrentStyleTitle>Current Icon Style</CurrentStyleTitle>
          <CurrentStyleCard>
            <CurrentStylePreview>
              {getIcon('star')}
              <CurrentStyleLabel>Sample Icon</CurrentStyleLabel>
            </CurrentStylePreview>
            <CurrentStyleDetails>
              <StyleDetail label="Family" value={currentStyle.family} />
              <StyleDetail label="Weight" value={currentStyle.weight} />
              <StyleDetail label="Size" value={currentStyle.size} />
              <StyleDetail label="Color" value={currentStyle.colorTreatment} />
            </CurrentStyleDetails>
          </CurrentStyleCard>
        </CurrentStyleSection>

        <FeaturesSection>
          <FeaturesTitle>Key Features</FeaturesTitle>
          <FeatureList>
            <FeatureItem>
              <FeatureIcon>🎨</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Style Consistency</FeatureTitle>
                <FeatureDescription>
                  Maintain consistent icon styling across your app
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📏</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Size Management</FeatureTitle>
                <FeatureDescription>
                  Standardized icon sizes for different contexts
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>⚖️</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Weight Control</FeatureTitle>
                <FeatureDescription>
                  Adjust icon weight for visual hierarchy
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>🎭</FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Animation Support</FeatureTitle>
                <FeatureDescription>
                  Add subtle animations to interactive icons
                </FeatureDescription>
              </FeatureContent>
            </FeatureItem>
          </FeatureList>
        </FeaturesSection>

        <IconFamiliesSection>
          <IconFamiliesTitle>Icon Families</IconFamiliesTitle>
          <IconFamiliesGrid>
            <IconFamilyCard family="SF Symbols" description="Apple's system icons" icon="★" />
            <IconFamilyCard family="Custom" description="Custom icon set" icon="★" />
            <IconFamilyCard family="Outlined" description="Clean outlined icons" icon="☆" />
            <IconFamilyCard family="Filled" description="Solid filled icons" icon="★" />
            <IconFamilyCard family="Rounded" description="Soft rounded corners" icon="●" />
            <IconFamilyCard family="Sharp" description="Sharp geometric shapes" icon="◆" />
          </IconFamiliesGrid>
        </IconFamiliesSection>

        <SampleIconsSection>
          <SampleIconsTitle>Sample Icons</SampleIconsTitle>
          <SampleIconsGrid>
            {sampleIcons.map((iconName) => (
              <SampleIconCard key={iconName}>
                <SampleIcon>{getIcon(iconName)}</SampleIcon>
                <SampleIconName>{iconName}</SampleIconName>
              </SampleIconCard>
            ))}
          </SampleIconsGrid>
        </SampleIconsSection>

        <IconCategoriesSection>
          <IconCategoriesTitle>Icon Categories</IconCategoriesTitle>
          <IconCategoriesList>
            <IconCategoryItem category="Navigation" count={getIconsByCategory(IconCategory.NAVIGATION).length} />
            <IconCategoryItem category="Actions" count={getIconsByCategory(IconCategory.ACTIONS).length} />
            <IconCategoryItem category="Status" count={getIconsByCategory(IconCategory.STATUS).length} />
            <IconCategoryItem category="Media" count={getIconsByCategory(IconCategory.MEDIA).length} />
            <IconCategoryItem category="Communication" count={getIconsByCategory(IconCategory.COMMUNICATION).length} />
            <IconCategoryItem category="Commerce" count={getIconsByCategory(IconCategory.COMMERCE).length} />
            <IconCategoryItem category="Social" count={getIconsByCategory(IconCategory.SOCIAL).length} />
            <IconCategoryItem category="System" count={getIconsByCategory(IconCategory.SYSTEM).length} />
          </IconCategoriesList>
        </IconCategoriesSection>

        <ActionButtons>
          <PrimaryButton onPress={() => setShowIconographyCustomization(true)}>
            <PrimaryButtonText>Customize Iconography</PrimaryButtonText>
          </PrimaryButton>
        </ActionButtons>
      </Content>

      {/* Iconography Customization Modal */}
      <Modal
        visible={showIconographyCustomization}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <IconographyCustomizationView onClose={() => setShowIconographyCustomization(false)} />
        </SafeAreaView>
      </Modal>
    </Container>
  );
};

// MARK: - Supporting Components

const IconFamilyCard: React.FC<{
  family: string;
  description: string;
  icon: string;
}> = ({ family, description, icon }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <IconFamilyCardContainer>
      <IconFamilyIcon>{icon}</IconFamilyIcon>
      <IconFamilyTitle>{family}</IconFamilyTitle>
      <IconFamilyDescription>{description}</IconFamilyDescription>
    </IconFamilyCardContainer>
  );
};

const IconCategoryItem: React.FC<{
  category: string;
  count: number;
}> = ({ category, count }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <IconCategoryItemContainer>
      <IconCategoryContent>
        <IconCategoryName>{category}</IconCategoryName>
        <IconCategoryCount>{count} icons</IconCategoryCount>
      </IconCategoryContent>
      <IconCategoryArrow>›</IconCategoryArrow>
    </IconCategoryItemContainer>
  );
};

const StyleDetail: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <StyleDetailContainer>
      <StyleDetailLabel>{label}</StyleDetailLabel>
      <StyleDetailValue>{value}</StyleDetailValue>
    </StyleDetailContainer>
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

const CurrentStyleSection = styled.View`
  margin-bottom: 32px;
`;

const CurrentStyleTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const CurrentStyleCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const CurrentStylePreview = styled.View`
  align-items: center;
  margin-right: 20px;
`;

const CurrentStyleLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-top: 8px;
`;

const CurrentStyleDetails = styled.View`
  flex: 1;
`;

const StyleDetailContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StyleDetailLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const StyleDetailValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textPrimary};
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

const IconFamiliesSection = styled.View`
  margin-bottom: 32px;
`;

const IconFamiliesTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const IconFamiliesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const IconFamilyCardContainer = styled.View`
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

const IconFamilyIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
`;

const IconFamilyTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
  text-align: center;
`;

const IconFamilyDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  line-height: 16px;
`;

const SampleIconsSection = styled.View`
  margin-bottom: 32px;
`;

const SampleIconsTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const SampleIconsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const SampleIconCard = styled.View`
  width: calc(25% - 9px);
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

const SampleIcon = styled.View`
  margin-bottom: 8px;
`;

const SampleIconName = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

const IconCategoriesSection = styled.View`
  margin-bottom: 32px;
`;

const IconCategoriesTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 16px;
`;

const IconCategoriesList = styled.View`
  gap: 8px;
`;

const IconCategoryItemContainer = styled.View`
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

const IconCategoryContent = styled.View`
  flex: 1;
`;

const IconCategoryName = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`;

const IconCategoryCount = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const IconCategoryArrow = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textTertiary};
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

// MARK: - Styles

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
});

export default IconographyExample; 