import { vehicleTransactionCompletedSchema } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { QueuePort } from '../ports/queue.port.js';
export class ConsumeCompletedVehicleTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private completedQueue: QueuePort
  ) {}

  async execute(): Promise<void> {
    await this.completedQueue.consume(async (data) => {
      const completedTransactionResult =
        await vehicleTransactionCompletedSchema.safeParseAsync(data);
      if (completedTransactionResult.success) {
        await this.transactionRepository.changeStatus(
          completedTransactionResult.data.transactionId,
          'finished'
        );
      }
    });
  }
}
