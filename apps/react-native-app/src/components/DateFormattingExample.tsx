/**
 * Date Formatting Example Component
 * 
 * Demonstrates the enhanced date formatting capabilities using dayjs
 * for reliable and locale-aware formatting across different scenarios.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';

// Import enhanced date formatting functions
import {
  formatDateEnhanced,
  formatRelativeTimeEnhanced,
  formatDateRange,
  formatDurationEnhanced,
  DATE_FORMATS,
  isValidDate,
  getCurrentTimezone,
  convertToTimezone,
  getStartOf,
  getEndOf,
  isDateBetween,
  getDateDifference,
  isSupportedLocale,
  getDefaultLocale,
  dayjs
} from '@aether/react-native-utils';

// Styled components
const Container = styled.ScrollView`
  flex: 1;
  background-color: #f5f5f5;
  padding: 16px;
`;

const Section = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
`;

const ExampleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const ExampleLabel = styled.Text`
  font-size: 14px;
  color: #666;
  flex: 1;
`;

const ExampleValue = styled.Text`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: right;
  flex: 1;
`;

const LocaleButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${(props: { active: boolean }) => props.active ? '#007AFF' : '#f0f0f0'};
  padding: 8px 12px;
  border-radius: 6px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const LocaleButtonText = styled.Text<{ active: boolean }>`
  color: ${(props: { active: boolean }) => props.active ? 'white' : '#333'};
  font-size: 12px;
  font-weight: ${(props: { active: boolean }) => props.active ? '600' : '400'};
`;

const LocaleContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const TimezoneContainer = styled.View`
  margin-bottom: 16px;
`;

const TimezoneText = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
`;

const DateFormattingExample: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [selectedLocale, setSelectedLocale] = useState(getDefaultLocale());
  const [selectedTimezone, setSelectedTimezone] = useState(getCurrentTimezone());
  const [testDate, setTestDate] = useState(new Date('2024-01-15T14:30:00Z'));

  // Sample dates for demonstration
  const sampleDates = {
    today: currentDate,
    yesterday: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000),
    lastWeek: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
    lastMonth: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
    future: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
  };

  const supportedLocales = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN', 'ar-SA'];
  const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

  // Legacy formatting examples (for comparison)
  const legacyExamples = [
    {
      label: 'Legacy formatDate (default) - DEPRECATED',
      value: 'Use formatDateEnhanced with DATE_FORMATS.US_SHORT'
    },
    {
      label: 'Legacy formatDate (ISO) - DEPRECATED',
      value: 'Use formatDateEnhanced with DATE_FORMATS.ISO'
    },
    {
      label: 'Legacy formatDate (relative) - DEPRECATED',
      value: 'Use formatRelativeTimeEnhanced'
    },
    {
      label: 'Legacy formatTime - DEPRECATED',
      value: 'Use formatDateEnhanced with DATE_FORMATS.TIME_12'
    },
    {
      label: 'Legacy formatRelativeTime - DEPRECATED',
      value: 'Use formatRelativeTimeEnhanced'
    }
  ];

  // Enhanced formatting examples
  const getEnhancedExamples = () => [
    {
      label: 'Enhanced formatDate (US Full)',
      value: formatDateEnhanced(testDate, { 
        format: 'MMMM D, YYYY',
        locale: selectedLocale 
      })
    },
    {
      label: 'Enhanced formatDate (EU Short)',
      value: formatDateEnhanced(testDate, { 
        format: 'DD/MM/YYYY',
        locale: selectedLocale 
      })
    },
    {
      label: 'Enhanced formatDate (with time)',
      value: formatDateEnhanced(testDate, { 
        format: 'h:mm A',
        locale: selectedLocale 
      })
    },
    {
      label: 'Enhanced formatDate (ISO)',
      value: formatDateEnhanced(testDate, { 
        format: DATE_FORMATS.ISO,
        locale: selectedLocale 
      })
    },
    {
      label: 'Enhanced formatDate (relative)',
      value: formatDateEnhanced(testDate, { 
        format: DATE_FORMATS.RELATIVE,
        locale: selectedLocale 
      })
    },
    {
      label: 'Enhanced formatDate (calendar)',
      value: formatDateEnhanced(testDate, { 
        format: DATE_FORMATS.CALENDAR,
        locale: selectedLocale 
      })
    }
  ];

  // Relative time examples
  const getRelativeTimeExamples = () => [
    {
      label: 'Today',
      value: formatRelativeTimeEnhanced(sampleDates.today, { locale: selectedLocale })
    },
    {
      label: 'Yesterday',
      value: formatRelativeTimeEnhanced(sampleDates.yesterday, { locale: selectedLocale })
    },
    {
      label: 'Last week',
      value: formatRelativeTimeEnhanced(sampleDates.lastWeek, { locale: selectedLocale })
    },
    {
      label: 'Last month',
      value: formatRelativeTimeEnhanced(sampleDates.lastMonth, { locale: selectedLocale })
    },
    {
      label: 'Future date',
      value: formatRelativeTimeEnhanced(sampleDates.future, { 
        locale: selectedLocale,
        future: true 
      })
    }
  ];

  // Date range examples
  const getDateRangeExamples = () => [
    {
      label: 'Same day range',
      value: formatDateRange(
        new Date('2024-01-15T09:00:00Z'),
        new Date('2024-01-15T17:00:00Z'),
        { locale: selectedLocale, includeTime: true }
      )
    },
    {
      label: 'Same month range',
      value: formatDateRange(
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-01-15T00:00:00Z'),
        { locale: selectedLocale }
      )
    },
    {
      label: 'Different months range',
      value: formatDateRange(
        new Date('2024-01-01T00:00:00Z'),
        new Date('2024-06-15T00:00:00Z'),
        { locale: selectedLocale }
      )
    },
    {
      label: 'Different years range',
      value: formatDateRange(
        new Date('2023-01-01T00:00:00Z'),
        new Date('2024-01-15T00:00:00Z'),
        { locale: selectedLocale }
      )
    }
  ];

  // Duration examples
  const getDurationExamples = () => [
    {
      label: '1 hour 1 minute 1 second',
      value: formatDurationEnhanced(3661000, { locale: selectedLocale })
    },
    {
      label: 'Compact duration',
      value: formatDurationEnhanced(3661000, { 
        locale: selectedLocale,
        compact: true 
      })
    },
    {
      label: 'Custom units (hours, minutes)',
      value: formatDurationEnhanced(3661000, { 
        locale: selectedLocale,
        units: ['hours', 'minutes'] 
      })
    },
    {
      label: '1 year duration',
      value: formatDurationEnhanced(365 * 24 * 60 * 60 * 1000, { 
        locale: selectedLocale,
        units: ['years', 'days'] 
      })
    }
  ];

  // Utility examples
  const getUtilityExamples = () => [
    {
      label: 'Is valid date',
      value: isValidDate(testDate) ? 'Yes' : 'No'
    },
    {
      label: 'Current timezone',
      value: getCurrentTimezone()
    },
    {
      label: 'Start of day',
      value: getStartOf(testDate, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: 'End of day',
      value: getEndOf(testDate, 'day').format('YYYY-MM-DD HH:mm:ss')
    },
    {
      label: 'Is between dates',
      value: isDateBetween(
        testDate,
        new Date('2024-01-01'),
        new Date('2024-01-31')
      ) ? 'Yes' : 'No'
    },
    {
      label: 'Days difference',
      value: getDateDifference(
        new Date('2024-01-20'),
        new Date('2024-01-15'),
        'day'
      ).toString()
    }
  ];

  const handleLocaleChange = (locale: string) => {
    if (isSupportedLocale(locale)) {
      setSelectedLocale(locale);
    } else {
      Alert.alert('Unsupported Locale', `Locale ${locale} is not supported.`);
    }
  };

  const handleTimezoneChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Date Formatting with dayjs</SectionTitle>
        <Text style={styles.description}>
          Enhanced date formatting with locale support, timezone handling, and comprehensive validation.
        </Text>
      </Section>

      {/* Locale Selection */}
      <Section>
        <SectionTitle>Locale Selection</SectionTitle>
        <LocaleContainer>
          {supportedLocales.map(locale => (
            <LocaleButton
              key={locale}
              active={selectedLocale === locale}
              onPress={() => handleLocaleChange(locale)}
            >
              <LocaleButtonText active={selectedLocale === locale}>
                {locale}
              </LocaleButtonText>
            </LocaleButton>
          ))}
        </LocaleContainer>
        <Text style={styles.info}>
          Selected: {selectedLocale} | Default: {getDefaultLocale()}
        </Text>
      </Section>

      {/* Timezone Selection */}
      <Section>
        <SectionTitle>Timezone Selection</SectionTitle>
        <LocaleContainer>
          {timezones.map(timezone => (
            <LocaleButton
              key={timezone}
              active={selectedTimezone === timezone}
              onPress={() => handleTimezoneChange(timezone)}
            >
              <LocaleButtonText active={selectedTimezone === timezone}>
                {timezone.split('/').pop()}
              </LocaleButtonText>
            </LocaleButton>
          ))}
        </LocaleContainer>
        <Text style={styles.info}>
          Selected: {selectedTimezone} | Current: {getCurrentTimezone()}
        </Text>
      </Section>

      {/* Legacy Formatting */}
      <Section>
        <SectionTitle>Legacy Formatting (Backward Compatible)</SectionTitle>
        {legacyExamples.map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Enhanced Formatting */}
      <Section>
        <SectionTitle>Enhanced Formatting</SectionTitle>
        {getEnhancedExamples().map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Relative Time */}
      <Section>
        <SectionTitle>Relative Time Formatting</SectionTitle>
        {getRelativeTimeExamples().map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Date Ranges */}
      <Section>
        <SectionTitle>Date Range Formatting</SectionTitle>
        {getDateRangeExamples().map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Duration Formatting */}
      <Section>
        <SectionTitle>Duration Formatting</SectionTitle>
        {getDurationExamples().map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Utility Functions */}
      <Section>
        <SectionTitle>Utility Functions</SectionTitle>
        {getUtilityExamples().map((example, index) => (
          <ExampleRow key={index}>
            <ExampleLabel>{example.label}</ExampleLabel>
            <ExampleValue>{example.value}</ExampleValue>
          </ExampleRow>
        ))}
      </Section>

      {/* Timezone Examples */}
      <Section>
        <SectionTitle>Timezone Examples</SectionTitle>
        <ExampleRow>
          <ExampleLabel>Original date (UTC)</ExampleLabel>
          <ExampleValue>{testDate.toISOString()}</ExampleValue>
        </ExampleRow>
        <ExampleRow>
          <ExampleLabel>Converted to {selectedTimezone}</ExampleLabel>
          <ExampleValue>
            {convertToTimezone(testDate, selectedTimezone).format('YYYY-MM-DD HH:mm:ss Z')}
          </ExampleValue>
        </ExampleRow>
        <ExampleRow>
          <ExampleLabel>Formatted with timezone</ExampleLabel>
          <ExampleValue>
            {formatDateEnhanced(testDate, {
              format: 'h:mm A',
              timezone: selectedTimezone,
              includeTimezone: true,
              locale: selectedLocale
            })}
          </ExampleValue>
        </ExampleRow>
      </Section>

      {/* Error Handling */}
      <Section>
        <SectionTitle>Error Handling</SectionTitle>
        <ExampleRow>
          <ExampleLabel>Invalid date validation</ExampleLabel>
          <ExampleValue>{isValidDate('invalid-date') ? 'Valid' : 'Invalid'}</ExampleValue>
        </ExampleRow>
        <ExampleRow>
          <ExampleLabel>Invalid date formatting</ExampleLabel>
          <ExampleValue>{formatDateEnhanced('invalid-date')}</ExampleValue>
        </ExampleRow>
        <ExampleRow>
          <ExampleLabel>Unsupported locale</ExampleLabel>
          <ExampleValue>{isSupportedLocale('invalid-locale') ? 'Supported' : 'Not Supported'}</ExampleValue>
        </ExampleRow>
      </Section>

      {/* Performance Note */}
      <Section>
        <SectionTitle>Performance & Benefits</SectionTitle>
        <Text style={styles.benefits}>
          • Locale-aware formatting with 40+ supported locales{'\n'}
          • Timezone support with automatic detection{'\n'}
          • Comprehensive date validation and error handling{'\n'}
          • Relative time formatting with customizable thresholds{'\n'}
          • Date range formatting with intelligent formatting{'\n'}
          • Duration formatting with multiple unit options{'\n'}
          • Backward compatibility with existing code{'\n'}
          • Tree-shakable imports for optimal bundle size
        </Text>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  benefits: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default DateFormattingExample; 