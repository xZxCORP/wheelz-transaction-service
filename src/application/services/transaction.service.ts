import { type VehicleTransactionData } from '@zcorp/shared-typing-wheelz';
import type { PaginationParameters } from '@zcorp/wheelz-contracts';

import type { LoggerPort } from '../ports/logger.port.js';
import type { ConsumeCompletedVehicleTransactionsUseCase } from '../use-cases/consume-completed-vehicle-transactions.use-case.js';
import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
import type { GetVehicleTransactionsUseCase as GetVehicleTransactionsUseCase } from '../use-cases/get-vehicle-transactions.use-case.js';
import type { MapRawVehicleToVehicleUseCase } from '../use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import type { ReadRawVehicleFileUseCase } from '../use-cases/read-raw-vehicle-file.use-case.js';
import type { ResetVehicleTransactionsUseCase } from '../use-cases/reset-vehicle-transactions.use-case.js';
import type { ValidateVehicleTransactionDataUseCase } from '../use-cases/validate-vehicle-transaction-data.use-case.js';
export class TransactionService {
  constructor(
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly readRawVehicleFileUseCase: ReadRawVehicleFileUseCase,
    private readonly mapRawVehicleToVehicleUseCase: MapRawVehicleToVehicleUseCase,
    private readonly validateVehicleTransactionDataUseCase: ValidateVehicleTransactionDataUseCase,
    private readonly resetVehicleTransactionsUseCase: ResetVehicleTransactionsUseCase,
    private readonly getVehicleTransactionsUseCase: GetVehicleTransactionsUseCase,
    private readonly consumeCompletedVehicleTransactionsUseCase: ConsumeCompletedVehicleTransactionsUseCase,
    private logger: LoggerPort
  ) {}

  async processTransactionData(vehicleTransactionData: VehicleTransactionData) {
    const isValid =
      await this.validateVehicleTransactionDataUseCase.execute(vehicleTransactionData);
    if (!isValid) {
      throw new Error('Invalid vehicle transaction data');
    }
    const transaction = await this.createVehicleTransactionUseCase.execute(vehicleTransactionData);
    return transaction;
  }
  async consumeCompletedTransactions() {
    this.logger.info('Start consuming completed transactions');
    await this.consumeCompletedVehicleTransactionsUseCase.execute();
  }
  async getTransactions(paginationParameters: PaginationParameters) {
    return this.getVehicleTransactionsUseCase.execute(paginationParameters);
  }
  async processVehicleDataFromFile(filePath: string) {
    await this.resetVehicleTransactionsUseCase.execute();
    const rawVehicles = await this.readRawVehicleFileUseCase.execute(filePath);
    for (const rawVehicle of rawVehicles) {
      const vehicle = await this.mapRawVehicleToVehicleUseCase.execute(rawVehicle);
      if (!vehicle) {
        this.logger.error('Invalid vehicle data', rawVehicle);
        continue;
      }
      const transactionData: VehicleTransactionData = {
        action: 'create',
        data: vehicle,
      };
      const transaction = await this.processTransactionData(transactionData);
      this.logger.info(`Vehicle transaction created: ${transaction.id}`);
    }
  }
}
