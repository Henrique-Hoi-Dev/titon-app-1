import { useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, Alert, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Layout } from '~/src/components/Layout'
import { useFreight } from '~/src/hooks/useFreight'
import Feedback from '~/src/components/Layout/Feedback'
import { Button, MaskedInput } from '~/src/components/Form'
import { numberMask } from '~/src/utils/forms'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '~/src/services/api'
type RouteParams = {
  id: string
}

export default function App() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<RouteParams>()
  const { data: item, loading } = useFreight(Number(id))
  const [km, setKm] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.put(`/v1/driver/freight/finished-trip/${id}`, {
        truck_km_completed_trip: km,
      })

      if (response.status !== 200) {
        throw new Error('Erro ao finalizar viagem')
      }

      return response.data
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['financialStatement'],
      })
      router.back()
    },
  })

  if (!item && loading) {
    return (
      <Layout
        style={{
          paddingBottom: insets.bottom,
        }}
        className="items-center justify-center w-full h-full bg-zinc-100 "
      >
        <ActivityIndicator size="large" color="#1757D4" />
      </Layout>
    )
  }

  return (
    <Layout
      style={{
        paddingBottom: insets.bottom,
      }}
      className="w-full h-full bg-zinc-100 "
    >
      <Feedback.Root
        title="Finalizar rota"
        type="finalizar"
        onClose={() => {
          router.back()
        }}
      >
        <Feedback.Heading className="py-6 text-base font-medium text-left text-black">
          Para finalizar sua viagem, informe a quilometragem final.
        </Feedback.Heading>
        <View
          className="justify-between flex-1"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <View className="flex flex-row items-center justify-between gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={numberMask}
                value={km}
                onChangeText={setKm}
                keyboardType="numeric"
              />
            </View>
            <Text className="-mt-4 text-lg font-medium ">km</Text>
          </View>
          <Button
            loading={mutation.isPending}
            onPress={() => mutation.mutateAsync()}
          >
            Enviar
          </Button>
        </View>
      </Feedback.Root>
    </Layout>
  )
}
