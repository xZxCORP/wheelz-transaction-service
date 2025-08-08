import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';

import { GetTransactionEvolutionUseCase } from './get-transaction-evolution.use-case.js';

describe('GetTransactionEvolutionUseCase', () => {
  it('computes cumulative evolution per day (AAA)', () => {
    // Arrange
    const sut = new GetTransactionEvolutionUseCase();
    const day1 = new Date('2024-01-01T10:00:00Z');
    const day2 = new Date('2024-01-02T10:00:00Z');
    const transactions: VehicleTransaction[] = [
      {
        id: 't1',
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
        timestamp: day1,
        status: 'finished',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u1',
      },
      {
        id: 't2',
        action: 'create',
        data: {
          vin: 'VIN2',
          features: {} as any,
          infos: {} as any,
          history: [],
          technicalControls: [],
          attachedClientsIds: [],
          sinisterInfos: {} as any,
        },
        timestamp: day2,
        status: 'finished',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u1',
      },
    ];

    // Act
    const result = sut.execute(transactions);

    // Assert
    expect(result.length).toBe(2);
    expect(result[0]!.value).toBe(1);
    expect(result[1]!.value).toBe(2);
  });

  it('returns empty list when there are no transactions (AAA)', () => {
    // Arrange
    const sut = new GetTransactionEvolutionUseCase();

    // Act
    const result = sut.execute([]);

    // Assert
    expect(result).toEqual([]);
  });

  it('groups same-day transactions and accumulates across days (AAA)', () => {
    // Arrange
    const sut = new GetTransactionEvolutionUseCase();
    const day1 = new Date('2024-01-01T10:00:00Z');
    const day2 = new Date('2024-01-02T10:00:00Z');
    const mkTx = (date: Date): VehicleTransaction => ({
      id: Math.random().toString(),
      action: 'create',
      data: { vin: 'V', features: {} as any, infos: {} as any, history: [], technicalControls: [], attachedClientsIds: [], sinisterInfos: {} as any },
      timestamp: date,
      status: 'finished',
      dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
      withAnomaly: false,
      userId: 'u',
    });
    const transactions = [mkTx(day1), mkTx(day1), mkTx(day2)];

    // Act
    const result = sut.execute(transactions);

    // Assert
    expect(result[0]!.value).toBe(2);
    expect(result[1]!.value).toBe(3);
  });
});
