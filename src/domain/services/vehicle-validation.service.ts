import { Result } from 'neverthrow'

import { Vehicle } from '../entities/vehicle.entity.js'
import { ValidationError } from '../errors/domain.error.js'
import { Schema } from '../validation/schema.js'
import { Validator } from '../validation/validator.js'

export class VehicleValidationService {
  constructor(
    private validator: Validator,
    private vehicleSchema: Schema<Vehicle>
  ) {}

  validateVehicle(vehicle: unknown): Result<Vehicle, ValidationError> {
    return this.validator.validate(this.vehicleSchema, vehicle)
  }
}
