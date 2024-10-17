import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';

export interface TransactionRepository {
  getAll(): Promise<VehicleTransaction[]>;
  save(transaction: VehicleTransaction): Promise<void>;
  removeAll(): Promise<void>;
  isRunning(): Promise<boolean>;
  changeStatus(transactionId: string, status: 'pending' | 'finished'): Promise<void>;
}
