import type { Vehicle } from '@zcorp/shared-typing-wheelz';

import type {
  ExternalVehicleValidatorPort,
  VehicleValidationResult,
} from '../ports/external-vehicle-validator.port.js';

export class AnalyseVehicleUseCase {
  constructor(private readonly externalVehicleValidator: ExternalVehicleValidatorPort) {}
  async execute(vehicle: Vehicle): Promise<VehicleValidationResult> {
    return this.externalVehicleValidator.analyse(vehicle);
  }
}
