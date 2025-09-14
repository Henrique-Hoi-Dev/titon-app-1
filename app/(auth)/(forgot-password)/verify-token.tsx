import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Text } from 'react-native'
import Toast from 'react-native-toast-message'
import { Button } from '~/src/components/Form'
import PinInput from '~/src/components/Form/Inputs/PinInput'
import { Header, Layout } from '~/src/components/Layout'
import api from '~/src/services/api'

export default function App() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, _setError] = useState('')

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await api.post('/driver/code-validation', {
        code,
      })

      if (response.status !== 200) {
        throw new Error(
          'Erro ao validar o código, verifique o código informado e tente novamente.'
        )
      }

      return response.data
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message,
      })
    },
    onSuccess: () => {
      router.navigate('/(auth)/(forgot-password)/change-password')
    },
  })

  const verifyCode = async (code: string) => {
    return await mutation.mutateAsync(code)
  }

  return (
    <Layout className="bg-zinc-200">
      <Header>
        <Text className="text-white text-2xl -mt-1.5 pr-10">
          Verifique seu WhatsApp
        </Text>
      </Header>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          alignItems: 'center',
        }}
      >
        <Image
          source={require('~/assets/images/whatsapp-and-shield.png')}
          className="w-11/12"
          resizeMode="contain"
        />
        <Text className="text-center text-sm my-4 font-medium text-primary-500">
          Para recuperar sua senha, por favor, insira o código de 4 dígitos que
          enviamos para o seu WhatsApp.
        </Text>
        <PinInput
          length={4}
          onChangeText={setCode}
          value={code}
          error={error}
        />
        <Button
          className="w-full mt-4"
          onPress={() => verifyCode(code)}
          loading={mutation.isPending}
        >
          Validar código
        </Button>
      </ScrollView>
    </Layout>
  )
}
