import type { RawVehicleInfos } from './cli-vehicle.entity.js';

export interface ScraperResult {
  data: RawVehicleInfos | null;
}
