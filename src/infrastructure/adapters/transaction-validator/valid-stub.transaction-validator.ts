import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type {
  ExternalTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-transaction-data-validator.port.js';

export class ValidStubTransactionValidator implements ExternalTransactionDataValidatorPort {
  async validate(transaction: VehicleTransactionData): Promise<TransactionValidationResult> {
    return {
      isValid: true,
      message: 'Transaction is valid',
      transaction: transaction,
    };
  }
}
