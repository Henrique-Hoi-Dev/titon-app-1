import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'
import { useFreight } from './useFreight'
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
  totalValueFuel: number
  totalNotaValue: number | null
  imgReceipt: object
  payment: object
  createdAt: string
  updatedAt: string
}

export type RestocksFetchResponse = {
  data: {
    docs: RestocksResponse[]
  }
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
  onError?: (key: ErrorKey) => void
}

export function useRestocks(freightId: number, options?: UseRestocksOptions) {
  const query = useQuery({
    queryKey: ['deposits', freightId],
    queryFn: async () => {
      const response = await Api.get<RestocksFetchResponse>(
        `/v1/driver/restocks`, {
          freight_id: freightId
        }
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os depósitos')
      }

      return response.data.data.docs.map((item) => ({
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

const mapData = (restock: RestocksResponse): Restock => ({
  id: restock.id,
  financial_statements_id: restock.financialStatementsId,
  freight_id: restock.freightId,
  name_establishment: restock.nameEstablishment,
  city: restock.city,
  date: new Date(restock.registrationDate),
  value_fuel: restock.valueFuel,
  liters_fuel: restock.litersFuel,
  total_nota_value: restock.totalNotaValue || 0,
  total_value_fuel: restock.totalValueFuel || 0,
  createdAt: new Date(restock.createdAt),
  updatedAt: new Date(restock.updatedAt),
})
