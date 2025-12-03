/* eslint-disable no-undef */
import { View } from 'react-native'
import { useNavigation, useRouter, useSegments } from 'expo-router'
import IconButton from '../IconButton'
import { StatusBar } from 'expo-status-bar'
import { PropsWithChildren, useMemo } from 'react'
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
  const router = useRouter()
  const segments = useSegments()
  const insets = useSafeAreaInsets()

  // Verifica se pode voltar de forma mais robusta
  const canGoBack = useMemo(() => {
    try {
      // Não mostra botão de voltar na home
      const isHome = segments && segments.length === 1 && segments[0] === 'home'
      if (isHome) return false

      // Se tem callback customizado, sempre mostra o botão
      if (onBackButtonPressed) return true

      // Verifica se pode voltar na navegação
      const canGoBackNav = navigation.canGoBack()

      // Verifica se tem segmentos (não está na raiz)
      const hasSegments = segments && segments.length > 0

      return canGoBackNav && hasSegments
    } catch {
      // Em caso de erro, assume que pode voltar se tiver callback
      return !!onBackButtonPressed
    }
  }, [navigation, segments, onBackButtonPressed])

  const handleBackPress = () => {
    if (onBackButtonPressed) {
      onBackButtonPressed()
      return
    }

    try {
      // Verifica se pode voltar antes de tentar
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        // Se não pode voltar, redireciona para home
        router.replace('/home')
      }
    } catch (error) {
      // Em caso de erro, redireciona para home
      console.warn('Erro ao voltar, redirecionando para home:', error)
      router.replace('/home')
    }
  }

  return (
    <View
      style={{
        paddingTop: insets.top + 24,
      }}
      className="top-0 z-50 flex-row items-center justify-center w-full px-5 pb-6 bg-primary-600 "
    >
      <StatusBar style="light" />
      <View className={`relative flex-row ${align} justify-between w-full`}>
        {canGoBack && (
          <IconButton
            color="white"
            icon="chevron-left"
            onPress={handleBackPress}
            size={20}
          />
        )}
        <View className={`flex-1 -z-50 ${canGoBack && 'pl-4'} relative`}>
          {children}
        </View>
      </View>
    </View>
  )
}
