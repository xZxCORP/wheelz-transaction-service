import { CreateVehicleTransactionUseCase } from '../use-cases/create-vehicle-transaction.use-case.js'
import { EnqueueTransactionUseCase } from '../use-cases/enqueue-transaction.use-case.js'
import { ValidateTransactionDataUseCase } from '../use-cases/validate-transaction-data.use-case.js'

export class TransactionService {
  constructor(
    private readonly validateTransactionDataUseCase: ValidateTransactionDataUseCase,
    private readonly createVehicleTransactionUseCase: CreateVehicleTransactionUseCase,
    private readonly enqueueTransactionUseCase: EnqueueTransactionUseCase
  ) {}

  processTransactionData(data: unknown) {
    return this.validateTransactionDataUseCase
      .execute(data)
      .andThen((transactionData) => this.createVehicleTransactionUseCase.execute(transactionData))
      .andThen((transaction) => this.enqueueTransactionUseCase.execute(transaction))
  }
}
