import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { useEnhancedTheme } from '../theme/EnhancedThemeProvider';
import styled from 'styled-components/native';

// MARK: - Types

type PreviewType = 'dashboard' | 'article' | 'profile' | 'settings' | 'card';

interface HierarchyItem {
  level: string;
  description: string;
  color: string;
}

interface SpacingItem {
  label: string;
  value: string;
  usage: string;
}

interface ContrastItem {
  label: string;
  ratio: number;
}

// MARK: - Layout Preview View

const LayoutPreviewView: React.FC = () => {
  const { theme } = useEnhancedTheme();
  const [selectedPreviewType, setSelectedPreviewType] = useState<PreviewType>('dashboard');
  const [showLayoutGuide, setShowLayoutGuide] = useState(false);

  const previewTypes: PreviewType[] = ['dashboard', 'article', 'profile', 'settings', 'card'];

  const renderPreviewContent = () => {
    switch (selectedPreviewType) {
      case 'dashboard':
        return <DashboardPreview />;
      case 'article':
        return <ArticlePreview />;
      case 'profile':
        return <ProfilePreview />;
      case 'settings':
        return <SettingsPreview />;
      case 'card':
        return <CardPreview />;
      default:
        return <DashboardPreview />;
    }
  };

  return (
    <Container>
      {/* Preview Type Selector */}
      <PreviewTypeSelector>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {previewTypes.map((type) => (
            <PreviewTypeButton
              key={type}
              isSelected={selectedPreviewType === type}
              onPress={() => setSelectedPreviewType(type)}
            >
              <PreviewTypeText isSelected={selectedPreviewType === type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </PreviewTypeText>
            </PreviewTypeButton>
          ))}
        </ScrollView>
      </PreviewTypeSelector>

      {/* Main Preview Area */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Layout Preview Canvas */}
          <PreviewSection>
            <SectionTitle>Live Preview</SectionTitle>
            <PreviewCanvas>
              {renderPreviewContent()}
            </PreviewCanvas>
          </PreviewSection>

          {/* Hierarchy Analysis */}
          <PreviewSection>
            <SectionTitle>Visual Hierarchy Analysis</SectionTitle>
            <HierarchyAnalysis />
          </PreviewSection>

          {/* Spacing Analysis */}
          <PreviewSection>
            <SectionTitle>Spacing Analysis</SectionTitle>
            <SpacingAnalysis />
          </PreviewSection>

          {/* Contrast Analysis */}
          <PreviewSection>
            <SectionTitle>Contrast Analysis</SectionTitle>
            <ContrastAnalysis />
          </PreviewSection>
        </View>
      </ScrollView>

      {/* Guide Button */}
      <GuideButton onPress={() => setShowLayoutGuide(true)}>
        <Text style={styles.guideButtonText}>Guide</Text>
      </GuideButton>
    </Container>
  );
};

// MARK: - Preview Components

const DashboardPreview: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <DashboardContainer>
      {/* Header */}
      <DashboardHeader>
        <View>
          <DashboardTitle>Dashboard</DashboardTitle>
          <DashboardSubtitle>Welcome back, User</DashboardSubtitle>
        </View>
        <Avatar />
      </DashboardHeader>

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard title="Total Views" value="1,234" color={theme.primary} />
        <StatCard title="Engagement" value="89%" color={theme.secondary} />
        <StatCard title="Growth" value="+12%" color={theme.success} />
        <StatCard title="Active Users" value="567" color={theme.info} />
      </StatsGrid>

      {/* Recent Activity */}
      <ActivitySection>
        <ActivityTitle>Recent Activity</ActivityTitle>
        {[1, 2, 3].map((index) => (
          <ActivityRow
            key={index}
            title={`Activity ${index}`}
            subtitle={`Description for activity ${index}`}
            time={`${index}h ago`}
          />
        ))}
      </ActivitySection>
    </DashboardContainer>
  );
};

