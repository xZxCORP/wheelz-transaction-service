import type { ScrapVehicleData } from '@zcorp/shared-typing-wheelz';

import type { ScraperResult } from '../../domain/entities/scraper-result.entity.js';

export interface VehicleScraperPort {
  scrap(data: ScrapVehicleData): Promise<ScraperResult>;
}
