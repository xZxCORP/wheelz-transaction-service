import path from 'node:path';

import { TransactionService } from '../../application/services/transaction.service.js';
import { ConsumeCompletedVehicleTransactionsUseCase } from '../../application/use-cases/consume-completed-vehicle-transactions.use-case.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { GetTransactionStatsUseCase } from '../../application/use-cases/get-transaction-stats.use-case.js';
import { GetVehicleTransactionByIdUseCase } from '../../application/use-cases/get-vehicle-transaction-by-id.use-case.js';
import { GetVehicleTransactionByVinOrImmatUseCase } from '../../application/use-cases/get-vehicle-transaction-by-vin-or-immat.use-case.js';
import { GetVehicleTransactionsUseCase } from '../../application/use-cases/get-vehicle-transactions.use-case.js';
import { MapRawVehicleToVehicleUseCase } from '../../application/use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import { ReadRawVehicleFileUseCase } from '../../application/use-cases/read-raw-vehicle-file.use-case.js';
import { ResetVehicleTransactionsUseCase } from '../../application/use-cases/reset-vehicle-transactions.use-case.js';
import { ScrapVehicleDataUseCase } from '../../application/use-cases/scrap-vehicle-data.use-case.js';
import { ValidateCreateVehicleTransactionDataUseCase } from '../../application/use-cases/validate-create-vehicle-transaction-data.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { KerekCreateTransactionValidator } from '../../infrastructure/adapters/create-transaction-validator/kerek.create-transaction-validator.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { RealFileReader } from '../../infrastructure/adapters/file-reader/real.file-reader.js';
import { UuidIdGenerator } from '../../infrastructure/adapters/id-generator/uuid.id-generator.js';
import { WinstonLogger } from '../../infrastructure/adapters/logger/winston.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { GoblinVehicleScraper } from '../../infrastructure/adapters/vehicle-scraper/goblin.vehicle-scraper.js';
import { MongoTransactionRepository } from '../../infrastructure/repositories/mongo.transaction-repository.js';
import { AbstractApplication } from './base.application.js';

export class CliApplication extends AbstractApplication {
  private transactionService!: TransactionService;

  async initializeResources(): Promise<void> {
    const newQueue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.newQueueName,
      this.logger
    );
    const completedQueue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.completedQueueName,
      this.logger
    );

    const externalCreateTransactionDataValidator = new KerekCreateTransactionValidator(
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

    const transactionRepository = new MongoTransactionRepository(
      this.config.transactionRepository.url,
      this.config.transactionRepository.database,
      this.config.transactionRepository.collection,
      this.logger
    );
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
    const validateCreateVehicleTransactionDataUseCase =
      new ValidateCreateVehicleTransactionDataUseCase(externalCreateTransactionDataValidator);
    const getVehicleTransactionsUseCase = new GetVehicleTransactionsUseCase(transactionRepository);
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
    const getTransactionStatsUseCase = new GetTransactionStatsUseCase();
    this.transactionService = new TransactionService(
      createVehicleTransactionUseCase,
      readRawVehicleFileUseCase,
      mapRawVehicleToVehicleUseCase,
      validateCreateVehicleTransactionDataUseCase,
      resetVehicleTransactionsUseCase,
      getVehicleTransactionsUseCase,
      getVehicleTransactionByIdUseCase,
      getVehicleTransactionByVinOrImmatUseCase,
      comsumeCompletedVehicleTransactionsUseCase,
      scrapVehicleDataUseCase,
      getTransactionStatsUseCase,
      this.logger
    );

    this.managedResources = [newQueue, completedQueue, transactionRepository];
  }

  async importVehicles(filePath: string): Promise<void> {
    this.logger.info(`Importing transactions from ${filePath}`);
    await this.transactionService.processVehicleDataFromFile(filePath);
    this.logger.info('Transaction import completed');
  }

  static async create(): Promise<CliApplication> {
    const configLoader = new EnvironmentConfigLoader(path.resolve(process.cwd(), '.env.cli'));
    const config = await configLoader.load();

    return new CliApplication(
      config,
      new WinstonLogger({
        logLevel: config.logLevel,
        pretty: true,
      })
    );
  }
}