const ArticlePreview: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <ArticleContainer>
      {/* Article Header */}
      <ArticleHeader>
        <ArticleTitle numberOfLines={2}>
          Design Principles for Modern Interfaces
        </ArticleTitle>
        <ArticleMeta>
          <ArticleAuthor>By John Doe</ArticleAuthor>
          <ArticleReadTime>5 min read</ArticleReadTime>
        </ArticleMeta>
      </ArticleHeader>

      {/* Article Content */}
      <ArticleContent>
        <ArticleParagraph numberOfLines={3}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ArticleParagraph>
        <ArticleParagraph numberOfLines={3}>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </ArticleParagraph>
      </ArticleContent>

      {/* Tags */}
      <TagsContainer>
        {['Design', 'UI/UX', 'Typography'].map((tag) => (
          <Tag key={tag}>
            <TagText>{tag}</TagText>
          </Tag>
        ))}
      </TagsContainer>
    </ArticleContainer>
  );
};

const ProfilePreview: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <ProfileContainer>
      {/* Profile Header */}
      <ProfileHeader>
        <ProfileAvatar />
        <ProfileInfo>
          <ProfileName>Jane Smith</ProfileName>
          <ProfileTitle>Product Designer</ProfileTitle>
        </ProfileInfo>
      </ProfileHeader>

      {/* Stats */}
      <ProfileStats>
        <StatItem title="Projects" value="24" />
        <StatItem title="Followers" value="1.2k" />
        <StatItem title="Following" value="890" />
      </ProfileStats>

      {/* Bio */}
      <ProfileBio numberOfLines={3}>
        Passionate about creating beautiful and functional user experiences. Always learning and exploring new design trends.
      </ProfileBio>

      {/* Action Buttons */}
      <ProfileActions>
        <PrimaryButton>
          <PrimaryButtonText>Follow</PrimaryButtonText>
        </PrimaryButton>
        <SecondaryButton>
          <SecondaryButtonText>Message</SecondaryButtonText>
        </SecondaryButton>
      </ProfileActions>
    </ProfileContainer>
  );
};

const SettingsPreview: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <SettingsContainer>
      <SettingsTitle>Settings</SettingsTitle>
      <SettingsList>
        <SettingsRow title="Notifications" subtitle="Manage your notifications" icon="🔔" />
        <SettingsRow title="Privacy" subtitle="Control your privacy settings" icon="🔒" />
        <SettingsRow title="Appearance" subtitle="Customize your theme" icon="🎨" />
        <SettingsRow title="Language" subtitle="English (US)" icon="🌐" />
      </SettingsList>
    </SettingsContainer>
  );
};

const CardPreview: React.FC = () => {
  const { theme } = useEnhancedTheme();

  return (
    <CardContainer>
      {/* Card Image */}
      <CardImage>
        <CardImagePlaceholder>📷</CardImagePlaceholder>
      </CardImage>

      {/* Card Content */}
      <CardContent>
        <CardTitle>Card Title</CardTitle>
        <CardDescription numberOfLines={2}>
          This is a sample card that demonstrates how your theme affects the visual hierarchy and spacing of content elements.
        </CardDescription>
        <CardAction>
          <CardActionText>Read More</CardActionText>
          <CardActionIcon>→</CardActionIcon>
        </CardAction>
      </CardContent>
    </CardContainer>
  );
};

// MARK: - Analysis Components

const HierarchyAnalysis: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const hierarchyItems: HierarchyItem[] = [
    {
      level: 'Primary',
      description: 'Main headings and key elements',
      color: theme.primary
    },
    {
      level: 'Secondary',
      description: 'Subheadings and supporting text',
      color: theme.textSecondary
    },
    {
      level: 'Tertiary',
      description: 'Muted text and subtle elements',
      color: theme.textTertiary
    }
  ];

  return (
    <AnalysisContainer>
      {hierarchyItems.map((item) => (
        <HierarchyItemRow key={item.level}>
          <HierarchyDot color={item.color} />
          <HierarchyLevel>{item.level}</HierarchyLevel>
          <HierarchyDescription>{item.description}</HierarchyDescription>
        </HierarchyItemRow>
      ))}
    </AnalysisContainer>
  );
};

