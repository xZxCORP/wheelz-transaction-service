import { ResultAsync } from 'neverthrow'

import {
  VehicleTransaction,
  VehicleTransactionData,
} from '../../domain/entities/transaction.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'
import { QueueError } from '../errors/application.error.js'
import { EnqueueTransactionUseCase } from '../use-cases/enqueue-transaction.use-case.js'
import { ValidateTransactionDataUseCase } from '../use-cases/validate-transaction-data.use-case.js'

export class TransactionService {
  constructor(
    private readonly validateTransactionDataUseCase: ValidateTransactionDataUseCase,
    private readonly enqueueTransactionUseCase: EnqueueTransactionUseCase
  ) {}

  processTransactionData(
    data: unknown
  ): ResultAsync<VehicleTransactionData, ValidationError | QueueError> {
    return this.validateTransactionDataUseCase
      .execute(data)
      .andThen((transactionData) => this.enqueueTransactionUseCase.execute(transactionData))
  }
}
