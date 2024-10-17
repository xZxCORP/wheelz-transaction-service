import type { VehicleTransaction } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<VehicleTransaction[]> {
    return this.transactionRepository.getAll();
  }
}
