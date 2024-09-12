import { Result } from 'neverthrow'

import { VehicleTransaction, VehicleTransactionData } from '../entities/transaction.entity.js'
import { ValidationError } from '../errors/domain.error.js'
import { Schema } from '../validation/schema.js'
import { Validator } from '../validation/validator.js'

export class TransactionValidationService {
  constructor(
    private validator: Validator,
    private transactionSchema: Schema<VehicleTransaction>,
    private transactionDataSchema: Schema<VehicleTransactionData>
  ) {}

  validateTransaction(transaction: unknown): Result<VehicleTransaction, ValidationError> {
    return this.validator.validate(this.transactionSchema, transaction)
  }
  validateTransactionData(
    transactionData: unknown
  ): Result<VehicleTransactionData, ValidationError> {
    return this.validator.validate(this.transactionDataSchema, transactionData)
  }
}
