import { useQuery } from '@tanstack/react-query'
import {
  FreightResponse,
  FreightStatus,
  useFinancialStatement,
} from './useFinancialStatement'
import Api from '../services/api'

export declare type Freight = {
  id: number
  financial_statements_id: number
  start_freight_city: string
  final_freight_city: string
  location_of_the_truck: string
  is_on_the_way: boolean
  contractor: string
  truck_current_km: number
  liter_of_fuel_per_km: number
  preview_tonne: number
  preview_value_diesel: number
  value_tonne: number
  status: FreightStatus
  tons_loaded?: number
  toll_value?: number
  truck_km_completed_trip?: number
  discharge?: string
  img_proof_cte?: string
  img_proof_ticket?: string
  img_proof_freight_letter?: string
  createdAt: Date
  updatedAt: Date
  distance: string
  duration: string
}

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
  const query = useQuery({
    queryKey: ['freight', freightId],
    queryFn: async () => {
      const response = await Api.get<{ data: FreightResponse }>(
        `/driver/freight/${freightId}`,
      )

      if (response.status !== 200) {
        throw Error('Erro ao buscar os viagens')
      }

      return mapData(response.data.data)
    },
  })

  return {
    loading: query.isFetching,
    data: query.data,
    fetch: query.refetch,
    error: query.error,
  }
}

export const mapData = (freight: FreightResponse): Freight => ({
  id: freight.id,
  financial_statements_id: freight.financial_statements_id,
  start_freight_city: freight.start_freight_city,
  final_freight_city: freight.final_freight_city,
  location_of_the_truck: freight.location_of_the_truck,
  is_on_the_way: freight.location_of_the_truck !== freight.final_freight_city,
  contractor: freight.contractor,
  truck_current_km: freight.truck_current_km,
  liter_of_fuel_per_km: freight.liter_of_fuel_per_km,
  preview_tonne: freight.preview_tonne,
  preview_value_diesel: freight.preview_value_diesel,
  value_tonne: freight.value_tonne,
  status: freight.status,
  tons_loaded: freight.tons_loaded || undefined,
  toll_value: freight.toll_value || undefined,
  truck_km_completed_trip: freight.truck_km_completed_trip || undefined,
  discharge: freight.discharge || undefined,
  img_proof_cte: freight.img_proof_cte || undefined,
  img_proof_ticket: freight.img_proof_ticket || undefined,
  img_proof_freight_letter: freight.img_proof_freight_letter || undefined,
  createdAt: new Date(freight.createdAt),
  updatedAt: new Date(freight.updatedAt),
})
