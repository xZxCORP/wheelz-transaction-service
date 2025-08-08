import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { GetVehicleTransactionsWithoutPaginationUseCase } from './get-vehicle-transactions-without-pagination.use-case.js';

describe('GetVehicleTransactionsWithoutPaginationUseCase', () => {
  it('returns all transactions without pagination (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn().mockResolvedValue([{ id: 't1' }]) as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionsWithoutPaginationUseCase(repository);

    // Act
    const result = await sut.execute();

    // Assert
    expect(repository.getAllWithoutPagination).toHaveBeenCalled();
    expect(result).toEqual([{ id: 't1' }]);
  });

  it('returns empty array when repository has none (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn().mockResolvedValue([]) as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionsWithoutPaginationUseCase(repository);

    // Act
    const result = await sut.execute();

    // Assert
    expect(result).toEqual([]);
  });
});
