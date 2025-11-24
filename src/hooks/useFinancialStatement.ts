import { useQuery } from '@tanstack/react-query'
import Api from '../services/api'
import { FinancialStatementResponse, FinancialStatement } from '../types'
import { mapFreightData } from '../utils/mappers'

import { toCamelCase } from '../utils'

export function useFinancialStatement() {
  const query = useQuery({
    queryKey: ['financialStatement'],
    queryFn: async () => {
      const response = await Api.get<FinancialStatementResponse>(
        `/v1/driver/financial/current`,
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
  financialStatement: FinancialStatementResponse['data'],
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
    return mapFreightData(camelCasedFreight)
  }),
})
