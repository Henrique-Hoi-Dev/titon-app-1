import { Mask, useMaskedInputProps } from 'react-native-mask-input'
import TextInput, { InputProps } from './TextInput'

export type MaskedInputProps = InputProps & {
  mask: Mask
  placeholderFillCharacter?: string
}

const MaskedInput = ({
  value,
  onChangeText,
  mask,
  placeholder,
  placeholderFillCharacter,
  ...props
}: MaskedInputProps) => {
  const maskedInputProps = useMaskedInputProps({
    value,
    onChangeText,
    mask,
    placeholderFillCharacter,
  })

  if (placeholder) {
    maskedInputProps.placeholder = placeholder
  }

  return <TextInput {...props} {...maskedInputProps} />
}

export default MaskedInput
