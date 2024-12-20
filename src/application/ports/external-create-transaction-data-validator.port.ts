import type { VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

export type TransactionValidationResult = {
  isValid: boolean;
  transaction: VehicleTransactionData;
  message: string;
};
export interface ExternalCreateTransactionDataValidatorPort {
  validate(transactionData: VehicleTransactionData): Promise<TransactionValidationResult>;
}
