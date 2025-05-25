import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'

export declare type Travel = {
  id: number
  financial_statements_id: number
  freight_id: number
  type_establishment: string
  name_establishment: string
  expense_description: string
  value: number
  createdAt: Date
  updatedAt: Date
}

export type TravelsResponse = {
  id: number
  financial_statements_id: number
  freight_id: number
  type_establishment: string
  name_establishment: string
  expense_description: string
  value: number
  createdAt: string
  updatedAt: string
}

export type TravelsFetchResponse = {
  data: TravelsResponse[]
}

export type TravelErrorResponse = {
  msg: string
}

type StoreType = {
  freightId: number
  travel: Partial<DataToApiPost<Travel>>
}

export type UseTravelsOptions = {
  onSuccess?: (data: TravelsResponse) => void
  onError?: () => void
}

export function useTravels(freightId: number, options?: UseTravelsOptions) {
  const query = useQuery({
    queryKey: ['travels', freightId],
    queryFn: async () => {
      const response = await Api.get<TravelsFetchResponse>(`/driver/travels`, {
        freight_id: freightId,
      })

      if (response.status !== 200) {
        throw Error('Erro ao buscar os viagens')
      }

      return response.data.data.map(mapData)
    },
  })

  const mutation = useMutation({
    mutationFn: async ({ freightId, travel }: StoreType) => {
      const data = toJsonBody({
        ...travel,
        freightId,
      })

      const response = await Api.post<{ data: TravelsResponse }>(
        '/driver/travel',
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

const mapData = (travel: TravelsResponse): Travel => ({
  id: travel.id,
  financial_statements_id: travel.financial_statements_id,
  freight_id: travel.freight_id,
  type_establishment: travel.type_establishment,
  name_establishment: travel.name_establishment,
  expense_description: travel.expense_description,
  value: travel.value,
  createdAt: new Date(travel.createdAt),
  updatedAt: new Date(travel.updatedAt),
})
