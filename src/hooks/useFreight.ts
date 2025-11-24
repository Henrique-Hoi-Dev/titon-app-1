import { useQuery } from '@tanstack/react-query'
import { FreightResponse, FreightStatus } from '../types'
import { useFinancialStatement } from './useFinancialStatement'
import { mapFreightData } from '../utils/mappers'
import Api from '../services/api'
import { CamelCase } from '../@types/utils'

export function useFreights() {
  const { data } = useFinancialStatement()

  const freights = data?.freight

  const getStatusLabel = (status: FreightStatus) => {
    switch (status) {
      case 'DRAFT':
        return 'Rascunho'
      case 'PENDING':
        return 'Pendente'
      case 'APPROVED':
        return 'Aprovado'
      case 'STARTING_TRIP':
        return 'Em rota'
      case 'DENIED':
        return 'Negado'
      case 'FINISHED':
        return 'Finalizado'
    }
  }

  const getStatusColor = (status: FreightStatus) => {
    switch (status) {
      case 'DRAFT':
        return {
          bg: 'bg-slate-200',
          text: 'text-slate-700',
        }
      case 'PENDING':
        return {
          bg: 'bg-yellow-200',
          text: 'text-yellow-700',
        }
      case 'APPROVED':
        return {
          bg: 'bg-green-200',
          text: 'text-green-700',
        }
      case 'STARTING_TRIP':
        return {
          bg: 'bg-primary-200',
          text: 'text-primary-700',
        }
      case 'DENIED':
        return {
          bg: 'bg-red-200',
          text: 'text-red-700',
        }
      case 'FINISHED':
        return {
          bg: 'bg-zinc-300',
          text: 'text-zinc-700',
        }
    }
  }

  return {
    data: freights || [],
    getStatusLabel,
    getStatusColor,
  }
}

export function useFreight(freightId: number) {
  const { data: financialStatement } = useFinancialStatement()
  const query = useQuery({
    queryKey: ['freight', freightId],
    queryFn: async () => {
      const response = await Api.get<{
        data: CamelCase<
          FreightResponse,
          | 'createdAt'
          | 'updatedAt'
          | 'restock'
          | 'travelExpense'
          | 'depositMoney'
        >
      }>(`/v1/driver/freight/${freightId}/${financialStatement?.id}`)

      if (response.status !== 200) {
        throw Error('Erro ao buscar os viagens')
      }

      return mapFreightData(response.data.data)
    },
    enabled: freightId !== 0 && !!financialStatement?.id,
  })

  return {
    loading: query.isFetching,
    data: query.data,
    fetch: query.refetch,
    error: query.error,
  }
}
