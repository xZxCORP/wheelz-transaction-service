import { AppError } from '../../domain/errors/app.error.js'

export class QueueError extends AppError {
  constructor(message: string, cause: unknown) {
    super(message, 'QUEUE_ERROR ')
    this.cause = cause
  }
}
export class HealthError extends AppError {
  constructor(message: string) {
    super(message, 'HEALTH_ERROR')
  }
}
