import React, { useRef, useEffect } from 'react'
import { TextInput, View, Text } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

type Props = {
  value?: string
  length?: number
  onChangeText?: (value: string) => void
  error?: string
}

const PinInput: React.FC<Props> = ({
  value,
  length = 6,
  onChangeText,
  error,
}) => {
  const inputRefs = useRef<TextInput[]>([])
  const [pin, setPin] = React.useState<string[]>(value?.split('') || [])

  useEffect(() => {
    inputRefs.current[value ? value.length - 1 : 0]?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onChangeText && onChangeText(pin.join(''))
  }, [pin, onChangeText])

  const handleInputChange = (index: number, value: string) => {
    const newPin = [...pin]
    newPin[index] = value

    setPin(newPin)

    if (value?.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus()
    } else if (value?.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <View className="w-full">
      <View className="flex-row w-full gap-4 items-center justify-center">
        {[...Array(length)].map((_, index) => (
          <TextInput
            key={index}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ref={(ref) => (inputRefs.current[index] = ref!)}
            maxLength={6}
            value={pin?.[index] || ''}
            keyboardType="numeric"
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleInputChange(index, '')
                return
              }

              handleInputChange(index, nativeEvent.key)
            }}
            onChangeText={(value) => {
              if (value.length === 6) {
                inputRefs.current[5]?.focus()
                return setPin(value.split(''))
              }

              handleInputChange(index, value[value.length - 1])
            }}
            className={`rounded-t bg-primary-100 border-b-4 ${
              pin?.[index] ? 'border-primary-500' : 'border-primary-400'
            } focus:border-primary-600 w-10 h-14 text-primary-800 text-center font-medium text-lg`}
          />
        ))}
      </View>
      {error && (
        <View className="pt-3 items-center flex-row gap-1">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            color="red"
            size={16}
          />
          <Text className="text-red-600 text-sm font-Montserrat_600SemiBold">
            {error}
          </Text>
        </View>
      )}
    </View>
  )
}

export default PinInput
