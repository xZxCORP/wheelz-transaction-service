import { type ScrapVehicleData, type VehicleTransactionData } from '@zcorp/shared-typing-wheelz';
import type { PaginationParameters } from '@zcorp/wheelz-contracts';

import type { LoggerPort } from '../ports/logger.port.js';
import type { ConsumeCompletedVehicleTransactionsUseCase } from '../use-cases/consume-completed-vehicle-transactions.use-case.js';
import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
import type { GetTransactionStatsUseCase } from '../use-cases/get-transaction-stats.use-case.js';
import type { GetVehicleTransactionByIdUseCase } from '../use-cases/get-vehicle-transaction-by-id.use-case.js';
import type { GetVehicleTransactionByVinOrImmatUseCase } from '../use-cases/get-vehicle-transaction-by-vin-or-immat.use-case.js';
import type { GetVehicleTransactionsUseCase as GetVehicleTransactionsUseCase } from '../use-cases/get-vehicle-transactions.use-case.js';
import type { MapRawVehicleToVehicleUseCase } from '../use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import type { ReadRawVehicleFileUseCase } from '../use-cases/read-raw-vehicle-file.use-case.js';
import type { ResetVehicleTransactionsUseCase } from '../use-cases/reset-vehicle-transactions.use-case.js';
import type { ScrapVehicleDataUseCase } from '../use-cases/scrap-vehicle-data.use-case.js';
import type { ValidateCreateVehicleTransactionDataUseCase } from '../use-cases/validate-create-vehicle-transaction-data.use-case.js';
export class TransactionService {
  constructor(
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly readRawVehicleFileUseCase: ReadRawVehicleFileUseCase,
    private readonly mapRawVehicleToVehicleUseCase: MapRawVehicleToVehicleUseCase,
    private readonly validateCreateVehicleTransactionDataUseCase: ValidateCreateVehicleTransactionDataUseCase,
    private readonly resetVehicleTransactionsUseCase: ResetVehicleTransactionsUseCase,
    private readonly getVehicleTransactionsUseCase: GetVehicleTransactionsUseCase,
    private readonly getVehicleTransactionByIdUseCase: GetVehicleTransactionByIdUseCase,
    private readonly getVehicleTransactionByVinOrImmatUseCase: GetVehicleTransactionByVinOrImmatUseCase,
    private readonly consumeCompletedVehicleTransactionsUseCase: ConsumeCompletedVehicleTransactionsUseCase,
    private readonly scrapVehicleDataUseCase: ScrapVehicleDataUseCase,
    private readonly getTransactionStatsUseCase: GetTransactionStatsUseCase,
    private logger: LoggerPort
  ) {}

  async processTransactionData(vehicleTransactionData: VehicleTransactionData) {
    if (vehicleTransactionData.action === 'create') {
      const validationResult =
        await this.validateCreateVehicleTransactionDataUseCase.execute(vehicleTransactionData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.message);
      }
      const existingTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
        'create',
        vehicleTransactionData.data.vin,
        undefined
      );
      if (existingTransaction) {
        throw new Error('Une transaction avec ce VIN existe déjà');
      }
    }
    if (vehicleTransactionData.action === 'update') {
      const existingTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
        'update',
        vehicleTransactionData.data.vin,
        undefined
      );
      if (!existingTransaction) {
        throw new Error("Aucune transaction avec ce VIN n'existe");
      }
    }
    if (vehicleTransactionData.action === 'delete') {
      const existingCreateTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
        'create',
        vehicleTransactionData.data.vin,
        undefined
      );
      if (!existingCreateTransaction) {
        throw new Error('Impossible de supprimer une transaction avec un vin inexistant');
      }
      const existingDeleteTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
        'delete',
        vehicleTransactionData.data.vin,
        undefined
      );
      if (existingDeleteTransaction) {
        throw new Error('Une transaction de suppression avec ce VIN existe déjà');
      }
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
  async getTransactionById(id: string) {
    return this.getVehicleTransactionByIdUseCase.execute(id);
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
  async scrapAndProcessVehicleData(data: ScrapVehicleData): Promise<VehicleTransactionData | null> {
    const existingTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
      'create',
      data.vin,
      data.immat
    );
    if (existingTransaction) {
      return existingTransaction;
    }
    const scraperResult = await this.scrapVehicleDataUseCase.execute(data);
    if (!scraperResult.data) {
      return null;
    }
    const mappedVehicle = await this.mapRawVehicleToVehicleUseCase.execute(scraperResult.data);
    if (!mappedVehicle) {
      return null;
    }

    return this.processTransactionData({
      action: 'create',
      data: mappedVehicle,
    });
  }
  async getTransactionStats() {
    return this.getTransactionStatsUseCase.execute();
  }
}
