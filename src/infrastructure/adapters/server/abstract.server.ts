import { ResultAsync } from 'neverthrow'

import { Config } from '../../../domain/entities/config.entity.js'
import { AppError } from '../../../domain/errors/app.error.js'
import { LoggerPort } from '../../../domain/ports/logger.port.js'
import { ServerPort } from '../../../domain/ports/server.port.js'
import { ManagedResource } from '../../managed.resource.js'

export abstract class AbstractServer implements ServerPort, ManagedResource {
  constructor(
    protected config: Config,
    protected logger: LoggerPort
  ) {}

  abstract start(): ResultAsync<void, AppError>
  abstract stop(): ResultAsync<void, AppError>

  initialize(): ResultAsync<void, AppError> {
    return this.start()
  }

  dispose(): ResultAsync<void, AppError> {
    return this.stop()
  }
}
