import type { TransactionAction } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class CountTransactionsOfActionWithVinUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(vin: string, type: TransactionAction) {
    return this.transactionRepository.countTransactionsOfActionWithVin(vin, type);
  }
}
