import { Result } from 'neverthrow'

import { Config } from '../entities/config.entity.js'
import { ValidationError } from '../errors/domain.error.js'

export interface ConfigLoaderPort {
  load(): Result<Config, ValidationError>
}
