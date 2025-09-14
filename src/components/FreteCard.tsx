import { View, Text } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import IconButton from './IconButton'
import { Freight, useFreights } from '../hooks'
import Button from './Button'

export type FreteCardProps = {
  item: Freight
  index: number
}

export default function FreteCard({ item, index }: FreteCardProps) {
  const router = useRouter()
  const { getStatusColor, getStatusLabel } = useFreights()

  const status = {
    label: getStatusLabel(item.status),
    color: getStatusColor(item.status),
  }
  return (
    <View className={`px-4 ${index === 0 ? 'pt-6' : ''}`}>
      {index !== 0 && <View className="w-full h-px my-4 bg-zinc-200" />}
      <View
        className={`rounded-lg ${
          item.is_on_the_way ? 'bg-white ' : 'bg-transparent'
        } w-full relative shadow-lg`}
      >
        <View className={`px-5 pt-5 pl-10`}>
          <View className="absolute top-7 left-3">
            <View className="relative">
              <View className="w-3 h-3 rounded-full bg-primary-600" />
              <View className="absolute w-[2px] h-10 bg-primary-600 left-[5px]" />
              <View className="absolute w-3 h-3 rounded-full bg-primary-600 top-8" />
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-950 mb-5">
                {item.end_freight_city}
              </Text>
              <Text className="text-gray-950 mb-5">
                {item.start_freight_city}
              </Text>
            </View>
            <View className="items-end justify-between h-20">
              <View className={`px-2 py-1 rounded-lg ${status.color?.bg}`}>
                <Text
                  className={`text-xs font-semibold text-center ${status.color?.text}`}
                >
                  {status.label}
                </Text>
              </View>
              <IconButton
                color="#1757D4"
                icon="chevron-right"
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onPress={() => router.navigate(`/viagens/${item.id}/`)}
                size={28}
              />
            </View>
          </View>
        </View>
        <View className="w-full h-px my-5 bg-zinc-100" />
        <View className="px-5 pb-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-light text-gray-950 ">
              Tempo estimado:
            </Text>
            <Text className="text-sm font-light text-primary-700 ">
              {item.route_duration}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-light text-gray-950 ">
              Distância:
            </Text>
            <Text className="text-sm font-light text-primary-700 ">
              {item.route_distance_km}
            </Text>
          </View>
          {item.status === 'STARTING_TRIP' && (
            <Button
              className="mt-4"
              outlined
              onPress={() => {
                router.navigate(`/viagens/${item.id}/finalizar`)
              }}
            >
              Finalizar
            </Button>
          )}

          {item.status === 'APPROVED' && (
            <Button
              className="mt-4"
              outlined
              onPress={() => {
                router.navigate(`/viagens/${item.id}/iniciar`)
              }}
            >
              Iniciar
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}
