import { ResultAsync } from 'neverthrow'

import { AppError } from '../domain/errors/app.error.js'

export interface ManagedResource {
  initialize(): ResultAsync<void, AppError>
  dispose(): ResultAsync<void, AppError>
}
