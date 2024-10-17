import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import type {
  ExternalTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-transaction-data-validator.port.js';

export class InvalidStubTransactionValidator implements ExternalTransactionDataValidatorPort {
  async validate(transaction: VehicleTransactionData): Promise<TransactionValidationResult> {
    return {
      isValid: false,
      message: 'Transaction is invalid',
      transaction: transaction,
    };
  }
}
