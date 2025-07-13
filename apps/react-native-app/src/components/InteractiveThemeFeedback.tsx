/**
 * InteractiveThemeFeedback.tsx
 * 
 * Interactive user feedback system for theme creation with real-time accessibility validation.
 * Provides immediate, clear, and actionable feedback when users select inaccessible color combinations.
 * 
 * @author AI Assistant
 * @copyright 2025 Aether
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { AccessibilityValidator, ColorUtilities, WCAGLevel } from '../theme/AccessibilityValidator';
import styled from 'styled-components/native';
import { formatDateEnhanced, DATE_FORMATS } from '@aether/react-native-utils';

// MARK: - Types

interface FeedbackType {
  type: 'success' | 'warning' | 'error' | 'info';
  icon: string;
  color: string;
}

interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  title: string;
  message: string;
  suggestion?: string;
  timestamp: Date;
}

interface InteractiveFeedbackManagerProps {
  children: React.ReactNode;
}

// MARK: - Feedback Types

const FEEDBACK_TYPES: Record<string, FeedbackType> = {
  success: {
    type: 'success',
    icon: '✓',
    color: '#10B981',
  },
  warning: {
    type: 'warning',
    icon: '⚠',
    color: '#F59E0B',
  },
  error: {
    type: 'error',
    icon: '✗',
    color: '#EF4444',
  },
  info: {
    type: 'info',
    icon: 'ℹ',
    color: '#3B82F6',
  },
};

// MARK: - Styled Components

const Container = styled.View`
  flex: 1;
`;

const FeedbackContainer = styled.View`
  margin: 16px;
`;

const FeedbackCard = styled.View<{ type: string }>`
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: ${props => props.theme.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  border-left-width: 4px;
  border-left-color: ${props => props.type === 'success' ? '#10B981' : 
                        props.type === 'warning' ? '#F59E0B' : 
                        props.type === 'error' ? '#EF4444' : '#3B82F6'};
`;

const FeedbackHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const FeedbackIcon = styled.Text<{ color: string }>`
  font-size: 20px;
  color: ${props => props.color};
  margin-right: 12px;
`;

const FeedbackTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  flex: 1;
`;

const DismissButton = styled.TouchableOpacity`
  padding: 4px;
`;

const DismissIcon = styled.Text`
  font-size: 18px;
  color: ${props => props.theme.textSecondary};
`;

const FeedbackMessage = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textPrimary};
  line-height: 20px;
  margin-bottom: 8px;
`;

const SuggestionContainer = styled.View`
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
`;

const SuggestionTitle = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 4px;
`;

const SuggestionText = styled.Text`
  font-size: 13px;
  color: ${props => props.theme.textPrimary};
  line-height: 18px;
`;

const HistoryContainer = styled.View`
  margin-top: 16px;
`;

const HistoryHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const HistoryTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px 12px;
  background-color: ${props => props.theme.primary};
  border-radius: 6px;
`;

const ClearButtonText = styled.Text`
  font-size: 12px;
  color: white;
  font-weight: 500;
`;

const HistoryItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  margin-bottom: 8px;
`;

const HistoryIcon = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  margin-right: 12px;
`;

const HistoryContent = styled.View`
  flex: 1;
`;

const HistoryItemTitle = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 2px;
`;

const HistoryItemMessage = styled.Text`
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  line-height: 14px;
`;

const HistoryTime = styled.Text`
  font-size: 10px;
  color: ${props => props.theme.textTertiary};
  margin-left: 8px;
`;

// MARK: - Interactive Feedback Manager Hook

export const useInteractiveFeedback = () => {
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackMessage | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackMessage[]>([]);
  const [isValidationInProgress, setIsValidationInProgress] = useState(false);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateColorCombination = (
    foreground: string,
    background: string,
    elementType: string = 'text'
  ) => {
    setIsValidationInProgress(true);

    // Clear previous timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    // Debounce validation
    validationTimeoutRef.current = setTimeout(() => {
      performValidation(foreground, background, elementType);
    }, 500);
  };

  const performValidation = (
    foreground: string,
    background: string,
    elementType: string
  ) => {
    const contrastRatio = ColorUtilities.calculateContrastRatio(foreground, background);

    if (contrastRatio === null) {
      showFeedback(
        'error',
        'Invalid Color Format',
        'Unable to parse one or both colors. Please use valid hex, RGB, or named colors.',
        'Try using hex format like #FF0000 or named colors like "red"'
      );
      setIsValidationInProgress(false);
      return;
    }

    const requiredRatio = elementType.includes('large') ? 3.0 : 4.5;
    const passed = contrastRatio >= requiredRatio;

    if (passed) {
      showFeedback(
        'success',
        'Excellent Contrast!',
        `This color combination meets WCAG AA standards with a contrast ratio of ${contrastRatio.toFixed(2)}:1`,
        'This combination is accessible for most users'
      );
    } else {
      const severity = contrastRatio < 2.0 ? 'error' : 'warning';
      const title = severity === 'error' ? 'Critical Contrast Issue' : 'Low Contrast Warning';

      showFeedback(
        severity,
        title,
        `This combination has insufficient contrast (${contrastRatio.toFixed(2)}:1). WCAG AA requires ${requiredRatio.toFixed(1)}:1 for ${elementType}.`,
        generateContrastSuggestion(foreground, background, contrastRatio, requiredRatio)
      );
    }

    setIsValidationInProgress(false);
  };

  const generateContrastSuggestion = (
    foreground: string,
    background: string,
    currentRatio: number,
    requiredRatio: number
  ): string => {
    if (currentRatio < 2.0) {
      return 'Consider using a much darker or lighter color. Try black/white or high-contrast alternatives.';
    } else if (currentRatio < 3.0) {
      return 'Try adjusting the brightness or using a more contrasting color variant.';
    } else {
      return 'A small adjustment to either color should achieve the required contrast ratio.';
    }
  };

  const showFeedback = (
    type: string,
    title: string,
    message: string,
    suggestion?: string
  ) => {
    const feedback: FeedbackMessage = {
      id: Date.now().toString(),
      type: FEEDBACK_TYPES[type],
      title,
      message,
      suggestion,
      timestamp: new Date(),
    };

    setCurrentFeedback(feedback);
    setFeedbackHistory(prev => [...prev, feedback]);

    // Auto-dismiss success messages
    if (type === 'success') {
      setTimeout(() => {
        setCurrentFeedback(prev => prev?.id === feedback.id ? null : prev);
      }, 3000);
    }
  };

  const dismissCurrentFeedback = () => {
    setCurrentFeedback(null);
  };

  const clearHistory = () => {
    setFeedbackHistory([]);
  };

  return {
    currentFeedback,
    feedbackHistory,
    isValidationInProgress,
    validateColorCombination,
    dismissCurrentFeedback,
    clearHistory,
  };
};

// MARK: - Interactive Feedback View

export const InteractiveFeedbackView: React.FC<{ feedbackManager: ReturnType<typeof useInteractiveFeedback> }> = ({
  feedbackManager,
}) => {
  const { currentFeedback, feedbackHistory, dismissCurrentFeedback, clearHistory } = feedbackManager;

  return (
    <Container>
      <ScrollView>
        <FeedbackContainer>
          {/* Current feedback display */}
          {currentFeedback && (
            <FeedbackCard type={currentFeedback.type.type}>
              <FeedbackHeader>
                <FeedbackIcon color={currentFeedback.type.color}>
                  {currentFeedback.type.icon}
                </FeedbackIcon>
                <FeedbackTitle>{currentFeedback.title}</FeedbackTitle>
                <DismissButton onPress={dismissCurrentFeedback}>
                  <DismissIcon>✕</DismissIcon>
                </DismissButton>
              </FeedbackHeader>

              <FeedbackMessage>{currentFeedback.message}</FeedbackMessage>

              {currentFeedback.suggestion && (
                <SuggestionContainer>
                  <SuggestionTitle>Suggestion:</SuggestionTitle>
                  <SuggestionText>{currentFeedback.suggestion}</SuggestionText>
                </SuggestionContainer>
              )}
            </FeedbackCard>
          )}

          {/* Feedback history */}
          {feedbackHistory.length > 0 && (
            <HistoryContainer>
              <HistoryHeader>
                <HistoryTitle>Feedback History</HistoryTitle>
                <ClearButton onPress={clearHistory}>
                  <ClearButtonText>Clear</ClearButtonText>
                </ClearButton>
              </HistoryHeader>

              {feedbackHistory.slice(-5).map((feedback) => (
                <HistoryItem key={feedback.id}>
                  <HistoryIcon color={feedback.type.color}>
                    {feedback.type.icon}
                  </HistoryIcon>
                  <HistoryContent>
                    <HistoryItemTitle>{feedback.title}</HistoryItemTitle>
                    <HistoryItemMessage numberOfLines={2}>
                      {feedback.message}
                    </HistoryItemMessage>
                  </HistoryContent>
                  {feedback.timestamp && (
                    <HistoryTime>
                      {formatDateEnhanced(feedback.timestamp, { format: DATE_FORMATS.TIME_12 })}
                    </HistoryTime>
                  )}
                </HistoryItem>
              ))}
            </HistoryContainer>
          )}
        </FeedbackContainer>
      </ScrollView>
    </Container>
  );
};

