import { Freight, FreightResponse, Restock, Deposit, Travel } from '../types'
import { CamelCase } from '../@types/utils'

export const mapFreightData = (
  freight:
    | CamelCase<
        FreightResponse,
        'createdAt' | 'updatedAt' | 'restock' | 'travelExpense' | 'depositMoney'
      >
    | FreightResponse,
): Freight => {
  // Helper para pegar valor em camelCase ou snake_case
  const getValue = (obj: any, camelKey: string, snakeKey: string) => {
    return obj[camelKey] ?? obj[snakeKey] ?? null
  }

  const restock = (freight as any).restock || []
  const depositMoney = (freight as any).depositMoney || []
  const travelExpense = (freight as any).travelExpense || []

  return {
    id: freight.id,
    financialStatementsId:
      getValue(freight, 'financialStatementsId', 'financial_statements_id') ??
      0,
    startFreightCity:
      getValue(freight, 'startFreightCity', 'start_freight_city') ?? '',
    endFreightCity:
      getValue(freight, 'endFreightCity', 'end_freight_city') ?? '',
    truckLocation: getValue(freight, 'truckLocation', 'truck_location') ?? null,
    isOnTheWay:
      (getValue(freight, 'truckLocation', 'truck_location') ?? '') !==
      (getValue(freight, 'endFreightCity', 'end_freight_city') ?? ''),
    contractorName:
      getValue(freight, 'contractorName', 'contractor_name') ?? null,
    truckCurrentKm:
      getValue(freight, 'truckCurrentKm', 'truck_current_km') ?? null,
    fuelAvgPerKm: getValue(freight, 'fuelAvgPerKm', 'fuel_avg_per_km') ?? null,
    estimatedTonnage:
      getValue(freight, 'estimatedTonnage', 'estimated_tonnage') ?? null,
    estimatedFuelCost:
      getValue(freight, 'estimatedFuelCost', 'estimated_fuel_cost') ?? null,
    tonValue: getValue(freight, 'tonValue', 'ton_value') ?? null,
    status: freight.status,
    tonsLoaded: getValue(freight, 'tonsLoaded', 'tons_loaded') ?? 0,
    tollCost: getValue(freight, 'tollCost', 'toll_cost') ?? 0,
    truckKmEndTrip:
      getValue(freight, 'truckKmEndTrip', 'truck_km_end_trip') ?? 0,
    discharge: getValue(freight, 'discharge', 'discharge') ?? 0,
    breakTon: getValue(freight, 'breakTon', 'break_ton') ?? null,
    insurance: getValue(freight, 'insurance', 'insurance') ?? null,
    taxaAdm: getValue(freight, 'taxaAdm', 'taxa_adm') ?? null,
    imgProofCte:
      getValue(freight, 'imgProofCte', 'img_proof_cte') ?? ({} as any),
    imgProofTicket:
      getValue(freight, 'imgProofTicket', 'img_proof_ticket') ?? ({} as any),
    imgProofFreightLetter:
      getValue(freight, 'imgProofFreightLetter', 'img_proof_freight_letter') ??
      ({} as any),
    createdAt: new Date(freight.createdAt),
    updatedAt: new Date(freight.updatedAt),
    routeDistanceKm:
      getValue(freight, 'routeDistanceKm', 'route_distance_km') ?? '',
    routeDuration: getValue(freight, 'routeDuration', 'route_duration') ?? '',
    restock: restock.map((item: any) => ({
      id: item.id as unknown as number,
      financial_statements_id: (item as any).financialStatementsId,
      freight_id: (item as any).freightId,
      name_establishment: (item as any).nameEstablishment,
      city: (item as any).city,
      date: new Date((item as any).registrationDate ?? (item as any).createdAt),
      value_fuel: (item as any).valueFuel,
      liters_fuel: (item as any).litersFuel,
      total_nota_value: (item as any).totalNotaValue,
      total_value_fuel:
        (item as any).totalValueFuel ?? (item as any).valueFuel ?? 0,
      createdAt: new Date(
        (item as any).createdAt ?? (item as any).registrationDate,
      ),
      updatedAt: new Date((item as any).updatedAt),
    })) as Restock[],
    depositMoney: depositMoney.map((item: any) => ({
      id: item.id as unknown as number,
      financial_statements_id: (item as any).financialStatementsId,
      freight_id: (item as any).freightId,
      local: (item as any).local,
      type_bank: (item as any).typeBank,
      type_transaction: (item as any).typeTransaction,
      value: (item as any).value,
      registration_date: new Date(
        (item as any).registrationDate ?? (item as any).createdAt,
      ),
      createdAt: new Date(
        (item as any).createdAt ?? (item as any).registrationDate,
      ),
      updatedAt: new Date((item as any).updatedAt),
    })) as Deposit[],
    travelExpense: travelExpense.map((item: any) => ({
      id: item.id as unknown as number,
      financial_statements_id: (item as any).financialStatementsId,
      freight_id: (item as any).freightId,
      city: (item as any).city,
      registration_date: new Date(
        (item as any).registrationDate ?? (item as any).createdAt,
      ),
      type_establishment: (item as any).typeEstablishment,
      name_establishment: (item as any).nameEstablishment,
      expense_description: (item as any).expenseDescription,
      dfe: (item as any).dfe,
      value: (item as any).value,
      img_receipt: (item as any).imgReceipt,
      payment: (item as any).payment,
      createdAt: new Date(
        (item as any).createdAt ?? (item as any).registrationDate,
      ),
      updatedAt: new Date((item as any).updatedAt),
    })) as Travel[],
    summary: (freight as any).summary
      ? {
          restockTotal: (freight as any).summary.restockTotal ?? 0,
          travelExpensesTotal:
            (freight as any).summary.travelExpensesTotal ?? 0,
          depositMoneyTotal: (freight as any).summary.depositMoneyTotal ?? 0,
          driverCommission: (freight as any).summary.driverCommission ?? 0,
          valueFreightTotal: (freight as any).summary.valueFreightTotal ?? 0,
        }
      : undefined,
  }
}
