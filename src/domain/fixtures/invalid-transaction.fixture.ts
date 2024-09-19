import { sampleVehicle } from './base-vehicle.fixture.js'
import { createTransactionFixture, deleteTransactionFixture } from './valid-transaction.fixture.js'

export const invalidActionFixture = {
  ...createTransactionFixture,
  action: 'invalid',

  data: {
    ...createTransactionFixture.data,
  },
}

export const invalidVinFixture = {
  ...createTransactionFixture,
  data: {
    ...createTransactionFixture.data,
    ...sampleVehicle,
    vin: 'INVALID',
  },
}

export const incompleteVehicleFixture = {
  vin: 'ABCDEFGHIJKLMNOPQ',
}

export const invalidYearFixture = {
  ...createTransactionFixture,
  data: {
    ...createTransactionFixture.data,

    ...sampleVehicle,
    year: 1800,
  },
}

export const invalidSignatureFixture = {
  ...deleteTransactionFixture,
  dataSignature: {},
}
