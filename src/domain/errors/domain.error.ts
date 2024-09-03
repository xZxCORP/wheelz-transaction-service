import { AppError } from './app.error.js'
export class ValidationError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'VALIDATION_ERROR')
    this.cause = cause
  }
}

export class InvalidVinError extends AppError {
  constructor(vin: string) {
    super(`Invalid VIN: ${vin}`, 'INVALID_VIN')
  }
}

export class InvalidVehicleDataError extends AppError {
  constructor(reason: string) {
    super(`Invalid vehicle data: ${reason}`, 'INVALID_VEHICLE_DATA')
  }
}
