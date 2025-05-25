import { useRouter } from 'expo-router'
import { FlatList, Text, View } from 'react-native'
import { Masks, formatWithMask } from 'react-native-mask-input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '~/src/components/Button'
import { Header, Layout } from '~/src/components/Layout'
import { User, useAuth } from '~/src/context/auth'
import { useFinancialStatement } from '~/src/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as utils from '~/src/utils'
import FreteCard from '~/src/components/FreteCard'

export default function App() {
  const router = useRouter()
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const { data, fetch, loading } = useFinancialStatement()

  const faturamento = utils.getFaturamento(data?.freight || [])
  const comissao = utils.getComissao(data?.freight || [], user as User)
  const fretes = data?.freight
    ?.filter((freight) => freight.status !== 'DRAFT')
    .sort((a, b) => b.id - a.id)

  return (
    <Layout className="w-full h-full bg-zinc-100 ">
      <Header>
        <Text className="mb-3 -mt-1 text-lg font-semibold text-white">
          Ficha {data?.id}
        </Text>
        <Text className="text-sm font-light text-white">Data de início</Text>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-black text-white">
            {data?.start_date.toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <Text className="text-sm font-light text-white">Faturamento</Text>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-black text-white">
            {
              formatWithMask({
                text: (faturamento ?? 0).toString(),
                mask: Masks.BRL_CURRENCY,
              }).masked
            }
          </Text>
        </View>
        <Text className="text-sm font-light text-white">Comissão</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-black text-white">
            {
              formatWithMask({
                text: (comissao ?? 0).toString(),
                mask: Masks.BRL_CURRENCY,
              }).masked
            }
          </Text>
        </View>
      </Header>
      <FlatList
        data={fretes}
        refreshing={loading}
        onRefresh={fetch}
        renderItem={({ item, index }) => (
          <FreteCard item={item} index={index} />
        )}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        ListFooterComponent={
          <View className="flex-1 px-4 py-4">
            <Button
              onPress={() => router.navigate('/viagens/cotacoes/new')}
              icon={() => (
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  color="white"
                  size={24}
                />
              )}
              className="shadow-sm"
            >
              Nova Cotação
            </Button>
          </View>
        }
      />
    </Layout>
  )
}
