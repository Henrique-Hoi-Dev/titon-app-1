import { ActivityIndicator, Image, Pressable, Text } from 'react-native'
import Card from '~/src/components/Card'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import upload from '~/src/services/upload'

export type RenderInputProps = {
  loading: boolean
  file?: ImagePicker.ImagePickerAsset
  onFilePick: () => Promise<void>
}

export type UploadInputProps = {
  apiUrl?: string
  typeFile?: string
  automaticUpload?: boolean
  mediaTypes?: ImagePicker.MediaTypeOptions
  renderInput?: (props: RenderInputProps) => React.ReactNode
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onSuccess?: () => void
  onError?: () => void
  onPickStart?: () => void
  onPickEnd?: () => void
  onFilePick?: (file?: ImagePicker.ImagePickerAsset) => void
}

export type UploadInputRef = {
  upload: (id?: number) => Promise<unknown> | undefined
}

function Upload(
  {
    apiUrl,
    typeFile,
    automaticUpload = false,
    mediaTypes = ImagePicker.MediaTypeOptions.Images,
    renderInput,
    onUploadStart,
    onUploadEnd,
    onSuccess,
    onError,
    onPickStart,
    onPickEnd,
    onFilePick,
  }: UploadInputProps,
  ref: React.Ref<UploadInputRef>
) {
  const [file, setImage] = useState<ImagePicker.ImagePickerAsset>()
  const [loading, setLoading] = useState(false)

  const pickFile = async () => {
    setLoading(true)
    onPickStart?.()
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      aspect: [16, 9],
      quality: 1,
      allowsEditing: true,
      cameraType: ImagePicker.CameraType.back,
    })

    if (!result.canceled) {
      setImage(result.assets?.[0])
    }

    onPickEnd?.()
    setLoading(false)
  }

  const uploadImage = useUpload({
    apiUrl: apiUrl || '',
    typeFile,
    onUploadStart,
    onUploadEnd,
    onSuccess,
    onError,
  })

  useImperativeHandle(
    ref,
    () => ({
      upload: (id?: number) => {
        if (file) {
          return uploadImage.mutateAsync({ file, id })
        }

        throw new Error('Imagem não selecionada')
      },
    }),
    [file, uploadImage]
  )

  useEffect(() => {
    if (automaticUpload && file) {
      uploadImage.mutateAsync({ file })
    }
  }, [automaticUpload, file, uploadImage])

  useEffect(() => {
    onFilePick?.(file)
  }, [file, onFilePick])

  if (renderInput) {
    return renderInput({
      loading,
      file,
      onFilePick: pickFile,
    })
  }
  return (
    <Pressable disabled={loading} onPress={pickFile}>
      <Card className={`relative ${loading ? 'opacity-30' : ''} shadow-sm`}>
        {file ? (
          <>
            <Image
              className="w-full rounded-lg aspect-square"
              resizeMode="cover"
              source={{ uri: file.uri }}
            />
          </>
        ) : (
          <Card className="items-center justify-center border-2 border-dashed bg-zinc-100  border-primary-600">
            <MaterialCommunityIcons
              name="camera-outline"
              color="#1757D4"
              size={48}
            />
            <Text className="mt-2 text-lg font-medium text-zinc-600">
              Adicionar imagem
            </Text>
            <Text className="text-zinc-500">.jpg, .jpeg, .png</Text>
          </Card>
        )}
      </Card>
      {loading && (
        <ActivityIndicator
          size="large"
          className="absolute -mt-4 -ml-4 top-1/2 left-1/2"
          color="#1757D4"
        />
      )}
    </Pressable>
  )
}

export type UseUploadProps = {
  apiUrl: string
  typeFile?: string
  onUploadStart?: () => void
  onUploadEnd?: () => void
  onSuccess?: () => void
  onError?: () => void
}

export function useUpload({
  apiUrl,
  typeFile,
  onUploadStart,
  onUploadEnd,
  onSuccess,
  onError,
}: UseUploadProps) {
  return useMutation({
    mutationFn: async ({
      file,
      id,
    }: {
      file: ImagePicker.ImagePickerAsset
      id?: number
    }) => {
      onUploadStart?.()
      const parameters: Record<string, string> = {
        category: 'documents',
      }

      if (typeFile) {
        parameters.typeImg = typeFile
      }

      const response = await upload(
        `${apiUrl}${id ? `/${id}` : ''}`,
        file,
        'file',
        'PATCH',
        parameters
      )
      onUploadEnd?.()

      if (response.status !== 200) {
        throw new Error('Erro ao enviar imagem')
      }

      return response.data
    },
    onError,
    onSuccess,
  })
}

export default forwardRef(Upload)
