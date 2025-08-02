import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'
import { useFreight } from './useFreight'
import { ErrorKey } from '../utils/errors'

export declare type Deposit = {
  id: number
  financial_statements_id: number
  freight_id: number
  type_transaction: string
  local: string
  type_bank: string
  value: number
  createdAt: Date
  updatedAt: Date
}

export type DepositsResponse = {
  id: number
  financial_statements_id: number
  freight_id: number
  type_transaction: string
  local: string
  type_bank: string
  value: number
  createdAt: string
  updatedAt: string
}

export type DepositsFetchResponse = {
  data: DepositsResponse[]
}

export type DepositErrorResponse = {
  message: string
}

type StoreType = {
  freightId: number
  deposit: Partial<DataToApiPost<Deposit>>
}

export type UseDepositsOptions = {
  onSuccess?: (data: DepositsResponse) => void
  onError?: (key: ErrorKey) => void
}

export function useDeposits(
  freightId: number,
  options?: UseDepositsOptions,
) {
  const query = useFreight(freightId)

  const mutation = useMutation({
    mutationFn: async ({ freightId, deposit }: StoreType) => {
      const data = toJsonBody({
        ...deposit,
        freight_id: freightId,
        // registration_date: new Date().toISOString(),
      })

      const response = await Api.post<{ data: DepositsResponse }>(
        '/v1/driver/deposit',
        data,
      )

      console.log('Response from deposit creation:', response.data)

      if (response.status !== 201) {
        throw Error('Erro ao criar depósito')
      }

      return response.data
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data.data)
      query.fetch()
    },
    onError: options?.onError,
  })

  return {
    loading: query.loading,
    mutating: mutation.isPending,
    data: query.data?.depositMoney || [],
    fetch: query.fetch,
    store: mutation,
    error: query.error || mutation.error,
  }
}
