import { ResultAsync } from 'neverthrow';

import type {
  VehicleTransaction,
  VehicleTransactionData,
} from '../../domain/entities/transaction.entity.js';
import type { DataSignerPort } from '../ports/data-signer.port.js';
import type { DateProviderPort } from '../ports/date-provider.port.js';

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort
  ) {}

  execute(transactionData: VehicleTransactionData) {
    return ResultAsync.combine([
      this.dateProvider.now(),
      this.dataSigner.sign(JSON.stringify(transactionData)),
    ]).map(
      ([timestamp, signature]) =>
        ({
          ...transactionData,
          dataSignature: signature,
          timestamp,
        }) as VehicleTransaction
    );
  }
}
