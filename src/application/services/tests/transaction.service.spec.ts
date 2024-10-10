import { errAsync, okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';

import { ValidationError } from '../../../domain/errors/domain.error.js';
import {
  createTransactionDataFixture,
  createTransactionFixture,
  deleteTransactionFixture,
  updateTransactionDataFixture,
  updateTransactionFixture,
} from '../../../domain/fixtures/valid-transaction.fixture.js';
import { DataSignerError, QueueError } from '../../errors/application.error.js';
import { CreateVehicleTransactionUseCase } from '../../use-cases/create-vehicle-transaction.use-case.js';
import { EnqueueTransactionUseCase } from '../../use-cases/enqueue-transaction.use-case.js';
import { ValidateTransactionDataUseCase } from '../../use-cases/validate-transaction-data.use-case.js';
import { TransactionService } from '../transaction.service.js';

describe('TransactionService', () => {
  let validateTransactionDataUseCase: MockProxy<ValidateTransactionDataUseCase>;
  let createVehicleTransactionUseCase: MockProxy<CreateVehicleTransactionUseCase>;
  let enqueueTransactionUseCase: MockProxy<EnqueueTransactionUseCase>;
  let transactionService: TransactionService;

  beforeEach(() => {
    validateTransactionDataUseCase = mock<ValidateTransactionDataUseCase>();
    createVehicleTransactionUseCase = mock<CreateVehicleTransactionUseCase>();
    enqueueTransactionUseCase = mock<EnqueueTransactionUseCase>();
    transactionService = new TransactionService(
      validateTransactionDataUseCase,
      createVehicleTransactionUseCase,
      enqueueTransactionUseCase
    );
  });

  it('should successfully process a create transaction', async () => {
    validateTransactionDataUseCase.execute.mockReturnValue(okAsync(createTransactionDataFixture));
    createVehicleTransactionUseCase.execute.mockReturnValue(okAsync(createTransactionFixture));
    enqueueTransactionUseCase.execute.mockReturnValue(okAsync(createTransactionFixture));

    const result = await transactionService.processTransactionData(createTransactionDataFixture);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(createTransactionFixture);
    }
    expect(validateTransactionDataUseCase.execute).toHaveBeenCalledWith(
      createTransactionDataFixture
    );
    expect(createVehicleTransactionUseCase.execute).toHaveBeenCalledWith(
      createTransactionDataFixture
    );
    expect(enqueueTransactionUseCase.execute).toHaveBeenCalledWith(createTransactionFixture);
  });

  it('should successfully process an update transaction', async () => {
    validateTransactionDataUseCase.execute.mockReturnValue(okAsync(updateTransactionDataFixture));
    createVehicleTransactionUseCase.execute.mockReturnValue(okAsync(updateTransactionFixture));
    enqueueTransactionUseCase.execute.mockReturnValue(okAsync(updateTransactionFixture));

    const result = await transactionService.processTransactionData(updateTransactionDataFixture);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(updateTransactionFixture);
    }
  });

  it('should fail when validation fails', async () => {
    const inputData = { action: 'create', data: {} };
    const validationError = new ValidationError('Invalid data', {});

    validateTransactionDataUseCase.execute.mockReturnValue(errAsync(validationError));

    const result = await transactionService.processTransactionData(inputData);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toBe('Invalid data');
    }
    expect(createVehicleTransactionUseCase.execute).not.toHaveBeenCalled();
    expect(enqueueTransactionUseCase.execute).not.toHaveBeenCalled();
  });

  it('should fail when create transaction fails', async () => {
    const createError = new DataSignerError('Failed to sign transaction');

    validateTransactionDataUseCase.execute.mockReturnValue(okAsync(createTransactionDataFixture));
    createVehicleTransactionUseCase.execute.mockReturnValue(errAsync(createError));

    const result = await transactionService.processTransactionData(createTransactionDataFixture);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('Failed to sign transaction');
    }
    expect(enqueueTransactionUseCase.execute).not.toHaveBeenCalled();
  });

  it('should fail when enqueue fails', async () => {
    const queueError = new QueueError('Failed to enqueue transaction');

    validateTransactionDataUseCase.execute.mockReturnValue(okAsync(createTransactionDataFixture));
    createVehicleTransactionUseCase.execute.mockReturnValue(okAsync(deleteTransactionFixture));
    enqueueTransactionUseCase.execute.mockReturnValue(errAsync(queueError));

    const result = await transactionService.processTransactionData(createTransactionDataFixture);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(QueueError);
      expect(result.error.message).toBe('Failed to enqueue transaction');
    }
  });
});
