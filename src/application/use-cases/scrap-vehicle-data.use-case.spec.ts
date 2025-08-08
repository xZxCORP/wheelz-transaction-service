import { describe, expect, it } from 'vitest';

import type { VehicleScraperPort } from '../ports/vehicle-scraper.port.js';
import { ScrapVehicleDataUseCase } from './scrap-vehicle-data.use-case.js';

describe('ScrapVehicleDataUseCase', () => {
  it('delegates scraping to scraper port (AAA)', async () => {
    // Arrange
    const scraper: VehicleScraperPort = {
      scrap: async () => ({ data: null }),
    };
    const sut = new ScrapVehicleDataUseCase(scraper);

    // Act
    const result = await sut.execute({ vin: 'VIN1' } as any);

    // Assert
    expect(result).toEqual({ data: null });
  });

  it('returns data when scraper returns vehicle payload (AAA)', async () => {
    // Arrange (fake implementation)
    const fakeScraper: VehicleScraperPort = {
      scrap: async () => ({ data: { vehicule: { caracteristiques: { vin: 'V' } } } }) as any,
    };
    const sut = new ScrapVehicleDataUseCase(fakeScraper);

    // Act
    const result = await sut.execute({ vin: 'VIN2' } as any);

    // Assert
    expect(result.data).not.toBeNull();
  });
});
