import { SectionList, Text, useWindowDimensions, View } from 'react-native'
import { Masks, formatWithMask } from 'react-native-mask-input'
import { useRestocks } from '~/src/hooks/useRestocks'
// import { banks } from '~/src/utils/forms'
import Card from '../../Card'
import _ from 'lodash'
import moment from 'moment'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import Button from '../../Button'

export default function Abastecimentos({ id }: { id?: number }) {
  const { width } = useWindowDimensions()
  const { data, loading, fetch: getRestocks } = useRestocks(id || 0)

  const groupedByCreatedAt = Object.values(
    _.groupBy(
      data
        ?.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime()
        })
        ?.map((restock) => ({
          ...restock,
          created_at: moment(restock.createdAt).format('DD/MM/YYYY'),
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
                  text: data
                    ?.reduce((acc, cur) => acc + cur.total_value_fuel, 0)
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
        onRefresh={getRestocks}
        refreshing={loading}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card className="mb-4">
            <View className="flex-row gap-x-4 items-center ">
              <MaterialCommunityIcons
                name="arrow-down-circle-outline"
                size={20}
                color="#ef4444"
              />
              <View className="flex-1 gap-y-1">
                <View className="rounded-lg bg-red-200 w-[86px] py-1 px-2">
                  <Text className="text-xs text-red-600">Abastecidas</Text>
                </View>
                {/* <Text className="text-xs text-gray-950/50">
                {
                  banks.filter(
                    (bank) => Object.keys(bank)[0] === item.type_bank,
                  )[0][item.type_bank]
                }
              </Text> */}
                <Text className="text-sm text-gray-800">
                  {item.name_establishment}
                </Text>
                <Text className="text-sm text-gray-800/50">
                  {item.createdAt.toLocaleDateString()}
                </Text>
              </View>
              <Text className="text-sm text-red-500">
                -
                {
                  formatWithMask({
                    text: item.total_value_fuel.toString(),
                    mask: Masks.BRL_CURRENCY,
                  }).masked
                }
              </Text>
            </View>
          </Card>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="w-full bg-zinc-100 px-2 py-4">
            <Text className="text-base text-gray-950 ">{title}</Text>
          </View>
        )}
      />
      <View className="absolute w-full px-5 bottom-8 z-50">
        <Button
          onPress={() => router.navigate(`/viagens/${id}/abastecimentos/new`)}
          icon={() => (
            <MaterialCommunityIcons
              name="plus-circle-outline"
              color="white"
              size={24}
            />
          )}
          className="shadow-sm"
        >
          Nova abastecida
        </Button>
      </View>
    </>
  )
}
