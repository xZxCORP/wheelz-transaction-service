import { TransactionService } from '../../application/services/transaction.service.js';
import { AnalyseVehicleUseCase } from '../../application/use-cases/analyse-vehicle.use-case.js';
import { ConsumeCompletedVehicleTransactionsUseCase } from '../../application/use-cases/consume-completed-vehicle-transactions.use-case.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { GetTransactionAnomaliesUseCase } from '../../application/use-cases/get-transaction-anomalies.use-case.js';
import { GetTransactionEvolutionUseCase } from '../../application/use-cases/get-transaction-evolution.use-case.js';
import { GetTransactionRepartitionUseCase } from '../../application/use-cases/get-transaction-repartition.use-case.js';
import { GetVehicleTransactionByIdUseCase } from '../../application/use-cases/get-vehicle-transaction-by-id.use-case.js';
import { GetVehicleTransactionByVinOrImmatUseCase } from '../../application/use-cases/get-vehicle-transaction-by-vin-or-immat.use-case.js';
import { GetVehicleTransactionsUseCase } from '../../application/use-cases/get-vehicle-transactions.use-case.js';
import { GetVehicleTransactionsWithoutPaginationUseCase } from '../../application/use-cases/get-vehicle-transactions-without-pagination.use-case.js';
import { MapRawVehicleToVehicleUseCase } from '../../application/use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import { PerformHealthCheckUseCase } from '../../application/use-cases/perform-health-check.use-case.js';
import { ReadRawVehicleFileUseCase } from '../../application/use-cases/read-raw-vehicle-file.use-case.js';
import { ResetVehicleTransactionsUseCase } from '../../application/use-cases/reset-vehicle-transactions.use-case.js';
import { ScrapVehicleDataUseCase } from '../../application/use-cases/scrap-vehicle-data.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { KerekExternalVehicleValidator } from '../../infrastructure/adapters/external-vehicle-validator/kerek.external-vehicle-validator.js';
import { RealFileReader } from '../../infrastructure/adapters/file-reader/real.file-reader.js';
import { QueueHealthCheck } from '../../infrastructure/adapters/health-check/queue.health-check.js';
import { TransactionRepositoryHealthCheck } from '../../infrastructure/adapters/health-check/transaction-repository.health-check.js';
import { UuidIdGenerator } from '../../infrastructure/adapters/id-generator/uuid.id-generator.js';
import { WinstonLogger } from '../../infrastructure/adapters/logger/winston.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { GoblinVehicleScraper } from '../../infrastructure/adapters/vehicle-scraper/goblin.vehicle-scraper.js';
import { MongoTransactionRepository } from '../../infrastructure/repositories/mongo.transaction-repository.js';
import { FastifyApiServer } from '../api/servers/fastify-api-server.js';
import { HealthcheckController } from '../controllers/healthcheck.controller.js';
import { TransactionController } from '../controllers/transaction.controller.js';
import { AbstractApplication } from './base.application.js';

export class MainApplication extends AbstractApplication {
  private transactionService!: TransactionService;
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
    const transactionRepository = new MongoTransactionRepository(
      this.config.transactionRepository.url,
      this.config.transactionRepository.database,
      this.config.transactionRepository.collection,
      this.logger
    );
    const performHealthCheckUseCase = new PerformHealthCheckUseCase([
      new QueueHealthCheck(completedQueue, 'completedQueue'),
      new QueueHealthCheck(newQueue, 'newQueue'),
      new TransactionRepositoryHealthCheck(transactionRepository),
    ]);

    const externalVehicleValidator = new KerekExternalVehicleValidator(
      this.config.transactionValidator.url
    );

    const dataSigner = new CryptoDataSigner(
      this.config.dataSigner.signAlgorithm,
      this.config.dataSigner.privateKey
    );
    const dateProvider = new RealDateProvider();
    const fileReader = new RealFileReader();
    const idGenerator = new UuidIdGenerator();
    const vehicleScraperPort = new GoblinVehicleScraper(this.config.vehicleScraper.url);

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
    const analyseVehicleUseCase = new AnalyseVehicleUseCase(externalVehicleValidator);
    const getVehicleTransactionsUseCase = new GetVehicleTransactionsUseCase(transactionRepository);
    const getVehicleTransactionsWithoutPaginationUseCase =
      new GetVehicleTransactionsWithoutPaginationUseCase(transactionRepository);
    const getVehicleTransactionByIdUseCase = new GetVehicleTransactionByIdUseCase(
      transactionRepository
    );
    const getVehicleTransactionByVinOrImmatUseCase = new GetVehicleTransactionByVinOrImmatUseCase(
      transactionRepository
    );
    const comsumeCompletedVehicleTransactionsUseCase =
      new ConsumeCompletedVehicleTransactionsUseCase(
        transactionRepository,
        completedQueue,
        this.logger
      );
    const scrapVehicleDataUseCase = new ScrapVehicleDataUseCase(vehicleScraperPort);
    const getTransactionEvolutionUseCase = new GetTransactionEvolutionUseCase();
    const getTransactionRepartitionUseCase = new GetTransactionRepartitionUseCase();
    const getTransactionAnomaliesUseCase = new GetTransactionAnomaliesUseCase(
      externalVehicleValidator
    );
    this.transactionService = new TransactionService(
      createVehicleTransactionUseCase,
      readRawVehicleFileUseCase,
      mapRawVehicleToVehicleUseCase,
      analyseVehicleUseCase,
      resetVehicleTransactionsUseCase,
      getVehicleTransactionsUseCase,
      getVehicleTransactionsWithoutPaginationUseCase,
      getVehicleTransactionByIdUseCase,
      getVehicleTransactionByVinOrImmatUseCase,
      comsumeCompletedVehicleTransactionsUseCase,
      scrapVehicleDataUseCase,
      getTransactionEvolutionUseCase,
      getTransactionRepartitionUseCase,
      getTransactionAnomaliesUseCase,
      this.logger
    );

    const healthcheckController = new HealthcheckController(performHealthCheckUseCase);
    const transactionController = new TransactionController(this.transactionService);
    const api = new FastifyApiServer(this.config, transactionController, healthcheckController);

    this.managedResources = [newQueue, completedQueue, transactionRepository, api];
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
  override async initialize(): Promise<void> {
    await super.initialize();
    await this.transactionService.consumeCompletedTransactions();
  }
}
