/* eslint-disable no-unused-vars */
import { Primitives } from 'complex-query-builder'

export declare type File = {
  name: string
  filename: string
  type: string
  uri: string
}

export declare type Methods =
  | 'HEAD'
  | 'OPTION'
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'PUT'
  | 'DELETE'

export declare type DataField = Primitives | Date

export declare interface Data {
  _method?: Methods | null
  [key?: string]: DataField | Array<DataField> | Record<string, unknown>
}

export declare interface UploadData extends Omit<Data, '_method'> {
  files: Array<File>
}

export declare type Response<T> = {
  data: T
  url: string
  status: number
}

export declare type ApiType<T> = (
  url: string,
  data?: Data,
) => Promise<Response<T> | unknown>

export declare type RootApiType<T> = {
  get: ApiType<T>
  post: ApiType<T>
  put: ApiType<T>
  patch: ApiType<T>
  delete: ApiType<T>
}

export declare type ApiUploadType<T> = (
  url: string,
  data?: UploadData,
) => Promise<Response<T> | unknown>
