// eslint-disable-next-line camelcase
import { useRouter, SplashScreen } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '~/src/context/auth'

export default function Splashscreen() {
  const { user, token, getUser } = useAuth()
  const router = useRouter()

  const onLayoutRootView = useCallback(async () => {
    if (token && !user) {
      await getUser()
    }

    if (user || (!user && !token)) {
      SplashScreen.hideAsync()
    }

    if (user) {
      router.replace('/home')
    }

    if (!user && !token) {
      router.replace('/sign-in')
    }
  }, [token, user, router])

  useEffect(() => {
    onLayoutRootView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token])

  return (
    <SafeAreaView
      onLayout={onLayoutRootView}
      className="w-full h-full items-center justify-center bg-[#2B2B2C]"
    >
      <Image
        source={require('~/assets/images/logo.png')}
        alt="logo"
        className="h-10 py-16"
        resizeMode="contain"
      />
    </SafeAreaView>
  )
}
