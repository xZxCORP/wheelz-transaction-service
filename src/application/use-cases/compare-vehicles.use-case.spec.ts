import type { Vehicle } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { ExternalVehicleValidatorPort } from '../ports/external-vehicle-validator.port.js';
import { CompareVehiclesUseCase } from './compare-vehicles.use-case.js';

describe('CompareVehiclesUseCase', () => {
  it('delegates compare to external validator (AAA)', async () => {
    // Arrange
    const external = mockDeep<ExternalVehicleValidatorPort>();
    external.compare.mockResolvedValue({ isValid: true, message: null });
    const sut = new CompareVehiclesUseCase(external);
    const previous: Vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act
    const result = await sut.execute({ features: { brand: 'X' } } as any, previous);

    // Assert
    expect(external.compare).toHaveBeenCalled();
    expect(result.isValid).toBe(true);
  });

  it('returns invalid when differences are rejected by validator (AAA)', async () => {
    // Arrange
    const external = mockDeep<ExternalVehicleValidatorPort>();
    external.compare.mockResolvedValue({ isValid: false, message: 'reject' });
    const sut = new CompareVehiclesUseCase(external);

    // Act
    const result = await sut.execute({ infos: { holderCount: 5 } } as any, { vin: 'VIN1' } as any);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('reject');
  });
});
