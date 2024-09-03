import { Vehicle } from './vehicle.entity.js'
export type TransactionAction = 'create' | 'update' | 'delete'
export interface TransactionSignature {
  signedBy: string
  signature: string
  publicKey: string
}

export interface Transaction<T> {
  timestamp: Date
  type: string
  data: T
  signature: TransactionSignature
}

export type VehicleTransaction = Transaction<{
  vin: string
  action: TransactionAction
  vehicle: Vehicle
}>
