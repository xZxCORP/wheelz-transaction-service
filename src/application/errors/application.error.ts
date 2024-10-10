import { AppError } from '../../domain/errors/app.error.js';

export class QueueError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'QUEUE_ERROR ');
    this.cause = cause;
  }
}
export class HealthError extends AppError {
  constructor(message: string) {
    super(message, 'HEALTH_ERROR');
  }
}
export class ExternalTransactionDataValidatorError extends AppError {
  constructor(message: string) {
    super(message, 'EXTERNAL_TRANSACTION_DATA_VALIDATOR_ERROR');
  }
}
export class DataSignerError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 'DATA_SIGNER_ERROR');
    this.cause = cause;
  }
}
export class DateProviderError extends AppError {
  constructor(message: string) {
    super(message, 'DATE_PROVIDER_ERROR');
  }
}
