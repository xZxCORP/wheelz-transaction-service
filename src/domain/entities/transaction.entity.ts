import { DataSignature } from './data-signature.entity.js';
import { Vehicle } from './vehicle.entity.js';

export type TransactionAction = 'create' | 'update' | 'delete';

export interface BaseTransaction<T> {
  timestamp: Date;
  action: TransactionAction;
  data: T;
  dataSignature: DataSignature;
}

export type CreateVehicleTransactionData = Vehicle;

export interface UpdateVehicleTransactionData {
  vin: string;
  changes: Partial<Omit<Vehicle, 'vin'>>;
}

export interface DeleteVehicleTransactionData {
  vin: string;
}

export type VehicleTransactionData =
  | { action: 'create'; data: CreateVehicleTransactionData }
  | { action: 'update'; data: UpdateVehicleTransactionData }
  | { action: 'delete'; data: DeleteVehicleTransactionData };

export type VehicleTransaction = BaseTransaction<VehicleTransactionData['data']>;
