import { z } from 'zod'

import { VehicleTransaction } from '../../../../domain/entities/transaction.entity.js'
import { createZodSchema } from './zod.validator.js'
import { vehicleZodSchema, vinZodSchema } from './zod-vehicle.schema.js'

const transactionSignatureZodSchema = z.object({
  signature: z.string(),
  publicKey: z.string(),
})

const createVehicleTransactionDataZodSchema = z.object({
  action: z.literal('create'),
  vehicle: vehicleZodSchema,
})

const updateVehicleTransactionDataZodSchema = z.object({
  action: z.literal('update'),
  vin: vinZodSchema,
  changes: vehicleZodSchema.omit({ vin: true }).partial(),
})

const deleteVehicleTransactionDataZodSchema = z.object({
  action: z.literal('delete'),
  vin: vinZodSchema,
})

const vehicleTransactionDataZodSchema = z.discriminatedUnion('action', [
  createVehicleTransactionDataZodSchema,
  updateVehicleTransactionDataZodSchema,
  deleteVehicleTransactionDataZodSchema,
])

const vehicleTransactionZodSchema = z.object({
  timestamp: z.date(),
  data: vehicleTransactionDataZodSchema,
  signature: transactionSignatureZodSchema,
})
export const vehicleTransactionSchema = createZodSchema<VehicleTransaction>(
  vehicleTransactionZodSchema
)
