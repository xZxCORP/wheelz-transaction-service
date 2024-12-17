import type { ScrapVehicleData } from '@zcorp/shared-typing-wheelz';

import type { ScraperResult } from '../../domain/entities/scraper-result.entity.js';
import type { VehicleScraperPort } from '../ports/vehicle-scraper.port.js';

export class ScrapVehicleDataUseCase {
  constructor(private readonly vehicleScraperPort: VehicleScraperPort) {}
  async execute(data: ScrapVehicleData): Promise<ScraperResult> {
    return this.vehicleScraperPort.scrap(data);
  }
}
