import { Stack, useRouter } from 'expo-router'
import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native'
import { Button, MaskedInput, PasswordInput } from '~/src/components/Form'
import { Formik } from 'formik'
import { useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Masks } from 'react-native-mask-input'
import Card from '~/src/components/Card'
import { useAuth } from '~/src/context/auth'

interface IFormValues {
  cpf: string
  password: string
}

export default function App() {
  const router = useRouter()
  const { signIn, loading } = useAuth()

  const initialValues: IFormValues = {
    cpf: '',
    password: '',
  }

  const onSubmit = useCallback(
    async (values: IFormValues) => {
      if (!signIn) return

      await signIn(values.cpf.replace(/\D/g, ''), values.password)
    },
    [signIn]
  )

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      className="justify-center flex-1 bg-tertiary-500"
    >
      <Image
        source={require('~/assets/images/login-background.png')}
        alt="logo"
        className="w-full mb-10 -bottom-10 ios:-bottom-16 absolute"
        resizeMode="cover"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="items-center justify-center flex-1 px-4 py-8"
      >
        <StatusBar style="light" />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <Image
          source={require('~/assets/images/logo.png')}
          alt="logo"
          className="w-full mb-10"
          resizeMode="contain"
        />
        <Card blur intensity={10} shadow="lg" spacing="md">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ handleChange, handleSubmit, values }) => (
              <View className="w-full">
                <MaskedInput
                  className="bg-white  "
                  labelClassName="text-primary"
                  label="CPF"
                  placeholder="000.000.000-00"
                  onChangeText={handleChange('cpf')}
                  value={values.cpf}
                  mask={Masks.BRL_CPF}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <PasswordInput
                  className="bg-white"
                  labelClassName="text-primary"
                  label="Senha"
                  placeholder="Digite sua senha"
                  onChangeText={handleChange('password')}
                  value={values.password}
                />
                <View className="flex justify-end items-end">
                  <Pressable
                    onPress={() =>
                      router.navigate('/(auth)/(forgot-password)/request-token')
                    }
                  >
                    <Text className="text-primary-600 font-medium text-xs mt-2 mb-4">
                      Esqueceu sua senha?
                    </Text>
                  </Pressable>
                </View>
                <Button
                  loading={loading}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  Continuar
                </Button>
              </View>
            )}
          </Formik>
        </Card>
      </KeyboardAvoidingView>
    </View>
  )
}
