import type {
  CreateVehicleTransactionData,
  DeleteVehicleTransactionData,
  TransactionAction,
  UpdateVehicleTransactionData,
  VehicleTransaction,
  VehicleTransactionData,
} from '../entities/transaction.entity.js';
import { sampleTransactionSignature, sampleVehicle } from './base-vehicle.fixture.js';

export const createTransactionFixture: VehicleTransaction<'create'> = {
  timestamp: new Date('2023-01-01T12:00:00Z'),
  action: 'create',
  data: sampleVehicle,
  dataSignature: sampleTransactionSignature,
};

export const updateTransactionFixture: VehicleTransaction<'update'> = {
  timestamp: new Date('2023-01-02T12:00:00Z'),
  action: 'update',
  data: {
    vin: 'ABCDEFGHIJKLMNOPQ',
    changes: {
      model: 'Camry',
      year: 2023,
    },
  },
  dataSignature: sampleTransactionSignature,
};

export const deleteTransactionFixture: VehicleTransaction<'delete'> = {
  timestamp: new Date('2023-01-03T12:00:00Z'),
  action: 'delete',
  data: {
    vin: 'ABCDEFGHIJKLMNOPQ',
  } as DeleteVehicleTransactionData,
  dataSignature: sampleTransactionSignature,
};
