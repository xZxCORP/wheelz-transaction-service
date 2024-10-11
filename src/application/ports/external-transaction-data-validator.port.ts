import {
  type TransactionAction,
  type VehicleTransactionData,
} from '../../domain/entities/transaction.entity.js';

export type TransactionValidationResult<A extends TransactionAction> = {
  isValid: boolean;
  transaction: VehicleTransactionData<A>;
  message: string;
};
export interface ExternalTransactionDataValidatorPort {
  validate<A extends TransactionAction>(
    transactionData: VehicleTransactionData<A>
  ): Promise<TransactionValidationResult<A>>;
}
