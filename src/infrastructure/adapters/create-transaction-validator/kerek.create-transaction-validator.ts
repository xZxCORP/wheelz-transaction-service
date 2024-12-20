import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import type {
  ExternalCreateTransactionDataValidatorPort,
  TransactionValidationResult,
} from '../../../application/ports/external-create-transaction-data-validator.port.js';
interface KerekPredictRequest {
  year: number;
  owners: number;
  mileage: number;
  mark: string;
  model: string;
}
type KerekPredictResponse = string | null;
export class KerekCreateTransactionValidator implements ExternalCreateTransactionDataValidatorPort {
  private readonly client: AxiosInstance;
  constructor(apiUrl: string) {
    this.client = axios.create({
      baseURL: apiUrl,
    });
  }
  async validate(transaction: VehicleTransactionData): Promise<TransactionValidationResult> {
    if (transaction.action !== 'create') {
      return {
        isValid: false,
        message: 'Transaction is not valid',
        transaction: transaction,
      };
    }
    const parsedYear = transaction.data.infos.firstSivRegistrationDate.split('-')[0] ?? '2020';
    const lastTechnicalControlMileage =
      transaction.data.technicalControls.length > 0
        ? transaction.data.technicalControls.at(-1)!.km
        : -1;
    const request: KerekPredictRequest = {
      year: Number.parseInt(parsedYear),
      owners: transaction.data.infos.holderCount,
      mileage: lastTechnicalControlMileage,
      mark: transaction.data.features.brand,
      model: transaction.data.features.model,
    };
    try {
      const { data } = await this.client.post<KerekPredictResponse>('/predict', request);

      if (data) {
        return {
          isValid: false,
          message: data,
          transaction: transaction,
        };
      }
      return {
        isValid: true,
        message: 'La transaction est valide',
        transaction: transaction,
      };
    } catch {
      return {
        isValid: false,
        message: 'Impossible de vérifier la transaction',
        transaction: transaction,
      };
    }
  }
}
