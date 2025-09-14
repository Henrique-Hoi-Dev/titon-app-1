/* eslint-disable no-undef */
import { View } from 'react-native'
import { useNavigation, useSegments } from 'expo-router'
import IconButton from '../IconButton'
import { StatusBar } from 'expo-status-bar'
import { PropsWithChildren } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  align?: 'items-center' | 'items-start' | 'items-end'
  onBackButtonPressed?: () => void
}

export default function Header({
  children,
  align = 'items-start',
  onBackButtonPressed,
}: PropsWithChildren<Props>): JSX.Element {
  const navigation = useNavigation()
  const segments = useSegments()
  const canGoBack = navigation.canGoBack() && segments[0]
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        paddingTop: insets.top + 24,
      }}
      className="top-0 z-50 flex-row items-center justify-center w-full px-5 pb-6 bg-primary-600 "
    >
      <StatusBar style="light" />
      <View className={`relative flex-row ${align} justify-between w-full`}>
        {(canGoBack || onBackButtonPressed) && (
          <IconButton
            color="white"
            icon="chevron-left"
            onPress={onBackButtonPressed ?? navigation.goBack}
            size={20}
          />
        )}
        <View
          className={`flex-1 -z-50 ${
            (canGoBack || onBackButtonPressed) && 'pl-4'
          } relative`}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
