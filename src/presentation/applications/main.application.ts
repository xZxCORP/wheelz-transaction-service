import { TransactionService } from '../../application/services/transaction.service.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { PerformHealthCheckUseCase } from '../../application/use-cases/perform-health-check.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { QueueHealthCheck } from '../../infrastructure/adapters/health-check/queue.health-check.js';
import { PinoLogger } from '../../infrastructure/adapters/logger/pino.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { ValidStubTransactionValidator } from '../../infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js';
import { FastifyApiServer } from '../api/servers/fastify-api-server.js';
import { HealthcheckController } from '../controllers/healthcheck.controller.js';
import { TransactionController } from '../controllers/transaction.controller.ts.js';
import { AbstractApplication } from './base.application.js';

export class MainApplication extends AbstractApplication {
  async initializeResources(): Promise<void> {
    const queue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.queueName,
      this.logger
    );
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([new QueueHealthCheck(queue)]);

    const stubExternalTransactionDataValidator = new ValidStubTransactionValidator();

    const dataSigner = new CryptoDataSigner(
      this.config.dataSigner.signAlgorithm,
      this.config.dataSigner.privateKey
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
    const api = new FastifyApiServer(this.config, transactionController, healthcheckController);

    this.managedResources = [queue, api];
  }

  static async create(): Promise<MainApplication> {
    const configLoader = new EnvironmentConfigLoader();
    const config = await configLoader.load();
    return new MainApplication(config, new PinoLogger(config.logLevel));
  }
}
