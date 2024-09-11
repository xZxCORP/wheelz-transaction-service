import { Result } from 'neverthrow'

import { VehicleTransaction } from '../entities/transaction.entity.js'
import { ValidationError } from '../errors/domain.error.js'
import { Schema } from '../validation/schema.js'
import { Validator } from '../validation/validator.js'

export class TransactionValidationService {
  constructor(
    private validator: Validator,
    private transactionSchema: Schema<VehicleTransaction>
  ) {}

  validateTransaction(transaction: unknown): Result<VehicleTransaction, ValidationError> {
    return this.validator.validate(this.transactionSchema, transaction)
  }
}
