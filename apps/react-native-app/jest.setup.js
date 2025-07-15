// Mock React Native polyfills before anything else
jest.mock('@react-native/js-polyfills/error-guard.js', () => ({}));
jest.mock('@react-native/js-polyfills', () => ({}));

// Mock React Native components
jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: (props) => React.createElement('View', props, props.children),
    Text: (props) => React.createElement('Text', props, props.children),
    ScrollView: (props) => React.createElement('ScrollView', props, props.children),
    TouchableOpacity: (props) => React.createElement('TouchableOpacity', props, props.children),
    TouchableHighlight: (props) => React.createElement('TouchableHighlight', props, props.children),
    TouchableWithoutFeedback: (props) => React.createElement('TouchableWithoutFeedback', props, props.children),
    TextInput: (props) => React.createElement('TextInput', props),
    Image: (props) => React.createElement('Image', props),
    FlatList: (props) => React.createElement('FlatList', props),
    ImageBackground: (props) => React.createElement('ImageBackground', props, props.children),
    Button: (props) => React.createElement('View', props, [
      React.createElement('Text', { key: 'title' }, props.title),
      props.children
    ]),
    Switch: (props) => React.createElement('Switch', props, props.children),
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
  };
});

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
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
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
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement('Navigator', {}, children),
      Screen: ({ children }) => React.createElement('Screen', {}, children),
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => React.createElement('Navigator', {}, children),
      Screen: ({ children }) => React.createElement('Screen', {}, children),
    }),
  };
});

// Mock styled-components for testing
jest.mock('styled-components/native', () => {
  const React = require('react');
  
  // Create a mock styled function that returns React components
  const createStyledComponent = (Component) => {
    // Create the base component
    const StyledComponent = React.forwardRef((props, ref) => {
      const { children, ...rest } = props || {};
      return React.createElement(Component, { ...rest, ref }, children);
    });
    
    // Make it callable as a tagged template: styled(Component)`css`
    const tagHandler = (...args) => StyledComponent;
    
    // Copy all static properties from the styled component
    Object.assign(tagHandler, StyledComponent);
    
    // Make the tag handler itself a valid React component
    tagHandler.displayName = StyledComponent.displayName;
    tagHandler.$$typeof = StyledComponent.$$typeof;
    tagHandler.render = StyledComponent.render;
    
    return tagHandler;
  };
  
  // Mock the ThemeProvider
  const ThemeProvider = ({ children, theme }) => {
    return React.createElement('ThemeProvider', { theme }, children);
  };
  
  // Create the main styled function
  const styled = (Component) => {
    return createStyledComponent(Component);
  };
  
  // Add built-in styled components
  styled.View = createStyledComponent('View');
  styled.Text = createStyledComponent('Text');
  styled.TouchableOpacity = createStyledComponent('TouchableOpacity');
  styled.ScrollView = createStyledComponent('ScrollView');
  styled.Image = createStyledComponent('Image');
  styled.FlatList = createStyledComponent('FlatList');
  styled.ImageBackground = createStyledComponent('ImageBackground');
  styled.ThemeProvider = ThemeProvider;
  
  return styled;
});

// Mock third-party libraries
jest.mock('@shopify/react-native-skia', () => {
  const React = require('react');
  return {
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
  };
});

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

jest.mock('react-native-view-shot', () => {
  const React = require('react');
  return {
    default: (props) => React.createElement('ViewShot', props, props.children),
  };
});

jest.mock('react-native-gifted-charts', () => {
  const React = require('react');
  return {
    PieChart: (props) => React.createElement('PieChart', props),
    LineChart: (props) => React.createElement('LineChart', props),
    BarChart: (props) => React.createElement('BarChart', props),
    AreaChart: (props) => React.createElement('AreaChart', props),
  };
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  return {
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
    Animated: {
      View: (props) => React.createElement('View', props, props.children),
      Text: (props) => React.createElement('Text', props, props.children),
      Image: (props) => React.createElement('Image', props),
      ScrollView: (props) => React.createElement('ScrollView', props, props.children),
      createAnimatedComponent: jest.fn((component) => component),
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  return {
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
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => React.createElement('SafeAreaProvider', {}, children),
    SafeAreaView: ({ children }) => React.createElement('SafeAreaView', {}, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 375, height: 667 }),
  };
});

jest.mock('react-native-screens', () => {
  const React = require('react');
  return {
    Screen: ({ children }) => React.createElement('Screen', {}, children),
    ScreenContainer: ({ children }) => React.createElement('ScreenContainer', {}, children),
    enableScreens: jest.fn(),
  };
});

jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
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
  };
});

// Mock Expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return {
    LinearGradient: (props) => React.createElement('LinearGradient', props, props.children),
  };
});

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
  pickAsync: jest.fn(),
}));

// Mock @react-native-community/blur
jest.mock('@react-native-community/blur', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    BlurView: ({ children, testID, ...props }) =>
      React.createElement('BlurView', { ...props, testID: testID || 'blur-view' }, children),
  };
});

// Mock @react-three/fiber and @react-three/drei
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => children,
  useFrame: jest.fn(),
  useThree: () => ({
    camera: {},
    scene: {},
    gl: {},
  }),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  useGLTF: () => ({}),
  Text: () => null,
  Html: () => null,
}));

// Mock three.js - fixed to avoid document reference
jest.mock('three', () => ({
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    domElement: {},
  })),
  BoxGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  Mesh: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
  Vector3: jest.fn(),
  Euler: jest.fn(),
}));

// Mock @aether/core
jest.mock('@aether/core', () => ({
  ThemeValidator: class MockThemeValidator {
    async validateTheme(schema) {
      return { isValid: true, errors: [] };
    }
  },
  createDefaultThemeSchema: jest.fn(() => ({})),
  validateSchema: jest.fn(() => ({ isValid: true, errors: [] })),
}));

// Global test setup
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}; 