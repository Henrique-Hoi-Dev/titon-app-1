import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFormik } from 'formik'
import { ScrollView, Text, View } from 'react-native'
import { Masks } from 'react-native-mask-input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Stringable } from '~/src/@types/utils'
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
  const queryClient = useQueryClient()
  const { id } = useLocalSearchParams<RouteParams>()
  const { data: item } = useFreight(Number(id))

  const mutation = useMutation({
    mutationFn: async (values: {
      tons_loaded?: string
      toll_cost?: string
      discharge?: string
    }) => {
      const payload: {
        tons_loaded?: number
        toll_cost?: number
        discharge?: number
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

      // Envia discharge se tiver valor (já em centavos)
      if (values.discharge && values.discharge.trim() !== '') {
        const dischargeValue = maskValueToCents(values.discharge)
        if (dischargeValue > 0) {
          payload.discharge = dischargeValue
        }
      }

      if (Object.keys(payload).length === 0) {
        throw new Error('Preencha pelo menos o peso entregue')
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

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik<
    Partial<
      Stringable<
        Freight,
        | 'id'
        | 'financial_statements_id'
        | 'createdAt'
        | 'updatedAt'
        | 'status'
        | 'is_on_the_way'
      >
    >
  >({
    enableReinitialize: true,
    initialValues: {
      tons_loaded: item?.tons_loaded?.toString() || '',
      toll_cost: centsToMaskValue(item?.toll_cost),
      discharge: centsToMaskValue(item?.discharge),
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync({
        tons_loaded: values.tons_loaded,
        toll_cost: values.toll_cost,
        discharge: values.discharge,
      })
    },
  })

  useEffect(() => {
    if (item) {
      setFieldValue('tons_loaded', item.tons_loaded?.toString() || '')
      setFieldValue('toll_cost', centsToMaskValue(item.toll_cost))
      setFieldValue('discharge', centsToMaskValue(item.discharge))
    }
  }, [item, setFieldValue])

  return (
    <Layout
      style={{
        paddingBottom: insets.bottom,
      }}
      className="w-full h-full bg-zinc-100 "
    >
      <Header align="items-center">
        <Text className="text-2xl text-white">Detalhes da carga</Text>
      </Header>
      <ScrollView className="p-4">
        <Text className="mt-2 mb-6 text-xl font-semibold">
          Mais informações sobre a carga
        </Text>
        <Card className="mb-6">
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                required
                mask={numberMask}
                label="Peso entregue"
                value={values.tons_loaded}
                onChangeText={handleChange('tons_loaded')}
              />
            </View>
            <Text className="mt-2 font-semibold ">ton</Text>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Pedágio incluso"
            value={values.toll_cost}
            onChangeText={handleChange('toll_cost')}
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Quebra"
                value="0"
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">ton</Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Seguro"
                value="0"
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">R$/ton</Text>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Taxa ADM"
            value="0"
            keyboardType="numeric"
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Descarga"
                onChangeText={handleChange('discharge')}
                value={values.discharge}
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">R$/ton</Text>
          </View>
        </Card>
        <Button
          loading={mutation.isPending}
          onPress={() => handleSubmit()}
          disabled={!values.tons_loaded}
        >
          Salvar
        </Button>
      </ScrollView>
    </Layout>
  )
}
