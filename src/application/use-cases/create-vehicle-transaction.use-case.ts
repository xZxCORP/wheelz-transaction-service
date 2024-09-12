import { ResultAsync } from 'neverthrow'

import {
  VehicleTransaction,
  VehicleTransactionData,
} from '../../domain/entities/transaction.entity.js'
import { DataSignerError } from '../errors/application.error.js'
import { DataSignerPort } from '../ports/data-signer.port.js'
import { DateProviderPort } from '../ports/date-provider.port.js'

export class CreateVehicleTransactionUseCase {
  constructor(
    private readonly dataSigner: DataSignerPort,
    private readonly dateProvider: DateProviderPort
  ) {}

  execute(
    transactionData: VehicleTransactionData
  ): ResultAsync<VehicleTransaction, DataSignerError> {
    return this.dataSigner.sign(JSON.stringify(transactionData)).map((signature) => ({
      dataSignature: signature,
      data: transactionData,
    }))
  }
}
