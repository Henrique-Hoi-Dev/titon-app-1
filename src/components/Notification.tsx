import { View, Text, Pressable } from 'react-native'
import React from 'react'
import useNotifications, { NotificationType } from '../hooks/useNotifications'

const getTitleColor = (title: string): string => {
  const titleLower = title.toLowerCase()

  // Verifica se é rejeitado/negado
  if (
    titleLower.includes('rejeitou') ||
    titleLower.includes('rejeitado') ||
    titleLower.includes('negou') ||
    titleLower.includes('negado')
  ) {
    return 'text-red-600'
  }

  // Verifica se é aprovado/aceito
  if (
    titleLower.includes('aprovou') ||
    titleLower.includes('aprovado') ||
    titleLower.includes('aceitou') ||
    titleLower.includes('aceito')
  ) {
    return 'text-green-600'
  }

  // Cor padrão
  return 'text-gray-900'
}

export default function Notification({ item }: { item: NotificationType }) {
  const { onRead } = useNotifications()
  const titleColor = getTitleColor(item.title)

  return (
    <Pressable
      className={`p-4 ${item.read ? 'bg-white' : 'bg-primary-50'} `}
      onPress={() => onRead(item.id)}
    >
      <View className={`flex-1 ${!item.read ? 'pl-4' : ''}`}>
        {!item.read && (
          <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
        )}
        <View className="mb-2">
          <Text className={`text-base font-bold ${titleColor}`}>
            {item.title}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-700 leading-5">
            {item.content}
          </Text>
        </View>
        <View className="flex-row justify-end items-center">
          <Text className="text-xs text-gray-400">
            {item.created_at?.fromNow() || 'Agora'}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
