import { View, ViewProps } from 'react-native'
import React from 'react'

export type ProgressProps = ViewProps & {
  value: number
}

export default function Progress({ value, ...props }: ProgressProps) {
  const progress = Math.min(100, Math.max(0, value))

  return (
    <View className="w-full h-3 rounded-full bg-zinc-200 " {...props}>
      <View
        style={{
          width: `${progress}%`,
        }}
        className="h-full rounded-full bg-primary-600"
      ></View>
    </View>
  )
}
