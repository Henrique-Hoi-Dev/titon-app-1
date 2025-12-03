import { useAuth } from '~/src/context/auth'
import { Layout, Header } from '~/src/components/Layout'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useRouter, useSegments } from 'expo-router'
import React, { useState, useEffect } from 'react'
import Card from '~/src/components/Card'
import {
  Button,
  PasswordInput,
  TextInput,
  DateInput,
  Select,
} from '~/src/components/Form'
import { useMutation } from '~/src/hooks/useMutation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '~/src/services/api'
import { useFormik } from 'formik'
import Toast from 'react-native-toast-message'

// Função para formatar data para o backend (ISO string)
const formatDateForBackend = (
  dateString: string | undefined,
): string | undefined => {
  if (!dateString || dateString.length !== 10) return undefined
  // Converte de DD/MM/YYYY para YYYY-MM-DD
  const [day, month, year] = dateString.split('/')
  if (day && month && year) {
    return `${year}-${month}-${day}`
  }
  return undefined
}

// Função para formatar data do backend para o input (DD/MM/YYYY)
const formatDateFromBackend = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return ''
  try {
    // Se já está no formato DD/MM/YYYY, retorna como está
    if (dateString.includes('/') && dateString.length === 10) {
      return dateString
    }
    // Se é uma string ISO (ex: "2024-11-17T00:00:00.000Z"), converte
    // Remove a parte de tempo se existir
    const dateOnly = dateString.split('T')[0]
    const [year, month, day] = dateOnly.split('-')
    if (year && month && day) {
      return `${day}/${month}/${year}`
    }
    // Fallback: tenta criar um Date object
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const dayFormatted = String(date.getDate()).padStart(2, '0')
    const monthFormatted = String(date.getMonth() + 1).padStart(2, '0')
    const yearFormatted = date.getFullYear()
    return `${dayFormatted}/${monthFormatted}/${yearFormatted}`
  } catch {
    return ''
  }
}

