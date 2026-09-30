import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(() => (Component) => Component),
    Gesture: (() => {
      const chainable = () => {
        const gesture = {};
        ['onBegin', 'onStart', 'onUpdate', 'onEnd', 'onFinalize'].forEach((m) => {
          gesture[m] = jest.fn(() => gesture);
        });
        return gesture;
      };
      return {
        Tap: chainable,
        Pan: chainable,
        Pinch: chainable,
        Rotation: chainable,
        Simultaneous: jest.fn(() => ({})),
        Race: jest.fn(() => ({})),
      };
    })(),
    GestureDetector: View,
    GestureHandlerRootView: View,
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo modules
jest.mock('expo-sensors', () => ({
  Gyroscope: {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    setUpdateInterval: jest.fn(),
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Icon sets import .ttf font files that jest cannot parse; render nothing instead
jest.mock('@expo/vector-icons', () => {
  const Icon = () => null;
  return new Proxy({ __esModule: true }, { get: (target, key) => (key in target ? target[key] : Icon) });
});

// Mock axios
jest.mock('axios');

// Mock console.warn to avoid noise in tests
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));