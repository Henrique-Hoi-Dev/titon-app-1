module.exports = {
  presets: [
    // 'module:metro-react-native-babel-preset',
    'babel-preset-expo',
  ],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
      },
      'module:react-native-dotenv',
    ],
  ],
};
