import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, MaskedInput, Select, TextInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Feedback from '~/src/components/Layout/Feedback/'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Freight } from '~/src/hooks'
import Progress from '~/src/components/Progress'
import Card from '~/src/components/Card'
import Divider from '~/src/components/Divider'
import IconButton from '~/src/components/IconButton'
import { getError, numberMask } from '~/src/utils/forms'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api, { Api } from '~/src/services/api'
import { Masks } from 'react-native-mask-input'
import { Stringable } from '~/src/@types/utils'

export const validationSchema = {
  1: Yup.object().shape({
    start_freight_city: Yup.string().required('Campo obrigatório'),
    final_freight_city: Yup.string().required('Campo obrigatório'),
  }),
  2: Yup.object().shape({
    location_of_the_truck: Yup.string().required('Campo obrigatório'),
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

  const {
    values,
    errors,
    handleChange,
    resetForm,
    setFieldError,
    isValid,
    validateForm,
  } = useFormik<
    Partial<
      Stringable<
        Freight,
        | 'id'
        | 'financial_statements_id'
        | 'createdAt'
        | 'updatedAt'
        | 'status'
        | 'is_on_the_way'
      > & {
        start_freight_state: string
        final_freight_state: string
      }
    >
  >({
    initialValues: {
      start_freight_city: '',
      final_freight_city: '',
      location_of_the_truck: '',
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
      }>('/states')
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
      }>(`/citis`)

      return response.data.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (
      values: Partial<
        Freight & {
          start_freight_state: string
          final_freight_state: string
        }
      >,
    ) => {
      const apiMethod = !currentFreightId ? api.post : api.patch

      if (step === totalSteps) {
        values.status = 'PENDING'
      }

      values.start_freight_city = `${values.start_freight_city
        } ${values.start_freight_state?.toLocaleUpperCase()}`

      values.final_freight_city = `${values.final_freight_city
        } ${values.final_freight_state?.toLocaleUpperCase()}`

      const response = await apiMethod<{
        data: Freight
        errors?: Record<keyof Freight, string>
      }>(
        `/v1/driver/freight${currentFreightId ? `/${currentFreightId}` : ''}`,
        values,
      )

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
        if (!data.duration || !data.distance) {
          api
            .get<{
              data: Freight
            }>(`/v1/driver/freight/${data.id}`)
            .then((response) => {
              handleChange('distance')(response.data.data.distance)
              handleChange('duration')(response.data.data.duration)
            })
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
                value={values.final_freight_state}
                data={
                  states.data?.map((state) => ({
                    label: state.name,
                    value: state.uf,
                  })) ?? []
                }
                onSelect={(item) =>
                  handleChange('final_freight_state')(item?.value ?? '')
                }
                label="Para onde você quer ir"
                placeholder="Selecione o estado"
                error={getError(errors, 'final_freight_state')}
                loading={states.isFetching}
              />
              {values.final_freight_state && (
                <Select
                  required
                  searchable
                  value={values.final_freight_city as string}
                  data={
                    cities.data
                      ?.filter(
                        (city) => city.states.uf === values.final_freight_state,
                      )
                      .map((city) => ({
                        label: city.name,
                        value: city.name,
                      })) ?? []
                  }
                  onSelect={(item) =>
                    handleChange('final_freight_city')(item?.value ?? '')
                  }
                  placeholder="Selecione a cidade"
                  error={getError(errors, 'final_freight_city')}
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
                <TextInput
                  required
                  value={values.location_of_the_truck}
                  onChangeText={handleChange('location_of_the_truck')}
                  label="Localização do caminhão"
                  error={getError(errors, 'location_of_the_truck')}
                />
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
                {values.final_freight_city}
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
            onPress={() =>
              mutation.mutateAsync({
                ...values,
                tons_loaded: undefined,
                toll_value: undefined,
                truck_km_completed_trip: undefined,
                truck_current_km: values.truck_current_km
                  ? Number(values.truck_current_km.replace(/\D/g, ''))
                  : undefined,
                liter_of_fuel_per_km: values.liter_of_fuel_per_km
                  ? Number(values.liter_of_fuel_per_km.replace(/\D/g, ''))
                  : undefined,
                preview_tonne: values.preview_tonne
                  ? Number(values.preview_tonne.replace(/\D/g, ''))
                  : undefined,
                value_tonne: values.value_tonne
                  ? Number(values.value_tonne.replace(/\D/g, ''))
                  : undefined,
                preview_value_diesel: values.preview_value_diesel
                  ? Number(values.preview_value_diesel.replace(/\D/g, ''))
                  : undefined,
              })
            }
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
