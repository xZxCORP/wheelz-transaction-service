import { okAsync, ResultAsync } from 'neverthrow'

import {
  ExternalTransactionValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-transaction-validator.port.js'
import { VehicleTransaction } from '../../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../../domain/errors/domain.error.js'

export class ValidStubTransactionValidator implements ExternalTransactionValidatorPort {
  validate(
    transaction: VehicleTransaction
  ): ResultAsync<TransactionValidationResult, ValidationError> {
    return okAsync({
      isValid: true,
      message: 'Transaction is valid',
      transaction: transaction,
    })
  }
}
