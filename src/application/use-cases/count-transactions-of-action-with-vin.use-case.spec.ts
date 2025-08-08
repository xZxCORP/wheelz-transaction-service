import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { CountTransactionsOfActionWithVinUseCase } from './count-transactions-of-action-with-vin.use-case.js';

describe('CountTransactionsOfActionWithVinUseCase', () => {
  it('counts transactions of an action for a vin (AAA)', async () => {
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
      countTransactionsOfActionWithVin: vi.fn().mockResolvedValue(3) as any,
    };
    const sut = new CountTransactionsOfActionWithVinUseCase(repository);

    // Act
    const count = await sut.execute('VIN1', 'create');

    // Assert
    expect(repository.countTransactionsOfActionWithVin).toHaveBeenCalledWith('VIN1', 'create');
    expect(count).toBe(3);
  });

  it('supports counting delete transactions as well (AAA)', async () => {
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
      countTransactionsOfActionWithVin: vi.fn().mockResolvedValue(1) as any,
    };
    const sut = new CountTransactionsOfActionWithVinUseCase(repository);

    // Act
    const count = await sut.execute('VIN1', 'delete');

    // Assert
    expect(repository.countTransactionsOfActionWithVin).toHaveBeenCalledWith('VIN1', 'delete');
    expect(count).toBe(1);
  });
});
