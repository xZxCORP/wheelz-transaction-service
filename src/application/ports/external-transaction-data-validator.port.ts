import { ResultAsync } from 'neverthrow';

import { VehicleTransactionData } from '../../domain/entities/transaction.entity.js';
import { ExternalTransactionDataValidatorError } from '../errors/application.error.js';

export type TransactionValidationResult = {
  isValid: boolean;
  transaction: VehicleTransactionData;
  message: string;
};
export interface ExternalTransactionDataValidatorPort {
  validate(
    transactionData: VehicleTransactionData
  ): ResultAsync<TransactionValidationResult, ExternalTransactionDataValidatorError>;
}
