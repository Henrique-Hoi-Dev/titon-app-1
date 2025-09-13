/* eslint-disable no-undef */
import {
  TouchableOpacityProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type IconButtonProps = TouchableOpacityProps & {
  icon: keyof typeof MaterialCommunityIcons.glyphMap
  background?: string
  color?: string
  size?: number
  label?: string
  showBadge?: boolean
}

const IconButton = ({
  icon,
  size = 24,
  color,
  className,
  label,
  showBadge,
  ...props
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      className={`${className} flex items-center justify-center`}
      {...props}
    >
      <View className="relative items-center">
        <MaterialCommunityIcons name={icon} size={size} color={color} />

        {showBadge && (
          <View className="w-1.5 h-1.5 bg-red-500 rounded-full absolute -top-1 -right-1" />
        )}
      </View>
      {label && (
        <Text
          style={{
            fontSize: 12,
            color,
            marginTop: 4,
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default IconButton
