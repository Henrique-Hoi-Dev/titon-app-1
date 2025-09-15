import { useQuery } from '@tanstack/react-query'
import { Freight, FreightResponse, FreightStatus } from '../types/freight'
import { useFinancialStatement } from './useFinancialStatement'
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
      }>(`/v1/driver/freight/${freightId}/${financialStatement?.id || ''}`)

      if (response.status !== 200) {
        throw Error('Erro ao buscar os viagens')
      }

      return mapData(response.data.data)
    },
    enabled: freightId !== 0,
  })

  return {
    loading: query.isFetching,
    data: query.data,
    fetch: query.refetch,
    error: query.error,
  }
}

export const mapData = (
  freight: CamelCase<
    FreightResponse,
    'createdAt' | 'updatedAt' | 'restock' | 'travelExpense' | 'depositMoney'
  >,
): Freight => ({
  id: freight.id,
  financial_statements_id: freight.financialStatementsId,
  start_freight_city: freight.startFreightCity,
  end_freight_city: freight.endFreightCity,
  truck_location: freight.truckLocation,
  is_on_the_way: freight.truckLocation !== freight.endFreightCity,
  contractor_name: freight.contractorName,
  truck_current_km: freight.truckCurrentKm,
  fuel_avg_per_km: freight.fuelAvgPerKm,
  estimated_tonnage: freight.estimatedTonnage,
  estimated_fuel_cost: freight.estimatedFuelCost,
  ton_value: freight.tonValue,
  status: freight.status,
  tons_loaded: freight.tonsLoaded || undefined,
  toll_cost: freight.tollCost || undefined,
  truck_km_end_trip: freight.truckKmEndTrip || undefined,
  discharge: freight.discharge || undefined,
  img_proof_cte: freight.imgProofCte || undefined,
  img_proof_ticket: freight.imgProofTicket || undefined,
  img_proof_freight_letter: freight.imgProofFreightLetter || undefined,
  createdAt: new Date(freight.createdAt),
  updatedAt: new Date(freight.updatedAt),
  route_distance_km: freight.routeDistanceKm,
  route_duration: freight.routeDuration,
})
