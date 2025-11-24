import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'
import {
  Travel,
  TravelsResponse,
  TravelsFetchResponse,
  TravelErrorResponse,
  UseTravelsOptions,
} from '../types'

type StoreType = {
  freightId: number
  travel: Partial<DataToApiPost<Travel>>
}

export function useTravels(freightId: number, options?: UseTravelsOptions) {
  const query = useQuery({
    queryKey: ['deposits', freightId],
    queryFn: async () => {
      const response = await Api.get<TravelsFetchResponse>(
        `/v1/driver/restocks`,
        {
          freight_id: freightId,
        },
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os depósitos')
      }

      return response.data.data.map((item) => ({
        ...item,
        id: item.id,
        financial_statements_id: item.financialStatementsId,
        freight_id: item.freightId,
        name_establishment: item.nameEstablishment,
        city: item.city,
        registration_date: new Date(item.registrationDate),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })) as unknown as Travel[]
    },
    enabled: freightId !== 0,
  })

  const mutation = useMutation({
    mutationFn: async ({ freightId, travel }: StoreType) => {
      const data = toJsonBody({
        ...travel,
        freightId,
      })

      const response = await Api.post<{ data: TravelsResponse }>(
        '/v1/driver/travel',
        data,
      )

      if (response.status !== 201) {
        throw new Error(
          (response.data as unknown as TravelErrorResponse).key ||
            'Erro ao salvar despesa',
        )
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
    data: query.data || [],
    fetch: query.refetch,
    store: mutation,
    error: query.error || mutation.error,
  }
}
