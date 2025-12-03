import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  TextInput as RNTextInput,
  View,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'
import IconButton from '../../IconButton'
import { useMaskedInputProps } from 'react-native-mask-input'
import _ from 'lodash'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Máscara para data DD/MM/YYYY
const dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]

export type InputProps = {
  isFocused?: boolean
  right?: ({ isFocused }: { isFocused?: boolean }) => ReactNode
  onChangeText: (text: string, rawText?: string) => void
  error?: string
  value?: string
  placeholder?: string
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
  className?: string
}

const DateInput = ({
  onFocus,
  onBlur,
  placeholder,
  className: _className,
  isFocused,
  right: _right,
  error,
  onChangeText,
  ...props
}: InputProps) => {
  const insets = useSafeAreaInsets()
  const [isFocusedInternal, setIsFocusedInternal] = useState(isFocused)
  const ref = useRef<RNTextInput | null>(null)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [selectedValue, setSelectedValue] = useState(new Date())

  useEffect(() => {
    if (props.value && props.value.length === 10) {
      const date = new Date(props.value.split('/').reverse().join('-'))
      date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
      setSelectedValue(date)
    }
  }, [props.value])

  const handleDateChange = useCallback(
    (value: Date) => {
      onChangeText?.(
        value
          ?.toISOString()
          ?.split('T')?.[0]
          ?.split('-')
          ?.reverse()
          ?.join('/') || '',
      )

      setDatePickerVisibility(false)
    },
    [onChangeText],
  )

  const inputValue = props.value || ''

  const maskedInputProps = useMaskedInputProps({
    value: inputValue,
    onChangeText: (text, rawText) => {
      onChangeText(text, rawText)
    },
    mask: dateMask,
  })

  return (
    <View className="w-full mt-6">
      {placeholder && (
        <Text
          className={`mb-2 text-xs font-semibold ${
            error ? 'text-red-500' : 'text-primary-600'
          }`}
        >
          {placeholder}
        </Text>
      )}
      <View className="relative w-full mb-3">
        <RNTextInput
          {...maskedInputProps}
          value={maskedInputProps.value || inputValue}
          selectionColor="#00514F"
          keyboardType="numeric"
          placeholder={placeholder}
          className={`border-b-2 ${
            isFocusedInternal ? 'border-gray-500 border-b-3' : 'border-gray-300'
          } h-12 pr-12 pl-2 w-full bg-white`}
          onFocus={(event) => {
            setIsFocusedInternal(true)
            onFocus && onFocus(event)
          }}
          onBlur={(event) => {
            setIsFocusedInternal(false)
            onBlur && onBlur(event)
          }}
          ref={ref}
        />

        <View className="absolute right-2 top-4 z-10">
          <IconButton
            onPress={() => setDatePickerVisibility(true)}
            icon="calendar"
            size={20}
            color={isFocusedInternal ? '#444' : '#BBB'}
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedValue}
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
        cancelTextIOS="Cancelar"
        confirmTextIOS="Confirmar"
        modalStyleIOS={{
          marginBottom: insets.bottom,
        }}
      />

      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          {_.upperFirst(error)}
        </Text>
      )}
    </View>
  )
}

export default DateInput
