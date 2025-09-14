import { GestureResponderEvent, View } from 'react-native'
import IconButton from '~/src/components/IconButton'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export type TabItemProps = {
  onPress?: (event: GestureResponderEvent) => void
  iconSize?: number
  inactiveIcon: keyof typeof MaterialCommunityIcons.glyphMap
  activeIcon: keyof typeof MaterialCommunityIcons.glyphMap
  label: string
  active: boolean
  showBadge?: boolean
}

export default function TabItem({
  onPress,
  inactiveIcon,
  activeIcon,
  iconSize = 24,
  label,
  active,
  showBadge,
}: TabItemProps) {
  return (
    <View className="justify-center items-center flex-1">
      <IconButton
        size={iconSize}
        icon={active ? activeIcon : inactiveIcon}
        onPress={onPress}
        label={label}
        color={active ? '#3975EA' : '#BBB'}
        showBadge={showBadge}
      />
      {active && (
        <View className="w-1.5 h-1.5 bg-primary rounded-full absolute -bottom-3"></View>
      )}
    </View>
  )
}
