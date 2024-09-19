import { z } from 'zod'

import { supportedSignAlgorithms } from '../../../../domain/entities/data-signature.entity.js'
import type {
  VehicleTransaction,
  VehicleTransactionData,
} from '../../../../domain/entities/transaction.entity.js'
import { createZodSchema } from './zod.validator.js'
import { vehicleZodSchema, vinZodSchema } from './zod-vehicle.schema.js'

const transactionSignatureZodSchema = z.object({
  signature: z.string(),
  signAlgorithm: z.enum(supportedSignAlgorithms),
})

const createVehicleTransactionDataZodSchema = vehicleZodSchema

const updateVehicleTransactionDataZodSchema = z.object({
  vin: vinZodSchema,
  changes: vehicleZodSchema.omit({ vin: true }).partial(),
})

const deleteVehicleTransactionDataZodSchema = z.object({
  vin: vinZodSchema,
})

const vehicleTransactionDataZodSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('create'),
    data: createVehicleTransactionDataZodSchema,
  }),
  z.object({
    action: z.literal('update'),
    data: updateVehicleTransactionDataZodSchema,
  }),
  z.object({
    action: z.literal('delete'),
    data: deleteVehicleTransactionDataZodSchema,
  }),
])

const vehicleTransactionZodSchema = z
  .object({
    timestamp: z.date(),
    dataSignature: transactionSignatureZodSchema,
  })
  .and(vehicleTransactionDataZodSchema)

export const vehicleTransactionDataSchema = createZodSchema<VehicleTransactionData>(
  vehicleTransactionDataZodSchema
)
export const vehicleTransactionSchema = createZodSchema<VehicleTransaction>(
  vehicleTransactionZodSchema
)
