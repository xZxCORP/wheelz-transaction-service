import { TransactionService } from '../../application/services/transaction.service.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { MapRawVehicleToVehicleUseCase } from '../../application/use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import { PerformHealthCheckUseCase } from '../../application/use-cases/perform-health-check.use-case.js';
import { ReadRawVehicleFileUseCase } from '../../application/use-cases/read-raw-vehicle-file.use-case.js';
import { ResetVehicleTransactionsUseCase } from '../../application/use-cases/reset-vehicle-transactions.use-case.js';
import { ValidateVehicleTransactionDataUseCase } from '../../application/use-cases/validate-vehicle-transaction-data.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { RealFileReader } from '../../infrastructure/adapters/file-reader/real.file-reader.js';
import { QueueHealthCheck } from '../../infrastructure/adapters/health-check/queue.health-check.js';
import { UuidIdGenerator } from '../../infrastructure/adapters/id-generator/uuid.id-generator.js';
import { WinstonLogger } from '../../infrastructure/adapters/logger/winston.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { ValidStubTransactionValidator } from '../../infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js';
import { MongoTransactionRepository } from '../../infrastructure/repositories/mongo.transaction-repository.js';
import { FastifyApiServer } from '../api/servers/fastify-api-server.js';
import { HealthcheckController } from '../controllers/healthcheck.controller.js';
import { TransactionController } from '../controllers/transaction.controller.ts.js';
import { AbstractApplication } from './base.application.js';

export class MainApplication extends AbstractApplication {
  async initializeResources(): Promise<void> {
    const completedQueue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.completedQueueName,
      this.logger
    );
    const newQueue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.newQueueName,
      this.logger
    );
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([
      new QueueHealthCheck(completedQueue, 'completedQueue'),
      new QueueHealthCheck(newQueue, 'newQueue'),
    ]);

    const stubExternalTransactionDataValidator = new ValidStubTransactionValidator();

    const dataSigner = new CryptoDataSigner(
      this.config.dataSigner.signAlgorithm,
      this.config.dataSigner.privateKey
    );
    const dateProvider = new RealDateProvider();
    const fileReader = new RealFileReader();
    const idGenerator = new UuidIdGenerator();

    const transactionRepository = new MongoTransactionRepository();
    const createVehicleTransactionUseCase = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider,
      idGenerator,
      transactionRepository,
      newQueue
    );
    const readRawVehicleFileUseCase = new ReadRawVehicleFileUseCase(fileReader);
    const mapRawVehicleToVehicleUseCase = new MapRawVehicleToVehicleUseCase();
    const resetVehicleTransactionsUseCase = new ResetVehicleTransactionsUseCase(
      transactionRepository,
      newQueue
    );
    const validateVehicleTransactionDataUseCase = new ValidateVehicleTransactionDataUseCase(
      stubExternalTransactionDataValidator
    );
    const transactionService = new TransactionService(
      createVehicleTransactionUseCase,
      readRawVehicleFileUseCase,
      mapRawVehicleToVehicleUseCase,
      validateVehicleTransactionDataUseCase,
      resetVehicleTransactionsUseCase,
      this.logger
    );

    const healthcheckController = new HealthcheckController(performHealthCheckUseCase);
    const transactionController = new TransactionController(transactionService);
    const api = new FastifyApiServer(this.config, transactionController, healthcheckController);

    this.managedResources = [newQueue, completedQueue, api];
  }

  static async create(): Promise<MainApplication> {
    const configLoader = new EnvironmentConfigLoader();
    const config = await configLoader.load();
    return new MainApplication(
      config,
      new WinstonLogger({
        logLevel: config.logLevel,
        pretty: true,
      })
    );
  }
}
