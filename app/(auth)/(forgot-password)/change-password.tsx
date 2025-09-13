import { useState } from 'react'
import { Image, ScrollView, Text } from 'react-native'
import Card from '~/src/components/Card'
import { Button, PasswordInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'

export default function App() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  return (
    <Layout className="bg-zinc-200">
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
        <Card>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            label="Senha"
            placeholder="Insira sua nova senha"
            calculateStrength
          />
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            label="Confirmar senha"
            placeholder="Confirme sua nova senha novamente"
          />
        </Card>
        <Button className="w-full mt-4">Salvar nova senha</Button>
      </ScrollView>
    </Layout>
  )
}
