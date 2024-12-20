import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type {
  ExternalCreateTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../ports/external-create-transaction-data-validator.port.js';

export class ValidateCreateVehicleTransactionDataUseCase {
  constructor(
    private readonly externalCreateTransactionDataValidator: ExternalCreateTransactionDataValidatorPort
  ) {}
  async execute(
    vehicleTransactionData: VehicleTransactionData
  ): Promise<TransactionValidationResult> {
    const result =
      await this.externalCreateTransactionDataValidator.validate(vehicleTransactionData);
    return result;
  }
}
