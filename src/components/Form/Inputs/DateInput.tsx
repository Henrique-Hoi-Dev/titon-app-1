import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { TextInput, View, Text } from 'react-native'
import { Label } from './TextInput'
import IconButton from '../../IconButton'
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text'
import _ from 'lodash'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useLang } from '~/src/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type InputProps = MaskedTextInputProps & {
  isFocused?: boolean
  right?: ({ isFocused }: { isFocused?: boolean }) => ReactNode
  onChangeText: (text: string, rawText?: string) => void
  error?: string
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
  const { translate } = useLang()
  const insets = useSafeAreaInsets()
  const [isFocusedInternal, setIsFocusedInternal] = useState(isFocused)
  const ref = useRef<TextInput | null>(null)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [selectedValue, setSelectedValue] = useState(new Date())

  useEffect(() => {
    if (props.value && props.value.length === 10) {
      const date = new Date(props.value.split('/').reverse().join('-'))
      date.setHours(date.getHours() + date.getTimezoneOffset() / 60)
      setSelectedValue(date)
    }
  }, [props.value])

  const handleLabelPress = useCallback(() => {
    if (ref?.current) {
      ref.current.focus()
    }
  }, [ref])

  const handleDateChange = useCallback(
    (value: Date) => {
      onChangeText?.(
        value
          ?.toISOString()
          ?.split('T')?.[0]
          ?.split('-')
          ?.reverse()
          ?.join('/') || ''
      )

      setDatePickerVisibility(false)
    },
    [onChangeText]
  )

  return (
    <View className="w-full relative mt-6">
      <MaskedTextInput
        selectionColor="#00514F"
        mask="99/99/9999"
        keyboardType="numeric"
        className={`border-b-2 ${
          isFocused ? 'border-gray-500 border-b-3' : 'border-gray-300'
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
        onChangeText={(text, rawText) => {
          if (text !== props.value) {
            onChangeText(text, rawText)
          }
        }}
        {...props}
      />

      <View className="absolute right-2 top-4 z-10">
        <IconButton
          onPress={() => setDatePickerVisibility(true)}
          icon="calendar"
          size={20}
          color={isFocusedInternal ? '#444' : '#BBB'}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedValue}
        onConfirm={handleDateChange}
        onCancel={() => setDatePickerVisibility(false)}
        cancelTextIOS={translate('cancel', {
          capitalize: true,
        })}
        confirmTextIOS={translate('confirm', {
          capitalize: true,
        })}
        modalStyleIOS={{
          marginBottom: insets.bottom,
        }}
      />

      <Label
        onPress={handleLabelPress}
        active={(props.value?.length || 0) > 0 || isFocusedInternal}
      >
        {placeholder}
      </Label>

      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">
          {_.upperFirst(error)}
        </Text>
      )}
    </View>
  )
}

export default DateInput
