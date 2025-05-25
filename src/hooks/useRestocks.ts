import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'

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
  financial_statements_id: number
  freight_id: number
  name_establishment: string
  city: string
  date: string
  value_fuel: number
  liters_fuel: number
  total_nota_value: number
  total_value_fuel: number
  createdAt: string
  updatedAt: string
}

export type RestocksFetchResponse = {
  data: RestocksResponse[]
}

export type RestockErrorResponse = {
  msg: string
}

type StoreType = {
  freightId: number
  restock: Partial<DataToApiPost<Restock>>
}

export type UseRestocksOptions = {
  onSuccess?: (data: RestocksResponse) => void
  onError?: () => void
}

export function useRestocks(freightId: number, options?: UseRestocksOptions) {
  const query = useQuery({
    queryKey: ['restocks', freightId],
    queryFn: async () => {
      const response = await Api.get<RestocksFetchResponse>(
        `/driver/restocks`,
        {
          freight_id: freightId,
        },
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os abastecimentos')
      }

      return response.data.data.map(mapData)
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ freightId, restock }: StoreType) => {
      const data = toJsonBody({
        ...restock,
        freightId,
      })

      const response = await Api.post<{ data: RestocksResponse }>(
        '/driver/restock',
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

const mapData = (restock: RestocksResponse): Restock => ({
  id: restock.id,
  financial_statements_id: restock.financial_statements_id,
  freight_id: restock.freight_id,
  name_establishment: restock.name_establishment,
  city: restock.city,
  date: new Date(restock.date),
  value_fuel: restock.value_fuel,
  liters_fuel: restock.liters_fuel,
  total_nota_value: restock.total_nota_value,
  total_value_fuel: restock.total_value_fuel,
  createdAt: new Date(restock.createdAt),
  updatedAt: new Date(restock.updatedAt),
})
