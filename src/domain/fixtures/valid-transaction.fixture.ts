import {
  CreateVehicleTransactionData,
  DeleteVehicleTransactionData,
  TransactionAction,
  UpdateVehicleTransactionData,
  VehicleTransaction,
  VehicleTransactionData,
} from '../entities/transaction.entity.js'
import { sampleTransactionSignature, sampleVehicle } from './base-vehicle.fixture.js'

export const createTransactionFixture: VehicleTransaction = {
  timestamp: new Date('2023-01-01T12:00:00Z'),
  action: 'create' as TransactionAction,
  data: sampleVehicle as CreateVehicleTransactionData,
  dataSignature: sampleTransactionSignature,
}

export const updateTransactionFixture: VehicleTransaction = {
  timestamp: new Date('2023-01-02T12:00:00Z'),
  action: 'update' as TransactionAction,
  data: {
    vin: 'ABCDEFGHIJKLMNOPQ',
    changes: {
      model: 'Camry',
      year: 2023,
    },
  } as UpdateVehicleTransactionData,
  dataSignature: sampleTransactionSignature,
}

export const deleteTransactionFixture: VehicleTransaction = {
  timestamp: new Date('2023-01-03T12:00:00Z'),
  action: 'delete' as TransactionAction,
  data: {
    vin: 'ABCDEFGHIJKLMNOPQ',
  } as DeleteVehicleTransactionData,
  dataSignature: sampleTransactionSignature,
}

export const createTransactionDataFixture: VehicleTransactionData = {
  action: 'create',
  data: createTransactionFixture.data as CreateVehicleTransactionData,
}

export const updateTransactionDataFixture: VehicleTransactionData = {
  action: 'update',
  data: updateTransactionFixture.data as UpdateVehicleTransactionData,
}

export const deleteTransactionDataFixture: VehicleTransactionData = {
  action: 'delete',
  data: deleteTransactionFixture.data as UpdateVehicleTransactionData,
}
