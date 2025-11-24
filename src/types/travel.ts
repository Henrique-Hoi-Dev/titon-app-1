import { ErrorKey } from '../utils/errors'

export declare type Travel = {
  id: number
  financial_statements_id: number
  freight_id: number
  city?: string
  registration_date: Date
  type_establishment: string
  name_establishment: string
  expense_description: string
  dfe?: string
  value: number
  img_receipt?: Record<string, unknown>
  payment?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export type TravelsResponse = {
  id: number
  financialStatementsId: number
  freightId: number
  city?: string
  registrationDate: string
  typeEstablishment: string
  nameEstablishment: string
  expenseDescription: string
  dfe?: string
  value: number
  imgReceipt?: Record<string, unknown>
  payment?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type TravelsFetchResponse = {
  data: TravelsResponse[]
}

export type TravelErrorResponse = {
  key: string
  message?: string
}

export type UseTravelsOptions = {
  onSuccess?: (data: TravelsResponse) => void
  onError?: (key: ErrorKey) => void
}
