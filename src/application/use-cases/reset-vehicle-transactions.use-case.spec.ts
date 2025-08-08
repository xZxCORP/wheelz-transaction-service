import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { QueuePort } from '../ports/queue.port.js';
import { ResetVehicleTransactionsUseCase } from './reset-vehicle-transactions.use-case.js';

describe('ResetVehicleTransactionsUseCase', () => {
  it('clears repository and queue (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn().mockResolvedValue(undefined) as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const queue: QueuePort = {
      enqueue: vi.fn() as any,
      consume: vi.fn() as any,
      clear: vi.fn().mockResolvedValue(true),
      isRunning: vi.fn().mockResolvedValue(true),
    };
    const sut = new ResetVehicleTransactionsUseCase(repository, queue);

    // Act
    await sut.execute();

    // Assert
    expect(repository.removeAll).toHaveBeenCalled();
    expect(queue.clear).toHaveBeenCalled();
  });
});
