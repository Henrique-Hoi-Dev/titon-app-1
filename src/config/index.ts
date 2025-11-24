import { z } from 'zod'
import './skia'
import { LogBox, Platform, StyleSheet } from 'react-native'

// Declaração de tipo para globalThis com propriedades do Expo
declare global {
  // eslint-disable-next-line no-var
  var __EXPO_DISABLE_LOGBOX: boolean | undefined
}

// Reduce noise from LogBox overlay on web dev; avoids state update warnings from overlay internals
LogBox.ignoreAllLogs(true)
if (Platform.OS === 'web') {
  try {
    globalThis.__EXPO_DISABLE_LOGBOX = true
    // Required by NativeWind v4 to allow programmatic color scheme toggling on web
    ;(
      StyleSheet as unknown as { setFlag: (k: string, v: string) => void }
    ).setFlag('darkMode', 'class')
  } catch {}
}

// TODO: Move schema and env loading to a dedicated config module with caching and memoization.
const envSchema = z
  .object({
    EXPO_PUBLIC_APP_NAME: z.string(),
    EXPO_PUBLIC_APP_TITLE: z.string(),
    EXPO_PUBLIC_APP_ENV: z.enum(['development', 'production']),
    EXPO_PUBLIC_APP_API_ENV: z.enum(['development', 'production']),
    EXPO_PUBLIC_APP_URL: z.string().url(),
    EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID: z.string().uuid(),
    EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID: z.string().uuid(),
  })
  .transform((data) => ({
    appName: data.EXPO_PUBLIC_APP_NAME,
    appTitle: data.EXPO_PUBLIC_APP_TITLE,
    env: data.EXPO_PUBLIC_APP_ENV,
    apiEnv: data.EXPO_PUBLIC_APP_API_ENV,
    rootUrl: data.EXPO_PUBLIC_APP_URL,
    apiUrl: data.EXPO_PUBLIC_APP_URL,
    oneSignalAppId: {
      ios: data.EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID,
      android: data.EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID,
    },
  }))

// Load from process.env with safe fallbacks to current defaults
const parsed = envSchema.parse({
  EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME,
  EXPO_PUBLIC_APP_TITLE: process.env.EXPO_PUBLIC_APP_TITLE,
  EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_APP_API_ENV: process.env.EXPO_PUBLIC_APP_API_ENV,
  EXPO_PUBLIC_APP_URL: process.env.EXPO_PUBLIC_APP_URL,
  EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID:
    process.env.EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID,
  EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID:
    process.env.EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID,
})

export default parsed
