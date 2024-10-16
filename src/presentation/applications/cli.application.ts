import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { Vehicle } from '@zcorp/shared-typing-wheelz';

import { TransactionService } from '../../application/services/transaction.service.js';
import { CreateVehicleTransactionUseCase } from '../../application/use-cases/create-vehicle-transaction.use-case.js';
import { EnvironmentConfigLoader } from '../../infrastructure/adapters/config/environment.config-loader.js';
import { CryptoDataSigner } from '../../infrastructure/adapters/data-signer/crypto.data-signer.js';
import { RealDateProvider } from '../../infrastructure/adapters/date-provider/real.date-provider.port.js';
import { PinoLogger } from '../../infrastructure/adapters/logger/pino.logger.js';
import { RabbitMQQueue } from '../../infrastructure/adapters/queue/rabbit-mq.queue.js';
import { ValidStubTransactionValidator } from '../../infrastructure/adapters/transaction-validator/valid-stub.transaction-validator.js';
import { AbstractApplication } from './base.application.js';

export class CliApplication extends AbstractApplication {
  private transactionService: TransactionService;

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
    const createVehicleTransactionUseCase = new CreateVehicleTransactionUseCase(
      dataSigner,
      dateProvider
    );

    this.transactionService = new TransactionService(
      stubExternalTransactionDataValidator,
      createVehicleTransactionUseCase,
      queue
    );

    this.managedResources = [queue];
  }

  async importVehicles(filePath: string): Promise<void> {
    this.logger.info(`Importing transactions from ${filePath}`);
    const fileContent = await readFile(filePath, 'utf8');
    const vehicles: Vehicle[] = JSON.parse(fileContent);

    for (const vehicle of transactions) {
      try {
        await this.transactionService.createTransaction(transaction);
        this.logger.info(`Imported transaction ${transaction.id}`);
      } catch (error) {
        this.logger.error(`Failed to import transaction ${transaction.id}:`, error);
      }
    }

    this.logger.info('Transaction import completed');
  }

  static async create(): Promise<CliApplication> {
    const configLoader = new EnvironmentConfigLoader(path.resolve(process.cwd(), '.env.cli'));
    const config = await configLoader.load();

    return new CliApplication(config, new PinoLogger(config.logLevel));
  }
}
