import { Travel } from './travel'
import { Restock } from './restock'
import { Deposit } from './deposit'

export type FreightStatus = Uppercase<
  'draft' | 'pending' | 'approved' | 'denied' | 'finished' | 'starting_trip'
>

export type FreightFile = {
  uuid: string
  name: string
  mimetype: string
  category: string
}

export type FreightSummary = {
  restockTotal: number
  travelExpensesTotal: number
  depositMoneyTotal: number
  driverCommission: number
  valueFreightTotal: number
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
  tons_loaded: number
  toll_cost: number
  truck_km_end_trip: number
  discharge: number
  break_ton?: number
  insurance?: number
  taxa_adm?: number
  img_proof_cte: FreightFile
  img_proof_ticket: FreightFile
  img_proof_freight_letter: FreightFile
  createdAt: string
  updatedAt: string
  restock: Restock[]
  travelExpense: Travel[]
  depositMoney: Deposit[]
  summary?: FreightSummary
}

export declare type Freight = {
  id: number
  financialStatementsId: number
  startFreightCity: string
  endFreightCity: string
  isOnTheWay: boolean
  truckLocation: string | null
  contractorName: string | null
  truckCurrentKm: number | null
  fuelAvgPerKm: number | null
  estimatedTonnage: number | null
  estimatedFuelCost: number | null
  tonValue: number | null
  routeDistanceKm: string
  routeDuration: string
  status:
    | 'DRAFT'
    | 'PENDING'
    | 'APPROVED'
    | 'DENIED'
    | 'FINISHED'
    | 'STARTING_TRIP'
  tonsLoaded: number | null
  tollCost: number | null
  truckKmEndTrip: number | null
  discharge: number | null
  breakTon?: number | null
  insurance?: number | null
  taxaAdm?: number | null
  imgProofCte: FreightFile
  imgProofTicket: FreightFile
  imgProofFreightLetter: FreightFile
  createdAt: Date
  updatedAt: Date
  // Embedded collections (when fetched via /freight/:id/:financialStatementId)
  restock?: import('./restock').Restock[]
  travelExpense?: import('./travel').Travel[]
  depositMoney?: import('./deposit').Deposit[]
  summary?: import('./freight').FreightSummary
}
