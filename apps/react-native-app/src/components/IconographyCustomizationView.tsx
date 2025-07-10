import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useIconography } from './IconographyManager';
import { useEnhancedTheme } from '../theme/EnhancedThemeProvider';
import styled from 'styled-components/native';

// MARK: - Iconography Customization View

const IconographyCustomizationView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme } = useEnhancedTheme();
  const {
    currentStyle,
    updateIconStyle,
    setIconFamily,
    setIconWeight,
    setIconSize,
    setIconColorTreatment,
    setIconPositioning,
    setIconAnimation,
    addCustomIcon,
    removeCustomIcon,
    mapIcon,
    getIcon,
    getIconsByCategory,
    searchIcons,
    availableFamilies,
    availableWeights,
    availableSizes,
    availableColorTreatments,
    availablePositionings,
    availableAnimations,
    availableCategories,
  } = useIconography();

  const [selectedTab, setSelectedTab] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(availableCategories[0]);

  const tabs = ['Style', 'Browse', 'Mapping', 'Preview'];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <IconStyleCustomizationView />;
      case 1:
        return <IconBrowserView />;
      case 2:
        return <IconMappingView />;
      case 3:
        return <IconPreviewView />;
      default:
        return <IconStyleCustomizationView />;
    }
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>Iconography</HeaderTitle>
        <CloseButton onPress={onClose}>
          <CloseButtonText>✕</CloseButtonText>
        </CloseButton>
      </Header>

      <TabSelector>
        {tabs.map((tab, index) => (
          <TabButton
            key={tab}
            isSelected={selectedTab === index}
            onPress={() => setSelectedTab(index)}
          >
            <TabButtonText isSelected={selectedTab === index}>{tab}</TabButtonText>
          </TabButton>
        ))}
      </TabSelector>

      <Content>
        {renderTabContent()}
      </Content>
    </Container>
  );
};

// MARK: - Icon Style Customization View

const IconStyleCustomizationView: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const {
    currentStyle,
    setIconFamily,
    setIconWeight,
    setIconSize,
    setIconColorTreatment,
    setIconPositioning,
    setIconAnimation,
    getIcon,
    availableFamilies,
    availableWeights,
    availableSizes,
    availableColorTreatments,
    availablePositionings,
    availableAnimations,
  } = useIconography();

  return (
    <ScrollView style={styles.scrollView}>
      <ContentContainer>
        {/* Current Style Preview */}
        <Section>
          <SectionTitle>Current Style Preview</SectionTitle>
          <PreviewCard>
            <PreviewIcon>{getIcon('star')}</PreviewIcon>
            <PreviewDetails>
              <DetailRow label="Family" value={currentStyle.family} />
              <DetailRow label="Weight" value={currentStyle.weight} />
              <DetailRow label="Size" value={currentStyle.size} />
              <DetailRow label="Color" value={currentStyle.colorTreatment} />
            </PreviewDetails>
          </PreviewCard>
        </Section>

        {/* Icon Family Selection */}
        <Section>
          <SectionTitle>Icon Family</SectionTitle>
          <FamilyGrid>
            {availableFamilies.map((family) => (
              <FamilyCard
                key={family}
                family={family}
                isSelected={currentStyle.family === family}
                onPress={() => setIconFamily(family)}
              />
            ))}
          </FamilyGrid>
        </Section>

        {/* Icon Weight Selection */}
        <Section>
          <SectionTitle>Icon Weight</SectionTitle>
          <WeightList>
            {availableWeights.map((weight) => (
              <WeightRow
                key={weight}
                weight={weight}
                isSelected={currentStyle.weight === weight}
                onPress={() => setIconWeight(weight)}
              />
            ))}
          </WeightList>
        </Section>

        {/* Icon Size Selection */}
        <Section>
          <SectionTitle>Icon Size</SectionTitle>
          <SizeList>
            {availableSizes.map((size) => (
              <SizeRow
                key={size}
                size={size}
                isSelected={currentStyle.size === size}
                onPress={() => setIconSize(size)}
              />
            ))}
          </SizeList>
        </Section>

        {/* Color Treatment Selection */}
        <Section>
          <SectionTitle>Color Treatment</SectionTitle>
          <ColorTreatmentGrid>
            {availableColorTreatments.map((treatment) => (
              <ColorTreatmentCard
                key={treatment}
                treatment={treatment}
                isSelected={currentStyle.colorTreatment === treatment}
                onPress={() => setIconColorTreatment(treatment)}
              />
            ))}
          </ColorTreatmentGrid>
        </Section>

        {/* Positioning Selection */}
        <Section>
          <SectionTitle>Positioning</SectionTitle>
          <PositioningList>
            {availablePositionings.map((positioning) => (
              <PositioningRow
                key={positioning}
                positioning={positioning}
                isSelected={currentStyle.positioning === positioning}
                onPress={() => setIconPositioning(positioning)}
              />
            ))}
          </PositioningList>
        </Section>

        {/* Animation Selection */}
        <Section>
          <SectionTitle>Animation</SectionTitle>
          <AnimationList>
            {availableAnimations.map((animation) => (
              <AnimationRow
                key={animation}
                animation={animation}
                isSelected={currentStyle.animation === animation}
                onPress={() => setIconAnimation(animation)}
              />
            ))}
          </AnimationList>
        </Section>
      </ContentContainer>
    </ScrollView>
  );
};

