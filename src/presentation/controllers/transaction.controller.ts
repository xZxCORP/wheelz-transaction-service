import type {
  CreateVehicleTransactionData,
  DeleteVehicleTransactionData,
  ScrapVehicleData,
  UpdateVehicleTransactionData,
} from '@zcorp/shared-typing-wheelz';
import type { PaginationParameters } from '@zcorp/wheelz-contracts';

import type { TransactionService } from '../../application/services/transaction.service.js';

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  createTransaction(data: CreateVehicleTransactionData, userId: string, force: boolean) {
    return this.transactionService.processTransactionData(
      {
        action: 'create',
        data,
      },
      userId,
      force
    );
  }
  updateTransaction(data: UpdateVehicleTransactionData, userId: string, force: boolean) {
    return this.transactionService.processTransactionData(
      {
        action: 'update',
        data,
      },
      userId,
      force
    );
  }
  deleteTransaction(data: DeleteVehicleTransactionData, userId: string) {
    return this.transactionService.processTransactionData(
      {
        action: 'delete',
        data,
      },
      userId
    );
  }
  getTransactions(paginationParameters: PaginationParameters) {
    return this.transactionService.getTransactions(paginationParameters);
  }
  getTransactionById(transactionId: string) {
    return this.transactionService.getTransactionById(transactionId);
  }
  scrapAndCreateTransaction(data: ScrapVehicleData, userId: string) {
    return this.transactionService.scrapAndProcessVehicleData(data, userId);
  }
  getTransactionStats() {
    return this.transactionService.getTransactionStats();
  }
  revertTransaction(transactionId: string, userId: string) {
    return this.transactionService.revertTransaction(transactionId, userId);
  }
  getVinMetadatas(vin: string) {
    return this.transactionService.getVinMetadatas(vin);
  }
}
