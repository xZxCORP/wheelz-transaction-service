import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { GetVehicleTransactionByVinOrImmatUseCase } from './get-vehicle-transaction-by-vin-or-immat.use-case.js';

describe('GetVehicleTransactionByVinOrImmatUseCase', () => {
  it('queries repository by vin (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn().mockResolvedValue({ id: 't1' }) as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVehicleTransactionByVinOrImmatUseCase(repository);

    // Act
    const result = await sut.execute('create', 'VIN1', undefined);

    // Assert
    expect(repository.getByVinOrImmat).toHaveBeenCalledWith('create', 'VIN1', undefined);
    expect(result).toEqual({ id: 't1' });
  });

  it('returns null and does not query repository when vin and immat are missing (AAA)', async () => {
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
    const sut = new GetVehicleTransactionByVinOrImmatUseCase(repository);

    // Act
    const result = await sut.execute('create');

    // Assert
    expect(result).toBeNull();
    expect(repository.getByVinOrImmat).not.toHaveBeenCalled();
  });
});
