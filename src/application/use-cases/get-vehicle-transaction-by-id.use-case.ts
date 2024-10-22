import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionByIdUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string) {
    return this.transactionRepository.getById(id);
  }
}
