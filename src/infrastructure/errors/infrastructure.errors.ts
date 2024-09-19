import { AppError } from '../../domain/errors/app.error.js'

export class ServerError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'SERVER_ERROR')
    this.cause = cause
  }
}
