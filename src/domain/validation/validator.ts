import { Result } from 'neverthrow'

import { ValidationError } from '../errors/domain.error.js'
import { Schema } from './schema.js'

export interface Validator {
  validate<T>(schema: Schema<T>, data: unknown): Result<T, ValidationError>
}
