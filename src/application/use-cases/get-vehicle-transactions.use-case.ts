import type { PaginationParameters } from '@zcorp/wheelz-contracts';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(paginationParameters: PaginationParameters) {
    return this.transactionRepository.getAll(paginationParameters);
  }
}
