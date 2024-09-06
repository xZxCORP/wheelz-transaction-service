import { VehicleTransaction } from '../entities/transaction.entity.js'
import { Schema } from '../validation/schema.js'

export interface TransactionSchema extends Schema<VehicleTransaction> {}
