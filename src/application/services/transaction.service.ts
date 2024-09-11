import { ResultAsync } from 'neverthrow'

import { VehicleTransaction } from '../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'
import { QueueError } from '../errors/application.error.js'
import { EnqueueTransactionUseCase } from '../use-cases/enqueue-transaction.use-case.js'
import { ValidateTransactionUseCase } from '../use-cases/validate-transaction.use-case.js'

export class TransactionService {
  constructor(
    private readonly validateTransactionUseCase: ValidateTransactionUseCase,
    private readonly enqueueTransactionUseCase: EnqueueTransactionUseCase
  ) {}

  processTransaction(data: unknown): ResultAsync<VehicleTransaction, ValidationError | QueueError> {
    return this.validateTransactionUseCase
      .execute(data)
      .andThen((transaction) => this.enqueueTransactionUseCase.execute(transaction))
  }
}
