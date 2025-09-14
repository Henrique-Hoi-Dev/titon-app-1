import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'
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
  data: {
    docs: DepositsResponse[]
  }
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

export function useDeposits(freightId: number, options?: UseDepositsOptions) {
  const query = useQuery({
    queryKey: ['deposits', freightId],
    queryFn: async () => {
      const response = await Api.get<DepositsFetchResponse>(
        `/v1/driver/deposits`,
        {
          freight_id: freightId,
        },
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os depósitos')
      }

      return response.data.data.docs.map((item) => ({
        ...item,
        financial_statements_id: item.financialStatementsId,
        freight_id: item.freightId,
        registration_date: new Date(item.registrationDate),
        type_transaction: item.typeTransaction,
        type_bank: item.typeBank,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }))
    },
    enabled: freightId !== 0,
  })

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

      if (response.status !== 201) {
        throw Error('Erro ao criar depósito')
      }

      return response.data
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data.data)
      query.refetch()
    },
    onError: options?.onError,
  })

  return {
    loading: query.isLoading,
    mutating: mutation.isPending,
    data: query.data || [],
    fetch: query.refetch,
    store: mutation,
    error: query.error || mutation.error,
  }
}
