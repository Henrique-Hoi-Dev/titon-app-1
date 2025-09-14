import { Header, Layout } from '~/src/components/Layout'
import React from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import Divider from '~/src/components/Divider'
import Notification from '~/src/components/Notification'
import useNotifications from '~/src/hooks/useNotifications'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Profile() {
  const notifications = useNotifications()
  const insets = useSafeAreaInsets()

  return (
    <Layout className="w-full h-full bg-zinc-100">
      <Header>
        <Text className="mb-3 -mt-1 text-lg font-semibold text-white">
          Notificações
        </Text>
      </Header>
      <FlatList
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
        }}
        data={notifications.data ?? []}
        ListHeaderComponent={
          <View className="bg-zinc-100 p-4 items-end">
            <Pressable onPress={() => notifications.onRead()} className="mb-4">
              <Text className="text-gray-500 text-sm">
                Marcar todas como lidas
              </Text>
            </Pressable>
            <Divider className="my-0 bg-zinc-200" />
          </View>
        }
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => <Notification item={item} />}
        ItemSeparatorComponent={() => <Divider className="my-0 bg-zinc-200" />}
        keyExtractor={(item) => item.id.toString()}
        refreshing={notifications.isFetching}
        onRefresh={notifications.refetch}
        removeClippedSubviews={false}
      />
    </Layout>
  )
}
