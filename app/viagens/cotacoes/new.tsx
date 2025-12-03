import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, MaskedInput, Select, TextInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Feedback from '~/src/components/Layout/Feedback/'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Freight } from '~/src/types/freight'
import { useFinancialStatement } from '~/src/hooks/useFinancialStatement'
import { useFreight } from '~/src/hooks/useFreight'
import Progress from '~/src/components/Progress'
import Card from '~/src/components/Card'
import Divider from '~/src/components/Divider'
import IconButton from '~/src/components/IconButton'
import { getError, numberMask } from '~/src/utils/forms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '~/src/services/api'
import { Data } from '~/src/services/types'
import { Masks } from 'react-native-mask-input'
type FreightFormValues = {
  start_freight_city: string
  end_freight_city: string
  start_freight_state: string
  end_freight_state: string
  location_of_the_truck: string
  location_state: string
  location_city: string
  contractor: string
  truck_current_km: string
  liter_of_fuel_per_km: string
  preview_tonne: string
  value_tonne: string
  preview_value_diesel: string
  distance?: string
  duration?: string
  status?: string
}

export const validationSchema = {
  1: Yup.object().shape({
    start_freight_state: Yup.string().required('Campo obrigatório'),
    start_freight_city: Yup.string().required('Campo obrigatório'),
    end_freight_state: Yup.string().required('Campo obrigatório'),
    end_freight_city: Yup.string().required('Campo obrigatório'),
  }),
  2: Yup.object().shape({
    location_state: Yup.string().required('Campo obrigatório'),
    location_city: Yup.string().required('Campo obrigatório'),
    truck_current_km: Yup.number().required('Campo obrigatório'),
    liter_of_fuel_per_km: Yup.number().required('Campo obrigatório'),
  }),

  3: Yup.object().shape({
    contractor: Yup.string().required('Campo obrigatório'),
    preview_tonne: Yup.number().required('Campo obrigatório'),
    value_tonne: Yup.string().required('Campo obrigatório'),
    preview_value_diesel: Yup.string().required('Campo obrigatório'),
  }),

  4: undefined,
}

