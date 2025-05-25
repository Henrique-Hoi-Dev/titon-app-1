/* eslint-disable no-undef */
import AsyncStorage from '@react-native-async-storage/async-storage'
import complexQueryBuilder, { PrimitivesArray } from 'complex-query-builder'
import Config from '../config'
import { Response, Methods, Data } from './types'

export const enpointsWithoutAuth = ['/driver/signin']

export const getToken = async () => {
  const token = await AsyncStorage.getItem(`@${Config.appName}_token`)
  return token
}

export const Api = async <T = unknown>(
  method: Methods | Lowercase<Methods>,
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  try {
    const shouldntHaveAuth = enpointsWithoutAuth.includes(url)
    const token = await getToken()
    const headers = new Headers()

    if (!data) {
      data = {}
    }

    headers.append('Accept', 'application/json')
    if (token && !shouldntHaveAuth) {
      headers.append('Authorization', `Bearer ${token}`)
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (data !== undefined) {
      const [mappedUrl, mappedData] = mapUrlWithParams(url, data)

      url = mappedUrl
      data = mappedData as Data

      Object.keys(data).forEach((field) => {
        if (
          (data && data[field] === undefined) ||
          (data && data[field] === null)
        ) {
          delete data[field]
        } else {
          if (data && field.startsWith('data_')) {
            if (
              data &&
              (data[field] as string)?.match(
                /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}/,
              )
            ) {
              data[field] = (data[field] as string)
                ?.split('/')
                .reverse()
                .join('-')
            }
          }
        }
      })

      if (method !== 'get' && method !== 'head') {
        headers.append('Content-Type', 'application/json')
        config.body = JSON.stringify(data)
      } else {
        const query = complexQueryBuilder(data as unknown as PrimitivesArray)
        url = `${url}?${query}`
      }
    }

    const fullUrl = url.match(/http(s?):\/\//)?.length
      ? url
      : `${Config.apiUrl}${url}`

    const response = await fetch(fullUrl, config)

    console.log(
      `${new Date().getTime()} [${method.toUpperCase()}] ${fullUrl} - ${
        response.status
      }`,
    )

    const jsonParsedResponse = (await response.json()) as T
    const ret: Response<T> = {
      data: jsonParsedResponse,
      url: response.url,
      status: response.status,
    }

    return ret
  } catch (error) {
    return error as Response<T>
  }
}

export const mapUrlWithParams = (
  url: string,
  params: Partial<Data>,
): [string, Partial<Data>] => {
  Object.keys(params).forEach((key) => {
    if (url.includes(`:${key}`)) {
      url = url.replace(`:${key}`, params[key] as string)
      delete params[key]
    }
  })

  return [url, params]
}

const get = async <T = unknown>(
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  return Api<T>('get', url, data)
}

const post = async <T = unknown>(
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  return Api<T>('post', url, data)
}

const patch = async <T = unknown>(
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  return Api<T>('patch', url, data)
}

const put = async <T = unknown>(
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  return Api<T>('put', url, data)
}

const _delete = async <T = unknown>(
  url: string,
  data?: Data,
): Promise<Response<T>> => {
  return Api<T>('delete', url, data)
}

export default {
  get,
  post,
  patch,
  put,
  delete: _delete,
}
