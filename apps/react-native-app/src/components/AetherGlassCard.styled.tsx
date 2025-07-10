import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../theme/ThemeProvider';

// MARK: - Styled Components

/// Styled container for the glass card with theme-based styling
export const GlassCardContainer = styled.View<{
  theme: Theme;
  variant?: 'default' | 'elevated' | 'subtle';
  size?: 'small' | 'medium' | 'large';
}>`
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.surfaceElevated;
      case 'subtle':
        return theme.surfaceGlass;
      default:
        return theme.surfaceGlass;
    }
  }};
  
  border: 1px solid ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.border;
      case 'subtle':
        return theme.borderLight;
      default:
        return theme.border;
    }
  }};
  
  border-radius: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.borderRadius.sm}px`;
      case 'large':
        return `${theme.borderRadius.xl}px`;
      default:
        return `${theme.borderRadius.lg}px`;
    }
  }};
  
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.sm}px`;
      case 'large':
        return `${theme.spacing.xl}px`;
      default:
        return `${theme.spacing.lg}px`;
    }
  }};
  
  margin: ${({ theme }) => `${theme.spacing.sm}px`};
  
  shadow-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.shadow;
      case 'subtle':
        return theme.shadowLight;
      default:
        return theme.shadow;
    }
  }};
  
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ variant }) => variant === 'elevated' ? 0.25 : 0.1};
  shadow-radius: 8px;
  
  elevation: ${({ variant }) => variant === 'elevated' ? 8 : 4};
  
  overflow: hidden;
`;

/// Styled overlay for additional visual effects
export const GlassOverlay = styled.View<{
  theme: Theme;
  variant?: 'default' | 'elevated' | 'subtle';
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.primaryLight;
      case 'subtle':
        return theme.secondaryLight;
      default:
        return theme.primary;
    }
  }};
  
  opacity: ${({ variant }) => {
    switch (variant) {
      case 'elevated':
        return 0.1;
      case 'subtle':
        return 0.05;
      default:
        return 0.08;
    }
  }};
  
  border-radius: inherit;
`;

/// Styled content container
export const ContentContainer = styled.View<{
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
}>`
  position: relative;
  z-index: 1;
  
  gap: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs}px`;
      case 'large':
        return `${theme.spacing.md}px`;
      default:
        return `${theme.spacing.sm}px`;
    }
  }};
`;

/// Styled title text with theme colors
export const TitleText = styled.Text<{
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'subtle';
}>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.textPrimary;
      case 'subtle':
        return theme.textSecondary;
      default:
        return theme.textPrimary;
    }
  }};
  
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.typography.fontSizes.sm}px`;
      case 'large':
        return `${theme.typography.fontSizes.xl}px`;
      default:
        return `${theme.typography.fontSizes.lg}px`;
    }
  }};
  
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  
  margin-bottom: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs}px`;
      case 'large':
        return `${theme.spacing.sm}px`;
      default:
        return `${theme.spacing.xs}px`;
    }
  }};
`;

/// Styled subtitle text with theme colors
export const SubtitleText = styled.Text<{
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'subtle';
}>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.textSecondary;
      case 'subtle':
        return theme.textTertiary;
      default:
        return theme.textSecondary;
    }
  }};
  
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.typography.fontSizes.xs}px`;
      case 'large':
        return `${theme.typography.fontSizes.md}px`;
      default:
        return `${theme.typography.fontSizes.sm}px`;
    }
  }};
  
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  
  line-height: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.typography.fontSizes.xs * 1.4}px`;
      case 'large':
        return `${theme.typography.fontSizes.md * 1.4}px`;
      default:
        return `${theme.typography.fontSizes.sm * 1.4}px`;
    }
  }};
`;

/// Styled description text with theme colors
export const DescriptionText = styled.Text<{
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'elevated' | 'subtle';
}>`
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'elevated':
        return theme.textSecondary;
      case 'subtle':
        return theme.textTertiary;
      default:
        return theme.textSecondary;
    }
  }};
  
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.typography.fontSizes.xs}px`;
      case 'large':
        return `${theme.typography.fontSizes.md}px`;
      default:
        return `${theme.typography.fontSizes.sm}px`;
    }
  }};
  
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  
  line-height: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.typography.fontSizes.xs * 1.5}px`;
      case 'large':
        return `${theme.typography.fontSizes.md * 1.5}px`;
      default:
        return `${theme.typography.fontSizes.sm * 1.5}px`;
    }
  }};
`;

/// Styled badge container
export const BadgeContainer = styled.View<{
  theme: Theme;
  variant?: 'default' | 'elevated' | 'subtle';
  badgeType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}>`
  background-color: ${({ theme, badgeType, variant }) => {
    if (badgeType) {
      switch (badgeType) {
        case 'primary':
          return theme.primary;
        case 'secondary':
          return theme.secondary;
        case 'success':
          return theme.success;
        case 'warning':
          return theme.warning;
        case 'error':
          return theme.error;
        case 'info':
          return theme.info;
        default:
          return theme.primary;
      }
    }
    
    switch (variant) {
      case 'elevated':
        return theme.primary;
      case 'subtle':
        return theme.secondary;
      default:
        return theme.primary;
    }
  }};
  
  padding-horizontal: ${({ theme }) => `${theme.spacing.sm}px`};
  padding-vertical: ${({ theme }) => `${theme.spacing.xs}px`};
  
  border-radius: ${({ theme }) => `${theme.borderRadius.sm}px`};
  
  align-self: flex-start;
`;