export default function App() {
  const { freightId } = useLocalSearchParams<{
    freightId?: string
  }>()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const stepsLabels = {
    1: 'Para onde você quer ir?',
    2: 'Informações do veículo',
    3: 'Informações da carga',
    4: 'Resumo',
  }
  const [step, setStep] = useState<keyof typeof stepsLabels>(1)
  const [currentFreightId, setCurrentFreightId] = useState(freightId)
  const totalSteps = 4
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>(
    'success',
  )
  const [showFeedback, setShowFeedback] = useState(false)
  const queryClient = useQueryClient()
  const { data: financialStatement } = useFinancialStatement()

  // Buscar dados do frete se houver freightId (rascunho)
  const { data: existingFreight } = useFreight(
    currentFreightId ? Number(currentFreightId) : 0,
  )

  const {
    values,
    errors,
    handleChange,
    resetForm,
    setFieldError,
    setFieldValue,
    isValid,
    validateForm,
  } = useFormik<FreightFormValues>({
    initialValues: {
      start_freight_city: '',
      end_freight_city: '',
      start_freight_state: '',
      end_freight_state: '',
      location_of_the_truck: '',
      location_state: '',
      location_city: '',
      contractor: '',
      truck_current_km: '',
      liter_of_fuel_per_km: '',
      preview_tonne: '',
      value_tonne: '',
      preview_value_diesel: '',
    },
    validateOnMount: true,
    validationSchema: validationSchema[step],
    onSubmit: () => {
      // do nothing
    },
  })

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

  const cities = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await api.get<{
        data: {
          id: number
          name: string
          states: {
            uf: string
          }
        }[]
      }>(`/driver/cities`)

      return response.data.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: FreightFormValues) => {
      const apiMethod = !currentFreightId ? api.post : api.put

      // No step 1, enviar apenas start_freight_city e end_freight_city (já concatenados com estado)
      let payload: Data
      if (step === 1) {
        const startCity = `${values.start_freight_city} ${values.start_freight_state?.toUpperCase()}`
        const endCity = `${values.end_freight_city} ${values.end_freight_state?.toUpperCase()}`
        payload = {
          start_freight_city: startCity,
          end_freight_city: endCity,
        }
      } else {
        payload = {} as Data

        // No step 2, concatena cidade + estado para truck_location
        if (step === 2 && values.location_city && values.location_state) {
          payload.truck_location = `${values.location_city} ${values.location_state.toUpperCase()}`
        } else if (values.location_of_the_truck) {
          payload.truck_location = values.location_of_the_truck
        }

        // contractor_name só é enviado no step 3
        if (step === 3) {
          payload.contractor_name = values.contractor
        }

        if (values.liter_of_fuel_per_km) {
          payload.fuel_avg_per_km = Number(
            values.liter_of_fuel_per_km.replace(/\D/g, ''),
          )
        }
        if (values.preview_tonne) {
          payload.estimated_tonnage = Number(
            values.preview_tonne.replace(/\D/g, ''),
          )
        }
        if (values.value_tonne) {
          payload.ton_value = Number(values.value_tonne.replace(/\D/g, ''))
        }
        if (values.preview_value_diesel) {
          payload.estimated_fuel_cost = Number(
            values.preview_value_diesel.replace(/\D/g, ''),
          )
        }
        if (values.truck_current_km) {
          payload.truck_current_km = Number(
            values.truck_current_km.replace(/\D/g, ''),
          )
        }

        // No último passo, enviar status como PENDING
        if (step === totalSteps) {
          payload.status = 'PENDING'
        }
      }

      const url = `/v1/driver/freight${currentFreightId ? `/${currentFreightId}` : ''}`

      const response = await apiMethod<{
        data: Freight
        errors?: Record<keyof Freight, string>
      }>(url, payload)

      if (response.status === 201 || response.status === 200) {
        return response.data.data
      }

      if (response.status === 422 && response.data.errors) {
        Object.keys(response.data.errors).forEach((key) => {
          setFieldError(key, response.data.errors?.[key as keyof Freight] ?? '')
        })
      }

      throw new Error('Erro ao criar cotação')
    },
    onError: () => {
      if (step === totalSteps) {
        setFeedbackType('error')
        setShowFeedback(true)
      }
    },
    onSuccess: (data) => {
      if (step === 1) {
        if (!data.routeDuration || !data.routeDistanceKm) {
          // Quando cria (step 1), busca sem financial_id
          api
            .get<{
              data: Freight
            }>(`/v1/driver/freight/${data.id}/${financialStatement?.id}`)
            .then((response) => {
              handleChange('distance')(response.data.data.routeDistanceKm)
              handleChange('duration')(response.data.data.routeDuration)
            })
        } else {
          handleChange('distance')(data.routeDistanceKm)
          handleChange('duration')(data.routeDuration)
        }
        setCurrentFreightId(data.id.toString())
      }

      if (step === totalSteps) {
        setFeedbackType('success')
        setShowFeedback(true)
        queryClient.refetchQueries({
          queryKey: ['financialStatement'],
        })
        return
      }

      setStep((prev) => {
        if (prev === totalSteps) {
          setShowFeedback(true)
          return 1 as keyof typeof stepsLabels
        }
        return (prev + 1) as keyof typeof stepsLabels
      })
    },
  })

  useEffect(() => {
    validateForm()
  }, [step, validateForm])

  // Função para extrair cidade e estado de uma string "Cidade UF"
  const parseCityAndState = (cityState: string) => {
    const parts = cityState.trim().split(' ')
    if (parts.length >= 2) {
      const state = parts[parts.length - 1]
      const city = parts.slice(0, -1).join(' ')
      return { city, state }
    }
    return { city: cityState, state: '' }
  }

  // Preencher formulário quando houver frete existente (rascunho)
  useEffect(() => {
    if (existingFreight && existingFreight.status === 'DRAFT') {
      // Step 1: Cidades de origem e destino
      if (existingFreight.startFreightCity) {
        const start = parseCityAndState(existingFreight.startFreightCity)
        setFieldValue('start_freight_city', start.city)
        setFieldValue('start_freight_state', start.state)
      }
      if (existingFreight.endFreightCity) {
        const end = parseCityAndState(existingFreight.endFreightCity)
        setFieldValue('end_freight_city', end.city)
        setFieldValue('end_freight_state', end.state)
      }
      if (existingFreight.routeDistanceKm) {
        setFieldValue('distance', existingFreight.routeDistanceKm)
      }
      if (existingFreight.routeDuration) {
        setFieldValue('duration', existingFreight.routeDuration)
      }

      // Step 2: Informações do veículo
      if (existingFreight.truckLocation) {
        const location = parseCityAndState(existingFreight.truckLocation)
        setFieldValue('location_city', location.city)
        setFieldValue('location_state', location.state)
      }
      if (existingFreight.truckCurrentKm) {
        setFieldValue(
          'truck_current_km',
          existingFreight.truckCurrentKm.toString(),
        )
      }
      if (existingFreight.fuelAvgPerKm) {
        setFieldValue(
          'liter_of_fuel_per_km',
          existingFreight.fuelAvgPerKm.toString(),
        )
      }

      // Step 3: Informações da carga
      if (existingFreight.contractorName) {
        setFieldValue('contractor', existingFreight.contractorName)
      }
      if (existingFreight.estimatedTonnage) {
        // Converter de gramas para toneladas
        const tons = existingFreight.estimatedTonnage / 1000
        setFieldValue('preview_tonne', tons.toString())
      }
      if (existingFreight.tonValue) {
        setFieldValue('value_tonne', existingFreight.tonValue.toString())
      }
      if (existingFreight.estimatedFuelCost) {
        setFieldValue(
          'preview_value_diesel',
          existingFreight.estimatedFuelCost.toString(),
        )
      }

      // Determinar em qual step parar baseado nos dados preenchidos
      if (existingFreight.startFreightCity && existingFreight.endFreightCity) {
        if (
          existingFreight.truckLocation &&
          existingFreight.truckCurrentKm &&
          existingFreight.fuelAvgPerKm
        ) {
          if (
            existingFreight.contractorName &&
            existingFreight.estimatedTonnage &&
            existingFreight.tonValue &&
            existingFreight.estimatedFuelCost
          ) {
            // Todos os dados preenchidos, ir para step 4
            setStep(4)
          } else {
            // Step 2 completo, ir para step 3
            setStep(3)
          }
        } else {
          // Step 1 completo, ir para step 2
          setStep(2)
        }
      }
    }
  }, [existingFreight, setFieldValue])

  return (
    <Layout
      style={{
        paddingBottom: insets.bottom,
      }}
      className="w-full h-full bg-zinc-100 "
    >
      <Header>
        <Text className="text-white text-2xl -mt-1.5 pr-10">Nova Cotação</Text>
      </Header>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 24,
          paddingHorizontal: 16,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View className="flex flex-row items-center gap-x-2">
            {step !== 1 && (
              <IconButton
                icon="chevron-left"
                onPress={() => {
                  setStep((prev) => (prev - 1) as keyof typeof stepsLabels)
                }}
                size={20}
              />
            )}
            <Text className="my-2 text-lg font-medium ">
              Etapa {step} de {totalSteps}: {stepsLabels[step]}
            </Text>
          </View>
          <Progress value={(100 / totalSteps) * step} className="mt-6" />
          {step === 1 && (
            <Card className="pl-12 mt-8">
              <View className="absolute top-16 left-4">
                <View className="relative">
                  <View className="w-4 h-4 rounded-full bg-primary-600" />
                  <View
                    style={{
                      height:
                        100 +
                        (values.start_freight_state
                          ? 60 +
                            (getError(errors, 'start_freight_state').length
                              ? 16
                              : 0) +
                            (getError(errors, 'start_freight_city').length
                              ? 16
                              : 0)
                          : 0),
                    }}
                    className="absolute w-[2px] bg-primary-600 left-[7px]"
                  />
                  <View
                    style={{
                      top:
                        90 +
                        (values.start_freight_state
                          ? 60 +
                            (getError(errors, 'start_freight_state').length
                              ? 16
                              : 0) +
                            (getError(errors, 'start_freight_city').length
                              ? 16
                              : 0)
                          : 0),
                    }}
                    className="absolute w-4 h-4 rounded-full bg-primary-600"
                  />
                </View>
              </View>
              <Select
                required
                searchable
                value={values.start_freight_state}
                data={
                  states.data?.map((state) => ({
                    label: state.name,
                    value: state.uf,
                  })) ?? []
                }
                onSelect={(item) =>
                  handleChange('start_freight_state')(item?.value ?? '')
                }
                placeholder="Selecione o estado"
                label="De onde você sairá"
                error={getError(errors, 'start_freight_state')}
                loading={states.isFetching}
              />
              {values.start_freight_state && (
                <Select
                  required
                  searchable
                  value={values.start_freight_city as string}
                  data={
                    cities.data
                      ?.filter(
                        (city) => city.states.uf === values.start_freight_state,
                      )
                      .map((city) => ({
                        label: city.name,
                        value: city.name,
                      })) ?? []
                  }
                  onSelect={(item) =>
                    handleChange('start_freight_city')(item?.value ?? '')
                  }
                  placeholder="Selecione a cidade"
                  error={getError(errors, 'start_freight_city')}
                  loading={cities.isFetching}
                />
              )}
              <Select
                required
                searchable
                value={values.end_freight_state}
                data={
                  states.data?.map((state) => ({
                    label: state.name,
                    value: state.uf,
                  })) ?? []
                }
                onSelect={(item) =>
                  handleChange('end_freight_state')(item?.value ?? '')
                }
                label="Para onde você quer ir"
                placeholder="Selecione o estado"
                error={getError(errors, 'end_freight_state')}
                loading={states.isFetching}
              />
              {values.end_freight_state && (
                <Select
                  required
                  searchable
                  value={values.end_freight_city as string}
                  data={
                    cities.data
                      ?.filter(
                        (city) => city.states.uf === values.end_freight_state,
                      )
                      .map((city) => ({
                        label: city.name,
                        value: city.name,
                      })) ?? []
                  }
                  onSelect={(item) =>
                    handleChange('end_freight_city')(item?.value ?? '')
                  }
                  placeholder="Selecione a cidade"
                  error={getError(errors, 'end_freight_city')}
                  loading={cities.isFetching}
                />
              )}
            </Card>
          )}
          {step === 2 && (
            <>
              <Card className="mt-8">
                <MaskedInput
                  required
                  mask={numberMask}
                  value={values.truck_current_km as unknown as string}
                  onChangeText={handleChange('truck_current_km')}
                  keyboardType="numeric"
                  label="Km atual"
                  error={getError(errors, 'truck_current_km')}
                />
                <MaskedInput
                  required
                  mask={numberMask}
                  value={values.liter_of_fuel_per_km as unknown as string}
                  onChangeText={handleChange('liter_of_fuel_per_km')}
                  keyboardType="numeric"
                  label="Média do caminhão"
                  error={getError(errors, 'liter_of_fuel_per_km')}
                />
                <Select
                  required
                  searchable
                  value={values.location_state}
                  data={
                    states.data?.map((state) => ({
                      label: state.name,
                      value: state.uf,
                    })) ?? []
                  }
                  onSelect={(item) =>
                    handleChange('location_state')(item?.value ?? '')
                  }
                  placeholder="Selecione o estado"
                  label="Localização do caminhão"
                  error={getError(errors, 'location_state')}
                  loading={states.isFetching}
                />
                {values.location_state && (
                  <Select
                    required
                    searchable
                    value={values.location_city as string}
                    data={
                      cities.data
                        ?.filter(
                          (city) => city.states.uf === values.location_state,
                        )
                        .map((city) => ({
                          label: city.name,
                          value: city.name,
                        })) ?? []
                    }
                    onSelect={(item) =>
                      handleChange('location_city')(item?.value ?? '')
                    }
                    placeholder="Selecione a cidade"
                    error={getError(errors, 'location_city')}
                    loading={cities.isFetching}
                  />
                )}
              </Card>
              <Card className="mt-8 space-y-4">
                <View className="flex flex-row justify-between">
                  <Text className="font-medium ">Tempo Estimado</Text>
                  <Text className="text-primary-600">{values.duration}</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="font-medium ">Distância</Text>
                  <Text className="text-primary-600">{values.distance}</Text>
                </View>
              </Card>
            </>
          )}
          {step === 3 && (
            <>
              <Card className="mt-8">
                <TextInput
                  required
                  value={values.contractor}
                  onChangeText={handleChange('contractor')}
                  placeholder="Insira o nome da transportadora"
                  label="Transportadora"
                  error={getError(errors, 'contractor')}
                />
              </Card>
              <Divider className="mt-6 mb-4 bg-zinc-300" />
              <Text className="text-lg font-medium">Mais informações</Text>
              <Card className="mt-4">
                <View className="flex flex-row items-center justify-between gap-x-4">
                  <View className="flex-1">
                    <MaskedInput
                      required
                      mask={numberMask}
                      value={values.preview_tonne as unknown as string}
                      onChangeText={handleChange('preview_tonne')}
                      label="Peso estimado"
                      keyboardType="numeric"
                      error={getError(errors, 'preview_tonne')}
                    />
                  </View>
                  <Text className="mt-2 text-lg font-medium ">ton</Text>
                </View>
                <View className="flex flex-row items-center justify-between gap-x-4">
                  <View className="flex-1">
                    <MaskedInput
                      required
                      mask={Masks.BRL_CURRENCY}
                      value={values.value_tonne as unknown as string}
                      onChangeText={handleChange('value_tonne')}
                      label="Preço por tonelada"
                      keyboardType="numeric"
                      error={getError(errors, 'value_tonne')}
                    />
                  </View>
                  <Text className="mt-2 text-lg font-medium ">R$ / ton</Text>
                </View>
                <View className="flex flex-row items-center justify-between gap-x-4">
                  <View className="flex-1">
                    <MaskedInput
                      required
                      mask={Masks.BRL_CURRENCY}
                      value={values.preview_value_diesel as unknown as string}
                      onChangeText={handleChange('preview_value_diesel')}
                      label="Preço do diesel"
                      keyboardType="numeric"
                      error={getError(errors, 'preview_value_diesel')}
                    />
                  </View>
                  <Text className="mt-2 text-lg font-medium ">R$ / l</Text>
                </View>
              </Card>
            </>
          )}
          {step === 4 && (
            <View className="mt-8">
              <Text className="font-medium ">Saída</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.start_freight_city}
              </Text>
              <Text className="mt-8 font-medium ">Destino</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.end_freight_city}
              </Text>
              <Divider className="my-6 bg-zinc-300" />
              <Text className="font-medium ">Transportadora</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.contractor}
              </Text>
              <Text className="mt-8 font-medium ">Peso estimado</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.preview_tonne} ton
              </Text>
              <Text className="mt-8 font-medium ">Preço por tonelada</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.value_tonne} / ton
              </Text>
              <Text className="mt-8 font-medium ">Preço diesel</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.preview_value_diesel}
              </Text>
            </View>
          )}
        </View>
        <View>
          <Button
            className="mt-4"
            loading={mutation.isPending}
            disabled={!isValid}
            onPress={() => mutation.mutateAsync(values)}
          >
            {step === totalSteps ? 'Finalizar' : 'Continuar'}
          </Button>
        </View>
      </ScrollView>
      {showFeedback && (
        <Feedback.Root
          // title="Feedback Title"
          type={feedbackType}
          onBackButtonPress={() => {
            setShowFeedback(false)
            router.back()
          }}
        >
          <Feedback.Heading className="px-6 py-6">
            {feedbackType === 'error'
              ? 'Desculpe, parece que ocorreu um erro.'
              : 'Sua cotação foi enviada com sucesso'}
          </Feedback.Heading>
          <View className="items-center justify-between flex-1 pt-2 text-center">
            <Text className="">
              {feedbackType === 'error'
                ? 'Por favor confira os dados inseridos ou tente novamente mais tarde'
                : 'Para conferir sua cotação, clique no botão abaixo'}
            </Text>
            <View className="w-full">
              {feedbackType === 'error' && (
                <Button
                  onPress={() => {
                    setShowFeedback(false)
                    resetForm()
                  }}
                >
                  Tentar novamente
                </Button>
              )}

              {feedbackType === 'success' && (
                <Button onPress={() => router.back()}>Visualizar</Button>
              )}

              <Pressable
                onPress={() => {
                  if (feedbackType === 'success') {
                    setShowFeedback(false)
                    resetForm()
                    return
                  }

                  router.replace('/viagens')
                }}
                className="items-center justify-center p-4"
              >
                <Text className="font-semibold text-primary">
                  Criar nova cotação
                </Text>
              </Pressable>
            </View>
          </View>
        </Feedback.Root>
      )}
    </Layout>
  )
}
