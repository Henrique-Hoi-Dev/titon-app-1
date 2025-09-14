import React, { useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet'
import _ from 'lodash'
import { Portal } from '@gorhom/portal'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import TextInput from './TextInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type Data<T> = {
  label: string
  value: T
}

export type SelectProps<T> = {
  required?: boolean
  label?: string
  placeholder?: string
  searchable?: boolean
  data: Data<T>[]
  onSelect?: (item?: Data<T>) => void
  value?: Data<T>['value']
  loading?: boolean
  error?: string
}

const AnimatedMaterialCommunityIcons = Animated.createAnimatedComponent(
  MaterialCommunityIcons
)

export default function Select<T>({
  required,
  label,
  placeholder,
  searchable = false,
  data = [],
  onSelect,
  value,
  loading,
  error,
}: SelectProps<T>) {
  const ref = React.useRef<BottomSheet>(null)
  const flatlistRef = React.useRef<BottomSheetFlatListMethods>(null)
  const [isFocused, setIsFocused] = React.useState(false)
  const { height } = useWindowDimensions()
  const [search, setSearch] = React.useState('')
  const insets = useSafeAreaInsets()
  const deg = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => {
    'worklet'
    return {
      transform: [{ rotate: `${deg.value}deg` }],
    }
  })

  const filteredData = React.useMemo(() => {
    return data.filter(({ label }) => {
      if (!search) return true
      return label
        .normalize('NFD')
        .toLowerCase()
        .includes(search.normalize('NFD').toLowerCase().trim())
    })
  }, [data, search])

  const handleSelect = useCallback(
    (item: Data<T>) => {
      onSelect && onSelect(item.value === value ? undefined : item)
      ref?.current?.close()
    },
    [ref, onSelect, value]
  )

  function renderItem({ item }: { item: Data<T> }) {
    return (
      <Pressable
        android_ripple={{
          color: 'rgba(0,0,0,0.2)',
        }}
        onPress={() => handleSelect(item)}
        className={`
          relative
          flex-row
          w-full
          items-center
          justify-between
          px-4
          py-2
          border-b
          bg-white 
          border-gray-200
          rounded-t
          cursor-pointer
          pb-2
        `}
      >
        <View className="flex-row items-center">
          <Text
            className={`text-sm font-medium ${
              value === item.value ? 'text-primary' : 'text-gray-900'
            }`}
          >
            {item.label}
          </Text>
        </View>
        {value === item.value && (
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={24}
            color={'#3975EA'}
            className="absolute left-4"
          />
        )}
      </Pressable>
    )
  }

  return (
    <>
      <TextInput
        className={`text-gray-900 ${
          error ? 'border-red-500' : 'border-gray-500'
        }`}
        onPressOut={() => {
          setIsFocused(true)
          ref?.current?.expand()
        }}
        isFocused={isFocused}
        label={label}
        placeholder={placeholder || 'Selecione uma opção'}
        editable={false}
        required={required}
        // eslint-disable-next-line eqeqeq
        value={data.find((item) => item.value == value)?.label || ''}
        error={error}
        right={({ isFocused }) => (
          <View className="absolute right-2 top-4">
            {loading ? (
              <ActivityIndicator size="small" />
            ) : (
              <View className="flex-row flex-1 gap-x-1">
                {value && (
                  <Pressable
                    onPress={() => {
                      if (value) {
                        return onSelect?.()
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={20}
                      color="#dc2626"
                    />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    setIsFocused(true)
                    ref?.current?.expand()
                  }}
                >
                  <AnimatedMaterialCommunityIcons
                    style={animatedStyles}
                    name={'chevron-down'}
                    size={20}
                    color={isFocused ? '#444' : '#BBB'}
                  />
                </Pressable>
              </View>
            )}
          </View>
        )}
      />

      <Portal>
        <BottomSheet
          ref={ref}
          index={-1}
          onClose={() => {
            setIsFocused(false)
            setSearch('')
          }}
          onAnimate={(from, to) => {
            if (to === 0) {
              deg.value = withTiming(-180, {
                duration: 200,
              })
              return
            }
            deg.value = withTiming(0, {
              duration: 200,
            })
          }}
          onChange={(index) => {
            if (index === 0 && value) {
              flatlistRef?.current?.scrollToIndex({
                animated: true,
                index: filteredData.findIndex((item) => item.value === value),
              })
            }
          }}
          enablePanDownToClose={true}
          enableDynamicSizing={true}
          maxDynamicContentSize={height / 2}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          {searchable && (
            <View className="flex-row items-center px-4 py-2 bg-white border-b border-gray-200">
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#BBB"
                style={{ marginRight: 8 }}
              />
              <BottomSheetTextInput
                placeholder="Pesquisar"
                className="w-full text-gray-900"
                onChangeText={setSearch}
                value={search}
              />
            </View>
          )}
          <BottomSheetFlatList
            data={filteredData}
            ref={flatlistRef}
            renderItem={renderItem}
            keyExtractor={({ value }) => `item_${value}`}
            contentContainerStyle={{
              paddingBottom: insets.bottom,
            }}
          />
        </BottomSheet>
      </Portal>
    </>
  )
}

Select.displayName = 'Select'
