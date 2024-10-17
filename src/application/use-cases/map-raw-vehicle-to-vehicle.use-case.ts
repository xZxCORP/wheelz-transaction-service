import { type Vehicle, vehicleSchema } from '@zcorp/shared-typing-wheelz';

import type { RawVehicle } from '../../domain/entities/cli-vehicle.entity.js';

export class MapRawVehicleToVehicleUseCase {
  constructor() {}

  async execute(rawVehicle: RawVehicle): Promise<Vehicle | null> {
    const data = {
      vin: rawVehicle.vin,
      constructorName: rawVehicle.constructor,
      model: rawVehicle.model,
      year: rawVehicle.year,
      risks: rawVehicle.risks,
      sinisters: rawVehicle.sinisters.map((sinister) => ({
        date: new Date(sinister.Year, sinister.Month - 1, sinister.Day),
        type: '1-Car',
        severity: 'Unknown',
        primaryFactor: sinister['Primary Factor'],
        injuryType: sinister['Injury Type'],
        collisionType: sinister['Collision Type'],
        isWeekend: sinister['Weekend?'] === 'Weekend',
        location: {
          description: sinister.Reported_Location,
          coordinates: {
            latitude: sinister.Latitude,
            longitude: sinister.Longitude,
          },
        },
      })),
      issues: rawVehicle.issues,
    };
    const result = await vehicleSchema.safeParseAsync(data);
    return result.success ? result.data : null;
  }
}
