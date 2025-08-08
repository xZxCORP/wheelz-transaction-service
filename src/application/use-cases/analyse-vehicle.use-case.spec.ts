import type { Vehicle } from '@zcorp/shared-typing-wheelz';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { ExternalVehicleValidatorPort } from '../ports/external-vehicle-validator.port.js';
import { AnalyseVehicleUseCase } from './analyse-vehicle.use-case.js';

describe('AnalyseVehicleUseCase', () => {
  it('delegates analysis to external validator (AAA)', async () => {
    // Arrange
    const external = mockDeep<ExternalVehicleValidatorPort>();
    external.analyse.mockResolvedValue({ isValid: true, message: null });
    const sut = new AnalyseVehicleUseCase(external);
    const vehicle: Vehicle = {
      vin: 'VIN1',
      features: {} as any,
      infos: {} as any,
      history: [],
      technicalControls: [],
      attachedClientsIds: [],
      sinisterInfos: {} as any,
    };

    // Act
    const result = await sut.execute(vehicle);

    // Assert
    expect(external.analyse).toHaveBeenCalledWith(vehicle);
    expect(result.isValid).toBe(true);
  });

  it('returns invalid when external validator reports anomaly (AAA)', async () => {
    // Arrange
    const external = mockDeep<ExternalVehicleValidatorPort>();
    external.analyse.mockResolvedValue({ isValid: false, message: 'reason' });
    const sut = new AnalyseVehicleUseCase(external);

    // Act
    const result = await sut.execute({ vin: 'VIN2' } as any);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('reason');
  });
});
