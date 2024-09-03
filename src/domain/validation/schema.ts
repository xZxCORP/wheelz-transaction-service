import { Result } from 'neverthrow'

import { ValidationError } from '../errors/domain.error.js'

export interface Schema<T> {
  parse(data: unknown): Result<T, ValidationError>
}
