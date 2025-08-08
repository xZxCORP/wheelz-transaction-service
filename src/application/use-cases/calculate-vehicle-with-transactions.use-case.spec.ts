import type { Vehicle, VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';

import { CalculateVehicleWithTransactionsUseCase } from './calculate-vehicle-with-transactions.use-case.js';

describe('CalculateVehicleWithTransactionsUseCase', () => {
  it('applies create, update, delete in order and returns null after delete (AAA)', () => {
    // Arrange
    const sut = new CalculateVehicleWithTransactionsUseCase();
    const baseVehicle: Vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };
    const transactions: VehicleTransaction[] = [
      {
        id: 't1',
        action: 'create',
        data: baseVehicle,
        timestamp: new Date('2024-01-01'),
        status: 'pending',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u1',
      },
      {
        id: 't2',
        action: 'update',
        data: { vin: 'VIN1', changes: { features: { brand: 'X' } } } as any,
        timestamp: new Date('2024-01-02'),
        status: 'pending',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u1',
      },
      {
        id: 't3',
        action: 'delete',
        data: { vin: 'VIN1' } as any,
        timestamp: new Date('2024-01-03'),
        status: 'pending',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u1',
      },
    ];

    // Act
    const result = sut.execute('VIN1', transactions);

    // Assert
    expect(result).toBeNull();
  });

  it('returns created vehicle when only a create transaction exists (AAA)', () => {
    // Arrange
    const sut = new CalculateVehicleWithTransactionsUseCase();
    const created: Vehicle = {
      vin: 'V',
      features: { brand: 'B' } as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };
    const transactions: VehicleTransaction[] = [
      {
        id: 't1',
        action: 'create',
        data: created,
        timestamp: new Date(),
        status: 'finished',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u',
      },
    ];

    // Act
    const result = sut.execute('V', transactions)!;

    // Assert
    expect(result.features.brand).toBe('B');
  });

  it('merges update changes into current vehicle (AAA)', () => {
    // Arrange
    const sut = new CalculateVehicleWithTransactionsUseCase();
    const created: Vehicle = {
      vin: 'V',
      features: { brand: 'Old', model: 'M' } as any,
      infos: { holderCount: 1 } as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };
    const transactions: VehicleTransaction[] = [
      {
        id: 't1',
        action: 'create',
        data: created,
        timestamp: new Date(),
        status: 'finished',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u',
      },
      {
        id: 't2',
        action: 'update',
        data: { vin: 'V', changes: { features: { brand: 'New' } } } as any,
        timestamp: new Date(),
        status: 'finished',
        dataSignature: { signAlgorithm: 'RSA-SHA256', signature: 's' },
        withAnomaly: false,
        userId: 'u',
      },
    ];

    // Act
    const result = sut.execute('V', transactions)!;

    // Assert
    expect(result.features.brand).toBe('New');
    expect(result.features.model).toBe('M');
  });
});
