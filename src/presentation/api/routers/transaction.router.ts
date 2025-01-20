import type { ServerInferRequest, ServerInferResponses } from '@ts-rest/core';
import type { transactionContract } from '@zcorp/wheelz-contracts';

import { InvalidTransactionError } from '../../../domain/errors/invalid-transaction.error.js';
import { TransactionNotFoundError } from '../../../domain/errors/transaction-not-found.error.js';
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
    try {
      const result = await this.transactionController.createTransaction(
        input.body,
        input.query.force
      );
      return {
        status: 201,
        body: result,
      };
    } catch (error) {
      if (error instanceof InvalidTransactionError) {
        return {
          status: 422,
          body: { message: error.message },
        };
      }
      throw error;
    }
  };

  updateTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.updateTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.updateTransaction>> => {
    try {
      const result = await this.transactionController.updateTransaction(
        input.body,
        input.query.force
      );
      return {
        status: 201,
        body: result,
      };
    } catch (error) {
      if (error instanceof InvalidTransactionError) {
        return {
          status: 422,
          body: { message: error.message },
        };
      }
      throw error;
    }
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
  scrapAndCreateTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.scrapAndCreateTransaction>
  ): Promise<
    ServerInferResponses<typeof transactionContract.transactions.scrapAndCreateTransaction>
  > => {
    const result = await this.transactionController.scrapAndCreateTransaction(input.body);
    if (!result) {
      return {
        status: 404,
        body: { message: 'Impossible de trouver le véhicule après une recherche approfondie.' },
      };
    }
    return {
      status: 201,
      body: {
        message:
          'Le véhicule a bien été trouvé et est en attente de validation, vous pourrez récupérer son rapport très bientôt',
      },
    };
  };
  stats = async (
    _input: ServerInferRequest<typeof transactionContract.transactions.stats>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.stats>> => {
    const result = await this.transactionController.getTransactionStats();
    return {
      status: 200,
      body: result,
    };
  };
  revertTransaction = async (
    input: ServerInferRequest<typeof transactionContract.transactions.revertTransaction>
  ): Promise<ServerInferResponses<typeof transactionContract.transactions.revertTransaction>> => {
    try {
      await this.transactionController.revertTransaction(input.body.id);
      return {
        status: 201,
        body: { message: 'La transaction a bien été revertée' },
      };
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        return {
          status: 404,
          body: { message: error.message },
        };
      }
      throw error;
    }
  };
}
