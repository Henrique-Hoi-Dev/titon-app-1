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
  badgeCount?: number
}

const IconButton = ({
  icon,
  size = 24,
  color,
  className,
  label,
  showBadge,
  badgeCount,
  ...props
}: IconButtonProps) => {
  const hasBadge = showBadge || (badgeCount !== undefined && badgeCount > 0)

  return (
    <TouchableOpacity
      className={`${className} flex items-center justify-center`}
      {...props}
    >
      <View className="relative items-center">
        <MaterialCommunityIcons name={icon} size={size} color={color} />

        {hasBadge && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full items-center justify-center min-w-[18px] h-[18px] px-1">
            {badgeCount !== undefined && badgeCount > 0 ? (
              <Text className="text-white text-[10px] font-bold">
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            ) : (
              <View className="w-1.5 h-1.5 bg-white rounded-full" />
            )}
          </View>
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
