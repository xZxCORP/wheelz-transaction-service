import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class MongoTransactionRepository implements TransactionRepository {
  async changeStatus(transactionId: string, status: 'pending' | 'finished'): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<any[]> {
    throw new Error('Method not implemented.');
  }

  async removeAll(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async save(transaction: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
