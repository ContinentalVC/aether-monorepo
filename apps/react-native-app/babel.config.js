module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    // Handle React Native specific transformations
    'react-native-reanimated/plugin',
  ],
  env: {
    test: {
      plugins: [
        // Additional plugins for testing environment
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
  },
}; 