// MARK: - Icon Browser View

const IconBrowserView: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const {
    getIconsByCategory,
    searchIcons,
    availableCategories,
    getIcon,
  } = useIconography();

  const [selectedCategory, setSelectedCategory] = useState(availableCategories[0]);
  const [searchText, setSearchText] = useState('');

  const filteredIcons = searchText
    ? searchIcons(searchText)
    : getIconsByCategory(selectedCategory);

  return (
    <ScrollView style={styles.scrollView}>
      <ContentContainer>
        {/* Search Bar */}
        <SearchContainer>
          <SearchInput
            placeholder="Search icons..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </SearchContainer>

        {/* Category Selector */}
        <CategorySelector>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableCategories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </CategorySelector>

        {/* Icon Grid */}
        <IconGrid>
          {filteredIcons.map((icon) => (
            <IconGridItem key={icon.name} icon={icon} />
          ))}
        </IconGrid>
      </ContentContainer>
    </ScrollView>
  );
};

// MARK: - Icon Mapping View

const IconMappingView: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const { iconMappings, mapIcon } = useIconography();
  const [originalName, setOriginalName] = useState('');
  const [mappedName, setMappedName] = useState('');

  const handleAddMapping = () => {
    if (originalName && mappedName) {
      mapIcon(originalName, mappedName);
      setOriginalName('');
      setMappedName('');
      Alert.alert('Success', 'Icon mapping added successfully');
    } else {
      Alert.alert('Error', 'Please fill in both fields');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ContentContainer>
        <Section>
          <SectionTitle>Icon Mappings</SectionTitle>
          <DescriptionText>
            Map icon names to different icons for consistent usage across your app.
          </DescriptionText>
        </Section>

        {/* Add New Mapping */}
        <Section>
          <SectionTitle>Add New Mapping</SectionTitle>
          <MappingForm>
            <MappingInput
              placeholder="Original icon name"
              value={originalName}
              onChangeText={setOriginalName}
            />
            <MappingInput
              placeholder="Mapped icon name"
              value={mappedName}
              onChangeText={setMappedName}
            />
            <AddMappingButton onPress={handleAddMapping}>
              <AddMappingButtonText>Add Mapping</AddMappingButtonText>
            </AddMappingButton>
          </MappingForm>
        </Section>

        {/* Existing Mappings */}
        <Section>
          <SectionTitle>Existing Mappings</SectionTitle>
          {Object.keys(iconMappings).length === 0 ? (
            <EmptyStateText>No mappings defined</EmptyStateText>
          ) : (
            <MappingsList>
              {Object.entries(iconMappings).map(([original, mapped]) => (
                <MappingRow key={original} originalName={original} mappedName={mapped} />
              ))}
            </MappingsList>
          )}
        </Section>
      </ContentContainer>
    </ScrollView>
  );
};

// MARK: - Icon Preview View