// MARK: - Interactive Color Picker

interface InteractiveColorPickerProps {
  feedbackManager: ReturnType<typeof useInteractiveFeedback>;
  selectedColor: string;
  onColorChange: (color: string) => void;
  title: string;
  description: string;
  testBackground: string;
}

export const InteractiveColorPicker: React.FC<InteractiveColorPickerProps> = ({
  feedbackManager,
  selectedColor,
  onColorChange,
  title,
  description,
  testBackground,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState(selectedColor);
  const { isValidationInProgress } = feedbackManager;

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#C0C0C0',
    '#800000', '#808000', '#008000', '#800080', '#008080',
    '#000080', '#FFA500', '#FFC0CB', '#A52A2A', '#FFD700',
  ];

  useEffect(() => {
    feedbackManager.validateColorCombination(selectedColor, testBackground, title.toLowerCase());
  }, [selectedColor, testBackground]);

  const handleColorConfirm = () => {
    onColorChange(tempColor);
    setShowColorPicker(false);
  };

  const handleColorCancel = () => {
    setTempColor(selectedColor);
    setShowColorPicker(false);
  };

  return (
    <View style={styles.colorPickerContainer}>
      <View style={styles.colorPickerHeader}>
        <View style={styles.colorPickerInfo}>
          <Text style={styles.colorPickerTitle}>{title}</Text>
          <Text style={styles.colorPickerDescription}>{description}</Text>
        </View>

        <View style={styles.colorPreviewContainer}>
          <View
            style={[
              styles.colorPreview,
              { backgroundColor: selectedColor },
            ]}
          />
          {isValidationInProgress && (
            <ActivityIndicator size="small" style={styles.validationIndicator} />
          )}
        </View>
      </View>

      {/* Contrast preview */}
      <ContrastPreviewCard
        foreground={selectedColor}
        background={testBackground}
        title={title}
      />

      {/* Color picker button */}
      <TouchableOpacity
        style={styles.colorPickerButton}
        onPress={() => {
          setTempColor(selectedColor);
          setShowColorPicker(true);
        }}
      >
        <Text style={styles.colorPickerButtonText}>Choose Color</Text>
      </TouchableOpacity>

      {/* Color picker modal */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleColorCancel}>
              <Text style={styles.modalButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Color</Text>
            <TouchableOpacity onPress={handleColorConfirm}>
              <Text style={[styles.modalButton, styles.modalConfirmButton]}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Color preview */}
            <View
              style={[
                styles.modalColorPreview,
                { backgroundColor: tempColor },
              ]}
            />

            {/* Color input */}
            <View style={styles.colorInputContainer}>
              <Text style={styles.colorInputLabel}>Color Value</Text>
              <TextInput
                style={styles.colorInput}
                value={tempColor}
                onChangeText={setTempColor}
                placeholder="Enter hex, RGB, or named color"
                placeholderTextColor="#999"
              />
            </View>

            {/* Preset colors */}
            <View style={styles.presetContainer}>
              <Text style={styles.presetTitle}>Preset Colors</Text>
              <View style={styles.presetGrid}>
                {presetColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.presetColor,
                      { backgroundColor: color },
                      tempColor === color && styles.presetColorSelected,
                    ]}
                    onPress={() => setTempColor(color)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

// MARK: - Contrast Preview Card

interface ContrastPreviewCardProps {
  foreground: string;
  background: string;
  title: string;
}

const ContrastPreviewCard: React.FC<ContrastPreviewCardProps> = ({
  foreground,
  background,
  title,
}) => {
  const contrastRatio = ColorUtilities.calculateContrastRatio(foreground, background);
  const isGoodContrast = contrastRatio && contrastRatio >= 4.5;
  const isWarningContrast = contrastRatio && contrastRatio >= 3.0 && contrastRatio < 4.5;
  const isPoorContrast = contrastRatio && contrastRatio < 3.0;

  const getContrastColor = () => {
    if (isGoodContrast) return '#10B981';
    if (isWarningContrast) return '#F59E0B';
    if (isPoorContrast) return '#EF4444';
    return '#999';
  };

  return (
    <View style={styles.contrastPreviewContainer}>
      <Text style={styles.contrastPreviewLabel}>Preview</Text>
      <View style={styles.contrastPreviewContent}>
        <View
          style={[
            styles.contrastPreviewBox,
            { backgroundColor: background },
          ]}
        >
          <Text
            style={[
              styles.contrastPreviewText,
              { color: foreground },
            ]}
          >
            Sample {title}
          </Text>
        </View>

        {contrastRatio && (
          <View style={styles.contrastRatioContainer}>
            <Text style={[styles.contrastRatio, { color: getContrastColor() }]}>
              {contrastRatio.toFixed(2)}:1
            </Text>
            <Text style={styles.contrastRatioLabel}>Contrast</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// MARK: - Styles

const styles = StyleSheet.create({
  colorPickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  colorPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorPickerInfo: {
    flex: 1,
  },
  colorPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  colorPickerDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  colorPreviewContainer: {
    alignItems: 'center',
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  validationIndicator: {
    marginTop: 4,
  },
  colorPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  colorPickerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  contrastPreviewContainer: {
    marginBottom: 12,
  },
  contrastPreviewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  contrastPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contrastPreviewBox: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contrastPreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  contrastRatioContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  contrastRatio: {
    fontSize: 12,
    fontWeight: '600',
  },
  contrastRatioLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalButton: {
    fontSize: 16,
    color: '#64748b',
  },
  modalConfirmButton: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalColorPreview: {
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  colorInputContainer: {
    marginBottom: 20,
  },
  colorInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  colorInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  presetContainer: {
    marginBottom: 20,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetColor: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetColorSelected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
}); 