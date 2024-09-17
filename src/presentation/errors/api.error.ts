import { AppError } from '../../domain/errors/app.error.js'

export const errorToStatusCode: Record<string, number> = {
  VALIDATION_ERROR: 400,
  SERVER_ERROR: 500,
  QUEUE_ERROR: 500,
  HEALTH_ERROR: 500,
  EXTERNAL_TRANSACTION_DATA_VALIDATOR_ERROR: 400,
  DATA_SIGNER_ERROR: 500,
  DATE_PROVIDER_ERROR: 500,
}

export class ApiError extends AppError {
  constructor(
    code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly cause?: unknown
  ) {
    super(message, code)
  }

  static fromAppError(error: AppError): ApiError {
    const statusCode = errorToStatusCode[error.code] || 500

    return new ApiError(error.code, error.message, statusCode, error.cause)
  }

  static fromError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error
    }
    if (error instanceof AppError) {
      return ApiError.fromAppError(error)
    }
    if (error instanceof Error) {
      return new ApiError('INTERNAL_SERVER_ERROR', error.message, 500, error)
    }
    return new ApiError('UNKNOWN_ERROR', 'An unknown error occurred', 500)
  }
}
