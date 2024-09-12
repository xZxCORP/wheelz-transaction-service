import { Vehicle } from './vehicle.entity.js'

export type TransactionAction = 'create' | 'update' | 'delete'

export interface TransactionSignature {
  signature: string
  publicKey: string
}

export interface BaseTransaction<T> {
  timestamp: Date
  action: TransactionAction
  data: T
  signature: TransactionSignature
}

export interface CreateVehicleTransactionData {
  vehicle: Vehicle
}

export interface UpdateVehicleTransactionData {
  vin: string
  changes: Partial<Omit<Vehicle, 'vin'>>
}

export interface DeleteVehicleTransactionData {
  vin: string
}

export type VehicleTransactionData =
  | { action: 'create'; data: CreateVehicleTransactionData }
  | { action: 'update'; data: UpdateVehicleTransactionData }
  | { action: 'delete'; data: DeleteVehicleTransactionData }

export type VehicleTransaction = BaseTransaction<VehicleTransactionData['data']>
