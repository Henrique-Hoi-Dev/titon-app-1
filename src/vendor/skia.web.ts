import React from 'react'
import { View } from 'react-native'
import type { ReactNode } from 'react'
import type { ViewProps, ViewStyle } from 'react-native'

export type SkImage = unknown

type CanvasProps = { children?: ReactNode; style?: ViewStyle | ViewStyle[] }
export const Canvas = ({ children, style }: CanvasProps) =>
  React.createElement(View, { style } as ViewProps, children)

export const LinearGradient: React.FC = () => null
export const Rect: React.FC = () => null
export const Image: React.FC<Record<string, unknown>> = () => null
export const ImageShader: React.FC<Record<string, unknown>> = () => null
export const Circle: React.FC<
  React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => children ?? null

export const vec = (x: number, y: number) => ({ x, y })
export const mix = (t: number, a: number, b: number) => a + (b - a) * t
export const dist = (
  p1: { x?: number; y?: number },
  p2: { x?: number; y?: number },
) => Math.hypot((p2.x ?? 0) - (p1.x ?? 0), (p2.y ?? 0) - (p1.y ?? 0))

export const makeImageFromView = async (
  _ref: React.RefObject<unknown>,
): Promise<SkImage | null> => {
  return null
}
