import { z } from 'zod'

import { Vehicle } from '../../../../domain/entities/vehicle.entity.js'
import { createZodSchema } from './zod.validator.js'
export const vinZodSchema = z.string().length(17)
const coordinatesZodSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const locationZodSchema = z.object({
  description: z.string(),
  coordinates: coordinatesZodSchema,
})

const sinisterZodSchema = z.object({
  date: z.coerce.date(),
  type: z.string(),
  severity: z.string(),
  primaryFactor: z.string(),
  injuryType: z.string(),
  collisionType: z.string(),
  isWeekend: z.boolean(),
  location: locationZodSchema,
})

const risksIssuesZodSchema = z.object({
  exterior: z.array(z.string()),
  mechanical: z.array(z.string()),
  generic: z.array(z.string()),
})

export const vehicleZodSchema = z.object({
  vin: vinZodSchema,
  constructor: z.string(),
  model: z.string(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  risks: risksIssuesZodSchema,
  sinisters: z.array(sinisterZodSchema),
  issues: risksIssuesZodSchema,
})

export const vehicleSchema = createZodSchema<Vehicle>(vehicleZodSchema)
