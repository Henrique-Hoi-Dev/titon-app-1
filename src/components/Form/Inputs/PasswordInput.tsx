import { Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import IconButton from '../../IconButton'
import TextInput, { InputProps } from './TextInput'

export type PasswordInputProps = InputProps & {
  calculateStrength?: boolean
}

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong'

export default function PasswordInput({
  secureTextEntry: _,
  calculateStrength,
  value,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [strength, setStrength] = useState<PasswordStrength>()
  const strengthWidth: Record<PasswordStrength | 'unset', number> = {
    unset: 0,
    weak: 25,
    medium: 50,
    strong: 75,
    'very-strong': 100,
  }

  const strengthColor: Record<PasswordStrength | 'unset', string> = {
    unset: 'bg-gray-200',
    weak: 'bg-red-600',
    medium: 'bg-yellow-500',
    strong: 'bg-primary-600',
    'very-strong': 'bg-green-600',
  }

  const strengthTextColor: Record<PasswordStrength | 'unset', string> = {
    unset: 'text-gray-200',
    weak: 'text-red-600',
    medium: 'text-yellow-500',
    strong: 'text-primary-600',
    'very-strong': 'text-green-600',
  }

  const strengthMessage: Record<PasswordStrength | 'unset', string> = {
    unset: '',
    weak: 'Sua senha é muito fraca',
    medium: 'Sua senha é fraca',
    strong: 'Sua senha é forte',
    'very-strong': 'Sua senha é muito forte',
  }

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    // verify password strength
    const hasLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasSpecialCharacter = /[^A-Za-z0-9]/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)

    // Count the number of met conditions
    const conditionsMet = [
      hasLength,
      hasNumber,
      hasSpecialCharacter,
      hasUpperCase,
      hasLowerCase,
    ].filter(Boolean).length

    // Determine password strength based on conditions met
    if (conditionsMet === 5) {
      return 'very-strong'
    } else if (conditionsMet >= 4) {
      return 'strong'
    } else if (conditionsMet >= 3) {
      return 'medium'
    } else {
      return 'weak'
    }
  }

  useEffect(() => {
    if (calculateStrength) {
      setStrength(value ? calculatePasswordStrength(value) : undefined)
    }
  }, [value, calculateStrength])

  return (
    <View className="relative w-full">
      <TextInput
        secureTextEntry={!showPassword}
        value={value}
        {...props}
        right={() => (
          <View className="flex items-center pr-4 -right-1 top-3 absolute">
            <IconButton
              icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              className="z-50"
              activeOpacity={0.8}
              size={24}
              color="#aaa"
              onPress={() => setShowPassword((oldValue) => !oldValue)}
            />
          </View>
        )}
      />
      {calculateStrength && strength && (
        <View className="mb-4">
          <View className="w-full h-1.5 rounded bg-gray-200 mb-1">
            <View
              className={`h-full rounded ${strengthColor[strength ?? 'unset']}`}
              style={{ width: `${strengthWidth[strength ?? 'unset']}%` }}
            />
          </View>
          <Text
            className={`text-xs ${
              strengthTextColor[strength ?? 'unset']
            } font-semibold mt-1`}
          >
            {strengthMessage[strength ?? 'unset']}
          </Text>
        </View>
      )}
    </View>
  )
}
