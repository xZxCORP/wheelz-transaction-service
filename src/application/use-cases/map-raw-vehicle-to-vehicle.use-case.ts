import { type Vehicle, vehicleSchema } from '@zcorp/shared-typing-wheelz';

import type { RawVehicle } from '../../domain/entities/cli-vehicle.entity.js';

export class MapRawVehicleToVehicleUseCase {
  constructor() {}

  async execute(rawVehicle: RawVehicle): Promise<Vehicle | null> {
    const data: Vehicle = {
      vin: rawVehicle.vin,
      constructorName: rawVehicle.constructor,
      model: rawVehicle.model,
      year: rawVehicle.year,
      sinisters: rawVehicle.sinisters.map((sinister) => ({
        date: new Date(sinister.Year, sinister.Month - 1, sinister.Day, sinister.Hour / 100),
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
      risks: {
        exterior: rawVehicle.risks.exterior.map((risk) => ({ name: risk })),
        generic: rawVehicle.risks.generic.map((risk) => ({ name: risk })),
        mechanical: rawVehicle.risks.mechanical.map((risk) => ({ name: risk })),
      },

      issues: {
        exterior: rawVehicle.issues.exterior.map((risk) => ({ name: risk })),
        generic: rawVehicle.issues.generic.map((risk) => ({ name: risk })),
        mechanical: rawVehicle.issues.mechanical.map((risk) => ({ name: risk })),
      },
    };
    const result = await vehicleSchema.safeParseAsync(data);
    return result.success ? result.data : null;
  }
}
