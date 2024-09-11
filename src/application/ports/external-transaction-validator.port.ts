import { ResultAsync } from 'neverthrow'

import { VehicleTransaction } from '../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'

export type TransactionValidationResult = {
  isValid: boolean
  transaction: VehicleTransaction
  message: string
}
export interface ExternalTransactionValidatorPort {
  validate(
    transaction: VehicleTransaction
  ): ResultAsync<TransactionValidationResult, ValidationError>
}
