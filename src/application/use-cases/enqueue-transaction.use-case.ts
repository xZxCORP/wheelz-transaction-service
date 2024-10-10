import { VehicleTransaction } from '../../domain/entities/transaction.entity.js';
import { QueuePort } from '../ports/queue.port.js';

export class EnqueueTransactionUseCase {
  constructor(private queue: QueuePort) {}

  execute(transaction: VehicleTransaction) {
    return this.queue
      .checkRunning()
      .andThen(() => this.queue.enqueue(transaction))
      .map(() => transaction);
  }
}
