import type {
  CreateVehicleTransactionData,
  DeleteVehicleTransactionData,
  UpdateVehicleTransactionData,
} from '@zcorp/shared-typing-wheelz';

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
  getTransactions() {
    return this.transactionService.getTransactions();
  }
}
