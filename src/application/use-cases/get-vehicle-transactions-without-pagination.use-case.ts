import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionsWithoutPaginationUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute() {
    return this.transactionRepository.getAllWithoutPagination();
  }
}
