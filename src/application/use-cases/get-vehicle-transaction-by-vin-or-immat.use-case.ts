import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class GetVehicleTransactionByVinOrImmatUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(vin: string, immat: string) {
    return this.transactionRepository.getByVinOrImmat(vin, immat);
  }
}
