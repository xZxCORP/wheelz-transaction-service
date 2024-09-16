import { AppError } from '../../domain/errors/app.error.js'
export interface ApiErrorBody {
  code: string
  message: string
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

  static fromAppError(error: AppError, statusCode: number = 500): ApiError {
    return new ApiError(error.code, error.message, statusCode)
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
