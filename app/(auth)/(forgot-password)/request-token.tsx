import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Text } from 'react-native'
import { Masks } from 'react-native-mask-input'
import Toast from 'react-native-toast-message'
import { Button, MaskedInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import api from '~/src/services/api'

export default function App() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await api.post('/driver/code-request', {
        phone,
      })

      if (response.status !== 200) {
        throw new Error(
          'Erro ao enviar código, verifique o número informado e tente novamente.'
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
      router.navigate('/(auth)/(forgot-password)/verify-token')
    },
  })

  const sendCode = async (phone: string) => {
    phone = phone.replace(/\D/g, '')
    if (!phone) {
      setError('O campo é obrigatório')
      return
    }

    if (phone.length < 11) {
      setError('O número informado é inválido')
      return
    }

    return await mutation.mutateAsync(`+55${phone}`)
  }

  return (
    <Layout className="bg-zinc-200 w-full h-full">
      <Header>
        <Text className="text-white text-2xl -mt-1.5 pr-10">
          Esqueci a Senha
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
          source={require('~/assets/images/key-and-padlock.png')}
          className="w-11/12"
          resizeMode="contain"
        />
        <Text className="text-center text-sm my-4 font-medium text-primary-500">
          Para recuperar sua senha, por favor, insira o número do seu telefone
          celular.
        </Text>
        <MaskedInput
          value={phone}
          onChangeText={(text) => {
            setPhone(text)
            setError('')
          }}
          label="Celular"
          mask={Masks.BRL_PHONE}
          keyboardType="numeric"
          autoComplete="tel"
          placeholderFillCharacter="0"
          className="bg-white"
          error={error}
        />
        <Button
          loading={mutation.isPending}
          className="w-full mt-4"
          onPress={() => sendCode(phone)}
        >
          Enviar código
        </Button>
      </ScrollView>
    </Layout>
  )
}
