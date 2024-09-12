import z from 'zod'

import { Config, MAX_PORT_VALUE } from '../../../../domain/entities/config.entity.js'
import { createZodSchema } from './zod.validator.js'
const configZodSchema = z.object({
  logLevel: z.enum(['error', 'warn', 'info', 'debug']),
  transactionQueue: z.object({
    url: z.string(),
    queueName: z.string(),
  }),
  api: z.object({
    host: z.string(),
    port: z.coerce.number().min(0).max(MAX_PORT_VALUE),
  }),
})

export const configSchema = createZodSchema<Config>(configZodSchema)
