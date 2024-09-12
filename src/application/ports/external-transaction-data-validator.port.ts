import { ResultAsync } from 'neverthrow'

import { VehicleTransactionData } from '../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'

export type TransactionValidationResult = {
  isValid: boolean
  transaction: VehicleTransactionData
  message: string
}
export interface ExternalTransactionValidatorPort {
  validate(
    transactionData: VehicleTransactionData
  ): ResultAsync<TransactionValidationResult, ValidationError>
}
