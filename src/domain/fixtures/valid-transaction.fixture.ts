import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';

import { sampleTransactionSignature, sampleVehicle } from './base-vehicle.fixture.js';

export const createTransactionFixture: VehicleTransaction = {
  timestamp: new Date('2023-01-01T12:00:00Z'),
  action: 'create',
  data: sampleVehicle,
  dataSignature: sampleTransactionSignature,
};

export const updateTransactionFixture: VehicleTransaction = {
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

export const deleteTransactionFixture: VehicleTransaction = {
  timestamp: new Date('2023-01-03T12:00:00Z'),
  action: 'delete',
  data: {
    vin: 'ABCDEFGHIJKLMNOPQ',
  },
  dataSignature: sampleTransactionSignature,
};
