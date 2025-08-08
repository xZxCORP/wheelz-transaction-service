import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { GetVehicleTransactionByIdUseCase } from './get-vehicle-transaction-by-id.use-case.js';

describe('GetVehicleTransactionByIdUseCase', () => {
  it('fetches a transaction by id (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn().mockResolvedValue({ id: 't1' }) as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionByIdUseCase(repository);

    // Act
    const result = await sut.execute('t1');

    // Assert
    expect(repository.getById).toHaveBeenCalledWith('t1');
    expect(result).toEqual({ id: 't1' });
  });

  it('returns null when repository returns none (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn().mockResolvedValue(null) as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionByIdUseCase(repository);

    // Act
    const result = await sut.execute('missing');

    // Assert
    expect(result).toBeNull();
  });
});
