import type { AppRouter, ServerInferRequest, ServerInferResponses } from '@ts-rest/core';
import type { transactionContract } from '@zcorp/wheelz-contracts';

import type { HealthcheckController } from '../../controllers/healthcheck.controller.js';
import type { TransactionController } from '../../controllers/transaction.controller.ts.js';

export class TransactionRouter {
  constructor(private readonly transactionController: TransactionController) {}

  submitTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transaction.submitTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transaction.submitTransaction>> => {
    const result = await this.transactionController.createTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
  updateTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transaction.updateTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transaction.updateTransaction>> => {
    const result = await this.transactionController.updateTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
  deleteTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transaction.deleteTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transaction.deleteTransaction>> => {
    const result = await this.transactionController.deleteTransaction(input.body);
    return {
      status: 201,
      body: result,
    };
  };
}
