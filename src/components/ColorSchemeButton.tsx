import React from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from '../context/colorSchema'

export const ColorSchemeButton = () => {
  const { toggle, colorScheme, active } = useColorScheme()
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart((e) => {
      if (!active) {
        toggle(e.absoluteX, e.absoluteY)
      }
    })
  return (
    <GestureDetector gesture={tap}>
      <MaterialCommunityIcons
        name={colorScheme === 'light' ? 'weather-night' : 'weather-sunny'}
        color="white"
        size={24}
      />
    </GestureDetector>
  )
}
