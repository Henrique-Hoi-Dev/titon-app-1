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
  img_proof_cte: FreightFile
  img_proof_ticket: FreightFile
  img_proof_freight_letter: FreightFile
  createdAt: string
  updatedAt: string
  restock: Restock[]
  travelExpense: Travel[]
  depositMoney: Deposit[]
}

export declare type Freight = {
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
  img_proof_cte: FreightFile
  img_proof_ticket: FreightFile
  img_proof_freight_letter: FreightFile
  createdAt: Date
  updatedAt: Date
  // Embedded collections (when fetched via /freight/:id/:financialStatementId)
  restocks?: import('./restock').Restock[]
  deposits?: import('./deposit').Deposit[]
  travels?: import('./travel').Travel[]
}
