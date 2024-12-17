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

  createTransaction(data: CreateVehicleTransactionData) {
    return this.transactionService.processTransactionData({
      action: 'create',
      data,
    });
  }
  updateTransaction(data: UpdateVehicleTransactionData) {
    return this.transactionService.processTransactionData({
      action: 'update',
      data,
    });
  }
  deleteTransaction(data: DeleteVehicleTransactionData) {
    return this.transactionService.processTransactionData({
      action: 'delete',
      data,
    });
  }
  getTransactions(paginationParameters: PaginationParameters) {
    return this.transactionService.getTransactions(paginationParameters);
  }
  getTransactionById(transactionId: string) {
    return this.transactionService.getTransactionById(transactionId);
  }
  scrapAndCreateTransaction(data: ScrapVehicleData) {
    return this.transactionService.scrapAndProcessVehicleData(data);
  }
}
