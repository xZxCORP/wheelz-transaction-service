import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type { ExternalTransactionDataValidatorPort } from '../ports/external-transaction-data-validator.port.js';

export class ValidateVehicleTransactionDataUseCase {
  constructor(
    private readonly externalTransactionDataValidator: ExternalTransactionDataValidatorPort
  ) {}
  async execute(vehicleTransactionData: VehicleTransactionData): Promise<boolean> {
    const result = await this.externalTransactionDataValidator.validate(vehicleTransactionData);
    return result.isValid;
  }
}
