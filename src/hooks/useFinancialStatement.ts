import { useQuery } from '@tanstack/react-query'
import Api from '../services/api'
import { Freight, mapData as freightMapData } from './useFreight'
import { Restock } from './useRestocks'
import { Travel } from './useTravels'
import { Deposit } from './useDeposits'
import { toCamelCase } from '../utils'

export type FreightStatus = Uppercase<
  'draft' | 'pending' | 'approved' | 'denied' | 'finished' | 'starting_trip'
>

export type FreightFile = {
  uuid: string
  name: string
  mimetype: string
  category: string
}

export type FreightResponse = {
  id: number
  financial_statements_id: number
  start_freight_city: string
  end_freight_city: string
  is_on_the_way: boolean
  truck_location: string
  contractor_name: string
  truck_current_km: number
  fuel_avg_per_km: number
  estimated_tonnage: number
  estimated_fuel_cost: number
  ton_value: number
  route_distance_km: string
  route_duration: string
  status:
    | 'DRAFT'
    | 'PENDING'
    | 'APPROVED'
    | 'DENIED'
    | 'FINISHED'
    | 'STARTING_TRIP'
  tons_loaded: any
  toll_cost: any
  truck_km_end_trip: any
  discharge: any
  img_proof_cte: FreightFile
  img_proof_ticket: FreightFile
  img_proof_freight_letter: FreightFile
  createdAt: string
  updatedAt: string
  restock: Restock[]
  travelExpense: Travel[]
  depositMoney: Deposit[]
}

export type FinancialStatementResponse = {
  data: {
    id: number
    creator_user_id: number
    driver_id: number
    truck_id: number
    cart_id: number
    status: boolean
    start_km: null | number
    final_km: null | number
    start_date: string
    final_date: null | string
    driver_name: string
    truck_models: string
    truck_board: string
    truck_avatar: string
    cart_models: string
    cart_board: string
    invoicing_all: null | boolean
    medium_fuel_all: null | boolean
    total_value: number
    createdAt: string
    updatedAt: string
    freight: FreightResponse[]
  }
}

export type FinancialStatement = {
  id: number
  creator_user_id: number
  driver_id: number
  truck_id: number
  cart_id: number
  status: boolean
  start_km?: number
  final_km?: number
  start_date: Date
  final_date?: Date
  driver_name: string
  truck_models: string
  truck_board: string
  truck_avatar: string
  cart_models: string
  cart_board: string
  invoicing_all?: boolean
  medium_fuel_all?: boolean
  total_value: number
  createdAt: Date
  updatedAt: Date
  freight: Freight[]
}

export function useFinancialStatement() {
  const query = useQuery({
    queryKey: ['financialStatement'],
    queryFn: async () => {
      const response = await Api.get<FinancialStatementResponse>(
        `/v1/driver/financial/current`
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

const mapData = (
  financialStatement: FinancialStatementResponse['data']
): FinancialStatement => ({
  id: financialStatement.id,
  creator_user_id: financialStatement.creator_user_id,
  driver_id: financialStatement.driver_id,
  truck_id: financialStatement.truck_id,
  cart_id: financialStatement.cart_id,
  status: financialStatement.status,
  start_km: financialStatement.start_km || undefined,
  final_km: financialStatement.final_km || undefined,
  start_date: new Date(financialStatement.start_date),
  final_date: financialStatement.final_date
    ? new Date(financialStatement.final_date)
    : undefined,
  driver_name: financialStatement.driver_name,
  truck_models: financialStatement.truck_models,
  truck_board: financialStatement.truck_board,
  truck_avatar: financialStatement.truck_avatar,
  cart_models: financialStatement.cart_models,
  cart_board: financialStatement.cart_board,
  invoicing_all: financialStatement.invoicing_all || undefined,
  medium_fuel_all: financialStatement.medium_fuel_all || undefined,
  total_value: financialStatement.total_value,
  createdAt: new Date(financialStatement.createdAt),
  updatedAt: new Date(financialStatement.updatedAt),
  freight: financialStatement.freight.map((freight) => {
    const camelCasedFreight = toCamelCase(freight, [
      'createdAt',
      'updatedAt',
      'restock',
      'travelExpense',
      'depositMoney',
    ])
    return freightMapData(camelCasedFreight)
  }),
})
