import { Vehicle } from './vehicle.entity.js'

export type TransactionAction = 'create' | 'update' | 'delete'

export interface TransactionSignature {
  signature: string
  publicKey: string
}

export interface BaseTransaction<T> {
  timestamp: Date
  data: T
  signature: TransactionSignature
}

export interface CreateVehicleTransactionData {
  action: 'create'
  vehicle: Vehicle
}

export interface UpdateVehicleTransactionData {
  action: 'update'
  vin: string
  changes: Partial<Omit<Vehicle, 'vin'>>
}

export interface DeleteVehicleTransactionData {
  action: 'delete'
  vin: string
}

export type VehicleTransactionData =
  | CreateVehicleTransactionData
  | UpdateVehicleTransactionData
  | DeleteVehicleTransactionData

export type VehicleTransaction = BaseTransaction<VehicleTransactionData>
