import { ResultAsync } from 'neverthrow';

import type {
  CreateTransactionInput,
  TransactionAction,
  VehicleTransaction,
} from '../../domain/entities/transaction.entity.js';
import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort
  ) {}

  async execute<A extends TransactionAction>(
    transactionData: CreateTransactionInput<A>
  ): Promise<VehicleTransaction<A>> {
    const currentDate = this.dateProvider.now();
    const signature = await this.dataSigner.sign(JSON.stringify(transactionData));
    return {
      ...transactionData,
      dataSignature: signature,
      timestamp: currentDate,
    };
  }
}