const SpacingAnalysis: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const spacingItems: SpacingItem[] = [
    { label: 'XS', value: '4pt', usage: 'Tight spacing' },
    { label: 'SM', value: '8pt', usage: 'Component spacing' },
    { label: 'MD', value: '16pt', usage: 'Section spacing' },
    { label: 'LG', value: '24pt', usage: 'Major sections' },
    { label: 'XL', value: '32pt', usage: 'Page margins' }
  ];

  return (
    <AnalysisContainer>
      {spacingItems.map((item) => (
        <SpacingItemRow key={item.label}>
          <SpacingLabel>{item.label}</SpacingLabel>
          <SpacingValue>{item.value}</SpacingValue>
          <SpacingUsage>{item.usage}</SpacingUsage>
        </SpacingItemRow>
      ))}
    </AnalysisContainer>
  );
};

const ContrastAnalysis: React.FC = () => {
  const { theme } = useEnhancedTheme();

  const contrastItems: ContrastItem[] = [
    { label: 'Primary Text', ratio: 4.5 },
    { label: 'Secondary Text', ratio: 3.2 },
    { label: 'Primary Button', ratio: 5.1 }
  ];

  return (
    <AnalysisContainer>
      {contrastItems.map((item) => (
        <ContrastItemRow key={item.label}>
          <ContrastLabel>{item.label}</ContrastLabel>
          <ContrastRatio isGood={item.ratio >= 4.5}>
            {item.ratio.toFixed(1)}:1
          </ContrastRatio>
        </ContrastItemRow>
      ))}
    </AnalysisContainer>
  );
};

// MARK: - Supporting Components

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({
  title,
  value,
  color
}) => {
  const { theme } = useEnhancedTheme();

  return (
    <StatCardContainer>
      <StatValue style={{ color }}>{value}</StatValue>
      <StatTitle>{title}</StatTitle>
    </StatCardContainer>
  );
};

const ActivityRow: React.FC<{ title: string; subtitle: string; time: string }> = ({
  title,
  subtitle,
  time
}) => {
  const { theme } = useEnhancedTheme();

  return (
    <ActivityRowContainer>
      <ActivityIcon />
      <ActivityContent>
        <ActivityRowTitle>{title}</ActivityRowTitle>
        <ActivityRowSubtitle>{subtitle}</ActivityRowSubtitle>
      </ActivityContent>
      <ActivityTime>{time}</ActivityTime>
    </ActivityRowContainer>
  );
};

const StatItem: React.FC<{ title: string; value: string }> = ({ title, value }) => {
  const { theme } = useEnhancedTheme();

  return (
    <StatItemContainer>
      <StatItemValue>{value}</StatItemValue>
      <StatItemTitle>{title}</StatItemTitle>
    </StatItemContainer>
  );
};

const SettingsRow: React.FC<{ title: string; subtitle: string; icon: string }> = ({
  title,
  subtitle,
  icon
}) => {
  const { theme } = useEnhancedTheme();

  return (
    <SettingsRowContainer>
      <SettingsIcon>{icon}</SettingsIcon>
      <SettingsContent>
        <SettingsRowTitle>{title}</SettingsRowTitle>
        <SettingsRowSubtitle>{subtitle}</SettingsRowSubtitle>
      </SettingsContent>
      <SettingsChevron>›</SettingsChevron>
    </SettingsRowContainer>
  );
};

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const PreviewTypeSelector = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
`;

const PreviewTypeButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 8px 16px;
  margin-right: 12px;
  border-radius: 20px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.primary : theme.backgroundTertiary};
`;

const PreviewTypeText = styled.Text<{ isSelected: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme, isSelected }) =>
    isSelected ? '#FFFFFF' : theme.textPrimary};
`;

const PreviewSection = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 12px;
`;

const PreviewCanvas = styled.View`
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 16px;
  shadow-color: ${({ theme }) => theme.shadow};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const AnalysisContainer = styled.View`
  padding: 16px;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 12px;
