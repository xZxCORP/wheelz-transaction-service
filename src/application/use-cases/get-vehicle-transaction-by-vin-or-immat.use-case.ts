import type { TransactionAction } from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionByVinOrImmatUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(action: TransactionAction, vin?: string, immat?: string) {
    if (!vin && !immat) {
      return null;
    }
    return this.transactionRepository.getByVinOrImmat(action, vin, immat);
  }
}
