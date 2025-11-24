/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-undef */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Response } from './types'
import Config from '~/src/config'
import { enpointsWithoutAuth, getToken } from './api'
import { ImagePickerAsset } from 'expo-image-picker'
import Toast from 'react-native-toast-message'
import { router } from 'expo-router'
import { Platform } from 'react-native'

const upload = async <T = unknown>(
  url: string,
  files: ImagePickerAsset | ImagePickerAsset[],
  field: string,
  httpMethod: 'POST' | 'PUT' | 'PATCH' = 'POST',
  parameters?: Record<string, string>,
): Promise<Response<T>> => {
  try {
    const shouldntHaveAuth = enpointsWithoutAuth.includes(url)
    const token = await getToken() // Fetch token before the request
    const headers = new Headers()

    headers.append('Accept', 'application/json')

    if (token && !shouldntHaveAuth) {
      headers.append('Authorization', `Bearer ${token}`)
    }

    const fullUrl = url.match(/http(s?):\/\//)?.length
      ? url
      : `${Config.apiUrl}${url}`

    const formData = new FormData()

    const appendFile = async (key: string, file: ImagePickerAsset) => {
      const fileName =
        file.fileName || file.uri.split('/').pop() || 'upload.jpg'
      const mimeType = file.mimeType || 'application/octet-stream'

      if (Platform.OS === 'web') {
        // In web, FormData expects a File/Blob, not a { uri } object
        const blob = await fetch(file.uri).then((r) => r.blob())
        const webFile = new File([blob], fileName, { type: mimeType })
        formData.append(key, webFile)
      } else {
        // Native accepts the { uri, name, type } object
        formData.append(key, {
          uri: file.uri,
          name: fileName,
          type: mimeType,
        } as unknown as Blob)
      }
    }

    if (Array.isArray(files)) {
      for (const f of files) {
        // Append as multiple parts with same field name (backend reads as array)
        // Use "field" (not field[]) to match typical multer config
        // If server expects field[], it still works; otherwise one per key
        // Choose plain field for compatibility
        // eslint-disable-next-line no-await-in-loop
        await appendFile(field, f)
      }
    } else {
      await appendFile(field, files)
    }

    if (parameters) {
      Object.entries(parameters).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const response = await fetch(fullUrl, {
      method: httpMethod,
      headers,
      body: formData,
    })

    let data: T = {} as T

    if (response.status === 401 && !shouldntHaveAuth) {
      await AsyncStorage.removeItem(`${Config.appName}_token`)
      Toast.show({
        type: 'error',
        text1: 'Sessão expirada',
        text2: 'Sua sessão expirou, por favor faça login novamente.',
      })

      return router.replace('/(auth)/sign-in') as unknown as Response<T>
    }

    try {
      data = (await response.json()) as T
    } catch (error) {
      console.error('Failed to parse response as JSON', error)
    }

    return {
      status: response.status,
      url: fullUrl,
      data,
    }
  } catch (error) {
    return Promise.reject({
      status: 500,
      url,
      data: null,
      error: error as Error,
    })
  }
}

export default upload
