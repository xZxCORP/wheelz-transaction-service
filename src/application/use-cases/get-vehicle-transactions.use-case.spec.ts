import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { GetVehicleTransactionsUseCase } from './get-vehicle-transactions.use-case.js';

describe('GetVehicleTransactionsUseCase', () => {
  it('returns paginated transactions (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn().mockResolvedValue({
        items: [{ id: 't1' }],
        meta: { page: 1, perPage: 10, total: 1 },
      }) as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionsUseCase(repository);

    // Act
    const result = await sut.execute({ page: 1, perPage: 10 });

    // Assert
    expect(repository.getAll).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    expect(result.items.length).toBe(1);
  });

  it('passes through provided pagination parameters (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn().mockResolvedValue({
        items: [],
        meta: { page: 2, perPage: 5, total: 0 },
      }) as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionsUseCase(repository);

    // Act
    const result = await sut.execute({ page: 2, perPage: 5 });

    // Assert
    expect(repository.getAll).toHaveBeenCalledWith({ page: 2, perPage: 5 });
    expect(result.meta.page).toBe(2);
    expect(result.meta.perPage).toBe(5);
  });
});