const IconPreviewView: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const { getIcon, availableSizes, availableWeights } = useIconography();

  const sampleIcons = ['star', 'heart', 'gear', 'person', 'house', 'search'];

  return (
    <ScrollView style={styles.scrollView}>
      <ContentContainer>
        <Section>
          <SectionTitle>Icon Preview</SectionTitle>
        </Section>

        {/* Different Sizes */}
        <Section>
          <SectionTitle>Different Sizes</SectionTitle>
          <SizesPreview>
            {availableSizes.map((size) => (
              <SizePreviewItem key={size}>
                {getIcon('star', { size })}
                <SizePreviewLabel>{size}</SizePreviewLabel>
              </SizePreviewItem>
            ))}
          </SizesPreview>
        </Section>

        {/* Different Weights */}
        <Section>
          <SectionTitle>Different Weights</SectionTitle>
          <WeightsPreview>
            {availableWeights.map((weight) => (
              <WeightPreviewItem key={weight}>
                {getIcon('star', { weight })}
                <WeightPreviewLabel>{weight}</WeightPreviewLabel>
              </WeightPreviewItem>
            ))}
          </WeightsPreview>
        </Section>

        {/* Sample Icons */}
        <Section>
          <SectionTitle>Sample Icons</SectionTitle>
          <SampleIconsGrid>
            {sampleIcons.map((iconName) => (
              <SampleIconItem key={iconName}>
                {getIcon(iconName)}
                <SampleIconLabel>{iconName}</SampleIconLabel>
              </SampleIconItem>
            ))}
          </SampleIconsGrid>
        </Section>
      </ContentContainer>
    </ScrollView>
  );
};

// MARK: - Supporting Components

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <DetailRowContainer>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value}</DetailValue>
    </DetailRowContainer>
  );
};

const FamilyCard: React.FC<{
  family: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ family, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <FamilyCardContainer isSelected={isSelected} onPress={onPress}>
      <FamilyIcon>★</FamilyIcon>
      <FamilyTitle isSelected={isSelected}>{family}</FamilyTitle>
    </FamilyCardContainer>
  );
};

const WeightRow: React.FC<{
  weight: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ weight, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <WeightRowContainer isSelected={isSelected} onPress={onPress}>
      <WeightIcon>★</WeightIcon>
      <WeightContent>
        <WeightTitle>{weight}</WeightTitle>
        <WeightDescription>{getWeightDescription(weight)}</WeightDescription>
      </WeightContent>
      {isSelected && <WeightCheckmark>✓</WeightCheckmark>}
    </WeightRowContainer>
  );
};

const SizeRow: React.FC<{
  size: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ size, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <SizeRowContainer isSelected={isSelected} onPress={onPress}>
      <SizeIcon size={getIconSizeValue(size as any)}>★</SizeIcon>
      <SizeContent>
        <SizeTitle>{size}</SizeTitle>
        <SizeDescription>{getIconSizeDescription(size as any)}</SizeDescription>
      </SizeContent>
      {isSelected && <SizeCheckmark>✓</SizeCheckmark>}
    </SizeRowContainer>
  );
};

const ColorTreatmentCard: React.FC<{
  treatment: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ treatment, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <ColorTreatmentCardContainer isSelected={isSelected} onPress={onPress}>
      <ColorTreatmentIcon>★</ColorTreatmentIcon>
      <ColorTreatmentTitle isSelected={isSelected}>{treatment}</ColorTreatmentTitle>
      <ColorTreatmentDescription>{getIconColorTreatmentDescription(treatment as any)}</ColorTreatmentDescription>
    </ColorTreatmentCardContainer>
  );
};

const PositioningRow: React.FC<{
  positioning: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ positioning, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <PositioningRowContainer isSelected={isSelected} onPress={onPress}>
      <PositioningIcon>★</PositioningIcon>
      <PositioningContent>
        <PositioningTitle>{positioning}</PositioningTitle>
        <PositioningDescription>{getIconPositioningDescription(positioning as any)}</PositioningDescription>
      </PositioningContent>
      {isSelected && <PositioningCheckmark>✓</PositioningCheckmark>}
    </PositioningRowContainer>
  );
};

