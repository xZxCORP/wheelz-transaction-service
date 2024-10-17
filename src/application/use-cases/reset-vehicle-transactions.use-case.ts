import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { QueuePort } from '../ports/queue.port.js';

export class ResetVehicleTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly newQueue: QueuePort
  ) {}

  async execute(): Promise<void> {
    await this.transactionRepository.removeAll();
    await this.newQueue.clear();
  }
}
