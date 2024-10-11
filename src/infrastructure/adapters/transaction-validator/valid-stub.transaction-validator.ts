import { okAsync, ResultAsync } from 'neverthrow';

import type {
  ExternalTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-transaction-data-validator.port.js';
import type {
  TransactionAction,
  VehicleTransactionData,
} from '../../../domain/entities/transaction.entity.js';

export class ValidStubTransactionValidator implements ExternalTransactionDataValidatorPort {
  async validate<A extends TransactionAction>(
    transaction: VehicleTransactionData<A>
  ): Promise<TransactionValidationResult<A>> {
    return {
      isValid: true,
      message: 'Transaction is valid',
      transaction: transaction,
    };
  }
}
