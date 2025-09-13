import _ from 'lodash'
import { ReactNode, useState, forwardRef, Ref } from 'react'
import {
  TextInput as RNTextInput,
  TextInputProps,
  View,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import { colors } from '~/src/theme'
import { useColorScheme } from 'nativewind'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type InputProps = TextInputProps & {
  isFocused?: boolean
  right?: ({ isFocused }: { isFocused?: boolean }) => ReactNode
  error?: string
  label?: string
  labelClassName?: string
  required?: boolean
}

const TextInput = forwardRef(
  (
    {
      onFocus,
      onBlur,
      label,
      isFocused,
      right,
      error,
      className,
      labelClassName,
      required,
      ...props
    }: InputProps,
    ref: Ref<RNTextInput>,
  ) => {
    const [isFocusedInternal, setIsFocusedInternal] = useState(isFocused)
    const { colorScheme } = useColorScheme()

    return (
      <View className="w-full">
        {label && (
          <Text
            className={twMerge(
              `${
                error ? 'text-red-500' : 'text-primary-600'
              } mb-2 text-xs font-semibold`,
              labelClassName,
            )}
          >
            {label} {required && <Text className="text-red-500">*</Text>}
          </Text>
        )}
        <View className="relative w-full mb-3">
          <RNTextInput
            selectionColor={colors.primary[200]}
            placeholderTextColor={
              colorScheme !== 'dark' ? '#787f8c' : '#61616a'
            }
            className={twMerge(
              className,
              `border-b rounded-t-md text-gray-950  ${
                isFocusedInternal && !error
                  ? 'border-primary-500'
                  : error
                  ? 'border-red-500'
                  : 'border-gray-500'
              } h-12 pr-12 pl-4 w-full bg-gray-200 `,
            )}
            onFocus={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              setIsFocusedInternal(true)
              onFocus && onFocus(event)
            }}
            onBlur={(event: NativeSyntheticEvent<TextInputFocusEventData>) => {
              setIsFocusedInternal(false)
              onBlur && onBlur(event)
            }}
            ref={ref}
            {...props}
          />

          {right && right({ isFocused: isFocusedInternal })}

          {error && (
            <View className="flex flex-row items-center mt-1 ml-1 gap-x-1">
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color="#ef4444"
              />
              <Text className="text-xs font-medium text-red-500">
                {_.upperFirst(error)}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  },
)

TextInput.displayName = 'TextInput'

export default TextInput
