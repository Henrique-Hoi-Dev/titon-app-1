import { Portal } from '@gorhom/portal'
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia'
import {
  Image,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Layout } from '~/src/components/Layout'
import IconButton from '../../IconButton'
import React, { PropsWithChildren } from 'react'

type BackButtonProps = {
  title?: string
  onBackButtonPress?: () => void
  type: 'success' | 'error'
}

type WithHeaderProps = {
  title: string
  onClose?: () => void
  type: 'iniciar' | 'finalizar'
}

type Props = PropsWithChildren<BackButtonProps | WithHeaderProps>

const typeIcons = {
  success: require('~/assets/images/success-feedback.png'),
  error: require('~/assets/images/error-feedback.png'),
  iniciar: require('~/assets/images/iniciar-feedback.png'),
  finalizar: require('~/assets/images/finalizar-feedback.png'),
}

export default function Feedback({
  onBackButtonPress,
  onClose,
  title,
  type,
  children,
}: Props) {
  const dimensions = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const gradientWidth = dimensions.width
  const gradientHeight = dimensions.height / 1.6 - insets.top - insets.bottom

  return (
    <Portal>
      <Layout className="items-center w-full h-full bg-zinc-100 ">
        <Canvas
          style={{
            flex: 1,
            width: gradientWidth,
            height: gradientHeight,
          }}
        >
          <Rect x={0} y={0} width={gradientWidth} height={gradientHeight}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(gradientWidth, 0)}
              colors={['#0C59BB', '#8750FB']}
            />
          </Rect>
        </Canvas>
        <View
          style={{
            width: gradientWidth,
            height: gradientHeight - insets.top,
            position: 'absolute',
            top: insets.top,
            left: 0,
          }}
          className="items-center justify-center w-full h-full bg-transparent"
        >
          {onBackButtonPress ? (
            <View className="absolute top-0 items-center justify-center w-full p-4">
              {onBackButtonPress && (
                <IconButton
                  className="absolute z-50 top-4 left-4"
                  color="white"
                  icon="chevron-left"
                  onPress={onBackButtonPress}
                  size={32}
                />
              )}
              <Text className="text-lg font-semibold text-white">{title}</Text>
            </View>
          ) : null}
          <Image source={typeIcons[type]} className="w-2/3 h-2/3" />
          {title && (
            <View
              style={{
                top: -insets.top,
                paddingTop: insets.top + 16,
              }}
              className="absolute flex flex-row items-center justify-between w-full px-4 pb-4 bg-primary abs"
            >
              <Text className="text-lg font-semibold text-white">{title}</Text>
              {onClose && (
                <IconButton
                  color="white"
                  icon="close"
                  onPress={onClose}
                  size={32}
                />
              )}
            </View>
          )}
        </View>
        <ScrollView
          className="absolute w-full px-6 pt-3"
          style={{
            top: gradientHeight,
          }}
          contentContainerStyle={{
            paddingBottom: insets.bottom,
            minHeight: dimensions.height - gradientHeight,
          }}
        >
          {children}
        </ScrollView>
      </Layout>
    </Portal>
  )
}
