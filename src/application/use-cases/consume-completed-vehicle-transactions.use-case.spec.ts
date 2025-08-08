import { describe, expect, it, vi } from 'vitest';

vi.mock('@zcorp/shared-typing-wheelz', () => ({
  vehicleTransactionCompletedSchema: {
    safeParseAsync: vi.fn().mockResolvedValue({
      success: true,
      data: { transactionId: 'tx-1', newStatus: 'finished' },
    }),
  },
}));

import { vehicleTransactionCompletedSchema } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { LoggerPort } from '../ports/logger.port.js';
import type { QueuePort } from '../ports/queue.port.js';
import { ConsumeCompletedVehicleTransactionsUseCase } from './consume-completed-vehicle-transactions.use-case.js';

describe('ConsumeCompletedVehicleTransactionsUseCase', () => {
  it('updates transaction status when a valid completion message is consumed (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn().mockResolvedValue(undefined) as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const queue: QueuePort = {
      enqueue: vi.fn() as any,
      consume: vi.fn(async (onReceived) => {
        await onReceived({ any: 'payload' });
        return true;
      }) as any,
      clear: vi.fn() as any,
      isRunning: vi.fn().mockResolvedValue(true),
    };
    const logger: LoggerPort = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const sut = new ConsumeCompletedVehicleTransactionsUseCase(repository, queue, logger);

    // Act
    await sut.execute();

    // Assert
    expect(queue.consume).toHaveBeenCalled();
    expect(repository.changeStatus).toHaveBeenCalledWith('tx-1', 'finished');
  });

  it('ignores invalid completion messages (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const queue: QueuePort = {
      enqueue: vi.fn() as any,
      consume: vi.fn(async (onReceived) => {
        (vehicleTransactionCompletedSchema.safeParseAsync as any).mockResolvedValueOnce({
          success: false,
        });
        await onReceived({ any: 'payload' });
        return true;
      }) as any,
      clear: vi.fn() as any,
      isRunning: vi.fn().mockResolvedValue(true),
    };
    const logger: LoggerPort = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const sut = new ConsumeCompletedVehicleTransactionsUseCase(repository, queue, logger);

    // Act
    await sut.execute();

    // Assert
    expect(repository.changeStatus).not.toHaveBeenCalled();
  });
});
