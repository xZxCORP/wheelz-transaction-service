import type { Signature, Vehicle } from '@zcorp/shared-typing-wheelz';

export const sampleVehicle: Vehicle = {
  vin: 'ABCDEFGHIJKLMNOPQ',
  constructorName: 'Toyota',
  model: 'Corolla',
  year: 2022,
  risks: {
    exterior: ['minor_scratch'],
    mechanical: [],
    generic: ['high_mileage'],
  },
  sinisters: [
    {
      date: new Date('2023-01-01'),
      type: 'collision',
      severity: 'minor',
      primaryFactor: 'distraction',
      injuryType: 'none',
      collisionType: 'rear_end',
      isWeekend: false,
      location: {
        description: 'Main St and 1st Ave',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
    },
  ],
  issues: {
    exterior: [],
    mechanical: ['brake_wear'],
    generic: [],
  },
};

export const sampleTransactionSignature: Signature = {
  signature: 'validSignature123',
  signAlgorithm: 'ECDSA-SHA256',
};
