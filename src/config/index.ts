import { z } from 'zod'

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

export default envSchema.parse({
  EXPO_PUBLIC_APP_NAME: "logbook",
  EXPO_PUBLIC_APP_TITLE: "Logbook",
  EXPO_PUBLIC_APP_ENV: "production",
  EXPO_PUBLIC_APP_API_ENV: "production",
  EXPO_PUBLIC_APP_URL: "https://api-driver-titon.herokuapp.com",
  EXPO_PUBLIC_ONESIGNAL_ANDROID_APP_ID: null,
  EXPO_PUBLIC_ONESIGNAL_IOS_APP_ID: null,
})
