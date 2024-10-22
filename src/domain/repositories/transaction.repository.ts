import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';
import type { PaginatedTransactions, PaginationParameters } from '@zcorp/wheelz-contracts';

export interface TransactionRepository {
  getAll(paginationParameters: PaginationParameters): Promise<PaginatedTransactions>;
  save(transaction: VehicleTransaction): Promise<void>;
  removeAll(): Promise<void>;
  isRunning(): Promise<boolean>;
  changeStatus(transactionId: string, status: 'pending' | 'finished'): Promise<void>;
}
