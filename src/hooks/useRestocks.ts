import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMutation } from './useMutation'
import {
  Restock,
  RestocksResponse,
  RestocksFetchResponse,
  UseRestocksOptions,
} from '../types'

type StoreType = {
  freightId: number
  restock: Partial<DataToApiPost<Restock>>
}

export function useRestocks(freightId: number, options?: UseRestocksOptions) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['restocks', freightId],
    queryFn: async () => {
      const response = await Api.get<RestocksFetchResponse>(
        `/v1/driver/restocks`,
        {
          freight_id: freightId,
        },
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar as abastecidas')
      }

      return response.data.data.map((item) => ({
        ...item,
        id: item.id,
        financial_statements_id: item.financialStatementsId,
        freight_id: item.freightId,
        name_establishment: item.nameEstablishment,
        city: item.city,
        date: new Date(item.registrationDate),
        value_fuel: item.valueFuel,
        liters_fuel: item.litersFuel,
        total_nota_value: item.totalNotaValue,
        total_value_fuel: item.totalValueFuel,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })) as unknown as Restock[]
    },
    enabled: freightId !== 0,
  })

  const mutation = useMutation({
    mutationFn: async ({ freightId, restock }: StoreType) => {
      const data = toJsonBody({
        ...restock,
        freightId,
      })

      const response = await Api.post<{ data: RestocksResponse }>(
        '/v1/driver/restock',
        data,
      )

      if (response.status !== 201) {
        throw Error('Erro ao criar abastecimento')
      }

      return response.data
    },
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data.data)
      // Só faz refetch se a query estiver habilitada
      if (freightId !== 0) {
        query.refetch()
      }
      // Invalida o cache do frete para atualizar os dados
      if (variables.freightId) {
        queryClient.invalidateQueries({
          queryKey: ['freight', variables.freightId],
        })
      }
    },
    onError: options?.onError,
  })

  return {
    loading: query.isLoading || query.isFetching,
    mutating: mutation.isPending,
    data: query.data || [],
    fetch: query.refetch,
    store: mutation,
    error: query.error || mutation.error,
  }
}
// mapData está disponível se necessário no futuro
