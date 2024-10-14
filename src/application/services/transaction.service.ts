import { type VehicleTransactionData } from '@zcorp/shared-typing-wheelz';

import { ApplicationError } from '../error.js';
import type { ExternalTransactionDataValidatorPort } from '../ports/external-transaction-data-validator.port.js';
import type { QueuePort } from '../ports/queue.port.js';
import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js';
export class TransactionService {
  constructor(
    private readonly externalTransactionDataValidator: ExternalTransactionDataValidatorPort,
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly queue: QueuePort
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
}
