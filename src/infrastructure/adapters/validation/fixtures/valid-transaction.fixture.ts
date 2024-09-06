import { sampleTransactionSignature, sampleVehicle } from './base-vehicle.fixture.js'

export const createTransactionFixture = {
  timestamp: new Date('2023-01-01T12:00:00Z'),
  data: {
    action: 'create',
    vehicle: sampleVehicle,
  },
  signature: sampleTransactionSignature,
}

export const updateTransactionFixture = {
  timestamp: new Date('2023-01-02T12:00:00Z'),
  data: {
    action: 'update',
    vin: 'ABCDEFGHIJKLMNOPQ',
    changes: {
      model: 'Camry',
      year: 2023,
    },
  },
  signature: sampleTransactionSignature,
}

export const deleteTransactionFixture = {
  timestamp: new Date('2023-01-03T12:00:00Z'),
  data: {
    action: 'delete',
    vin: 'ABCDEFGHIJKLMNOPQ',
  },
  signature: sampleTransactionSignature,
}
