import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, ScrollView, Text, View, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header, Layout } from '~/src/components/Layout'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useRef, useState } from 'react'
import Button from '~/src/components/Button'
import { useFreight } from '~/src/hooks'
import UploadInput, {
  UploadInputRef,
} from '~/src/components/Form/Inputs/UploadInput'
import Toast from 'react-native-toast-message'
import UploadTips from '~/src/components/UploadTips'
import Config from '~/src/config'
import { getToken } from '~/src/services/api'
import { useQueryClient } from '@tanstack/react-query'

export type DocType = 'freight_letter' | 'ticket' | 'cte'

export default function Upload() {
  const router = useRouter()
  const queryClient = useQueryClient()
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  // Busca a imagem já uploadada quando entrar na tela
  useEffect(() => {
    const fetchImage = async () => {
      if (item) {
        let file: { uuid?: string; name?: string } | null | undefined

        if (type === 'ticket') {
          file = item.imgProofTicket
        } else if (type === 'cte') {
          file = item.imgProofCte
        } else if (type === 'freight_letter') {
          file = item.imgProofFreightLetter
        }

        if (file && file.uuid) {
          try {
            const token = await getToken()
            const url = `${Config.apiUrl}/v1/driver/freight/search-documents?category=documents&filename=${file.uuid}`
            
            // Faz fetch com token e converte para base64
            const response = await fetch(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (response.ok) {
              const blob = await response.blob()
              const reader = new FileReader()
              reader.onloadend = () => {
                setUploadedImageUrl(reader.result as string)
              }
              reader.readAsDataURL(blob)
            }
          } catch (error) {
            console.error('Erro ao buscar imagem:', error)
            setUploadedImageUrl(null)
          }
        } else {
          setUploadedImageUrl(null)
        }
      }
    }

    fetchImage()
  }, [item, type])

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
              // Atualiza o estado do frete após upload bem-sucedido
              queryClient.invalidateQueries({
                queryKey: ['freight', Number(id)],
              })
              queryClient.invalidateQueries({
                queryKey: ['financialStatement'],
              })
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
          {uploadedImageUrl && (
            <View className="mt-6">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Imagem atual:
              </Text>
              <Image
                source={{ uri: uploadedImageUrl }}
                className="w-full h-64 rounded-lg"
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  )
}
