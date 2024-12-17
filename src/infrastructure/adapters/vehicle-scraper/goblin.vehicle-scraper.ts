import type { ScrapVehicleData } from '@zcorp/shared-typing-wheelz';
import axios, { type AxiosInstance } from 'axios';

import type { VehicleScraperPort } from '../../../application/ports/vehicle-scraper.port.js';
import type { ScraperResult } from '../../../domain/entities/scraper-result.entity.js';

export class GoblinVehicleScraper implements VehicleScraperPort {
  private readonly client: AxiosInstance;
  constructor(apiUrl: string) {
    this.client = axios.create({
      baseURL: apiUrl,
    });
  }
  async scrap(data: ScrapVehicleData): Promise<ScraperResult> {
    try {
      const response = await this.client.post('/vehicle', data);
      return response.data;
    } catch {
      return {
        data: null,
      };
    }
  }
}
