import { Result } from 'neverthrow'

import { Config } from '../../domain/entities/config.entity.js'
import { ValidationError } from '../../domain/errors/domain.error.js'

export interface ConfigLoaderPort {
  load(): Result<Config, ValidationError>
}
