import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header, Layout } from '~/src/components/Layout'
import * as ImagePicker from 'expo-image-picker'
import { useRef, useState } from 'react'
import Button from '~/src/components/Button'
import { useFreight } from '~/src/hooks'
import UploadInput, {
  UploadInputRef,
} from '~/src/components/Form/Inputs/UploadInput'
import Toast from 'react-native-toast-message'
import UploadTips from '~/src/components/UploadTips'

export type DocType = 'freight_letter' | 'ticket' | 'cte'

export default function Upload() {
  const router = useRouter()
  const uploadInputRef = useRef<UploadInputRef>(null)
  const insets = useSafeAreaInsets()
  const { type, id } = useLocalSearchParams<{
    type: DocType
    id: string
  }>()

  const titles = {
    freight_letter: 'Carta Frete',
    ticket: 'Ticket de balança',
    cte: 'CTE',
  }

  const { data: item } = useFreight(Number(id))
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>()
  const [picking, setPicking] = useState(false)
  const [uploading, setUploading] = useState(false)

  return (
    <Layout className="w-full h-full bg-zinc-100">
      <Header>
        <Text className="text-2xl text-white -top-1.5">{titles[type]}</Text>
      </Header>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
      >
        <View className="px-4 py-6">
          <UploadTips />
          <View className="w-full h-px my-4 bg-zinc-300 " />
          <UploadInput
            ref={uploadInputRef}
            apiUrl={`/driver/freight/upload-documents/${item?.id}`}
            typeFile={type}
            onPickStart={() => setPicking(true)}
            onPickEnd={() => setPicking(false)}
            onUploadStart={() => setUploading(true)}
            onUploadEnd={() => setUploading(false)}
            onFilePick={(image) => setImage(image)}
            onError={() => {
              Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: `Erro ao enviar arquivo ${titles[type]}`,
              })
            }}
            onSuccess={() => {
              Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: `Arquivo ${titles[type]} enviado com sucesso`,
              })
              router.back()
            }}
          />
          <Button
            disabled={!image || picking}
            loading={uploading}
            onPress={() => uploadInputRef.current?.upload()}
            className="mt-4"
          >
            Adicionar
          </Button>
        </View>
      </ScrollView>
    </Layout>
  )
}
