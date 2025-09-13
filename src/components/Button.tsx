import { ActivityIndicator, Text, View, TouchableOpacity } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'
import React, { ElementType } from 'react'

const button = tv({
  slots: {
    base: 'px-4 py-2 shadow-md justify-center items-center',
    text: 'text-center leading-6 tracking-wider',
  },
  variants: {
    color: {
      primary: {
        base: 'bg-primary-600',
        text: 'text-white',
      },
      secondary: {
        base: 'bg-secondary',
        text: 'text-zinc-800',
      },
      zinc: {
        base: 'bg-zinc-300',
        text: 'text-zinc-800',
      },
      white: {
        base: 'bg-white',
        text: 'text-zinc-800',
      },
    },
    outlined: {
      true: {
        base: 'bg-transparent border shadow-none',
      },
    },
    disabled: {
      true: {
        base: 'bg-[#232a5814]',
        text: 'text-[#232a587a]',
      },
    },
    text: {
      true: {
        base: 'bg-transparent shadow-none',
        text: 'text-primary-600',
      },
    },
    rounded: {
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
      full: 'rounded-full',
    },
    size: {
      sm: {
        base: 'px-2 py-2',
        text: 'text-xs',
      },
      md: {
        base: 'px-4 py-3',
        text: 'text-sm',
      },
      lg: {
        base: 'px-6 py-4',
        text: 'text-base',
      },
      xl: {
        base: 'px-8 py-5',
        text: 'text-lg',
      },
    },
    icon: {
      true: {
        text: 'ml-3',
      },
    },
  },
  compoundVariants: [
    {
      outlined: true,
      color: 'primary',
      class: {
        base: 'border-primary-600',
        text: 'text-primary-600',
      },
    },
    {
      outlined: true,
      color: 'secondary',
      class: {
        base: 'border-secondary',
        text: 'text-secondary',
      },
    },
    {
      text: true,
      color: 'primary',
      class: {
        base: 'bg-transparent',
        text: 'text-primary-600',
      },
    },
    {
      text: true,
      color: 'secondary',
      class: {
        base: 'bg-transparent',
        text: 'text-secondary',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    size: 'md',
    outlined: false,
    disabled: false,
    rounded: 'lg',
  },
})

type ButtonVariants = Omit<VariantProps<typeof button>, 'icon'>

type ButtonProps = Omit<
  React.ComponentProps<typeof TouchableOpacity> &
    ButtonVariants & {
      loading?: boolean
      icon?: ElementType
      as?: ElementType
    },
  'activeOpacity'
>

const Button = ({
  as,
  className,
  children,
  icon: Icon,
  size,
  color,
  outlined,
  disabled,
  rounded,
  loading,
  ...props
}: ButtonProps) => {
  const { base, text } = button({
    size,
    color,
    outlined,
    disabled,
    rounded,
  })

  const Element = as || TouchableOpacity

  return (
    <Element
      activeOpacity={0.7}
      className={base({ class: className, disabled: disabled || loading })}
      {...props}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#1587F2" />
      ) : (
        <>
          {Icon ? (
            <View className="flex-row items-center justify-center w-full mx-auto">
              <Icon />
              <Text className={text({ icon: true })}>{children}</Text>
            </View>
          ) : (
            <Text className={text()}>{children}</Text>
          )}
        </>
      )}
    </Element>
  )
}

export default Button
