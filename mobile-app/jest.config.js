module.exports = {
  preset: 'jest-expo',
  // The preset should handle the transform, so I am removing the explicit one
  // to see if it resolves the preset loading issue.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  testEnvironment: 'jsdom',
};
