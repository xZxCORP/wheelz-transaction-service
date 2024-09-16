import { okAsync, Result, ResultAsync } from 'neverthrow'

import { LoggerPort } from './application/ports/logger.port.js'
import { PerformHealthCheckUseCase } from './application/use-cases/perform-health-check.use-case.js'
import { Config } from './domain/entities/config.entity.js'
import { AppError } from './domain/errors/app.error.js'
import { EnvironmentConfigLoader } from './infrastructure/adapters/config/environment.config-loader.js'
import { QueueHealthCheck } from './infrastructure/adapters/health-check/queue.health-check.js'
import { ServerHealthCheck } from './infrastructure/adapters/health-check/server.health-check.js'
import { PinoLogger } from './infrastructure/adapters/logger/pino.logger.js'
import { RabbitMQQueue } from './infrastructure/adapters/queue/rabbit-mq.queue.js'
import { HonoServer } from './infrastructure/adapters/server/hono.server.js'
import { ZodValidator } from './infrastructure/adapters/validation/zod/zod.validator.js'
import { configSchema } from './infrastructure/adapters/validation/zod/zod-config.schema.js'
import { ManagedResource } from './infrastructure/managed.resource.js'
import { HealthcheckController } from './presentation/controllers/healthcheck.controller.js'

export class Application {
  private managedResources: ManagedResource[] = []

  constructor(
    config: Config,
    private readonly logger: LoggerPort
  ) {
    const server = new HonoServer(config, logger)
    const rabbitMqQueue = new RabbitMQQueue(config, logger)
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([
      new ServerHealthCheck(server),
      new QueueHealthCheck(rabbitMqQueue),
    ])
    const healthcheckController = new HealthcheckController(performHealthCheckUseCase)
    for (const route of healthcheckController.getRoutes()) server.registerRoute(route)

    this.managedResources = [rabbitMqQueue, server]
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
    return this.managedResources
      .reduce(
        (accumulator, current) => accumulator.andThen(() => current.initialize()),
        okAsync<void, AppError>(undefined)
      )
      .andTee(() => this.logger.info('Application initialized'))
  }
  start(): ResultAsync<void, AppError> {
    this.logger.info('Starting application')
    return this.initialize().map(() => {
      this.logger.info('Application started')
    })
  }
  stop(): ResultAsync<void[], AppError[]> {
    this.logger.info('Stopping application')
    return ResultAsync.combineWithAllErrors(
      this.managedResources.map((resource) => resource.dispose())
    )
  }
}
