import { describe, expect, it } from 'vitest'

import {
  incompleteVehicleFixture,
  invalidActionFixture,
  invalidSignatureFixture,
  invalidVinFixture,
  invalidYearFixture,
} from '../../../../../domain/fixtures/invalid-transaction.fixture.js'
import {
  createTransactionFixture,
  deleteTransactionFixture,
  updateTransactionFixture,
} from '../../../../../domain/fixtures/valid-transaction.fixture.js'
import { ZodValidator } from '../zod.validator.js'
import { vehicleTransactionSchema } from '../zod-transaction.schema.js'

describe('VehicleTransactionSchema', () => {
  const validator = new ZodValidator()

  describe('Valid transactions', () => {
    it('should validate a correct create transaction', () => {
      const result = validator.validate(vehicleTransactionSchema, createTransactionFixture)
      expect(result.isOk()).toBe(true)
    })

    it('should validate a correct update transaction', () => {
      const result = validator.validate(vehicleTransactionSchema, updateTransactionFixture)
      expect(result.isOk()).toBe(true)
    })

    it('should validate a correct delete transaction', () => {
      const result = validator.validate(vehicleTransactionSchema, deleteTransactionFixture)
      expect(result.isOk()).toBe(true)
    })
  })

  describe('Invalid transactions', () => {
    it('should reject an invalid action', () => {
      const result = validator.validate(vehicleTransactionSchema, invalidActionFixture)
      expect(result.isErr()).toBe(true)
    })

    it('should reject an invalid VIN', () => {
      const result = validator.validate(vehicleTransactionSchema, invalidVinFixture)
      expect(result.isErr()).toBe(true)
    })

    it('should reject missing required fields', () => {
      const result = validator.validate(vehicleTransactionSchema, incompleteVehicleFixture)
      expect(result.isErr()).toBe(true)
    })

    it('should reject invalid year', () => {
      const result = validator.validate(vehicleTransactionSchema, invalidYearFixture)
      expect(result.isErr()).toBe(true)
    })

    it('should reject invalid signature format', () => {
      const result = validator.validate(vehicleTransactionSchema, invalidSignatureFixture)
      expect(result.isErr()).toBe(true)
    })
  })
})
