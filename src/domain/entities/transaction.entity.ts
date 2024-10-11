import type { DataSignature } from './data-signature.entity.js';
import type { Vehicle } from './vehicle.entity.js';

export type TransactionAction = 'create' | 'update' | 'delete';

export type CreateVehicleTransactionData = Vehicle;

export interface UpdateVehicleTransactionData {
  vin: string;
  changes: Partial<Omit<Vehicle, 'vin'>>;
}

export interface DeleteVehicleTransactionData {
  vin: string;
}

export type VehicleTransactionData<A extends TransactionAction> = A extends 'create'
  ? CreateVehicleTransactionData
  : A extends 'update'
    ? UpdateVehicleTransactionData
    : A extends 'delete'
      ? DeleteVehicleTransactionData
      : never;

export interface VehicleTransaction<A extends TransactionAction> {
  timestamp: Date;
  action: A;
  data: VehicleTransactionData<A>;
  dataSignature: DataSignature;
}

export type CreateTransactionInput<A extends TransactionAction> = {
  action: A;
  data: VehicleTransactionData<A>;
};