function AccountTab() {
  const { user, getUser } = useAuth()
  const queryClient = useQueryClient()

  const states = useQuery({
    queryKey: ['states'],
    queryFn: async () => {
      const response = await api.get<{
        data: {
          id: number
          name: string
          uf: string
        }[]
      }>('/driver/states')
      return response.data.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: {
      name?: string
      phone?: string
      email?: string
      number_cnh?: string
      valid_cnh?: string
      date_valid_mopp?: string
      date_valid_nr20?: string
      date_valid_nr35?: string
      date_admission?: string
      gender?: string
      date_birthday?: string
      address?: {
        street?: string
        number?: string
        complement?: string
        state?: string
        city?: string
      }
    }) => {
      const payload: {
        name?: string
        phone?: string
        email?: string
        number_cnh?: string
        valid_cnh?: string
        date_valid_mopp?: string
        date_valid_nr20?: string
        date_valid_nr35?: string
        date_admission?: string
        gender?: string
        date_birthday?: string
        address?: {
          street?: string
          number?: string
          complement?: string
          state?: string
          city?: string
        }
      } = {}

      if (values.name) payload.name = values.name
      if (values.phone) payload.phone = values.phone
      if (values.email) payload.email = values.email
      if (values.number_cnh) payload.number_cnh = values.number_cnh
      if (values.valid_cnh)
        payload.valid_cnh = formatDateForBackend(values.valid_cnh)
      if (values.date_valid_mopp)
        payload.date_valid_mopp = formatDateForBackend(values.date_valid_mopp)
      if (values.date_valid_nr20)
        payload.date_valid_nr20 = formatDateForBackend(values.date_valid_nr20)
      if (values.date_valid_nr35)
        payload.date_valid_nr35 = formatDateForBackend(values.date_valid_nr35)
      if (values.date_admission)
        payload.date_admission = formatDateForBackend(values.date_admission)
      if (values.gender) payload.gender = values.gender
      if (values.date_birthday)
        payload.date_birthday = formatDateForBackend(values.date_birthday)

      if (values.address) {
        payload.address = {}
        if (values.address.street)
          payload.address.street = values.address.street
        if (values.address.number)
          payload.address.number = values.address.number
        if (values.address.complement)
          payload.address.complement = values.address.complement
        if (values.address.state) payload.address.state = values.address.state
        if (values.address.city) payload.address.city = values.address.city
      }

      const response = await api.put('/v1/driver/update-profile', payload)

      if (response.status !== 200) {
        throw new Error('Erro ao atualizar perfil')
      }

      return response.data
    },
    onSuccess: async () => {
      // Recarrega o perfil do usuário
      // Passa undefined para getUser para que ele use o token do AsyncStorage automaticamente
      // Isso evita a duplicação do token no header
      try {
        if (getUser) {
          // Passa undefined para que o getUser busque o token do AsyncStorage internamente
          // O Api.get dentro do getUser já adiciona o token automaticamente
          await getUser(undefined)
        }
      } catch (error) {
        // Se falhar ao recarregar o perfil, apenas loga o erro mas não desloga
        // O perfil já foi atualizado com sucesso, então não é crítico
        console.warn('Erro ao recarregar perfil após atualização:', error)
      }

      queryClient.invalidateQueries({ queryKey: ['states'] })
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Perfil atualizado com sucesso',
      })
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Erro ao atualizar perfil',
      })
    },
  })

  // Função helper para limpar o estado
  const cleanStateValue = (state: string | null | undefined): string => {
    if (!state) return ''
    return state.trim().replace(/\?/g, '').replace(/&/g, '').trim()
  }

  const [selectedState, setSelectedState] = useState<string>(() => {
    return cleanStateValue(user?.address?.state)
  })

  // Estado limpo para usar na query
  const cleanSelectedState = cleanStateValue(selectedState)

  const cities = useQuery({
    queryKey: ['cities', cleanSelectedState],
    queryFn: async () => {
      if (!cleanSelectedState) return []

      // Garante que o valor está realmente limpo antes de enviar
      const finalState = cleanStateValue(cleanSelectedState)
      console.log(
        'Estado sendo enviado na query:',
        finalState,
        'Tamanho:',
        finalState.length,
      )

      // Passa o parâmetro como data, não na URL, para evitar duplicação do ?
      const response = await api.get<{
        data: {
          id: number
          name: string
          states: {
            uf: string
          }
        }[]
      }>('/driver/cities', { uf: finalState })
      return response.data.data
    },
    enabled: !!cleanSelectedState,
  })

  // Helper para pegar valor em camelCase ou snake_case do user
  const getUserValue = (camelKey: string, snakeKey: string) => {
    if (!user) return null
    const userRecord = user as Record<string, unknown>
    return userRecord[camelKey] ?? userRecord[snakeKey] ?? null
  }

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      number_cnh: (getUserValue('numberCnh', 'number_cnh') as string) || '',
      valid_cnh:
        formatDateFromBackend(
          getUserValue('validCnh', 'valid_cnh') as string | null | undefined,
        ) || '',
      date_valid_mopp:
        formatDateFromBackend(
          getUserValue('dateValidMopp', 'date_valid_mopp') as
            | string
            | null
            | undefined,
        ) || '',
      date_valid_nr20:
        formatDateFromBackend(
          getUserValue('dateValidNr20', 'date_valid_nr20') as
            | string
            | null
            | undefined,
        ) || '',
      date_valid_nr35:
        formatDateFromBackend(
          getUserValue('dateValidNr35', 'date_valid_nr35') as
            | string
            | null
            | undefined,
        ) || '',
      date_admission:
        formatDateFromBackend(
          getUserValue('dateAdmission', 'date_admission') as
            | string
            | null
            | undefined,
        ) || '',
      gender: user?.gender || '',
      date_birthday:
        formatDateFromBackend(
          getUserValue('dateBirthday', 'date_birthday') as
            | string
            | null
            | undefined,
        ) || '',
      address: {
        street: user?.address?.street || '',
        number: user?.address?.number || '',
        complement: user?.address?.complement || '',
        state: user?.address?.state || '',
        city: user?.address?.city || '',
      },
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values)
    },
  })

  useEffect(() => {
    if (user) {
      // Helper para pegar valor em camelCase ou snake_case
      const getValue = (
        obj: Record<string, unknown>,
        camelKey: string,
        snakeKey: string,
      ) => {
        return obj[camelKey] ?? obj[snakeKey] ?? null
      }

      const userRecord = user as Record<string, unknown>

      // Pega os valores de data em ambos os formatos (camelCase e snake_case)
      const validCnh =
        formatDateFromBackend(
          getValue(userRecord, 'validCnh', 'valid_cnh') as
            | string
            | null
            | undefined,
        ) || ''
      const dateValidMopp =
        formatDateFromBackend(
          getValue(userRecord, 'dateValidMopp', 'date_valid_mopp') as
            | string
            | null
            | undefined,
        ) || ''
      const dateValidNr20 =
        formatDateFromBackend(
          getValue(userRecord, 'dateValidNr20', 'date_valid_nr20') as
            | string
            | null
            | undefined,
        ) || ''
      const dateValidNr35 =
        formatDateFromBackend(
          getValue(userRecord, 'dateValidNr35', 'date_valid_nr35') as
            | string
            | null
            | undefined,
        ) || ''
      const dateAdmission =
        formatDateFromBackend(
          getValue(userRecord, 'dateAdmission', 'date_admission') as
            | string
            | null
            | undefined,
        ) || ''
      const dateBirthday =
        formatDateFromBackend(
          getValue(userRecord, 'dateBirthday', 'date_birthday') as
            | string
            | null
            | undefined,
        ) || ''

      setFieldValue('name', user.name || '')
      setFieldValue('phone', user.phone || '')
      setFieldValue('email', user.email || '')
      setFieldValue(
        'number_cnh',
        (getValue(userRecord, 'numberCnh', 'number_cnh') as string) || '',
      )
      setFieldValue('valid_cnh', validCnh)
      setFieldValue('date_valid_mopp', dateValidMopp)
      setFieldValue('date_valid_nr20', dateValidNr20)
      setFieldValue('date_valid_nr35', dateValidNr35)
      setFieldValue('date_admission', dateAdmission)
      setFieldValue('gender', user.gender || '')
      setFieldValue('date_birthday', dateBirthday)
      setFieldValue('address.street', user.address?.street || '')
      setFieldValue('address.number', user.address?.number || '')
      setFieldValue('address.complement', user.address?.complement || '')
      // Limpa o estado usando a função helper
      const cleanState = cleanStateValue(user.address?.state)
      setFieldValue('address.state', cleanState)
      setFieldValue('address.city', user.address?.city || '')
      setSelectedState(cleanState)
    }
  }, [user, setFieldValue])

  const stateOptions =
    states.data?.map((state) => ({
      label: `${state.name} (${state.uf})`,
      value: (state.uf || '').trim().replace(/[?&]/g, ''),
    })) || []

  const cityOptions =
    cities.data?.map((city) => ({
      label: city.name,
      value: city.name,
    })) || []

  return (
    <ScrollView className="mb-10">
      <Card>
        <Text className="mb-4 text-lg font-semibold">Informações Pessoais</Text>
        <TextInput
          label="Nome"
          value={values.name}
          onChangeText={handleChange('name')}
        />
        <TextInput
          label="Celular"
          value={values.phone}
          onChangeText={handleChange('phone')}
          keyboardType="phone-pad"
        />
        <TextInput
          label="E-mail"
          value={values.email}
          onChangeText={handleChange('email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Select
          label="Gênero"
          value={values.gender}
          data={[
            { label: 'Masculino', value: 'M' },
            { label: 'Feminino', value: 'F' },
            { label: 'Outro', value: 'O' },
          ]}
          onSelect={(item) => setFieldValue('gender', item?.value || '')}
        />
        <DateInput
          placeholder="Data de Nascimento"
          value={values.date_birthday}
          onChangeText={(text) => setFieldValue('date_birthday', text || '')}
        />
      </Card>

      <Card className="mt-4">
        <Text className="mb-4 text-lg font-semibold">CNH e Certificações</Text>
        <TextInput
          label="Número da CNH"
          value={values.number_cnh}
          onChangeText={handleChange('number_cnh')}
        />
        <DateInput
          placeholder="Validade da CNH"
          value={values.valid_cnh}
          onChangeText={(text) => setFieldValue('valid_cnh', text || '')}
        />
        <DateInput
          placeholder="Validade MOPP"
          value={values.date_valid_mopp}
          onChangeText={(text) => setFieldValue('date_valid_mopp', text || '')}
        />
        <DateInput
          placeholder="Validade NR20"
          value={values.date_valid_nr20}
          onChangeText={(text) => setFieldValue('date_valid_nr20', text || '')}
        />
        <DateInput
          placeholder="Validade NR35"
          value={values.date_valid_nr35}
          onChangeText={(text) => setFieldValue('date_valid_nr35', text || '')}
        />
        <DateInput
          placeholder="Data de Admissão"
          value={values.date_admission}
          onChangeText={(text) => setFieldValue('date_admission', text || '')}
        />
      </Card>

      <Card className="mt-4">
        <Text className="mb-4 text-lg font-semibold">Endereço</Text>
        <TextInput
          label="Rua"
          value={values.address.street}
          onChangeText={(text) => setFieldValue('address.street', text)}
        />
        <View className="flex-row gap-4">
          <View className="flex-1">
            <TextInput
              label="Número"
              value={values.address.number}
              onChangeText={(text) => setFieldValue('address.number', text)}
            />
          </View>
          <View className="flex-1">
            <TextInput
              label="Complemento"
              value={values.address.complement}
              onChangeText={(text) => setFieldValue('address.complement', text)}
            />
          </View>
        </View>
        <Select
          label="Estado"
          value={values.address.state}
          data={stateOptions}
          onSelect={(item) => {
            // Garante que apenas o valor limpo (UF) seja usado, sem caracteres especiais
            const stateValue = cleanStateValue(item?.value)
            setFieldValue('address.state', stateValue)
            setFieldValue('address.city', '') // Limpa cidade quando muda estado
            setSelectedState(stateValue) // Atualiza o estado selecionado para buscar cidades
          }}
          loading={states.isLoading}
        />
        <Select
          label="Cidade"
          value={values.address.city}
          data={cityOptions}
          onSelect={(item) => setFieldValue('address.city', item?.value || '')}
          loading={cities.isLoading}
        />
      </Card>

      <Button
        className="mt-4 mb-8"
        onPress={() => handleSubmit()}
        loading={mutation.isPending}
      >
        Salvar Alterações
      </Button>
    </ScrollView>
  )
}

function SecurityTab() {
  const { user: _user } = useAuth()
  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      await mutation.mutateAsync(values)
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: {
      password: string
      confirmPassword: string
    }) => {
      if (!values.password) {
        throw new Error('Senha é obrigatória')
      }
      if (values.password !== values.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      const response = await api.put('/v1/driver/forgot-password', {
        password: values.password,
      })

      if (response.status !== 200) {
        throw new Error('Erro ao atualizar senha')
      }

      return response.data
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Senha atualizada com sucesso',
      })
      // Limpa os campos após sucesso
      setFieldValue('password', '')
      setFieldValue('confirmPassword', '')
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: error.message || 'Erro ao atualizar senha',
      })
    },
  })

  return (
    <>
      <Text className="text-base text-primary-500 my-4 text-center">
        Sua nova senha deve ser diferente da senha anterior
      </Text>
      <Card>
        <PasswordInput
          label="Senha"
          placeholder="Insira sua senha"
          value={values.password}
          onChangeText={handleChange('password')}
        />
        <PasswordInput
          label="Confirmar senha"
          placeholder="Insira sua senha novamente"
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
        />
      </Card>
      <Button
        className="mt-4"
        onPress={() => handleSubmit()}
        loading={mutation.isPending}
      >
        Atualizar
      </Button>
    </>
  )
}

export default function Profile() {
  const router = useRouter()
  const segments = useSegments()
  const [tab, setTab] = useState<'account' | 'security'>('account')
  return (
    <Layout className="w-full h-full bg-zinc-200">
      <Header
        onBackButtonPressed={() => {
          try {
            // Verifica se há segmentos suficientes para voltar
            if (segments.length > 1) {
              router.back()
            } else {
              router.replace('/home')
            }
          } catch (error) {
            console.warn('Erro ao voltar, redirecionando para home:', error)
            router.replace('/home')
          }
        }}
      >
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
