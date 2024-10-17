import { type VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import { ApplicationError } from '../error.js';
import type { ExternalTransactionDataValidatorPort } from '../ports/external-transaction-data-validator.port.js';
import type { LoggerPort } from '../ports/logger.port.js';
import type { QueuePort } from '../ports/queue.port.js';
import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
import type { MapRawVehicleToVehicleUseCase } from '../use-cases/map-raw-vehicle-to-vehicle.use-case.js';
import type { ReadRawVehicleFileUseCase } from '../use-cases/read-raw-vehicle-file.use-case.js';
export class TransactionService {
  constructor(
    private readonly externalTransactionDataValidator: ExternalTransactionDataValidatorPort,
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly readRawVehicleFileUseCase: ReadRawVehicleFileUseCase,
    private readonly mapRawVehicleToVehicleUseCase: MapRawVehicleToVehicleUseCase,
    private readonly queue: QueuePort,
    private logger: LoggerPort
  ) {}

  async processTransactionData(vehicleTransactionData: VehicleTransactionData) {
    const result = await this.externalTransactionDataValidator.validate(vehicleTransactionData);
    if (!result.isValid) {
      throw new ApplicationError(result.message);
    }
    const transaction = await this.createVehicleTransactionUseCase.execute(vehicleTransactionData);
    await this.queue.enqueue(transaction);
    return transaction;
  }
  async processVehicleDataFromFile(filePath: string) {
    await this.queue.clear();
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
