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

      // Verifica se a resposta está vazia ou não tem dados
      if (
        !response.data?.data ||
        Object.keys(response.data.data).length === 0 ||
        !response.data.data.id
      ) {
        return null
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
  end_km: financialStatement.end_km || undefined,
  start_date: new Date(financialStatement.start_date),
  end_date: financialStatement.end_date
    ? new Date(financialStatement.end_date)
    : undefined,
  total_invoicing: financialStatement.total_invoicing,
  average_fuel_consumption: financialStatement.average_fuel_consumption,
  total_amount: financialStatement.total_amount,
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
  truck: financialStatement.truck,
  cart: financialStatement.cart,
  driver: financialStatement.driver,
})
