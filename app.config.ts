// Plugin customizado para remover enableBundleCompression (não suportado no RN 0.74+)
import withRemoveBundleCompression from './plugins/withRemoveBundleCompression'

const IS_DEV = process.env.EXPO_PUBLIC_APP_ENV !== 'production'

const ONE_SIGNAL_IOS_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID
const ONE_SIGNAL_ANDROID_APP_ID =
  process.env.EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_TITLE,
    slug: 'logbook-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'logbook-app',
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
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
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
      [
        'onesignal-expo-plugin',
        {
          mode: IS_DEV ? 'development' : 'production',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            // Expo SDK 53 usa Kotlin 2.0.x por padrão
            // Esta configuração garante que não seja usada versão antiga (1.9.24)
            kotlinVersion: '2.0.21',
          },
        },
      ],
      // Plugin para remover enableBundleCompression (não suportado no RN 0.74+)
      // IMPORTANTE: Deve ser o último plugin para garantir que remove a propriedade
      // mesmo se outros plugins a configurarem antes
      withRemoveBundleCompression,
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'af06cebf-1dc9-4161-bf46-f1f2625a0b95',
      },
      oneSignalAppId: {
        ios: ONE_SIGNAL_IOS_APP_ID,
        android: ONE_SIGNAL_ANDROID_APP_ID,
      },
    },
    owner: 'henrique92',
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
