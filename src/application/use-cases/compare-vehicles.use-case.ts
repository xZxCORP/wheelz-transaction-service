import type { UpdateVehicleTransactionData, Vehicle } from '@zcorp/shared-typing-wheelz';

import type {
  ExternalVehicleValidatorPort,
  VehicleValidationResult,
} from '../ports/external-vehicle-validator.port.js';

export class CompareVehiclesUseCase {
  constructor(private readonly externalVehicleValidator: ExternalVehicleValidatorPort) {}
  async execute(
    vehicle: UpdateVehicleTransactionData['changes'],
    previousVehicle: Vehicle
  ): Promise<VehicleValidationResult> {
    return this.externalVehicleValidator.compare(vehicle, previousVehicle);
  }
}
