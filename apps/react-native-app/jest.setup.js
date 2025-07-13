const React = require('react');

// Mock React Native components
jest.mock('react-native', () => ({
  View: (props) => React.createElement('View', props, props.children),
  Text: (props) => React.createElement('Text', props, props.children),
  ScrollView: (props) => React.createElement('ScrollView', props, props.children),
  TouchableOpacity: (props) => React.createElement('TouchableOpacity', props, props.children),
  TouchableHighlight: (props) => React.createElement('TouchableHighlight', props, props.children),
  TouchableWithoutFeedback: (props) => React.createElement('TouchableWithoutFeedback', props, props.children),
  TextInput: (props) => React.createElement('TextInput', props),
  Image: (props) => React.createElement('Image', props),
  FlatList: (props) => React.createElement('FlatList', props),
  StyleSheet: {
    create: (styles) => styles,
    flatten: (styles) => styles,
  },
  ActivityIndicator: () => null,
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  LayoutAnimation: {
    create: jest.fn(() => ({})),
    Types: { easeInEaseOut: 'easeInEaseOut' },
    Properties: { opacity: 'opacity' },
    configureNext: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  UIManager: {
    measure: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
  Animated: {
    Value: jest.fn(() => ({ interpolate: jest.fn() })),
    timing: jest.fn(() => ({ start: jest.fn() })),
    spring: jest.fn(() => ({ start: jest.fn() })),
    createAnimatedComponent: jest.fn((component) => component),
  },
  StatusBar: {
    setBarStyle: jest.fn(),
    setHidden: jest.fn(),
  },
  Keyboard: {
    dismiss: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  Linking: {
    openURL: jest.fn(),
  },
  Share: {
    share: jest.fn(),
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {},
    RESULTS: {},
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => React.createElement('NavigationContainer', {}, children),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => ({ remove: jest.fn() })),
  }),
  useRoute: () => ({
    params: {},
    name: 'TestScreen',
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: () => true,
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => React.createElement('Navigator', {}, children),
    Screen: ({ children }) => React.createElement('Screen', {}, children),
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => React.createElement('Navigator', {}, children),
    Screen: ({ children }) => React.createElement('Screen', {}, children),
  }),
}));

// Mock styled-components for testing
jest.mock('styled-components/native', () => {
  const styled = require('styled-components/native');
  
  // Create a mock styled function that returns React components
  const createStyledComponent = (element) => {
    return (strings, ...interpolations) => {
      return React.forwardRef((props, ref) => {
        return React.createElement(element, { ...props, ref }, props.children);
      });
    };
  };
  
  // Mock the ThemeProvider
  const ThemeProvider = ({ children, theme }) => {
    return React.createElement('ThemeProvider', { theme }, children);
  };
  
  // Create mock styled components
  const mockStyled = {
    View: createStyledComponent('View'),
    Text: createStyledComponent('Text'),
    TouchableOpacity: createStyledComponent('TouchableOpacity'),
    ScrollView: createStyledComponent('ScrollView'),
    Image: createStyledComponent('Image'),
    FlatList: createStyledComponent('FlatList'),
    ThemeProvider,
    default: styled,
  };
  
  return mockStyled;
});

// Mock third-party libraries
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: (props) => React.createElement('Canvas', props, props.children),
  Circle: (props) => React.createElement('Circle', props),
  Path: (props) => React.createElement('Path', props),
  Group: (props) => React.createElement('Group', props, props.children),
  useValue: () => ({ current: 0 }),
  useDerivedValue: (fn) => fn(),
  useSharedValue: (initial) => ({ value: initial }),
  interpolate: (value, input, output) => output[0],
  Extrapolate: { CLAMP: 'clamp' },
  Skia: {
    Path: () => ({}),
  },
}));

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
  HapticTypes: {
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    impactHeavy: 'impactHeavy',
    notificationSuccess: 'notificationSuccess',
    notificationWarning: 'notificationWarning',
    notificationError: 'notificationError',
  },
}));

jest.mock('react-native-view-shot', () => ({
  default: (props) => React.createElement('ViewShot', props, props.children),
}));

jest.mock('react-native-gifted-charts', () => ({
  PieChart: (props) => React.createElement('PieChart', props),
  LineChart: (props) => React.createElement('LineChart', props),
  BarChart: (props) => React.createElement('BarChart', props),
  AreaChart: (props) => React.createElement('AreaChart', props),
}));