const AnimationRow: React.FC<{
  animation: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ animation, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <AnimationRowContainer isSelected={isSelected} onPress={onPress}>
      <AnimationIcon>★</AnimationIcon>
      <AnimationContent>
        <AnimationTitle>{animation}</AnimationTitle>
        <AnimationDescription>{getIconAnimationDescription(animation as any)}</AnimationDescription>
      </AnimationContent>
      {isSelected && <AnimationCheckmark>✓</AnimationCheckmark>}
    </AnimationRowContainer>
  );
};

const CategoryButton: React.FC<{
  category: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ category, isSelected, onPress }) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <CategoryButtonContainer isSelected={isSelected} onPress={onPress}>
      <CategoryButtonText isSelected={isSelected}>{category}</CategoryButtonText>
    </CategoryButtonContainer>
  );
};

const IconGridItem: React.FC<{ icon: any }> = ({ icon }) => {
  const { theme } = useEnhancedTheme();
  const { getIcon } = useIconography();
  
  return (
    <IconGridItemContainer>
      <IconGridIcon>{getIcon(icon.name)}</IconGridIcon>
      <IconGridLabel>{icon.name}</IconGridLabel>
    </IconGridItemContainer>
  );
};

const MappingRow: React.FC<{ originalName: string; mappedName: string }> = ({
  originalName,
  mappedName,
}) => {
  const { theme } = useEnhancedTheme();
  
  return (
    <MappingRowContainer>
      <MappingContent>
        <MappingOriginalName>{originalName}</MappingOriginalName>
        <MappingArrow>→ {mappedName}</MappingArrow>
      </MappingContent>
      <MappingRemoveButton>
        <MappingRemoveText>Remove</MappingRemoveText>
      </MappingRemoveButton>
    </MappingRowContainer>
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

const TabSelector = styled.View`
  flex-direction: row;
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const TabButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  align-items: center;
  padding: 8px;
`;

const TabButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.textSecondary};
`;

const Content = styled.View`
  flex: 1;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`;

const DescriptionText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 24px;
  text-align: center;
`;

const PreviewCard = styled.View`
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

const PreviewIcon = styled.View`
  margin-right: 16px;
`;

const PreviewDetails = styled.View`
  flex: 1;
`;

const DetailRowContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DetailLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const DetailValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textPrimary};
`;

const FamilyGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const FamilyCardContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: calc(50% - 6px);
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.border};
`;

const FamilyIcon = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const FamilyTitle = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  color: ${({ theme, isSelected }) =>
    isSelected ? '#FFFFFF' : theme.textPrimary};
  text-align: center;
`;

const WeightList = styled.View`
  gap: 8px;
`;

const WeightRowContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary + '20' : theme.surface};
  border-radius: 8px;
`;

const WeightIcon = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-right: 12px;
`;

const WeightContent = styled.View`
  flex: 1;
`;

const WeightTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`;

const WeightDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const WeightCheckmark = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const SizeList = styled.View`
  gap: 8px;
`;

const SizeRowContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary + '20' : theme.surface};
  border-radius: 8px;
`;

const SizeIcon = styled.Text<{ size: number }>`
  font-size: ${({ size }) => size}px;
  color: ${({ theme }) => theme.textPrimary};
  margin-right: 12px;
`;

const SizeContent = styled.View`
  flex: 1;
`;

const SizeTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`;

const SizeDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SizeCheckmark = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const ColorTreatmentGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const ColorTreatmentCardContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: calc(50% - 6px);
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary + '20' : theme.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.border};
`;

const ColorTreatmentIcon = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 8px;
`;

const ColorTreatmentTitle = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.textPrimary};
  text-align: center;
  margin-bottom: 4px;
`;

const ColorTreatmentDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  line-height: 16px;
`;

const PositioningList = styled.View`
  gap: 8px;
`;

const PositioningRowContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary + '20' : theme.surface};
  border-radius: 8px;
`;

const PositioningIcon = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-right: 12px;
`;

const PositioningContent = styled.View`
  flex: 1;
`;

const PositioningTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`;

const PositioningDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const PositioningCheckmark = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const AnimationList = styled.View`
  gap: 8px;
`;

const AnimationRowContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary + '20' : theme.surface};
  border-radius: 8px;
`;

const AnimationIcon = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-right: 12px;
`;

