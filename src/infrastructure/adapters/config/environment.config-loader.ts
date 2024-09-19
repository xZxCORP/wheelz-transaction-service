import { configDotenv } from 'dotenv'
import { Result } from 'neverthrow'

import { ConfigLoaderPort } from '../../../application/ports/config-loader.port.js'
import { Config } from '../../../domain/entities/config.entity.js'
import { ValidationError } from '../../../domain/errors/domain.error.js'
import { ConfigSchema } from '../../../domain/schemas/config.schema.js'
import { Validator } from '../../../domain/validation/validator.js'

export class EnvironmentConfigLoader implements ConfigLoaderPort {
  constructor(
    private readonly configSchema: ConfigSchema,
    private validator: Validator
  ) {
    configDotenv()
  }
  load(): Result<Config, ValidationError> {
    const config = {
      logLevel: process.env.LOG_LEVEL,
      transactionQueue: {
        url: process.env.NOTIFICATION_QUEUE_URL,
        queueName: process.env.NOTIFICATION_QUEUE_NAME,
      },
      api: {
        host: process.env.API_HOST,
        port: process.env.API_PORT,
      },
      dataSigner: {
        signAlgorithm: process.env.DATA_SIGNER_ALGORITHM,
        privateKey: process.env.DATA_SIGNER_PRIVATE,
      },
    }
    return this.validator.validate<Config>(this.configSchema, config)
  }
}
