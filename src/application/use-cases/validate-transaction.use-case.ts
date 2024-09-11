import { errAsync, okAsync, ResultAsync } from 'neverthrow'

import { VehicleTransaction } from '../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'
import { TransactionValidationService } from '../../domain/services/transaction-validation.service.js'
import { ExternalTransactionValidatorPort } from '../ports/external-transaction-validator.port.js'

export class ValidateTransactionUseCase {
  constructor(
    private transactionValidationService: TransactionValidationService,
    private externalTransactionValidator: ExternalTransactionValidatorPort
  ) {}

  execute(transaction: unknown): ResultAsync<VehicleTransaction, ValidationError> {
    return this.transactionValidationService
      .validateTransaction(transaction)
      .asyncAndThen((transaction) => this.externalTransactionValidator.validate(transaction))
      .andThen((result) =>
        result.isValid
          ? okAsync(result.transaction)
          : errAsync(new ValidationError(result.message, {}))
      )
  }
}
