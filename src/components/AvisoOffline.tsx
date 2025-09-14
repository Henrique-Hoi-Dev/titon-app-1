import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { onlineManager } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import Button from '~/src/components/Button'
import LottieView from 'lottie-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function AvisoOffline() {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe((isOnline) => {
      if (!isOnline) {
        bottomSheetRef.current?.expand()
      } else {
        bottomSheetRef.current?.close()
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            enableTouchThrough={true}
            onPress={() => bottomSheetRef.current?.close()}
          />
        )}
      >
        <BottomSheetView
          style={{
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}
        >
          <Text className="mb-6 text-lg text-center font-Montserrat_600SemiBold text-primary-dark">
            Sem acesso à internet
          </Text>
          <LottieView
            loop={false}
            autoPlay
            style={{
              width: 150,
              height: 150,
            }}
            source={require('~/src/animations/offline.json')}
          />
          <Text className="mt-2 mb-6 text-sm text-center font-Nunito_400Regular text-neutral-pure">
            Ops, acho que você está sem conexão! Verifique sua conexão e tente
            novamente.
          </Text>
          <View className="w-full">
            <Button
              color="primaryDark"
              size="lg"
              rounded="full"
              onPress={() => bottomSheetRef.current?.close()}
            >
              Ok
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  )
}
