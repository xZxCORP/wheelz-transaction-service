import type { VinMetadatas } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVinMetadatasUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(vin: string): Promise<VinMetadatas> {
    const transactions = await this.transactionRepository.getAllWithoutPagination();
    const createTransactions = transactions.filter(
      (transaction) =>
        transaction.action === 'create' &&
        transaction.status === 'finished' &&
        transaction.data.vin === vin
    );
    const updateTransactions = transactions.filter(
      (transaction) =>
        transaction.action === 'update' &&
        transaction.status === 'finished' &&
        transaction.data.vin === vin
    );
    const defaultDate = new Date();
    return {
      firstTransactionDate: createTransactions.at(-1)?.timestamp ?? defaultDate,
      lastTransactionDate: updateTransactions.at(-1)?.timestamp ?? defaultDate,
    };
  }
}
