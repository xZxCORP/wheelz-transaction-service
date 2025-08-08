import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';

import { GetTransactionAnomaliesUseCase } from './get-transaction-anomalies.use-case.js';

describe('GetTransactionAnomaliesUseCase', () => {
  it('aggregates anomalies per day cumulatively (AAA)', async () => {
    // Arrange
    const sut = new GetTransactionAnomaliesUseCase();
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
        withAnomaly: true,
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
    const result = await sut.execute(transactions);

    // Assert
    expect(result.length).toBe(2);
    expect(result[0]!.value).toBe(1);
    expect(result[1]!.value).toBe(1);
  });

  it('returns empty list when there are no transactions (AAA)', async () => {
    // Arrange
    const sut = new GetTransactionAnomaliesUseCase();

    // Act
    const result = await sut.execute([]);

    // Assert
    expect(result).toEqual([]);
  });
});
