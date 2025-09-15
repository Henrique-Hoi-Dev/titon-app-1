const IS_DEV = process.env.EXPO_PUBLIC_APP_ENV !== 'production'

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_TITLE,
    slug: 'logbook',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'logbook',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#2b2b2c',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'br.com.logbook.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#2b2b2c',
      },
      package: 'br.com.logbook.app',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-sqlite',
      'expo-web-browser',
      [
        'onesignal-expo-plugin',
        {
          mode: IS_DEV ? 'development' : 'production',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '94aa1bba-c345-43a3-9939-67104de9fba0',
      },
    },
    owner: 'juliocavallari',
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