jest.mock('react-native-reanimated', () => ({
  View: (props) => React.createElement('View', props, props.children),
  Text: (props) => React.createElement('Text', props, props.children),
  Image: (props) => React.createElement('Image', props),
  ScrollView: (props) => React.createElement('ScrollView', props, props.children),
  createAnimatedComponent: jest.fn((component) => component),
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: (style) => style,
  useAnimatedProps: (props) => props,
  withSpring: (value) => value,
  withTiming: (value) => value,
  withRepeat: (value) => value,
  withSequence: (...values) => values[0],
  withDelay: (delay, value) => value,
  interpolate: (value, input, output) => output[0],
  Extrapolate: { CLAMP: 'clamp' },
  runOnJS: (fn) => fn,
}));

jest.mock('react-native-gesture-handler', () => ({
  View: (props) => React.createElement('View', props, props.children),
  Text: (props) => React.createElement('Text', props, props.children),
  TouchableOpacity: (props) => React.createElement('TouchableOpacity', props, props.children),
  ScrollView: (props) => React.createElement('ScrollView', props, props.children),
  createNativeWrapper: jest.fn((component) => component),
  GestureHandlerRootView: ({ children }) => React.createElement('GestureHandlerRootView', {}, children),
  PanGestureHandler: ({ children }) => React.createElement('PanGestureHandler', {}, children),
  TapGestureHandler: ({ children }) => React.createElement('TapGestureHandler', {}, children),
  LongPressGestureHandler: ({ children }) => React.createElement('LongPressGestureHandler', {}, children),
  State: {},
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => React.createElement('SafeAreaProvider', {}, children),
  SafeAreaView: ({ children }) => React.createElement('SafeAreaView', {}, children),
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 667 }),
}));

jest.mock('react-native-screens', () => ({
  Screen: ({ children }) => React.createElement('Screen', {}, children),
  ScreenContainer: ({ children }) => React.createElement('ScreenContainer', {}, children),
  enableScreens: jest.fn(),
}));

jest.mock('react-native-svg', () => ({
  Svg: (props) => React.createElement('Svg', props, props.children),
  Circle: (props) => React.createElement('Circle', props),
  Rect: (props) => React.createElement('Rect', props),
  Path: (props) => React.createElement('Path', props),
  Line: (props) => React.createElement('Line', props),
  Polygon: (props) => React.createElement('Polygon', props),
  Polyline: (props) => React.createElement('Polyline', props),
  Defs: (props) => React.createElement('Defs', props, props.children),
  LinearGradient: (props) => React.createElement('LinearGradient', props, props.children),
  RadialGradient: (props) => React.createElement('RadialGradient', props, props.children),
  Stop: (props) => React.createElement('Stop', props),
}));

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: (props) => React.createElement('LinearGradient', props, props.children),
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

// Mock @aether packages
jest.mock('@aether/core', () => ({
  ThemeValidator: class MockThemeValidator {
    async validateTheme(schema) {
      // Return errors if schema is obviously invalid (e.g., missing name)
      if (!schema?.metadata?.name) {
        return {
          errors: [{ message: 'Missing name' }],
          warnings: [],
          isValid: false,
        };
      }
      return {
        errors: [],
        warnings: [],
        isValid: true,
      };
    }
  },
  validateSchema: jest.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  createDefaultThemeSchema: jest.fn(() => ({})),
}));

jest.mock('@aether/react-native-utils', () => ({
  formatDateEnhanced: jest.fn((date) => '2024-01-01'),
  formatRelativeTimeEnhanced: jest.fn((date) => '2 days ago'),
  formatDateRange: jest.fn((start, end) => 'Jan 1 - Jan 31'),
  formatDurationEnhanced: jest.fn((duration) => '2 hours'),
  DATE_FORMATS: {},
  isValidDate: jest.fn(() => true),
  getCurrentTimezone: jest.fn(() => 'UTC'),
  convertToTimezone: jest.fn((date, timezone) => date),
  getStartOf: jest.fn((date, unit) => date),
  getEndOf: jest.fn((date, unit) => date),
  isDateBetween: jest.fn(() => true),
  getDateDifference: jest.fn(() => ({ days: 1, hours: 0, minutes: 0 })),
  isSupportedLocale: jest.fn(() => true),
  getDefaultLocale: jest.fn(() => 'en'),
  dayjs: jest.fn(() => ({
    format: jest.fn(() => '2024-01-01'),
    fromNow: jest.fn(() => '2 days ago'),
    toNow: jest.fn(() => 'in 2 days'),
  })),
}));

// Global test utilities
global.React = React;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 