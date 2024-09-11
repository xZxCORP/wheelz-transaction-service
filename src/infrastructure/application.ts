import { okAsync, Result, ResultAsync } from 'neverthrow'

import { LoggerPort } from '../application/ports/logger.port.js'
import { PerformHealthCheckUseCase } from '../application/use-cases/perform-health-check.use-case.js'
import { Config } from '../domain/entities/config.entity.js'
import { AppError } from '../domain/errors/app.error.js'
import { EnvironmentConfigLoader } from './adapters/config/environment.config-loader.js'
import { HonoServerHealthCheck } from './adapters/health-check/hono-server.health-check.js'
import { PinoLogger } from './adapters/logger/pino.logger.js'
import { HealthcheckController } from './adapters/server/hono/controllers/healthcheck.controller.js'
import { HonoServer } from './adapters/server/hono/hono.server.js'
import { ZodValidator } from './adapters/validation/zod/zod.validator.js'
import { configSchema } from './adapters/validation/zod/zod-config.schema.js'
import { ManagedResource } from './managed.resource.js'

export class Application {
  private managedResources: ManagedResource[] = []

  constructor(
    config: Config,
    private readonly logger: LoggerPort
  ) {
    const server = new HonoServer(config, logger)
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([
      new HonoServerHealthCheck(server),
    ])
    server.registerController(new HealthcheckController(performHealthCheckUseCase))

    this.managedResources = [server]
  }
  static create(): Result<Application, AppError> {
    const configLoader = new EnvironmentConfigLoader(configSchema, new ZodValidator())
    return configLoader.load().map((config) => {
      const logger = new PinoLogger(config.logLevel)
      return new Application(config, logger)
    })
  }

  initialize(): ResultAsync<void, AppError> {
    this.logger.info('Initializing application')
    return ResultAsync.combine(this.managedResources.map((resource) => resource.initialize())).map(
      () => undefined
    )
  }
  start(): ResultAsync<void, AppError> {
    this.logger.info('Starting application')
    return this.initialize().map(() => {
      this.logger.info('Application started')
    })
  }
  stop(): ResultAsync<void, AppError> {
    this.logger.info('Stopping application')
    for (const resource of this.managedResources.reverse()) {
      resource.dispose()
    }
    return okAsync(undefined)
  }
}
