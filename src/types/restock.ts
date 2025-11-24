import { ErrorKey } from '../utils/errors'

export declare type Restock = {
  id: number
  financial_statements_id: number
  freight_id: number
  name_establishment: string
  city: string
  date: Date
  value_fuel: number
  liters_fuel: number
  total_nota_value: number
  total_value_fuel: number
  createdAt: Date
  updatedAt: Date
}

export type RestocksResponse = {
  id: number
  financialStatementsId: number
  freightId: number
  nameEstablishment: string
  city: string
  registrationDate: string
  valueFuel: number
  litersFuel: number
  totalNotaValue: number
  totalValueFuel: number
  createdAt: string
  updatedAt: string
}

export type RestocksFetchResponse = {
  data: RestocksResponse[]
}

export type RestockErrorResponse = {
  message: string
  error: string
}

export type UseRestocksOptions = {
  onSuccess?: (data: RestocksResponse) => void
  onError?: (key: ErrorKey) => void
}
