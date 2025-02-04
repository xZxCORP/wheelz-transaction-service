import {
  type ScrapVehicleData,
  type TransactionStats,
  type VehicleTransactionData,
} from '@zcorp/shared-typing-wheelz';
import type { PaginationParameters } from '@zcorp/wheelz-contracts';

import { InvalidTransactionError } from '../../domain/errors/invalid-transaction.error.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import type { LoggerPort } from '../ports/logger.port.js';
import type { AnalyseVehicleUseCase } from '../use-cases/analyse-vehicle.use-case.js';
import type { CalculateVehicleWithTransactionsUseCase } from '../use-cases/calculate-vehicle-with-transactions.use-case.js';
import type { CompareVehiclesUseCase } from '../use-cases/compare-vehicles.use-case.js';
import type { ConsumeCompletedVehicleTransactionsUseCase } from '../use-cases/consume-completed-vehicle-transactions.use-case.js';
import type { CountTransactionsOfActionWithVinUseCase } from '../use-cases/count-transactions-of-action-with-vin.use-case.js';
import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
import type { GetTransactionAnomaliesUseCase } from '../use-cases/get-transaction-anomalies.use-case.js';
import type { GetTransactionEvolutionUseCase } from '../use-cases/get-transaction-evolution.use-case.js';
import type { GetTransactionRepartitionUseCase } from '../use-cases/get-transaction-repartition.use-case.js';
import type { GetUserByEmailUseCase } from '../use-cases/get-user-by-email.use-case.js';
import type { GetVehicleOfTheChainUseCase } from '../use-cases/get-vehicle-of-the-chain.use-case.js';
import type { GetVehicleTransactionByIdUseCase } from '../use-cases/get-vehicle-transaction-by-id.use-case.js';
import type { GetVehicleTransactionByVinOrImmatUseCase } from '../use-cases/get-vehicle-transaction-by-vin-or-immat.use-case.js';
import type { GetVehicleTransactionsUseCase as GetVehicleTransactionsUseCase } from '../use-cases/get-vehicle-transactions.use-case.js';
import type { GetVehicleTransactionsWithoutPaginationUseCase } from '../use-cases/get-vehicle-transactions-without-pagination.use-case.js';
import type { GetVinMetadatasUseCase } from '../use-cases/get-vin-metadatas.use-case.js';
import type { MapRawVehicleToVehicleUseCase } from '../use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import type { ReadRawVehicleFileUseCase } from '../use-cases/read-raw-vehicle-file.use-case.js';
import type { ResetVehicleTransactionsUseCase } from '../use-cases/reset-vehicle-transactions.use-case.js';
import type { ScrapVehicleDataUseCase } from '../use-cases/scrap-vehicle-data.use-case.js';
export class TransactionService {
  constructor(
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly readRawVehicleFileUseCase: ReadRawVehicleFileUseCase,
    private readonly mapRawVehicleToVehicleUseCase: MapRawVehicleToVehicleUseCase,
    private readonly analyseVehicleUseCase: AnalyseVehicleUseCase,
    private readonly compareVehiclesUseCase: CompareVehiclesUseCase,
    private readonly resetVehicleTransactionsUseCase: ResetVehicleTransactionsUseCase,
    private readonly getVehicleTransactionsUseCase: GetVehicleTransactionsUseCase,
    private readonly getVehicleTransactionsWithoutPaginationUseCase: GetVehicleTransactionsWithoutPaginationUseCase,
    private readonly getVehicleTransactionByIdUseCase: GetVehicleTransactionByIdUseCase,
    private readonly getVehicleTransactionByVinOrImmatUseCase: GetVehicleTransactionByVinOrImmatUseCase,
    private readonly consumeCompletedVehicleTransactionsUseCase: ConsumeCompletedVehicleTransactionsUseCase,
    private readonly scrapVehicleDataUseCase: ScrapVehicleDataUseCase,
    private readonly getTransactionEvolutionUseCase: GetTransactionEvolutionUseCase,
    private readonly getTransactionRepartitionUseCase: GetTransactionRepartitionUseCase,
    private readonly getTransactionAnomaliesUseCase: GetTransactionAnomaliesUseCase,
    private readonly getVehicleOfTheChainUseCase: GetVehicleOfTheChainUseCase,
    private readonly calculateVehicleWithTransactionsUseCase: CalculateVehicleWithTransactionsUseCase,
    private readonly countTransactionsOfActionWithVinUseCase: CountTransactionsOfActionWithVinUseCase,
    private readonly getVinMetadatasUseCase: GetVinMetadatasUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private logger: LoggerPort
  ) {}

