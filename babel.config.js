module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        },
      ],
    ],
  };
};