/// Styled badge text
export const BadgeText = styled.Text<{
  theme: Theme;
  badgeType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}>`
  color: white;
  font-size: ${({ theme }) => `${theme.typography.fontSizes.xs}px`};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/// Styled action button container
export const ActionContainer = styled.View<{
  theme: Theme;
  size?: 'small' | 'medium' | 'large';
}>`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  
  margin-top: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.sm}px`;
      case 'large':
        return `${theme.spacing.lg}px`;
      default:
        return `${theme.spacing.md}px`;
    }
  }};
  
  gap: ${({ theme }) => `${theme.spacing.sm}px`};
`;

/// Styled action button
export const ActionButton = styled.TouchableOpacity<{
  theme: Theme;
  variant?: 'default' | 'elevated' | 'subtle';
  buttonType?: 'primary' | 'secondary' | 'outline';
}>`
  background-color: ${({ theme, buttonType, variant }) => {
    if (buttonType === 'outline') {
      return 'transparent';
    }
    
    if (buttonType === 'secondary') {
      return theme.secondary;
    }
    
    switch (variant) {
      case 'elevated':
        return theme.primary;
      case 'subtle':
        return theme.secondary;
      default:
        return theme.primary;
    }
  }};
  
  border: ${({ theme, buttonType }) => 
    buttonType === 'outline' ? `1px solid ${theme.primary}` : 'none'
  };
  
  padding-horizontal: ${({ theme }) => `${theme.spacing.md}px`};
  padding-vertical: ${({ theme }) => `${theme.spacing.sm}px`};
  
  border-radius: ${({ theme }) => `${theme.borderRadius.md}px`};
  
  align-items: center;
  justify-content: center;
`;

/// Styled action button text
export const ActionButtonText = styled.Text<{
  theme: Theme;
  buttonType?: 'primary' | 'secondary' | 'outline';
}>`
  color: ${({ theme, buttonType }) => 
    buttonType === 'outline' ? theme.primary : 'white'
  };
  
  font-size: ${({ theme }) => `${theme.typography.fontSizes.sm}px`};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

// MARK: - Component Props

/// Props for the AetherGlassCard component
export interface AetherGlassCardProps {
  /// Title text to display
  title?: string;
  
  /// Subtitle text to display
  subtitle?: string;
  
  /// Description text to display
  description?: string;
  
  /// Badge text to display
  badge?: string;
  
  /// Type of badge styling
  badgeType?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  
  /// Actions to display as buttons
  actions?: Array<{
    label: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline';
  }>;
  
  /// Visual variant of the card
  variant?: 'default' | 'elevated' | 'subtle';
  
  /// Size of the card
  size?: 'small' | 'medium' | 'large';
  
  /// Custom style for the container
  style?: ViewStyle;
  
  /// Custom style for the content
  contentStyle?: ViewStyle;
  
  /// Whether to show the overlay effect
  showOverlay?: boolean;
  
  /// Custom children content
  children?: React.ReactNode;
  
  /// Callback when card is pressed
  onPress?: () => void;
}

// MARK: - Main Component

/// AetherGlassCard component with styled-components and theme integration
/// 
/// This component provides a glass-morphism card design with:
/// - Theme-based colors and styling
/// - Multiple visual variants (default, elevated, subtle)
/// - Different sizes (small, medium, large)
/// - Optional badge, actions, and custom content
/// - Responsive design based on theme spacing
export const AetherGlassCard: React.FC<AetherGlassCardProps> = ({
  title,
  subtitle,
  description,
  badge,
  badgeType = 'primary',
  actions,
  variant = 'default',
  size = 'medium',
  style,
  contentStyle,
  showOverlay = true,
  children,
  onPress,
}) => {
  return (
    <GlassCardContainer
      theme={{} as Theme} // This will be provided by styled-components
      variant={variant}
      size={size}
      style={style}
      onTouchEnd={onPress}
    >
      {showOverlay && (
        <GlassOverlay
          theme={{} as Theme}
          variant={variant}
        />
      )}
      
      <ContentContainer
        theme={{} as Theme}
        size={size}
        style={contentStyle}
      >
        {badge && (
          <BadgeContainer
            theme={{} as Theme}
            variant={variant}
            badgeType={badgeType}
          >
            <BadgeText
              theme={{} as Theme}
              badgeType={badgeType}
            >
              {badge}
            </BadgeText>
          </BadgeContainer>
        )}
        
        {title && (
          <TitleText
            theme={{} as Theme}
            size={size}
            variant={variant}
          >
            {title}
          </TitleText>
        )}
        
        {subtitle && (
          <SubtitleText
            theme={{} as Theme}
            size={size}
            variant={variant}
          >
            {subtitle}
          </SubtitleText>
        )}
        
        {description && (
          <DescriptionText
            theme={{} as Theme}
            size={size}
            variant={variant}
          >
            {description}
          </DescriptionText>
        )}
        
        {children}
        
        {actions && actions.length > 0 && (
          <ActionContainer
            theme={{} as Theme}
            size={size}
          >
            {actions.map((action, index) => (
              <ActionButton
                key={index}
                theme={{} as Theme}
                variant={variant}
                buttonType={action.type}
                onPress={action.onPress}
              >
                <ActionButtonText
                  theme={{} as Theme}
                  buttonType={action.type}
                >
                  {action.label}
                </ActionButtonText>
              </ActionButton>
            ))}
          </ActionContainer>
        )}
      </ContentContainer>
    </GlassCardContainer>
  );
};

// MARK: - Type Exports 