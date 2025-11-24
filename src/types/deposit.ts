import { ErrorKey } from '../utils/errors'

export declare type Deposit = {
  id: number
  financial_statements_id: number
  freight_id: number
  type_transaction: string
  local: string
  type_bank: string
  value: number
  registration_date: Date
  createdAt: Date
  updatedAt: Date
}

export type DepositsResponse = {
  id: number
  financialStatementsId: number
  freightId: number
  registrationDate: string
  typeTransaction: string
  local: string
  typeBank: string
  value: number
  createdAt: string
  updatedAt: string
}

export type DepositsFetchResponse = {
  data: DepositsResponse[]
}

export type DepositErrorResponse = {
  message: string
  error: string
}

export type UseDepositsOptions = {
  onSuccess?: (data: DepositsResponse) => void
  onError?: (key: ErrorKey) => void
}
