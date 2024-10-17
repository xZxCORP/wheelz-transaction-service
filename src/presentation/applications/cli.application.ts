import path from 'node:path';

import { TransactionService } from '../../application/services/transaction.service.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { MapRawVehicleToVehicleUseCase } from '../../application/use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import { ReadRawVehicleFileUseCase } from '../../application/use-cases/read-raw-vehicle-file.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { RealFileReader } from '../../infrastructure/adapters/file-reader/real.file-reader.js';
import { UuidIdGenerator } from '../../infrastructure/adapters/id-generator/uuid.id-generator.js';
import { WinstonLogger } from '../../infrastructure/adapters/logger/winston.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { ValidStubTransactionValidator } from '../../infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js';
import { AbstractApplication } from './base.application.js';

export class CliApplication extends AbstractApplication {
  private transactionService!: TransactionService;

  async initializeResources(): Promise<void> {
    const queue = new RabbitMQQueue(
      this.config.transactionQueue.url,
      this.config.transactionQueue.queueName,
      this.logger
    );

    const stubExternalTransactionDataValidator = new ValidStubTransactionValidator();
    const dataSigner = new CryptoDataSigner(
      this.config.dataSigner.signAlgorithm,
      this.config.dataSigner.privateKey
    );
    const dateProvider = new RealDateProvider();
    const fileReader = new RealFileReader();
    const idGenerator = new UuidIdGenerator();

    const createVehicleTransactionUseCase = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider,
      idGenerator
    );
    const readRawVehicleFileUseCase = new ReadRawVehicleFileUseCase(fileReader);
    const mapRawVehicleToVehicleUseCase = new MapRawVehicleToVehicleUseCase();
    this.transactionService = new TransactionService(
      stubExternalTransactionDataValidator,
      createVehicleTransactionUseCase,
      readRawVehicleFileUseCase,
      mapRawVehicleToVehicleUseCase,
      queue,
      this.logger
    );

    this.managedResources = [queue];
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
