import { ResultAsync } from 'neverthrow';

import { TransactionService } from '../../application/services/transaction.service.js';
import { TransactionAction } from '../../domain/entities/transaction.entity.js';
import { ApiError } from '../errors/api.error.js';
import { HttpRequest, HttpResponse, RouteDefinition } from '../types/http.js';
import { AbstractController } from './abstract.controller.js';

export class TransactionController extends AbstractController {
  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  getRoutes(): RouteDefinition[] {
    return [
      {
        method: 'post',
        path: '/transactions',
        handler: this.handleCreateTransaction.bind(this),
      },
      {
        method: 'patch',
        path: '/transactions',
        handler: this.handleUpdateTransaction.bind(this),
      },
      {
        method: 'delete',
        path: '/transactions',
        handler: this.handleDeleteTransaction.bind(this),
      },
    ];
  }

  private handleCreateTransaction(request: HttpRequest): ResultAsync<HttpResponse, ApiError> {
    return this.processTransaction(request, 'create');
  }

  private handleUpdateTransaction(request: HttpRequest): ResultAsync<HttpResponse, ApiError> {
    return this.processTransaction(request, 'update');
  }

  private handleDeleteTransaction(request: HttpRequest): ResultAsync<HttpResponse, ApiError> {
    return this.processTransaction(request, 'delete');
  }

  private processTransaction(
    request: HttpRequest,
    action: TransactionAction
  ): ResultAsync<HttpResponse, ApiError> {
    return this.transactionService
      .processTransactionData({ data: request.body, action })
      .map((transaction) => ({
        statusCode: 200,
        body: transaction,
      }))
      .mapErr((error) => ApiError.fromError(error));
  }
}
