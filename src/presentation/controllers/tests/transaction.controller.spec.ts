/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';

import { TransactionService } from '../../../application/services/transaction.service.js';
import { ValidationError } from '../../../domain/errors/domain.error.js';
import { sampleVehicle } from '../../../domain/fixtures/base-vehicle.fixture.js';
import {
  createTransactionFixture,
  deleteTransactionFixture,
  updateTransactionDataFixture,
  updateTransactionFixture,
} from '../../../domain/fixtures/valid-transaction.fixture.js';
import { ApiError, errorToStatusCode } from '../../errors/api.error.js';
import { HttpRequest, HttpResponse } from '../../types/http.js';
import { TransactionController } from '../transaction.controller.ts.js';

describe('TransactionController', () => {
  let controller: TransactionController;
  let mockService: MockProxy<TransactionService>;

  beforeEach(() => {
    mockService = mock<TransactionService>();
    controller = new TransactionController(mockService);
  });

  it('defines correct routes', () => {
    const routes = controller.getRoutes();
    expect(routes).toEqual([
      { method: 'post', path: '/transactions', handler: expect.any(Function) },
      { method: 'patch', path: '/transactions', handler: expect.any(Function) },
      { method: 'delete', path: '/transactions', handler: expect.any(Function) },
    ]);
  });

  const executeRequest = (method: string, body: any): ResultAsync<HttpResponse, ApiError> => {
    const request: HttpRequest = { body, method } as HttpRequest;
    const handler = controller.getRoutes().find((r) => r.method === method)!.handler;
    return handler(request);
  };

  describe('POST /transactions', () => {
    it('processes create transaction successfully', async () => {
      mockService.processTransactionData.mockReturnValue(okAsync(createTransactionFixture));

      const result = await executeRequest('post', sampleVehicle);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ statusCode: 200, body: createTransactionFixture });
      expect(mockService.processTransactionData).toHaveBeenCalledWith({
        data: sampleVehicle,
        action: 'create',
      });
    });

    it('handles errors for create transaction', async () => {
      const mockError = new ValidationError('Invalid create data', {});
      mockService.processTransactionData.mockReturnValue(errAsync(mockError));

      const result = await executeRequest('post', sampleVehicle);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(errorToStatusCode['VALIDATION_ERROR']);
      expect(error.message).toBe('Invalid create data');
    });
  });

  describe('PATCH /transactions', () => {
    it('processes update transaction successfully', async () => {
      mockService.processTransactionData.mockReturnValue(okAsync(updateTransactionFixture));

      const result = await executeRequest('patch', updateTransactionDataFixture);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ statusCode: 200, body: updateTransactionFixture });
      expect(mockService.processTransactionData).toHaveBeenCalledWith({
        data: updateTransactionDataFixture,
        action: 'update',
      });
    });

    it('handles errors for update transaction', async () => {
      const mockError = new ValidationError('Invalid update data', {});
      mockService.processTransactionData.mockReturnValue(errAsync(mockError));

      const result = await executeRequest('patch', { vin: '123', changes: {} });

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(errorToStatusCode['VALIDATION_ERROR']);
      expect(error.message).toBe('Invalid update data');
    });
  });

  describe('DELETE /transactions', () => {
    it('processes delete transaction successfully', async () => {
      const deleteData = { vin: '123' };
      mockService.processTransactionData.mockReturnValue(okAsync(deleteTransactionFixture));

      const result = await executeRequest('delete', deleteData);

      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({ statusCode: 200, body: deleteTransactionFixture });
      expect(mockService.processTransactionData).toHaveBeenCalledWith({
        data: deleteData,
        action: 'delete',
      });
    });

    it('handles errors for delete transaction', async () => {
      const mockError = new ValidationError('Invalid delete data', {});
      mockService.processTransactionData.mockReturnValue(errAsync(mockError));

      const result = await executeRequest('delete', { vin: '123' });

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(errorToStatusCode['VALIDATION_ERROR']);
      expect(error.message).toBe('Invalid delete data');
    });
  });
});
