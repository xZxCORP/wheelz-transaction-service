import { errAsync, okAsync } from 'neverthrow';

import { ValidationError } from '../../domain/errors/domain.error.js';
import { TransactionValidationService } from '../../domain/services/transaction-validation.service.js';
import { ExternalTransactionDataValidatorPort } from '../ports/external-transaction-data-validator.port.js';

export class ValidateTransactionDataUseCase {
  constructor(
    private transactionValidationService: TransactionValidationService,
    private externalTransactionDataValidator: ExternalTransactionDataValidatorPort
  ) {}

  execute(transactionData: unknown) {
    return this.transactionValidationService
      .validateTransactionData(transactionData)
      .asyncAndThen((transactionData) =>
        this.externalTransactionDataValidator.validate(transactionData)
      )
      .andThen((result) =>
        result.isValid
          ? okAsync(result.transaction)
          : errAsync(new ValidationError(result.message, {}))
      );
  }
}
