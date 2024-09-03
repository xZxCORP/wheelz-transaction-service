import z from 'zod'

import { Config } from '../../../../domain/entities/config.entity.js'
import { createZodSchema } from './zod.validator.js'
const configZodSchema = z.object({
  logLevel: z.enum(['error', 'warn', 'info', 'debug']),
  notificationQueue: z.object({
    url: z.string(),
    queueName: z.string(),
  }),
  api: z.object({
    host: z.string(),
    port: z.coerce.number(),
  }),
})

export const configSchema = createZodSchema<Config>(configZodSchema)
