import { Freight, FreightResponse } from './freight'

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
