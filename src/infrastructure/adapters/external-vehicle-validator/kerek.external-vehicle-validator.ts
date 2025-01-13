import type { Vehicle } from '@zcorp/shared-typing-wheelz';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type {
  ExternalVehicleValidatorPort,
  VehicleValidationResult,
} from '../../../application/ports/external-vehicle-validator.port.js';
interface KerekVehicle {
  year: number;
  owners: number;
  mileage: number;
  mark: string;
  model: string;
}
interface KerekAnalyseRequest {
  vehicle: KerekVehicle;
}
interface KerekCompareRequest {
  vehicle: KerekVehicle;
  old_vehicle: KerekVehicle;
}
interface KerekResponse {
  anomaly: boolean;
  reason: string | null;
}
export class KerekExternalVehicleValidator implements ExternalVehicleValidatorPort {
  private readonly client: AxiosInstance;
  constructor(apiUrl: string) {
    this.client = axios.create({
      baseURL: apiUrl,
    });
  }

  async analyse(vehicle: Vehicle): Promise<VehicleValidationResult> {
    try {
      const mappedVehicle = this._prepareVehicle(vehicle);
      const request: KerekAnalyseRequest = { vehicle: mappedVehicle };
      const { data } = await this.client.post<KerekResponse>('/predict/analyse', request);

      return {
        isValid: data.anomaly,
        message: data.reason,
      };
    } catch {
      return {
        isValid: false,
        message: 'Impossible de vérifier ce véhicule',
      };
    }
  }

  async compare(vehicle: Vehicle, previousVehicle: Vehicle): Promise<VehicleValidationResult> {
    try {
      const mappedVehicle = this._prepareVehicle(vehicle);
      const mappedPreviousVehicle = this._prepareVehicle(previousVehicle);
      const request: KerekCompareRequest = {
        vehicle: mappedVehicle,
        old_vehicle: mappedPreviousVehicle,
      };
      const { data } = await this.client.post<KerekResponse>('/predict/compare', request);

      return {
        isValid: data.anomaly,
        message: data.reason,
      };
    } catch {
      return {
        isValid: false,
        message: 'Impossible de vérifier les différences',
      };
    }
  }

  _prepareVehicle(vehicle: Vehicle): KerekVehicle {
    const parsedYear = vehicle.infos.firstSivRegistrationDate.split('-')[0] ?? '2020';
    const lastTechnicalControlMileage =
      vehicle.technicalControls.length > 0 ? vehicle.technicalControls.at(-1)!.km : -1;
    return {
      year: Number.parseInt(parsedYear),
      owners: vehicle.infos.holderCount,
      mileage: lastTechnicalControlMileage,
      mark: vehicle.features.brand,
      model: vehicle.features.model,
    };
  }
}
