import { ResultAsync } from 'neverthrow'

import { VehicleTransaction } from '../../domain/entities/transaction.entity.js'
import { QueueError } from '../errors/application.error.js'
import { QueuePort } from '../ports/queue.port.js'

export class EnqueueTransactionUseCase {
  constructor(private queue: QueuePort) {}

  execute(transaction: VehicleTransaction): ResultAsync<VehicleTransaction, QueueError> {
    return this.queue
      .checkRunning()
      .andThen(() => this.queue.enqueue(transaction))
      .map(() => transaction)
  }
}
