import { useLocalSearchParams } from 'expo-router'
import { useFormik } from 'formik'
import { ScrollView, Text, View } from 'react-native'
import { Masks } from 'react-native-mask-input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Stringable } from '~/src/@types/utils'
import Card from '~/src/components/Card'
import { Button, MaskedInput } from '~/src/components/Form'
import { Header, Layout } from '~/src/components/Layout'
import { Freight, useFreight } from '~/src/hooks/useFreight'
import { numberMask } from '~/src/utils/forms'

type RouteParams = {
  id: string
}

export default function App() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<RouteParams>()
  const { data: item } = useFreight(Number(id))

  const { values, handleChange } = useFormik<
    Partial<
      Stringable<
        Freight,
        | 'id'
        | 'financial_statements_id'
        | 'createdAt'
        | 'updatedAt'
        | 'status'
        | 'is_on_the_way'
      >
    >
  >({
    initialValues: {
      tons_loaded: item?.tons_loaded?.toString(),
      toll_value: item?.toll_value?.toString(),
    },
    onSubmit: () => {
      //
    },
  })

  return (
    <Layout
      style={{
        paddingBottom: insets.bottom,
      }}
      className="w-full h-full bg-zinc-100 "
    >
      <Header align="items-center">
        <Text className="text-2xl text-white">Detalhes da carga</Text>
      </Header>
      <ScrollView className="p-4">
        <Text className="mt-2 mb-6 text-xl font-semibold">
          Mais informações sobre a carga
        </Text>
        <Card className="mb-6">
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                required
                mask={numberMask}
                label="Peso entregue"
                value={values.tons_loaded}
                onChangeText={handleChange('tons_loaded')}
              />
            </View>
            <Text className="mt-2 font-semibold ">ton</Text>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Pedágio incluso"
            value={values.toll_value}
            onChangeText={handleChange('toll_value')}
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Quebra"
                value="0"
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">ton</Text>
          </View>
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Seguro"
                value="0"
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">R$/ton</Text>
          </View>
          <MaskedInput
            mask={Masks.BRL_CURRENCY}
            label="Taxa ADM"
            value="0"
            keyboardType="numeric"
          />
          <View className="flex-row items-center gap-x-4">
            <View className="flex-1">
              <MaskedInput
                mask={Masks.BRL_CURRENCY}
                label="Descarga"
                onChangeText={handleChange('discharge')}
                value={values.discharge}
                keyboardType="numeric"
              />
            </View>
            <Text className="mt-2 font-semibold ">R$/ton</Text>
          </View>
        </Card>
        <Button>Continuar</Button>
      </ScrollView>
    </Layout>
  )
}
