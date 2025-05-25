import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'

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
  msg: string
}

type StoreType = {
  freightId: number
  deposit: Partial<DataToApiPost<Deposit>>
}

export type UseDepositsOptions = {
  onSuccess?: (data: DepositsResponse) => void
  onError?: () => void
}

export function useDeposits(
  financialStatementId: number,
  options?: UseDepositsOptions,
) {
  const query = useQuery({
    queryKey: ['deposits', financialStatementId],
    queryFn: async () => {
      const response = await Api.get<DepositsFetchResponse>(
        `/driver/deposits`,
        {
          financialStatementId,
        },
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os depósitos')
      }

      return response.data.data.map(mapData)
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ freightId, deposit }: StoreType) => {
      const data = toJsonBody({
        ...deposit,
        freightId,
        financialStatementId,
      })

      const response = await Api.post<{ data: DepositsResponse }>(
        '/driver/deposit',
        data,
      )

      if (response.status !== 201) {
        throw Error('Erro ao criar viagem')
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
    loading: query.isFetching,
    mutating: mutation.isPending,
    data: query.data,
    fetch: query.refetch,
    store: mutation,
    error: query.error || mutation.error,
  }
}

const mapData = (deposit: DepositsResponse): Deposit => ({
  id: deposit.id,
  financial_statements_id: deposit.financial_statements_id,
  freight_id: deposit.freight_id,
  type_transaction: deposit.type_transaction,
  local: deposit.local,
  type_bank: deposit.type_bank,
  value: deposit.value,
  createdAt: new Date(deposit.createdAt),
  updatedAt: new Date(deposit.updatedAt),
})
