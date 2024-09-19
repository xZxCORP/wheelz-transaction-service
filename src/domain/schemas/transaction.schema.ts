import { VehicleTransaction, VehicleTransactionData } from '../entities/transaction.entity.js'
import { Schema } from '../validation/schema.js'
export interface TransactionDataSchema extends Schema<VehicleTransactionData> {}
export interface TransactionSchema extends Schema<VehicleTransaction> {}
