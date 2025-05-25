import { Text, TextProps } from 'react-native'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export default function Heading({
  className: propsClassName,
  ...props
}: TextProps) {
  const className = twMerge(
    'text-primary  text-xl text-center',
    propsClassName,
  )
  return <Text {...props} className={className} />
}
