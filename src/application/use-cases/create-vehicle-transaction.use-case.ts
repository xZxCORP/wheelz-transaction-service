import type {
  QueueTransaction,
  VehicleTransaction,
  VehicleTransactionData,
} from '@zcorp/shared-typing-wheelz';

import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';
import type { IdGeneratorPort } from '../ports/id-generator.port.js';
import type { QueuePort } from '../ports/queue.port.js';

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly transactionRepository: TransactionRepository,
    private newQueue: QueuePort
  ) {}

  async execute(
    vehicleTransactionData: VehicleTransactionData,
    force: boolean = false
  ): Promise<VehicleTransaction> {
    const currentDate = this.dateProvider.now();
    const signature = await this.dataSigner.sign(
      JSON.stringify({
        action: vehicleTransactionData.action,
        data: vehicleTransactionData.data,
      })
    );
    const id = await this.idGenerator.generate();
    const transaction: VehicleTransaction = {
      ...vehicleTransactionData,
      id,
      dataSignature: signature,
      timestamp: currentDate,
      withAnomaly: force,
      status: 'pending',
    };
    await this.transactionRepository.save(transaction);
    const queueTransaction: QueueTransaction = {
      transactionId: id,
    };
    await this.newQueue.enqueue(queueTransaction);
    return transaction;
  }
}
