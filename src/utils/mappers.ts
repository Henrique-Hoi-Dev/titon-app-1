import { Freight, FreightResponse, Restock, Deposit, Travel } from '../types'
import { CamelCase } from '../@types/utils'

export const mapFreightData = (
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
  tons_loaded: freight.tonsLoaded || 0,
  toll_cost: freight.tollCost || 0,
  truck_km_end_trip: freight.truckKmEndTrip || 0,
  discharge: freight.discharge || 0,
  img_proof_cte: freight.imgProofCte || undefined,
  img_proof_ticket: freight.imgProofTicket || undefined,
  img_proof_freight_letter: freight.imgProofFreightLetter || undefined,
  createdAt: new Date(freight.createdAt),
  updatedAt: new Date(freight.updatedAt),
  route_distance_km: freight.routeDistanceKm,
  route_duration: freight.routeDuration,
  restocks: (freight.restock || []).map((item) => ({
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
  deposits: (freight.depositMoney || []).map((item) => ({
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
  travels: (freight.travelExpense || []).map((item) => ({
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
})
