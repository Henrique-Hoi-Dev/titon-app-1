import { DataToApiPost } from '../@types/utils'
import Api from '../services/api'
import { toJsonBody } from '../utils/forms'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from './useMutation'
import { ErrorKey } from '../utils/errors'

export declare type Travel = {
  id: number
  financial_statements_id: number
  freight_id: number
  city?: string
  registration_date: Date
  type_establishment: string
  name_establishment: string
  expense_description: string
  dfe?: string
  value: number
  img_receipt?: Record<string, unknown>
  payment?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export type TravelsResponse = {
  id: number
  financialStatementsId: number
  freightId: number
  city?: string
  registrationDate: string
  typeEstablishment: string
  nameEstablishment: string
  expenseDescription: string
  dfe?: string
  value: number
  imgReceipt?: Record<string, unknown>
  payment?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type TravelsFetchResponse = {
  data: {
    docs: TravelsResponse[]
  }
}

export type TravelErrorResponse = {
  key: string
}

type StoreType = {
  freightId: number
  travel: Partial<DataToApiPost<Travel>>
}

export type UseTravelsOptions = {
  onSuccess?: (data: TravelsResponse) => void
  onError?: (key: ErrorKey) => void
}

export function useTravels(freightId: number, options?: UseTravelsOptions) {
  const query = useQuery({
    queryKey: ['deposits', freightId],
    queryFn: async () => {
      const response = await Api.get<TravelsFetchResponse>(
        `/v1/driver/restocks`,
        {
          freight_id: freightId,
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
        data
      )

      if (response.status !== 201) {
        throw new Error(
          (response.data as unknown as TravelErrorResponse).key ||
            'Erro ao salvar despesa'
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
