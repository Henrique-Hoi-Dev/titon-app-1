import { View, ViewProps } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function Divider({ className, ...props }: ViewProps) {
  return (
    <View
      className={twMerge(`w-full h-px my-4 bg-zinc-100`, className)}
      {...props}
    />
  )
}
