import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { User, useAuth } from '~/src/context/auth'
import { getComissao, getFaturamento } from '~/src/utils'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Button from '~/src/components/Button'
import { router } from 'expo-router'
import { Skeleton } from 'moti/skeleton'
import { Freight } from '~/src/types'
import Config from '~/src/config'
import { useEffect, useState } from 'react'

type Props = {
  item: Freight
  loading?: boolean
}

// Helper para verificar se o arquivo tem dados (não é objeto vazio)
const hasFile = (file: { uuid?: string; name?: string } | null | undefined) => {
  if (!file) return false
  // Verifica se tem pelo menos uuid ou name (não é objeto vazio)
  return !!(file.uuid || file.name)
}

// Helper para buscar URL da imagem
const getImageUrl = (
  file: { uuid?: string; name?: string } | null | undefined,
) => {
  if (!hasFile(file) || !file?.uuid) return null
  return `${Config.apiUrl}/v1/driver/freight/search-documents?category=documents&filename=${file.uuid}`
}

export default function Informacoes({ item, loading = false }: Props) {
  const { width } = useWindowDimensions()
  const { user } = useAuth()
  const [, setImageUrls] = useState<{
    ticket?: string | null
    cte?: string | null
    freightLetter?: string | null
  }>({})

  // Calcula totais usando os dados do objeto principal
  const totalAbastecimentos = (item.restock ?? []).reduce(
    (acc, curr) => acc + curr.total_value_fuel / 100,
    0,
  )
  const totalDespesas = (item.travelExpense ?? []).reduce(
    (acc, curr) => acc + curr.value / 100,
    0,
  )

  // Busca URLs das imagens quando o item carregar
  useEffect(() => {
    if (item) {
      setImageUrls({
        ticket: getImageUrl(item.imgProofTicket),
        cte: getImageUrl(item.imgProofCte),
        freightLetter: getImageUrl(item.imgProofFreightLetter),
      })
    }
  }, [item])

  return (
    <ScrollView>
      <View
        style={{ width }}
        className="rounded-b-lg h-28 bg-primary-600 mb-12 relative"
      >
        <View className="absolute top-4 w-full">
          <ScrollView
            horizontal
            className="w-full py-5 z-[100]"
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-1 px-4 py-6 ml-4 mr-2 bg-white rounded-lg shadow-md ">
              <Text className="text-xs text-gray-400 ">Valor do Frete</Text>
              <Skeleton show={!loading} colorMode="light">
                <Text className="text-2xl text-emerald-500">
                  {(getFaturamento(item as Freight) ?? 0).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </Text>
              </Skeleton>
            </View>
            <View className="px-4 py-6 mx-2 bg-white rounded-lg shadow-md ">
              <Text className="text-xs text-gray-400 ">Abastecidas</Text>
              <Skeleton show={!loading} colorMode="light">
                <Text className="text-2xl text-red-500">
                  {(totalAbastecimentos || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </Skeleton>
            </View>
            <View className="px-4 py-6 mx-2 bg-white rounded-lg shadow-md ">
              <Text className="text-xs text-gray-400 ">Despesas</Text>
              <Skeleton show={!loading} colorMode="light">
                <Text className="text-2xl text-red-500">
                  {(totalDespesas || 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </Skeleton>
            </View>
            <View className="px-4 py-6 ml-2 mr-4 bg-white rounded-lg shadow-md ">
              <Text className="text-xs text-gray-400 ">Comissão</Text>
              <Skeleton show={!loading} colorMode="light">
                <Text className="text-2xl text-emerald-500">
                  {getComissao(
                    (item as Freight) ?? 0,
                    user as User,
                  ).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </Text>
              </Skeleton>
            </View>
          </ScrollView>
        </View>
      </View>
      <View className="px-4 bg-zinc-100  gap-y-4">
        <View>
          <Skeleton show={!loading} colorMode="light">
            <Pressable
              onPress={() => router.navigate(`/viagens/${item?.id}/details`)}
              className="flex-row justify-between p-4 bg-white rounded-lg shadow-sm "
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="file-document-outline"
                  color="#1757D4"
                  size={24}
                />
                <Text className="ml-2 text-sm text-black ">
                  Detalhes da carga
                </Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons
                  name="checkbox-blank-circle-outline"
                  size={16}
                />
                <MaterialCommunityIcons
                  name="chevron-right"
                  color="#1757D4"
                  size={28}
                />
              </View>
            </Pressable>
          </Skeleton>
        </View>
        <View>
          <Skeleton show={!loading} colorMode="light">
            <Pressable
              onPress={() =>
                router.navigate(`/viagens/${item?.id}/upload/ticket`)
              }
              className="flex-row justify-between p-4 bg-white rounded-lg shadow-sm "
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="camera-outline"
                  color="#1757D4"
                  size={24}
                />
                <Text className="ml-2 text-sm text-black ">
                  Ticket de balança
                </Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons
                  name={
                    hasFile(item?.imgProofTicket)
                      ? 'check-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={16}
                  color={hasFile(item?.imgProofTicket) ? 'green' : 'black'}
                />
                <MaterialCommunityIcons
                  name="chevron-right"
                  color="#1757D4"
                  size={28}
                />
              </View>
            </Pressable>
          </Skeleton>
        </View>
        <View>
          <Skeleton show={!loading} colorMode="light">
            <Pressable
              onPress={() => router.navigate(`/viagens/${item?.id}/upload/cte`)}
              className="flex-row justify-between p-4 bg-white rounded-lg shadow-sm "
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="camera-outline"
                  color="#1757D4"
                  size={24}
                />
                <Text className="ml-2 text-sm text-black ">CTE</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons
                  name={
                    hasFile(item?.imgProofCte)
                      ? 'check-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={16}
                  color={hasFile(item?.imgProofCte) ? 'green' : 'black'}
                />
                <MaterialCommunityIcons
                  name="chevron-right"
                  color="#1757D4"
                  size={28}
                />
              </View>
            </Pressable>
          </Skeleton>
        </View>
        <View>
          <Skeleton show={!loading} colorMode="light">
            <Pressable
              onPress={() =>
                router.navigate(`/viagens/${item?.id}/upload/freight_letter`)
              }
              className="flex-row justify-between p-4 bg-white rounded-lg shadow-sm "
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="camera-outline"
                  color="#1757D4"
                  size={24}
                />
                <Text className="ml-2 text-sm text-black ">Carta Frete</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <MaterialCommunityIcons
                  name={
                    hasFile(item?.imgProofFreightLetter)
                      ? 'check-circle'
                      : 'checkbox-blank-circle-outline'
                  }
                  size={16}
                  color={
                    hasFile(item?.imgProofFreightLetter) ? 'green' : 'black'
                  }
                />
                <MaterialCommunityIcons
                  name="chevron-right"
                  color="#1757D4"
                  size={28}
                />
              </View>
            </Pressable>
          </Skeleton>
        </View>
        {loading && <Button>Enviar</Button>}
      </View>
    </ScrollView>
  )
}
