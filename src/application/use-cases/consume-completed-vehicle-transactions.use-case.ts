import { vehicleTransactionCompletedSchema } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { LoggerPort } from '../ports/logger.port.js';
import type { QueuePort } from '../ports/queue.port.js';
export class ConsumeCompletedVehicleTransactionsUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private completedQueue: QueuePort,
    private logger: LoggerPort
  ) {}

  async execute(): Promise<void> {
    await this.completedQueue.consume(async (data) => {
      const completedTransactionResult =
        await vehicleTransactionCompletedSchema.safeParseAsync(data);
      if (completedTransactionResult.success) {
        this.logger.info('Consuming completed transaction', completedTransactionResult.data);
        await this.transactionRepository.changeStatus(
          completedTransactionResult.data.transactionId,
          'finished'
        );
      }
    });
  }
}
