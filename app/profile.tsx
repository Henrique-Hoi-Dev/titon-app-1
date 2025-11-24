import { useAuth } from '~/src/context/auth'
import { Layout, Header } from '~/src/components/Layout'
import { Pressable, ScrollView, Text, View } from 'react-native'
// import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import Card from '~/src/components/Card'
import { Button, PasswordInput, TextInput } from '~/src/components/Form'
import { useMutation } from '~/src/hooks/useMutation'
import api from '~/src/services/api'

function AccountTab() {
  const { user } = useAuth()
  return (
    <Card>
      <TextInput label="Nome" editable={false} value={user?.name} />
      <TextInput label="Celular" editable={false} value={user?.phone || ''} />
      <TextInput label="E-mail" editable={false} value={user?.email || ''} />
    </Card>
  )
}

function SecurityTab() {
  const { user: _user } = useAuth()
  const _mutation = useMutation({
    mutationFn: async () => {
      await api.put(`/driver/forgot-password`)
    },
    onErrorMessage: 'Erro ao atualizar senha',
    onSuccessMessage: 'Senha atualizada com sucesso',
  })
  return (
    <>
      <Text className="text-base text-primary-500 my-4 text-center">
        Sua nova senha deve ser diferente da senha anterior
      </Text>
      <Card>
        <PasswordInput label="Senha" placeholder="Insira sua senha" />
        <PasswordInput
          label="Confirmar senha"
          placeholder="Insira sua senha novamente"
        />
      </Card>
      <Button className="mt-4">Atualizar</Button>
    </>
  )
}

export default function Profile() {
  const [tab, setTab] = useState<'account' | 'security'>('account')
  return (
    <Layout className="w-full h-full bg-zinc-200">
      <Header>
        <Text className="mb-3 -mt-1 text-lg font-semibold text-white">
          Perfil
        </Text>
      </Header>
      <View className="flex-row justify-around w-full px-6 py-4 bg-transparent">
        <Pressable
          onPress={() => setTab('account')}
          className={`px-6 ${
            tab === 'account' ? 'border-b-[3px] border-primary-500' : ''
          }`}
        >
          <Text className="text-sm text-primary py-2">Conta</Text>
        </Pressable>
        <Pressable
          onPress={() => setTab('security')}
          className={`px-6 ${
            tab === 'security' ? 'border-b-[3px] border-primary-500' : ''
          }`}
        >
          <Text className="text-sm text-primary py-2">Segurança</Text>
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          minHeight: '80%',
        }}
      >
        {tab === 'account' && <AccountTab />}
        {tab === 'security' && <SecurityTab />}
      </ScrollView>
    </Layout>
  )
}