  async processTransactionData(
    vehicleTransactionData: VehicleTransactionData,
    userId: string,
    force: boolean = false
  ) {
    const existingDeleteTransactionCount =
      await this.countTransactionsOfActionWithVinUseCase.execute(
        vehicleTransactionData.data.vin,
        'delete'
      );
    const existingCreateTransactionCount =
      await this.countTransactionsOfActionWithVinUseCase.execute(
        vehicleTransactionData.data.vin,
        'create'
      );
    if (vehicleTransactionData.action === 'create') {
      if (!force) {
        const validationResult = await this.analyseVehicleUseCase.execute(
          vehicleTransactionData.data
        );
        if (!validationResult.isValid) {
          throw new InvalidTransactionError(
            validationResult.message ?? 'Impossible de valider la transaction'
          );
        }
      }

      if (existingCreateTransactionCount > existingDeleteTransactionCount) {
        throw new Error('Une transaction avec ce VIN existe déjà');
      }
    }
    if (vehicleTransactionData.action === 'update') {
      if (!force) {
        const previousVehicle = await this.getVehicleOfTheChainUseCase.execute(
          vehicleTransactionData.data.vin
        );
        if (!previousVehicle) {
          throw new Error('Impossible de trouver le véhicule dans la chaîne');
        }
        const validationResult = await this.compareVehiclesUseCase.execute(
          vehicleTransactionData.data.changes,
          previousVehicle
        );
        if (!validationResult.isValid) {
          throw new InvalidTransactionError(
            validationResult.message ?? 'Impossible de valider la transaction'
          );
        }
      }
      const existingTransaction = await this.getVehicleTransactionByVinOrImmatUseCase.execute(
        'create',
        vehicleTransactionData.data.vin,
        undefined
      );
      if (
        !existingTransaction ||
        existingCreateTransactionCount === existingDeleteTransactionCount
      ) {
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

      if (existingDeleteTransactionCount >= existingCreateTransactionCount) {
        throw new Error('Une transaction de suppression avec ce VIN existe déjà');
      }
    }
    const transaction = await this.createVehicleTransactionUseCase.execute(
      vehicleTransactionData,
      userId,
      force
    );
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
  async processVehicleDataFromFile(filePath: string, userEmail: string) {
    const user = await this.getUserByEmailUseCase.execute(userEmail);
    if (!user) {
      throw new Error("Impossible de trouver l'utilisateur avec cet email");
    }
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
      const transaction = await this.processTransactionData(transactionData, user.id.toString());
      this.logger.info(`Vehicle transaction created: ${transaction.id}`);
    }
  }
  async scrapAndProcessVehicleData(
    data: ScrapVehicleData,
    userId: string
  ): Promise<VehicleTransactionData | null> {
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

    return this.processTransactionData(
      {
        action: 'create',
        data: mappedVehicle,
      },
      userId
    );
  }
  async getTransactionStats(): Promise<TransactionStats> {
    const transactions = await this.getVehicleTransactionsWithoutPaginationUseCase.execute();
    const evolution = this.getTransactionEvolutionUseCase.execute(transactions);
    const repartition = this.getTransactionRepartitionUseCase.execute(transactions);
    const anomalies = await this.getTransactionAnomaliesUseCase.execute(transactions);
    return {
      evolution,
      repartition,
      anomalies,
    };
  }
  async revertTransaction(transactionId: string, userId: string) {
    const transaction = await this.getVehicleTransactionByIdUseCase.execute(transactionId);
    if (!transaction) {
      throw new TransactionNotFoundError('Impossible de trouver la transaction');
    }
    if (transaction.action !== 'delete') {
      throw new Error('Le revert ne peut être effectué que sur une transaction de suppression');
    }
    const transactions = await this.getVehicleTransactionsWithoutPaginationUseCase.execute();
    const previousTransactions = transactions.slice(0, -1);
    const calculatedVehicle = this.calculateVehicleWithTransactionsUseCase.execute(
      transaction.data.vin,
      previousTransactions
    );
    if (!calculatedVehicle) {
      throw new Error('Impossible de trouver le véhicule dans les transactions précédentes');
    }
    const newTransaction = await this.createVehicleTransactionUseCase.execute(
      {
        action: 'create',
        data: calculatedVehicle,
      },
      userId
    );
    return newTransaction;
  }
  async getVinMetadatas(vin: string) {
    return this.getVinMetadatasUseCase.execute(vin);
  }
}
