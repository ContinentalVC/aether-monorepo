import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { EnhancedThemeProvider } from './src/theme/EnhancedThemeProvider';
import { IconographyProvider } from './src/components/IconographyManager';
import ThemeDataModelProvider from './src/theme/ThemeDataModelManager';
import ThemeCustomizationExample from './src/components/ThemeCustomizationExample';
import LayoutPreviewExample from './src/components/LayoutPreviewExample';
import IconographyExample from './src/components/IconographyExample';
import ColorPaletteExample from './src/components/ColorPaletteExample';
import ProgressLineChartExample from './src/components/ProgressLineChartExample';
import ThemeDataModelExample from './src/components/ThemeDataModelExample';
import { ThemeSchemaProvider } from './src/theme/ThemeSchemaManager';
import ThemeSchemaExample from './src/components/ThemeSchemaExample';
import ThemeSchemaImportExportExample from './src/components/ThemeSchemaImportExportExample';
import { AdvancedThemeArchitectureExample } from './src/components/AdvancedThemeArchitectureExample';
import { RecursiveResolutionExample } from './src/components/RecursiveResolutionExample';
import { ThemeTransitionExample } from './src/components/ThemeTransitionExample';
import CustomViewTransitionsExample from './src/components/CustomViewTransitionsExample';
import DynamicColorSchemeExample from './src/components/DynamicColorSchemeExample';
import ThemeValidationExample from './src/components/ThemeValidationExample';
import AccessibilityValidationExample from './src/components/AccessibilityValidationExample';
import EnhancedThemeCustomizationScreen from './src/components/EnhancedThemeCustomizationScreen';
import AccessibilityTestingView from './src/components/AccessibilityFoundation';
import DataArchitectureTestingView from './src/components/DataArchitecture';
import UserInteractionTestingView from './src/components/UserInteraction';
import FormTestingExample from './src/components/FormTestingExample';

const Tab = createBottomTabNavigator();

/**
 * Main App Component
 * 
 * This component demonstrates the enhanced theme and iconography integration with:
 * - EnhancedThemeProvider wrapping the entire application
 * - IconographyProvider for consistent icon management
 * - Tab navigation to different examples
 * - Automatic theme switching and dark mode support
 */
export default function App() {
  return (
    <EnhancedThemeProvider initialTheme="light">
      <IconographyProvider>
        <ThemeDataModelProvider>
          <ThemeSchemaProvider>
            <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Theme') {
                    iconName = '🎨';
                  } else if (route.name === 'Layout') {
                    iconName = '📐';
                  } else if (route.name === 'Icons') {
                    iconName = '⭐';
                  } else if (route.name === 'Colors') {
                    iconName = '🎨';
                  } else if (route.name === 'Charts') {
                    iconName = '📊';
                  } else if (route.name === 'Data Model') {
                    iconName = '📄';
                  } else if (route.name === 'Schema') {
                    iconName = '📋';
                  } else if (route.name === 'Import/Export') {
                    iconName = '📤';
                  } else if (route.name === 'Advanced') {
                    iconName = '🧩';
                  } else if (route.name === 'Recursive') {
                    iconName = '🔄';
                  } else if (route.name === 'Transitions') {
                    iconName = '🔄';
                  } else if (route.name === 'Custom Transitions') {
                    iconName = '📚';
                  } else if (route.name === 'Dynamic Colors') {
                    iconName = '🎨';
                  } else if (route.name === 'Validation') {
                    iconName = '✅';
                  } else if (route.name === 'WCAG') {
                    iconName = '👁️';
                  } else if (route.name === 'Accessibility') {
                    iconName = '♿';
                  } else if (route.name === 'Data Architecture') {
                    iconName = '🗄️';
                  } else if (route.name === 'User Interaction') {
                    iconName = '👆';
                  } else if (route.name === 'Form Testing') {
                    iconName = '📝';
                  }

                  return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
                },
              })}
            >
              <Tab.Screen name="Layout" component={LayoutPreviewExample} />
              <Tab.Screen name="Theme" component={ThemeCustomizationExample} />
              <Tab.Screen name="Icons" component={IconographyExample} />
              <Tab.Screen name="Colors" component={ColorPaletteExample} />
              <Tab.Screen name="Charts" component={ProgressLineChartExample} />
              <Tab.Screen name="Data Model" component={ThemeDataModelExample} />
              <Tab.Screen name="Schema" component={ThemeSchemaExample} />
              <Tab.Screen name="Import/Export" component={ThemeSchemaImportExportExample} />
              <Tab.Screen name="Advanced" component={AdvancedThemeArchitectureExample} />
              <Tab.Screen name="Recursive" component={RecursiveResolutionExample} />
              <Tab.Screen name="Transitions" component={ThemeTransitionExample} />
              <Tab.Screen name="Custom Transitions" component={CustomViewTransitionsExample} />
              <Tab.Screen name="Dynamic Colors" component={DynamicColorSchemeExample} />
              <Tab.Screen name="Validation" component={ThemeValidationExample} />
              <Tab.Screen name="WCAG" component={AccessibilityValidationExample} />
              <Tab.Screen 
                name="EnhancedThemeCustomization" 
                component={EnhancedThemeCustomizationScreen}
                options={{ title: 'Enhanced Theme Customization' }}
              />
              <Tab.Screen name="Accessibility" component={AccessibilityTestingView} />
              <Tab.Screen name="Data Architecture" component={DataArchitectureTestingView} />
              <Tab.Screen name="User Interaction" component={UserInteractionTestingView} />
              <Tab.Screen name="Form Testing" component={FormTestingExample} />
            </Tab.Navigator>
          </NavigationContainer>
          </ThemeSchemaProvider>
        </ThemeDataModelProvider>
      </IconographyProvider>
    </EnhancedThemeProvider>
  );
} 