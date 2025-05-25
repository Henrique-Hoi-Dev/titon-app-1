/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-undef */
import { Keyboard } from 'react-native'
import { useRouter, useSegments } from 'expo-router'
import { Portal } from '@gorhom/portal'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TabItem from './TabItem'
import useNotifications from '~/src/hooks/useNotifications'

export default function BottomTab(): JSX.Element | null {
  const router = useRouter()
  const segments = useSegments()
  const isAuth = segments[0] === '(auth)'
  const isViagem = segments.includes('viagens')
  const isPageToHide = isAuth || isViagem
  const { hasUnread } = useNotifications()

  const shouldHideBottomTab = useSharedValue(false)

  // translate to bottom when in settings
  const config = {
    duration: shouldHideBottomTab.value ? 450 : 200,
    easing: shouldHideBottomTab.value
      ? Easing.out(Easing.exp)
      : Easing.inOut(Easing.exp),
  }

  const style = useAnimatedStyle(() => {
    return {
      bottom: withTiming(shouldHideBottomTab.value ? -150 : 0, config),
    }
  }, [shouldHideBottomTab])

  useEffect(() => {
    shouldHideBottomTab.value = isPageToHide
  }, [shouldHideBottomTab, isPageToHide, segments])

  const isActive = (path?: string) => {
    return segments[0] === path
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      if (isPageToHide) return
      shouldHideBottomTab.value = true
    })

    Keyboard.addListener('keyboardDidHide', () => {
      if (isPageToHide) return
      shouldHideBottomTab.value = false
    })

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow')
      Keyboard.removeAllListeners('keyboardDidHide')
    }
  }, [isPageToHide, shouldHideBottomTab])

  return (
    <Portal>
      <Animated.View
        style={[style]}
        className="absolute flex-row bg-transparent"
      >
        <SafeAreaView
          edges={['bottom']}
          className="bg-white  flex-row justify-around items-center pt-4 pb-6 w-[100%] rounded-t-2xl px-4"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          <TabItem
            activeIcon="home"
            inactiveIcon="home-outline"
            onPress={() => router.navigate('/home')}
            label="Início"
            active={isActive('home')}
          />
          <TabItem
            activeIcon="account"
            inactiveIcon="account-outline"
            onPress={() => router.navigate('/profile')}
            label="Perfil"
            active={isActive('profile')}
          />
          <TabItem
            activeIcon="bell"
            inactiveIcon="bell-outline"
            onPress={() => router.navigate('/notifications')}
            label="Notificações"
            active={isActive('notifications')}
            showBadge={hasUnread}
          />
        </SafeAreaView>
      </Animated.View>
    </Portal>
  )
}
