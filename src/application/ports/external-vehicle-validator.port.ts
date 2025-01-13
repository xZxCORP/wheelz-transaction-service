import type { Vehicle } from '@zcorp/shared-typing-wheelz';

export type VehicleValidationResult = {
  isValid: boolean;
  message: string | null;
};
export interface ExternalVehicleValidatorPort {
  analyse(vehicle: Vehicle): Promise<VehicleValidationResult>;
  compare(vehicle: Vehicle, previousVehicle: Vehicle): Promise<VehicleValidationResult>;
}
