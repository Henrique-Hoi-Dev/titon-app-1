import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, MaskedInput, TextInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Masks } from 'react-native-mask-input'
import { useFinancialStatement, useFreight, useRestocks } from '~/src/hooks'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Card from '~/src/components/Card'
import Feedback from '~/src/components/Layout/Feedback'
import Progress from '~/src/components/Progress'
import { ImagePickerAsset } from 'expo-image-picker'
import Toast from 'react-native-toast-message'
import UploadInput, {
  useUpload,
} from '~/src/components/Form/Inputs/UploadInput'
import UploadTips from '~/src/components/UploadTips'
import { ErrorKey, getErrorMessage } from '~/src/utils/errors'

const validationSchema = Yup.object().shape({
  name_establishment: Yup.string().required('Campo obrigatório'),
  value_fuel: Yup.string().required('Campo obrigatório'),
  liters_fuel: Yup.string().required('Campo obrigatório'),
  total_nota_value: Yup.string().required('Campo obrigatório'),
})

export default function App() {
  const router = useRouter()
  const stepsLabels = {
    1: 'Sobre sua bastecida',
    2: 'Estamos quase lá',
    3: 'Confira os dados antes de enviar',
  }
  const [step, setStep] = useState<keyof typeof stepsLabels>(1)
  const totalSteps = Object.keys(stepsLabels).length
  const [feedbackType, setFeedbackType] = useState<
    'success' | 'error' | ErrorKey
  >('success')
  const [showFeedback, setShowFeedback] = useState(false)
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{
    id: string
  }>()
  const { data } = useFinancialStatement()
  const { data: activeFreight } = useFreight(Number(id))

  const { store } = useRestocks(data?.id || 0, {
    onSuccess: async (data) => {
      await uploadInvoice.mutateAsync({
        id: data.id,
        file: image as ImagePickerAsset,
      })
      setFeedbackType('success')
      setStep(1)
      setShowFeedback(true)
    },
    onError: (error) => {
      setFeedbackType(error || 'error')
      setShowFeedback(true)
    },
  })

  const [image, setImage] = useState<ImagePickerAsset>()
  const [picking, setPicking] = useState(false)
  const uploadInvoice = useUpload({
    apiUrl: `/v1/driver/deposit/upload-documents`,
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
      name_establishment: '',
      value_fuel: '',
      liters_fuel: '',
      total_nota_value: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (step !== 3) {
        setStep((prev) => (prev + 1) as keyof typeof stepsLabels)
        return
      }

      const data = {
        ...values,
        value_fuel: Number(values.value_fuel.replace(/\D/g, '')),
        liters_fuel: Number(values.liters_fuel),
        total_nota_value: Number(values.total_nota_value.replace(/\D/g, '')),
      }

      if (!activeFreight) {
        return Alert.alert('Erro', 'Não há viagem ativa')
      }

      await store.mutateAsync({
        freightId: activeFreight.id,
        restock: data,
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
          Nova Abastecida
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
                label="Posto"
                value={values.name_establishment}
                error={errors.name_establishment}
                onChangeText={handleChange('name_establishment')}
              />
              <MaskedInput
                label="Valor do combustivel"
                mask={Masks.BRL_CURRENCY}
                value={values.value_fuel}
                error={errors.value_fuel}
                onChangeText={handleChange('value_fuel')}
                keyboardType="numeric"
              />
              <TextInput
                label="Total de litros abastecidos"
                value={values.liters_fuel}
                error={errors.liters_fuel}
                onChangeText={handleChange('liters_fuel')}
                keyboardType="numeric"
              />
              <MaskedInput
                label="Total da nota fiscal"
                mask={Masks.BRL_CURRENCY}
                value={values.total_nota_value}
                error={errors.total_nota_value}
                onChangeText={handleChange('total_nota_value')}
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
              <Text className="font-medium ">Posto</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.name_establishment}
              </Text>
              <Text className="mt-8 font-medium">Valor do combustivel</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.value_fuel}/l
              </Text>
              <Text className="mt-8 font-medium">
                Total de litros abastecidos
              </Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.liters_fuel} l
              </Text>
              <Text className="mt-8 font-medium">Total da nota fiscal</Text>
              <Text className="text-lg font-medium text-primary-600">
                {values.total_nota_value}
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
          type={feedbackType === 'success' ? 'success' : 'error'}
          onBackButtonPress={() => {
            setShowFeedback(false)
            router.back()
          }}
        >
          <Feedback.Heading className="px-6 py-6">
            {feedbackType === 'success'
              ? 'Sua abastecida foi adicionada com sucesso'
              : 'Desculpe, parece que ocorreu um erro.'}
          </Feedback.Heading>
          <View className="items-center justify-between flex-1 pt-2 text-center">
            <Text className="">
              {feedbackType === 'success'
                ? 'Para conferir sua abastecida, clique no botão abaixo'
                : feedbackType !== 'error'
                  ? getErrorMessage(feedbackType)
                  : 'Por favor confira os dados inseridos ou tente novamente mais tarde'}
            </Text>
            <View className="w-full">
              {feedbackType !== 'success' && (
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
                  {feedbackType === 'success' ? 'Criar nova despesa' : 'Voltar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Feedback.Root>
      )}
    </Layout>
  )
}
