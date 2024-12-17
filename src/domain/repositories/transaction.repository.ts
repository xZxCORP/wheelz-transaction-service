import type { Status, VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import type { PaginatedTransactions, PaginationParameters } from '@zcorp/wheelz-contracts';

export interface TransactionRepository {
  getAll(paginationParameters: PaginationParameters): Promise<PaginatedTransactions>;
  getById(transactionId: string): Promise<VehicleTransaction | null>;
  getByVinOrImmat(vin: string, immat: string): Promise<VehicleTransaction | null>;
  save(transaction: VehicleTransaction): Promise<void>;
  removeAll(): Promise<void>;
  isRunning(): Promise<boolean>;
  changeStatus(transactionId: string, status: Status): Promise<void>;
}
