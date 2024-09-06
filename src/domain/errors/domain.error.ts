import { AppError } from './app.error.js'
export class ValidationError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'VALIDATION_ERROR')
    this.cause = cause
  }
}
export class ServerError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'SERVER_ERROR')
    this.cause = cause
  }
}
