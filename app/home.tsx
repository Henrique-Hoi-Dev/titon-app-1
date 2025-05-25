import { useRouter } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { Pressable, ScrollView, Text, View } from 'react-native'
import IconButton from '~/src/components/IconButton'
import { Header, Layout } from '~/src/components/Layout'
import { useAuth } from '~/src/context/auth'
import { useFinancialStatement } from '~/src/hooks'

export default function Index() {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const { data, loading } = useFinancialStatement()
  const { colorScheme } = useColorScheme()

  return (
    <Layout className="items-center w-full h-full bg-zinc-100 ">
      <Header>
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-2xl font-semibold text-white capitalize">
            {new Date()
              .toLocaleDateString('pt-BR', {
                weekday: 'long',
              })
              .split(',')
              ?.at(0)}
          </Text>
          <View className="flex-row gap-x-2">
            {/* <ColorSchemeButton /> */}
            <IconButton
              color="white"
              icon="logout"
              onPress={signOut}
              size={20}
            />
          </View>
        </View>
        <Text className="text-sm font-light text-white mb-14">
          {new Date().toLocaleDateString()}
        </Text>
        <Pressable
          disabled={loading}
          onPress={() => router.navigate('/viagens/')}
          className="absolute flex-row items-center self-center w-full px-4 py-5 mt-8 bg-white rounded-lg top-12 shadow-sm left-0 right-0"
        >
          <View className="items-center justify-center w-12 h-12 mr-2 rounded-full bg-primary-500">
            <Text className="text-2xl text-white">
              {user?.name?.split('')?.at(0)}
            </Text>
          </View>
          <Text className="text-base font-light text-black ">
            Olá, {user?.name}
          </Text>
        </Pressable>
      </Header>

      <ScrollView className="w-full px-4 pt-12">
        {((data && !loading) || loading) && (
          <View className="w-full bg-white shadow-2xl  rounded-2xl">
            <View className="px-4 pt-4">
              <Text className="text-sm font-semibold text-black ">
                Ficha {data?.id}
              </Text>
              <View className="w-full h-4" />
              <Text className="text-xs font-light text-black ">
                Data de início: {data?.start_date.toLocaleDateString('pt-BR')}
              </Text>
              <View className="w-full h-1" />
              <Text className="text-xs font-light text-black ">
                {data?.cart_board}
              </Text>
            </View>
            <View className="w-full h-px my-4 bg-zinc-200" />
            <Pressable
              onPress={() => router.navigate('/viagens/')}
              className="flex-row items-center justify-between w-full px-4 pb-4"
            >
              <Text className="text-sm font-semibold text-primary-500 ">
                Visualizar
              </Text>
              <IconButton
                onPress={() => router.navigate('/viagens/')}
                color={colorScheme === 'dark' ? 'white' : 'black'}
                icon="chevron-right"
                size={20}
              />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Layout>
  )
}
