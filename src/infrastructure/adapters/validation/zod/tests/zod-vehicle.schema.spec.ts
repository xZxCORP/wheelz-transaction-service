/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it } from 'vitest'

import { sampleVehicle } from '../../fixtures/base-vehicle.fixture.js'
import { ZodValidator } from '../zod.validator.js'
import { vehicleSchema } from '../zod-vehicle.schema.js'

describe('VehicleSchema', () => {
  const validator = new ZodValidator()

  it('should validate a correct vehicle', () => {
    const result = validator.validate(vehicleSchema, sampleVehicle)
    expect(result.isOk()).toBe(true)
  })

  it('should reject an invalid VIN', () => {
    const invalidVehicle = { ...sampleVehicle, vin: 'TOOSHORT' }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject an empty constructorName', () => {
    const invalidVehicle = { ...sampleVehicle, constructorName: '' }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject an empty model', () => {
    const invalidVehicle = { ...sampleVehicle, model: '' }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject a year before 1900', () => {
    const invalidVehicle = { ...sampleVehicle, year: 1899 }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject a year in the future', () => {
    const invalidVehicle = { ...sampleVehicle, year: new Date().getFullYear() + 2 }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject invalid risks structure', () => {
    const invalidVehicle = {
      ...sampleVehicle,
      risks: {
        exterior: ['minor_scratch'],
        mechanical: 'not_an_array' as any,
        generic: ['high_mileage'],
      },
    }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject invalid sinister data', () => {
    const invalidVehicle = {
      ...sampleVehicle,
      sinisters: [
        {
          ...sampleVehicle.sinisters[0],
          isWeekend: 'not_a_boolean' as any,
        },
      ],
    }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject invalid coordinates in sinister location', () => {
    const invalidVehicle = {
      ...sampleVehicle,
      sinisters: [
        {
          ...sampleVehicle.sinisters[0],
          location: {
            ...sampleVehicle.sinisters[0].location,
            coordinates: {
              latitude: 'not_a_number' as any,
              longitude: -74.006,
            },
          },
        },
      ],
    }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })

  it('should reject invalid issues structure', () => {
    const invalidVehicle = {
      ...sampleVehicle,
      issues: {
        exterior: [],
        mechanical: ['brake_wear'],
        generic: 42 as any,
      },
    }
    const result = validator.validate(vehicleSchema, invalidVehicle)
    expect(result.isErr()).toBe(true)
  })
})
