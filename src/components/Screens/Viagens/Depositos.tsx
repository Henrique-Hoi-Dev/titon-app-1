import { SectionList, Text, useWindowDimensions, View } from 'react-native'
import { Masks, formatWithMask } from 'react-native-mask-input'
import type { Deposit, Freight } from '~/src/types'
import { banks, depositsTypes } from '~/src/utils/forms'
import Card from '../../Card'
import _ from 'lodash'
import moment from 'moment'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Button from '../../Button'

export default function Depositos({
  id,
  items,
  freight,
}: {
  id: number
  items?: Deposit[]
  freight: Freight
}) {
  const { width } = useWindowDimensions()

  const groupedByCreatedAt = Object.values(
    _.groupBy(
      (items ?? [])
        ?.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        ?.map((deposit) => ({
          ...deposit,
          created_at: moment(deposit.createdAt).format('DD/MM/YYYY'),
        })),
      'created_at',
    ),
  ).map((group) => {
    let title = moment(group[0].createdAt).format('DD/MM/YYYY')

    if (moment(group[0].createdAt).isSame(moment(), 'day')) {
      title = 'Hoje'
    }

    if (moment(group[0].createdAt).isSame(moment().subtract(1, 'day'), 'day')) {
      title = 'Ontem'
    }

    return {
      title,
      data: group,
    }
  })

  return (
    <>
      <View
        style={{ width }}
        className="rounded-b-lg h-20 bg-primary-600 mb-12"
      >
        <View className="px-10 absolute -bottom-9 w-full">
          <Card shadow="lg" spacing="sm">
            <Text className="text-xs text-center font-extralight text-zinc-700">
              Valor total
            </Text>
            <Text className="text-lg text-red-500 text-center font-semibold">
              -
              {
                formatWithMask({
                  text: (items ?? [])
                    ?.reduce((acc, cur) => acc + cur.value, 0)
                    .toString(),
                  mask: Masks.BRL_CURRENCY,
                }).masked
              }
            </Text>
          </Card>
        </View>
      </View>
      <SectionList
        sections={groupedByCreatedAt}
        onRefresh={undefined}
        refreshing={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <View className="flex-row gap-x-4">
              <MaterialCommunityIcons
                name="arrow-down-circle-outline"
                size={20}
                color="#ef4444"
              />
              <View className="flex-1 gap-y-2">
                <View className="flex-row items-center justify-between">
                  <View className="rounded-lg bg-red-200 px-2 py-1">
                    <Text className="text-xs text-red-600 font-medium">
                      Depósitos
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-500 mb-0.5">
                      Valor total
                    </Text>
                    <Text className="text-sm font-semibold text-red-500">
                      -
                      {
                        formatWithMask({
                          text: item.value?.toString() ?? '000',
                          mask: Masks.BRL_CURRENCY,
                        }).masked
                      }
                    </Text>
                  </View>
                </View>
                <Text className="text-sm text-gray-800 font-medium">
                  {item.local}
                </Text>
                {item.type_bank && (
                  <View>
                    <Text className="text-xs text-gray-500 mb-0.5">Banco</Text>
                    <Text className="text-xs text-gray-800">
                      {
                        banks.find(
                          (bank) => Object.keys(bank)[0] === item.type_bank,
                        )?.[item.type_bank]
                      }
                    </Text>
                  </View>
                )}
                {item.type_transaction && (
                  <View>
                    <Text className="text-xs text-gray-500 mb-0.5">
                      Tipo de transação
                    </Text>
                    <Text className="text-xs text-gray-800">
                      {
                        depositsTypes.find(
                          (type) =>
                            Object.keys(type)[0] === item.type_transaction,
                        )?.[item.type_transaction]
                      }
                    </Text>
                  </View>
                )}
                <Text className="text-xs text-gray-500 mt-1">
                  {item.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </Card>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="w-full bg-zinc-100 px-2 py-4">
            <Text className="text-base text-gray-950 ">{title}</Text>
          </View>
        )}
      />
      {freight && ['STARTING_TRIP'].includes(freight.status) && (
        <View className="absolute w-full px-5 bottom-8 z-50">
          <Button
            onPress={() => router.navigate(`/viagens/${id}/depositos/new`)}
            icon={() => (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color="white"
                size={24}
              />
            )}
            className="shadow-sm"
          >
            Novo depósito
          </Button>
        </View>
      )}
    </>
  )
}
