import { Alert, Pressable, ScrollView, Text, View, Image } from 'react-native'
import { Masks } from 'react-native-mask-input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, MaskedInput, Select, TextInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { banks, depositsTypes, toSelectData } from '~/src/utils/forms'
import { useDeposits } from '~/src/hooks/useDeposits'
import { useFinancialStatement, useFreight } from '~/src/hooks'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Progress from '~/src/components/Progress'
import Card from '~/src/components/Card'
import Feedback from '~/src/components/Layout/Feedback'
import UploadTips from '~/src/components/UploadTips'
import UploadInput, {
  useUpload,
} from '~/src/components/Form/Inputs/UploadInput'
import { ImagePickerAsset } from 'expo-image-picker'
import Toast from 'react-native-toast-message'

const validationSchema = Yup.object().shape({
  type_transaction: Yup.string().required('Campo obrigatório'),
  local: Yup.string().required('Campo obrigatório'),
  type_bank: Yup.string().required('Campo obrigatório'),
  value: Yup.string().required('Campo obrigatório'),
})
export default function App() {
  const router = useRouter()
  const stepsLabels = {
    1: 'Sobre seu depósito',
    2: 'Estamos quase lá',
    3: 'Confira os dados antes de enviar',
  }
  const [step, setStep] = useState<keyof typeof stepsLabels>(1)
  const totalSteps = Object.keys(stepsLabels).length
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>(
    'success',
  )
  const [showFeedback, setShowFeedback] = useState(false)
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const { data } = useFinancialStatement()
  const { data: activeFreight } = useFreight(Number(id))

  const { store } = useDeposits(data?.id || 0, {
    onSuccess: async (data) => {
      await uploadInvoice.mutateAsync({
        id: data.id,
        file: image as ImagePickerAsset,
      })
      setFeedbackType('success')
      setStep(1)
      setShowFeedback(true)
    },
    onError: () => {
      setFeedbackType('error')
      setShowFeedback(true)
    },
  })

  const [image, setImage] = useState<ImagePickerAsset>()
  const [picking, setPicking] = useState(false)
  const uploadInvoice = useUpload({
    apiUrl: `/driver/deposit/upload-documents`,
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: `Erro ao enviar comprovante`,
      })
    },
  })

  const {
    values,
    errors,
    handleChange,
    resetForm,
    handleSubmit,
    isValid,
    validateForm,
  } = useFormik({
    initialValues: {
      type_transaction: '',
      local: '',
      type_bank: '',
      value: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (step !== 3) {
        setStep((prev) => (prev + 1) as keyof typeof stepsLabels)
        return
      }

      const data = {
        ...values,
        value: Number(values.value.replace(/\D/g, '')),
      }

      if (!activeFreight) {
        return Alert.alert('Erro', 'Não há viagem ativa')
      }

      await store.mutateAsync({
        freightId: activeFreight.id,
        deposit: {
          ...data,
          financial_statements_id: activeFreight.financial_statements_id,
        },
      })
    },
  })

  const isButtonDisabled = () => {
    if (step === 1) return !isValid
    if (step === 2) return !image || picking
    return false
  }

  useEffect(() => {
    validateForm()
  }, [step, validateForm])

  return (
    <Layout className="w-full h-full">
      <Header
        onBackButtonPressed={() => {
          if (step === 2) {
            setStep(1)
            return
          }

          router.back()
        }}
      >
        <Text className="uppercase text-white text-2xl -mt-1.5 pr-10 text-center">
          Novo Depósito
        </Text>
      </Header>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <View className="flex flex-row items-center gap-x-2">
            <Text className="my-2 text-base font-medium ">
              Etapa {step} de {totalSteps}: {stepsLabels[step]}
            </Text>
          </View>
          <Progress value={(100 / totalSteps) * step} className="mt-6" />
          {step === 1 && (
            <Card className="mt-8">
              <TextInput
                label="Local"
                value={values.local}
                error={errors.local}
                onChangeText={handleChange('local')}
                autoFocus
              />
              <Select
                label="Tipo de transferência"
                data={toSelectData(depositsTypes).sort((a, b) =>
                  a.label.localeCompare(b.label),
                )}
                onSelect={(item) =>
                  handleChange('type_transaction')(
                    item ? String(item.value) : '',
                  )
                }
                value={values.type_transaction}
                error={errors.type_transaction}
              />
              <Select
                label="Conta"
                searchable
                data={toSelectData(banks).sort((a, b) =>
                  a.label.localeCompare(b.label),
                )}
                onSelect={(item) =>
                  handleChange('type_bank')(item ? String(item.value) : '')
                }
                value={values.type_bank}
                error={errors.type_bank}
              />
              <MaskedInput
                label="Valor"
                mask={Masks.BRL_CURRENCY}
                value={values.value}
                error={errors.value}
                onChangeText={handleChange('value')}
                keyboardType="numeric"
              />
            </Card>
          )}

          {step === 2 && (
            <View className="mt-8">
              <UploadTips />
              <View className="w-full h-px my-4 bg-zinc-300 " />
              <UploadInput
                onPickStart={() => setPicking(true)}
                onPickEnd={() => setPicking(false)}
                onFilePick={(image) => setImage(image)}
              />
            </View>
          )}

          {step === 3 && (
            <View className="mt-8">
              <Text className="font-medium ">Local</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.local}
              </Text>
              <Text className="mt-8 font-medium">Tipo de transferência</Text>
              <Text className="text-lg font-medium text-primary-600">
                {
                  toSelectData(depositsTypes).find((type) => {
                    return type.value === values.type_transaction
                  })?.label
                }
              </Text>
              <Text className="font-medium mt-8">Banco</Text>
              <Text className="text-lg font-medium text-primary-600">
                {
                  toSelectData(banks).find((bank) => {
                    return bank.value === values.type_bank
                  })?.label
                }
              </Text>
              <Text className="mt-8 font-medium">Valor</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.value}
              </Text>
              <Text className="mt-8 font-medium mb-2">Comprovante</Text>
              <Card className={`relative shadow-sm`}>
                <Image
                  className="w-full rounded-lg aspect-square"
                  resizeMode="cover"
                  source={{ uri: image?.uri }}
                />
              </Card>
            </View>
          )}
        </View>
        <View>
          <Button
            className="mt-4"
            loading={store.isPending || uploadInvoice.isPending}
            disabled={isButtonDisabled()}
            onPress={() => handleSubmit()}
          >
            {step === totalSteps ? 'Finalizar' : 'Continuar'}
          </Button>
        </View>
      </ScrollView>
      {showFeedback && (
        <Feedback.Root
          type={feedbackType}
          onBackButtonPress={() => {
            setShowFeedback(false)
            router.back()
          }}
        >
          <Feedback.Heading className="px-6 py-6">
            {feedbackType === 'error'
              ? 'Desculpe, parece que ocorreu um erro.'
              : 'Seu depósito foi adicionado com sucesso'}
          </Feedback.Heading>
          <View className="items-center justify-between flex-1 pt-2 text-center">
            <Text className="">
              {feedbackType === 'error'
                ? 'Por favor confira os dados inseridos ou tente novamente mais tarde'
                : 'Para conferir seu depósito, clique no botão abaixo'}
            </Text>
            <View className="w-full">
              {feedbackType === 'error' && (
                <Button
                  onPress={() => {
                    setShowFeedback(false)
                    // setStep(1)
                    // resetForm()
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
                    setStep(1)
                    resetForm()
                    return
                  }

                  router.back()
                }}
                className="items-center justify-center p-4"
              >
                <Text className="font-semibold text-primary">
                  {feedbackType === 'success'
                    ? 'Criar novo depósito'
                    : 'Voltar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Feedback.Root>
      )}
    </Layout>
  )
}
