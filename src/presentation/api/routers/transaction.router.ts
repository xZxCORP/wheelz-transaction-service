import type { ServerInferRequest, ServerInferResponses } from '@ts-rest/core';
import type { transactionContract } from '@zcorp/wheelz-contracts';

import type { TransactionController } from '../../controllers/transaction.controller.ts.js';

export class TransactionRouter {
  constructor(private readonly transactionController: TransactionController) {}

  submitTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.submitTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.submitTransaction>> => {
    const result = await this.transactionController.createTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
  updateTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.updateTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.updateTransaction>> => {
    const result = await this.transactionController.updateTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
  deleteTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.deleteTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.deleteTransaction>> => {
    const result = await this.transactionController.deleteTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
}
