import { okAsync, Result, ResultAsync } from 'neverthrow'

import { LoggerPort } from './application/ports/logger.port.js'
import { TransactionService } from './application/services/transaction.service.js'
import { CreateVehicleTransactionUseCase } from './application/use-cases/create-vehicle-transaction.use-case.js'
import { EnqueueTransactionUseCase } from './application/use-cases/enqueue-transaction.use-case.js'
import { PerformHealthCheckUseCase } from './application/use-cases/perform-health-check.use-case.js'
import { ValidateTransactionDataUseCase } from './application/use-cases/validate-transaction-data.use-case.js'
import { Config } from './domain/entities/config.entity.js'
import { AppError } from './domain/errors/app.error.js'
import { TransactionValidationService } from './domain/services/transaction-validation.service.js'
import { EnvironmentConfigLoader } from './infrastructure/adapters/config/environment.config-loader.js'
import { StubDataSigner } from './infrastructure/adapters/data-signer/stub.data-signer.js'
import { RealDateProvider } from './infrastructure/adapters/date-provider/real.date-provider.port.js'
import { QueueHealthCheck } from './infrastructure/adapters/health-check/queue.health-check.js'
import { ServerHealthCheck } from './infrastructure/adapters/health-check/server.health-check.js'
import { PinoLogger } from './infrastructure/adapters/logger/pino.logger.js'
import { RabbitMQQueue } from './infrastructure/adapters/queue/rabbit-mq.queue.js'
import { HonoServer } from './infrastructure/adapters/server/hono.server.js'
import { ValidStubTransactionValidator } from './infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js'
import { ZodValidator } from './infrastructure/adapters/validation/zod/zod.validator.js'
import { configSchema } from './infrastructure/adapters/validation/zod/zod-config.schema.js'
import {
  vehicleTransactionDataSchema,
  vehicleTransactionSchema,
} from './infrastructure/adapters/validation/zod/zod-transaction.schema.js'
import { ManagedResource } from './infrastructure/managed.resource.js'
import { HealthcheckController } from './presentation/controllers/healthcheck.controller.js'
import { TransactionController } from './presentation/controllers/transaction.controller.ts.js'

export class Application {
  private managedResources: ManagedResource[] = []

  constructor(
    config: Config,
    private readonly logger: LoggerPort
  ) {
    const server = new HonoServer(config, logger)
    const queue = new RabbitMQQueue(config, logger)
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([
      new ServerHealthCheck(server),
      new QueueHealthCheck(queue),
    ])
    const zodValidator = new ZodValidator()
    const transactionValidationService = new TransactionValidationService(
      zodValidator,
      vehicleTransactionSchema,
      vehicleTransactionDataSchema
    )
    const stubExternalTransactionDataValidator = new ValidStubTransactionValidator()
    const validateTransactionDataUseCase = new ValidateTransactionDataUseCase(
      transactionValidationService,
      stubExternalTransactionDataValidator
    )
    const dataSigner = new StubDataSigner()
    const dateProvider = new RealDateProvider()
    const createVehicleTransactionUseCase = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider
    )
    const enqueueTransactionUseCase = new EnqueueTransactionUseCase(queue)
    const transactionService = new TransactionService(
      validateTransactionDataUseCase,
      createVehicleTransactionUseCase,
      enqueueTransactionUseCase
    )
    const healthcheckController = new HealthcheckController(performHealthCheckUseCase)
    const transactionController = new TransactionController(transactionService)
    for (const route of healthcheckController.getRoutes()) server.registerRoute(route)
    for (const route of transactionController.getRoutes()) server.registerRoute(route)

    this.managedResources = [queue, server]
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
