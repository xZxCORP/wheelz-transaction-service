import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { GetVinMetadatasUseCase } from './get-vin-metadatas.use-case.js';

describe('GetVinMetadatasUseCase', () => {
  it('computes first and last transaction dates (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn().mockResolvedValue([
        {
          id: 'c1',
          action: 'create',
          data: {
            vin: 'VIN1',
            features: {} as any,
            infos: {} as any,
            history: [],
            technicalControls: [],
            attachedClientsIds: [],
            sinisterInfos: {} as any,
          },
          timestamp: new Date('2024-01-01'),
          status: 'finished',
          dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
          withAnomaly: false,
          userId: 'u',
        },
        {
          id: 'u1',
          action: 'update',
          data: { vin: 'VIN1', changes: {} } as any,
          timestamp: new Date('2024-01-10'),
          status: 'finished',
          dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
          withAnomaly: false,
          userId: 'u',
        },
      ] as VehicleTransaction[]) as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVinMetadatasUseCase(repository);

    // Act
    const result = await sut.execute('VIN1');

    // Assert
    expect(result.firstTransactionDate.toISOString()).toBe(new Date('2024-01-01').toISOString());
    expect(result.lastTransactionDate.toISOString()).toBe(new Date('2024-01-10').toISOString());
  });

  it('returns Date objects even if no finished updates exist (AAA)', async () => {
    // Arrange
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn().mockResolvedValue([
        {
          id: 'c1',
          action: 'create',
          data: { vin: 'VIN1' } as any,
          timestamp: new Date('2024-01-02'),
          status: 'finished',
          dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
          withAnomaly: false,
          userId: 'u',
        },
      ] as VehicleTransaction[]) as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn() as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const sut = new GetVinMetadatasUseCase(repository);

    // Act
    const result = await sut.execute('VIN1');

    // Assert
    expect(result.firstTransactionDate).toBeInstanceOf(Date);
    expect(result.lastTransactionDate).toBeInstanceOf(Date);
  });
});
