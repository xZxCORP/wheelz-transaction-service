import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { ChainServicePort } from '../ports/chain-service.port.js';
import { GetVehicleOfTheChainUseCase } from './get-vehicle-of-the-chain.use-case.js';

describe('GetVehicleOfTheChainUseCase', () => {
  it('retrieves vehicle from chain service (AAA)', async () => {
    // Arrange
    const chain = mockDeep<ChainServicePort>();
    chain.getVehicleOfTheChain.mockResolvedValue({ vin: 'VIN1' } as any);
    const sut = new GetVehicleOfTheChainUseCase(chain);

    // Act
    const result = await sut.execute('VIN1');

    // Assert
    expect(chain.getVehicleOfTheChain).toHaveBeenCalledWith('VIN1');
    expect(result).toEqual({ vin: 'VIN1' });
  });

  it('returns null when chain service has no vehicle (AAA)', async () => {
    // Arrange
    const chain = mockDeep<ChainServicePort>();
    chain.getVehicleOfTheChain.mockResolvedValue(null);
    const sut = new GetVehicleOfTheChainUseCase(chain);

    // Act
    const result = await sut.execute('VIN2');

    // Assert
    expect(result).toBeNull();
  });
});
