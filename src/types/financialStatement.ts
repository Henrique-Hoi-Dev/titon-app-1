import { Freight, FreightResponse } from './freight'

export type ImageFile = {
  name: string
  uuid: string
  category: string
  mimetype: string
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
    end_km: null | number
    start_date: string
    end_date: null | string
    total_invoicing: number
    average_fuel_consumption: number
    total_amount: number
    createdAt: string
    updatedAt: string
    freight: FreightResponse[]
    truck: {
      truck_models: string
      truck_board: string
      image_truck: ImageFile | Record<string, never>
    }
    cart: {
      cart_models: string
      cart_board: string
      image_cart: ImageFile | Record<string, never>
    }
    driver: {
      name: string
      email: string
      phone: string
      credit: number
      percentage: number
      daily: number
      value_fix: number
      avatar: ImageFile | Record<string, never>
    }
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
  end_km?: number
  start_date: Date
  end_date?: Date
  total_invoicing: number
  average_fuel_consumption: number
  total_amount: number
  createdAt: Date
  updatedAt: Date
  freight: Freight[]
  truck: {
    truck_models: string
    truck_board: string
    image_truck: ImageFile | Record<string, never>
  }
  cart: {
    cart_models: string
    cart_board: string
    image_cart: ImageFile | Record<string, never>
  }
  driver: {
    name: string
    email: string
    phone: string
    credit: number
    percentage: number
    daily: number
    value_fix: number
    avatar: ImageFile | Record<string, never>
  }
}
