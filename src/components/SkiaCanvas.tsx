import { Platform, StyleSheet, View, ViewStyle } from 'react-native'
import { Canvas as SkiaCanvas } from '~/src/vendor/skia'
import { ReactNode } from 'react'

interface SkiaCanvasWrapperProps {
  children: ReactNode
  style?: ViewStyle | ViewStyle[]
  className?: string
}

export const SkiaCanvasWrapper = ({
  children,
  style,
  className,
}: SkiaCanvasWrapperProps) => {
  const flatStyle = Array.isArray(style) ? StyleSheet.flatten(style) : style
  // No web, renderiza um View simples se o Skia não estiver disponível
  if (Platform.OS === 'web') {
    // Evita usar Skia no web para não depender do CanvasKit
    return <View style={flatStyle} className={className} />
  }

  // No mobile, usa o Canvas normalmente
  return (
    <View style={flatStyle} className={className}>
      <SkiaCanvas style={flatStyle}>{children}</SkiaCanvas>
    </View>
  )
}
