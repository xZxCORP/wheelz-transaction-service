import { err, ok, okAsync } from 'neverthrow';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, MockProxy } from 'vitest-mock-extended';

import {
  CreateVehicleTransactionData,
  DeleteVehicleTransactionData,
  UpdateVehicleTransactionData,
  VehicleTransactionData,
} from '../../../domain/entities/transaction.entity.js';
import { ValidationError } from '../../../domain/errors/domain.error.js';
import {
  createTransactionFixture,
  deleteTransactionFixture,
  updateTransactionFixture,
} from '../../../domain/fixtures/valid-transaction.fixture.js';
import { TransactionValidationService } from '../../../domain/services/transaction-validation.service.js';
import { ExternalTransactionDataValidatorPort } from '../../ports/external-transaction-data-validator.port.js';
import { ValidateTransactionDataUseCase } from '../validate-transaction-data.use-case.js';

describe('ValidateTransactionDataUseCase', () => {
  let transactionValidationService: MockProxy<TransactionValidationService>;
  let externalTransactionDataValidator: MockProxy<ExternalTransactionDataValidatorPort>;
  let useCase: ValidateTransactionDataUseCase;

  beforeEach(() => {
    transactionValidationService = mock<TransactionValidationService>();
    externalTransactionDataValidator = mock<ExternalTransactionDataValidatorPort>();
    useCase = new ValidateTransactionDataUseCase(
      transactionValidationService,
      externalTransactionDataValidator
    );
  });

  it('should successfully validate create transaction data', async () => {
    const { timestamp, dataSignature, ...transactionData } = createTransactionFixture;
    const inputData: VehicleTransactionData = {
      action: 'create',
      data: transactionData.data as CreateVehicleTransactionData,
    };
    transactionValidationService.validateTransactionData.mockReturnValue(ok(inputData));
    externalTransactionDataValidator.validate.mockReturnValue(
      okAsync({
        isValid: true,
        transaction: inputData,
        message: 'valid',
      })
    );

    const result = await useCase.execute(inputData);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(inputData);
    }
    expect(transactionValidationService.validateTransactionData).toHaveBeenCalledWith(inputData);
    expect(externalTransactionDataValidator.validate).toHaveBeenCalledWith(inputData);
  });

  it('should successfully validate update transaction data', async () => {
    const { timestamp, dataSignature, ...transactionData } = updateTransactionFixture;
    const inputData: VehicleTransactionData = {
      action: 'update',
      data: transactionData.data as UpdateVehicleTransactionData,
    };
    transactionValidationService.validateTransactionData.mockReturnValue(ok(inputData));
    externalTransactionDataValidator.validate.mockReturnValue(
      okAsync({ isValid: true, transaction: inputData, message: 'valid' })
    );

    const result = await useCase.execute(inputData);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(inputData);
    }
  });

  it('should successfully validate delete transaction data', async () => {
    const { timestamp, dataSignature, ...transactionData } = deleteTransactionFixture;
    const inputData: VehicleTransactionData = {
      action: 'delete',
      data: transactionData.data as DeleteVehicleTransactionData,
    };
    transactionValidationService.validateTransactionData.mockReturnValue(ok(inputData));
    externalTransactionDataValidator.validate.mockReturnValue(
      okAsync({ isValid: true, transaction: inputData, message: 'valid' })
    );

    const result = await useCase.execute(inputData);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual(inputData);
    }
  });

  it('should return ValidationError when internal validation fails', async () => {
    const { timestamp, dataSignature, ...transactionData } = createTransactionFixture;
    const validationError = new ValidationError('Invalid transaction data', {});
    transactionValidationService.validateTransactionData.mockReturnValue(err(validationError));

    const result = await useCase.execute(transactionData);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toBe('Invalid transaction data');
    }
    expect(transactionValidationService.validateTransactionData).toHaveBeenCalledWith(
      transactionData
    );
    expect(externalTransactionDataValidator.validate).not.toHaveBeenCalled();
  });

  it('should return ValidationError when external validation fails', async () => {
    const { timestamp, dataSignature, ...transactionData } = updateTransactionFixture;
    const inputData: VehicleTransactionData = {
      action: 'update',
      data: transactionData.data as UpdateVehicleTransactionData,
    };
    transactionValidationService.validateTransactionData.mockReturnValue(ok(inputData));
    externalTransactionDataValidator.validate.mockReturnValue(
      okAsync({ isValid: false, transaction: inputData, message: 'External validation failed' })
    );

    const result = await useCase.execute(transactionData);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(ValidationError);
      expect(result.error.message).toBe('External validation failed');
    }
  });
});