const AnimationContent = styled.View`
  flex: 1;
`;

const AnimationTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 2px;
`;

const AnimationDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const AnimationCheckmark = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const SearchContainer = styled.View`
  margin-bottom: 16px;
`;

const SearchInput = styled.TextInput`
  padding: 12px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
`;

const CategorySelector = styled.View`
  margin-bottom: 16px;
`;

const CategoryButtonContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 8px 16px;
  margin-right: 12px;
  border-radius: 20px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.surface};
  border: 1px solid ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.border};
`;

const CategoryButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  color: ${({ theme, isSelected }) =>
    isSelected ? '#FFFFFF' : theme.textPrimary};
`;

const IconGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const IconGridItemContainer = styled.View`
  width: calc(25% - 12px);
  align-items: center;
  padding: 8px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const IconGridIcon = styled.View`
  margin-bottom: 8px;
`;

const IconGridLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  line-height: 16px;
`;

const MappingForm = styled.View`
  gap: 8px;
`;

const MappingInput = styled.TextInput`
  padding: 12px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
`;

const AddMappingButton = styled.TouchableOpacity`
  padding: 12px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  align-items: center;
`;

const AddMappingButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
  padding: 20px;
`;

const MappingsList = styled.View`
  gap: 8px;
`;

const MappingRowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
`;

const MappingContent = styled.View`
  flex: 1;
`;

const MappingOriginalName = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
`;

const MappingArrow = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const MappingRemoveButton = styled.TouchableOpacity``;

const MappingRemoveText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.error};
`;

const SizesPreview = styled.View`
  flex-direction: row;
  gap: 20px;
`;

const SizePreviewItem = styled.View`
  align-items: center;
  gap: 4px;
`;

const SizePreviewLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const WeightsPreview = styled.View`
  flex-direction: row;
  gap: 20px;
`;

const WeightPreviewItem = styled.View`
  align-items: center;
  gap: 4px;
`;

const WeightPreviewLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SampleIconsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const SampleIconItem = styled.View`
  width: calc(33.33% - 11px);
  align-items: center;
  gap: 8px;
`;

const SampleIconLabel = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  text-align: center;
`;

// MARK: - Helper Functions

const getWeightDescription = (weight: string): string => {
  switch (weight) {
    case 'light': return 'Thin, delicate appearance';
    case 'regular': return 'Standard weight';
    case 'medium': return 'Slightly bolder';
    case 'semibold': return 'Bold and prominent';
    case 'bold': return 'Heavy weight';
    default: return 'Standard weight';
  }
};

const getIconSizeValue = (size: string): number => {
  switch (size) {
    case 'small': return 16;
    case 'medium': return 24;
    case 'large': return 32;
    case 'xlarge': return 48;
    default: return 24;
  }
};

const getIconSizeDescription = (size: string): string => {
  switch (size) {
    case 'small': return 'Compact, 16px';
    case 'medium': return 'Standard, 24px';
    case 'large': return 'Prominent, 32px';
    case 'xlarge': return 'Extra large, 48px';
    default: return 'Standard size';
  }
};

const getIconColorTreatmentDescription = (treatment: string): string => {
  switch (treatment) {
    case 'primary': return 'Uses primary theme color';
    case 'secondary': return 'Uses secondary theme color';
    case 'adaptive': return 'Adapts to context';
    case 'monochrome': return 'Single color treatment';
    default: return 'Standard color treatment';
  }
};

const getIconPositioningDescription = (positioning: string): string => {
  switch (positioning) {
    case 'center': return 'Centered alignment';
    case 'leading': return 'Left-aligned';
    case 'trailing': return 'Right-aligned';
    case 'top': return 'Top-aligned';
    case 'bottom': return 'Bottom-aligned';
    default: return 'Standard positioning';
  }
};

const getIconAnimationDescription = (animation: string): string => {
  switch (animation) {
    case 'none': return 'No animation';
    case 'fade': return 'Fade in/out';
    case 'scale': return 'Scale effect';
    case 'rotate': return 'Rotation effect';
    case 'bounce': return 'Bounce effect';
    default: return 'No animation';
  }
};

// MARK: - Styles

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default IconographyCustomizationView; 