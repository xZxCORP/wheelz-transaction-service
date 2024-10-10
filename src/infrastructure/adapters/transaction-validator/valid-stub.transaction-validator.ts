import { okAsync, ResultAsync } from 'neverthrow';

import {
  ExternalTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-transaction-data-validator.port.js';
import { VehicleTransactionData } from '../../../domain/entities/transaction.entity.js';
import { ValidationError } from '../../../domain/errors/domain.error.js';

export class ValidStubTransactionValidator implements ExternalTransactionDataValidatorPort {
  validate(
    transaction: VehicleTransactionData
  ): ResultAsync<TransactionValidationResult, ValidationError> {
    return okAsync({
      isValid: true,
      message: 'Transaction is valid',
      transaction: transaction,
    });
  }
}
