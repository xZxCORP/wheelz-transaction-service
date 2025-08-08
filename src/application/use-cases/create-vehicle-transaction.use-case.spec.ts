import { describe, expect, it, vi } from 'vitest';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';
import type { IdGeneratorPort } from '../ports/id-generator.port.js';
import type { QueuePort } from '../ports/queue.port.js';
import { CreateVehicleTransactionUseCase } from './create-vehicle-transaction.use-case.js';

describe('CreateVehicleTransactionUseCase', () => {
  it('creates, persists and enqueues a transaction (AAA)', async () => {
    // Arrange
    const dataSigner: DataSignerPort = {
      sign: vi.fn().mockResolvedValue({ signAlgorithm: 'RSA-SHA256', signature: 'sig' }),
    };
    const dateProvider: DateProviderPort = { now: () => new Date('2024-01-01T00:00:00Z') };
    const idGenerator: IdGeneratorPort = { generate: vi.fn().mockResolvedValue('tx-1') };
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn().mockResolvedValue(undefined) as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const queue: QueuePort = {
      enqueue: vi.fn().mockResolvedValue(true),
      consume: vi.fn() as any,
      clear: vi.fn() as any,
      isRunning: vi.fn().mockResolvedValue(true),
    };

    const sut = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider,
      idGenerator,
      repository,
      queue
    );

    const vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act
    const result = await sut.execute({ action: 'create', data: vehicle }, 'user-1', false);

    // Assert
    expect(result.id).toBe('tx-1');
    expect(result.status).toBe('pending');
    expect(result.timestamp.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(repository.save).toHaveBeenCalled();
    expect(queue.enqueue).toHaveBeenCalledWith({ transactionId: 'tx-1' });
  });

  it('marks transaction as anomaly when forced and includes withAnomaly in signature (AAA)', async () => {
    // Arrange
    const signMock = vi.fn().mockResolvedValue({ signAlgorithm: 'RSA-SHA256', signature: 'sig' });
    const dataSigner: DataSignerPort = { sign: signMock };
    const dateProvider: DateProviderPort = { now: () => new Date('2024-01-01T00:00:00Z') };
    const idGenerator: IdGeneratorPort = { generate: vi.fn().mockResolvedValue('tx-2') };
    const repository: TransactionRepository = {
      getAll: vi.fn() as any,
      getAllWithoutPagination: vi.fn() as any,
      getById: vi.fn() as any,
      getByVinOrImmat: vi.fn() as any,
      save: vi.fn().mockResolvedValue(undefined) as any,
      removeAll: vi.fn() as any,
      isRunning: vi.fn() as any,
      changeStatus: vi.fn() as any,
      countTransactionsOfActionWithVin: vi.fn() as any,
    };
    const queue: QueuePort = {
      enqueue: vi.fn().mockResolvedValue(true),
      consume: vi.fn() as any,
      clear: vi.fn() as any,
      isRunning: vi.fn().mockResolvedValue(true),
    };

    const sut = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider,
      idGenerator,
      repository,
      queue
    );

    const vehicle = { vin: 'V' } as any;

    // Act
    const result = await sut.execute({ action: 'create', data: vehicle }, 'user-1', true);

    // Assert
    const signedPayload = JSON.parse((signMock as any).mock.calls[0][0]);
    expect(signedPayload.withAnomaly).toBe(true);
    expect(signedPayload.userId).toBe('user-1');
    expect(result.withAnomaly).toBe(true);
  });
});
