import type { ServerInferRequest, ServerInferResponses } from '@ts-rest/core';
import type { transactionContract } from '@zcorp/wheelz-contracts';

import type { TransactionController } from '../../controllers/transaction.controller.js';

export class TransactionRouter {
  constructor(private readonly transactionController: TransactionController) {}
  getTransactions = async (
    input: ServerInferRequest<typeof transactionContract.transactions.getTransactions>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.getTransactions>> => {
    const result = await this.transactionController.getTransactions(input.query);
    return {
      status: 200,
      body: result,
    };
  };
  getTransactionById = async (
    input: ServerInferRequest<typeof transactionContract.transactions.getTransactionById>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.getTransactionById>> => {
    const result = await this.transactionController.getTransactionById(input.params.id);
    if (!result) {
      return {
        status: 404,
        body: { message: 'Transaction not found' },
      };
    }
    return {
      status: 200,
      body: result,
    };
  };
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
