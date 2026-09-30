module.exports = {
  preset: 'react-native',
  testTimeout: 20000,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/ios/',
    '<rootDir>/android/',
    '<rootDir>/src/__tests__/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo[^/]*|@expo[^/]*|@react-navigation|react-native-reanimated|react-native-gesture-handler|axios)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/**/__tests__/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
};