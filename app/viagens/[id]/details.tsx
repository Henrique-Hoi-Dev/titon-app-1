import { useLocalSearchParams, useRouter, useSegments } from 'expo-router'
import { useFormik } from 'formik'
import { ScrollView, Text, View } from 'react-native'
import { Masks } from 'react-native-mask-input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '~/src/components/Card'
import { Button, MaskedInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { Freight } from '~/src/types'
import { useFreight } from '~/src/hooks/useFreight'
import {
  numberMask,
  centsToMaskValue,
  maskValueToCents,
} from '~/src/utils/forms'
import api from '~/src/services/api'
import { useEffect } from 'react'
import Toast from 'react-native-toast-message'

type RouteParams = {
  id: string
}

export default function App() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const segments = useSegments()
  const queryClient = useQueryClient()
  const { id } = useLocalSearchParams<RouteParams>()
  const { data: item } = useFreight(Number(id))

  const mutation = useMutation({
    mutationFn: async (values: {
      tons_loaded?: string
      toll_cost?: string
      discharge?: string
      break_ton?: string
      insurance?: string
      taxa_adm?: string
    }) => {
      const payload: {
        tons_loaded?: number
        toll_cost?: number
        discharge?: number
        break_ton?: number
        insurance?: number
        taxa_adm?: number
      } = {}

      // Sempre envia tons_loaded se tiver valor (campo obrigatório)
      if (values.tons_loaded && values.tons_loaded.trim() !== '') {
        const tonsValue = Number(
          values.tons_loaded.replace(/\D/g, '').replace(',', '.'),
        )
        if (!isNaN(tonsValue) && tonsValue > 0) {
          payload.tons_loaded = tonsValue
        }
      }

      // Envia toll_cost se tiver valor (já em centavos)
      if (values.toll_cost && values.toll_cost.trim() !== '') {
        const tollValue = maskValueToCents(values.toll_cost)
        if (tollValue > 0) {
          payload.toll_cost = tollValue
        }
      }

      // Envia discharge se tiver valor (kg de quebra - número)
      if (values.discharge && values.discharge.trim() !== '') {
        const dischargeValue = Number(
          values.discharge.replace(/\D/g, '').replace(',', '.'),
        )
        if (!isNaN(dischargeValue) && dischargeValue > 0) {
          payload.discharge = dischargeValue
        }
      }

      // Envia break_ton se tiver valor (total de kg descarregado - número)
      if (values.break_ton && values.break_ton.trim() !== '') {
        const breakTonValue = Number(
          values.break_ton.replace(/\D/g, '').replace(',', '.'),
        )
        if (!isNaN(breakTonValue) && breakTonValue > 0) {
          payload.break_ton = breakTonValue
        }
      }

      // Envia insurance se tiver valor (valor seguro - em centavos)
      if (values.insurance && values.insurance.trim() !== '') {
        const insuranceValue = maskValueToCents(values.insurance)
        if (insuranceValue > 0) {
          payload.insurance = insuranceValue
        }
      }

      // Envia taxa_adm se tiver valor (valor taxa adm - em centavos)
      if (values.taxa_adm && values.taxa_adm.trim() !== '') {
        const taxaAdmValue = maskValueToCents(values.taxa_adm)
        if (taxaAdmValue > 0) {
          payload.taxa_adm = taxaAdmValue
        }
      }

      if (Object.keys(payload).length === 0) {
        throw new Error('Preencha pelo menos o peso carregado')
      }

      const response = await api.put<{ data: Freight }>(
        `/v1/driver/freight/${id}`,
        payload,
      )

      if (response.status !== 200) {
        throw new Error('Erro ao atualizar detalhes da carga')
      }

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight', Number(id)] })
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Detalhes da carga atualizados com sucesso',
      })
      router.back()
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar freight:', error)
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Erro ao atualizar detalhes da carga',
      })
    },
  })

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik<{
    tonsLoaded?: string
    tollCost?: string
    discharge?: string
    breakTon?: string
    insurance?: string
    taxaAdm?: string
  }>({
    enableReinitialize: true,
    initialValues: {
      tonsLoaded: item?.tonsLoaded?.toString() || '',
      tollCost: centsToMaskValue(item?.tollCost),
      discharge: item?.discharge?.toString() || '',
      breakTon: item?.breakTon?.toString() || '',
      insurance: centsToMaskValue(item?.insurance),
      taxaAdm: centsToMaskValue(item?.taxaAdm),
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync({
        tons_loaded: values.tonsLoaded || '',
        toll_cost: values.tollCost || '',
        discharge: values.discharge || '',
        break_ton: values.breakTon || '',
        insurance: values.insurance || '',
        taxa_adm: values.taxaAdm || '',
      })
    },
  })

  useEffect(() => {
    if (item) {
      setFieldValue('tonsLoaded', item.tonsLoaded?.toString() || '')
      setFieldValue('tollCost', centsToMaskValue(item.tollCost))
      setFieldValue('discharge', item.discharge?.toString() || '')
      setFieldValue('breakTon', item.breakTon?.toString() || '')
      setFieldValue('insurance', centsToMaskValue(item.insurance))
      setFieldValue('taxaAdm', centsToMaskValue(item.taxaAdm))
    }
  }, [item, setFieldValue])

  return (
    <Layout
      style={{
        paddingBottom: insets.bottom,
      }}
      className="w-full h-full bg-zinc-100 "
    >
      <Header
        align="items-center"
        onBackButtonPressed={() => {
          // Verifica se está na rota de viagens e se pode voltar
          const isViagensRoute = segments[0] === 'viagens'

          // Se está na rota de viagens e tem mais de 2 segmentos, pode voltar
          // Caso contrário, redireciona para home
          if (isViagensRoute && segments.length > 2) {
            try {
              router.back()
            } catch {
              router.replace('/home')
            }
          } else {
            router.replace('/home')
          }
        }}
      >
        <Text className="text-2xl text-white">Detalhes da carga</Text>
      </Header>
      <ScrollView className="p-4">
        {item && (
          <Card className="mb-6">
            <Text className="mb-4 text-lg font-semibold">
              Informações da cotação
            </Text>
            <View className="flex-row flex-wrap gap-4">
              {item.contractorName && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Transportadora</Text>
                  <Text className="text-sm font-medium">
                    {item.contractorName}
                  </Text>
                </View>
              )}
              {item.estimatedTonnage && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Peso estimado</Text>
                  <Text className="text-sm font-medium">
                    {(item.estimatedTonnage / 1000).toLocaleString('pt-BR', {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}{' '}
                    ton
                  </Text>
                </View>
              )}
              {item.tonValue && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">
                    Preço por tonelada
                  </Text>
                  <Text className="text-sm font-medium">
                    R${' '}
                    {(item.tonValue / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              )}
              {item.estimatedFuelCost && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Preço do diesel</Text>
                  <Text className="text-sm font-medium">
                    R${' '}
                    {(item.estimatedFuelCost / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              )}
              {item.fuelAvgPerKm && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">
                    Média do caminhão
                  </Text>
                  <Text className="text-sm font-medium">
                    {(item.fuelAvgPerKm / 10).toLocaleString('pt-BR', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{' '}
                    km/l
                  </Text>
                </View>
              )}
              {item.truckCurrentKm && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Km atual</Text>
                  <Text className="text-sm font-medium">
                    {item.truckCurrentKm.toLocaleString('pt-BR')} km
                  </Text>
                </View>
              )}
              {item.truckLocation && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Localização</Text>
                  <Text className="text-sm font-medium">
                    {item.truckLocation}
                  </Text>
                </View>
              )}
              {item.routeDistanceKm && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Distância</Text>
                  <Text className="text-sm font-medium">
                    {item.routeDistanceKm}
                  </Text>
                </View>
              )}
              {item.routeDuration && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Duração</Text>
                  <Text className="text-sm font-medium">
                    {item.routeDuration}
                  </Text>
                </View>
              )}
              {item.startFreightCity && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Origem</Text>
                  <Text className="text-sm font-medium">
                    {item.startFreightCity}
                  </Text>
                </View>
              )}
              {item.endFreightCity && (
                <View className="flex-1 min-w-[45%]">
                  <Text className="text-xs text-gray-500">Destino</Text>
                  <Text className="text-sm font-medium">
                    {item.endFreightCity}
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
        <Text className="mt-2 mb-6 text-xl font-semibold">
          Mais informações sobre a carga
        </Text>
        <Card className="mb-6">
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                required
                mask={numberMask}
                label="Peso carregado"
                value={values.tonsLoaded}
                onChangeText={handleChange('tonsLoaded')}
              />
            </View>
            <Text className="mt-2 font-semibold ">Kg</Text>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Pedágio incluso"
            value={values.tollCost}
            onChangeText={handleChange('tollCost')}
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={numberMask}
                label="Quebra"
                value={values.breakTon}
                onChangeText={handleChange('breakTon')}
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">kg</Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Seguro"
                value={values.insurance}
                onChangeText={handleChange('insurance')}
                keyboardType="numeric"
              />
            </View>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Taxa ADM"
            value={values.taxaAdm}
            onChangeText={handleChange('taxaAdm')}
            keyboardType="numeric"
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={numberMask}
                label="Descarga"
                onChangeText={handleChange('discharge')}
                value={values.discharge}
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">kg</Text>
          </View>
        </Card>
        <Button
          loading={mutation.isPending}
          onPress={() => handleSubmit()}
          disabled={!values.tonsLoaded}
        >
          Salvar
        </Button>
      </ScrollView>
    </Layout>
  )
}