`;

// Dashboard Components
const DashboardContainer = styled.View`
  gap: 16px;
`;

const DashboardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DashboardTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const DashboardSubtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const Avatar = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary};
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

const StatCardContainer = styled.View`
  flex: 1;
  min-width: 140px;
  padding: 16px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 12px;
`;

const StatValue = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const StatTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ActivitySection = styled.View`
  gap: 12px;
`;

const ActivityTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const ActivityRowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const ActivityIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.primary}20;
  align-items: center;
  justify-content: center;
`;

const ActivityContent = styled.View`
  flex: 1;
`;

const ActivityRowTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
`;

const ActivityRowSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ActivityTime = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

// Article Components
const ArticleContainer = styled.View`
  gap: 16px;
`;

const ArticleHeader = styled.View`
  gap: 8px;
`;

const ArticleTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
`;

const ArticleMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ArticleAuthor = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ArticleReadTime = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ArticleContent = styled.View`
  gap: 12px;
`;

const ArticleParagraph = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  line-height: 24px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const Tag = styled.View`
  padding: 6px 12px;
  background-color: ${({ theme }) => theme.primary}20;
  border-radius: 16px;
`;

const TagText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
`;

// Profile Components
const ProfileContainer = styled.View`
  align-items: center;
  gap: 20px;
`;

const ProfileHeader = styled.View`
  align-items: center;
  gap: 16px;
`;

const ProfileAvatar = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.primary};
`;

const ProfileInfo = styled.View`
  align-items: center;
  gap: 4px;
`;

const ProfileName = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const ProfileTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProfileStats = styled.View`
  flex-direction: row;
  gap: 20px;
`;

const StatItemContainer = styled.View`
  align-items: center;
  gap: 4px;
`;

const StatItemValue = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const StatItemTitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProfileBio = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  line-height: 24px;
`;

const ProfileActions = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const PrimaryButton = styled.TouchableOpacity`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 8px;
`;

const PrimaryButtonText = styled.Text`
  font-size: 16px;
  color: #FFFFFF;
`;

const SecondaryButton = styled.TouchableOpacity`
  padding: 12px 24px;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 8px;
`;

const SecondaryButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

// Settings Components
const SettingsContainer = styled.View`
  gap: 16px;
`;

const SettingsTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const SettingsList = styled.View`
  gap: 12px;
`;

const SettingsRowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

const SettingsIcon = styled.Text`
  font-size: 16px;
  width: 24px;
`;

const SettingsContent = styled.View`
  flex: 1;
`;

const SettingsRowTitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textPrimary};
`;

const SettingsRowSubtitle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
`;

const SettingsChevron = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textTertiary};
`;

// Card Components
const CardContainer = styled.View`
  gap: 16px;
`;

const CardImage = styled.View`
  height: 120px;
  background-color: ${({ theme }) => theme.primary}20;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const CardImagePlaceholder = styled.Text`
  font-size: 32px;
  color: ${({ theme }) => theme.primary};
`;

const CardContent = styled.View`
  gap: 8px;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const CardDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 20px;
`;

const CardAction = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CardActionText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
`;

const CardActionIcon = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.primary};
`;

// Analysis Components
const HierarchyItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const HierarchyDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;

const HierarchyLevel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const HierarchyDescription = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  flex: 1;
`;

const SpacingItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const SpacingLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
  width: 30px;
`;

const SpacingValue = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  width: 40px;
`;

const SpacingUsage = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.textSecondary};
  flex: 1;
`;

const ContrastItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ContrastLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const ContrastRatio = styled.Text<{ isGood: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ isGood }) => (isGood ? '#10B981' : '#F59E0B')};
`;

const GuideButton = styled.TouchableOpacity`
  position: absolute;
  top: 60px;
  right: 20px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 20px;
`;

// MARK: - Styles

const styles = StyleSheet.create({
  content: {
    padding: 16
  },
  guideButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500'
  },
  scrollView: {
    flex: 1
  }
});

export default LayoutPreviewView;
