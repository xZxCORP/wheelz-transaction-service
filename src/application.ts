import { okAsync, Result, ResultAsync } from 'neverthrow';

import type { LoggerPort } from './application/ports/logger.port.js';
import { TransactionService } from './application/services/transaction.service.js';
import { CreateVehicleTransactionUseCase } from './application/use-cases/create-vehicle-transaction.use-case.js';
import { PerformHealthCheckUseCase } from './application/use-cases/perform-health-check.use-case.js';
import { EnvironmentConfigLoader } from './infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from './infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from './infrastructure/adapters/date-provider/real.date-provider.port.js';
import { QueueHealthCheck } from './infrastructure/adapters/health-check/queue.health-check.js';
import { PinoLogger } from './infrastructure/adapters/logger/pino.logger.js';
import { RabbitMQQueue } from './infrastructure/adapters/queue/rabbit-mq.queue.js';
import { InvalidStubTransactionValidator } from './infrastructure/adapters/transaction-validator/invalid-stub.transaction-validator.js';
import { ValidStubTransactionValidator } from './infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js';
import type { ManagedResource } from './infrastructure/managed.resource.js';
import { type Config, configSchema } from './infrastructure/ports/config-loader.port.js';
import { FastifyApiServer } from './presentation/api/servers/fastify-api-server.js';
import { HealthcheckController } from './presentation/controllers/healthcheck.controller.js';
import { TransactionController } from './presentation/controllers/transaction.controller.ts.js';

export class Application {
  private managedResources: ManagedResource[] = [];

  constructor(
    config: Config,
    private readonly logger: LoggerPort
  ) {
    const queue = new RabbitMQQueue(
      config.transactionQueue.url,
      config.transactionQueue.queueName,
      logger
    );
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([new QueueHealthCheck(queue)]);

    const stubExternalTransactionDataValidator = new InvalidStubTransactionValidator();

    const dataSigner = new CryptoDataSigner(
      config.dataSigner.signAlgorithm,
      config.dataSigner.privateKey
    );
    const dateProvider = new RealDateProvider();
    const createVehicleTransactionUseCase = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider
    );
    const transactionService = new TransactionService(
      stubExternalTransactionDataValidator,
      createVehicleTransactionUseCase,
      queue
    );
    const healthcheckController = new HealthcheckController(performHealthCheckUseCase);
    const transactionController = new TransactionController(transactionService);
    const api = new FastifyApiServer(config, transactionController, healthcheckController);

    this.managedResources = [queue, api];
  }
  static async create(): Promise<Application> {
    const configLoader = new EnvironmentConfigLoader();
    const config = await configLoader.load();
    return new Application(config, new PinoLogger(config.logLevel));
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing application');
    for (const resource of this.managedResources) {
      await resource.initialize();
    }
  }
  async start(): Promise<void> {
    this.logger.info('Starting application');
    await this.initialize();
  }
  async stop(): Promise<void> {
    this.logger.info('Stopping application');
    for (const resource of this.managedResources) {
      await resource.dispose();
    }
  }
}
