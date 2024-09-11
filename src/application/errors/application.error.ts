import { AppError } from '../../domain/errors/app.error.js'

export class QueueError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'QUEUE_ERROR ')
    this.cause = cause
  }
}
