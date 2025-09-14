import { TextInput, TextInputProps, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const SearchInput = ({ ...props }: TextInputProps) => {
  return (
    <View className="w-full relative">
      <View className="absolute top-3 left-3 z-50">
        <MaterialCommunityIcons name="magnify" size={24} color="#FF6631" />
      </View>
      <TextInput
        selectionColor="#00514F"
        className={`rounded-full h-12 pl-12 w-full bg-gray-100`}
        {...props}
      />
    </View>
  )
}

export default SearchInput
