import { BlurView, BlurViewProps } from 'expo-blur'
import { View, ViewProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

const card = tv({
  base: 'overflow-hidden w-full',
  variants: {
    blur: {
      true: 'bg-transparent',
    },
    color: {
      primary: 'bg-white ',
      secondary: 'bg-gray-800',
    },
    spacing: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
    },
    rounded: {
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
    },
  },
  compoundVariants: [
    {
      blur: true,
      color: ['primary', 'secondary'],
      className: 'bg-white/50',
    },
  ],
  defaultVariants: {
    blur: false,
    spacing: 'md',
    color: 'primary',
    shadow: 'md',
    rounded: 'md',
  },
})

type SolidProps = ViewProps & {
  blur?: false
}

type BlurProps = BlurViewProps & {
  blur?: true
}

type ButtonVariants = VariantProps<typeof card>

type Props = ButtonVariants & (SolidProps | BlurProps)

function Card({ blur, color, shadow, spacing, className, ...props }: Props) {
  const Element = blur ? BlurView : View

  return (
    <Element
      className={card({
        blur,
        color,
        shadow,
        spacing,
        class: className,
      })}
      {...props}
    />
  )
}

export default Card
