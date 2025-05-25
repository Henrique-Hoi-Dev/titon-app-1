import { View, Text, Pressable } from 'react-native'
import React from 'react'
import useNotifications, { NotificationType } from '../hooks/useNotifications'

export default function Notification({ item }: { item: NotificationType }) {
  const { onRead } = useNotifications()
  return (
    <Pressable
      className={`p-4 ${item.read ? 'bg-zinc-100' : 'bg-primary-50'} `}
      onPress={() => onRead(item.id)}
    >
      <View className="flex-1 mb-4">
        <Text>{item.content}</Text>
      </View>
      <View className="justify-end items-end">
        <Text className=" text-xs text-gray-400">
          {item.created_at.fromNow()}
        </Text>
      </View>
    </Pressable>
  )
}
