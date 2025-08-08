import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';

import { GetTransactionRepartitionUseCase } from './get-transaction-repartition.use-case.js';

describe('GetTransactionRepartitionUseCase', () => {
  it('computes repartition by type and status (AAA)', () => {
    // Arrange
    const sut = new GetTransactionRepartitionUseCase();

    const createTx: VehicleTransaction = {
      id: 'create-finished',
      action: 'create',
      data: {
        vin: 'VIN',
        features: {} as any,
        infos: {} as any,
        history: [],
        technicalControls: [],
        attachedClientsIds: [],
        sinisterInfos: {} as any,
      },
      timestamp: new Date(),
      status: 'finished',
      dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
      withAnomaly: false,
      userId: 'u',
    };

    const updateTx: VehicleTransaction = {
      id: 'update-pending',
      action: 'update',
      data: { vin: 'VIN', changes: {} as any },
      timestamp: new Date(),
      status: 'pending',
      dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
      withAnomaly: false,
      userId: 'u',
    } as any;

    const deleteTx: VehicleTransaction = {
      id: 'delete-error',
      action: 'delete',
      data: { vin: 'VIN' },
      timestamp: new Date(),
      status: 'error',
      dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
      withAnomaly: false,
      userId: 'u',
    } as any;

    const transactions: VehicleTransaction[] = [createTx, updateTx, deleteTx];

    // Act
    const result = sut.execute(transactions);

    // Assert
    expect(result.type.total).toBe(3);
    expect(result.type.create).toBe(1);
    expect(result.type.update).toBe(1);
    expect(result.type.delete).toBe(1);
    expect(result.status.total).toBe(3);
    expect(result.status.finished).toBe(1);
    expect(result.status.pending).toBe(1);
    expect(result.status.error).toBe(1);
  });

  it('returns zeros when no transactions are provided (AAA)', () => {
    // Arrange
    const sut = new GetTransactionRepartitionUseCase();

    // Act
    const result = sut.execute([]);

    // Assert
    expect(result.type.total).toBe(0);
    expect(result.status.total).toBe(0);
  });
});
