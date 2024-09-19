import { describe, expect, it } from 'vitest'

import { ZodValidator } from '../zod.validator.js'
import { configSchema } from '../zod-config.schema.js'

describe('ConfigSchema', () => {
  const validator = new ZodValidator()
  it('should validate a correct configuration', () => {
    const validConfig = {
      logLevel: 'info',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
      dataSigner: {
        signAlgorithm: 'RSA-SHA256',
        privateKey: 'privateKey',
      },
    }

    const result = validator.validate(configSchema, validConfig)
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value).toEqual(validConfig)
    }
  })

  it('should coerce port number from string', () => {
    const configWithStringPort = {
      logLevel: 'info',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: '3000',
      },
      dataSigner: {
        signAlgorithm: 'RSA-SHA256',
        privateKey: 'privateKey',
      },
    }

    const result = validator.validate(configSchema, configWithStringPort)
    expect(result.isOk()).toBe(true)
    if (result.isOk()) {
      expect(result.value.api.port).toBe(3000)
      expect(typeof result.value.api.port).toBe('number')
    }
  })

  it('should reject invalid log level', () => {
    const invalidConfig = {
      logLevel: 'invalid_level',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: 3000,
      },
      dataSigner: {
        name: 'RSA_SHA256',
        privateKey: 'privateKey',
      },
    }

    const result = validator.validate(configSchema, invalidConfig)
    expect(result.isErr()).toBe(true)
  })

  it('should reject missing required fields', () => {
    const incompleteConfig = {
      logLevel: 'info',
      api: {
        host: 'localhost',
        port: 3000,
      },
    }

    const result = validator.validate(configSchema, incompleteConfig)
    expect(result.isErr()).toBe(true)
  })

  it('should reject negative port number', () => {
    const configWithNegativePort = {
      logLevel: 'info',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: -3000,
      },
      dataSigner: {
        name: 'RSA_SHA256',
        privateKey: 'privateKey',
      },
    }

    const result = validator.validate(configSchema, configWithNegativePort)
    expect(result.isErr()).toBe(true)
  })
  it('should reject invalid data signer hash algorithm', () => {
    const configWithInvalidDataSignerAlgorithm = {
      logLevel: 'info',
      transactionQueue: {
        url: 'amqp://localhost',
        queueName: 'transactions',
      },
      api: {
        host: 'localhost',
        port: -3000,
      },
      dataSigner: {
        signAlgorithm: 'dazdazdaz',
        privateKey: 'privateKey',
      },
    }

    const result = validator.validate(configSchema, configWithInvalidDataSignerAlgorithm)
    expect(result.isErr()).toBe(true)
  })
})
